import type { Metadata } from 'next'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { NINE } from '@/lib/nine'
import { Timeline } from '@/components/ui/timeline'

export const metadata: Metadata = {
  title: 'How it works',
  description: `How a project with ${siteConfig.name} runs, from the first call to handoff. You see a fixed quote before any code is written.`,
}

export default function StartPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <div className="mx-auto max-w-layout px-6 pt-16 md:px-8 md:pt-24">
      <header className="max-w-2xl">
        <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">How it works</h1>
        <p className="mt-6 text-xl leading-relaxed text-text-primary">
          Send me the idea as it stands. A paragraph is enough, and so is a full
          spec. The first call is unpaid, you see a scope and a quote before I write
          any code, and paid work starts at kickoff.
        </p>
      </header>

      <section className="mt-20 md:mt-24" aria-labelledby="steps">
        <h2 id="steps" className="sr-only">
          The nine steps
        </h2>
        <p className="mb-12 max-w-xl font-sans text-text-muted">
          Every project follows the same nine steps. The markers are the nine beads
          from the Nava mark.
        </p>
        <Timeline steps={NINE} />
      </section>

      <section className="mt-24 grid gap-10 border-t border-border pt-16 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl font-semibold text-text-primary">Fees</h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            You see a number after we talk and before any code. The main build is a
            fixed fee for the agreed scope, so there are no open-ended hours. Anything
            after handoff is quoted when you want it.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-text-primary">Start with a message</h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            {contactIsExternal
              ? 'Pick a time for the first call and tell me a little about the idea when you book.'
              : "Tell me what you want to build and who it's for. The button opens an email to me with a short draft you can fill in."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              {contactLabel}
            </a>
            <a href={siteConfig.resumeFile} download className="font-sans text-[0.9375rem] text-link">
              Read my resume first
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
