import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Verity Studio, after dark — deep night with a warm plum undertone,
        // cream-toned text, terracotta-to-candlelight-gold accents.
        background: '#16121F40',
        night: '#16121F',
        'night-surface': '#201A2B',
        'night-surface-2': '#2A2237',
        star: '#EFE6D8',
        'text-primary': '#FAF8F3',
        'text-muted': '#A79AA8',
        amber: '#E9A860',
        'amber-light': '#33241E',
        'amber-dark': '#D68C48',
        border: '#342A3E',
        danger: '#E2685C',
        'danger-light': '#3A2424',
        // New brand tokens
        terracotta: '#C96B3A',
        candle: '#F3C77E',
        cream: '#FAFAF7',
        'cream-tint': '#F5E6DC',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '620px',
        layout: '900px',
      },
      boxShadow: {
        candle: '0 0 20px rgba(233, 168, 96, 0.28), 0 0 48px rgba(201, 107, 58, 0.18)',
        'candle-lg':
          '0 0 24px rgba(233, 168, 96, 0.35), 0 0 72px rgba(201, 107, 58, 0.22)',
        card: '0 1px 0 rgba(250, 248, 243, 0.04) inset, 0 8px 24px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulseSlow 8s ease-in-out infinite',
        'step-in': 'stepIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'drift': 'drift 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        stepIn: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
