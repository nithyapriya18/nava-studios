import { NextRequest, NextResponse } from 'next/server'
import { checkIpLimit, checkDailyLimit, clientIp, PER_IP_LIMIT } from '@/lib/rate-limit'
import type { Review } from '@/lib/review'
import { REVIEW_PRODUCT } from '@/lib/products'

export const runtime = 'nodejs'
export const maxDuration = 60

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_INPUT_CHARS = 6000

const SYSTEM_PROMPT = `You write the reviews for "${REVIEW_PRODUCT.name}", a free tool on a software studio's website. Someone has pasted their landing page copy, pitch or product description. Review it the way an experienced product consultant would for a client: direct, specific, constructive and professional in tone. Be honest about weaknesses without being harsh or sarcastic.

Rules:
- Every point must be about THIS submission. Quote their exact words wherever you can. Never give generic startup advice.
- Judge it as a stranger landing on the page would: can they tell what it is, who it's for, why it's better, and what to do next?
- Suggested copy must stay true to what they described. Never invent numbers, customers, features or results. Where proof is missing, use a clear placeholder such as [number of customers].
- Write in plain English with plain punctuation. Never use dashes of any kind ("-", "–" or "—") as punctuation between words or clauses; use a comma, a colon or a new sentence instead.
- Submit your review with the submit_review tool.`

const REVIEW_TOOL = {
  name: 'submit_review',
  description: 'Submit the finished review of the landing page.',
  input_schema: {
    type: 'object',
    required: ['score', 'verdict', 'summary', 'audience', 'breakdown', 'problems', 'strengths', 'rewrite', 'nextSteps'],
    properties: {
      score: { type: 'integer', minimum: 1, maximum: 10, description: 'How clear and convincing this is to a stranger.' },
      verdict: { type: 'string', description: 'One clear sentence summing up the page, at most 16 words.' },
      summary: { type: 'string', description: 'Two or three sentences: what the page seems to offer and the overall impression.' },
      audience: { type: 'string', description: 'Who the page seems to be for, as a stranger would read it. Say so if it is unclear.' },
      breakdown: {
        type: 'array',
        minItems: 5,
        maxItems: 5,
        items: {
          type: 'object',
          required: ['area', 'score', 'note'],
          properties: {
            area: { type: 'string', enum: ['Clarity', 'Audience', 'Value', 'Proof', 'Call to action'] },
            score: { type: 'integer', minimum: 1, maximum: 10 },
            note: { type: 'string', description: 'One sentence on this area, specific to the submission.' },
          },
        },
      },
      problems: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        description: 'The biggest problems, most important first.',
        items: {
          type: 'object',
          required: ['title', 'quote', 'why', 'fix'],
          properties: {
            title: { type: 'string', description: 'Short name for the problem.' },
            quote: { type: 'string', description: 'Their exact words this is about, or an empty string if it is about structure.' },
            why: { type: 'string', description: 'Why it hurts, in one or two sentences.' },
            fix: { type: 'string', description: 'Exactly what to change, in one or two sentences.' },
          },
        },
      },
      strengths: {
        type: 'array',
        minItems: 1,
        maxItems: 3,
        items: { type: 'string', description: 'Something specific that works and should be kept.' },
      },
      rewrite: {
        type: 'object',
        required: ['headline', 'subheadline', 'cta'],
        properties: {
          headline: { type: 'string' },
          subheadline: { type: 'string' },
          cta: { type: 'string', description: 'Button text.' },
        },
      },
      nextSteps: {
        type: 'array',
        minItems: 3,
        maxItems: 6,
        items: { type: 'string', description: 'One concrete action, starting with a verb.' },
        description: 'What to do, in order of impact.',
      },
    },
  },
}

