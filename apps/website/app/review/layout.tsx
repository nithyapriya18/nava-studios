import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Landing Page Review: a free, detailed review of your landing page',
  description:
    'Paste your landing page copy, your pitch or a link and get a detailed review in under a minute, with the fixes as an AI prompt or a plan. Free, two reviews a day.',
  openGraph: {
    title: 'Landing Page Review',
    description:
      'A detailed review of your landing page in under a minute, with the fixes as an AI prompt or a plan.',
  },
}

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children
}
