'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Copy, Check, RotateCcw } from 'lucide-react'
import posthog from 'posthog-js'
import { contactHref, contactLabel, contactIsExternal, siteConfig } from '@/config'

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

    posthog.capture('roast_submitted', {
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
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setResult(data)
      posthog.capture('roast_generated', { score: data.score })
    } catch {
      setError('Could not reach the roast engine. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    const text = `${result.score}/10 — ${result.headline}\n\n${result.roasts
      .map((r) => `• ${r}`)
      .join('\n')}\n\nWhat's working: ${result.goodThing}\n\nFix this first: ${result.fix}\n\n— roasted at nithyapriya.com/roast`
    navigator.clipboard.writeText(text)
    posthog.capture('roast_copied', { score: result.score })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    posthog.capture('roast_another_started')
    setResult(null)
    setError(null)
    setInput('')
  }

  return (
    <div>
      <section className="bg-background py-16 md:py-20">
        <div className="max-w-content mx-auto px-6 md:px-8">
          <p className="text-sm font-medium text-accent mb-3">Free · takes about 20 seconds</p>
          <h1 className="text-4xl md:text-5xl font-medium text-text-primary mb-4">
            Roast My Launch
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-xl">
            Paste your landing page copy, your pitch, or a link. Get the honest,
            specific verdict your friends are too nice to give you.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12 md:py-16">
        <div className="max-w-content mx-auto px-6 md:px-8">
          {!result && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your headline + subhead, your one-line pitch, or a URL (https://...)"
                rows={7}
                maxLength={6000}
                className="w-full rounded-lg border border-border bg-background p-4 text-text-primary placeholder:text-text-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-y"
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-text-muted max-w-sm">
                  Some sites block automatic fetching — if a URL fails, paste the
                  text instead.
                </p>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn-primary shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Roasting…' : 'Roast it'}
                  {!loading && <ArrowRight size={14} aria-hidden />}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-6 rounded-lg border border-accent/40 bg-accent-light p-4 text-sm text-text-primary">
              {error}
              {result === null && (
                <button
                  onClick={() => setError(null)}
                  className="ml-3 underline underline-offset-4 text-accent"
                >
                  dismiss
                </button>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex items-baseline gap-4 border-b border-border pb-6">
                <span className="text-5xl font-medium text-accent tabular-nums">
                  {result.score}
                  <span className="text-xl text-text-muted">/10</span>
                </span>
                <p className="text-xl font-medium text-text-primary leading-snug">
                  {result.headline}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3">
                  What&rsquo;s actually wrong
                </p>
                <ul className="space-y-3">
                  {result.roasts.map((r, i) => (
                    <li key={i} className="flex gap-3 text-text-primary leading-relaxed">
                      <span className="text-accent font-medium shrink-0">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-text-muted mb-2">
                  What&rsquo;s working
                </p>
                <p className="text-text-primary leading-relaxed">{result.goodThing}</p>
              </div>

              <div className="rounded-lg border border-transparent bg-accent-light p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-accent mb-2">
                  Fix this first
                </p>
                <p className="text-text-primary leading-relaxed">{result.fix}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button onClick={handleCopy} className="btn-default">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy roast'}
                </button>
                <button onClick={reset} className="btn-default">
                  <RotateCcw size={14} />
                  Roast another
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="max-w-content mx-auto px-6 md:px-8 border-t border-border pt-10">
          <p className="text-text-muted leading-relaxed">
            Built by {siteConfig.founderFull} — I build first versions of
            products, for people who have an idea and need something real to put
            in front of users.
          </p>
          <a href={contactHref} className="btn-primary mt-5 inline-flex" {...ctaProps}>
            {contactLabel}
            <ArrowRight size={14} aria-hidden />
          </a>
        </div>
      </section>
    </div>
  )
}
