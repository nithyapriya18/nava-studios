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
import { REVIEW_PRODUCT, reviewHref } from '@/lib/products'

const facts = [
  { title: 'Ten years in product', body: 'Led AI products at Novartis and Resilinc' },
  { title: 'Fixed price', body: 'Agreed before any work starts' },
  { title: 'Yours to keep', body: 'Product and code handed over' },
]

const work = [
  {
    org: 'Novartis',
    title: 'NLP redaction platform',
    metric: '$6.4M',
    metricLabel: 'documented cost impact',
    body: 'Product work on a healthcare AI platform that redacts sensitive information from documents.',
  },
  {
    org: 'Resilinc',
    title: 'Supply chain AI',
    metric: '500,000+',
    metricLabel: 'enterprise users',
    body: 'Led product for supply chain AI used by more than half a million people at large companies.',
  },
  {
    org: 'Studio NPV',
    title: REVIEW_PRODUCT.name,
    metric: 'Live',
    metricLabel: 'free to use today',
    body: 'Reviews a landing page in under a minute. Designed, built and run by the studio.',
    href: reviewHref,
  },
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
    title: 'Product decisions before code',
    body: 'Most of my career has been spent deciding what to build first and why. Every project starts there, so what you launch first is what your users need most.',
  },
  {
    title: 'Direct contact the whole way',
    body: 'You work with the person designing and building your product, so questions get answered quickly and nothing is lost between people.',
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
              I design and build software for founders and small businesses.
              Before starting the studio I spent ten years building and leading
              products, so every project starts with the product decisions: who
              it&apos;s for, what it has to do first and what can wait. Then I
              build it, for a fixed price agreed before any work starts.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={contactHref}
                className="btn-primary !px-6 !py-3"
                {...ctaProps}
              >
                {contactLabel}
              </a>
              <Link href="/start" className="text-[0.9375rem] text-link">
                See how a project runs
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
            Most projects take a few weeks, whether it&apos;s a first release of a
            new product, a customer portal or an internal tool. You get a fixed
            price after our first call, once we&apos;ve agreed what to build. If
            your project isn&apos;t listed here, tell me about it anyway.
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
        <div className="mx-auto grid max-w-layout gap-12 px-6 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:px-8 md:py-28">
          <div>
            <h2 className="fade-up text-3xl font-semibold text-text-primary md:text-5xl">
              Work I&apos;ve led
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
                <p className="font-medium text-text-primary">{siteConfig.founderFull}</p>
                <p className="text-text-muted">{siteConfig.title}</p>
              </div>
            </div>
            <p className="fade-up mt-6 leading-relaxed text-text-muted">
              Before the studio I spent ten years in software, first as an engineer,
              then in data science, then leading AI products. Two highlights from those
              roles, and a product the studio runs today.
            </p>
            <p className="mt-5 text-[0.9375rem]">
              <Link href="/about" className="text-link">
                My full background
              </Link>
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {work.map((item) => (
              <li
                key={item.title}
                className="fade-up flex flex-col rounded-3xl border border-border bg-surface p-6"
              >
                <p className="text-sm text-text-muted">{item.org}</p>
                <h3 className="mt-1 text-lg font-semibold text-text-primary">{item.title}</h3>
                <p className="text-grad mt-6 text-4xl font-bold tracking-tight">{item.metric}</p>
                <p className="text-sm text-text-muted">{item.metricLabel}</p>
                <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-text-muted">
                  {item.body}
                </p>
                {item.href && (
                  <Link href={item.href} className="text-link mt-4 text-[0.9375rem]">
                    Try it free
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </StackSection>

      <StackSection>
        <div className="mx-auto grid max-w-layout gap-12 px-6 py-20 md:grid-cols-[1fr_1.5fr] md:gap-16 md:px-8 md:py-28">
          <div>
            <h2 className="fade-up text-3xl font-semibold text-text-primary md:text-5xl">
              Why work with me
            </h2>
            <p className="fade-up mt-5 text-lg leading-relaxed text-text-muted">
              What you can count on, whatever the size of the project.
            </p>
          </div>
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {reasons.map((item) => (
              <li key={item.title} className="fade-up border-t border-border pt-5">
                <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </StackSection>

      <StackSection dark className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-layout">
          <SpotlightCard className="fade-up grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <p className="text-sm font-medium text-accent">Free to try</p>
              <h2 className="mt-2 text-3xl font-semibold text-text-primary md:text-4xl">
                Get a second opinion before you launch
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
                Paste your landing page or pitch and get a detailed review in under a
                minute, with the fixes ready to use. It&apos;s a small example of the
                product thinking I bring to every project.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Link href={reviewHref} className="btn-primary !px-6 !py-3">
                Review my landing page
              </Link>
              <p className="mt-3 text-sm text-text-muted">Two free reviews a day</p>
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
