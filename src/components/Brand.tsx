import { useState } from 'react'
import { SCHOOL } from '../lib/school'

/** School crest — tries the live crest, falls back to the local SVG. */
export function Crest({ className = 'h-10 w-10' }: { className?: string }) {
  const [src, setSrc] = useState(SCHOOL.logoUrl)
  return (
    <img
      src={src}
      alt={`${SCHOOL.name} crest`}
      className={`${className} object-contain`}
      onError={() => src !== SCHOOL.logoFallback && setSrc(SCHOOL.logoFallback)}
    />
  )
}

/** "Demo Mode" pill so stakeholders know auth arrives in production. */
export function DemoModePill() {
  return (
    <div className="no-print fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full border border-gold-500/40 bg-navy-950/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-300 shadow-lg backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
      </span>
      Demo Mode
    </div>
  )
}

export function PoweredByNalto({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`text-xs ${dark ? 'text-ink-400' : 'text-white/50'}`}>
      Powered by <span className="font-semibold tracking-wide">Nalto</span>
    </span>
  )
}
