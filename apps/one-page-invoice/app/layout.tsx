import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import '@nava-studios/ui/globals.css'

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
  title: "One-Page Invoice — free GST invoice generator",
  description: "Create a professional, GST-ready invoice in 60 seconds. Free, no signup — download as PDF or send on WhatsApp.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-background text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
