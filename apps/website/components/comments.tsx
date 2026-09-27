'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Check, MessageCircle } from 'lucide-react'
import { track } from '@/lib/analytics'

type Comment = { id: number; created_at: string; name: string; body: string }

const field =
  'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25'

/** Approved comments for a post, and a form to leave one (it waits for approval). */
export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [sentName, setSentName] = useState('')

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { comments: [] }))
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]))
  }, [slug])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, slug }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        setStatus('idle')
        return
      }
      setSentName(String(data.name ?? ''))
      setStatus('sent')
      form.reset()
      track('comment_submitted', { post: slug })
    } catch {
      setError('Your comment couldn’t be sent. Check your connection and try again.')
      setStatus('idle')
    }
  }

  const count = comments?.length ?? 0

  return (
    <section className="mt-16 border-t border-border pt-10" aria-labelledby="comments-title">
      <h2 id="comments-title" className="flex items-center gap-2.5 text-2xl font-semibold text-text-primary">
        <MessageCircle size={22} className="text-accent" aria-hidden />
        Comments{count > 0 ? ` (${count})` : ''}
      </h2>

      {comments && comments.length > 0 && (
        <ol className="mt-6 space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span className="font-semibold text-text-primary">{c.name}</span>
                <time dateTime={c.created_at} className="text-text-muted">
                  {new Date(c.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </p>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-text-primary">{c.body}</p>
            </li>
          ))}
        </ol>
      )}
      {comments && comments.length === 0 && (
        <p className="mt-3 text-text-muted">No comments yet. What did you think?</p>
      )}

      {status === 'sent' ? (
        <div className="mt-8 flex gap-3 rounded-2xl bg-accent-light p-5 text-text-primary" role="status">
          <Check size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="font-medium">Thanks{sentName ? `, ${sentName}` : ''}. Your comment has been sent.</p>
            <p className="mt-1 text-[0.9375rem] text-text-muted">
              It will appear here once I&apos;ve read and approved it.
            </p>
            <button onClick={() => setStatus('idle')} className="text-link mt-3 text-[0.9375rem]">
              Leave another comment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="relative mt-8 rounded-3xl border border-border bg-card p-6 md:p-7">
          <p className="font-semibold text-text-primary">Leave a comment</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-[0.9375rem] font-medium text-text-primary">
              Name
              <input name="name" required maxLength={80} autoComplete="name" className={field} />
            </label>
            <label className="block text-[0.9375rem] font-medium text-text-primary">
              Email <span className="font-normal text-text-muted">(optional, never shown)</span>
              <input name="email" type="email" maxLength={200} autoComplete="email" className={field} />
            </label>
          </div>
          <label className="mt-4 block text-[0.9375rem] font-medium text-text-primary">
            Comment
            <textarea name="body" required rows={4} maxLength={2000} className={`${field} resize-y`} />
          </label>
          {/* Spam trap: hidden from people, filled in by bots. */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-accent-light px-4 py-3 text-[0.9375rem] text-text-primary" role="alert">
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-sm text-xs leading-relaxed text-text-muted">
              Comments appear after I approve them. Your name and comment are shown
              publicly; your email isn&apos;t.{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-text-primary">
                Privacy policy
              </Link>
            </p>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary disabled:cursor-wait disabled:opacity-70"
            >
              {status === 'sending' ? 'Sending…' : 'Post comment'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
