import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        sora:   ['Sora', 'sans-serif'],
      },
      colors: {
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
    },
  },
  plugins: [],
};

export default config;