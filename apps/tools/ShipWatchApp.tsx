'use client'

import { useState } from 'react'
import { Plus, Trash2, ExternalLink, Check } from 'lucide-react'
import { Field, inputClass } from '@/apps/getpaid/components/InvoiceForm'
import { useLocalState } from '@/apps/getpaid/lib/storage'
import { todayISO } from '@/apps/getpaid/lib/types'

interface Shipment {
  id: string
  tracking: string
  carrier: string
  label: string
  expectedBy: string
  delivered: boolean
}

/** Carrier → public tracking URL. Auto-detected from number shape where possible. */
const CARRIERS: Record<string, (t: string) => string> = {
  'India Post': (t) => `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx#${t}`,
  Delhivery: (t) => `https://www.delhivery.com/track/package/${t}`,
  BlueDart: (t) => `https://www.bluedart.com/tracking?trackingNo=${t}`,
  DTDC: (t) => `https://www.dtdc.in/track.asp#${t}`,
  Ekart: (t) => `https://ekartlogistics.com/track/${t}`,
  XpressBees: (t) => `https://www.xpressbees.com/track?trackid=${t}`,
  USPS: (t) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${t}`,
  UPS: (t) => `https://www.ups.com/track?tracknum=${t}`,
  FedEx: (t) => `https://www.fedex.com/fedextrack/?trknbr=${t}`,
  DHL: (t) => `https://www.dhl.com/in-en/home/tracking.html?tracking-id=${t}`,
}

function guessCarrier(t: string): string {
  const s = t.trim().toUpperCase()
  if (/^1Z/.test(s)) return 'UPS'
  if (/^[A-Z]{2}\d{9}IN$/.test(s)) return 'India Post'
  if (/^\d{12,14}$/.test(s)) return 'FedEx'
  if (/^(94|93|92|95)\d{18,}$/.test(s)) return 'USPS'
  return 'Delhivery'
}

export function ShipWatchApp() {
  const [items, setItems] = useLocalState<Shipment[]>('tools:ship:items', [])
  const [draft, setDraft] = useState({ tracking: '', carrier: '', label: '', expectedBy: '' })
  const today = todayISO()

  const late = items.filter((s) => !s.delivered && s.expectedBy && s.expectedBy < today)

  return (
    <div className="space-y-8">
      {late.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-900">
            {late.length} shipment{late.length === 1 ? '' : 's'} past the expected date —
            check before your customer messages you
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface p-4">
        <div className="min-w-44 flex-1">
          <Field label="Tracking number">
            <input className={inputClass} value={draft.tracking}
              onChange={(e) => setDraft({ ...draft, tracking: e.target.value, carrier: draft.carrier || guessCarrier(e.target.value) })} />
          </Field>
        </div>
        <Field label="Carrier">
          <select className={inputClass} value={draft.carrier || guessCarrier(draft.tracking)}
            onChange={(e) => setDraft({ ...draft, carrier: e.target.value })}>
            {Object.keys(CARRIERS).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <div className="min-w-32 flex-1">
          <Field label="Order / customer">
            <input className={inputClass} value={draft.label} placeholder="#1043 — Priya"
              onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </Field>
        </div>
        <Field label="Expected by">
          <input type="date" className={inputClass} value={draft.expectedBy}
            onChange={(e) => setDraft({ ...draft, expectedBy: e.target.value })} />
        </Field>
        <button
          onClick={() => {
            setItems((prev) => [...prev, {
              id: `sh_${Date.now().toString(36)}`,
              tracking: draft.tracking.trim(),
              carrier: draft.carrier || guessCarrier(draft.tracking),
              label: draft.label, expectedBy: draft.expectedBy, delivered: false,
            }])
            setDraft({ tracking: '', carrier: '', label: '', expectedBy: '' })
          }}
          disabled={!draft.tracking.trim()}
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-40">
          <Plus size={12} className="mr-1 inline" /> Track
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {items.map((s) => {
            const isLate = !s.delivered && s.expectedBy && s.expectedBy < today
            const url = CARRIERS[s.carrier]?.(s.tracking) ?? '#'
            return (
              <li key={s.id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 ${s.delivered ? 'opacity-50' : ''}`}>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {s.label || s.tracking}
                    {isLate && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">late</span>}
                    {s.delivered && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">delivered</span>}
                  </p>
                  <p className="text-xs text-text-muted">
                    {s.carrier} · {s.tracking}{s.expectedBy && ` · expected ${s.expectedBy}`}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-light">
                    <ExternalLink size={12} /> Track live
                  </a>
                  {!s.delivered && (
                    <button
                      onClick={() => setItems((prev) => prev.map((x) => x.id === s.id ? { ...x, delivered: true } : x))}
                      title="Mark delivered"
                      className="rounded-full border border-emerald-300 p-1.5 text-emerald-700 hover:bg-emerald-50">
                      <Check size={13} />
                    </button>
                  )}
                  <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== s.id))}
                    className="rounded-full border border-border p-1.5 text-text-muted hover:border-red-300 hover:text-red-600" aria-label="Remove">
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Paste tracking numbers from any carrier. One board, live-track links,
          and a &ldquo;late&rdquo; flag when the expected date passes — instead of ten tabs.
        </p>
      )}
    </div>
  )
}
