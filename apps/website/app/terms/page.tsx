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
        <p className="mt-2 text-sm text-text-muted">Last updated: 13 September 2026</p>

        <div className="mt-10 space-y-8 text-base leading-[1.75] text-text-muted">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              1. Who I am
            </h2>
            <p>
              Nava Studios (&ldquo;I&rdquo;, &ldquo;me&rdquo;) is a one-person software studio
              operated by Nithyapriya Veeraraghavan in Bengaluru, India. These
              terms cover this website, the free tools on it (such as Roast My
              Launch), and custom product work I agree in writing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              2. Custom work and fees
            </h2>
            <p>
              Custom product work is scoped and quoted after a call. Paid work
              starts when you accept that quote. The first call itself is not
              billed. Fees, timeline, ownership, and handoff are in the quote
              or a short written agreement. By default, the repository and
              hosting for custom work sit on your accounts after handoff,
              unless we agree otherwise.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              3. Free tools on this site
            </h2>
            <p>
              Tools like Roast My Launch are free and provided as-is, with
              reasonable use limits to keep them available for everyone. I may
              change or retire a free tool at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              4. Your data
            </h2>
            <p>
              You can ask me to delete data I hold about you by emailing{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                {siteConfig.email}
              </a>
              . Details of what I collect and why are in the{' '}
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
              Don&apos;t use this site to break the law, to send spam or
              unsolicited messages, to infringe others&apos; rights, or to
              attempt to disrupt or gain unauthorised access to it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              6. Availability
            </h2>
            <p>
              This site and its free tools are provided &ldquo;as is&rdquo;. I
              work to keep them reliable, but I do not guarantee uninterrupted
              availability.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, my total liability for
              any claim arising out of this site or custom work is limited to
              the amount you paid me in the 12 months before the claim. Free
              tools provide informal output, not professional advice.
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
