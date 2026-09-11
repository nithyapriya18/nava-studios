import Link from 'next/link'
import { siteConfig, linkedinHref } from '@/config'
import { Logo } from '@/components/logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-layout mx-auto px-6 md:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <Logo size={40} />
            <p className="mt-3 text-sm text-text-muted max-w-xs">
              {siteConfig.founder}. From idea to a first product you can use.
            </p>
            <p className="mt-1 text-xs text-text-muted">{siteConfig.location}</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted">
            <Link href="/lab" className="hover:text-accent">
              Lab
            </Link>
            <Link href="/about" className="hover:text-accent">
              About
            </Link>
            <Link href="/start" className="hover:text-accent">
              Start
            </Link>
            <Link href="/writing" className="hover:text-accent">
              Writing
            </Link>
            <a href={siteConfig.resumeFile} download className="hover:text-accent">
              Resume
            </a>
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            {linkedinHref ? (
              <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                LinkedIn
              </a>
            ) : null}
            <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
              Email
            </a>
          </div>
        </div>
        <p className="mt-8 text-sm text-text-muted">
          Nava is Sanskrit for new — said NAH-vuh — and also nine. ©{' '}
          {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  )
}
