import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper-0 p-7 shadow-2xl sm:rounded-3xl"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl">{title}</h3>
              <button onClick={onClose} className="rounded-full p-1.5 text-ink-400 hover:bg-paper-100" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
