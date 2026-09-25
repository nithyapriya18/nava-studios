'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Copy, Check, Download, Sparkles } from 'lucide-react'
import { track } from '@/lib/analytics'
import { toPlan, toPrompt, toText, type Review } from '@/lib/review'

type Copied = 'prompt' | 'review' | null

export default function ReviewPage() {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; limited?: boolean } | null>(null)
  const [review, setReview] = useState<Review | null>(null)
  const [copied, setCopied] = useState<Copied>(null)

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
    setReview(null)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: trimmedInput }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError({ message: data.error ?? 'Something went wrong. Try again.', limited: data.limited })
        return
      }
      setSubmitted(trimmedInput)
      setReview(data)
      track('roast_generated', { score: data.score })
    } catch {
      setError({ message: "Couldn't reach the review service. Check your connection and try again." })
    } finally {
      setLoading(false)
    }
  }

  function copy(kind: Exclude<Copied, null>) {
    if (!review) return
    navigator.clipboard.writeText(kind === 'prompt' ? toPrompt(review, submitted) : toText(review))
    track(kind === 'prompt' ? 'roast_prompt_copied' : 'roast_copied', { score: review.score })
    setCopied(kind)
    setTimeout(() => setCopied(null), 2000)
  }

  function downloadPlan() {
    if (!review) return
    const blob = new Blob([toPlan(review, submitted)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plan.md'
    a.click()
    URL.revokeObjectURL(url)
    track('roast_plan_downloaded', { score: review.score })
  }

  function reset() {
    track('roast_another_started')
    setReview(null)
    setError(null)
    setInput('')
  }

  return (
    <div className="mx-auto max-w-layout px-6 pt-16 md:px-8 md:pt-24">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-accent">Free, two reviews a day</p>
        <h1 className="mt-2 text-5xl font-semibold text-text-primary md:text-6xl">
          Landing Page Review
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-text-muted">
          Paste your landing page copy, your pitch or a link. In under a minute you get a
          detailed review: a score, what a first-time visitor won&apos;t understand,
          what&apos;s working, and the specific changes to make. You can take the fixes
          straight into your AI tool as a prompt, or download them as a plan.
        </p>
      </header>

      <section className="mt-12 max-w-3xl" aria-live="polite">
        {!review && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="review-input" className="text-[0.9375rem] font-medium text-text-primary">
              What should I look at?
            </label>
            <textarea
              id="review-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your headline, subheadline and main sections, a one-line pitch, or a URL starting with https://"
              rows={8}
              maxLength={6000}
              className="mt-3 w-full resize-y rounded-2xl border border-border bg-card p-4 text-text-primary placeholder:text-text-muted/70 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-md text-sm text-text-muted">
                Some sites block automatic reading. If a link fails, paste the text
                instead; a failed link doesn&apos;t use up a review.
              </p>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary shrink-0 !px-6 !py-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Reviewing, about 30 seconds…' : 'Review my page'}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-accent-light p-5 text-[0.9375rem] text-text-primary">
            <p>{error.message}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {error.limited && (
                <Link href="/contact" className="text-link">
                  Get in touch
                </Link>
              )}
              <button onClick={() => setError(null)} className="text-link">
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>

      {review && (
        <section className="mt-4 grid gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-16">
          <div>
            <div className="flex items-baseline gap-5 border-b border-border pb-8">
              <p className="text-grad shrink-0 text-7xl font-bold tabular-nums">
                {review.score}
                <span className="text-2xl">/10</span>
              </p>
              <p className="text-2xl font-semibold leading-snug text-text-primary">
                {review.verdict}
              </p>
            </div>

            <p className="mt-8 text-lg leading-relaxed text-text-primary">{review.summary}</p>
            <p className="mt-3 leading-relaxed text-text-muted">
              <span className="font-medium text-text-primary">Who it seems to be for: </span>
              {review.audience}
            </p>

            <h2 className="mt-12 text-2xl font-semibold text-text-primary">Scores</h2>
            <ul className="mt-5 space-y-5">
              {review.breakdown.map((b) => (
                <li key={b.area}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-text-primary">{b.area}</span>
                    <span className="text-sm tabular-nums text-text-muted">{b.score}/10</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${b.score * 10}%`, backgroundImage: 'var(--grad-button)' }}
                    />
                  </div>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">{b.note}</p>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-semibold text-text-primary">What&apos;s not working</h2>
            <ol className="mt-5 space-y-5">
              {review.problems.map((p, i) => (
                <li key={i} className="rounded-3xl border border-border bg-card p-6">
                  <p className="text-sm tabular-nums text-accent">Issue {i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold text-text-primary">{p.title}</h3>
                  {p.quote && (
                    <blockquote className="mt-3 border-l-2 border-accent/40 pl-4 italic text-text-muted">
                      &ldquo;{p.quote}&rdquo;
                    </blockquote>
                  )}
                  <p className="mt-3 leading-relaxed text-text-muted">{p.why}</p>
                  <p className="mt-3 leading-relaxed text-text-primary">
                    <span className="font-semibold">Fix: </span>
                    {p.fix}
                  </p>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 text-2xl font-semibold text-text-primary">What&apos;s working</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-text-muted marker:text-accent">
              {review.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div className="theme-dark mt-12 rounded-3xl p-7 md:p-8">
              <h2 className="text-2xl font-semibold text-text-primary">What to do instead</h2>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-sm text-text-muted">Headline</dt>
                  <dd className="mt-1 text-xl font-semibold text-text-primary">
                    {review.rewrite.headline}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-text-muted">Subheadline</dt>
                  <dd className="mt-1 text-text-primary">{review.rewrite.subheadline}</dd>
                </div>
                <div>
                  <dt className="text-sm text-text-muted">Main button</dt>
                  <dd className="mt-1 text-text-primary">{review.rewrite.cta}</dd>
                </div>
              </dl>
              <h3 className="mt-8 font-semibold text-text-primary">In this order</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text-muted marker:text-accent">
                {review.nextSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="md:sticky md:top-28 md:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-text-primary">Take the fixes with you</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">
                Paste the prompt into Claude, ChatGPT, Cursor or Lovable to rewrite your
                page, or keep the plan in your project.
              </p>
              <div className="mt-5 grid gap-3">
                <button onClick={() => copy('prompt')} className="btn-primary w-full">
                  {copied === 'prompt' ? <Check size={16} aria-hidden /> : <Sparkles size={16} aria-hidden />}
                  {copied === 'prompt' ? 'Prompt copied' : 'Copy as AI prompt'}
                </button>
                <button onClick={downloadPlan} className="btn-default w-full">
                  <Download size={16} aria-hidden />
                  Download plan.md
                </button>
                <button onClick={() => copy('review')} className="btn-default w-full">
                  {copied === 'review' ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  {copied === 'review' ? 'Review copied' : 'Copy the review'}
                </button>
              </div>
              <button onClick={reset} className="text-link mt-5 text-[0.9375rem]">
                Review another page
              </button>
            </div>
          </aside>
        </section>
      )}

      <section className="mt-20 max-w-3xl border-t border-border pt-10">
        <h2 className="text-2xl font-semibold text-text-primary">Want help making the changes?</h2>
        <p className="mt-3 text-lg leading-relaxed text-text-muted">
          This review is a small example of how I look at a product. My main work is
          designing and building software for founders and small businesses.{' '}
          <Link href="/start" className="text-link">
            See how a project runs
          </Link>
          .
        </p>
        <Link href="/contact" className="btn-primary mt-6">
          Get in touch
        </Link>
      </section>
    </div>
  )
}
