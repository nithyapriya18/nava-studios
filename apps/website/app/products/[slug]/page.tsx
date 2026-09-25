import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { REVIEW_PRODUCT } from '@/lib/products'
import { ReviewApp } from '@/components/products/review-app'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: REVIEW_PRODUCT.slug }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug !== REVIEW_PRODUCT.slug) return {}
  return {
    title: `${REVIEW_PRODUCT.name}: a free, detailed review of your landing page`,
    description: `${REVIEW_PRODUCT.tagline} Free, two reviews a day, with the fixes as an AI prompt or a plan.`,
    openGraph: { title: REVIEW_PRODUCT.name, description: REVIEW_PRODUCT.tagline },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  if (slug !== REVIEW_PRODUCT.slug) notFound()
  return <ReviewApp />
}
