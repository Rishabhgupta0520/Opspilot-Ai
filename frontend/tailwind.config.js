/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#0F1523',
          800: '#141D2E',
          700: '#1E293B',
          600: '#334155'
        },
        brand: {
          cyan:    '#38BDF8',
          blue:    '#3B82F6',
          indigo:  '#6366F1',
          emerald: '#10B981',
          amber:   '#F59E0B',
          rose:    '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle':         'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow':                 'glow 2s ease-in-out infinite alternate',
        'float':                'float-y 4s ease-in-out infinite',
        'float-slow':           'float-y 7s ease-in-out infinite',
        'float-delay':          'float-y 5s ease-in-out 1.5s infinite',
        'spin-slow':            'spin-slow 18s linear infinite',
        'spin-reverse-slow':    'spin-slow 24s linear infinite reverse',
        'neon-flicker':         'neon-flicker 5s step-end infinite',
        'scale-in':             'scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-up':             'slide-up-fade 0.45s ease both',
        'shimmer':              'shimmer 1.8s infinite',
        'packet':               'packet-travel 3s linear infinite',
        'packet-delay':         'packet-travel 3s 1.2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 15px rgba(56,189,248,0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(59,130,246,0.5)' }
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' }
        },
        'neon-flicker': {
          '0%, 95%, 100%': { opacity: 1 },
          '96%': { opacity: 0.6 },
          '97%': { opacity: 1 },
          '98%': { opacity: 0.4 },
          '99%': { opacity: 1 }
        },
        'scale-in': {
          from: { transform: 'scale(0.88)', opacity: 0 },
          to:   { transform: 'scale(1)',    opacity: 1 }
        },
        'slide-up-fade': {
          from: { transform: 'translateY(16px)', opacity: 0 },
          to:   { transform: 'translateY(0)',    opacity: 1 }
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'packet-travel': {
          '0%':   { left: '-8%',  opacity: 0 },
          '10%':  { opacity: 1 },
          '90%':  { opacity: 1 },
          '100%': { left: '108%', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}
