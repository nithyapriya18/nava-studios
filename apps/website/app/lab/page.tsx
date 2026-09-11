import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { WorkCard, type WorkCardProps } from '@/components/work-card'
import { AnimateIn } from '@/components/animate-in'

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Personal projects Nithya has built. Not client work.',
}

const lab: WorkCardProps[] = [
  {
    slug: 'gst-calculator',
    title: 'GST Calculator',
    problem: 'Personal project · Finance',
    outcome: 'Forward and reverse GST on one screen, for quotes that should not need a spreadsheet beside a calculator.',
    metric: '',
    tags: ['Finance', 'India'],
    beforeText: '',
    afterText: '',
  },
  {
    slug: 'easycook',
    title: 'EasyCook',
    problem: 'Personal project · Household',
    outcome: 'A week of meals planned around tastes, allergies, and the nights that run late.',
    metric: '',
    tags: ['Household'],
    beforeText: '',
    afterText: '',
  },
  {
    slug: 'snugglefox',
    title: 'SnuggleFox',
    problem: 'Personal project · Household',
    outcome: 'A new bedtime story each night. A parent controls every input.',
    metric: '',
    tags: ['Household'],
    beforeText: '',
    afterText: '',
  },
]

export default function LabPage() {
  return (
    <div>
      <section className="bg-background py-20 md:py-28">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h1 className="text-4xl md:text-5xl font-medium text-text-primary mb-4">
              Lab
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.08}>
            <p className="text-text-muted text-lg max-w-xl leading-relaxed">
              Personal projects. They show how I ship when I own the brief.
              None of these are client products.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <Link
              href="/roast"
              className="group block rounded-xl border border-border bg-background p-6 md:p-8 mb-10 hover:border-accent transition-colors"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                New · free
              </span>
              <h2 className="mt-2 text-2xl font-medium text-text-primary flex items-center gap-2">
                Roast My Launch
                <ArrowRight
                  size={18}
                  className="text-accent transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </h2>
              <p className="mt-2 text-text-muted leading-relaxed max-w-xl">
                Paste your landing page, pitch, or a link. Get the honest,
                specific verdict your friends are too nice to give you.
              </p>
            </Link>
          </AnimateIn>
          <div className="grid md:grid-cols-2 gap-6">
            {lab.map((item) => (
              <WorkCard key={item.slug} {...item} />
            ))}
          </div>
          <p className="mt-12 text-sm text-text-muted">
            Looking for a custom first product?{' '}
            <Link href="/start" className="text-accent underline underline-offset-4">
              Start here
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
