import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import type { Product, ProductStatus } from '@/lib/products'

const STATUS_STYLES: Record<ProductStatus, { label: string; classes: string }> = {
  live: { label: 'Live', classes: 'bg-emerald-100 text-emerald-800' },
  beta: { label: 'Beta', classes: 'bg-sky-100 text-sky-800' },
  building: { label: 'In build', classes: 'bg-amber-100 text-amber-800' },
  planned: { label: 'Planned', classes: 'bg-stone-200 text-stone-600' },
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.classes}`}
    >
      {s.label}
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const isOpen = product.status === 'live' || product.status === 'beta'
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 transition-all duration-200 hover:border-accent/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">
          {product.name}
        </h3>
        <StatusBadge status={product.status} />
      </div>
      <p className="text-sm leading-relaxed text-text-muted">{product.tagline}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-xs font-medium text-text-primary">{product.price}</span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
          {isOpen ? (
            <>
              Open <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </>
          ) : (
            <>
              Details <Lock size={11} />
            </>
          )}
        </span>
      </div>
    </Link>
  )
}
