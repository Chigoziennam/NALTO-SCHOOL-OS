import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CreditCard, Landmark, Lock, Minus, Plus, ShoppingBag,
  Smartphone, Trash2, UserRound,
} from 'lucide-react'
import { SCHOOL, CLASS_APPLYING, TERMS, feeForClass } from '../lib/school'
import { formatNaira } from '../lib/format'
import { useCart, feeLineAmount, type PayPct, type FeeLine } from '../lib/cart'
import { Crest, PoweredByNalto } from '../components/Brand'
import { PageTransition } from '../components/PageTransition'
import { usePaystack } from '../components/usePaystack'
import { AngelTouch } from '../components/AngelTouch'
import { DashboardBackdrop } from '../components/DashboardBackdrop'

const inputCls =
  'w-full rounded-xl border border-ink-200 bg-paper-0 px-3.5 py-2.5 text-[15px] text-navy-950 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition'

const PCTS: PayPct[] = [25, 50, 75, 100]

function StudentCard({ fee, index }: { fee: FeeLine; index: number }) {
  const { updateFee, removeFee, fees } = useCart()
  const full = feeForClass(fee.className)
  const now = feeLineAmount(fee)
  const balance = full - now
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      className="card space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-xs text-gold-300">{index + 1}</span>
          Student
        </div>
        {fees.length > 1 && (
          <button onClick={() => removeFee(fee.id)} className="rounded-full p-1.5 text-ink-400 hover:bg-status-owing-soft hover:text-status-owing-deep" aria-label="Remove student">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <input
        value={fee.student}
        onChange={(e) => updateFee(fee.id, { student: e.target.value })}
        className={inputCls}
        placeholder="Student’s full name"
      />
      <div className="grid grid-cols-2 gap-3">
        <select value={fee.className} onChange={(e) => updateFee(fee.id, { className: e.target.value })} className={inputCls}>
          <option value="" disabled>Class…</option>
          {CLASS_APPLYING.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={fee.term} onChange={(e) => updateFee(fee.id, { term: e.target.value })} className={inputCls}>
          {TERMS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {full > 0 && (
        <div className="rounded-xl bg-paper-50 p-3.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">Term fee</span>
            <span className="font-mono font-semibold text-navy-950">{formatNaira(full)}</span>
          </div>
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Pay part now</span>
              <span className="text-[11px] text-ink-400">choose how much</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {PCTS.map((p) => (
                <button
                  key={p}
                  onClick={() => updateFee(fee.id, { pct: p })}
                  className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                    fee.pct === p
                      ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                      : 'border border-ink-200 bg-paper-0 text-ink-500 hover:border-gold-400'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-xs text-ink-400">
                {fee.pct < 100 ? `Balance ${formatNaira(balance)} due later` : 'Full term paid'}
              </span>
              <span className="font-mono text-lg font-semibold text-status-paid-deep">{formatNaira(now)}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function UniformLine({ id, name, size, qty, priceNaira }: { id: string; name: string; size: string; qty: number; priceNaira: number }) {
  const { updateItem, removeItem } = useCart()
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-navy-950">{name}</div>
        <div className="text-xs text-ink-400">{size} · {formatNaira(priceNaira)} each</div>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-ink-200 px-1.5 py-1">
        <button onClick={() => (qty > 1 ? updateItem(id, { qty: qty - 1 }) : removeItem(id))} className="p-1 text-ink-400 hover:text-navy-950" aria-label="Decrease"><Minus size={14} /></button>
        <span className="w-5 text-center text-sm font-semibold">{qty}</span>
        <button onClick={() => updateItem(id, { qty: qty + 1 })} className="p-1 text-ink-400 hover:text-navy-950" aria-label="Increase"><Plus size={14} /></button>
      </div>
      <div className="w-20 text-right font-mono text-sm font-semibold text-navy-950">{formatNaira(priceNaira * qty)}</div>
      <button onClick={() => removeItem(id)} className="rounded-full p-1.5 text-ink-400 hover:text-status-owing-deep" aria-label="Remove item"><Trash2 size={15} /></button>
    </motion.div>
  )
}

export default function ParentDashboard() {
  const { pay, overlay } = usePaystack()
  const cart = useCart()
  const [email, setEmail] = useState('')

  // Seed one empty student row the first time an empty cart is opened.
  const seeded = useRef(false)
  useEffect(() => {
    if (!seeded.current && cart.fees.length === 0 && cart.items.length === 0) {
      seeded.current = true
      cart.addFee()
    }
  }, [cart])

  const ready = cart.total > 0 && email.trim().length > 3

  function onPay() {
    if (!ready) return
    const lineItems = [
      ...cart.fees
        .filter((f) => feeForClass(f.className) > 0)
        .map((f) => ({
          label: `${f.student.trim() || 'Student'} — ${f.className} fees (${f.pct}% · ${f.term})`,
          amountNaira: feeLineAmount(f),
        })),
      ...cart.items.map((i) => ({ label: `${i.name} (${i.size}) ×${i.qty}`, amountNaira: i.priceNaira * i.qty })),
    ]
    const firstNamed = cart.fees.find((f) => f.student.trim())?.student.trim()
    pay({
      amountKobo: cart.total * 100,
      email: email.trim(),
      studentName: firstNamed ?? 'Multiple students',
      purpose: cart.itemsTotal > 0 && cart.feesTotal > 0 ? 'School Fees & Uniforms' : cart.feesTotal > 0 ? 'School Fees' : 'Uniforms',
      lineItems,
    })
  }

  return (
    <PageTransition>
      <AngelTouch>
        {overlay}
        <DashboardBackdrop variant="parent" />
        <div className="relative z-10 min-h-screen pb-40">
          {/* Top bar */}
          <div className="border-b border-white/10 bg-navy-950">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-navy-100 hover:text-gold-300">
                <ArrowLeft size={16} /> Home
              </Link>
              <div className="flex items-center gap-2.5">
                <Crest className="h-8 w-8" />
                <span className="hidden font-display text-white sm:block">{SCHOOL.name}</span>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="bg-navy-950 pb-10 pt-6 text-center text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md px-5">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">Secure Online Payment</div>
              <h1 className="mt-3 text-3xl sm:text-4xl">Pay Fees &amp; Uniforms</h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy-100">
                Add one or more children, choose how much to pay, add uniforms — then pay it all at once.
                Official receipt is instant.
              </p>
            </motion.div>
          </div>

          <main className="mx-auto max-w-2xl space-y-6 px-5 pt-8">
            {/* Students & Fees */}
            <section>
              <div className="mb-3 flex items-center gap-2 px-1">
                <UserRound size={18} className="text-gold-300" />
                <h2 className="text-lg font-semibold text-white">Students &amp; Fees</h2>
              </div>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {cart.fees.map((f, i) => <StudentCard key={f.id} fee={f} index={i} />)}
                </AnimatePresence>
              </div>
              <button
                onClick={() => cart.addFee()}
                className="btn-secondary mt-4 w-full border-dashed"
              >
                <Plus size={16} /> Add another student
              </button>
            </section>

            {/* Uniforms */}
            <section>
              <div className="mb-3 flex items-center gap-2 px-1">
                <ShoppingBag size={18} className="text-gold-300" />
                <h2 className="text-lg font-semibold text-white">Uniforms &amp; Items</h2>
              </div>
              <div className="card">
                {cart.items.length > 0 ? (
                  <div className="divide-y divide-ink-100">
                    <AnimatePresence initial={false}>
                      {cart.items.map((i) => <UniformLine key={i.id} {...i} />)}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="py-2 text-center text-sm text-ink-400">No items yet — add uniforms, books or a school bag.</p>
                )}
                <Link to="/parent/uniforms" className="btn-secondary mt-4 w-full">
                  <ShoppingBag size={16} /> {cart.items.length > 0 ? 'Add more from the shop' : 'Browse the School Store'}
                </Link>
              </div>
            </section>

            {/* Email */}
            <section className="card">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Email (for your receipt)</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@email.com" />
              </label>
            </section>

            {/* Trust */}
            <div className="flex flex-col items-center gap-3 pt-2 text-navy-100">
              <div className="flex items-center gap-1.5 text-xs"><Lock size={13} className="text-status-paid" /> Secured by Paystack · PCI-DSS</div>
              <div className="flex items-center gap-5 text-navy-100/70">
                <span className="flex items-center gap-1.5 text-xs"><CreditCard size={15} /> Card</span>
                <span className="flex items-center gap-1.5 text-xs"><Landmark size={15} /> Transfer</span>
                <span className="flex items-center gap-1.5 text-xs"><Smartphone size={15} /> USSD</span>
              </div>
              <PoweredByNalto />
            </div>
          </main>
        </div>

        {/* Sticky checkout bar */}
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-gold-400/20 bg-navy-950/95 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-5 py-3.5">
            <div className="mb-2.5 flex items-center justify-between text-xs text-navy-100">
              <span>{cart.feesTotal > 0 && `Fees ${formatNaira(cart.feesTotal)}`}{cart.feesTotal > 0 && cart.itemsTotal > 0 && ' · '}{cart.itemsTotal > 0 && `Items ${formatNaira(cart.itemsTotal)}`}{cart.total === 0 && 'Add a student or item to begin'}</span>
              <span className="font-mono text-lg font-semibold text-gold-300">{formatNaira(cart.total)}</span>
            </div>
            <motion.button
              onClick={onPay}
              disabled={!ready}
              whileTap={ready ? { scale: 0.98 } : undefined}
              className="btn-accent w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <CreditCard size={18} /> {cart.total > 0 ? `Pay ${formatNaira(cart.total)}` : 'Pay School Fees'}
            </motion.button>
          </div>
        </div>
      </AngelTouch>
    </PageTransition>
  )
}
