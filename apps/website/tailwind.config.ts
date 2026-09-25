import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F7',
        surface: '#F3F0EC',
        'text-primary': '#211A1B',
        'text-muted': '#5F5658',
        accent: '#6E3C37',
        'accent-light': '#EFE3DF',
        bead: '#D9C8C3',
        border: '#E6E0DB',
      },
      fontFamily: {
        sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '680px',
        layout: '1080px',
      },
    },
  },
  plugins: [],
}

export default config
