import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF7',
        surface: '#F4F1EB',
        'surface-2': '#EDE9DF',
        'text-primary': '#1A1A18',
        'text-muted': '#6B6B63',
        accent: '#C96B3A',
        'accent-light': '#F5E6DC',
        'accent-dark': '#A8532B',
        border: '#E5E2D9',
        success: '#3A7D44',
        'success-light': '#E6F4E8',
        warning: '#C9963A',
        'warning-light': '#F5F0DC',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '760px',
        layout: '1100px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
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
      },
    },
  },
  plugins: [],
}

export default config
