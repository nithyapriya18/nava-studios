import { siteConfig } from '@/config'

/**
 * The products listed under /products. The landing page review is the first;
 * change its name or slug here and every page, link and export follows.
 */
export const REVIEW_PRODUCT = {
  name: 'Second Opinion',
  slug: 'second-opinion',
  tagline: 'A detailed second opinion on your landing page, in under a minute.',
  description:
    'Paste your landing page copy or a link. It reviews the words and the design of your page, and you get a score, what a first-time visitor won’t understand, what’s working, and the specific changes to make. Take the fixes into your AI tool as a prompt or download them as a plan, then review again to see your progress.',
  features: ['Score and breakdown', 'Design review from a screenshot', 'Issues quoted from your page', 'Suggested copy', 'Progress over time', 'Export as prompt or plan.md'],
}

export const reviewHref = `/products/${REVIEW_PRODUCT.slug}`
export const reviewUrl = `${siteConfig.url}${reviewHref}`

export const PRODUCTS = [REVIEW_PRODUCT]
