import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // CETTE LIGNE EST INDISPENSABLE POUR LE DARK MODE VIA THEMEPROVIDER
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        sora:   ['Sora', 'sans-serif'],
      },
      colors: {
        'supmti-blue': '#006666',
        'bg-primary':   '#0d0f14',
        'bg-secondary': '#13161e',
        'bg-sidebar':   '#111318',
        'bg-card':      '#1a1d27',
        'bg-input':     '#1e2130',
        'bg-hover':     '#232637',
        'bg-active':    '#2a2e42',
        'accent-orange':'#f97316',
        'accent-blue':  '#3b82f6',
        'accent-green': '#22c55e',
        'accent-purple':'#a855f7',
        'accent-pink':  '#ec4899',
        'accent-cyan':  '#06b6d4',
        'text-primary': '#e8eaf0',
        'text-secondary':'#8b90a0',
        'text-muted':   '#555a6e',
        'border-base':  'rgba(255,255,255,0.07)',
        'border-active':'rgba(249,115,22,0.4)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        scan: 'scan 3s linear infinite',
        shake: 'shake 0.2s ease-in-out 0s 2',
      },
    },
  },
  plugins: [],
};

export default config;