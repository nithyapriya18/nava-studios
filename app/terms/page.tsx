import type { Metadata } from 'next'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Terms of Service — Verity Studio',
  description: 'Terms of service for Verity Studio products.',
}

export default function TermsPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-8">
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: 10 July 2026</p>

        <div className="mt-10 space-y-8 text-base leading-[1.75] text-text-muted">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              1. Who we are
            </h2>
            <p>
              Verity Studio (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a software
              studio operated as a sole proprietorship in Bengaluru, India. These
              terms govern your use of the tools and services available on this
              website (the &ldquo;Services&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              2. Your account
            </h2>
            <p>
              Some Services require an account. You are responsible for keeping
              your login credentials safe and for all activity under your account.
              You must be at least 18 to create an account. Accounts for
              family-oriented products (such as SnuggleFox) must be created and
              operated by a parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              3. Payments and subscriptions
            </h2>
            <p>
              Paid plans are billed in advance on a monthly or annual basis at the
              prices shown on each product page. Prices include applicable taxes
              unless stated otherwise. You can cancel any time; your plan stays
              active until the end of the paid period. Refunds are handled per our{' '}
              <a href="/refunds" className="text-accent hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              4. Your data
            </h2>
            <p>
              Your data stays yours. You can export it at any time where the
              product provides an export, and you can ask us to delete it by
              emailing{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>
              . Details of what we collect and why are in the{' '}
              <a href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              5. Acceptable use
            </h2>
            <p>
              Don&apos;t use the Services to break the law, to send spam or
              unsolicited messages, to infringe others&apos; rights, or to attempt
              to disrupt or gain unauthorised access to the Services. Tools that
              send messages (such as reminders) may only be used to contact people
              who have a genuine business relationship with you.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              6. Service changes and availability
            </h2>
            <p>
              The Services are provided &ldquo;as is&rdquo;. We work hard to keep
              them reliable, but we do not guarantee uninterrupted availability.
              Products marked Beta may change or be withdrawn. If a paid product is
              discontinued, we will give at least 30 days&apos; notice and refund
              any unused paid period.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, our total liability for any
              claim arising out of the Services is limited to the amount you paid
              us in the 12 months before the claim. The Services provide tools, not
              professional advice — outputs such as tax calculations and invoice
              formats should be verified with a qualified professional for your
              situation.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              8. Governing law
            </h2>
            <p>
              These terms are governed by the laws of India, with courts in
              Bengaluru, Karnataka having jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              9. Contact
            </h2>
            <p>
              Questions about these terms:{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
