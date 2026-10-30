import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { themeBoot } from '@/lib/theme-boot'
import { siteConfig, studio } from '@/config'
import { EDUCATION } from '@/lib/profile'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Headlines: the one typeface shared with Studio NPV, so the two read as family.
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

// Dates, labels and numbers.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: 'en_IN',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/nithya.jpeg'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F6F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0E' },
  ],
}

// Lets search engines connect this page, the studio and LinkedIn to one person.
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  image: `${siteConfig.url}/nithya.jpeg`,
  email: siteConfig.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  alumniOf: EDUCATION.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.org })),
  sameAs: [siteConfig.linkedin, studio()],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>
        <a href="#content" className="skip">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
