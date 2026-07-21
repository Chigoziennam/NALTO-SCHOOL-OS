import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import PaystackPop from '@paystack/inline-js'
import html2pdf from 'html2pdf.js'
import { useQueryClient } from '@tanstack/react-query'
import { pingPaymentWebhook } from '../lib/api'
import { SCHOOL } from '../lib/school'
import { formatKobo, formatNaira } from '../lib/format'

export interface PayArgs {
  amountKobo: number
  email: string
  studentName: string
  /** e.g. "SS 2" */
  className?: string
  /** e.g. "First Term" */
  term?: string
  /** What the money is for — "School Fees", "Acceptance Fee", "Uniforms". */
  purpose?: string
  /** Itemised breakdown for the receipt (multi-student / uniform carts). */
  lineItems?: { label: string; amountNaira: number }[]
  /** Optional linkage (production) — ignored in the self-serve demo. */
  studentId?: string
  invoiceId?: string
  guardianId?: string
}

interface Success extends PayArgs {
  reference: string
  paidAt: Date
}

/**
 * Paystack inline checkout + full-screen success overlay with a real,
 * downloadable PDF receipt. With no public key configured it falls back to a
 * simulated success so the flow always completes; with the live key it takes a
 * real card / transfer / USSD payment through Paystack.
 */
export function usePaystack() {
  const [success, setSuccess] = useState<Success | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const pay = useCallback(
    (args: PayArgs) => {
      const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined
      const onDone = async (reference: string) => {
        await pingPaymentWebhook({
          event: 'charge.success',
          reference,
          amount_kobo: args.amountKobo,
          purpose: args.purpose ?? 'School Fees',
          student_name: args.studentName,
          class_name: args.className,
          term: args.term,
          student_id: args.studentId,
          invoice_id: args.invoiceId,
          guardian_id: args.guardianId,
        })
        queryClient.invalidateQueries({ queryKey: ['children'] })
        queryClient.invalidateQueries({ queryKey: ['invoice'] })
        queryClient.invalidateQueries({ queryKey: ['parent-history'] })
        setSuccess({ ...args, reference, paidAt: new Date() })
      }

      if (!key) {
        window.setTimeout(() => onDone('DEMO-' + Date.now()), 900)
        return
      }
      const popup = new PaystackPop()
      popup.newTransaction({
        key,
        email: args.email,
        amount: args.amountKobo, // Paystack expects kobo
        currency: 'NGN',
        metadata: {
          purpose: args.purpose ?? 'School Fees',
          student_name: args.studentName,
          class_name: args.className,
          term: args.term,
        },
        onSuccess: (tx: { reference: string }) => onDone(tx.reference),
      })
    },
    [queryClient],
  )

  const downloadReceipt = () => {
    if (!receiptRef.current || !success) return
    html2pdf()
      .set({
        margin: 0,
        filename: `ARCH-receipt-${success.reference}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: [148, 180], orientation: 'portrait' },
      })
      .from(receiptRef.current)
      .save()
  }

  const overlay = (
    <AnimatePresence>
      {success && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSuccess(null)}
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-paper-0 shadow-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSuccess(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/70 p-1.5 text-ink-500 backdrop-blur hover:bg-paper-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Printable receipt */}
            <div ref={receiptRef} className="bg-paper-0">
              <div className="bg-gradient-to-br from-navy-900 to-navy-950 px-7 pb-8 pt-9 text-center text-white">
                <motion.svg viewBox="0 0 72 72" className="mx-auto h-16 w-16">
                  <motion.circle
                    cx="36" cy="36" r="32" fill="none" stroke="#e6c780" strokeWidth="4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                  <motion.path
                    d="M22 37 L32 47 L51 27" fill="none" stroke="#e6c780" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
                  />
                </motion.svg>
                <h3 className="mt-4 font-display text-2xl">Payment Successful</h3>
                <p className="mt-1 text-sm text-navy-100">Official receipt · {SCHOOL.name}</p>
              </div>

              <div className="px-7 py-6">
                <div className="text-center">
                  <div className="kpi-label">Amount Paid</div>
                  <div className="mt-1 font-mono text-3xl font-semibold text-status-paid-deep">
                    {formatKobo(success.amountKobo)}
                  </div>
                </div>
                {success.lineItems && success.lineItems.length > 0 && (
                  <div className="mt-5 border-t border-dashed border-ink-200 pt-4">
                    <div className="kpi-label mb-2">Breakdown</div>
                    <div className="space-y-1.5 text-sm">
                      {success.lineItems.map((li, i) => (
                        <div key={i} className="flex items-start justify-between gap-4">
                          <span className="text-ink-500">{li.label}</span>
                          <span className="whitespace-nowrap font-mono text-navy-950">{formatNaira(li.amountNaira)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <dl className="mt-5 space-y-3 border-t border-dashed border-ink-200 pt-4 text-sm">
                  <Row label="Transaction ID" value={success.reference} mono />
                  {!success.lineItems?.length && <Row label="Student" value={success.studentName} />}
                  {!success.lineItems?.length && success.className && <Row label="Class" value={success.className} />}
                  <Row label="For" value={`${success.purpose ?? 'School Fees'}${success.term ? ' · ' + success.term : ''}`} />
                  <Row label="Session" value={SCHOOL.currentSession} />
                  <Row label="Date" value={success.paidAt.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })} />
                  <Row label="Method" value="Paystack (Card / Transfer / USSD)" />
                </dl>
                <div className="mt-5 border-t border-dashed border-ink-200 pt-4 text-center text-[11px] leading-relaxed text-ink-400">
                  Keep this receipt as proof of payment. Powered by Nalto.
                </div>
              </div>
            </div>

            {/* Actions (not part of the PDF) */}
            <div className="flex gap-3 border-t border-ink-100 bg-paper-50 px-7 py-4">
              <button onClick={() => setSuccess(null)} className="btn-secondary flex-1 py-2.5">Done</button>
              <button onClick={downloadReceipt} className="btn-primary flex-1 py-2.5">
                <Download size={16} /> Receipt
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return { pay, overlay }
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex-shrink-0 text-ink-400">{label}</dt>
      <dd className={`text-right font-medium text-navy-950 ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  )
}
