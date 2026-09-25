import Link from 'next/link'
import { siteConfig, linkedinHref } from '@/config'
import { Wordmark } from '@/components/wordmark'
import { TrackedLink } from '@/components/tracked-link'

const links = [
  { href: '/start', label: 'How it works' },
  { href: '/products', label: 'Products' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/support', label: 'Support' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

export function Footer() {
  return (
    <footer className="theme-dark relative z-10 mt-24">
      <div className="mx-auto grid max-w-layout gap-10 px-6 py-14 font-sans md:grid-cols-[1fr_auto] md:px-8">
        <div>
          <Wordmark className="text-2xl" />
          <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-text-muted">
            A product studio in {siteConfig.location}, run by {siteConfig.founderFull}. It
            designs and builds software for founders and small businesses.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-[0.9375rem] md:items-end">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-text-muted md:justify-end">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            <li>
              <TrackedLink
                href={`mailto:${siteConfig.email}`}
                event="email_clicked"
                properties={{ location: 'footer' }}
                className="text-link"
              >
                {siteConfig.email}
              </TrackedLink>
            </li>
            {linkedinHref ? (
              <li>
                <TrackedLink
                  href="/linkedin?from=footer"
                  event="linkedin_opened"
                  properties={{ location: 'footer' }}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-link"
                >
                  LinkedIn
                </TrackedLink>
              </li>
            ) : null}
            <li>
              <TrackedLink
                href="/resume?from=footer"
                download
                rel="nofollow"
                event="resume_downloaded"
                properties={{ location: 'footer' }}
                className="text-link"
              >
                Resume (PDF)
              </TrackedLink>
            </li>
          </ul>
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
