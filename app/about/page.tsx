import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'About — Verity Studio',
  description:
    'Verity Studio is a one-person software studio in Bengaluru, building small, fair-priced tools for small businesses.',
}

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="grid items-start gap-12 md:grid-cols-[minmax(0,380px)_1fr] md:gap-16">
            <AnimateIn>
              <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-3xl border border-border shadow-sm">
                <Image
                  src="/nithya.jpeg"
                  alt="Nithya — founder of Verity Studio"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
              <p className="mt-6 text-xs uppercase tracking-wide text-text-muted">
                10+ years in AI product · healthcare, supply chain, enterprise AI ·
                engineer → data scientist → product manager
              </p>
            </AnimateIn>

            <AnimateIn delay={0.15}>
              <div className="space-y-5 text-base leading-[1.75] text-text-muted md:text-lg">
                <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
                  Hi, I&apos;m Nithya. I run Verity Studio — a one-person software
                  studio in Bengaluru.
                </h1>
                <p>
                  I&apos;ve spent the last decade building AI products inside some
                  very big rooms: data science and healthcare AI at Novartis, supply
                  chain platforms serving 500,000+ enterprise users, and multi-agent
                  AI systems at early-stage startups. I started as a software
                  engineer, became a data scientist, then a product manager — so
                  I&apos;ve shipped software from every seat at the table.
                </p>
                <p>
                  Here&apos;s what all those years taught me: the better enterprise
                  software gets, the more small businesses get left behind. The
                  tools they&apos;re offered are built for companies with procurement
                  teams — priced per seat, sold per year, and packed with features
                  nobody asked for. The problems small businesses actually have are
                  considered too small to be worth a big company&apos;s time.
                </p>
                <p className="font-medium text-text-primary">
                  I think they&apos;re exactly the right size for one person&apos;s time.
                </p>
                <p>
                  So Verity Studio builds small software: single-purpose tools for
                  getting paid, knowing your numbers, winning customers, and running
                  your day. Each one does one job, costs less than the problem it
                  solves, and takes minutes to start using. No demos with a sales
                  rep. No &ldquo;contact us&rdquo; pricing. And when you email
                  support, I&apos;m the one who answers — because I&apos;m also the
                  one who wrote the code.
                </p>
                <p>
                  (Two of these tools I built for my own home — a meal planner and a
                  bedtime-story app for kids. Same care, different customers.)
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
                  >
                    See the products <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/writing"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-text-primary transition-all hover:border-accent hover:text-accent"
                  >
                    Read the build-in-public notes
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Client work strip */}
      <section className="border-t border-border bg-surface py-14 md:py-16">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-2xl font-semibold text-text-primary">
                  I also build for clients
                </h2>
                <p className="mt-2 max-w-xl text-text-muted">
                  A small number at a time — discovery to working product, usually
                  in 2–4 weeks.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                >
                  Past work <ArrowRight size={14} />
                </Link>
                <Link
                  href="/start"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                >
                  Start a project <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
