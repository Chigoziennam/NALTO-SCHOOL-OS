import { motion } from 'framer-motion'
import type { FeeStatus } from '../lib/types'

const TONES: Record<FeeStatus, { bg: string; fg: string; label: string }> = {
  paid: { bg: 'bg-status-paid-soft', fg: 'text-status-paid-deep', label: 'Paid' },
  part_paid: { bg: 'bg-status-partial-soft', fg: 'text-status-partial-deep', label: 'Part-paid' },
  owing: { bg: 'bg-status-owing-soft', fg: 'text-status-owing-deep', label: 'Owing' },
}

export function statusFromBalance(paidKobo: number, balanceKobo: number): FeeStatus {
  if (balanceKobo <= 0) return 'paid'
  if (paidKobo > 0) return 'part_paid'
  return 'owing'
}

export function StatusPill({ status, label }: { status: FeeStatus; label?: string }) {
  const t = TONES[status]
  return (
    <motion.span
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${t.bg} ${t.fg}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label ?? t.label}
    </motion.span>
  )
}
