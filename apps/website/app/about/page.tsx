import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { CAREER } from '@/lib/nine'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.founderFull}, founder of ${siteConfig.name}. Ten years shipping software, now building first versions for small and mid-size teams.`,
}

export default function AboutPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <div className="mx-auto max-w-layout px-6 pb-8 pt-16 md:px-8 md:pt-24">
      <div className="grid gap-12 md:grid-cols-[260px_minmax(0,1fr)] md:gap-20">
        <aside className="md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] max-w-[260px] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/nithya.jpeg"
              alt="Nithyapriya Veeraraghavan"
              fill
              className="object-cover object-center"
              sizes="260px"
              priority
            />
          </div>
          <p className="mt-3 font-sans text-sm leading-snug">
            <span className="block text-text-primary">{siteConfig.founderFull}</span>
            <span className="text-text-muted">{siteConfig.title}</span>
          </p>
        </aside>

        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">
            Hi, I&apos;m Nithya.
          </h1>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-text-primary">
            <p>
              I run Nava Studios on my own from Bengaluru. Nava (NAH-vuh) is Sanskrit
              for new, and it also means nine. You bring an idea and I build the first
              version you can use.
            </p>
            <p className="text-text-muted">
              I started as a software engineer in 2014. At Novartis I moved into data
              science and then healthcare AI, where I worked on an NLP redaction
              platform with $6.4M in documented cost impact. At Resilinc I led product
              for supply chain AI used by more than 500,000 enterprise users. After
              that I worked on multi-agent systems as a founding product manager at
              early-stage companies.
            </p>
            <p className="text-text-muted">
              That history matters for a first product because I can own all of it:
              working out what version one has to do, building it, and handing it
              over. I size the first version for the team you have now. I&apos;m still
              learning how to scale systems past that, and I&apos;ll tell you if
              that&apos;s what you need.
            </p>
            <p className="text-text-muted">
              By default the code and hosting sit on your accounts. If you&apos;d like a
              &ldquo;Built by Nava Studios&rdquo; credit on the product, or want me to
              keep hosting it, we can arrange that.
            </p>
            <p className="text-text-muted">
              Two apps I built for home, a meal planner and a bedtime story app, are in
              the{' '}
              <Link href="/lab" className="text-link">
                lab
              </Link>
              . I keep using them, which is the best test I know of whether software
              holds up on ordinary days. I also hold PSPO I from Scrum.org.
            </p>
          </div>

          <h2 className="mt-16 text-2xl font-semibold text-text-primary">Work so far</h2>
          <ol className="mt-6 border-t border-border font-sans">
            {CAREER.map((c) => (
              <li
                key={`${c.year}-${c.role}`}
                className="grid grid-cols-[4rem_1fr] gap-4 border-b border-border py-4 md:grid-cols-[5rem_1fr_auto]"
              >
                <span className="tabular-nums text-text-muted">{c.year}</span>
                <span className="text-text-primary">{c.role}</span>
                <span className="col-start-2 text-text-muted md:col-start-auto md:text-right">
                  {c.place}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              {contactLabel}
            </a>
            <a href={siteConfig.resumeFile} download className="font-sans text-[0.9375rem] text-link">
              Download my resume (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
