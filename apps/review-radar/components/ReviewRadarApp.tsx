'use client'

import { useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { inputClass } from '@nava-studios/kit'

const POSITIVE = ['love', 'loved', 'great', 'excellent', 'amazing', 'perfect', 'best', 'awesome', 'fantastic', 'wonderful', 'fast', 'friendly', 'helpful', 'recommend', 'beautiful', 'quality', 'happy', 'easy', 'smooth', 'delicious', 'clean', 'polite', 'quick', 'good']
const NEGATIVE = ['bad', 'worst', 'terrible', 'awful', 'horrible', 'slow', 'late', 'broken', 'rude', 'poor', 'disappointed', 'disappointing', 'refund', 'waste', 'never', 'cheap', 'damaged', 'wrong', 'missing', 'dirty', 'overpriced', 'expensive', 'cancel', 'scam', 'delay', 'delayed', 'leaking', 'defective']

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'was', 'were', 'are', 'i', 'we', 'they', 'it', 'to', 'of', 'in', 'on', 'for', 'with', 'this', 'that', 'my', 'our', 'their', 'at', 'so', 'very', 'not', 'no', 'had', 'have', 'has', 'be', 'been', 'as', 'you', 'your', 'me', 'from', 'by', 'am', 'him', 'her', 'them', 'us', 'if', 'get', 'got', 'just', 'too', 'than', 'then', 'there', 'here', 'what', 'when', 'all', 'would', 'will', 'can', 'could', 'did', 'do', 'does', 'also', 'because'])

interface Review {
  text: string
  score: number
}

function scoreReview(text: string): number {
  const words = text.toLowerCase().match(/[a-z']+/g) ?? []
  let s = 0
  for (const w of words) {
    if (POSITIVE.includes(w)) s += 1
    if (NEGATIVE.includes(w)) s -= 1
  }
  return s
}

function topKeywords(reviews: Review[], negative: boolean, n = 6): [string, number][] {
  const counts = new Map<string, number>()
  for (const r of reviews) {
    if (negative ? r.score >= 0 : r.score <= 0) continue
    for (const w of r.text.toLowerCase().match(/[a-z']{4,}/g) ?? []) {
      if (STOP.has(w) || POSITIVE.includes(w) || NEGATIVE.includes(w)) continue
      counts.set(w, (counts.get(w) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)
}

export function ReviewRadarApp() {
  const [raw, setRaw] = useState('')
  const [copied, setCopied] = useState(false)

  const analysis = useMemo(() => {
    const reviews: Review[] = raw
      .split(/\n\s*\n|\n(?=["“])/)
      .map((t) => t.trim())
      .filter((t) => t.length > 10)
      .map((text) => ({ text, score: scoreReview(text) }))
    if (reviews.length === 0) return null
    const pos = reviews.filter((r) => r.score > 0)
    const neg = reviews.filter((r) => r.score < 0)
    return {
      reviews, pos, neg,
      posPct: Math.round((pos.length / reviews.length) * 100),
      complaints: topKeywords(reviews, true),
      praises: topKeywords(reviews, false),
      worst: [...neg].sort((a, b) => a.score - b.score).slice(0, 3),
    }
  }, [raw])

  const digest = () =>
    analysis
      ? [
          `Review digest — ${analysis.reviews.length} reviews`,
          `Sentiment: ${analysis.posPct}% positive (${analysis.pos.length} positive / ${analysis.neg.length} negative)`,
          ``,
          `Top complaint themes: ${analysis.complaints.map(([w, c]) => `${w} (${c})`).join(', ') || '—'}`,
          `Top praise themes: ${analysis.praises.map(([w, c]) => `${w} (${c})`).join(', ') || '—'}`,
          ``,
          `Harshest reviews to read in full:`,
          ...analysis.worst.map((r) => `• "${r.text.slice(0, 140)}${r.text.length > 140 ? '…' : ''}"`),
        ].join('\n')
      : ''

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">
        Paste your reviews below — one per paragraph (copy straight from
        Amazon/Etsy/Google, blank line between reviews). Analysis runs in your
        browser; nothing is uploaded.
      </p>
      <textarea rows={8} className={inputClass} value={raw}
        placeholder={'Love this product, arrived fast and the quality is great!\n\nPackaging was damaged and delivery was 5 days late. Very disappointed.'}
        onChange={(e) => setRaw(e.target.value)} />

      {analysis && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-text-muted">Reviews</p>
              <p className="mt-1 font-display text-2xl font-semibold text-text-primary">{analysis.reviews.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-text-muted">Positive</p>
              <p className={`mt-1 font-display text-2xl font-semibold ${analysis.posPct >= 70 ? 'text-emerald-700' : analysis.posPct >= 40 ? 'text-amber-700' : 'text-red-600'}`}>
                {analysis.posPct}%
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-text-muted">Negative</p>
              <p className="mt-1 font-display text-2xl font-semibold text-text-primary">{analysis.neg.length}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-900">What complaints mention most</p>
              <ul className="mt-2 space-y-1 text-sm text-red-900">
                {analysis.complaints.length ? analysis.complaints.map(([w, c]) => (
                  <li key={w}>{w} <span className="opacity-60">× {c}</span></li>
                )) : <li>No negative reviews found 🎉</li>}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-900">What praise mentions most</p>
              <ul className="mt-2 space-y-1 text-sm text-emerald-900">
                {analysis.praises.length ? analysis.praises.map(([w, c]) => (
                  <li key={w}>{w} <span className="opacity-60">× {c}</span></li>
                )) : <li>—</li>}
              </ul>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(digest())
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              } catch {
                window.prompt('Copy digest:', digest())
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy the weekly digest'}
          </button>
        </>
      )}
    </div>
  )
}
