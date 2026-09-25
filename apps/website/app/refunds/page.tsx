import type { Metadata } from 'next'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Refund policy',
  description: `Refund and cancellation policy for ${siteConfig.name}.`,
}

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-content px-6 pt-16 md:px-8 md:pt-24">
      <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Refund policy</h1>
      <p className="mt-4 font-sans text-sm text-text-muted">Last updated 24 September 2026.</p>

      <div className="prose mt-10">
        <h2>Custom product work</h2>
        <p>
          The first call isn&apos;t billed. Once you accept a quote, that agreement sets
          out payment and any refund. If I haven&apos;t started the build, unused fees
          are refundable. After kickoff, any refund is pro rata for work not yet done,
          as written in the quote.
        </p>

        <h2>Free tools</h2>
        <p>
          The tools on this site, such as Roast My Launch, are free, so there&apos;s
          nothing to refund. If that ever changes for a tool, this page will say so.
        </p>

        <h2>Questions</h2>
        <p>
          Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </div>
  )
}
