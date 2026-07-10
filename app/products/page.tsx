import type { Metadata } from 'next'
import { productsByFamily, FAMILIES } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Products — Verity Studio',
  description:
    'Small, fair-priced tools for small businesses. Each one does one job, priced so you never think twice.',
}

export default function ProductsPage() {
  const grouped = productsByFamily()

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="border-b border-border bg-surface py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
              Small software. Fair prices. One job each.
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
              Tools for the problems big software companies won&apos;t touch —
              built by one person, priced so a small business never has to think
              twice. Released one at a time, honestly labeled.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Families */}
      {[...grouped.entries()].map(([familyKey, products], i) => {
        const family = FAMILIES[familyKey]
        if (products.length === 0) return null
        return (
          <section
            key={familyKey}
            className={`py-16 md:py-20 ${i % 2 === 1 ? 'bg-surface' : 'bg-background'}`}
          >
            <div className="max-w-layout mx-auto px-6 md:px-8">
              <AnimateIn className="mb-2">
                <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
                  {family.name}
                </h2>
              </AnimateIn>
              <AnimateIn delay={0.05} className="mb-8">
                <p className="text-text-muted">{family.promise}</p>
              </AnimateIn>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Request a tool */}
      <section className="border-t border-border bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
                What&apos;s slowing you down?
              </h2>
              <p className="mt-4 text-text-muted leading-relaxed">
                The roadmap above came from reading thousands of small-business
                complaints. If your problem isn&apos;t on it — the thing you do in a
                spreadsheet every week and hate — tell me. The most-requested
                problems get built next.
              </p>
              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('A problem worth a small tool')}&body=${encodeURIComponent('The thing that slows me down every week is…')}`}
                className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
              >
                Tell me what to build
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
