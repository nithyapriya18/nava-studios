'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Link2, Check, MessageCircle } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState, encodeShare, decodeShare } from '@nava-studios/kit'
import { buildWhatsAppLink } from '@nava-studios/kit'

export interface ChaseConfig {
  firmName: string
  whatsapp: string
  email: string
  clientName: string
  items: string[]
}

interface ChaseClient {
  id: string
  name: string
  phone: string
  items: string[]
  received: string[]
}

const DEFAULT_ITEMS = ['Bank statement', 'Sales invoices', 'Purchase bills', 'Expense receipts']

export function DocChaserApp() {
  const [firm, setFirm] = useLocalState('tools:chase:firm', { firmName: '', whatsapp: '', email: '' })
  const [clients, setClients] = useLocalState<ChaseClient[]>('tools:chase:clients', [])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', phone: '', items: DEFAULT_ITEMS.join('\n') })

  const clientUrl = (c: ChaseClient) => {
    const config: ChaseConfig = {
      firmName: firm.firmName, whatsapp: firm.whatsapp, email: firm.email,
      clientName: c.name, items: c.items,
    }
    return `${window.location.origin}/send#${encodeShare(config)}`
  }

  const chase = (c: ChaseClient) => {
    const missing = c.items.filter((i) => !c.received.includes(i))
    const msg = [
      `Hi ${c.name}, hope you're well! For this month's books I'm still waiting on:`,
      ``,
      ...missing.map((m) => `• ${m}`),
      ``,
      `You can send them here: ${clientUrl(c)}`,
      ``,
      `Thanks — the sooner these arrive, the sooner your books close!`,
    ].join('\n')
    window.open(buildWhatsAppLink(c.phone, msg), '_blank')
  }

  const toggle = (clientId: string, item: string) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              received: c.received.includes(item)
                ? c.received.filter((r) => r !== item)
                : [...c.received, item],
            }
          : c,
      ),
    )

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">Your firm</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Firm name">
            <input className={inputClass} value={firm.firmName}
              onChange={(e) => setFirm({ ...firm, firmName: e.target.value })} />
          </Field>
          <Field label="Your WhatsApp">
            <input className={inputClass} value={firm.whatsapp} placeholder="98765 43210"
              onChange={(e) => setFirm({ ...firm, whatsapp: e.target.value })} />
          </Field>
          <Field label="Your email (documents arrive here)">
            <input className={inputClass} value={firm.email}
              onChange={(e) => setFirm({ ...firm, email: e.target.value })} />
          </Field>
        </div>
      </div>

      {adding ? (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Client name">
              <input className={inputClass} value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Client WhatsApp">
              <input className={inputClass} value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Monthly checklist (one item per line)">
            <textarea rows={4} className={inputClass} value={draft.items}
              onChange={(e) => setDraft({ ...draft, items: e.target.value })} />
          </Field>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setClients((prev) => [...prev, {
                  id: `dc_${Date.now().toString(36)}`,
                  name: draft.name, phone: draft.phone,
                  items: draft.items.split('\n').map((s) => s.trim()).filter(Boolean),
                  received: [],
                }])
                setDraft({ name: '', phone: '', items: DEFAULT_ITEMS.join('\n') })
                setAdding(false)
              }}
              disabled={!draft.name}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
              Add client
            </button>
            <button onClick={() => setAdding(false)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md">
          <Plus size={14} /> Add a client
        </button>
      )}

      {clients.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {clients.map((c) => {
            const missing = c.items.filter((i) => !c.received.includes(i))
            return (
              <div key={c.id} className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                    <p className="text-xs text-text-muted">
                      {missing.length === 0
                        ? 'All received ✓'
                        : `${missing.length} of ${c.items.length} missing`}
                    </p>
                  </div>
                  <button onClick={() => setClients((prev) => prev.filter((x) => x.id !== c.id))}
                    className="p-1.5 text-text-muted hover:text-red-600" aria-label="Remove client">
                    <Trash2 size={13} />
                  </button>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {c.items.map((item) => (
                    <li key={item}>
                      <label className="flex items-center gap-2 text-sm text-text-primary">
                        <input type="checkbox" checked={c.received.includes(item)}
                          onChange={() => toggle(c.id, item)} />
                        <span className={c.received.includes(item) ? 'line-through opacity-50' : ''}>
                          {item}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {missing.length > 0 && c.phone && (
                    <button onClick={() => chase(c)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-light">
                      <MessageCircle size={12} /> Chase on WhatsApp
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(clientUrl(c))
                        setCopiedId(c.id)
                        setTimeout(() => setCopiedId(null), 2000)
                      } catch {
                        window.prompt('Copy the client checklist link:', clientUrl(c))
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:border-accent hover:text-accent">
                    {copiedId === c.id ? <Check size={12} /> : <Link2 size={12} />}
                    {copiedId === c.id ? 'Copied!' : 'Copy checklist link'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Client-facing checklist page — travels in the URL hash. */
export function DocSendApp() {
  const [config, setConfig] = useState<ChaseConfig | null>(null)
  const [checked, setChecked] = useState(false)
  const [ticked, setTicked] = useState<string[]>([])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setConfig(decodeShare<ChaseConfig>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!config)
    return <p className="py-20 text-center text-sm text-text-muted">This checklist link is invalid.</p>

  const notify = () => {
    const msg = `Hi ${config.firmName}, this is ${config.clientName}. I'm sending over:\n\n${ticked.map((t) => `• ${t}`).join('\n')}\n\n(Sent to ${config.email || 'your email'})`
    if (config.whatsapp) window.open(buildWhatsAppLink(config.whatsapp, msg), '_blank')
    else window.open(`mailto:${config.email}?subject=${encodeURIComponent(`Documents from ${config.clientName}`)}&body=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-xl font-semibold text-text-primary">
        {config.firmName} needs these from you
      </h1>
      <p className="text-sm text-text-muted">
        Email the files to <strong>{config.email || 'your accountant'}</strong>, tick
        what you&apos;ve sent, then hit the button so they know to look.
      </p>
      <ul className="space-y-2 rounded-2xl border border-border bg-white p-5">
        {config.items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" checked={ticked.includes(item)}
                onChange={(e) => setTicked((prev) => e.target.checked ? [...prev, item] : prev.filter((t) => t !== item))} />
              {item}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={notify} disabled={ticked.length === 0}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
        I&apos;ve sent {ticked.length || 'the'} item{ticked.length === 1 ? '' : 's'} — notify {config.firmName}
      </button>
      <p className="text-center text-xs text-text-muted">Doc Chaser — Nava Studios</p>
    </div>
  )
}
