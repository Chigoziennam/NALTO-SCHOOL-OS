import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Banknote, FileBarChart2, UserPlus } from 'lucide-react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { SCHOOL } from '../lib/school'
import { formatKobo, formatTime, koboToNaira } from '../lib/format'
import type { PaymentRow } from '../lib/types'
import { useClassSummary, useDashboardTotals, useRecentPayments } from '../hooks/useData'
import { CountUp } from '../components/CountUp'
import { Crest, DemoModePill, PoweredByNalto } from '../components/Brand'
import { PageTransition, inViewRise } from '../components/PageTransition'
import { AddStudentModal } from '../components/AddStudentModal'
import { RecordPaymentModal } from '../components/RecordPaymentModal'
import { AngelTouch } from '../components/AngelTouch'
import { DashboardBackdrop } from '../components/DashboardBackdrop'

const STATUS_COLORS = { paid: '#1e8e5a', part: '#c77f1b', owing: '#c4362b' }

const CHANNEL_LABEL: Record<string, string> = {
  paystack: 'Paystack', bank_transfer: 'Transfer', cash: 'Cash', pos: 'POS', cheque: 'Cheque',
}

function KpiCard({ label, valueNaira, suffix, tone, delay, isPct }: {
  label: string
  valueNaira: number
  suffix?: string
  tone?: 'green' | 'red' | 'amber' | 'navy'
  delay: number
  isPct?: boolean
}) {
  const color =
    tone === 'green' ? 'text-status-paid-deep'
    : tone === 'red' ? 'text-status-owing-deep'
    : tone === 'amber' ? 'text-status-partial-deep'
    : 'text-navy-950'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      className="card min-w-0"
    >
      <div className="kpi-label truncate">{label}</div>
      <div className={`mt-2 truncate font-mono text-2xl font-semibold sm:text-3xl ${color}`}>
        <CountUp
          onMount
          value={valueNaira}
          format={(v) => (isPct ? v.toFixed(0) + (suffix ?? '') : '₦' + v.toLocaleString('en-NG'))}
        />
        {isPct && null}
      </div>
    </motion.div>
  )
}

