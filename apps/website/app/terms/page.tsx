import type { Metadata } from 'next'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Nava Studios.',
}

export default function TermsPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-8">
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: 18 August 2026</p>

        <div className="mt-10 space-y-8 text-base leading-[1.75] text-text-muted">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              1. Who we are
            </h2>
            <p>
              Nava Studios (“we”, “us”) is a one-person software studio
              operated by Nithyapriya Veeraraghavan in Bengaluru, India. These
              terms cover this website, personal tools hosted here (such as the
              GST Calculator), and custom product work we agree in writing.
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
              3. Custom work and fees
            </h2>
            <p>
              Custom product work is scoped and quoted after a call. Paid work
              starts when you accept that quote. The first call itself is not
              billed. Fees, timeline, ownership, and handoff are in the quote
              or a short written agreement. By default, the repository and
              hosting for custom work sit on your accounts after handoff,
              unless we agree otherwise. Refunds for custom work follow that
              agreement, not the subscription terms below.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              4. Hosted tools
            </h2>
            <p>
              Some personal tools on this site (for example the GST Calculator)
              can be used without a custom-work quote. If a paid plan exists for
              a tool, prices will be shown in that product. Refunds for those
              plans are in the{' '}
              <a href="/refunds" className="text-accent hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              5. Your data
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
              6. Acceptable use
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
              7. Service changes and availability
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
              8. Limitation of liability
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
              9. Governing law
            </h2>
            <p>
              These terms are governed by the laws of India, with courts in
              Bengaluru, Karnataka having jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              10. Contact
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
