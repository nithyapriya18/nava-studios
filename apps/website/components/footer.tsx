import Link from 'next/link'
import { siteConfig, linkedinHref } from '@/config'
import { reviewHref, scopeHref } from '@/lib/products'
import { Wordmark } from '@/components/wordmark'
import { TrackedLink } from '@/components/tracked-link'

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-col">
            <Wordmark />
            <p className="muted" style={{ maxWidth: '34ch' }}>
              A one-person product studio in {siteConfig.location}, run by {siteConfig.founderFull}.
            </p>
          </div>
          <div className="ftr-col">
            <span className="label">Studio</span>
            <Link href="/start">How it works</Link>
            <Link href={reviewHref}>Crit</Link>
            <Link href={scopeHref}>Scope Cutter</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/about">About</Link>
          </div>
          <div className="ftr-col">
            <span className="label">Contact</span>
            <TrackedLink
              href={`mailto:${siteConfig.email}`}
              event="email_clicked"
              properties={{ location: 'footer' }}
            >
              {siteConfig.email}
            </TrackedLink>
            {linkedinHref ? (
              <TrackedLink
                href="/linkedin?from=footer"
                event="linkedin_opened"
                properties={{ location: 'footer' }}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                LinkedIn
              </TrackedLink>
            ) : null}
            <TrackedLink
              href="/resume?from=footer"
              download
              rel="nofollow"
              event="resume_downloaded"
              properties={{ location: 'footer' }}
            >
              Resume (PDF)
            </TrackedLink>
          </div>
          <div className="ftr-col">
            <span className="label">Help</span>
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refunds">Refunds</Link>
          </div>
        </div>
        <div className="ftr-base">
          <span className="muted" style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span className="hand" style={{ fontSize: 18 }}>
            made by hand in {siteConfig.location}
          </span>
        </div>
      </div>
    </footer>
  )
}
