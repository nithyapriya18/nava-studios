'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Link2, Check, MessageCircle } from 'lucide-react'
import { Field, inputClass } from '@/apps/getpaid/components/InvoiceForm'
import { useLocalState, encodeShare, decodeShare } from '@/apps/getpaid/lib/storage'
import { buildWhatsAppLink } from '@/apps/getpaid/lib/links'
import { formatINR } from '@/apps/getpaid/lib/types'

export interface QuoteConfig {
  businessName: string
  service: string
  whatsapp: string
  baseLabel: string
  basePrice: number
  perUnitLabel: string // e.g. "per room", "per hour" — quantity input
  perUnitPrice: number
  extras: { label: string; price: number }[]
}

const DEFAULT_CONFIG: QuoteConfig = {
  businessName: '',
  service: 'Deep cleaning',
  whatsapp: '',
  baseLabel: 'Visit charge',
  basePrice: 500,
  perUnitLabel: 'per room',
  perUnitPrice: 800,
  extras: [{ label: 'Balcony', price: 300 }],
}

/** Customer-facing calculator; also used as live preview in the builder. */
export function QuoteWidget({ config }: { config: QuoteConfig }) {
  const [qty, setQty] = useState(1)
  const [chosen, setChosen] = useState<number[]>([])

  const total = useMemo(
    () =>
      config.basePrice +
      qty * config.perUnitPrice +
      chosen.reduce((s, i) => s + (config.extras[i]?.price ?? 0), 0),
    [config, qty, chosen],
  )

  const requestQuote = () => {
    const lines = [
      `Hi${config.businessName ? ` ${config.businessName}` : ''}! I used your instant quote calculator for "${config.service}".`,
      ``,
      `${config.baseLabel}: ${formatINR(config.basePrice)}`,
      `${qty} × ${config.perUnitLabel}: ${formatINR(qty * config.perUnitPrice)}`,
      ...chosen.map((i) => `+ ${config.extras[i].label}: ${formatINR(config.extras[i].price)}`),
      ``,
      `Estimated total: ${formatINR(total)}`,
      ``,
      `I'd like to book — when are you available?`,
    ]
    window.open(buildWhatsAppLink(config.whatsapp, lines.join('\n')), '_blank')
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <p className="font-display text-lg font-semibold text-text-primary">
        {config.service || 'Your service'}
      </p>
      {config.businessName && (
        <p className="text-xs text-text-muted">{config.businessName}</p>
      )}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">{config.baseLabel}</span>
          <span>{formatINR(config.basePrice)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-text-muted">
            How many ({config.perUnitLabel.replace(/^per\s+/i, '')}s)?
          </span>
          <input
            type="number" min={0} value={qty}
            onChange={(e) => setQty(Math.max(0, Number(e.target.value)))}
            className="w-20 rounded border border-border px-2 py-1 text-right text-sm focus:border-accent focus:outline-none"
          />
        </div>
        {config.extras.filter((x) => x.label).map((x, i) => (
          <label key={i} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-text-muted">
              <input
                type="checkbox"
                checked={chosen.includes(i)}
                onChange={(e) =>
                  setChosen((prev) => (e.target.checked ? [...prev, i] : prev.filter((c) => c !== i)))
                }
              />
              {x.label}
            </span>
            <span>{formatINR(x.price)}</span>
          </label>
        ))}
        <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-text-primary">
          <span>Estimated total</span>
          <span>{formatINR(total)}</span>
        </div>
        <button
          onClick={requestQuote}
          className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90"
        >
          Book at this price — WhatsApp us
        </button>
      </div>
    </div>
  )
}

export function QuoteCardApp() {
  const [config, setConfig] = useLocalState<QuoteConfig>('tools:quote:config', DEFAULT_CONFIG)
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = `${window.location.origin}/tools/quote-card/q#${encodeShare(config)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy your quote calculator link:', url)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Business name">
            <input className={inputClass} value={config.businessName}
              onChange={(e) => setConfig({ ...config, businessName: e.target.value })} />
          </Field>
          <Field label="Service">
            <input className={inputClass} value={config.service}
              onChange={(e) => setConfig({ ...config, service: e.target.value })} />
          </Field>
          <Field label="Your WhatsApp (quote requests arrive here)">
            <input className={inputClass} value={config.whatsapp} placeholder="98765 43210"
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Base charge label">
            <input className={inputClass} value={config.baseLabel}
              onChange={(e) => setConfig({ ...config, baseLabel: e.target.value })} />
          </Field>
          <Field label="Base charge (₹)">
            <input type="number" min={0} className={inputClass} value={config.basePrice}
              onChange={(e) => setConfig({ ...config, basePrice: Number(e.target.value) })} />
          </Field>
          <Field label='Per-unit label (e.g. "per room")'>
            <input className={inputClass} value={config.perUnitLabel}
              onChange={(e) => setConfig({ ...config, perUnitLabel: e.target.value })} />
          </Field>
          <Field label="Per-unit price (₹)">
            <input type="number" min={0} className={inputClass} value={config.perUnitPrice}
              onChange={(e) => setConfig({ ...config, perUnitPrice: Number(e.target.value) })} />
          </Field>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text-primary">Optional extras</legend>
          {config.extras.map((x, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Field label={i === 0 ? 'Extra' : ''}>
                  <input className={inputClass} value={x.label}
                    onChange={(e) => setConfig({
                      ...config,
                      extras: config.extras.map((e2, j) => j === i ? { ...e2, label: e.target.value } : e2),
                    })} />
                </Field>
              </div>
              <Field label={i === 0 ? '₹' : ''}>
                <input type="number" min={0} className={inputClass} value={x.price}
                  onChange={(e) => setConfig({
                    ...config,
                    extras: config.extras.map((e2, j) => j === i ? { ...e2, price: Number(e.target.value) } : e2),
                  })} />
              </Field>
              <button onClick={() => setConfig({ ...config, extras: config.extras.filter((_, j) => j !== i) })}
                className="mb-0.5 rounded-lg border border-border p-2 text-text-muted hover:border-red-300 hover:text-red-600"
                aria-label="Remove extra">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={() => setConfig({ ...config, extras: [...config.extras, { label: '', price: 0 }] })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent">
            <Plus size={13} /> Add extra
          </button>
        </fieldset>

        <button onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md">
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? 'Copied!' : 'Copy your calculator link'}
        </button>
        <p className="text-xs text-text-muted">
          Put this link on your website, Instagram bio, or Google Business profile.
          Visitors quote themselves; booking requests land in your WhatsApp.
        </p>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
          Live preview — what your customers see
        </p>
        <QuoteWidget config={config} />
      </div>
    </div>
  )
}

/** Public calculator page: config travels in the URL hash. */
export function QuoteViewApp() {
  const [config, setConfig] = useState<QuoteConfig | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setConfig(decodeShare<QuoteConfig>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!config)
    return (
      <p className="py-20 text-center text-sm text-text-muted">
        This quote link is invalid — ask the business to share it again.
      </p>
    )
  return (
    <div className="mx-auto max-w-md">
      <QuoteWidget config={config} />
      <p className="mt-4 text-center text-xs text-text-muted">
        <MessageCircle size={11} className="mr-1 inline" />
        Instant quotes by Quote Card — Verity Studio
      </p>
    </div>
  )
}
