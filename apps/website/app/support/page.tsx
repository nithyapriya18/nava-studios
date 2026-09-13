import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'

export const metadata: Metadata = {
  title: 'Support',
  description: `Get help from ${siteConfig.name}.`,
}

export default function SupportPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <div>
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-accent mb-3">Help</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
                Support
              </h1>
              <p className="text-text-muted text-lg leading-relaxed mb-10">
                Questions about a project, or this site. I answer these myself.
              </p>

              <div className="space-y-6 mb-12">
                <a
                  href={contactHref}
                  className="flex items-start gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6 hover:border-accent/40 transition-colors group"
                  {...ctaProps}
                >
                  <div className="rounded-xl bg-accent/10 p-3 text-accent group-hover:bg-accent/15 transition-colors">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-text-primary mb-1">
                      {contactLabel}
                    </h2>
                    <p className="text-text-muted text-sm mt-2">
                      Best for a new product. For anything else, email is fine.
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('Nava Studios — Support')}`}
                  className="flex items-start gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6 hover:border-accent/40 transition-colors group"
                >
                  <div className="rounded-xl bg-accent/10 p-3 text-accent group-hover:bg-accent/15 transition-colors">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-text-primary mb-1">
                      Email
                    </h2>
                    <p className="text-accent font-medium">{siteConfig.email}</p>
                    <p className="text-text-muted text-sm mt-2">
                      I typically reply within a few business days. I check
                      email less often than the calendar.
                    </p>
                  </div>
                </a>
              </div>

              <div className="rounded-2xl bg-surface/60 border border-border/40 p-6 md:p-8">
                <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
                  Quick links
                </h2>
                <ul className="space-y-3 text-text-muted">
                  <li>
                    <Link href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-accent hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/lab" className="text-accent hover:underline">
                      Personal projects
                    </Link>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-text-muted mt-10">
                Operated by {siteConfig.name}, Bengaluru.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
