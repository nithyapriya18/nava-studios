import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  siteConfig,
  contactHref,
  contactLabel,
  contactIsExternal,
} from '@/config'
import { CAREER } from '@/lib/process'
import { reviewHref } from '@/lib/products'
import { TrackedLink } from '@/components/tracked-link'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.founderFull} runs ${siteConfig.name} in Bengaluru. Ten years in software and product, including eight on AI products at Novartis and Resilinc.`,
}

export default function AboutPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <>
      <div className="mx-auto max-w-layout px-6 pb-8 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[260px_minmax(0,1fr)] md:gap-20">
          <aside className="md:sticky md:top-28 md:self-start">
            <div className="relative aspect-[4/5] max-w-[260px] overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(1,41,135,0.45)]">
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
              <span className="block text-text-primary">
                {siteConfig.founderFull}
              </span>
              <span className="text-text-muted">{siteConfig.title}</span>
            </p>
          </aside>

          <div className="max-w-2xl">
            <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">
              Hi, I&apos;m Nithya.
            </h1>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-text-primary">
              <p>
                I run {siteConfig.name} from Bengaluru, where I design and build
                software for founders and small businesses. NPV are my initials.
              </p>
              <p className="text-text-muted">
                I started as a software engineer at Tech Mahindra in 2014. At
                Novartis I moved into data science and then into product for
                healthcare AI, where I worked on an NLP redaction platform with
                $6.4M in documented cost impact. At Resilinc I led product for
                supply chain AI used by more than 500,000 enterprise users.
                After that I was a founding product manager on multi-agent
                systems at early-stage companies.
              </p>
              <p className="text-text-muted">
                Most of that time was spent on the product side: talking to
                users, deciding what to build first, and working closely with
                engineers to ship it. Because I started as an engineer, I build
                as well. For a founder, that means the person scoping your
                product is also the one building it, and the trade-offs between
                what you want and what it takes are made with both in view.
              </p>
              <p className="text-text-muted">
                I build for the team and the users you have today. If you need a
                system designed for very large scale from the start, I&apos;ll
                say so on our first call and tell you what kind of team to look
                for instead.
              </p>
              <p className="text-text-muted">
                If you want to see how I think about a product before we talk,
                try{' '}
                <Link href={reviewHref} className="text-link">
                  the free landing page review
                </Link>
                . I also hold the PSPO I certification from Scrum.org.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={contactHref} className="btn-primary" {...ctaProps}>
                {contactLabel}
              </a>
              <TrackedLink
                href={siteConfig.resumeFile}
                download
                event="resume_downloaded"
                properties={{ location: 'about' }}
                className="font-sans text-[0.9375rem] text-link"
              >
                Download my resume (PDF)
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>

      <section className="theme-dark mt-20 py-20 md:py-24">
        <div className="mx-auto max-w-layout px-6 md:px-8">
          <h2 className="fade-up text-3xl font-semibold text-text-primary md:text-4xl">
            Work so far
          </h2>
          <ol className="mt-10 border-t border-border font-sans">
            {CAREER.map((c) => (
              <li
                key={`${c.year}-${c.role}`}
                className="fade-up grid grid-cols-[4rem_1fr] gap-4 border-b border-border py-5 md:grid-cols-[6rem_1fr_auto]"
              >
                <span className="text-grad font-semibold tabular-nums">
                  {c.year}
                </span>
                <span className="text-lg text-text-primary">{c.role}</span>
                <span className="col-start-2 text-text-muted md:col-start-auto md:text-right">
                  {c.place}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
