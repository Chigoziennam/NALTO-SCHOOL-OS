import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/** Rotating, glowing scripture — Catholic teachings that switch every few
 *  seconds. Three placements:
 *   - 'side'         a slim vertical quote rail anchored to the screen edge (hero)
 *   - 'center-small' a compact centred verse (page tail, above the footer)
 *   - 'band'         the original full-width section (kept for reuse) */

const VERSES = [
  { text: 'Train up a child in the way he should go; even when he is old he will not depart from it.', ref: 'Proverbs 22:6' },
  { text: 'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.', ref: 'Matthew 19:14' },
  { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
  { text: 'The fear of the Lord is the beginning of wisdom.', ref: 'Proverbs 9:10' },
  { text: 'For he will command his angels concerning you, to guard you in all your ways.', ref: 'Psalm 91:11' },
  { text: 'Do everything in love.', ref: '1 Corinthians 16:14' },
  { text: 'Whatever you do, work at it with all your heart, as working for the Lord.', ref: 'Colossians 3:23' },
]

function useRotatingVerse(startIndex: number) {
  const [i, setI] = useState(startIndex % VERSES.length)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % VERSES.length), 7000)
    return () => clearInterval(t)
  }, [])
  return { i, verse: VERSES[i] }
}

const glow = {
  animate: {
    textShadow: [
      '0 0 14px rgba(230,199,128,0.35)',
      '0 0 30px rgba(230,199,128,0.8)',
      '0 0 14px rgba(230,199,128,0.35)',
    ],
  },
  transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
}

/** Slim vertical rail — sits along a screen edge inside the hero. */
export function ScriptureSide({ startIndex = 0, side = 'right' }: { startIndex?: number; side?: 'left' | 'right' }) {
  const { i, verse } = useRotatingVerse(startIndex)
  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-20 hidden max-w-[15rem] -translate-y-1/2 lg:block ${
        side === 'right' ? 'right-6 xl:right-10 text-right' : 'left-6 xl:left-10 text-left'
      }`}
    >
      <div className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className="h-14 w-px bg-gradient-to-b from-transparent via-gold-300/80 to-transparent" />
        <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-300">Word of God</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={i}
          initial={{ opacity: 0, x: side === 'right' ? 16 : -16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: side === 'right' ? -16 : 16, filter: 'blur(6px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mt-4"
        >
          <motion.p className="font-display text-lg italic leading-snug text-paper-0" {...glow}>
            “{verse.text}”
          </motion.p>
          <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{verse.ref}</footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  )
}

/** Compact centred verse — small, sits low on the page. */
export function ScriptureCenterSmall({ startIndex = 0 }: { startIndex?: number }) {
  const { i, verse } = useRotatingVerse(startIndex)
  return (
    <div className="relative px-6 py-16 text-center">
      <div className="mb-4 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-300">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-300/70" />
        Word of God
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-300/70" />
      </div>
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={i}
          initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(5px)' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto max-w-2xl"
        >
          <motion.p className="font-display text-lg italic leading-snug text-paper-0 sm:text-xl" {...glow}>
            “{verse.text}”
          </motion.p>
          <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">— {verse.ref}</footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  )
}
