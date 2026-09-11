'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Link2, Check, MessageCircle } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState, encodeShare, decodeShare } from '@nava-studios/kit'
import { buildWhatsAppLink } from '@nava-studios/kit'
import { todayISO } from '@nava-studios/kit'

export interface BookConfig {
  businessName: string
  whatsapp: string
  services: string[]
  hours: string // e.g. "Tue–Sun, 10am–7pm"
}

interface Appointment {
  id: string
  name: string
  phone: string
  service: string
  date: string
  time: string
}

export function NudgeBookApp() {
  const [config, setConfig] = useLocalState<BookConfig>('tools:nudge:config', {
    businessName: '', whatsapp: '', services: ['Haircut'], hours: 'Tue–Sun, 10am–7pm',
  })
  const [appointments, setAppointments] = useLocalState<Appointment[]>('tools:nudge:appts', [])
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState({ name: '', phone: '', service: '', date: todayISO(), time: '10:00' })

  const bookUrl = () =>
    `${window.location.origin}/book#${encodeShare(config)}`

  const remind = (a: Appointment) => {
    const msg = `Hi ${a.name}! Reminder: your ${a.service} at ${config.businessName} is on ${a.date} at ${a.time}. Reply YES to confirm, or let us know if you need to reschedule. See you soon!`
    window.open(buildWhatsAppLink(a.phone, msg), '_blank')
  }

  const upcoming = [...appointments].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
  )

  return (
    <div className="space-y-8">
      {/* Setup */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          1. Your booking page
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Business name">
            <input className={inputClass} value={config.businessName}
              onChange={(e) => setConfig({ ...config, businessName: e.target.value })} />
          </Field>
          <Field label="Your WhatsApp (bookings arrive here)">
            <input className={inputClass} value={config.whatsapp} placeholder="98765 43210"
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })} />
          </Field>
          <Field label="Open hours (shown to customers)">
            <input className={inputClass} value={config.hours}
              onChange={(e) => setConfig({ ...config, hours: e.target.value })} />
          </Field>
        </div>
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-text-muted">Services</p>
          <div className="flex flex-wrap gap-2">
            {config.services.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs">
                {s}
                <button onClick={() => setConfig({ ...config, services: config.services.filter((_, j) => j !== i) })}
                  className="text-text-muted hover:text-red-600" aria-label={`Remove ${s}`}>
                  <Trash2 size={11} />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                const s = window.prompt('Service name (e.g. "Deep cleaning — 2 hrs")')
                if (s?.trim()) setConfig({ ...config, services: [...config.services, s.trim()] })
              }}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-text-muted hover:border-accent hover:text-accent">
              <Plus size={11} /> Add service
            </button>
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(bookUrl())
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            } catch {
              window.prompt('Copy your booking link:', bookUrl())
            }
          }}
          disabled={!config.businessName || !config.whatsapp}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? 'Copied!' : 'Copy booking link'}
        </button>
        <p className="mt-2 text-xs text-text-muted">
          Put it in your Instagram bio and Google Business profile. Booking requests
          arrive on your WhatsApp; add them below so reminders are one tap.
        </p>
      </div>

      {/* Appointments + reminders */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          2. Appointments — one tap sends the no-show-killing reminder
        </h2>
        <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface p-4">
          <div className="min-w-32 flex-1">
            <Field label="Customer"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          </div>
          <div className="min-w-32 flex-1">
            <Field label="WhatsApp"><input className={inputClass} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
          </div>
          <Field label="Service">
            <select className={inputClass} value={draft.service} onChange={(e) => setDraft({ ...draft, service: e.target.value })}>
              <option value="">—</option>
              {config.services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Date"><input type="date" className={inputClass} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></Field>
          <Field label="Time"><input type="time" className={inputClass} value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></Field>
          <button
            onClick={() => {
              setAppointments((prev) => [...prev, { id: `a_${Date.now().toString(36)}`, ...draft, service: draft.service || config.services[0] || 'Appointment' }])
              setDraft({ ...draft, name: '', phone: '' })
            }}
            disabled={!draft.name || !draft.phone}
            className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-40">
            Add
          </button>
        </div>

        {upcoming.length > 0 && (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {upcoming.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {a.name} <span className="text-text-muted">· {a.service}</span>
                  </p>
                  <p className="text-xs text-text-muted">{a.date} at {a.time}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => remind(a)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-light">
                    <MessageCircle size={12} /> Send reminder
                  </button>
                  <button onClick={() => setAppointments((prev) => prev.filter((x) => x.id !== a.id))}
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

/** Customer-facing booking page — config travels in the URL hash. */
export function NudgeBookingApp() {
  const [config, setConfig] = useState<BookConfig | null>(null)
  const [checked, setChecked] = useState(false)
  const [form, setForm] = useState({ name: '', service: '', date: todayISO(), time: '10:00' })

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setConfig(decodeShare<BookConfig>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!config)
    return <p className="py-20 text-center text-sm text-text-muted">This booking link is invalid.</p>

  const book = () => {
    const msg = `Hi ${config.businessName}! I'd like to book:\n\nService: ${form.service || config.services[0]}\nDate: ${form.date}\nTime: ${form.time}\nName: ${form.name}\n\nIs this slot available?`
    window.open(buildWhatsAppLink(config.whatsapp, msg), '_blank')
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-xl font-semibold text-text-primary">
        Book with {config.businessName}
      </h1>
      <p className="text-sm text-text-muted">Open: {config.hours}</p>
      <Field label="Your name">
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Service">
        <select className={inputClass} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
          {config.services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input type="date" min={todayISO()} className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </Field>
        <Field label="Preferred time">
          <input type="time" className={inputClass} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </Field>
      </div>
      <button onClick={book} disabled={!form.name}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
        Request this slot on WhatsApp
      </button>
      <p className="text-center text-xs text-text-muted">Bookings by Nudge Book — Nava Studios</p>
    </div>
  )
}
