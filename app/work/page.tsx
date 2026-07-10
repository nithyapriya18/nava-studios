import { WorkCard, type WorkCardProps } from '@/components/work-card'
import { AnimateIn } from '@/components/animate-in'

const allWork: WorkCardProps[] = [
  {
    slug: 'gst-calculator',
    title: 'GST Calculator for Indian businesses',
    problem: 'Daily tax calculation friction',
    outcome: 'Faster GST breakdowns and instant invoice totals',
    metric: '18% in 1 tap',
    tags: ['Utility app', 'Finance', 'India'],
    beforeText:
      'People switch between spreadsheets and calculators to split CGST/SGST vs IGST, especially while creating quick quotes.',
    afterText:
      'A single web app handles forward + reverse GST and itemized bill totals, with a login-gated live version.',
  },
  {
    slug: 'easycook',
    title: 'EasyCook — the week’s meals, decided',
    problem: 'The nightly "what do we eat tomorrow" negotiation',
    outcome: 'A week of meals planned around the household in one tap',
    metric: '7 dinners in 1 tap',
    tags: ['Family', 'AI', 'Verity Home'],
    beforeText:
      'Meal planning is a nightly negotiation: what’s in the fridge, who eats what, whose day ran late — decided at 6pm with no plan.',
    afterText:
      'EasyCook plans the whole week around the household’s tastes, allergies and schedule, with recipes, prep notes and allergy-aware swaps.',
  },
  {
    slug: 'snugglefox',
    title: 'SnuggleFox — bedtime stories, made just for them',
    problem: 'The fourth "one more story" of the night',
    outcome: 'A new, personal story every night — parents stay in control',
    metric: 'A new story every night',
    tags: ['Family', 'AI', 'Verity Home'],
    beforeText:
      'Every parent runs out of fresh bedtime material. The same three books on rotation, invented plots trailing off mid-sentence.',
    afterText:
      'SnuggleFox weaves the child’s name, their day, and their favourite things into a gentle, age-appropriate story — a new one every night.',
  },
]

export default function WorkPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary mb-4">
              Things I&apos;ve built
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-text-muted text-lg md:text-xl max-w-xl leading-relaxed">
              Real products I&apos;m shipping — business tools and two built for
              my own family.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {allWork.map((item) => (
              <WorkCard key={item.slug} {...item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
