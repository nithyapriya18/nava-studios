import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roast My Launch — free, honest feedback',
  description:
    'Paste your landing page, pitch, or product copy and get the specific, funny, actually-useful verdict your friends are too nice to give you.',
  openGraph: {
    title: 'Roast My Launch',
    description:
      'Free, honest, specific feedback on your landing page or pitch — in about 20 seconds.',
  },
}

export default function RoastLayout({ children }: { children: React.ReactNode }) {
  return children
}
