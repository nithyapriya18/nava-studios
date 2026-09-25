import type { Metadata } from 'next'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { NINE } from '@/lib/nine'
import { StickySteps } from '@/components/ui/sticky-steps'

export const metadata: Metadata = {
  title: 'How it works',
  description: `How a project with ${siteConfig.name} runs, from the first call to launch. You get a written scope and a fixed price before any work starts.`,
}

const faqs = [
  {
    q: 'How long does a project take?',
    a: 'Most take a few weeks. The exact time depends on what the project includes, and you will have it in writing along with the quote.',
  },
  {
    q: 'How much does it cost?',
    a: 'Each project has a fixed price based on its scope, so there are no hourly bills. I send the price after our first call, and nothing is billed until you accept it.',
  },
  {
    q: 'What if my idea is still rough?',
    a: 'That is a normal place to start. Part of the first call is working out what the product should do at launch, and most ideas get clearer in that conversation. Sometimes we find it is too early to build, which is worth knowing before anyone spends money.',
  },
  {
    q: 'Do I need a technical co-founder or developer?',
    a: 'No. I handle the design, the code and the setup, and I explain the decisions in plain language so you can make the calls that matter to your business.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do. When the work is done, the product, code and data are handed over to you, and you can take them to any developer.',
  },
  {
    q: 'What happens after launch?',
    a: 'That is up to you. Some founders run the product themselves, and others ask me for fixes, improvements or the next version. New work is quoted separately, and I can host the product for you if you prefer.',
  },
]

export default function StartPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <>
      <div className="mx-auto max-w-layout px-6 pt-16 md:px-8 md:pt-24">
        <header className="max-w-2xl">
          <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">
            How a project runs
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-text-primary">
            Every project follows the same nine steps, from the first conversation to
            the day the product is live and yours. At each point you know what happens
            next, what it costs and what you will have at the end of it.
          </p>
        </header>

        <section className="mt-16 md:mt-20" aria-label="The nine steps">
          <StickySteps steps={NINE} />
        </section>
      </div>

      <section className="theme-dark mt-24 py-20 md:py-28">
        <div className="mx-auto grid max-w-layout gap-12 px-6 md:grid-cols-[1fr_1.6fr] md:gap-16 md:px-8">
          <div>
            <h2 className="fade-up text-3xl font-semibold text-text-primary md:text-5xl">
              Common questions
            </h2>
            <p className="fade-up mt-5 text-lg leading-relaxed text-text-muted">
              If yours isn&apos;t here, send it over. It&apos;s usually a good thing to
              talk about on the first call.
            </p>
          </div>
          <div className="border-t border-border">
            {faqs.map((item) => (
              <details key={item.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-text-muted transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-xl pb-6 leading-relaxed text-text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-layout px-6 pt-20 md:px-8 md:pt-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Start with a message
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            {contactIsExternal
              ? 'Pick a time for the first call, and add a line or two about the idea when you book.'
              : "Tell me what you want to build and who it's for. The button opens an email with a short outline you can fill in, and I'll reply with a few questions or a time to talk."}
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
    </>
  )
}
