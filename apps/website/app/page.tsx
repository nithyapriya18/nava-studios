import Link from 'next/link'
import Image from 'next/image'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { TextReveal } from '@/components/ui/text-reveal'

const beats = [
  {
    title: 'We talk',
    body: 'You tell me the idea. I ask what the first version has to do, then send you a scope and a fixed quote.',
  },
  {
    title: 'I build',
    body: 'Work starts when you accept the quote. Most first versions are ready to use within a few weeks.',
  },
  {
    title: 'You run it',
    body: 'The code and hosting sit on your accounts by default. If you want more later, I quote that separately.',
  },
]

export default function Home() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <>
      <section className="mx-auto grid max-w-layout items-end gap-12 px-6 pb-20 pt-16 md:grid-cols-[minmax(0,1fr)_300px] md:gap-16 md:px-8 md:pb-28 md:pt-24">
        <div>
          <h1 className="max-w-[14ch] text-[2.75rem] font-semibold leading-[1.02] text-text-primary [font-variation-settings:'opsz'_96] sm:text-6xl md:text-7xl">
            <TextReveal text={siteConfig.tagline} />
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-text-primary">
            Nava Studios is me, Nithya. Bring the idea as it is today, even if it&apos;s
            one paragraph, and I&apos;ll turn it into something people can use. Most
            first versions take a few weeks.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-text-muted">
            I also build tools for processes a team already runs. Before this I spent
            ten years shipping software, first as an engineer and then in data science
            and product.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              {contactLabel}
            </a>
            <Link href="/start" className="font-sans text-[0.9375rem] text-link">
              How a project works
            </Link>
          </div>
        </div>

        <figure className="max-w-[300px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/nithya.jpeg"
              alt="Nithyapriya Veeraraghavan"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 300px, 300px"
              priority
            />
          </div>
          <figcaption className="mt-3 font-sans text-sm leading-snug">
            <span className="block text-text-primary">{siteConfig.founderFull}</span>
            <span className="text-text-muted">{siteConfig.title}</span>
          </figcaption>
        </figure>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-layout px-6 py-20 md:px-8 md:py-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
              How it works
            </h2>
            <Link href="/start" className="font-sans text-[0.9375rem] text-link">
              All nine steps
            </Link>
          </div>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {beats.map((beat, i) => (
              <li key={beat.title}>
                <p className="font-sans text-sm tabular-nums text-accent">{i + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-text-primary">{beat.title}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">{beat.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-layout gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
          <div>
            <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
              Who I build for
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Founders who need a first product in front of real users, and teams that
              want software for a process they already run. I size the first version
              for the team you have now, and I don&apos;t take on large scale-out work.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
              What I&apos;ve built
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Apps I built for my own use are in the{' '}
              <Link href="/lab" className="text-link">
                lab
              </Link>
              . If you already have a landing page,{' '}
              <Link href="/roast" className="text-link">
                Roast My Launch
              </Link>{' '}
              will give you a blunt review of it in about 20 seconds.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-layout rounded-[2rem] bg-accent px-6 py-16 text-white md:px-12 md:py-20">
          <h2 className="max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
            Have an idea for a first version?
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">
            Send me a few lines about what you want to build and who it&apos;s for.
          </p>
          <a href={contactHref} className="btn-on-accent mt-8" {...ctaProps}>
            {contactLabel}
          </a>
        </div>
      </section>
    </>
  )
}
