import type { Config } from 'tailwindcss'

// Colours are CSS variables (RGB triplets in globals.css), so an indigo band,
// a light panel or dark mode can retheme everything inside with one class.
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
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        hand: ['var(--font-hand)', 'cursive'],
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
