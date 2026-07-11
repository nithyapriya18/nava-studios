import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'Snugglefox — Bedtime stories, made just for them',
  description:
    'Turn tonight\'s idea into a personalized bedtime story for your child — read it together or let a soothing voice narrate it.',
}

export const viewport: Viewport = {
  themeColor: '#16121F',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} dark`}>
      <body>{children}</body>
    </html>
  )
}
