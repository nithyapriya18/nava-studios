import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getProduct } from '@/lib/products'
import { StatusBadge } from '@/components/product-card'

/** Shared chrome for every tool page: title strip, status, back link, footer note. */
export function ToolShell({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const product = getProduct(slug)

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-surface py-8 print:hidden">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={12} /> About this tool
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
              {product?.name ?? slug}
            </h1>
            {product && <StatusBadge status={product.status} />}
          </div>
          {product && (
            <p className="mt-2 max-w-2xl text-sm text-text-muted">{product.tagline}</p>
          )}
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-layout mx-auto px-6 md:px-8">{children}</div>
      </section>

      <section className="border-t border-border py-8 print:hidden">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <p className="text-xs text-text-muted">
            Your data stays in your browser — nothing is uploaded. A Verity Studio
            tool ·{' '}
            <Link href="/products" className="text-accent hover:underline">
              more small tools
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
