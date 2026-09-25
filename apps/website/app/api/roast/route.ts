import { NextRequest, NextResponse } from 'next/server'
import { checkIpLimit, checkDailyLimit, clientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 30

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_INPUT_CHARS = 6000

const SYSTEM_PROMPT = `You are the reviewer behind "Roast My Launch" — a tool that gives founders the honest, specific feedback their friends are too nice to give. Someone just pasted their landing page copy, pitch, or product description below. Review it.

Voice: sharp, funny, direct — never cruel, never generic. Every line has to be about THIS submission, not boilerplate startup advice. Write like a senior product person who actually read what they sent and doesn't flatter them. Use plain punctuation: no em dashes.

Respond with ONLY valid JSON, no markdown fences, no commentary outside the JSON, matching exactly this shape:
{
  "score": <integer 1-10, how convincing and clear this would be to a total stranger>,
  "headline": "<one punchy verdict sentence, max 14 words>",
  "roasts": ["<specific, funny, true observation>", "<another>", "<another>"],
  "goodThing": "<one genuine, specific thing that actually works>",
  "fix": "<the single highest-leverage change to make, one sentence>"
}

"roasts" must have exactly 3 items, each one sentence, each anchored to specific words, claims, or structure in what was actually submitted. Never a generic note like "improve your CTA" unless you quote or point at exactly what's wrong with THIS one.`

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

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers)

  const daily = await checkDailyLimit()
  if (!daily.success) {
    return NextResponse.json(
      { error: 'Roast My Launch has hit its daily limit. Try again tomorrow.' },
      { status: 429 },
    )
  }

  const perIp = await checkIpLimit(ip)
  if (!perIp.success) {
    return NextResponse.json(
      { error: "That's a lot of roasts in a few minutes. Wait a little and try again." },
      { status: 429 },
    )
  }

  let body: { input?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const raw = (body.input ?? '').trim()
  if (!raw) {
    return NextResponse.json({ error: 'Paste something to roast first.' }, { status: 400 })
  }
  if (raw.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_INPUT_CHARS} characters.` },
      { status: 400 },
    )
  }

  let textToRoast = raw

  if (looksLikeUrl(raw)) {
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RoastMyLaunchBot/1.0)' },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const html = await res.text()
      const text = stripHtml(html).slice(0, MAX_INPUT_CHARS)
      if (text.length < 40) throw new Error('too little text')
      textToRoast = text
    } catch {
      return NextResponse.json(
        {
          error:
            "Couldn't read that page, because some sites block automatic requests. Paste the text instead: your headline, subhead, and a line or two of copy.",
        },
        { status: 422 },
      )
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Roast engine is not wired up yet (missing ANTHROPIC_API_KEY on the server).' },
      { status: 500 },
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
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Roast this:\n\n${textToRoast}` }],
      }),
      signal: AbortSignal.timeout(25000),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('Anthropic API error', anthropicRes.status, errText)
      return NextResponse.json({ error: 'The roast engine hiccuped. Try again.' }, { status: 502 })
    }

    const data = await anthropicRes.json()
    const content: string = data?.content?.[0]?.text ?? ''

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      const match = content.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('unparseable response')
      parsed = JSON.parse(match[0])
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Roast route failure', err)
    return NextResponse.json({ error: 'The roast engine hiccuped. Try again.' }, { status: 500 })
  }
}
