'use client'

import { useState } from 'react'
import { Plus, Trash2, MessageCircle, Mail } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState } from '@nava-studios/kit'
import { buildWhatsAppLink } from '@nava-studios/kit'
import { todayISO, addDaysISO } from '@nava-studios/kit'

interface Contact {
  id: string
  name: string
  company: string
  phone: string
  email: string
  notes: string
  nextAction: string
  nextActionOn: string
}

export function TinyCrmApp() {
  const [contacts, setContacts] = useLocalState<Contact[]>('tools:crm:contacts', [])
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Contact>(() => blank())
  const today = todayISO()

  function blank(): Contact {
    return {
      id: `c_${Date.now().toString(36)}`,
      name: '', company: '', phone: '', email: '', notes: '',
      nextAction: '', nextActionOn: addDaysISO(todayISO(), 7),
    }
  }

  const patch = (id: string, p: Partial<Contact>) =>
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)))

  const dueList = contacts
    .filter((c) => c.nextAction && c.nextActionOn <= today)
    .sort((a, b) => a.nextActionOn.localeCompare(b.nextActionOn))

  return (
    <div className="space-y-8">
      {/* This week's follow-ups */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Follow up with these {dueList.length ? dueList.length : ''} people
        </h2>
        {dueList.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Nothing due. Add a &ldquo;next action&rdquo; on any contact and it
            surfaces here on its date — that&apos;s the whole system.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dueList.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  <strong className="text-text-primary">{c.name}</strong>
                  <span className="text-text-muted"> — {c.nextAction} (due {c.nextActionOn})</span>
                </span>
                <span className="flex gap-1.5">
                  {c.phone && (
                    <a href={buildWhatsAppLink(c.phone, `Hi ${c.name.split(' ')[0]}, `)} target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-border p-1.5 text-text-muted hover:border-accent hover:text-accent">
                      <MessageCircle size={13} />
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`}
                      className="rounded-full border border-border p-1.5 text-text-muted hover:border-accent hover:text-accent">
                      <Mail size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => patch(c.id, { nextAction: '', nextActionOn: addDaysISO(today, 7) })}
                    className="rounded-full border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                    Done
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {adding ? (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Company (optional)"><input className={inputClass} value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} /></Field>
            <Field label="WhatsApp (optional)"><input className={inputClass} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
            <Field label="Email (optional)"><input className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
            <Field label="Next action (optional)"><input className={inputClass} value={draft.nextAction} placeholder="Send proposal follow-up" onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} /></Field>
            <Field label="On date"><input type="date" className={inputClass} value={draft.nextActionOn} onChange={(e) => setDraft({ ...draft, nextActionOn: e.target.value })} /></Field>
          </div>
          <Field label="Notes"><textarea rows={2} className={inputClass} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button onClick={() => { setContacts((prev) => [...prev, draft]); setDraft(blank()); setAdding(false) }}
              disabled={!draft.name}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
              Add contact
            </button>
            <button onClick={() => setAdding(false)} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md">
          <Plus size={14} /> Add contact
        </button>
      )}

      {contacts.length > 0 && (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {contacts.map((c) => (
            <li key={c.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button onClick={() => setOpenId(openId === c.id ? null : c.id)} className="text-left hover:text-accent">
                  <p className="text-sm font-medium text-text-primary">
                    {c.name}{c.company && <span className="text-text-muted"> · {c.company}</span>}
                  </p>
                  <p className="text-xs text-text-muted">
                    {c.nextAction ? `Next: ${c.nextAction} (${c.nextActionOn})` : 'No next action set'}
                  </p>
                </button>
                <button onClick={() => setContacts((prev) => prev.filter((x) => x.id !== c.id))}
                  className="p-1.5 text-text-muted hover:text-red-600" aria-label="Remove contact">
                  <Trash2 size={13} />
                </button>
              </div>
              {openId === c.id && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Next action">
                    <input className={inputClass} value={c.nextAction} onChange={(e) => patch(c.id, { nextAction: e.target.value })} />
                  </Field>
                  <Field label="On date">
                    <input type="date" className={inputClass} value={c.nextActionOn} onChange={(e) => patch(c.id, { nextActionOn: e.target.value })} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Notes">
                      <textarea rows={3} className={inputClass} value={c.notes} onChange={(e) => patch(c.id, { notes: e.target.value })} />
                    </Field>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
