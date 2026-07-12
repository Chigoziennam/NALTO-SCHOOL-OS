import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * The "super holy" layer — animated god-rays, a breathing golden halo and
 * drifting light motes, composited over the heaven imagery. Pure CSS/JSX,
 * GPU-friendly, honours prefers-reduced-motion via the global CSS rule.
 */
export function HolyLight({ intensity = 1 }: { intensity?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: (i * 53.7) % 100,
        size: 2 + ((i * 7) % 5),
        delay: (i * 1.37) % 9,
        duration: 11 + ((i * 3) % 9),
        drift: ((i % 5) - 2) * 30,
      })),
    [],
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* breathing halo behind the headline */}
      <div
        className="absolute left-1/2 top-[30%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 animate-halo-breathe rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(246,234,208,0.55) 0%, rgba(230,199,128,0.25) 40%, transparent 70%)',
          opacity: 0.8 * intensity,
        }}
      />
      {/* sweeping god-rays */}
      {[
        { left: '30%', width: '16%', delay: '0s', opacity: 0.5 },
        { left: '46%', width: '22%', delay: '-3s', opacity: 0.65 },
        { left: '62%', width: '13%', delay: '-6s', opacity: 0.45 },
      ].map((r, i) => (
        <div
          key={i}
          className="absolute -top-[12%] h-[130%] animate-ray-sweep"
          style={{
            left: r.left,
            width: r.width,
            animationDelay: r.delay,
            opacity: r.opacity * intensity,
            background: 'linear-gradient(180deg, rgba(255,248,224,0.85), rgba(255,246,221,0.18) 55%, transparent 85%)',
            clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
            transformOrigin: 'top center',
            filter: 'blur(6px)',
            mixBlendMode: 'soft-light',
          }}
        />
      ))}
      {/* drifting light motes */}
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full bg-gold-100"
          style={{
            left: `${m.left}%`,
            bottom: '-3%',
            width: m.size,
            height: m.size,
            boxShadow: '0 0 10px 3px rgba(246,234,208,0.65)',
            opacity: 0,
          }}
          animate={{ y: ['0vh', '-105vh'], x: [0, m.drift], opacity: [0, 0.85 * intensity, 0] }}
          transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}
