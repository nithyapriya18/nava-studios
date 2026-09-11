import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'

const process = [
  {
    name: 'Call',
    time: 'Unpaid',
    text: 'You describe the idea. I ask what a first version has to do. After the call I send a scope and a quote.',
  },
  {
    name: 'Build',
    time: 'Typically a few weeks',
    text: 'Paid work starts when you accept the quote. You get a product you can use, not a slide deck.',
  },
  {
    name: 'Handoff',
    time: 'Yours to run',
    text: 'By default the code and hosting sit on your accounts. We can keep going from there if you want more — quoted again.',
  },
]

export default function Home() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <div>
      <section id="main" className="bg-background pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="max-w-layout mx-auto px-6 md:px-8 grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 md:gap-14 items-start">
          <div>
            <p className="text-sm font-medium text-text-primary">
              <span className="inline-block w-2 h-2 bg-accent mr-2 align-middle" aria-hidden />
              Available for new work · Bengaluru, worldwide
            </p>
            <h1 className="mt-5 text-[2rem] md:text-[2.75rem] font-medium tracking-tight leading-[1.2] text-text-primary">
              I build the first version of your product.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-muted max-w-xl">
              {siteConfig.name} is Nithya — one person. You bring the idea, a
              brief, or both. I turn it into something you can put in front of
              people, typically in a few weeks.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted max-w-xl">
              I also build software for a process you already run, when that is
              the need. Ten years shipping as an engineer, data scientist, and
              product manager.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={contactHref} className="btn-primary" {...ctaProps}>
                {contactLabel}
                <ArrowRight size={14} aria-hidden />
              </a>
              <Link
                href="/start"
                className="text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent"
              >
                How an engagement works
              </Link>
            </div>
          </div>
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/nithya.jpeg"
                alt="Nithya, founder of Nava Studios"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 420px"
                priority
              />
            </div>
            <p className="mt-3 text-sm text-text-muted">
              Nithyapriya Veeraraghavan · {siteConfig.title}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <p className="text-sm font-medium text-text-muted mb-2">How it works</p>
          <h2 className="text-2xl font-medium text-text-primary mb-3 max-w-xl">
            A call, a quote, then a product.
          </h2>
          <p className="text-text-muted max-w-2xl mb-8 leading-relaxed">
            The call is to understand the idea and send you a number. The build
            is paid. You work with me throughout.
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            {process.map((o) => (
              <div key={o.name} className="bg-background p-6 md:p-8">
                <p className="text-sm font-medium text-accent mb-2">{o.time}</p>
                <h3 className="text-xl font-medium text-text-primary mb-3">{o.name}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <p className="text-sm font-medium text-text-muted mb-2">Who this is for</p>
          <h2 className="text-2xl font-medium text-text-primary mb-4 max-w-xl">
            Founders who need a first product, for a small or mid-size team.
          </h2>
          <p className="text-text-muted max-w-2xl leading-relaxed">
            If you have an idea and need a version people can actually use, that
            is the work. I size it for the team you have now. I am not selling a
            large engineering organisation or a scale-out from day one.
          </p>
        </div>
      </section>

      <section className="bg-accent py-16 md:py-20 text-white">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-medium max-w-xl leading-tight">
            If you have an idea for a first version, write to me.
          </h2>
          <p className="mt-4 max-w-lg text-white leading-relaxed">
            We will talk through what v1 has to do. If we go ahead, you see a
            quote before I write code.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={contactHref} className="btn-on-accent" {...ctaProps}>
              {contactLabel}
              <ArrowRight size={14} aria-hidden />
            </a>
            <Link
              href="/lab"
              className="inline-flex items-center px-5 py-3 text-sm text-white underline underline-offset-4"
            >
              Personal projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
