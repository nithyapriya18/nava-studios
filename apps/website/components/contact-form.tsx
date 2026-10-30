'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { mailtoHref, siteConfig } from '@/config'

// 'done' is the moment the button shows its tick, before the thank-you panel.
type Status = 'idle' | 'sending' | 'done' | 'sent'

/** The "Tell me about your project" form. Emails the message to me. */
export function ContactForm({ id = 'contact-form' }: { id?: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<{ message: string; fallback?: boolean } | null>(null)
  const [sentTo, setSentTo] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status !== 'idle') return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError({ message: json.error ?? 'Something went wrong. Please try again.', fallback: json.fallback })
        setStatus('idle')
        return
      }
      setSentTo(String(data.email ?? ''))
      setStatus('done')
      form.reset()
      track('contact_submitted')
      setTimeout(() => setStatus('sent'), 900)
    } catch {
      setError({ message: "Couldn't send your message. Check your connection, or email me directly:", fallback: true })
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="panel sent" role="status">
        <span className="hand">got it, thank you</span>
        <p style={{ font: '400 30px/1.15 var(--serif)' }}>
          I’ll reply to {sentTo || 'you'} by email within a few working days.
        </p>
        <p className="muted">
          While you wait, <Link href="/writing/what-i-need-from-the-first-call">what to bring to the first call</Link>{' '}
          takes two minutes to read.
        </p>
        <div>
          <button type="button" onClick={() => setStatus('idle')} className="btn-quiet btn-sm">
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={onSubmit} className="panel form" style={{ position: 'relative' }}>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" required autoComplete="name" maxLength={100} className="input" />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" required autoComplete="email" maxLength={200} className="input" />
      </div>
      <div className="field">
        <label htmlFor="f-co">
          Company or website <span className="hint">(optional)</span>
        </label>
        <input id="f-co" name="company" autoComplete="organization" maxLength={200} className="input" />
      </div>
      <div className="field">
        <label htmlFor="f-msg">What would you like to build?</label>
        <textarea
          id="f-msg"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="Who it’s for, what it should do first, and anything you already have."
          className="input"
        />
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
          {error.message}{' '}
          {error.fallback && <a href={mailtoHref}>{siteConfig.email}</a>}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        {/* Aceternity's Stateful Button: a spinner grows in while sending, then a tick. */}
        <button type="submit" disabled={status !== 'idle'} className="btn-primary stateful" aria-live="polite">
          <span className={`sb-icon${status === 'sending' ? ' on' : ''}`} aria-hidden>
            <svg className="sb-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 3a9 9 0 1 0 9 9" />
            </svg>
          </span>
          <span className={`sb-icon${status === 'done' ? ' on' : ''}`} aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          {status === 'sending' ? 'Sending' : status === 'done' ? 'Sent' : 'Send message'}
        </button>
        <p className="muted" style={{ fontSize: 13 }}>
          Your details are only used to reply to you. <Link href="/privacy">Privacy</Link>
        </p>
      </div>
    </form>
  )
}
