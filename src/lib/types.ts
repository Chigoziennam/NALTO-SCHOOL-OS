/** Shapes mirror the Supabase views in supabase/schema.sql — the demo data
 *  and live queries are interchangeable. */

export interface DashboardTotals {
  active_students: number
  paid_students: number
  part_paid_students: number
  owing_students: number
  total_billed_kobo: number
  total_collected_kobo: number
  total_outstanding_kobo: number
  collection_rate_pct: number
}

export interface ClassSummary {
  class_name: string
  level_name: string
  student_count: number
  paid_count: number
  part_paid_count: number
  owing_count: number
  total_billed_kobo: number
  total_paid_kobo: number
  total_outstanding_kobo: number
}

export type FeeStatus = 'paid' | 'part_paid' | 'owing'

export interface ChildBalance {
  student_id: string
  admission_number: string
  student_name: string
  class_name: string
  level_name: string
  invoice_id: string
  billed_kobo: number
  paid_kobo: number
  balance_kobo: number
  invoice_status: string
}

export interface InvoiceLine {
  id: string
  description: string
  amount_kobo: number
}

export interface InvoiceDetail {
  id: string
  invoice_number: string
  student_name: string
  admission_number: string
  class_name: string
  issued_at: string
  due_date: string
  items: InvoiceLine[]
  total_kobo: number
  discount_kobo: number
  paid_kobo: number
  balance_kobo: number
  status: string
}

export interface PaymentRow {
  id: string
  student_name: string
  guardian_name: string
  amount_kobo: number
  channel: string
  paid_at: string
  description?: string
  receipt_number?: string
}

export interface OwingStudent {
  student_name: string
  class_name: string
  balance_kobo: number
  guardian_name: string
  guardian_phone: string
}

export interface Guardian {
  id: string
  full_name: string
  phone: string
  email: string
}

export interface ClassOption {
  id: string
  name: string
}
