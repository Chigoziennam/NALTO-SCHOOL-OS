import { motion } from 'framer-motion'

/**
 * One continuous page canvas — a single fixed mesh-gradient behind the WHOLE
 * landing page. Because every section sits on this same canvas (transparent or
 * frosted glass), there are no hard seam lines where sections meet.
 */
export function PageCanvas() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-950">
      {/* mesh built from the school's own colours: gold, wine (wordmark), azure (accent blocks) */}
      <div className="absolute inset-0 animate-mesh-drift" style={{
        background:
          'radial-gradient(60% 45% at 18% 8%, rgba(201,154,62,0.20), transparent 60%),' +
          'radial-gradient(55% 40% at 88% 20%, rgba(158,43,50,0.22), transparent 60%),' +
          'radial-gradient(50% 42% at 12% 62%, rgba(22,144,200,0.20), transparent 60%),' +
          'radial-gradient(65% 50% at 55% 100%, rgba(201,154,62,0.14), transparent 60%),' +
          'radial-gradient(50% 40% at 82% 80%, rgba(158,43,50,0.16), transparent 60%)',
      }} />
      {/* fine grain / vignette for depth */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(5,14,28,0.7) 100%)',
      }} />
    </div>
  )
}

/**
 * Organic wave that carries a photo edge into the navy canvas — used top and
 * bottom of full-bleed image bands so they melt into the page instead of
 * ending on a straight line.
 */
export function WaveDivider({ position, className = '' }: { position: 'top' | 'bottom'; className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} z-10 ${className}`}
      style={{ transform: position === 'top' ? 'rotate(180deg)' : undefined }}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-[70px] w-full sm:h-[110px]">
        <path
          d="M0,64 C240,110 480,20 720,44 C960,68 1200,116 1440,72 L1440,120 L0,120 Z"
          fill="#0a1830"
        />
        <path
          d="M0,64 C240,110 480,20 720,44 C960,68 1200,116 1440,72"
          fill="none"
          stroke="rgba(201,154,62,0.35)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}

/* ---- Team avatar illustrations — six calm line-art portraits, each in a
   different accent so the row reads as a proportional set. Swap for real
   photos by replacing <TeamAvatar/> with an <img> in the card. ---- */

const AVATAR_TONES = [
  { robe: '#163356', trim: '#c99a3e', bg: '#eef3f8' },
  { robe: '#7a1f26', trim: '#e6c780', bg: '#f7eeee' },
  { robe: '#0f2340', trim: '#d9ae5d', bg: '#eef1f6' },
  { robe: '#8a6a1f', trim: '#fffdf8', bg: '#f6f1e4' },
  { robe: '#1e4470', trim: '#e6c780', bg: '#eaf0f7' },
  { robe: '#9e2b32', trim: '#f6ead0', bg: '#f7eded' },
]

export function TeamAvatar({ index }: { index: number }) {
  const t = AVATAR_TONES[index % AVATAR_TONES.length]
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <defs>
        <clipPath id={`clip-${index}`}><circle cx="60" cy="60" r="60" /></clipPath>
      </defs>
      <g clipPath={`url(#clip-${index})`}>
        <rect width="120" height="120" fill={t.bg} />
        {/* shoulders / robe */}
        <path d="M18 120 Q22 84 60 84 Q98 84 102 120 Z" fill={t.robe} />
        {/* collar */}
        <path d="M50 88 L60 100 L70 88 L64 84 L56 84 Z" fill={t.trim} opacity="0.9" />
        {/* neck */}
        <rect x="53" y="70" width="14" height="18" rx="6" fill="#e7c9a8" />
        {/* head */}
        <circle cx="60" cy="52" r="21" fill="#e6cba6" />
        {/* hair */}
        <path d="M39 50 Q40 28 60 27 Q80 28 81 50 Q74 40 60 40 Q46 40 39 50 Z" fill={t.robe} opacity="0.85" />
        {/* halo hint */}
        <ellipse cx="60" cy="30" rx="16" ry="4" fill="none" stroke={t.trim} strokeWidth="1.5" opacity="0.6" />
      </g>
      <circle cx="60" cy="60" r="59" fill="none" stroke={t.trim} strokeWidth="2" opacity="0.55" />
    </svg>
  )
}
