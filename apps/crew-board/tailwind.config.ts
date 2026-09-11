import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/kit/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF7',
        surface: '#F4F1EB',
        'text-primary': '#1A1A18',
        'text-muted': '#6B6B63',
        accent: '#C96B3A',
        'accent-light': '#F5E6DC',
        border: '#E5E2D9',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '760px',
        layout: '1100px',
      },
    },
  },
  plugins: [],
}

export default config
