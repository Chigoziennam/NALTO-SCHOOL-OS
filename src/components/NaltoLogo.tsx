/**
 * Nalto AI emblem — a detailed, trustworthy assistant mark: a rounded AI face
 * with a glowing halo (an archangel nod), antenna and soft "thinking" glow.
 * Self-contained SVG with unique gradient ids so multiple copies never clash.
 */
let uid = 0

export function NaltoLogo({ className = 'h-8 w-8', glow = true }: { className?: string; glow?: boolean }) {
  const id = `nalto-${uid++}`
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Nalto AI">
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6ead0" />
          <stop offset="45%" stopColor="#e6c780" />
          <stop offset="100%" stopColor="#c99a3e" />
        </linearGradient>
        <linearGradient id={`${id}-halo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f6ead0" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#e6c780" />
          <stop offset="100%" stopColor="#f6ead0" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#163356" />
          <stop offset="100%" stopColor="#0a1830" />
        </radialGradient>
        {glow && (
          <filter id={`${id}-g`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${id}-g)` : undefined}>
        {/* halo */}
        <ellipse cx="24" cy="7.5" rx="12" ry="3" fill="none" stroke={`url(#${id}-halo)`} strokeWidth="1.6" />

        {/* antenna */}
        <line x1="24" y1="9" x2="24" y2="13.5" stroke="#c99a3e" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="8" r="1.9" fill="#f6ead0" stroke="#c99a3e" strokeWidth="0.8" />

        {/* head */}
        <rect x="9" y="13" width="30" height="25" rx="9" fill={`url(#${id}-face)`} stroke="#8a6a1f" strokeWidth="0.8" />
        {/* face inset (screen) */}
        <rect x="12.5" y="17" width="23" height="16.5" rx="6.5" fill="#0f2340" />

        {/* eyes */}
        <circle cx="19.5" cy="25.2" r="3.1" fill={`url(#${id}-eye)`} />
        <circle cx="28.5" cy="25.2" r="3.1" fill={`url(#${id}-eye)`} />
        <circle cx="20.4" cy="24.2" r="0.9" fill="#ffffff" />
        <circle cx="29.4" cy="24.2" r="0.9" fill="#ffffff" />

        {/* smile */}
        <path d="M19.5 29.6 Q24 32 28.5 29.6" fill="none" stroke="#e6c780" strokeWidth="1.3" strokeLinecap="round" />

        {/* ears / side nodes */}
        <rect x="6.4" y="22" width="2.8" height="7" rx="1.4" fill="#c99a3e" />
        <rect x="38.8" y="22" width="2.8" height="7" rx="1.4" fill="#c99a3e" />

        {/* sparkle */}
        <path d="M35 12 l0.9 2.1 2.1 0.9 -2.1 0.9 -0.9 2.1 -0.9 -2.1 -2.1 -0.9 2.1 -0.9 z" fill="#f6ead0" />
      </g>
    </svg>
  )
}
