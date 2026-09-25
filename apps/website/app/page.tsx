import Link from 'next/link'
import Image from 'next/image'
import {
  siteConfig,
  contactHref,
  contactLabel,
  contactIsExternal,
} from '@/config'
import { TextReveal } from '@/components/ui/text-reveal'
import { StackSection } from '@/components/ui/stack-section'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { ContactBand } from '@/components/contact-band'
import { HeroVisual } from '@/components/hero-visual'
import { reviewHref } from '@/lib/products'

const facts = [
  { title: 'Fixed price', body: 'Agreed before any work starts' },
  { title: 'Built end to end', body: 'Design, build and launch' },
  { title: 'Yours to keep', body: 'Product and code handed over' },
]

const steps = [
  {
    title: 'We scope it together',
    body: "You walk me through the idea, the people it's for and anything you already have. I come back with a written scope and a fixed price. You don't pay for this conversation.",
  },
  {
    title: 'I design and build it',
    body: 'Once you accept the quote, I design and build the product end to end. You can try it while it takes shape, so nothing at the end comes as a surprise.',
  },
  {
    title: 'You launch and own it',
    body: 'I launch it and hand over the product, the code and notes that let any developer pick it up. If you want changes or new features later, I quote those separately.',
  },
]

const builds = [
  {
    title: 'New products',
    body: 'Web apps and SaaS products for founders, with the core features your users come for and the admin screens you need to run them.',
  },
  {
    title: 'Apps for your customers',
    body: 'Portals, booking and ordering flows, and apps that let your customers get things done without calling or emailing you.',
  },
  {
    title: 'Internal tools',
    body: 'Software that replaces the spreadsheets, forms and copy-paste steps your team uses to run a process by hand.',
  },
  {
    title: 'Websites that convert',
    body: 'A site that explains what you do clearly and turns visitors into sign-ups or enquiries.',
  },
]

const reasons = [
  {
    title: 'Product judgement, not only code',
    body: 'Most of my career has been spent deciding what to build first and why. That decision shapes how useful a product turns out to be, and it is part of every project.',
  },
  {
    title: 'Ten years across engineering and product',
    body: 'I started as a software engineer and spent eight years on AI products at Novartis and Resilinc, so I understand how software is built and how people end up using it.',
  },
  {
    title: 'A price and scope you can plan around',
    body: 'You know what the project includes and what it costs before any work starts. If something new comes up, you hear what it would add before I do it.',
  },
  {
    title: 'Everything stays yours',
    body: 'When the work is done, the product, code and data are handed over to you, so you are never tied to me to keep it running.',
  },
]

export default function Home() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <>
      <StackSection first className="hero-glow -mt-[4.5rem] pt-[4.5rem]">
        <div className="mx-auto grid max-w-layout items-center gap-8 px-6 pb-20 pt-16 md:min-h-[min(calc(100svh-4.5rem),780px)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:px-8 md:pb-24">
          <div>
            <h1 className="max-w-[16ch] text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-[5.25rem]">
              <TextReveal text={siteConfig.tagline} highlightFrom={4} />
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-text-muted">
              I design and build software for founders and small businesses,
              from new products and customer-facing apps to the internal tools a
              team runs on every day. We agree the scope and a fixed price
              before any work starts, and when it&apos;s done, the product and
              its code are yours.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={contactHref}
                className="btn-primary !px-6 !py-3"
                {...ctaProps}
              >
                {contactLabel}
              </a>
              <Link href={reviewHref} className="text-[0.9375rem] text-link">
                Get a free landing page review
              </Link>
            </div>
            <ul className="mt-14 grid max-w-3xl gap-6 border-t border-border pt-8 sm:grid-cols-3">
              {facts.map((fact) => (
                <li key={fact.title}>
                  <p className="font-semibold text-text-primary">
                    {fact.title}
                  </p>
                  <p className="mt-1 text-[0.9375rem] text-text-muted">
                    {fact.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block">
            <HeroVisual />
          </div>
        </div>
      </StackSection>

      <StackSection dark>
        <div className="mx-auto max-w-layout px-6 py-20 md:px-8 md:py-28">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="fade-up text-3xl font-semibold text-text-primary md:text-5xl">
              How a project runs
            </h2>
            <Link href="/start" className="text-[0.9375rem] text-link">
              Every step in detail
            </Link>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="fade-up rounded-3xl border border-border bg-surface p-7"
              >
                <p className="text-grad text-5xl font-bold tabular-nums">
                  {i + 1}
                </p>
                <h3 className="mt-5 text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </StackSection>

      <StackSection>
        <div className="mx-auto max-w-layout px-6 py-20 md:px-8 md:py-28">
          <h2 className="fade-up max-w-2xl text-3xl font-semibold text-text-primary md:text-5xl">
            What I build
          </h2>
          <p className="fade-up mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
            Most projects fall into one of these. If yours doesn&apos;t, tell me
            about it anyway.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {builds.map((item) => (
              <SpotlightCard key={item.title} className="fade-up p-7 md:p-8">
                <h3 className="text-xl font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-text-muted">
                  {item.body}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </StackSection>

      <StackSection dark>
        <div className="mx-auto grid max-w-layout gap-12 px-6 py-20 md:grid-cols-[1fr_1.5fr] md:gap-16 md:px-8 md:py-28">
          <div>
            <h2 className="fade-up text-3xl font-semibold text-text-primary md:text-5xl">
              What you can count on
            </h2>
            <div className="fade-up mt-8 flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
                <Image
                  src="/nithya.jpeg"
                  alt="Nithyapriya Veeraraghavan"
                  fill
                  className="object-cover object-top"
                  sizes="64px"
                />
              </div>
              <div className="text-[0.9375rem] leading-snug">
                <p className="font-medium text-text-primary">
                  {siteConfig.founderFull}
                </p>
                <p className="text-text-muted">{siteConfig.title}</p>
              </div>
            </div>
            <p className="fade-up mt-6 leading-relaxed text-text-muted">
              Before starting the studio I spent ten years building software,
              first as an engineer, then in data science, and then leading AI
              products at Novartis and Resilinc.
            </p>
            <p className="mt-5 text-[0.9375rem]">
              <Link href="/about" className="text-link">
                More about my background
              </Link>
            </p>
          </div>
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {reasons.map((item) => (
              <li
                key={item.title}
                className="fade-up border-t border-border pt-5"
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </StackSection>

      <StackSection className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-layout">
          <SpotlightCard className="fade-up grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <p className="text-sm font-medium text-accent">Free to try</p>
              <h2 className="mt-2 text-3xl font-semibold text-text-primary md:text-4xl">
                See how I review a product
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
                Paste your landing page or pitch and get a detailed review in
                under a minute: what&apos;s unclear, what&apos;s working, and
                exactly what to change. You can copy the fixes as a prompt for
                your AI tool or download them as a plan.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Link href={reviewHref} className="btn-primary !px-6 !py-3">
                Review my landing page
              </Link>
              <p className="mt-3 text-sm text-text-muted">
                Two free reviews a day
              </p>
            </div>
          </SpotlightCard>

          <div className="fade-up mt-8">
            <ContactBand />
          </div>
        </div>
      </StackSection>
    </>
  )
}
