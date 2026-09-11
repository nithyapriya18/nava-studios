'use client'

import { useEffect, useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState, encodeShare, decodeShare } from '@nava-studios/kit'
import { buildUpiLink, buildWhatsAppLink } from '@nava-studios/kit'
import { formatINR } from '@nava-studios/kit'

interface Gate {
  offerName: string
  description: string
  ownerName: string
  whatsapp: string
  upiId: string
  price: number
}

export function MemberGateApp() {
  const [gate, setGate] = useLocalState<Gate>('tools:gate:draft', {
    offerName: '', description: '', ownerName: '', whatsapp: '', upiId: '', price: 0,
  })
  const [copied, setCopied] = useState(false)
  const set = (patch: Partial<Gate>) => setGate({ ...gate, ...patch })

  const gateUrl = () =>
    `${window.location.origin}/join#${encodeShare(gate)}`

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="What are you selling access to?">
          <input className={inputClass} value={gate.offerName}
            placeholder="Private trading community / premium newsletter"
            onChange={(e) => set({ offerName: e.target.value })} />
        </Field>
        <Field label="Your name">
          <input className={inputClass} value={gate.ownerName}
            onChange={(e) => set({ ownerName: e.target.value })} />
        </Field>
        <Field label="Price (₹)">
          <input type="number" min={0} className={inputClass} value={gate.price || ''}
            onChange={(e) => set({ price: Number(e.target.value) })} />
        </Field>
        <Field label="Your UPI ID">
          <input className={inputClass} value={gate.upiId} placeholder="name@okbank"
            onChange={(e) => set({ upiId: e.target.value })} />
        </Field>
        <Field label="Your WhatsApp (buyers confirm here)">
          <input className={inputClass} value={gate.whatsapp} placeholder="98765 43210"
            onChange={(e) => set({ whatsapp: e.target.value })} />
        </Field>
      </div>
      <Field label="What do members get? (a few lines)">
        <textarea rows={3} className={inputClass} value={gate.description}
          onChange={(e) => set({ description: e.target.value })} />
      </Field>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-medium text-text-primary">How it works</p>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">
          Share the join link anywhere. Visitors see your offer, pay by UPI, and tap
          &ldquo;I&apos;ve paid&rdquo; — which opens WhatsApp to you. You reply with the private
          link (group invite, Drive folder, newsletter signup). You approve every member
          personally; nobody gets in without paying you first.
        </p>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(gateUrl())
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            } catch {
              window.prompt('Copy your join link:', gateUrl())
            }
          }}
          disabled={!gate.offerName || !gate.price || !gate.upiId}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? 'Copied!' : 'Copy join link'}
        </button>
      </div>
    </div>
  )
}

export function MemberJoinApp() {
  const [gate, setGate] = useState<Gate | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setGate(decodeShare<Gate>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!gate) return <p className="py-20 text-center text-sm text-text-muted">Invalid link.</p>

  const paid = () => {
    const msg = `Hi ${gate.ownerName}! I've paid ${formatINR(gate.price)} by UPI for "${gate.offerName}". Please send my access link!`
    window.open(buildWhatsAppLink(gate.whatsapp, msg), '_blank')
  }

  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-text-primary">{gate.offerName}</h1>
      <p className="whitespace-pre-line text-sm text-text-muted">{gate.description}</p>
      <p className="font-display text-3xl font-semibold text-text-primary">{formatINR(gate.price)}</p>
      {gate.upiId && (
        <a href={buildUpiLink({ upiId: gate.upiId, payeeName: gate.ownerName, amount: gate.price, note: gate.offerName })}
          className="block w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90">
          Pay by UPI
        </a>
      )}
      <button onClick={paid}
        className="w-full rounded-full border border-accent px-5 py-3 text-sm font-medium text-accent hover:bg-accent-light">
        I&apos;ve paid — get access
      </button>
      <p className="text-xs text-text-muted">
        Access is confirmed personally by {gate.ownerName || 'the owner'} on WhatsApp.
        <br />Member Gate — Nava Studios
      </p>
    </div>
  )
}
