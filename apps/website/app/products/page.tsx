import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS, reviewHref } from '@/lib/products'
import { AppIcon } from '@/components/products/app-icon'
import { LensVisual } from '@/components/products/lens-visual'
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

          <div className="theme-dark relative hidden md:block">
            <LensVisual />
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