function looksLikeUrl(input: string) {
  const trimmed = input.trim()
  if (/^https?:\/\//i.test(trimmed)) return true
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(trimmed) && !trimmed.includes(' ')
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const arr = (v: unknown) => (Array.isArray(v) ? v : [])
const clampScore = (v: unknown) => Math.min(10, Math.max(1, Math.round(Number(v) || 1)))

/** Coerce the model's output into the shape the page expects. */
function normalise(raw: Record<string, unknown>): Review {
  const rewrite = (raw.rewrite ?? {}) as Record<string, unknown>
  return {
    score: clampScore(raw.score),
    verdict: str(raw.verdict),
    summary: str(raw.summary),
    audience: str(raw.audience),
    breakdown: arr(raw.breakdown).map((b: Record<string, unknown>) => ({
      area: str(b.area),
      score: clampScore(b.score),
      note: str(b.note),
    })),
    problems: arr(raw.problems).map((p: Record<string, unknown>) => ({
      title: str(p.title),
      quote: str(p.quote),
      why: str(p.why),
      fix: str(p.fix),
    })),
    strengths: arr(raw.strengths).map(str).filter(Boolean),
    rewrite: {
      headline: str(rewrite.headline),
      subheadline: str(rewrite.subheadline),
      cta: str(rewrite.cta),
    },
    nextSteps: arr(raw.nextSteps).map(str).filter(Boolean),
  }
}

export async function POST(req: NextRequest) {
  let body: { input?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const raw = (body.input ?? '').trim()
  if (!raw) {
    return NextResponse.json({ error: 'Paste something to review first.' }, { status: 400 })
  }
  if (raw.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_INPUT_CHARS} characters.` },
      { status: 400 },
    )
  }

  let textToReview = raw

  // Fetch the page before counting against the limit, so a site that blocks
  // us doesn't use up one of the visitor's reviews.
  if (looksLikeUrl(raw)) {
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StudioNPVPageReview/1.0)' },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const html = await res.text()
      const text = stripHtml(html).slice(0, MAX_INPUT_CHARS)
      if (text.length < 40) throw new Error('too little text')
      textToReview = text
    } catch {
      return NextResponse.json(
        {
          error:
            "Couldn't read that page, because some sites block automatic requests. Paste the text instead: your headline, subheadline and the main sections. This didn't use up a review.",
        },
        { status: 422 },
      )
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'The review service is not set up yet (missing ANTHROPIC_API_KEY on the server).' },
      { status: 500 },
    )
  }

  const perIp = await checkIpLimit(clientIp(req.headers))
  if (!perIp.success) {
    return NextResponse.json(
      {
        error: `You've used your ${PER_IP_LIMIT} free reviews for today. Come back tomorrow, or get in touch if you'd like to talk the page through.`,
        limited: true,
      },
      { status: 429 },
    )
  }

  const daily = await checkDailyLimit()
  if (!daily.success) {
    return NextResponse.json(
      {
        error: 'The review service has reached its limit for today. Try again tomorrow.',
        limited: true,
      },
      { status: 429 },
    )
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        tools: [REVIEW_TOOL],
        tool_choice: { type: 'tool', name: REVIEW_TOOL.name },
        messages: [{ role: 'user', content: `Review this:\n\n${textToReview}` }],
      }),
      signal: AbortSignal.timeout(50000),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('Anthropic API error', anthropicRes.status, errText)
      return NextResponse.json({ error: 'The review service hiccuped. Try again.' }, { status: 502 })
    }

    const data = await anthropicRes.json()
    const toolUse = (data?.content ?? []).find(
      (block: { type: string }) => block.type === 'tool_use',
    )
    if (!toolUse?.input) throw new Error('no tool_use block in response')

    const review = normalise(toolUse.input)
    if (!review.verdict || review.problems.length === 0) throw new Error('incomplete review')

    return NextResponse.json(review)
  } catch (err) {
    console.error('Review route failure', err)
    return NextResponse.json({ error: 'The review service hiccuped. Try again.' }, { status: 500 })
  }
}
