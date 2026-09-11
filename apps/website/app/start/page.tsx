import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { NINE } from '@/lib/nine'
import { NineBoard } from '@/components/nine-board'

export const metadata: Metadata = {
  title: 'Start',
  description: `How to work with ${siteConfig.name}. An unpaid call, then a quote, then a first product.`,
}

export default function StartPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <div>
      <section className="bg-background py-20 md:py-28">
        <div className="max-w-layout mx-auto px-6 md:px-8 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-medium text-text-primary leading-tight mb-6">
            How we start
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Book a conversation. Bring the idea as it stands — a paragraph, a spec, or
            a list of screens. The first call is unpaid. If we go ahead, you get a
            scope and a quote before I write code. Paid work starts at kickoff.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8 max-w-2xl">
          <h2 className="text-2xl font-medium text-text-primary mb-4">Who this is for</h2>
          <p className="text-text-muted leading-relaxed">
            Founders and operators who need a first product a small or mid-size
            team can run. I also take an existing process and turn it into
            software, when that is the clearer need. I work with you directly.
            There is no handoff to another team during the build.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl font-medium text-text-primary mb-3">The nine steps</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Nava also means nine. Every engagement follows this sequence.
            </p>
          </div>
          <NineBoard />
          <div className="mt-12 space-y-8 max-w-2xl">
            {NINE.map((stage) => (
              <div key={stage.n} className="flex gap-6">
                <span className="text-xs tracking-widest text-text-muted w-8 shrink-0 pt-1">
                  {String(stage.n).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">{stage.verb}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{stage.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8 max-w-2xl">
          <h2 className="text-2xl font-medium text-text-primary mb-4">Fees</h2>
          <p className="text-text-muted leading-relaxed">
            You see a number after we talk, before implementation. I do not
            bill open-ended hours on the main build. Continue work — keeping
            the product running, or building the next piece — is quoted when
            you want it.
          </p>
        </div>
      </section>

      <section id="book" className="bg-background py-20 md:py-28 scroll-mt-20">
        <div className="max-w-layout mx-auto px-6 md:px-8 max-w-xl">
          <h2 className="text-3xl font-medium text-text-primary mb-4">Get in touch</h2>
          <p className="text-text-muted leading-relaxed mb-8">
            Opens an email to me with a short draft. Add a few lines about
            what you want to build, then send.
          </p>
          <a href={contactHref} className="btn-primary" {...ctaProps}>
            {contactLabel}
          </a>
          <p className="mt-6">
            <a
              href={siteConfig.resumeFile}
              download
              className="text-sm text-text-muted hover:text-accent underline underline-offset-4"
            >
              Prefer to read my background first? Download the resume.
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
