'use client'

import { useState } from 'react'
import { Printer, Link2, Check } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState, encodeShare, decodeShare } from '@nava-studios/kit'
import { useEffect } from 'react'

export interface Report {
  agencyName: string
  clientName: string
  period: string
  summary: string
  metrics: { label: string; value: string; change: string }[]
  wins: string
  nextMonth: string
}

const DEFAULT_METRICS = [
  { label: 'Website visitors', value: '', change: '' },
  { label: 'Leads / enquiries', value: '', change: '' },
  { label: 'Ad spend', value: '', change: '' },
  { label: 'Cost per lead', value: '', change: '' },
]

export function ReportDoc({ r }: { r: Report }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-8 text-[#1A1A18] shadow-sm print:rounded-none print:border-0 print:shadow-none">
      <p className="text-xs uppercase tracking-widest text-stone-400">Monthly report — {r.period}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold">{r.clientName || 'Client'}</h2>
      <p className="text-sm text-stone-500">Prepared by {r.agencyName || 'your agency'}</p>

      {r.summary && (
        <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-700">
          {r.summary}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        {r.metrics.filter((m) => m.value).map((m, i) => (
          <div key={i} className="rounded-xl border border-stone-200 p-4">
            <p className="text-xs text-stone-500">{m.label}</p>
            <p className="mt-0.5 font-display text-xl font-semibold">{m.value}</p>
            {m.change && (
              <p className={`text-xs ${m.change.trim().startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                {m.change} vs last month
              </p>
            )}
          </div>
        ))}
      </div>

      {r.wins && (
        <section className="mt-6">
          <h3 className="mb-1 text-sm font-semibold">What went well</h3>
          <p className="whitespace-pre-line text-sm text-stone-600">{r.wins}</p>
        </section>
      )}
      {r.nextMonth && (
        <section className="mt-4">
          <h3 className="mb-1 text-sm font-semibold">Focus for next month</h3>
          <p className="whitespace-pre-line text-sm text-stone-600">{r.nextMonth}</p>
        </section>
      )}
    </div>
  )
}

export function ReportSnapApp() {
  const [r, setR] = useLocalState<Report>('tools:report:draft', {
    agencyName: '', clientName: '',
    period: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
    summary: '', metrics: DEFAULT_METRICS, wins: '', nextMonth: '',
  })
  const [copied, setCopied] = useState(false)
  const set = (patch: Partial<Report>) => setR({ ...r, ...patch })

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 print:hidden">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Your agency">
            <input className={inputClass} value={r.agencyName} onChange={(e) => set({ agencyName: e.target.value })} />
          </Field>
          <Field label="Client">
            <input className={inputClass} value={r.clientName} onChange={(e) => set({ clientName: e.target.value })} />
          </Field>
          <Field label="Period">
            <input className={inputClass} value={r.period} onChange={(e) => set({ period: e.target.value })} />
          </Field>
        </div>
        <Field label="Plain-language summary (the 3 sentences the client actually reads)">
          <textarea rows={3} className={inputClass} value={r.summary} onChange={(e) => set({ summary: e.target.value })} />
        </Field>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text-primary">Metrics (from GA4/Ads — auto-pull comes with accounts)</legend>
          {r.metrics.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_90px] gap-2">
              <input className={inputClass} value={m.label}
                onChange={(e) => set({ metrics: r.metrics.map((x, j) => j === i ? { ...x, label: e.target.value } : x) })} />
              <input className={inputClass} value={m.value} placeholder="12,480"
                onChange={(e) => set({ metrics: r.metrics.map((x, j) => j === i ? { ...x, value: e.target.value } : x) })} />
              <input className={inputClass} value={m.change} placeholder="+18%"
                onChange={(e) => set({ metrics: r.metrics.map((x, j) => j === i ? { ...x, change: e.target.value } : x) })} />
            </div>
          ))}
        </fieldset>
        <Field label="What went well">
          <textarea rows={2} className={inputClass} value={r.wins} onChange={(e) => set({ wins: e.target.value })} />
        </Field>
        <Field label="Focus for next month">
          <textarea rows={2} className={inputClass} value={r.nextMonth} onChange={(e) => set({ nextMonth: e.target.value })} />
        </Field>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
            <Printer size={14} /> Print / PDF
          </button>
          <button
            onClick={async () => {
              const url = `${window.location.origin}/view#${encodeShare(r)}`
              try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              } catch {
                window.prompt('Copy report link:', url)
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:border-accent hover:text-accent">
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? 'Copied!' : 'Copy client link'}
          </button>
        </div>
      </div>
      <div className="print-area">
        <ReportDoc r={r} />
      </div>
    </div>
  )
}

export function ReportViewApp() {
  const [r, setR] = useState<Report | null>(null)
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setR(decodeShare<Report>(hash))
    setChecked(true)
  }, [])
  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!r) return <p className="py-20 text-center text-sm text-text-muted">Invalid report link.</p>
  return (
    <div className="mx-auto max-w-content space-y-4">
      <div className="print-area"><ReportDoc r={r} /></div>
      <p className="text-center text-xs text-text-muted print:hidden">Report Snap — Nava Studios</p>
    </div>
  )
}
