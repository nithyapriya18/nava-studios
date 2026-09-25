import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roast My Launch: a blunt review of your landing page',
  description:
    'Paste your landing page copy, your pitch, or a link, and get a blunt, specific review in about 20 seconds. Free.',
  openGraph: {
    title: 'Roast My Launch',
    description:
      'Paste your landing page or pitch and get a blunt, specific review in about 20 seconds. Free.',
  },
}

export default function RoastLayout({ children }: { children: React.ReactNode }) {
  return children
}
