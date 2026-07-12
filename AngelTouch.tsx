import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Wrap a page in <AngelTouch> and every button/link tap releases a guardian
 * angel that rises from the button and fades into the light, trailed by
 * little gold sparkles.
 */

interface AngelSpawn {
  id: number
  x: number
  y: number
  drift: number
}

/** Expanding gold ring at the tap point — a tactile "step forward" cue that
 *  fires on every button/link press, independent of the angel above it. */
function TapRipple({ x, y }: { x: number; y: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full border-2"
      style={{ left: x, top: y, borderColor: 'rgba(230,199,128,0.85)' }}
      initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.9 }}
      animate={{ width: 90, height: 90, x: -45, y: -45, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  )
}

function AngelSprite({ x, y, drift }: { x: number; y: number; drift: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x - 30, top: y - 30 }}
      initial={{ opacity: 0, scale: 0.35, y: 10 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.35, 1.05, 1, 0.7],
        y: [10, -44, -96, -158],
        x: [0, drift, -drift * 0.6, drift * 0.4],
        rotate: [0, drift > 0 ? 9 : -9, drift > 0 ? -7 : 7, 0],
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.6, ease: 'easeOut', times: [0, 0.15, 0.6, 1] }}
    >
      <svg width="60" height="60" viewBox="0 0 44 44" style={{ filter: 'drop-shadow(0 0 12px rgba(230,199,128,1)) drop-shadow(0 0 26px rgba(230,199,128,0.55))' }}>
        {/* halo */}
        <ellipse cx="22" cy="7.5" rx="6.5" ry="2.4" fill="none" stroke="#e6c780" strokeWidth="1.8" />
        {/* wings */}
        <path d="M14 20 Q4 12 3 22 Q6 28 14 26 Z" fill="#fff8e6" opacity="0.95" />
        <path d="M30 20 Q40 12 41 22 Q38 28 30 26 Z" fill="#fff8e6" opacity="0.95" />
        {/* head */}
        <circle cx="22" cy="15" r="4.6" fill="#f6ead0" />
        {/* gown */}
        <path d="M22 19 Q15 30 17 37 Q22 40 27 37 Q29 30 22 19 Z" fill="#fffdf8" stroke="#e6c780" strokeWidth="0.8" />
      </svg>
      {/* trailing sparkles */}
      {[0, 1, 2].map((s) => (
        <motion.span
          key={s}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ left: 18 + s * 12, top: 46, background: '#e6c780', boxShadow: '0 0 8px rgba(230,199,128,0.95)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, 26 + s * 12], x: [(s - 1) * 4, (s - 1) * 14] }}
          transition={{ duration: 1.7, delay: 0.25 + s * 0.18, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  )
}

export function AngelTouch({ children }: { children: React.ReactNode }) {
  const [angels, setAngels] = useState<AngelSpawn[]>([])
  const [ripples, setRipples] = useState<AngelSpawn[]>([])

  const release = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest('button, a')
    if (!el) return
    const rect = el.getBoundingClientRect()
    const id = Date.now() + Math.random()
    const drift = (Math.random() > 0.5 ? 1 : -1) * (16 + Math.random() * 20)
    // Rise from the top-centre of the tapped button so it reads as "from the button"
    const x = rect.left + rect.width / 2
    const y = rect.top - 4
    // Ripple centres on the tap itself, giving instant "step forward" feedback
    const rippleX = e.clientX
    const rippleY = e.clientY
    setAngels((a) => [...a.slice(-5), { id, x, y, drift }])
    setRipples((r) => [...r.slice(-5), { id, x: rippleX, y: rippleY, drift: 0 }])
    window.setTimeout(() => setAngels((a) => a.filter((an) => an.id !== id)), 2800)
    window.setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700)
  }

  return (
    <div onClickCapture={release}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
        <AnimatePresence>
          {ripples.map((r) => <TapRipple key={r.id} x={r.x} y={r.y} />)}
          {angels.map((a) => <AngelSprite key={a.id} x={a.x} y={a.y} drift={a.drift} />)}
        </AnimatePresence>
      </div>
    </div>
  )
}