function PaymentsFeed() {
  const { data: payments } = useRecentPayments()
  const seenIds = useRef<Set<string>>(new Set())
  const [newIds, setNewIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!payments) return
    if (seenIds.current.size === 0) {
      payments.forEach((p) => seenIds.current.add(p.id))
      return
    }
    const fresh = payments.filter((p) => !seenIds.current.has(p.id)).map((p) => p.id)
    if (fresh.length) {
      payments.forEach((p) => seenIds.current.add(p.id))
      setNewIds(new Set(fresh))
      const t = setTimeout(() => setNewIds(new Set()), 2000)
      return () => clearTimeout(t)
    }
  }, [payments])

  return (
    <motion.div {...inViewRise} className="card p-0">
      <div className="border-b border-ink-100 px-6 py-4 text-sm font-semibold text-ink-500">
        Recent Payments <span className="ml-2 text-xs font-normal text-ink-400">refreshes every 30s</span>
      </div>
      <div className="divide-y divide-ink-100">
        {payments?.map((p: PaymentRow) => (
          <div key={p.id} className={`flex items-center gap-4 px-6 py-3.5 ${newIds.has(p.id) ? 'flash-new' : ''}`}>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-gold-300">
              {p.student_name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-navy-950">{p.student_name}</div>
              <div className="truncate text-xs text-ink-400">{p.guardian_name} · {CHANNEL_LABEL[p.channel] ?? p.channel}</div>
            </div>
            <div className="font-mono text-sm text-status-paid-deep">+{formatKobo(p.amount_kobo)}</div>
            <div className="w-14 text-right text-xs text-ink-400">{formatTime(p.paid_at)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function BursarDashboard() {
  const { data: totals } = useDashboardTotals()
  const { data: classes } = useClassSummary()
  const [addOpen, setAddOpen] = useState(false)
  const [recordOpen, setRecordOpen] = useState(false)

  const rate = totals?.collection_rate_pct ?? 0
  const donutData = totals
    ? [
        { name: `${totals.paid_students} Paid`, value: totals.paid_students, color: STATUS_COLORS.paid },
        { name: `${totals.part_paid_students} Part-paid`, value: totals.part_paid_students, color: STATUS_COLORS.part },
        { name: `${totals.owing_students} Owing`, value: totals.owing_students, color: STATUS_COLORS.owing },
      ]
    : []

  return (
    <PageTransition>
      <AngelTouch>
      <DemoModePill />
      <DashboardBackdrop variant="bursar" />
      <div className="relative z-10 min-h-screen pb-20">
        {/* Header */}
        <div className="border-b border-ink-200 bg-navy-950">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="mr-2 text-navy-100 hover:text-gold-300" aria-label="Back to site"><ArrowLeft size={18} /></Link>
              <Crest className="h-9 w-9" />
              <div>
                <div className="font-display text-lg text-white">Bursar Dashboard</div>
                <div className="text-xs text-navy-100">{SCHOOL.currentSession} · {SCHOOL.currentTerm}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-navy-100 md:block">
                {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <Link to="/bursar/report" className="btn-accent px-5 py-2.5 text-xs">
                <FileBarChart2 size={15} /> Export Report
              </Link>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          {/* KPI cards */}
          <section className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Billed" valueNaira={totals ? koboToNaira(totals.total_billed_kobo) : 0} delay={0} />
            <KpiCard label="Total Collected" valueNaira={totals ? koboToNaira(totals.total_collected_kobo) : 0} tone="green" delay={0.1} />
            <KpiCard label="Total Outstanding" valueNaira={totals ? koboToNaira(totals.total_outstanding_kobo) : 0} tone="red" delay={0.2} />
            <KpiCard label="Collection Rate" valueNaira={rate} suffix="%" isPct tone={rate >= 80 ? 'green' : 'amber'} delay={0.3} />
          </section>

          {/* Quick actions */}
          <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button onClick={() => setAddOpen(true)} className="btn-primary w-full sm:w-auto"><UserPlus size={16} /> Add Student</button>
            <button onClick={() => setRecordOpen(true)} className="btn-secondary w-full sm:w-auto"><Banknote size={16} /> Record Cash/POS Payment</button>
          </section>

          {/* Donut + payments feed */}
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.35fr]">
            <motion.div {...inViewRise} className="card">
              <div className="mb-2 text-sm font-semibold text-ink-500">Students by fee status</div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="85%"
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    >
                      {donutData.map((d) => <Cell key={d.name} fill={d.color} stroke="none" />)}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} students`]} />
                    <Legend iconType="circle" iconSize={9} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <PaymentsFeed />
          </section>

          {/* Class breakdown */}
          <motion.section {...inViewRise} className="mt-8">
            <h2 className="mb-4 text-2xl">Class Breakdown</h2>
            <div className="card max-h-[520px] overflow-auto p-0">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="sticky top-0 z-10 bg-paper-0 shadow-[0_1px_0_rgba(217,210,195,1)]">
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-3.5 font-semibold">Class</th>
                    <th className="px-3 py-3.5 text-right font-semibold">Students</th>
                    <th className="px-3 py-3.5 text-right font-semibold">Paid</th>
                    <th className="px-3 py-3.5 text-right font-semibold">Part-paid</th>
                    <th className="px-3 py-3.5 text-right font-semibold">Owing</th>
                    <th className="px-3 py-3.5 text-right font-semibold">Billed</th>
                    <th className="px-3 py-3.5 text-right font-semibold">Collected</th>
                    <th className="px-5 py-3.5 text-right font-semibold">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {classes?.map((c, i) => (
                    <tr key={c.class_name} className={`border-t border-ink-100 ${i % 2 === 1 ? 'bg-paper-50/70' : ''}`}>
                      <td className="px-5 py-3 font-medium text-navy-950">{c.class_name}</td>
                      <td className="px-3 py-3 text-right font-mono">{c.student_count}</td>
                      <td className="px-3 py-3 text-right font-mono text-status-paid-deep">{c.paid_count}</td>
                      <td className="px-3 py-3 text-right font-mono text-status-partial-deep">{c.part_paid_count}</td>
                      <td className="px-3 py-3 text-right font-mono text-status-owing-deep">{c.owing_count}</td>
                      <td className="px-3 py-3 text-right font-mono">{formatKobo(c.total_billed_kobo)}</td>
                      <td className="px-3 py-3 text-right font-mono">{formatKobo(c.total_paid_kobo)}</td>
                      <td className="px-5 py-3 text-right font-mono text-status-owing-deep">{formatKobo(c.total_outstanding_kobo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          <div className="mt-14 text-center"><PoweredByNalto dark /></div>
        </main>
      </div>

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
      <RecordPaymentModal open={recordOpen} onClose={() => setRecordOpen(false)} />
      </AngelTouch>
    </PageTransition>
  )
}
