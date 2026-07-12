import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { formatNaira } from '../lib/format'

const inputCls =
  'w-full rounded-[10px] border border-ink-200 bg-paper-0 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500'

import { Modal } from './Modal'

/** Manual cash / POS / transfer entry. In production this inserts a
 *  `payments` row (channel=cash|pos) + allocation; DB trigger settles status. */
export function RecordPaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ student: '', amount: '', channel: 'cash', reference: '' })
  const [done, setDone] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const close = () => { setDone(false); setForm({ student: '', amount: '', channel: 'cash', reference: '' }); onClose() }

  return (
    <Modal open={open} onClose={close} title="Record Cash/POS Payment">
      {done ? (
        <div className="py-8 text-center">
          <CheckCircle2 size={44} className="mx-auto text-status-paid" />
          <h4 className="mt-4 text-lg font-semibold text-navy-950">
            {formatNaira(Number(form.amount) || 0)} recorded
          </h4>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-500">
            Payment logged for {form.student}. The invoice status updates automatically and a receipt is issued.
          </p>
          <button onClick={close} className="btn-primary mt-6">Done</button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDone(true) }}>
          <div>
            <label className={labelCls}>Student</label>
            <input required className={inputCls} placeholder="Search by name or admission no…" value={form.student} onChange={set('student')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Amount (₦)</label>
              <input required type="number" min="1" className={inputCls} placeholder="150000" value={form.amount} onChange={set('amount')} />
            </div>
            <div>
              <label className={labelCls}>Channel</label>
              <select className={inputCls} value={form.channel} onChange={set('channel')}>
                <option value="cash">Cash</option>
                <option value="pos">POS</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Teller / Reference (optional)</label>
            <input className={inputCls} value={form.reference} onChange={set('reference')} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={close} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Record Payment</button>
          </div>
        </form>
      )}
    </Modal>
  )
}
