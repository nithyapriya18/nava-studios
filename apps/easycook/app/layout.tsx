import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { Providers } from './providers'
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
  title: 'EasyCook — Smart Meal Planner',
  description: 'Personalised weekly meal plans, grocery lists, and pantry tracking for your household.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
