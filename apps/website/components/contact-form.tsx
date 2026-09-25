'use client'

import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { track } from '@/lib/analytics'
import { mailtoHref, siteConfig } from '@/config'

type Status = 'idle' | 'sending' | 'sent'

const field =
  'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25'

/** The "Tell me about your project" form. Emails the message to me. */
export function ContactForm({ id = 'contact' }: { id?: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<{ message: string; fallback?: boolean } | null>(null)
  const [sentTo, setSentTo] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
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
      setStatus('sent')
      form.reset()
      track('contact_submitted')
    } catch {
      setError({ message: "Couldn't send your message. Check your connection, or email me directly:", fallback: true })
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-3xl bg-card p-7 text-text-primary md:p-8" role="status">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-light text-accent">
          <Check size={20} aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-semibold">Thanks, your message is on its way.</h3>
        <p className="mt-3 leading-relaxed text-text-muted">
          I read every enquiry myself and will reply to {sentTo || 'you'} with a few
          questions or a time to talk.
        </p>
        <button onClick={() => setStatus('idle')} className="text-link mt-6 text-[0.9375rem]">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className="rounded-3xl bg-card p-6 text-text-primary shadow-[0_30px_60px_-30px_rgba(6,13,31,0.5)] md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-[0.9375rem] font-medium">
          Name
          <input name="name" required autoComplete="name" maxLength={100} className={field} />
        </label>
        <label className="block text-[0.9375rem] font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            className={field}
          />
        </label>
      </div>
      <label className="mt-5 block text-[0.9375rem] font-medium">
        Company or website <span className="font-normal text-text-muted">(optional)</span>
        <input name="company" autoComplete="organization" maxLength={200} className={field} />
      </label>
      <label className="mt-5 block text-[0.9375rem] font-medium">
        What would you like to build?
        <textarea
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="A few lines is plenty: what it should do, who it's for, and any timing you have in mind."
          className={`${field} resize-y`}
        />
      </label>
      {/* Spam trap: hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-accent-light px-4 py-3 text-[0.9375rem]" role="alert">
          {error.message}{' '}
          {error.fallback && (
            <a href={mailtoHref} className="text-link">
              {siteConfig.email}
            </a>
          )}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text-muted">Your details are only used to reply to you.</p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary !px-6 !py-3 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
