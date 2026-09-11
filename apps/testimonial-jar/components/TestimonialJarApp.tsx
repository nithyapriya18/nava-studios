'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Link2, Check, Copy, Star } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState, encodeShare, decodeShare } from '@nava-studios/kit'
import { buildWhatsAppLink } from '@nava-studios/kit'
import { todayISO } from '@nava-studios/kit'

interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  approved: boolean
  date: string
}

interface JarConfig {
  businessName: string
  whatsapp: string
  email: string
}

export function TestimonialJarApp() {
  const [config, setConfig] = useLocalState<JarConfig>('tools:jar:config', {
    businessName: '', whatsapp: '', email: '',
  })
  const [items, setItems] = useLocalState<Testimonial[]>('tools:jar:items', [])
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', role: '', text: '' })

  const copy = async (what: 'link' | 'embed', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      window.prompt('Copy:', text)
    }
  }

  const collectUrl = () =>
    `${window.location.origin}/say#${encodeShare(config)}`

  const approved = items.filter((i) => i.approved)

  const embedHtml = () =>
    [
      `<div style="display:grid;gap:12px;font-family:system-ui">`,
      ...approved.map(
        (t) =>
          `  <figure style="margin:0;padding:16px;border:1px solid #e5e2d9;border-radius:12px;background:#fafaf7">` +
          `<blockquote style="margin:0;font-size:14px;color:#1a1a18">“${t.text}”</blockquote>` +
          `<figcaption style="margin-top:8px;font-size:12px;color:#6b6b63">— ${t.name}${t.role ? `, ${t.role}` : ''}</figcaption></figure>`,
      ),
      `</div>`,
    ].join('\n')

  return (
    <div className="space-y-8">
      {/* Setup + collection link */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          1. Your collection link
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Business name">
            <input className={inputClass} value={config.businessName}
              onChange={(e) => setConfig({ ...config, businessName: e.target.value })} />
          </Field>
          <Field label="Your WhatsApp (testimonials arrive here)">
            <input className={inputClass} value={config.whatsapp} placeholder="98765 43210"
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })} />
          </Field>
          <Field label="…or your email">
            <input className={inputClass} value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })} />
          </Field>
        </div>
        <button
          onClick={() => copy('link', collectUrl())}
          disabled={!config.businessName || (!config.whatsapp && !config.email)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
          {copied === 'link' ? <Check size={14} /> : <Link2 size={14} />}
          {copied === 'link' ? 'Copied!' : 'Copy collection link'}
        </button>
        <p className="mt-2 text-xs text-text-muted">
          Send it after a good delivery: &ldquo;Loved working with you — would you
          drop a line in my jar?&rdquo; Their words arrive on your WhatsApp/email;
          paste them below.
        </p>
      </div>

      {/* The jar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            2. Your jar ({approved.length} approved)
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent">
              <Plus size={13} /> Add received testimonial
            </button>
            {approved.length > 0 && (
              <button onClick={() => copy('embed', embedHtml())}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent">
                {copied === 'embed' ? <Check size={13} /> : <Copy size={13} />}
                {copied === 'embed' ? 'Copied!' : 'Copy embed HTML'}
              </button>
            )}
          </div>
        </div>

        {adding && (
          <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Customer name">
                <input className={inputClass} value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </Field>
              <Field label="Role / company (optional)">
                <input className={inputClass} value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
              </Field>
            </div>
            <Field label="What they said">
              <textarea rows={3} className={inputClass} value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setItems((prev) => [...prev, {
                    id: `t_${Date.now().toString(36)}`,
                    ...draft, approved: true, date: todayISO(),
                  }])
                  setDraft({ name: '', role: '', text: '' })
                  setAdding(false)
                }}
                disabled={!draft.name || !draft.text}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
                Add to jar
              </button>
              <button onClick={() => setAdding(false)}
                className="rounded-full border border-border px-5 py-2 text-sm font-medium text-text-muted hover:text-text-primary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && !adding ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
            <Star size={18} className="mx-auto mb-2 text-text-muted" />
            Empty jar. Share your collection link after your next happy delivery.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((t) => (
              <li key={t.id}
                className={`rounded-2xl border p-5 ${t.approved ? 'border-border bg-background' : 'border-dashed border-border bg-surface opacity-70'}`}>
                <blockquote className="text-sm leading-relaxed text-text-primary">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-text-muted">
                  — {t.name}{t.role && `, ${t.role}`}
                </p>
                <div className="mt-3 flex gap-1.5">
                  <button
                    onClick={() => setItems((prev) => prev.map((x) => x.id === t.id ? { ...x, approved: !x.approved } : x))}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted hover:border-accent hover:text-accent">
                    {t.approved ? 'Hide from wall' : 'Approve'}
                  </button>
                  <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
                    className="p-1.5 text-text-muted hover:text-red-600" aria-label="Remove">
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** Respondent page — the ask travels in the URL hash. */
export function TestimonialSayApp() {
  const [config, setConfig] = useState<JarConfig | null>(null)
  const [checked, setChecked] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', text: '' })

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setConfig(decodeShare<JarConfig>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!config)
    return (
      <p className="py-20 text-center text-sm text-text-muted">
        This link is invalid — ask for a fresh one.
      </p>
    )

  const send = () => {
    const message = `Testimonial for ${config.businessName}:\n\n"${form.text}"\n\n— ${form.name}${form.role ? `, ${form.role}` : ''}`
    if (config.whatsapp) {
      window.open(buildWhatsAppLink(config.whatsapp, message), '_blank')
    } else {
      window.open(
        `mailto:${config.email}?subject=${encodeURIComponent(`Testimonial for ${config.businessName}`)}&body=${encodeURIComponent(message)}`,
        '_blank',
      )
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-xl font-semibold text-text-primary">
        Say something nice about {config.businessName}
      </h1>
      <p className="text-sm text-text-muted">
        Two questions, sixty seconds, and it means the world to a small business.
      </p>
      <Field label="Your name">
        <input className={inputClass} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Role / company (optional)">
        <input className={inputClass} value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })} />
      </Field>
      <Field label={`What did ${config.businessName} do well?`}>
        <textarea rows={4} className={inputClass} value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })} />
      </Field>
      <button onClick={send} disabled={!form.name || !form.text}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
        Send it {config.whatsapp ? 'on WhatsApp' : 'by email'}
      </button>
      <p className="text-center text-xs text-text-muted">
        Collected with Testimonial Jar — Nava Studios
      </p>
    </div>
  )
}
