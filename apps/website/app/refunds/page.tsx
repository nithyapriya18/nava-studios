import type { Metadata } from 'next'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund and cancellation policy for Nava Studios.',
}

export default function RefundsPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-8">
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: 18 August 2026</p>

        <div className="mt-10 space-y-8 text-base leading-[1.75] text-text-muted">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              Custom product work
            </h2>
            <p>
              The first call is not billed. Once you accept a quote, that
              agreement governs payment and any refund. If we have not started
              the build, unused fees are refundable. After kickoff, refunds
              (if any) are pro-rata for work not yet done, as written in the
              quote.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              Hosted tools
            </h2>
            <p>
              If a hosted tool has a paid plan, a first purchase is eligible
              for a full refund within 14 days of payment. Email{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>
              . Refunds go to the original payment method within 5–7 business
              days. You can cancel a subscription at any time; it stays active
              until the end of the period already paid.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
