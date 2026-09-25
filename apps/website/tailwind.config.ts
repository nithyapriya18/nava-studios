import type { Config } from 'tailwindcss'

// Colours are CSS variables so a section can switch to the dark theme with a
// single class (.theme-dark in globals.css) and everything inside follows.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: v('bg'),
        surface: v('surface'),
        card: v('card'),
        'text-primary': v('fg'),
        'text-muted': v('muted'),
        accent: v('accent'),
        'accent-light': v('accent-soft'),
        border: v('border'),
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '680px',
        layout: '1120px',
      },
    },
  },
  plugins: [],
}

export default config
