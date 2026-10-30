import { siteConfig } from '@/config'

/**
 * The products listed under /products. The landing page review is the first;
 * change its name or slug here and every page, link and export follows.
 */
export const REVIEW_PRODUCT = {
  name: 'Crit',
  slug: 'crit',
  tagline: 'A 30-second crit of your landing page, with the fixes ready to use.',
  description:
    'Paste your landing page copy or a link. It reviews the words and the design of your page, and you get a score, what a first-time visitor won’t understand, what’s working, and the specific changes to make. Take the fixes into your AI tool as a prompt or download them as a plan, then review again to see your progress.',
  note: 'Free · two reviews a day',
  features: ['Score and breakdown', 'Design review from a screenshot', 'Issues quoted from your page', 'Suggested copy', 'Progress over time', 'Export as prompt or plan.md'],
}

export const reviewHref = `/products/${REVIEW_PRODUCT.slug}`
export const reviewUrl = `${siteConfig.url}${reviewHref}`

export const SCOPE_PRODUCT = {
  name: 'Scope Cutter',
  slug: 'scope-cutter',
  tagline: 'Cut your feature list down to a first version you can actually ship.',
  description:
    'List every feature you’re imagining. Scope Cutter runs them through the methods product managers use, the Kano model, story mapping and a fixed time budget, and gives you a first release, a queue for what comes next, and what to measure. Free, and nothing leaves your browser.',
  note: 'Free · runs in your browser',
  features: ['Kano model, per feature', 'Walking-skeleton check', 'Fits a time budget', 'What to do by hand', 'Next-release queue', 'Download or print'],
}

export const scopeHref = `/products/${SCOPE_PRODUCT.slug}`
export const scopeUrl = `${siteConfig.url}${scopeHref}`

// Scope Cutter is off the site while it's reworked: it asks too many
// questions before it gives an answer. Add it back here and in the route.
export const PRODUCTS = [REVIEW_PRODUCT]
