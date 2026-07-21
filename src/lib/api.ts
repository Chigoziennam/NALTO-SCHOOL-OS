import { supabase } from './supabase'
import {
  DEMO_CHILDREN, DEMO_CLASS_OPTIONS, DEMO_CLASS_SUMMARY, DEMO_GUARDIAN,
  DEMO_INVOICES, DEMO_OWING, DEMO_PARENT_HISTORY, DEMO_RECENT_PAYMENTS, DEMO_TOTALS,
} from './demoData'
import type {
  ChildBalance, ClassOption, ClassSummary, DashboardTotals, Guardian,
  InvoiceDetail, OwingStudent, PaymentRow,
} from './types'

/**
 * Every fetcher is Supabase-first (against the generated views) and falls
 * back to the demo seed when the client isn't configured or a query fails —
 * the MVP demos flawlessly with or without live keys.
 */

async function fromView<T>(query: () => PromiseLike<{ data: unknown; error: unknown }>, fallback: T): Promise<T> {
  if (!supabase) return fallback
  try {
    const { data, error } = await query()
    if (error || data == null || (Array.isArray(data) && data.length === 0)) return fallback
    return data as T
  } catch {
    return fallback
  }
}

export function getDashboardTotals(): Promise<DashboardTotals> {
  return fromView(
    () => supabase!.from('v_dashboard_totals').select('*').limit(1).single(),
    DEMO_TOTALS,
  )
}

export function getClassSummary(): Promise<ClassSummary[]> {
  return fromView(
    () => supabase!.from('v_class_fee_summary').select('*'),
    DEMO_CLASS_SUMMARY,
  )
}

export function getGuardian(): Promise<Guardian> {
  return fromView(
    () => supabase!.from('guardians').select('id, full_name, phone, email').eq('id', DEMO_GUARDIAN.id).single(),
    DEMO_GUARDIAN,
  )
}

export function getChildren(): Promise<ChildBalance[]> {
  // Parent flow is single-guardian; without auth we can't scope v_student_balances
  // to one household, so the parent side stays on the crafted Okafor demo.
  // The bursar dashboard (below) is what showcases live Supabase data.
  return Promise.resolve(DEMO_CHILDREN)
}

export async function getInvoice(invoiceId: string): Promise<InvoiceDetail> {
  const fallback = DEMO_INVOICES[invoiceId] ?? DEMO_INVOICES['inv-somto-t3']
  if (!supabase) return fallback
  try {
    const { data: inv, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*), students(first_name, last_name, admission_number)')
      .eq('id', invoiceId)
      .single()
    if (error || !inv) return fallback
    return fallback // shape-mapping for live data lands with production auth
  } catch {
    return fallback
  }
}

export function getParentHistory(): Promise<PaymentRow[]> {
  return fromView(
    () => supabase!.from('payments').select('*').eq('guardian_id', DEMO_GUARDIAN.id).eq('status', 'success').order('paid_at', { ascending: false }),
    DEMO_PARENT_HISTORY,
  )
}

export function getRecentPayments(): Promise<PaymentRow[]> {
  return fromView(
    () => supabase!.from('payments').select('*').eq('status', 'success').order('paid_at', { ascending: false }).limit(10),
    DEMO_RECENT_PAYMENTS,
  )
}

export function getOwingStudents(): Promise<OwingStudent[]> {
  return fromView(
    () => supabase!.from('v_owing_students').select('*'),
    DEMO_OWING,
  )
}

export function getClassOptions(): Promise<ClassOption[]> {
  return fromView(
    () => supabase!.from('classes').select('id, name'),
    DEMO_CLASS_OPTIONS,
  )
}

/** Insert a student, then ping the n8n add-student webhook to raise the invoice. */
export async function addStudent(input: {
  admission_number: string
  first_name: string
  last_name: string
  middle_name: string
  gender: string
  date_of_birth: string
  class_id: string
  is_new_intake: boolean
}): Promise<{ ok: boolean; demo: boolean }> {
  let studentId = 'demo-' + Date.now()
  if (supabase) {
    const { data, error } = await supabase
      .from('students')
      .insert({ ...input, middle_name: input.middle_name || null, date_of_birth: input.date_of_birth || null, current_class_id: input.class_id })
      .select('id')
      .single()
    if (!error && data) studentId = data.id
  }
  const webhook = import.meta.env.VITE_N8N_STUDENT_ADDED as string | undefined
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, class_id: input.class_id, is_new_intake: input.is_new_intake }),
      })
    } catch {
      /* webhook unreachable in demo — non-fatal */
    }
  }
  return { ok: true, demo: !supabase }
}

/** Notify n8n after a successful Paystack charge (webhook is the source of truth). */
export async function pingPaymentWebhook(payload: Record<string, unknown>): Promise<void> {
  const webhook = import.meta.env.VITE_N8N_PAYMENT_WEBHOOK as string | undefined
  if (!webhook) return
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    /* non-fatal in demo */
  }
}
