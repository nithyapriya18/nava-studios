import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { REVIEW_PRODUCT, SCOPE_PRODUCT } from '@/lib/products'
import { ReviewApp } from '@/components/products/review-app'
import { ScopePage } from '@/components/products/scope-page'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: REVIEW_PRODUCT.slug }, { slug: SCOPE_PRODUCT.slug }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug === REVIEW_PRODUCT.slug) {
    return {
      title: `${REVIEW_PRODUCT.name}: a free, detailed review of your landing page`,
      description: `${REVIEW_PRODUCT.tagline} Free, two reviews a day, with the fixes as an AI prompt or a plan.`,
      openGraph: { title: REVIEW_PRODUCT.name, description: REVIEW_PRODUCT.tagline },
    }
  }
  if (slug === SCOPE_PRODUCT.slug) {
    return {
      title: `${SCOPE_PRODUCT.name}: decide what goes in your MVP, free`,
      description:
        'Cut a feature wish list down to a first version using the Kano model, story mapping and a fixed time budget. Free, and nothing leaves your browser.',
      openGraph: { title: SCOPE_PRODUCT.name, description: SCOPE_PRODUCT.tagline },
    }
  }
  return {}
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  if (slug === REVIEW_PRODUCT.slug) return <ReviewApp />
  if (slug === SCOPE_PRODUCT.slug) return <ScopePage />
  notFound()
}
