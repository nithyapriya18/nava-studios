import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F1EE',
        surface: '#E8E3DF',
        'text-primary': '#1A1716',
        'text-muted': '#3D3835',
        accent: '#6E3C37',
        'accent-light': '#E8D9D5',
        border: '#C9C2BC',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '680px',
        layout: '1080px',
      },
      letterSpacing: {
        nava: '0.28em',
      },
    },
  },
  plugins: [],
}

export default config
