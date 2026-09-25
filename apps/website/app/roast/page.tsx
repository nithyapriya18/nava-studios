'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'
import { track } from '@/lib/analytics'
import { contactHref, contactLabel, contactIsExternal } from '@/config'

interface RoastResult {
  score: number
  headline: string
  roasts: string[]
  goodThing: string
  fix: string
}

export default function RoastPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RoastResult | null>(null)
  const [copied, setCopied] = useState(false)

  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput || loading) return

    track('roast_submitted', {
      input_type: /^https?:\/\//i.test(trimmedInput) ? 'url' : 'text',
      input_length: trimmedInput.length,
    })

    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: trimmedInput }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }
      setResult(data)
      track('roast_generated', { score: data.score })
    } catch {
      setError("Couldn't reach the roast engine. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    const text = `${result.score}/10: ${result.headline}\n\n${result.roasts
      .map((r) => `• ${r}`)
      .join('\n')}\n\nWhat's working: ${result.goodThing}\n\nFix this first: ${result.fix}\n\nRoasted at nithyapriya.com/roast`
    navigator.clipboard.writeText(text)
    track('roast_copied', { score: result.score })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    track('roast_another_started')
    setResult(null)
    setError(null)
    setInput('')
  }

  return (
    <div className="mx-auto max-w-content px-6 pt-16 md:px-8 md:pt-24">
      <header>
        <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Roast My Launch</h1>
        <p className="mt-6 text-xl leading-relaxed text-text-primary">
          Paste your landing page copy, your pitch, or a link, and get a blunt, specific
          review in about 20 seconds. It&apos;s free.
        </p>
      </header>

      <section className="mt-12" aria-live="polite">
        {!result && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="roast-input" className="text-[0.9375rem] font-medium text-text-primary">
              What should I look at?
            </label>
            <textarea
              id="roast-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your headline and subhead, a one-line pitch, or a URL starting with https://"
              rows={7}
              maxLength={6000}
              className="mt-3 w-full resize-y rounded-2xl border border-border bg-white/60 p-4 text-text-primary placeholder:text-text-muted/70 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-sm font-sans text-sm text-text-muted">
                Some sites block automatic fetching. If a link fails, paste the text
                instead.
              </p>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Reading it…' : 'Roast it'}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 rounded-2xl bg-accent-light p-4 font-sans text-[0.9375rem] text-text-primary">
            <span>{error}</span>
            {result === null && (
              <button onClick={() => setError(null)} className="text-link">
                Dismiss
              </button>
            )}
          </div>
        )}

        {result && (
          <div>
            <div className="flex items-baseline gap-5 border-b border-border pb-8">
              <p className="shrink-0 font-sans text-6xl font-semibold tabular-nums text-accent">
                {result.score}
                <span className="text-2xl text-text-muted">/10</span>
              </p>
              <p className="font-sans text-2xl font-medium leading-snug text-text-primary">
                {result.headline}
              </p>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-text-primary">What&apos;s wrong</h2>
            <ol className="mt-3 space-y-3">
              {result.roasts.map((r, i) => (
                <li key={i} className="grid grid-cols-[1.5rem_1fr] leading-relaxed text-text-primary">
                  <span className="font-sans tabular-nums text-accent">{i + 1}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-8 text-lg font-semibold text-text-primary">What&apos;s working</h2>
            <p className="mt-3 leading-relaxed text-text-primary">{result.goodThing}</p>

            <div className="mt-8 rounded-2xl bg-accent-light p-5">
              <h2 className="text-lg font-semibold text-accent">Fix this first</h2>
              <p className="mt-2 leading-relaxed text-text-primary">{result.fix}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={handleCopy} className="btn-default">
                {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                {copied ? 'Copied' : 'Copy the roast'}
              </button>
              <button onClick={reset} className="btn-default">
                Roast something else
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-20 border-t border-border pt-10">
        <p className="text-lg leading-relaxed text-text-muted">
          Roast My Launch is one of the things in my{' '}
          <Link href="/lab" className="text-link">
            lab
          </Link>
          . My actual work is building first versions of products for people who have
          an idea.{' '}
          <Link href="/start" className="text-link">
            Here&apos;s how that works
          </Link>
          .
        </p>
        <a href={contactHref} className="btn-primary mt-6" {...ctaProps}>
          {contactLabel}
        </a>
      </section>
    </div>
  )
}
