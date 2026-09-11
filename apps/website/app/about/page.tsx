import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { CAREER } from '@/lib/nine'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.founderFull} — founder of ${siteConfig.name}. I take an idea and build the first version a small or mid-size team can use.`,
}

export default function AboutPage() {
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <div className="bg-background">
      <section className="py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="grid items-start gap-12 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16">
            <div>
              <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-2xl border border-border">
                <Image
                  src="/nithya.jpeg"
                  alt={`${siteConfig.founder} — founder of ${siteConfig.name}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 340px"
                  priority
                />
              </div>
              <p className="mt-5 text-xs uppercase tracking-widest text-text-muted leading-relaxed">
                Engineer → data scientist → product manager · healthcare, supply
                chain, agentic AI
              </p>
              <a
                href={siteConfig.resumeFile}
                download
                className="mt-6 inline-block text-sm font-medium text-accent hover:underline underline-offset-4"
              >
                Download resume (PDF)
              </a>
            </div>

            <div className="space-y-5 text-base leading-[1.75] text-text-muted md:text-lg">
              <h1 className="text-3xl font-medium text-text-primary md:text-4xl">
                Hi, I&apos;m Nithya. I run {siteConfig.name}.
              </h1>
              <p>
                Nava is Sanskrit for new (said NAH-vuh), and also nine. The
                studio is simple: you bring an idea, I build the first version
                you can use. One person, for small and mid-size work.
              </p>
              <p>
                I spent a decade inside larger organisations. Software
                engineering first, then data science and healthcare AI at
                Novartis — including an NLP redaction platform with $6.4M in
                documented cost impact. Supply chain AI at Resilinc for 500,000+
                enterprise users. Multi-agent systems as a founding product
                manager at early-stage companies. I have shipped from each of
                those seats.
              </p>
              <p className="font-medium text-text-primary">
                That background is useful for a first product: I can sit with
                the idea, name what v1 has to do, and build it. I size it for
                the team you have now. I am still learning how to scale systems
                past that, and I will say so if that is what you need.
              </p>
              <p>
                You talk to me. I send a quote. I build. I hand it over — by
                default on your accounts. If you want a “Built by Nava Studios”
                line on the product, or to keep hosting with me, we can arrange
                that.
              </p>
              <p>
                I live in Bengaluru. Two personal projects I still use — a meal
                planner and a bedtime-story app — are in the{' '}
                <Link href="/lab" className="text-accent underline underline-offset-4">
                  lab
                </Link>
                . They are not client work. They are how I check whether
                software survives ordinary days.
              </p>
              <p>
                I also hold PSPO I (Scrum.org). Engagements follow nine steps,
                written out on the{' '}
                <Link href="/start" className="text-accent underline underline-offset-4">
                  start page
                </Link>
                .
              </p>

              <div className="grid sm:grid-cols-2 gap-px bg-border border border-border mt-8">
                {CAREER.map((c) => (
                  <div key={`${c.year}-${c.role}`} className="bg-background p-4">
                    <p className="text-sm tabular-nums text-accent font-medium">{c.year}</p>
                    <p className="mt-1 font-medium text-text-primary text-base">{c.role}</p>
                    <p className="mt-1 text-sm text-text-muted">{c.place}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a href={contactHref} className="btn-primary" {...ctaProps}>
                  {contactLabel}
                </a>
                <Link href="/start" className="btn-default">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
