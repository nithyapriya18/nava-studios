import { REVIEW_PRODUCT, reviewUrl } from '@/lib/products'

/**
 * Shape of a review from the landing page review product, plus the two exports built from it.
 * The exports are assembled here in the browser from the review the API
 * already returned, so they cost no extra API calls.
 */
export type Review = {
  score: number
  verdict: string
  summary: string
  audience: string
  breakdown: { area: string; score: number; note: string }[]
  problems: { title: string; quote: string; why: string; fix: string }[]
  strengths: string[]
  rewrite: { headline: string; subheadline: string; cta: string }
  nextSteps: string[]
}

function sourceLine(input: string) {
  const trimmed = input.trim()
  return /^https?:\/\//i.test(trimmed) || /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(trimmed)
    ? trimmed
    : null
}

/**
 * A prompt to paste into Claude, ChatGPT, Cursor, Lovable or similar. Written
 * as the founder's own brief: it carries the findings, not the rules or the
 * structure the review was produced with.
 */
export function toPrompt(review: Review, input: string) {
  const url = sourceLine(input)
  const lines = [
    url
      ? `Please help me rewrite the copy on my landing page, ${url}.`
      : 'Please help me rewrite the copy on my landing page. The current copy is at the end of this message.',
    '',
    `It's for: ${review.audience}`,
    '',
    'What I want to change, most important first:',
    ...review.problems.map((p, i) =>
      [`${i + 1}. ${p.title}.`, p.quote ? ` Right now it says "${p.quote}".` : '', ` ${p.fix}`].join(''),
    ),
    '',
    'What I want to keep:',
    ...review.strengths.map((s) => `- ${s}`),
    '',
    'A starting point for the top of the page:',
    `- Headline: ${review.rewrite.headline}`,
    `- Subheadline: ${review.rewrite.subheadline}`,
    `- Button: ${review.rewrite.cta}`,
    '',
    'Also:',
    ...review.nextSteps.map((s) => `- ${s}`),
    '',
    "Please give me the revised copy section by section. Keep it accurate to what I've told you, and where you'd need a fact or number I haven't given, leave a placeholder in [square brackets] and list those at the end.",
  ]
  if (!url) lines.push('', 'Current copy:', '"""', input.trim(), '"""')
  return lines.join('\n')
}

/** A plan.md the founder can keep in their repo or docs. */
export function toPlan(review: Review, input: string) {
  const url = sourceLine(input)
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return [
    '# Landing page plan',
    '',
    `Reviewed with ${REVIEW_PRODUCT.name} (${reviewUrl}) on ${date}.`,
    `Source: ${url ?? 'pasted copy'}`,
    '',
    '## Summary',
    '',
    `**Score: ${review.score}/10.** ${review.verdict}`,
    '',
    review.summary,
    '',
    `**Audience:** ${review.audience}`,
    '',
    '## Scores',
    '',
    '| Area | Score | Note |',
    '| --- | --- | --- |',
    ...review.breakdown.map((b) => `| ${b.area} | ${b.score}/10 | ${b.note.replace(/\|/g, '/')} |`),
    '',
    '## What to change',
    '',
    ...review.problems.flatMap((p, i) => [
      `### ${i + 1}. ${p.title}`,
      '',
      ...(p.quote ? [`- **Current:** "${p.quote}"`] : []),
      `- **Why:** ${p.why}`,
      `- **Fix:** ${p.fix}`,
      '',
    ]),
    '## What to keep',
    '',
    ...review.strengths.map((s) => `- ${s}`),
    '',
    '## A starting point for the copy',
    '',
    `- **Headline:** ${review.rewrite.headline}`,
    `- **Subheadline:** ${review.rewrite.subheadline}`,
    `- **Main button:** ${review.rewrite.cta}`,
    '',
    '## Checklist',
    '',
    ...review.nextSteps.map((s) => `- [ ] ${s}`),
    '',
  ].join('\n')
}

/** Plain-text version for pasting into a message. */
export function toText(review: Review) {
  return [
    `${review.score}/10: ${review.verdict}`,
    '',
    review.summary,
    '',
    "What's not working:",
    ...review.problems.map((p, i) => `${i + 1}. ${p.title}. ${p.why} Fix: ${p.fix}`),
    '',
    "What's working:",
    ...review.strengths.map((s) => `- ${s}`),
    '',
    `Reviewed with ${REVIEW_PRODUCT.name} at ${reviewUrl.replace('https://', '')}`,
  ].join('\n')
}
