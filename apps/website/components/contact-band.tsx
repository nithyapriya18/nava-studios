import type { ReactNode } from 'react'
import Link from 'next/link'
import { siteConfig, mailtoHref } from '@/config'
import { ContactForm } from '@/components/contact-form'
import { TrackedLink } from '@/components/tracked-link'

const next = [
  'I reply by email, usually with a few questions.',
  'We talk through the idea on a call.',
  'You get a written scope and a fixed price.',
]

/** The indigo band with the contact form: the end of Home, and all of /contact. */
export function ContactBand({ page = false, title }: { page?: boolean; title: ReactNode }) {
  const Heading = page ? 'h1' : 'h2'
  const body = (
    <div className="contact">
      <div style={{ display: 'flex', flexDirection: 'column', gap: page ? 28 : 22 }}>
        {page && <p className="label">Get in touch</p>}
        <Heading
          id="contact-h"
          className={page ? 'display' : 'h2'}
          style={page ? { fontSize: 'clamp(44px, 6vw, 76px)' } : undefined}
        >
          {title}
        </Heading>
        <p className={page ? 'lede' : 'muted'}>
          A few lines on what you want to build and who it’s for is enough. There’s no cost or
          commitment at this stage.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="label">What happens next</span>
          <ol className="next">
            {next.map((step, i) => (
              <li key={step}>
                <span className="step-n">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div
          className="muted"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 15,
            ...(page ? { borderTop: '1px solid var(--rule)', paddingTop: 22 } : {}),
          }}
        >
          <span>
            Prefer email?{' '}
            <TrackedLink href={mailtoHref} event="email_clicked" properties={{ location: 'contact_panel' }}>
              {siteConfig.email}
            </TrackedLink>
          </span>
          {page && (
            <span>
              Want to know who you’d be working with? <Link href="/about">About me</Link> ·{' '}
              <TrackedLink
                href="/resume?from=contact"
                download
                rel="nofollow"
                event="resume_downloaded"
                properties={{ location: 'contact' }}
              >
                Resume (PDF)
              </TrackedLink>
            </span>
          )}
        </div>
      </div>
      <div style={{ alignSelf: 'start' }}>
        <ContactForm />
      </div>
    </div>
  )

  if (page) {
    return (
      <div className="band" style={{ padding: '56px 0 64px' }}>
        {body}
      </div>
    )
  }
  return (
    <section className="tile section band" aria-labelledby="contact-h" id="contact">
      <p className="label">Get in touch</p>
      <div className="section-body">{body}</div>
    </section>
  )
}
