import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { addStudent } from '../lib/api'
import { useClassOptions } from '../hooks/useData'
import { Modal } from './Modal'

const inputCls =
  'w-full rounded-[10px] border border-ink-200 bg-paper-0 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500'

export function AddStudentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: classOptions } = useClassOptions()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    admission_number: '', first_name: '', last_name: '', middle_name: '',
    gender: 'female', date_of_birth: '', class_id: '', is_new_intake: false,
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const mutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-summary'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-totals'] })
    },
  })

  const close = () => { mutation.reset(); onClose() }

  return (
    <Modal open={open} onClose={close} title="Add Student">
      {mutation.isSuccess ? (
        <div className="py-8 text-center">
          <CheckCircle2 size={44} className="mx-auto text-status-paid" />
          <h4 className="mt-4 text-lg font-semibold text-navy-950">
            {form.first_name} {form.last_name} enrolled
          </h4>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-500">
            The term invoice is being generated automatically from the {form.is_new_intake ? 'new-intake' : 'returning'} fee template.
          </p>
          <button onClick={close} className="btn-primary mt-6">Done</button>
        </div>
      ) : (
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(form) }}
        >
          <div className="col-span-2">
            <label className={labelCls}>Admission Number</label>
            <input required className={inputCls} placeholder="ARCH/2026/0001" value={form.admission_number} onChange={set('admission_number')} />
          </div>
          <div>
            <label className={labelCls}>First Name</label>
            <input required className={inputCls} value={form.first_name} onChange={set('first_name')} />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input required className={inputCls} value={form.last_name} onChange={set('last_name')} />
          </div>
          <div>
            <label className={labelCls}>Middle Name</label>
            <input className={inputCls} value={form.middle_name} onChange={set('middle_name')} />
          </div>
          <div>
            <label className={labelCls}>Gender</label>
            <select className={inputCls} value={form.gender} onChange={set('gender')}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" className={inputCls} value={form.date_of_birth} onChange={set('date_of_birth')} />
          </div>
          <div>
            <label className={labelCls}>Class</label>
            <select required className={inputCls} value={form.class_id} onChange={set('class_id')}>
              <option value="" disabled>Select class…</option>
              {classOptions?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <label className="col-span-2 flex cursor-pointer items-center justify-between rounded-[10px] border border-ink-200 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-navy-950">New intake</div>
              <div className="text-xs text-ink-400">Uses the new-intake fee template (entrance, uniform, …)</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.is_new_intake}
              onClick={() => setForm((f) => ({ ...f, is_new_intake: !f.is_new_intake }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.is_new_intake ? 'bg-gold-500' : 'bg-ink-200'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.is_new_intake ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </label>
          <div className="col-span-2 mt-2 flex justify-end gap-3">
            <button type="button" onClick={close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary disabled:opacity-60">
              {mutation.isPending ? 'Enrolling…' : 'Enrol Student'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
