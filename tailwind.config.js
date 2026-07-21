/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          100: '#d9e4ef',
          300: '#7fa0c2',
          500: '#35618f',
          700: '#1e4470',
          800: '#163356',
          900: '#0f2340',
          950: '#0a1830',
        },
        gold: {
          100: '#f6ead0',
          300: '#e6c780',
          400: '#d9ae5d',
          500: '#c99a3e',
          700: '#8a6a1f',
        },
        /* Wine — the school wordmark colour (primary brand accent) */
        wine: {
          300: '#c46a6a',
          500: '#9e2b32',
          700: '#7a1f26',
          900: '#4d1418',
        },
        /* Azure — the bright accent blocks on archangelschools.org.ng */
        azure: {
          300: '#5cc6ef',
          400: '#29a8e0',
          500: '#1690c8',
          700: '#0f6a93',
        },
        paper: {
          0: '#fffdf8',
          50: '#faf7ef',
          100: '#f3ede0',
        },
        ink: {
          100: '#ece6d9',
          200: '#d9d2c3',
          300: '#b3aa98',
          400: '#8b8272',
          500: '#6b6252',
          700: '#3c362c',
          900: '#191510',
        },
        status: {
          paid: '#1e8e5a',
          'paid-deep': '#17794f',
          'paid-soft': '#dcf1e6',
          partial: '#c77f1b',
          'partial-deep': '#a3690f',
          'partial-soft': '#faecd4',
          owing: '#c4362b',
          'owing-deep': '#a32b22',
          'owing-soft': '#fbe1de',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(15,35,64,0.06), 0 0 0 1px rgba(201,154,62,0.06)',
        'card-hover': '0 22px 50px rgba(15,35,64,0.18), 0 0 0 1px rgba(201,154,62,0.4), 0 0 36px rgba(201,154,62,0.20)',
        'gold-glow': '0 8px 24px rgba(201,154,62,0.35)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 8px 24px rgba(201,154,62,0.35)' },
          '50%': { boxShadow: '0 10px 40px rgba(201,154,62,0.65)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.04) translate(0, 0)' },
          '100%': { transform: 'scale(1.14) translate(-1.5%, -1.5%)' },
        },
        'ray-sweep': {
          '0%, 100%': { opacity: '0.45', transform: 'rotate(-2deg) scaleY(1)' },
          '50%': { opacity: '0.85', transform: 'rotate(2deg) scaleY(1.06)' },
        },
        'halo-breathe': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.12)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-2%,0) scale(1.06)' },
          '66%': { transform: 'translate3d(-2%,3%,0) scale(1.03)' },
        },
      },
      animation: {
        floaty: 'floaty 3.6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3.2s ease-in-out infinite',
        'ken-burns': 'ken-burns 22s ease-in-out infinite alternate',
        'ray-sweep': 'ray-sweep 9s ease-in-out infinite',
        'halo-breathe': 'halo-breathe 7s ease-in-out infinite',
        shimmer: 'shimmer 2.8s linear infinite',
        'mesh-drift': 'mesh-drift 26s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
