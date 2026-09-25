/**
 * Shape of a Landing Page Review, plus the two exports built from it.
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

/** A prompt to paste into Claude, ChatGPT, Cursor, Lovable or similar. */
export function toPrompt(review: Review, input: string) {
  const url = sourceLine(input)
  const lines = [
    "I'm improving the copy on my landing page. A detailed review found the problems below. Please rewrite the page to fix them.",
    '',
    'Rules:',
    '- Keep everything factual about my product. Do not invent numbers, customers, features or results.',
    '- Where proof is missing, leave a clearly marked placeholder such as [number of customers] for me to fill in.',
    '- Keep the parts listed under "Keep what works".',
    '',
    url ? `Page: ${url}` : 'My current copy is at the end of this message.',
    `Who the page is for: ${review.audience}`,
    '',
    'Problems to fix, most important first:',
    ...review.problems.map((p, i) =>
      [
        `${i + 1}. ${p.title}.`,
        p.quote ? ` Current text: "${p.quote}".` : '',
        ` Why it matters: ${p.why}`,
        ` Fix: ${p.fix}`,
      ].join(''),
    ),
    '',
    'Keep what works:',
    ...review.strengths.map((s) => `- ${s}`),
    '',
    'Suggested direction for the top of the page:',
    `- Headline: ${review.rewrite.headline}`,
    `- Subheadline: ${review.rewrite.subheadline}`,
    `- Main button: ${review.rewrite.cta}`,
    '',
    'Changes to make, in order:',
    ...review.nextSteps.map((s, i) => `${i + 1}. ${s}`),
    '',
    'Return the full revised page copy, section by section, followed by a short list of the placeholders I need to fill in.',
  ]
  if (!url) lines.push('', 'My current copy:', '"""', input.trim(), '"""')
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
    `Reviewed with Landing Page Review (https://nithyapriya.com/review) on ${date}.`,
    `Source: ${url ?? 'pasted copy'}`,
    '',
    '## Summary',
    '',
    `**Score: ${review.score}/10.** ${review.verdict}`,
    '',
    review.summary,
    '',
    `**Who it seems to be for:** ${review.audience}`,
    '',
    '## Scores',
    '',
    '| Area | Score | Note |',
    '| --- | --- | --- |',
    ...review.breakdown.map((b) => `| ${b.area} | ${b.score}/10 | ${b.note.replace(/\|/g, '/')} |`),
    '',
    '## Problems to fix',
    '',
    ...review.problems.flatMap((p, i) => [
      `### ${i + 1}. ${p.title}`,
      '',
      ...(p.quote ? [`- **Current:** "${p.quote}"`] : []),
      `- **Why it matters:** ${p.why}`,
      `- **Fix:** ${p.fix}`,
      '',
    ]),
    '## Keep what works',
    '',
    ...review.strengths.map((s) => `- ${s}`),
    '',
    '## Suggested copy',
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
    'Reviewed with Landing Page Review at nithyapriya.com/review',
  ].join('\n')
}
