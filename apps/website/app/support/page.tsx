import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig, contactHref, contactIsExternal } from '@/config'

export const metadata: Metadata = {
  title: 'Support',
  description: `How to reach ${siteConfig.founderFull} at ${siteConfig.name}.`,
}

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-content px-6 pt-16 md:px-8 md:pt-24">
      <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Support</h1>
      <p className="mt-6 text-xl leading-relaxed text-text-primary">
        Questions about a project, the landing page review, or this site come
        straight to me.
      </p>

      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-text-primary">Email</h2>
          <p className="mt-2 leading-relaxed text-text-muted">
            <a
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('Studio NPV support')}`}
              className="text-link"
            >
              {siteConfig.email}
            </a>
            . I usually reply within a few working days.
          </p>
        </section>

        {contactIsExternal ? (
          <section>
            <h2 className="text-xl font-semibold text-text-primary">A new project</h2>
            <p className="mt-2 leading-relaxed text-text-muted">
              For a new idea, it&apos;s quicker to{' '}
              <a href={contactHref} target="_blank" rel="noopener noreferrer" className="text-link">
                book a call
              </a>
              .
            </p>
          </section>
        ) : null}

        <section>
          <h2 className="text-xl font-semibold text-text-primary">Useful pages</h2>
          <ul className="mt-2 space-y-1 text-text-muted">
            <li>
              <Link href="/start" className="text-link">
                How a project works
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-link">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-link">
                Terms of service
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-16 font-sans text-sm text-text-muted">
        {siteConfig.name} is run by {siteConfig.founderFull} in {siteConfig.location}.
      </p>
    </div>
  )
}
