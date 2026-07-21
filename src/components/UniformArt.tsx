/* Mockup uniform artwork — swap for real product photos in /public/assets/uniforms/. */

export type ArtKind = 'boys' | 'girls' | 'sports' | 'cardigan' | 'tie' | 'socks'

export function UniformArt({ kind }: { kind: ArtKind }) {
  const gold = '#c99a3e'
  const navy = '#163356'
  const paper = '#fffdf8'
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full">
      <rect width="200" height="160" fill="#f3ede0" />
      <circle cx="100" cy="80" r="64" fill="#faf7ef" />
      {kind === 'boys' && (
        <g>
          <path d="M70 45 L100 38 L130 45 L138 62 L124 68 L124 100 L76 100 L76 68 L62 62 Z" fill={paper} stroke={navy} strokeWidth="2" />
          <path d="M70 45 L100 38 L130 45 L138 62 L124 68 L124 100 L76 100 L76 68 L62 62 Z" fill="url(#chk)" opacity="0.5" />
          <rect x="80" y="102" width="40" height="26" rx="3" fill={navy} />
          <line x1="100" y1="102" x2="100" y2="128" stroke="#0a1830" strokeWidth="2" />
          <defs>
            <pattern id="chk" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="none" />
              <path d="M0 5 H10 M5 0 V10" stroke={navy} strokeWidth="1" opacity="0.55" />
            </pattern>
          </defs>
        </g>
      )}
      {kind === 'girls' && (
        <g>
          <path d="M84 42 L100 38 L116 42 L112 58 L88 58 Z" fill={paper} stroke={navy} strokeWidth="2" />
          <path d="M86 56 L114 56 L126 122 L74 122 Z" fill={navy} />
          <path d="M92 56 L108 56 L108 88 L92 88 Z" fill={navy} stroke={gold} strokeWidth="1.4" />
          <circle cx="100" cy="66" r="2.2" fill={gold} />
        </g>
      )}
      {kind === 'sports' && (
        <g>
          <path d="M68 48 L100 42 L132 48 L138 64 L126 68 L126 104 L74 104 L74 68 L62 64 Z" fill={gold} stroke="#8a6a1f" strokeWidth="2" />
          <path d="M74 68 L74 104 L126 104 L126 68" fill="none" />
          <rect x="78" y="106" width="44" height="24" rx="3" fill={navy} />
          <line x1="74" y1="86" x2="126" y2="86" stroke={navy} strokeWidth="4" />
        </g>
      )}
      {kind === 'cardigan' && (
        <g>
          <path d="M66 50 L100 42 L134 50 L140 70 L128 74 L128 118 L72 118 L72 74 L60 70 Z" fill={navy} stroke="#0a1830" strokeWidth="2" />
          <path d="M100 42 L100 118" stroke={gold} strokeWidth="2.4" />
          <circle cx="94" cy="70" r="1.8" fill={gold} />
          <circle cx="94" cy="84" r="1.8" fill={gold} />
          <circle cx="94" cy="98" r="1.8" fill={gold} />
          <path d="M72 74 L60 70 L66 50" fill="none" stroke={gold} strokeWidth="1.2" />
        </g>
      )}
      {kind === 'tie' && (
        <g>
          <path d="M94 38 L106 38 L102 50 L98 50 Z" fill={navy} />
          <path d="M98 50 L102 50 L108 108 L100 122 L92 108 Z" fill={navy} />
          <path d="M95 62 L107 74 M93 76 L105 88 M91 90 L103 102" stroke={gold} strokeWidth="3" />
        </g>
      )}
      {kind === 'socks' && (
        <g>
          <path d="M84 44 L104 44 L104 92 Q104 112 86 112 Q70 112 72 96 L84 88 Z" fill={paper} stroke={navy} strokeWidth="2" />
          <rect x="84" y="44" width="20" height="10" fill={navy} />
          <rect x="84" y="58" width="20" height="4" fill={gold} />
          <path d="M108 52 L126 52 L126 96 Q126 114 110 114 Q96 114 98 100 L108 92 Z" fill={paper} stroke={navy} strokeWidth="2" opacity="0.85" />
          <rect x="108" y="52" width="18" height="9" fill={navy} />
        </g>
      )}
    </svg>
  )
}
