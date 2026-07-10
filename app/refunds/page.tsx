import type { Metadata } from 'next'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Refund Policy — Verity Studio',
  description: 'Refund and cancellation policy for Verity Studio products.',
}

export default function RefundsPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-8">
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: 10 July 2026</p>

        <div className="mt-10 space-y-8 text-base leading-[1.75] text-text-muted">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              The short version
            </h2>
            <p>
              If a paid plan isn&apos;t working out within the first 14 days, tell
              us and we&apos;ll refund it. No forms, no questions you have to
              justify.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              14-day refunds
            </h2>
            <p>
              Any first purchase of a paid plan (monthly or annual) is eligible for
              a full refund within 14 days of payment. Email{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>{' '}
              from the address on your account. Refunds are issued to the original
              payment method within 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              Cancellation
            </h2>
            <p>
              You can cancel any subscription at any time from within the product
              or by email. Your plan stays active until the end of the period
              you&apos;ve paid for, and you won&apos;t be charged again. We
              don&apos;t do cancellation fees.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              Renewals
            </h2>
            <p>
              Renewal charges (after the first period) aren&apos;t automatically
              refundable, but if a renewal caught you by surprise, email us within
              7 days and we&apos;ll sort it out fairly.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              Discontinued products
            </h2>
            <p>
              If we ever discontinue a paid product, you get at least 30 days&apos;
              notice, a data export path, and a pro-rata refund of any unused paid
              period.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
