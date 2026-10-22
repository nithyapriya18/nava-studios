'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'

type Comment = { id: number; created_at: string; name: string; body: string }

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
    <section style={{ marginTop: 72 }} aria-labelledby="comments-title">
      <h2 id="comments-title" className="h2" style={{ fontSize: 36, marginBottom: 8 }}>
        Comments{count > 0 ? ` (${count})` : ''}
      </h2>

      {comments && comments.length > 0 && (
        <ol className="posts" style={{ marginTop: 20 }}>
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <p className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span style={{ fontWeight: 500 }}>{c.name}</span>
                <time dateTime={c.created_at} className="muted">
                  {new Date(c.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </p>
              <p className="whitespace-pre-line">{c.body}</p>
            </li>
          ))}
        </ol>
      )}
      {comments && comments.length === 0 && (
        <p className="muted" style={{ fontSize: 16 }}>No comments yet. What did you think?</p>
      )}

      {status === 'sent' ? (
        <div className="panel sent" style={{ marginTop: 28 }} role="status">
          <span className="hand">received, thank you{sentName ? `, ${sentName}` : ''}</span>
          <p>It will appear here once I&apos;ve read and approved it.</p>
          <div>
            <button type="button" onClick={() => setStatus('idle')} className="btn-quiet btn-sm">
              Leave another comment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="panel form" style={{ marginTop: 28, position: 'relative' }}>
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" name="name" required maxLength={80} autoComplete="name" className="input" />
          </div>
          <div className="field">
            <label htmlFor="c-email">
              Email <span className="hint">(optional, never shown)</span>
            </label>
            <input id="c-email" name="email" type="email" maxLength={200} autoComplete="email" className="input" />
          </div>
          <div className="field">
            <label htmlFor="c-body">Comment</label>
            <textarea id="c-body" name="body" required rows={4} maxLength={2000} className="input" />
          </div>
          {/* Spam trap: hidden from people, filled in by bots. */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <button type="submit" disabled={status === 'sending'} className="btn-primary" aria-live="polite">
              {status === 'sending' ? 'Sending…' : 'Post comment'}
            </button>
            <p className="muted" style={{ fontSize: 13 }}>
              Comments appear after I approve them. Your name and comment are public; your email
              isn&apos;t. <Link href="/privacy">Privacy</Link>
            </p>
          </div>
        </form>
      )}
    </section>
  )
}
