import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Terms of service',
  description: `Terms of service for ${siteConfig.name}.`,
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-content px-6 pt-16 md:px-8 md:pt-24">
      <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Terms of service</h1>
      <p className="mt-4 font-sans text-sm text-text-muted">Last updated 24 September 2026.</p>

      <div className="prose mt-10">
        <h2>1. Who I am</h2>
        <p>
          Studio NPV (&ldquo;I&rdquo;, &ldquo;me&rdquo;) is a one-person software studio run
          by {siteConfig.founderFull} in Bengaluru, India. These terms cover this
          website, the free tools on it (such as Landing Page Review), and custom product
          work I agree to in writing.
        </p>

        <h2>2. Custom work and fees</h2>
        <p>
          I scope and quote custom product work after a call. The first call isn&apos;t
          billed, and paid work starts when you accept the quote. Fees, timeline,
          ownership, and handoff are set out in the quote or a short written agreement.
          Unless we agree otherwise, the repository and hosting for custom work sit on
          your accounts after handoff.
        </p>

        <h2>3. Free tools on this site</h2>
        <p>
          Tools like Landing Page Review are free and provided as is, with reasonable use
          limits so they stay available for everyone. I may change or retire a free
          tool at any time.
        </p>

        <h2>4. Your data</h2>
        <p>
          You can ask me to delete data I hold about you by emailing{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. What I collect
          and why is in the <Link href="/privacy">privacy policy</Link>.
        </p>

        <h2>5. Acceptable use</h2>
        <p>
          Don&apos;t use this site to break the law, send spam or unsolicited messages,
          infringe anyone&apos;s rights, or try to disrupt it or gain unauthorised access
          to it.
        </p>

        <h2>6. Availability</h2>
        <p>
          This site and its free tools are provided &ldquo;as is&rdquo;. I work to keep them
          reliable, and I don&apos;t guarantee uninterrupted availability.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          To the maximum extent the law allows, my total liability for any claim
          arising from this site or custom work is limited to the amount you paid me in
          the 12 months before the claim. Output from the free tools is informal and
          isn&apos;t professional advice.
        </p>

        <h2>8. Governing law</h2>
        <p>
          These terms are governed by the laws of India, and the courts in Bengaluru,
          Karnataka have jurisdiction.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about these terms can go to{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </div>
  )
}
