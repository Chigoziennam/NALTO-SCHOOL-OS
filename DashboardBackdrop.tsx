import { motion } from 'framer-motion'

/**
 * Faint full-bleed illustration behind a dashboard's content — a chapel
 * silhouette for parents (family under the school's care), a ledger/coin
 * motif for the bursar (the money she's stewarding). Pure line-art, very low
 * opacity, pointer-events-none — never competes with the real content.
 */
export function DashboardBackdrop({ variant }: { variant: 'parent' | 'bursar' }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper-50">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px circle at 12% 0%, rgba(201,154,62,0.10), transparent 55%), radial-gradient(700px circle at 100% 30%, rgba(15,35,64,0.06), transparent 55%)',
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 flex justify-center opacity-[0.06]"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {variant === 'parent' ? (
          <svg width="1100" height="420" viewBox="0 0 1100 420" fill="none">
            {/* chapel / school silhouette */}
            <path d="M550 20 L580 60 L520 60 Z" fill="#0f2340" />
            <rect x="560" y="60" width="20" height="40" fill="#0f2340" />
            <path d="M300 130 L550 60 L800 130 L800 400 L300 400 Z" fill="#0f2340" />
            <rect x="360" y="200" width="60" height="90" fill="#faf7ef" />
            <rect x="440" y="200" width="60" height="90" fill="#faf7ef" />
            <rect x="600" y="200" width="60" height="90" fill="#faf7ef" />
            <rect x="680" y="200" width="60" height="90" fill="#faf7ef" />
            <rect x="510" y="300" width="80" height="100" fill="#faf7ef" />
            {/* parent + child figures */}
            <circle cx="150" cy="330" r="22" fill="#0f2340" />
            <path d="M120 400 Q150 340 180 400 Z" fill="#0f2340" />
            <circle cx="205" cy="355" r="13" fill="#0f2340" />
            <path d="M188 400 Q205 365 222 400 Z" fill="#0f2340" />
            <circle cx="950" cy="350" r="14" fill="#0f2340" />
            <path d="M932 400 Q950 362 968 400 Z" fill="#0f2340" />
          </svg>
        ) : (
          <svg width="1100" height="420" viewBox="0 0 1100 420" fill="none">
            {/* ledger + coin stacks */}
            <rect x="380" y="120" width="340" height="260" rx="8" fill="#0f2340" />
            <rect x="410" y="150" width="280" height="14" fill="#faf7ef" />
            <rect x="410" y="180" width="280" height="10" fill="#faf7ef" />
            <rect x="410" y="204" width="220" height="10" fill="#faf7ef" />
            <rect x="410" y="228" width="280" height="10" fill="#faf7ef" />
            <rect x="410" y="252" width="180" height="10" fill="#faf7ef" />
            <circle cx="180" cy="360" r="34" fill="#0f2340" />
            <circle cx="180" cy="330" r="34" fill="#0f2340" />
            <circle cx="180" cy="300" r="34" fill="#0f2340" />
            <circle cx="920" cy="360" r="34" fill="#0f2340" />
            <circle cx="920" cy="330" r="34" fill="#0f2340" />
            <text x="920" y="340" fontSize="30" fontWeight="700" fill="#faf7ef" textAnchor="middle">₦</text>
          </svg>
        )}
      </motion.div>
    </div>
  )
}
