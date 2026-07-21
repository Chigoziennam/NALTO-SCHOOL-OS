import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Wrap a page in <AngelTouch> and every button/link tap fires a quick gold
 * spark-burst right at the touch point — a radial pop of particles + a crisp
 * expanding ring. Snappy, lightweight and thumb-friendly on phones.
 */

interface Burst {
  id: number
  x: number
  y: number
  /** per-burst particle angles so each pop looks a little different */
  seeds: number[]
}

const PARTICLES = 7

function SparkBurst({ x, y, seeds }: { x: number; y: number; seeds: number[] }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }}>
      {/* crisp expanding ring */}
      <motion.span
        className="absolute rounded-full border"
        style={{ borderColor: 'rgba(230,199,128,0.9)' }}
        initial={{ width: 6, height: 6, x: -3, y: -3, opacity: 0.9 }}
        animate={{ width: 64, height: 64, x: -32, y: -32, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* bright core flash */}
      <motion.span
        className="absolute rounded-full"
        style={{ background: 'radial-gradient(circle, #fff8e6 0%, #e6c780 55%, transparent 70%)' }}
        initial={{ width: 22, height: 22, x: -11, y: -11, opacity: 0.95, scale: 0.4 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      {/* radial particle pop */}
      {seeds.map((seed, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2 + seed
        const dist = 26 + seed * 22
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: '#e6c780', boxShadow: '0 0 8px rgba(230,199,128,0.95)' }}
            initial={{ x: -3, y: -3, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist - 3,
              y: Math.sin(angle) * dist - 3,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        )
      })}
    </div>
  )
}

export function AngelTouch({ children }: { children: React.ReactNode }) {
  const [bursts, setBursts] = useState<Burst[]>([])
  const nextId = useRef(0)

  const release = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest('button, a')
    if (!el) return
    const id = nextId.current++
    const seeds = Array.from({ length: PARTICLES }, () => Math.random())
    setBursts((b) => [...b.slice(-4), { id, x: e.clientX, y: e.clientY, seeds }])
    window.setTimeout(() => setBursts((b) => b.filter((it) => it.id !== id)), 650)
  }

  return (
    <div onClickCapture={release}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
        <AnimatePresence>
          {bursts.map((b) => <SparkBurst key={b.id} x={b.x} y={b.y} seeds={b.seeds} />)}
        </AnimatePresence>
      </div>
    </div>
  )
}
