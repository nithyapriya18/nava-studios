'use client'

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  FileText,
  Gauge,
  Link2,
  ListChecks,
  PenLine,
  RotateCcw,
  Sparkles,
  ThumbsUp,
  Type,
} from 'lucide-react'
import { track } from '@/lib/analytics'
import { toPlan, toPrompt, toText, type Review } from '@/lib/review'
import { REVIEW_PRODUCT } from '@/lib/products'
import { AppIcon } from '@/components/products/app-icon'
import { ScoreRing } from '@/components/products/score-ring'

type Mode = 'text' | 'url'
type Copied = 'prompt' | 'review' | null

const STAGES = [
  'Reading your page',
  'Checking clarity and audience',
  'Scoring each area',
  'Writing your fixes',
]

const INCLUDES = [
  { icon: Gauge, title: 'A score out of 10', body: 'Plus clarity, audience, value, proof and call to action scored separately.' },
  { icon: AlertCircle, title: 'Issues, quoted', body: 'The exact words that cause problems, why they hurt, and how to fix them.' },
  { icon: PenLine, title: 'Suggested copy', body: 'A new headline, subheadline and button text to start from.' },
  { icon: Sparkles, title: 'Take it with you', body: 'Copy the fixes as an AI prompt, or download them as a plan.md.' },
]

// The link box starts with this so people only type their domain.
const URL_PREFIX = 'https://www.'

/** A pasted address replaces the prefix instead of being added after it. */
function normalisePastedUrl(pasted: string) {
  const t = pasted.trim()
  if (/^https?:\/\//i.test(t)) return t
  if (/^www\./i.test(t)) return `https://${t}`
  return null
}

/** True once there's a real address, not just the prefix. */
const hasAddress = (value: string) => /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+/i.test(value.trim())

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'scores', label: 'Scores' },
  { id: 'issues', label: 'Issues' },
  { id: 'working', label: "What's working" },
  { id: 'copy', label: 'Suggested copy' },
  { id: 'steps', label: 'Next steps' },
]

