import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS, reviewHref } from '@/lib/products'
import { AppIcon } from '@/components/products/app-icon'
import { ScoreRing } from '@/components/products/score-ring'
import { SpotlightCard } from '@/components/ui/spotlight-card'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Small, free products built and run by Studio NPV.',
}

export default function ProductsPage() {
  const product = PRODUCTS[0]

  return (
    <div className="mx-auto max-w-layout px-6 pt-16 md:px-8 md:pt-24">
      <header className="max-w-2xl">
        <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Products</h1>
        <p className="mt-6 text-xl leading-relaxed text-text-muted">
          Small products I&apos;ve built and run myself. They&apos;re free to use, and they
          show the kind of care I put into client work.
        </p>
      </header>

      <SpotlightCard className="fade-up mt-14 overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="p-7 md:p-10">
            <div className="flex items-center gap-4">
              <AppIcon size={56} />
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">{product.name}</h2>
                <p className="text-sm text-text-muted">Free, two reviews a day</p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">{product.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {product.features.map((f) => (
                <li key={f} className="rounded-full bg-surface px-3 py-1 text-text-muted">
                  {f}
                </li>
              ))}
            </ul>
            <Link href={reviewHref} className="btn-primary mt-8 !px-6 !py-3">
              Open {product.name}
            </Link>
          </div>

          <div aria-hidden className="theme-dark relative hidden overflow-hidden md:block">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#006278]/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[#012987]/70 blur-3xl" />
            <div className="relative flex h-full flex-col justify-center gap-5 p-10">
              <div className="flex items-center gap-4 rounded-2xl bg-card/80 p-4">
                <ScoreRing score={7} size={84} />
                <div className="space-y-2">
                  <span className="block h-2 w-36 rounded-full bg-white/25" />
                  <span className="block h-2 w-24 rounded-full bg-white/15" />
                </div>
              </div>
              {[8, 5, 7].map((w, i) => (
                <div key={i} className="rounded-2xl bg-card/80 p-4">
                  <span className="block h-2 rounded-full bg-white/10">
                    <span className="block h-2 rounded-full" style={{ width: `${w * 10}%`, backgroundImage: 'var(--grad-button)' }} />
                  </span>
                  <span className="mt-3 block h-2 w-3/4 rounded-full bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
