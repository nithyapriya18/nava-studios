import Link from 'next/link'
import { siteConfig, linkedinHref } from '@/config'
import { Logo } from '@/components/logo'

const links = [
  { href: '/start', label: 'How it works' },
  { href: '/lab', label: 'Lab' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/support', label: 'Support' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-layout gap-10 px-6 py-12 font-sans md:grid-cols-[1fr_auto] md:px-8">
        <div>
          <Logo size={34} direction="row" />
          <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-text-muted">
            A one-person product studio in {siteConfig.location}. Nava (NAH-vuh) is
            Sanskrit for new. It also means nine.
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
              <a href={`mailto:${siteConfig.email}`} className="text-link">
                {siteConfig.email}
              </a>
            </li>
            {linkedinHref ? (
              <li>
                <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className="text-link">
                  LinkedIn
                </a>
              </li>
            ) : null}
            <li>
              <a href={siteConfig.resumeFile} download className="text-link">
                Resume (PDF)
              </a>
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
