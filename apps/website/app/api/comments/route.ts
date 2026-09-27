import { NextRequest, NextResponse, after } from 'next/server'
import { getAllPosts } from '@/lib/mdx'
import { addComment, approvedComments } from '@/lib/comments'
import { checkCommentLimit, clientIp } from '@/lib/rate-limit'
import { requestMeta } from '@/lib/review-log'
import { siteConfig } from '@/config'

export const dynamic = 'force-dynamic'

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function postTitle(slug: string) {
  return getAllPosts('writing').find((p) => p.slug === slug)?.title ?? null
}

/** Approved comments for a post. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  if (!postTitle(slug)) return NextResponse.json({ comments: [] })
  return NextResponse.json(
    { comments: await approvedComments(slug) },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

/** A new comment. It's saved unapproved and emailed to the owner. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  // Hidden field that people never see; bots fill it in. Pretend it worked.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true })

  const slug = clean(body.slug, 120)
  const title = postTitle(slug)
  const name = clean(body.name, 80)
  const email = clean(body.email, 200)
  const text = clean(body.body, 2000)

  if (!title) return NextResponse.json({ error: 'That post wasn’t found.' }, { status: 404 })
  if (!name || text.length < 2) {
    return NextResponse.json({ error: 'Please add your name and a comment.' }, { status: 400 })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address doesn’t look right.' }, { status: 400 })
  }
  if ((text.match(/https?:\/\//gi) ?? []).length > 2) {
    return NextResponse.json({ error: 'Please include no more than two links.' }, { status: 400 })
  }

  const ip = clientIp(req.headers)
  const limit = await checkCommentLimit(ip)
  if (!limit.success) {
    return NextResponse.json(
      { error: 'You’ve left a few comments today already. Please try again tomorrow.' },
      { status: 429 },
    )
  }

  const meta = requestMeta(req.headers)
  const saved = await addComment({
    post_slug: slug,
    name,
    email: email || null,
    body: text,
    ip,
    country: meta.country,
    user_agent: meta.user_agent,
  })
  if (!saved) {
    return NextResponse.json({ error: 'Your comment couldn’t be saved. Please try again.' }, { status: 502 })
  }

  // Let the owner know, after the response is sent, with a link to approve
  // or delete it in one click.
  const apiKey = process.env.RESEND_API_KEY
  const moderateUrl = saved.token
    ? `${siteConfig.url}/comments/moderate?id=${saved.id}&t=${saved.token}`
    : null
  if (apiKey) {
    after(async () => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? `${siteConfig.name} <onboarding@resend.dev>`,
          to: [process.env.CONTACT_TO_EMAIL ?? siteConfig.email],
          ...(email ? { reply_to: email } : {}),
          subject: `New comment on "${title}"`,
          text: [
            `From: ${name}${email ? ` <${email}>` : ''}`,
            `Post: ${siteConfig.url}/writing/${slug}`,
            '',
            text,
            '',
            moderateUrl
              ? `It is waiting for your approval. Approve or delete it here: ${moderateUrl}`
              : 'It is waiting for approval. To publish it, open Supabase, go to Table Editor, then post_comments, and tick "approved" on this comment.',
          ].join('\n'),
          ...(moderateUrl
            ? {
                html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#0b1220">
<p style="margin:0 0 4px"><strong>${escapeHtml(name)}</strong>${email ? ` &lt;${escapeHtml(email)}&gt;` : ''} commented on <a href="${siteConfig.url}/writing/${slug}">${escapeHtml(title)}</a>:</p>
<blockquote style="margin:12px 0;padding:12px 16px;background:#f4f6fa;border-left:3px solid #012987;white-space:pre-line">${escapeHtml(text)}</blockquote>
<p style="margin:20px 0"><a href="${moderateUrl}" style="background:#012987;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold">Review comment</a></p>
<p style="margin:0;color:#5b6474;font-size:13px">The button opens a page where you can approve or delete it. The comment stays hidden until you approve it.</p>
</div>`,
              }
            : {}),
        }),
        signal: AbortSignal.timeout(10000),
      }).catch(() => null)
      if (res && !res.ok) console.error('[comments] notify failed', res.status)
    })
  }

  return NextResponse.json({ ok: true })
}
