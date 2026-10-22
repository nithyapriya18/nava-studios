import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { TileStack } from '@/components/tile-stack'
import { siteConfig, contactHref, contactIsExternal, linkedinHref } from '@/config'
import { CAREER } from '@/lib/process'
import { reviewHref } from '@/lib/products'
import { TrackedLink } from '@/components/tracked-link'
import { Arrow, Note } from '@/components/pen'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.founderFull} runs ${siteConfig.name} in Bengaluru. Ten years in software and product, including eight on AI products at Novartis and Resilinc.`,
}

// The detail shown under a role on the timeline, where there is one.
const DETAIL: Record<string, string> = {
  'Product manager, healthcare AI':
    'an NLP platform that redacts sensitive information from documents, with $6.4M in documented cost impact',
  'Lead product manager, supply chain AI': 'AI used by more than 500,000 people at large companies',
  Founder: 'designing and building software for founders and small businesses',
}

export default function AboutPage() {
  const ctaProps = contactIsExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  return (
    <TileStack>
      <section className="tile hero band" aria-labelledby="about-h">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <p className="label">About</p>
          <h1 id="about-h" className="display">
            Hi, I’m <em>Nithya</em>.
          </h1>
          <p className="lede" style={{ maxWidth: '46ch' }}>
            I run {siteConfig.name} from {siteConfig.location}. I design and build software for founders and
            small businesses: new products, customer-facing apps and internal tools, each for a fixed price
            agreed before work starts.
          </p>
          <Note>NPV are my initials</Note>
          <div className="btns">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              Get in touch <Arrow />
            </a>
            <TrackedLink
              href="/resume?from=about"
              download
              rel="nofollow"
              event="resume_downloaded"
              properties={{ location: 'about' }}
              className="btn-quiet"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M8 2.5v8m0 0L5 7.5m3 3l3-3M3 13.5h10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download my resume (PDF)
            </TrackedLink>
          </div>
        </div>
        <figure
          style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, width: '100%', justifySelf: 'end' }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '4 / 5',
              borderRadius: 20,
              overflow: 'hidden',
              background: 'var(--marigold)',
            }}
          >
            <Image
              src="/nithya.jpeg"
              alt={`Portrait of ${siteConfig.founderFull}`}
              fill
              sizes="(min-width: 1000px) 400px, 100vw"
              className="object-cover"
              preload
            />
          </div>
          <figcaption className="muted" style={{ fontSize: 14 }}>
            {siteConfig.founderFull} · {siteConfig.title}
          </figcaption>
        </figure>
      </section>

      <section className="tile section" aria-labelledby="work-h">
        <p className="label">How I work</p>
        <div className="section-body">
          <h2 id="work-h" className="pull">
            The person scoping your product is the one <em>building</em> it.
          </h2>
          <div className="measure muted">
            <p>
              Most of my time has been on the product side: talking to users, deciding what to build first
              and working with engineers to ship it. I started as an engineer, so when we weigh what you
              want against what it costs, both are in view.
            </p>
            <p>
              I build for the team and users you have today. If you need a system designed for very large
              scale from the start, I’ll say so on the first call and recommend what kind of team to look
              for instead.
            </p>
          </div>
        </div>
      </section>

      <section className="tile section" aria-labelledby="tl-h">
        <p className="label">Work so far</p>
        <div className="section-body">
          <h2 id="tl-h" className="h2">
            From engineer to product, and back to <em>building</em>
          </h2>
          <ol className="tl">
            {CAREER.map((c, i) => (
              <li key={`${c.year}-${c.role}`} className={`tl-item${i === CAREER.length - 1 ? ' now' : ''}`}>
                <span className="tl-dot" aria-hidden />
                <div className="tl-body">
                  <span className="tl-year">{c.year}</span>
                  <div>
                    <h3 className="h3">{c.role}</h3>
                    <p className="muted">
                      {c.place}
                      {DETAIL[c.role] ? ` · ${DETAIL[c.role]}` : ''}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 32px',
              alignItems: 'center',
              borderTop: '1px solid var(--rule)',
              paddingTop: 22,
            }}
          >
            <span>
              <span className="label">Certification</span>&nbsp;&nbsp;PSPO I, Scrum.org
            </span>
            <TrackedLink
              href="/resume?from=about"
              download
              rel="nofollow"
              event="resume_downloaded"
              properties={{ location: 'about_timeline' }}
              className="more"
            >
              Full resume (PDF) <Arrow />
            </TrackedLink>
            {linkedinHref && (
              <TrackedLink
                href="/linkedin?from=about"
                event="linkedin_opened"
                properties={{ location: 'about' }}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="more"
              >
                LinkedIn <Arrow />
              </TrackedLink>
            )}
          </div>
        </div>
      </section>

      <section className="tile section band-warm" aria-labelledby="see-h">
        <p className="label">Before we talk</p>
        <div className="section-body">
          <h2 id="see-h" className="h2">
            See how I think about a <em>product</em>
          </h2>
          <p className="measure muted">
            Run your landing page through Second Opinion, the free review tool I built. It’s a quick way to
            see what I look for before we’ve spoken.
          </p>
          <div className="btns">
            <Link href={reviewHref} className="btn-quiet">
              Try the free landing page review <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </TileStack>
  )
}