export function ReviewApp() {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState(URL_PREFIX)
  const urlRef = useRef<HTMLInputElement>(null)
  const [submitted, setSubmitted] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<{ message: string; limited?: boolean } | null>(null)
  const [review, setReview] = useState<Review | null>(null)
  const [copied, setCopied] = useState<Copied>(null)

  const input = (mode === 'text' ? text : url).trim()
  const ready = mode === 'text' ? input.length > 0 : hasAddress(url)

  // On switching to Page link, put the cursor after the prefix.
  useEffect(() => {
    if (mode !== 'url') return
    const el = urlRef.current
    if (!el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [mode])

  function onUrlPaste(e: ClipboardEvent<HTMLInputElement>) {
    const full = normalisePastedUrl(e.clipboardData.getData('text'))
    const el = e.currentTarget
    const onlyPrefix = el.value === URL_PREFIX || (el.selectionStart === 0 && el.selectionEnd === el.value.length)
    if (full && onlyPrefix) {
      e.preventDefault()
      setUrl(full)
    }
  }

  // Move through the progress stages while the review is being written.
  useEffect(() => {
    if (!loading) return
    setStage(0)
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4500)
    return () => clearInterval(timer)
  }, [loading])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!ready || loading) return

    track('roast_submitted', { input_type: mode, input_length: input.length })
    setLoading(true)
    setError(null)
    setReview(null)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError({ message: data.error ?? 'Something went wrong. Try again.', limited: data.limited })
        return
      }
      setSubmitted(input)
      setReview(data)
      track('roast_generated', { score: data.score })
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = 'plan.md'
    a.click()
    URL.revokeObjectURL(href)
    track('roast_plan_downloaded', { score: review.score })
  }

  function reset() {
    track('roast_another_started')
    setReview(null)
    setError(null)
  }

  const status = loading ? 'Reviewing' : review ? 'Review ready' : 'Ready'

  return (
    <div className="mx-auto max-w-layout px-4 pt-10 md:px-8 md:pt-14">
      <nav aria-label="Breadcrumb" className="px-2 text-sm text-text-muted md:px-0">
        <Link href="/products" className="hover:text-text-primary">
          Products
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-text-primary">{REVIEW_PRODUCT.name}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-center gap-5 px-2 md:px-0">
        <AppIcon size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold text-text-primary md:text-4xl">
            {REVIEW_PRODUCT.name}
          </h1>
          <p className="mt-1 text-text-muted">{REVIEW_PRODUCT.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-2 text-sm">
          {['Free', '2 reviews a day', 'About 30 seconds'].map((b) => (
            <li key={b} className="rounded-full border border-border bg-card px-3 py-1 text-text-muted">
              {b}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_40px_80px_-50px_rgba(1,41,135,0.45)]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-background/60 px-4 py-3 md:px-6">
          {!review ? (
            <div role="tablist" aria-label="Input type" className="inline-flex rounded-full bg-surface p-1 text-sm">
              {(
                [
                  ['text', 'Paste copy', Type],
                  ['url', 'Page link', Link2],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  role="tab"
                  type="button"
                  aria-selected={mode === value}
                  disabled={loading}
                  onClick={() => setMode(value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                    mode === value ? 'bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon size={14} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <button onClick={reset} className="btn-default !px-3.5 !py-1.5 text-sm">
              <RotateCcw size={14} aria-hidden />
              New review
            </button>
          )}
          <p className="ml-auto flex items-center gap-2 text-sm text-text-muted" aria-live="polite">
            <span
              className={`h-2 w-2 rounded-full ${
                loading ? 'animate-pulse bg-[#0a3a9c]' : review ? 'bg-[#11ab8c]' : 'bg-border'
              }`}
            />
            {status}
          </p>
        </div>

        {/* Input */}
        {!review && !loading && (
          <form onSubmit={handleSubmit} className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="p-5 md:p-8">
              {mode === 'text' ? (
                <>
                  <label htmlFor="review-text" className="text-[0.9375rem] font-medium text-text-primary">
                    Your landing page copy
                  </label>
                  <textarea
                    id="review-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your headline, subheadline and the main sections of the page, or a short pitch."
                    rows={11}
                    maxLength={6000}
                    className="mt-3 w-full resize-y rounded-2xl border border-border bg-background p-4 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                  />
                  <p className="mt-2 text-right text-xs tabular-nums text-text-muted">
                    {text.length.toLocaleString()} / 6,000
                  </p>
                </>
              ) : (
                <>
                  <label htmlFor="review-url" className="text-[0.9375rem] font-medium text-text-primary">
                    Page link
                  </label>
                  <input
                    id="review-url"
                    ref={urlRef}
                    type="text"
                    inputMode="url"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onPaste={onUrlPaste}
                    placeholder="https://www.yourproduct.com"
                    className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    Type the rest of your address, such as <span className="text-text-primary">yourproduct.com</span>{' '}
                    or <span className="text-text-primary">yourproduct.in</span>. You can edit the start
                    if your site uses http or doesn&apos;t use www.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    Some sites block automatic reading. If yours does, switch to Paste copy.
                    A link that can&apos;t be read doesn&apos;t use up a review.
                  </p>
                </>
              )}

              {error && (
                <div className="mt-5 flex gap-3 rounded-2xl bg-accent-light p-4 text-[0.9375rem] text-text-primary" role="alert">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p>{error.message}</p>
                    {error.limited && (
                      <Link href="/contact" className="text-link mt-2 inline-block">
                        Get in touch
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!ready}
                className="btn-primary mt-6 w-full !py-3 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:!px-7"
              >
                <ScanIcon />
                Review my page
              </button>
            </div>

            <aside className="border-t border-border bg-background/60 p-5 md:border-l md:border-t-0 md:p-8">
              <p className="text-sm font-medium text-text-primary">What you&apos;ll get</p>
              <ul className="mt-5 space-y-5">
                {INCLUDES.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-light text-accent">
                      <Icon size={17} aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">{title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </form>
        )}

        {/* Progress */}
        {loading && (
          <div className="grid place-items-center px-6 py-16 md:py-24">
            <span className="review-spinner h-16 w-16 rounded-full" aria-hidden />
            <ol className="mt-10 w-full max-w-sm space-y-3">
              {STAGES.map((label, i) => (
                <li
                  key={label}
                  className={`flex items-center gap-3 text-[0.9375rem] transition-colors ${
                    i < stage ? 'text-text-muted' : i === stage ? 'font-medium text-text-primary' : 'text-text-muted/50'
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                      i < stage ? 'bg-[#11ab8c] text-white' : i === stage ? 'bg-accent-light text-accent' : 'bg-surface'
                    }`}
                  >
                    {i < stage ? <Check size={13} aria-hidden /> : i === stage ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> : null}
                  </span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Results */}
        {review && (
          <div className="grid md:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="border-b border-border bg-background/60 p-5 md:border-b-0 md:border-r md:p-6">
              <div className="md:sticky md:top-24">
                <div className="flex items-center gap-4 md:flex-col md:items-start">
                  <ScoreRing score={review.score} size={120} />
                  <p className="text-[0.9375rem] font-medium leading-snug text-text-primary">{review.verdict}</p>
                </div>
                <nav aria-label="Review sections" className="mt-6 hidden md:block">
                  <ul className="space-y-0.5 text-sm">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-6 grid gap-2">
                  <button onClick={() => copy('prompt')} className="btn-primary w-full !py-2 text-sm">
                    {copied === 'prompt' ? <Check size={15} aria-hidden /> : <Sparkles size={15} aria-hidden />}
                    {copied === 'prompt' ? 'Prompt copied' : 'Copy as AI prompt'}
                  </button>
                  <button onClick={downloadPlan} className="btn-default w-full !py-2 text-sm">
                    <Download size={15} aria-hidden />
                    Download plan.md
                  </button>
                  <button onClick={() => copy('review')} className="btn-default w-full !py-2 text-sm">
                    {copied === 'review' ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                    {copied === 'review' ? 'Review copied' : 'Copy the review'}
                  </button>
                </div>
              </div>
            </aside>

            <div className="min-w-0 space-y-12 p-5 md:p-10">
              <section id="overview" className="scroll-mt-24">
                <SectionTitle icon={FileText}>Overview</SectionTitle>
                <p className="mt-4 text-lg leading-relaxed text-text-primary">{review.summary}</p>
                <p className="mt-3 leading-relaxed text-text-muted">
                  <span className="font-medium text-text-primary">Who it seems to be for: </span>
                  {review.audience}
                </p>
              </section>

              <section id="scores" className="scroll-mt-24">
                <SectionTitle icon={Gauge}>Scores</SectionTitle>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                  {review.breakdown.map((b) => (
                    <li key={b.area} className="rounded-2xl border border-border p-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-medium text-text-primary">{b.area}</span>
                        <span className="text-sm font-semibold tabular-nums text-text-primary">{b.score}/10</span>
                      </div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full" style={{ width: `${b.score * 10}%`, backgroundImage: 'var(--grad-button)' }} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted">{b.note}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="issues" className="scroll-mt-24">
                <SectionTitle icon={AlertCircle}>Issues to fix</SectionTitle>
                <ol className="mt-5 space-y-4">
                  {review.problems.map((p, i) => (
                    <li key={i} className="rounded-2xl border border-border p-5">
                      <div className="flex items-start gap-3">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-light text-sm font-semibold tabular-nums text-accent">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-text-primary">{p.title}</h3>
                          {p.quote && (
                            <blockquote className="mt-3 rounded-xl bg-surface px-4 py-2.5 text-[0.9375rem] italic text-text-muted">
                              &ldquo;{p.quote}&rdquo;
                            </blockquote>
                          )}
                          <p className="mt-3 leading-relaxed text-text-muted">{p.why}</p>
                          <p className="mt-3 leading-relaxed text-text-primary">
                            <span className="font-semibold">Fix: </span>
                            {p.fix}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="working" className="scroll-mt-24">
                <SectionTitle icon={ThumbsUp}>What&apos;s working</SectionTitle>
                <ul className="mt-4 space-y-2.5">
                  {review.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed text-text-muted">
                      <Check size={18} className="mt-0.5 shrink-0 text-[#0e8f80]" aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="copy" className="scroll-mt-24">
                <SectionTitle icon={PenLine}>Suggested copy</SectionTitle>
                <div className="theme-dark mt-5 rounded-2xl p-6 md:p-8">
                  <p className="text-2xl font-semibold leading-snug text-text-primary">{review.rewrite.headline}</p>
                  <p className="mt-3 leading-relaxed text-text-muted">{review.rewrite.subheadline}</p>
                  <span className="btn-primary pointer-events-none mt-6">{review.rewrite.cta}</span>
                </div>
              </section>

              <section id="steps" className="scroll-mt-24">
                <SectionTitle icon={ListChecks}>Next steps, in order</SectionTitle>
                <ol className="mt-4 space-y-3">
                  {review.nextSteps.map((s, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed text-text-muted">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface text-xs font-semibold tabular-nums text-text-primary">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        )}
      </div>

      <section className="mt-16 grid gap-8 px-2 md:grid-cols-[1fr_auto] md:items-center md:px-0">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-text-primary">Want help making the changes?</h2>
          <p className="mt-2 text-lg leading-relaxed text-text-muted">
            I design and build software for founders and small businesses, including the
            pages that sell it.{' '}
            <Link href="/start" className="text-link">
              See how a project runs
            </Link>
            .
          </p>
        </div>
        <Link href="/contact" className="btn-primary !px-6 !py-3">
          Get in touch
        </Link>
      </section>
    </div>
  )
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Gauge; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-semibold text-text-primary">
      <Icon size={19} className="text-accent" aria-hidden />
      {children}
    </h2>
  )
}

function ScanIcon() {
  return <Sparkles size={16} aria-hidden />
}
