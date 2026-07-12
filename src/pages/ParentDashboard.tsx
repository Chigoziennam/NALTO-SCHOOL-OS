import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Download, FileText, Shirt, SlidersHorizontal, User } from 'lucide-react'
import { PayAmountModal } from '../components/PayAmountModal'
import { SCHOOL } from '../lib/school'
import { formatDate, formatKobo } from '../lib/format'
import { DEMO_GUARDIAN } from '../lib/demoData'
import { useChildren, useGuardian, useParentHistory } from '../hooks/useData'
import { Crest, DemoModePill, PoweredByNalto } from '../components/Brand'
import { StatusPill, statusFromBalance } from '../components/StatusPill'
import { PageTransition, inViewRise } from '../components/PageTransition'
import { usePaystack } from '../components/usePaystack'
import { AngelTouch } from '../components/AngelTouch'
import { DashboardBackdrop } from '../components/DashboardBackdrop'

const CHANNEL_LABEL: Record<string, string> = {
  paystack: 'Card (Paystack)',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  pos: 'POS',
  cheque: 'Cheque',
}

function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <div className="skeleton h-12 w-12 rounded-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-9 w-full" />
    </div>
  )
}

export default function ParentDashboard() {
  const { data: guardian } = useGuardian()
  const { data: children, isLoading } = useChildren()
  const { data: history, isLoading: historyLoading } = useParentHistory()
  const { pay, overlay } = usePaystack()
  const [partPayOpen, setPartPayOpen] = useState(false)

  const owingChild = children?.find((c) => c.balance_kobo > 0)

  return (
    <PageTransition>
      <AngelTouch>
      <DemoModePill />
      {overlay}
      <DashboardBackdrop variant="parent" />
      <div className="relative z-10 min-h-screen pb-20">
        {/* Top bar */}
        <div className="border-b border-ink-200 bg-navy-950">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-navy-100 hover:text-gold-300">
              <ArrowLeft size={16} /> Back to site
            </Link>
            <div className="flex items-center gap-2.5">
              <Crest className="h-8 w-8" />
              <span className="hidden font-display text-white sm:block">{SCHOOL.name}</span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-5xl px-6">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-between pb-8 pt-10"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl">Welcome, {guardian?.full_name ?? '…'}</h1>
              <p className="mt-2 text-ink-500">
                {SCHOOL.currentSession} Session · {SCHOOL.currentTerm} — here&rsquo;s where your children stand.
              </p>
            </div>
            <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-semibold text-white sm:flex">
              <User size={20} />
            </div>
          </motion.div>

          {/* Children cards */}
          <section className="grid gap-5 sm:grid-cols-2">
            {isLoading && (<><SkeletonCard /><SkeletonCard /></>)}
            {children?.map((child, i) => {
              const status = statusFromBalance(child.paid_kobo, child.balance_kobo)
              return (
                <motion.div
                  key={child.student_id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 + i * 0.12 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                  className="card"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-13 w-13 h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-navy-950 font-display text-lg text-gold-300">
                      {child.student_name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-navy-950">{child.student_name}</div>
                      <div className="mt-0.5 text-sm text-ink-500">{child.class_name} · {child.admission_number}</div>
                    </div>
                    <StatusPill status={status} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4 text-sm">
                    <div>
                      <div className="kpi-label">Term Fees</div>
                      <div className="mt-1 font-mono text-navy-950">{formatKobo(child.billed_kobo)}</div>
                    </div>
                    <div>
                      <div className="kpi-label">Balance</div>
                      <div className={`mt-1 font-mono ${child.balance_kobo > 0 ? 'text-status-owing-deep' : 'text-status-paid-deep'}`}>
                        {child.balance_kobo > 0 ? formatKobo(child.balance_kobo) : 'Cleared'}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/parent/invoice/${child.invoice_id}`}
                    className={`${child.balance_kobo > 0 ? 'btn-accent' : 'btn-secondary'} mt-5 w-full`}
                  >
                    <FileText size={15} />
                    {child.balance_kobo > 0 ? 'View Invoice & Pay' : 'View Invoice'}
                  </Link>
                </motion.div>
              )
            })}
          </section>

          {/* Outstanding hero card */}
          {owingChild && (
            <motion.section
              {...inViewRise}
              className="mt-8 overflow-hidden rounded-2xl p-8 text-white shadow-card"
              style={{
                background:
                  'radial-gradient(600px circle at 100% 0%, rgba(201,154,62,0.22), transparent 60%), linear-gradient(135deg, #163356, #0a1830)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-300">
                    Outstanding — {owingChild.student_name} ({owingChild.class_name})
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-8">
                    {[
                      ['Total Due', owingChild.billed_kobo],
                      ['Amount Paid', owingChild.paid_kobo],
                      ['Balance', owingChild.balance_kobo],
                    ].map(([label, kobo]) => (
                      <div key={label as string}>
                        <div className="text-[11px] uppercase tracking-wider text-navy-100">{label}</div>
                        <div className="mt-1 font-mono text-xl sm:text-2xl">{formatKobo(kobo as number)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => setPartPayOpen(true)} className="btn-ghost">
                    <SlidersHorizontal size={16} /> Pay in Part
                  </button>
                  <button
                    onClick={() =>
                      pay({
                        amountKobo: owingChild.balance_kobo,
                        email: guardian?.email ?? DEMO_GUARDIAN.email,
                        studentId: owingChild.student_id,
                        invoiceId: owingChild.invoice_id,
                        guardianId: guardian?.id ?? DEMO_GUARDIAN.id,
                        studentName: owingChild.student_name,
                      })
                    }
                    className="btn-accent animate-glow-pulse"
                  >
                    <CreditCard size={17} /> Pay Full
                  </button>
                </div>
              </div>
              <PayAmountModal
                open={partPayOpen}
                onClose={() => setPartPayOpen(false)}
                balanceKobo={owingChild.balance_kobo}
                studentName={owingChild.student_name}
                onPay={(amountKobo) =>
                  pay({
                    amountKobo,
                    email: guardian?.email ?? DEMO_GUARDIAN.email,
                    studentId: owingChild.student_id,
                    invoiceId: owingChild.invoice_id,
                    guardianId: guardian?.id ?? DEMO_GUARDIAN.id,
                    studentName: owingChild.student_name,
                  })
                }
              />
            </motion.section>
          )}

          {/* Uniform shop banner */}
          <motion.section {...inViewRise} className="mt-8">
            <Link
              to="/parent/uniforms"
              className="card group flex items-center gap-5 border-gold-500/30 transition-all hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950 shadow-gold-glow transition-transform group-hover:scale-110">
                <Shirt size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-navy-950">Uniform Shop</div>
                <div className="text-sm text-ink-500">Order official uniforms — pick a size, pay online, collect at school.</div>
              </div>
              <span className="hidden text-sm font-semibold text-gold-700 group-hover:underline sm:block">Shop now →</span>
            </Link>
          </motion.section>

          {/* Payment history */}
          <motion.section {...inViewRise} className="mt-10">
            <h2 className="mb-4 text-2xl">Payment History</h2>
            <div className="card overflow-x-auto p-0">
              {historyLoading ? (
                <div className="space-y-3 p-6">
                  {[0, 1, 2].map((i) => <div key={i} className="skeleton h-10 w-full" />)}
                </div>
              ) : (
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                      <th className="px-5 py-3.5 font-semibold">Date</th>
                      <th className="px-5 py-3.5 font-semibold">Description</th>
                      <th className="px-5 py-3.5 text-right font-semibold">Amount</th>
                      <th className="px-5 py-3.5 text-right font-semibold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history?.map((row) => (
                      <tr key={row.id} className="border-b border-ink-100 last:border-0 hover:bg-paper-50">
                        <td className="whitespace-nowrap px-5 py-4">{formatDate(row.paid_at)}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-navy-950">{row.description}</div>
                          <div className="text-xs text-ink-400">{CHANNEL_LABEL[row.channel] ?? row.channel}</div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-mono text-navy-950">{formatKobo(row.amount_kobo)}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-700">
                            <Download size={14} /> {row.receipt_number}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Payments are processed securely via Paystack. Official receipts are emailed automatically.
            </p>
          </motion.section>

          <div className="mt-14 text-center"><PoweredByNalto dark /></div>
        </main>
      </div>
      </AngelTouch>
    </PageTransition>
  )
}
