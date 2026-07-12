import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'

interface CountUpProps {
  /** Final value (already in display units, e.g. naira — not kobo). */
  value: number
  format?: (v: number) => string
  duration?: number
  /** Start on mount (bursar KPIs) instead of on scroll-into-view (landing). */
  onMount?: boolean
  className?: string
}

export function CountUp({ value, format, duration = 2, onMount = false, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => (format ? format(Math.round(v)) : Math.round(v).toLocaleString('en-NG')))

  useEffect(() => {
    if (!(onMount || inView)) return
    // Re-animates when async data lands (e.g. 0 → live total).
    const controls = animate(count, value, { duration, ease: 'easeOut' })
    return () => controls.stop()
  }, [inView, onMount, value, duration, count])

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>
}
