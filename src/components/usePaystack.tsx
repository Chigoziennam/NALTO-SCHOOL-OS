import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import PaystackPop from '@paystack/inline-js'
import { useQueryClient } from '@tanstack/react-query'
import { pingPaymentWebhook } from '../lib/api'
import { formatKobo } from '../lib/format'

interface PayArgs {
  amountKobo: number
  email: string
  studentId: string
  invoiceId: string
  guardianId: string
  studentName: string
}

/**
 * Paystack inline checkout (test mode) + full-screen success overlay.
 * Without a public key configured, it simulates success so the demo flow
 * always completes in front of stakeholders.
 */
export function usePaystack() {
  const [success, setSuccess] = useState<{ amountKobo: number; reference: string } | null>(null)
  const queryClient = useQueryClient()

  const pay = useCallback(
    (args: PayArgs) => {
      const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined
      const onDone = async (reference: string) => {
        await pingPaymentWebhook({
          event: 'charge.success',
          reference,
          amount_kobo: args.amountKobo,
          student_id: args.studentId,
          invoice_id: args.invoiceId,
          guardian_id: args.guardianId,
          student_name: args.studentName,
        })
        queryClient.invalidateQueries({ queryKey: ['children'] })
        queryClient.invalidateQueries({ queryKey: ['invoice'] })
        queryClient.invalidateQueries({ queryKey: ['parent-history'] })
        setSuccess({ amountKobo: args.amountKobo, reference })
      }

      if (!key) {
        // Demo simulation — production always goes through Paystack + webhook.
        setTimeout(() => onDone('DEMO-' + Date.now()), 900)
        return
      }
      const popup = new PaystackPop()
      popup.newTransaction({
        key,
        email: args.email,
        amount: args.amountKobo, // Paystack expects kobo
        currency: 'NGN',
        metadata: { student_id: args.studentId, invoice_id: args.invoiceId, guardian_id: args.guardianId },
        onSuccess: (tx) => onDone(tx.reference),
      })
    },
    [queryClient],
  )

  const overlay = (
    <AnimatePresence>
      {success && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/80 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-paper-0 p-10 text-center shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <button
              onClick={() => setSuccess(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-ink-400 hover:bg-paper-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <svg viewBox="0 0 72 72" className="mx-auto h-20 w-20">
              <motion.circle
                cx="36" cy="36" r="32" fill="none" stroke="#1e8e5a" strokeWidth="4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <motion.path
                d="M22 37 L32 47 L51 27" fill="none" stroke="#1e8e5a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
              />
            </svg>
            <h3 className="mt-5 text-2xl">Payment Successful!</h3>
            <p className="mt-2 text-ink-500">
              <span className="font-mono font-semibold text-status-paid-deep">{formatKobo(success.amountKobo)}</span> received.
            </p>
            <p className="mt-1 font-mono text-xs text-ink-400">Ref: {success.reference}</p>
            <button
              onClick={() => window.print()}
              className="btn-primary mt-7 w-full"
            >
              <Download size={16} /> Download Receipt
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return { pay, overlay }
}
