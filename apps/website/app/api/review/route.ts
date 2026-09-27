import { NextRequest, NextResponse, after } from 'next/server'
import { checkIpLimit, checkDailyLimit, clientIp, reviewQuota, PER_IP_LIMIT } from '@/lib/rate-limit'
import type { Review } from '@/lib/review'
import { REVIEW_PRODUCT } from '@/lib/products'
import { logReview, requestMeta, type ReviewOutcome } from '@/lib/review-log'
import { OWNER_COOKIE, isOwnerKey } from '@/lib/owner'
import { parseImageDataUrl, screenshotUrl } from '@/lib/screenshot'

const OWNER_QUOTA = { remaining: 999, limit: 999, resetsAt: null, owner: true }

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

/** How many reviews the visitor has left today. Doesn't use one up. */
export async function GET(req: NextRequest) {
  const quota = isOwnerKey(req.cookies.get(OWNER_COOKIE)?.value)
    ? OWNER_QUOTA
    : await reviewQuota(clientIp(req.headers))
  return NextResponse.json(quota, { headers: { 'Cache-Control': 'no-store' } })
}

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_INPUT_CHARS = 6000

const SYSTEM_PROMPT = `You write the reviews for "${REVIEW_PRODUCT.name}", a free tool on a software studio's website. Someone has pasted their landing page copy, pitch or product description. Review it the way an experienced product consultant would for a client: direct, specific, constructive and professional in tone. Be honest about weaknesses without being harsh or sarcastic.

Rules:
- Every point must be about THIS submission. Quote their exact words wherever you can. Never give generic startup advice.
- Judge it as a stranger landing on the page would: can they tell what it is, who it's for, why it's better, and what to do next?
- Suggested copy must stay true to what they described. Never invent numbers, customers, features or results. Where proof is missing, use a clear placeholder such as [number of customers].
- Write in plain English with plain punctuation. Never use dashes of any kind ("-", "–" or "—") as punctuation between words or clauses; use a comma, a colon or a new sentence instead.
- If a screenshot of the page is attached, also judge what it shows: visual hierarchy, whether the main message and the main button stand out, readability and clutter. Score it as the "Design and layout" area and raise visual problems where they matter, saying where on the page they are, since you can't quote them. If no screenshot is attached, leave "Design and layout" out.
- If the page text is missing or thin, review from the screenshot.
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
        maxItems: 6,
        description: 'The five areas, plus "Design and layout" only when a screenshot is attached.',
        items: {
          type: 'object',
          required: ['area', 'score', 'note'],
          properties: {
            area: {
              type: 'string',
              enum: ['Clarity', 'Audience', 'Value', 'Proof', 'Call to action', 'Design and layout'],
            },
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
  let body: { input?: string; image?: unknown }
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
  const uploaded = body.image ? parseImageDataUrl(body.image) : null
  if (body.image && !uploaded) {
    return NextResponse.json(
      { error: 'That screenshot couldn’t be used. Try a PNG or JPEG under 3 MB.' },
      { status: 400 },
    )
  }

  const ip = clientIp(req.headers)
  const owner = isOwnerKey(req.cookies.get(OWNER_COOKIE)?.value)
  const meta = requestMeta(req.headers)
  const isLink = looksLikeUrl(raw)
  const inputType = isLink ? 'link' : 'text'
  // Saved after the response is sent, so it never slows a review down.
  const log = (outcome: ReviewOutcome, extra: { score?: number; verdict?: string; review?: unknown } = {}) =>
    after(() =>
      logReview({
        outcome,
        input_type: inputType,
        input: raw,
        ip,
        ...meta,
        // Owner's own reviews are tagged so they're easy to filter out.
        user_agent: owner ? `[owner] ${meta.user_agent ?? ''}` : meta.user_agent,
        ...extra,
      }),
    )

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'The review service is not set up yet (missing ANTHROPIC_API_KEY on the server).' },
      { status: 500 },
    )
  }

  const limited = async (outcome: 'limit_visitor' | 'limit_site') => {
    log(outcome)
    return NextResponse.json(
      {
        error:
          outcome === 'limit_visitor'
            ? `You've used your ${PER_IP_LIMIT} free reviews for today. Get in touch if you'd like to talk the page through.`
            : 'The review service has reached its limit for today. Try again tomorrow.',
        limited: true,
        quota: { ...(await reviewQuota(ip)), remaining: 0 },
      },
      { status: 429 },
    )
  }

  // Check (without using up) the visitor's allowance before spending a
  // screenshot on them.
  if (!owner && (await reviewQuota(ip)).remaining === 0) return limited('limit_visitor')

  // For a link, read the page text and take a screenshot at the same time.
  // A page that blocks one can often still be reviewed from the other; if
  // both fail, the visitor keeps their review.
  let pageText: string | null = raw
  let pageShot: string | null = null
  if (isLink) {
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    const readText = async () => {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StudioNPVPageReview/1.0)' },
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) return null
        const text = stripHtml(await res.text()).slice(0, MAX_INPUT_CHARS)
        return text.length >= 40 ? text : null
      } catch {
        return null
      }
    }
    ;[pageText, pageShot] = await Promise.all([readText(), screenshotUrl(url)])
    if (!pageText && !pageShot) {
      log('unreadable_link')
      return NextResponse.json(
        {
          error:
            "Couldn't read that page, because some sites block automatic requests. Switch to Paste copy and paste your headline, subheadline and main sections, and add a screenshot if you have one. This didn't use up a review.",
        },
        { status: 422 },
      )
    }
  }

  const perIp = owner ? { success: true } : await checkIpLimit(ip)
  if (!perIp.success) return limited('limit_visitor')
  const daily = owner ? { success: true } : await checkDailyLimit()
  if (!daily.success) return limited('limit_site')

  const image = uploaded
    ? { type: 'image', source: { type: 'base64', media_type: uploaded.mediaType, data: uploaded.data } }
    : pageShot
      ? { type: 'image', source: { type: 'url', url: pageShot } }
      : null
  const text = pageText
    ? `Review this${image ? ' page. A screenshot of the top of the page is attached.' : ':'}\n\n${pageText}`
    : 'Review this page. Its text could not be read, so review it from the attached screenshot of the top of the page.'

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
        max_tokens: 2400,
        system: SYSTEM_PROMPT,
        tools: [REVIEW_TOOL],
        tool_choice: { type: 'tool', name: REVIEW_TOOL.name },
        messages: [{ role: 'user', content: image ? [image, { type: 'text', text }] : text }],
      }),
      signal: AbortSignal.timeout(50000),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('Anthropic API error', anthropicRes.status, errText)
      log('error')
      return NextResponse.json({ error: 'The review service hiccuped. Try again.' }, { status: 502 })
    }

    const data = await anthropicRes.json()
    const toolUse = (data?.content ?? []).find(
      (block: { type: string }) => block.type === 'tool_use',
    )
    if (!toolUse?.input) throw new Error('no tool_use block in response')

    const review = normalise(toolUse.input)
    if (!review.verdict || review.problems.length === 0) throw new Error('incomplete review')
    // Only a screenshot can support a design score.
    if (!image) review.breakdown = review.breakdown.filter((b) => b.area !== 'Design and layout')

    const withVisual = {
      ...review,
      visual: image ? (uploaded ? 'uploaded' : 'screenshot') : 'none',
      screenshot: pageShot ?? undefined,
    }
    log('reviewed', { score: review.score, verdict: review.verdict, review: withVisual })
    const quota = owner ? OWNER_QUOTA : await reviewQuota(ip)
    return NextResponse.json({ ...withVisual, quota })
  } catch (err) {
    console.error('Review route failure', err)
    log('error')
    return NextResponse.json({ error: 'The review service hiccuped. Try again.' }, { status: 500 })
  }
}
