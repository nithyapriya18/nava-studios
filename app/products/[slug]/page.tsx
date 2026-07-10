import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { PRODUCTS, FAMILIES, getProduct } from '@/lib/products'
import { StatusBadge } from '@/components/product-card'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Verity Studio`,
    description: product.tagline,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const family = FAMILIES[product.family]
  const isOpen = product.status === 'live' || product.status === 'beta'

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-surface py-14 md:py-20">
        <div className="max-w-content mx-auto px-6 md:px-8">
          <AnimateIn>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} /> All products
            </Link>
          </AnimateIn>
          <AnimateIn delay={0.05}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
                {product.name}
              </h1>
              <StatusBadge status={product.status} />
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
              {product.tagline}
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-content mx-auto space-y-12 px-6 md:px-8">
          {/* The problem, in the buyer's words */}
          <AnimateIn>
            <blockquote className="border-l-4 border-accent pl-6 text-lg italic leading-relaxed text-text-primary">
              &ldquo;{product.pain}&rdquo;
              <footer className="mt-2 text-sm not-italic text-text-muted">
                — the complaint this tool exists to end
              </footer>
            </blockquote>
          </AnimateIn>

          <AnimateIn>
            <p className="text-base leading-[1.75] text-text-muted md:text-lg">
              {product.description}
            </p>
          </AnimateIn>

          {/* Features */}
          <AnimateIn>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-text-primary">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </AnimateIn>

          {/* Price + CTA */}
          <AnimateIn>
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="font-display text-xl font-semibold text-text-primary">
                {product.price}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Flat pricing. No per-seat maths, no &ldquo;contact us&rdquo;.
              </p>
              <div className="mt-6">
                {isOpen && product.href ? (
                  <Link
                    href={product.href}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
                  >
                    Open {product.name}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <a
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Waitlist: ${product.name}`)}&body=${encodeURIComponent(`Tell me when ${product.name} is live.\n\nWhat I'd use it for: `)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-medium text-accent transition-all hover:bg-accent-light"
                  >
                    Join the waitlist
                  </a>
                )}
              </div>
            </div>
          </AnimateIn>

          {/* Founder note */}
          <AnimateIn>
            <p className="text-sm leading-relaxed text-text-muted">
              I&apos;m Nithya — {family.name.toLowerCase() === 'verity home'
                ? 'I built this for my own family first, and it shows.'
                : 'I read the forums where people complain about this problem, then built the smallest tool that ends it.'}{' '}
              When you email support, I&apos;m the one who answers.{' '}
              <Link href="/about" className="text-accent hover:underline">
                More about the studio →
              </Link>
            </p>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
