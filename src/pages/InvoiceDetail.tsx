import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Download } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import { SCHOOL } from '../lib/school'
import { formatDate, formatKobo } from '../lib/format'
import { DEMO_GUARDIAN } from '../lib/demoData'
import { useGuardian, useInvoice } from '../hooks/useData'
import { Crest, DemoModePill, PoweredByNalto } from '../components/Brand'
import { StatusPill, statusFromBalance } from '../components/StatusPill'
import { PageTransition } from '../components/PageTransition'
import { usePaystack } from '../components/usePaystack'

export default function InvoiceDetail() {
  const { invoiceId = '' } = useParams()
  const { data: invoice, isLoading } = useInvoice(invoiceId)
  const { data: guardian } = useGuardian()
  const { pay, overlay } = usePaystack()
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadPdf = () => {
    if (!cardRef.current || !invoice) return
    html2pdf()
      .set({
        margin: 8,
        filename: `ARCH-invoice-${invoice.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(cardRef.current)
      .save()
  }

  return (
    <PageTransition>
      <DemoModePill />
      {overlay}
      <div className="min-h-screen bg-paper-50 pb-20">
        <div className="border-b border-ink-200 bg-navy-950">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link to="/parent" className="flex items-center gap-2 text-sm text-navy-100 hover:text-gold-300">
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
            <div className="flex items-center gap-2.5">
              <Crest className="h-8 w-8" />
              <span className="hidden font-display text-white sm:block">{SCHOOL.name}</span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-4xl px-4 sm:px-6">
          {isLoading || !invoice ? (
            <div className="card mt-10 space-y-4">
              {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-8 w-full" />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              {/* Invoice card (captured by html2pdf) */}
              <div ref={cardRef} className="print-page relative mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-paper-0 p-8 shadow-card sm:p-12">
                {/* crest watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
                  <Crest className="h-[420px] w-[420px]" />
                </div>

                <div className="relative">
                  <div className="flex flex-wrap items-start justify-between gap-6 border-b border-ink-200 pb-8">
                    <div className="flex items-center gap-4">
                      <Crest className="h-14 w-14" />
                      <div>
                        <div className="font-display text-2xl text-navy-950">{SCHOOL.name}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700">{SCHOOL.motto}</div>
                        <div className="mt-1 text-xs text-ink-400">{SCHOOL.address}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl text-navy-950">Invoice</div>
                      <div className="mt-1 font-mono text-sm text-ink-500">{invoice.invoice_number}</div>
                      <div className="mt-2"><StatusPill status={statusFromBalance(invoice.paid_kobo, invoice.balance_kobo)} /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 py-7 text-sm sm:grid-cols-4">
                    {[
                      ['Student', invoice.student_name],
                      ['Class', invoice.class_name],
                      ['Issued', formatDate(invoice.issued_at)],
                      ['Due Date', formatDate(invoice.due_date)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="kpi-label">{label}</div>
                        <div className="mt-1 font-medium text-navy-950">{value}</div>
                      </div>
                    ))}
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                        <th className="py-3 pr-4 font-semibold">Fee Item</th>
                        <th className="py-3 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-ink-100 last:border-0">
                          <td className="py-3.5 pr-4 text-navy-950">{item.description}</td>
                          <td className="py-3.5 text-right font-mono">{formatKobo(item.amount_kobo)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ml-auto mt-7 max-w-xs space-y-2.5 text-sm">
                    <div className="flex justify-between"><span className="text-ink-500">Subtotal</span><span className="font-mono">{formatKobo(invoice.total_kobo)}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Discount</span><span className="font-mono">{invoice.discount_kobo > 0 ? '−' + formatKobo(invoice.discount_kobo) : '—'}</span></div>
                    <div className="flex justify-between border-t border-ink-200 pt-2.5 font-semibold"><span>Total Due</span><span className="font-mono">{formatKobo(invoice.total_kobo - invoice.discount_kobo)}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Paid</span><span className="font-mono text-status-paid-deep">{formatKobo(invoice.paid_kobo)}</span></div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Balance</span>
                      <span className={`font-mono ${invoice.balance_kobo > 0 ? 'text-status-owing' : 'text-status-paid-deep'}`}>{formatKobo(invoice.balance_kobo)}</span>
                    </div>
                  </div>

                  <div className="mt-9 flex items-center justify-between border-t border-ink-200 pt-5 text-xs text-ink-400">
                    <span>{SCHOOL.currentSession} Session · {SCHOOL.currentTerm}</span>
                    <PoweredByNalto dark />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button onClick={downloadPdf} className="btn-secondary">
                  <Download size={16} /> Download Invoice PDF
                </button>
                {invoice.balance_kobo > 0 && (
                  <button
                    onClick={() =>
                      pay({
                        amountKobo: invoice.balance_kobo,
                        email: guardian?.email ?? DEMO_GUARDIAN.email,
                        studentId: invoice.id,
                        invoiceId: invoice.id,
                        guardianId: guardian?.id ?? DEMO_GUARDIAN.id,
                        studentName: invoice.student_name,
                      })
                    }
                    className="btn-accent animate-glow-pulse"
                  >
                    <CreditCard size={16} /> Pay Balance — {formatKobo(invoice.balance_kobo)}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}
