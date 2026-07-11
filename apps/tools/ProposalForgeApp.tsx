'use client'

import { useEffect, useState } from 'react'
import { Link2, Check, Copy, MessageCircle } from 'lucide-react'
import { Field, inputClass } from '@/apps/getpaid/components/InvoiceForm'
import { useLocalState, encodeShare, decodeShare } from '@/apps/getpaid/lib/storage'
import { buildWhatsAppLink } from '@/apps/getpaid/lib/links'
import { todayISO, addDaysISO, formatINR } from '@/apps/getpaid/lib/types'

export interface Proposal {
  yourName: string
  whatsapp: string
  clientName: string
  project: string
  problem: string
  deliverables: string // one per line
  timeline: string
  price: number
  validUntil: string
}

const EMPTY: Proposal = {
  yourName: '', whatsapp: '', clientName: '', project: '', problem: '',
  deliverables: '', timeline: '', price: 0, validUntil: addDaysISO(todayISO(), 14),
}

export function ProposalDoc({ p }: { p: Proposal }) {
  const deliverables = p.deliverables.split('\n').map((d) => d.trim()).filter(Boolean)
  return (
    <div className="rounded-2xl border border-border bg-white p-8 text-[#1A1A18] shadow-sm print:rounded-none print:border-0 print:shadow-none">
      <p className="text-xs uppercase tracking-widest text-stone-400">Proposal</p>
      <h2 className="mt-1 font-display text-2xl font-semibold">{p.project || 'Project'}</h2>
      <p className="mt-1 text-sm text-stone-500">
        Prepared for {p.clientName || 'you'} by {p.yourName || 'me'} · {todayISO()}
      </p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed">
        <section>
          <h3 className="mb-1 font-semibold">The problem</h3>
          <p className="text-stone-600">{p.problem || '—'}</p>
        </section>
        <section>
          <h3 className="mb-1 font-semibold">What you&apos;ll get</h3>
          <ul className="list-disc space-y-1 pl-5 text-stone-600">
            {deliverables.length ? deliverables.map((d, i) => <li key={i}>{d}</li>) : <li>—</li>}
          </ul>
        </section>
        <section>
          <h3 className="mb-1 font-semibold">Timeline</h3>
          <p className="text-stone-600">{p.timeline || '—'}</p>
        </section>
        <section className="rounded-xl bg-stone-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Investment</h3>
            <p className="font-display text-xl font-semibold">{formatINR(p.price)}</p>
          </div>
          <p className="mt-1 text-xs text-stone-500">Valid until {p.validUntil}</p>
        </section>
      </div>
    </div>
  )
}

export function ProposalForgeApp() {
  const [p, setP] = useLocalState<Proposal>('tools:proposal:draft', EMPTY)
  const [copied, setCopied] = useState<'link' | null>(null)

  const shareUrl = () =>
    `${window.location.origin}/tools/proposal-forge/view#${encodeShare(p)}`

  const set = (patch: Partial<Proposal>) => setP({ ...p, ...patch })

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 print:hidden">
        <p className="text-sm text-text-muted">
          Six answers. The proposal writes itself on the right.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="1. Your name / business">
            <input className={inputClass} value={p.yourName} onChange={(e) => set({ yourName: e.target.value })} />
          </Field>
          <Field label="Your WhatsApp (for the accept button)">
            <input className={inputClass} value={p.whatsapp} placeholder="98765 43210" onChange={(e) => set({ whatsapp: e.target.value })} />
          </Field>
          <Field label="2. Client name">
            <input className={inputClass} value={p.clientName} onChange={(e) => set({ clientName: e.target.value })} />
          </Field>
          <Field label="3. Project (one line)">
            <input className={inputClass} value={p.project} placeholder="New website for Sharma Interiors" onChange={(e) => set({ project: e.target.value })} />
          </Field>
        </div>
        <Field label="4. The problem you're solving (2–3 sentences, their words)">
          <textarea rows={3} className={inputClass} value={p.problem} onChange={(e) => set({ problem: e.target.value })} />
        </Field>
        <Field label="5. Deliverables (one per line)">
          <textarea rows={4} className={inputClass} value={p.deliverables}
            placeholder={'5-page responsive website\nContact form + WhatsApp button\nBasic SEO setup'}
            onChange={(e) => set({ deliverables: e.target.value })} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="6. Timeline">
            <input className={inputClass} value={p.timeline} placeholder="3 weeks from kick-off" onChange={(e) => set({ timeline: e.target.value })} />
          </Field>
          <Field label="Price (₹)">
            <input type="number" min={0} className={inputClass} value={p.price || ''} onChange={(e) => set({ price: Number(e.target.value) })} />
          </Field>
          <Field label="Valid until">
            <input type="date" className={inputClass} value={p.validUntil} onChange={(e) => set({ validUntil: e.target.value })} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareUrl())
                setCopied('link')
                setTimeout(() => setCopied(null), 2000)
              } catch {
                window.prompt('Copy your proposal link:', shareUrl())
              }
            }}
            disabled={!p.project || !p.price}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
            {copied === 'link' ? <Check size={14} /> : <Link2 size={14} />}
            {copied === 'link' ? 'Copied!' : 'Copy proposal link'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:border-accent hover:text-accent">
            <Copy size={14} /> Print / PDF
          </button>
        </div>
        <p className="text-xs text-text-muted">
          The link contains the proposal itself — the client sees a clean page with
          an accept button that messages you on WhatsApp.
        </p>
      </div>

      <div className="print-area">
        <ProposalDoc p={p} />
      </div>
    </div>
  )
}

/** Client-facing proposal view — travels in the URL hash. */
export function ProposalViewApp() {
  const [p, setP] = useState<Proposal | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setP(decodeShare<Proposal>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!p)
    return (
      <p className="py-20 text-center text-sm text-text-muted">
        This proposal link is invalid — ask the sender to share it again.
      </p>
    )

  const accept = () => {
    const msg = `Hi ${p.yourName}, I'm accepting your proposal for "${p.project}" (${formatINR(p.price)}). Let's get started!`
    window.open(buildWhatsAppLink(p.whatsapp, msg), '_blank')
  }

  return (
    <div className="mx-auto max-w-content space-y-5">
      <ProposalDoc p={p} />
      {p.whatsapp && (
        <button onClick={accept}
          className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90">
          Accept this proposal — message {p.yourName} on WhatsApp
        </button>
      )}
      <p className="text-center text-xs text-text-muted">
        Made with Proposal Forge — Verity Studio
      </p>
    </div>
  )
}
