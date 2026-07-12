import { useMemo, useState } from 'react'
import { CheckSquare, CreditCard, SlidersHorizontal, Square } from 'lucide-react'
import { Modal } from './Modal'
import { formatKobo } from '../lib/format'
import type { InvoiceLine } from '../lib/types'

const MIN_PART_KOBO = 100_000 // ₦1,000 minimum part payment

interface Props {
  open: boolean
  onClose: () => void
  balanceKobo: number
  studentName: string
  /** When provided, parents can tick individual fee items to pay for. */
  items?: InvoiceLine[]
  onPay: (amountKobo: number) => void
}

/**
 * "Choose what to pay" — parents either tick fee items from the invoice or
 * enter any amount (part payment). Every payment is recorded against the
 * invoice, so the balance always reflects what is still owed.
 */
export function PayAmountModal({ open, onClose, balanceKobo, studentName, items, onPay }: Props) {
  const [mode, setMode] = useState<'items' | 'amount'>(items?.length ? 'items' : 'amount')
  const [selected, setSelected] = useState<Set<string>>(() => new Set(items?.map((i) => i.id)))
  const [nairaInput, setNairaInput] = useState('')

  const itemsTotal = useMemo(
    () => (items ?? []).filter((i) => selected.has(i.id)).reduce((s, i) => s + i.amount_kobo, 0),
    [items, selected],
  )
  // Items already part-covered by earlier payments never overcharge the parent.
  const itemsPayable = Math.min(itemsTotal, balanceKobo)

  const customKobo = Math.round((Number(nairaInput.replace(/[^\d]/g, '')) || 0) * 100)
  const amountKobo = mode === 'items' ? itemsPayable : Math.min(customKobo, balanceKobo)

  const invalid =
    amountKobo <= 0 ||
    (mode === 'amount' && customKobo < MIN_PART_KOBO && customKobo < balanceKobo)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const chip = (pct: number) => Math.round((balanceKobo * pct) / 100 / 100) // → naira

  return (
    <Modal open={open} onClose={onClose} title={`Pay Fees — ${studentName}`}>
      <div className="text-sm text-ink-500">
        Outstanding balance: <span className="font-mono font-semibold text-status-owing-deep">{formatKobo(balanceKobo)}</span>
      </div>

      {/* Mode switch */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-paper-100 p-1 text-sm font-semibold">
        {items?.length ? (
          <button
            onClick={() => setMode('items')}
            className={`rounded-lg px-3 py-2 transition ${mode === 'items' ? 'bg-paper-0 text-navy-950 shadow-sm' : 'text-ink-400'}`}
          >
            <CheckSquare size={14} className="mr-1.5 inline -translate-y-px" /> Pick fee items
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={() => setMode('amount')}
          className={`rounded-lg px-3 py-2 transition ${mode === 'amount' ? 'bg-paper-0 text-navy-950 shadow-sm' : 'text-ink-400'}`}
        >
          <SlidersHorizontal size={14} className="mr-1.5 inline -translate-y-px" /> Part payment
        </button>
      </div>

      {mode === 'items' && items?.length ? (
        <ul className="mt-4 divide-y divide-ink-100 rounded-xl border border-ink-200">
          {items.map((item) => {
            const on = selected.has(item.id)
            return (
              <li key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-paper-50"
                >
                  {on ? <CheckSquare size={18} className="flex-shrink-0 text-gold-700" /> : <Square size={18} className="flex-shrink-0 text-ink-300" />}
                  <span className={`min-w-0 flex-1 ${on ? 'text-navy-950' : 'text-ink-400 line-through'}`}>{item.description}</span>
                  <span className="font-mono text-navy-950">{formatKobo(item.amount_kobo)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-4">
          <label className="kpi-label" htmlFor="part-amount">Amount to pay now (₦)</label>
          <input
            id="part-amount"
            inputMode="numeric"
            placeholder={`e.g. ${chip(50).toLocaleString('en-NG')}`}
            value={nairaInput}
            onChange={(e) => setNairaInput(e.target.value.replace(/[^\d,]/g, ''))}
            className="mt-2 w-full rounded-xl border border-ink-200 bg-paper-0 px-4 py-3 font-mono text-lg text-navy-950 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-300/40"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setNairaInput(chip(pct).toLocaleString('en-NG'))}
                className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-navy-900 hover:border-gold-500/60 hover:bg-paper-100"
              >
                {pct === 100 ? 'Full balance' : `${pct}%`}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-400">
            Minimum part payment is {formatKobo(MIN_PART_KOBO)}. The remainder stays on the invoice and can be paid any time.
          </p>
        </div>
      )}

      <button
        disabled={invalid}
        onClick={() => {
          onPay(amountKobo)
          onClose()
        }}
        className="btn-accent mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CreditCard size={16} /> Pay {amountKobo > 0 ? formatKobo(amountKobo) : 'now'}
      </button>
    </Modal>
  )
}
