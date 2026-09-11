'use client'

import { useState } from 'react'
import { Plus, Trash2, MessageCircle } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState } from '@nava-studios/kit'
import { buildWhatsAppLink } from '@nava-studios/kit'
import { todayISO } from '@nava-studios/kit'

interface Crew {
  id: string
  name: string
  phone: string
}

interface Job {
  id: string
  date: string
  time: string
  client: string
  address: string
  task: string
  crewId: string
}

export function CrewBoardApp() {
  const [crew, setCrew] = useLocalState<Crew[]>('tools:crew:members', [])
  const [jobs, setJobs] = useLocalState<Job[]>('tools:crew:jobs', [])
  const [date, setDate] = useState(todayISO())
  const [draft, setDraft] = useState({ time: '09:00', client: '', address: '', task: '', crewId: '' })

  const dayJobs = jobs
    .filter((j) => j.date === date)
    .sort((a, b) => a.time.localeCompare(b.time))

  const sendDaySheet = (member: Crew) => {
    const theirs = dayJobs.filter((j) => j.crewId === member.id)
    const lines = [
      `Hi ${member.name}! Your jobs for ${date}:`,
      ``,
      ...(theirs.length
        ? theirs.map((j) => `${j.time} — ${j.client}\n${j.address}${j.task ? `\nJob: ${j.task}` : ''}`)
        : ['No jobs scheduled — enjoy the day off!']),
      ``,
      `Reply OK to confirm.`,
    ]
    window.open(buildWhatsAppLink(member.phone, lines.join('\n')), '_blank')
  }

  return (
    <div className="space-y-8">
      {/* Crew */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-semibold text-text-primary">Your crew</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {crew.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs">
              {c.name}
              <button onClick={() => setCrew((prev) => prev.filter((x) => x.id !== c.id))}
                className="text-text-muted hover:text-red-600" aria-label={`Remove ${c.name}`}>
                <Trash2 size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              const name = window.prompt('Crew member name?')
              if (!name?.trim()) return
              const phone = window.prompt(`${name}'s WhatsApp number?`) ?? ''
              setCrew((prev) => [...prev, { id: `cr_${Date.now().toString(36)}`, name: name.trim(), phone }])
            }}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-text-muted hover:border-accent hover:text-accent">
            <Plus size={11} /> Add crew member
          </button>
        </div>
      </div>

      {/* Day picker + add job */}
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface p-4">
        <Field label="Day">
          <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Time">
          <input type="time" className={inputClass} value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
        </Field>
        <div className="min-w-28 flex-1">
          <Field label="Client">
            <input className={inputClass} value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} />
          </Field>
        </div>
        <div className="min-w-36 flex-1">
          <Field label="Address">
            <input className={inputClass} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
          </Field>
        </div>
        <Field label="Assign to">
          <select className={inputClass} value={draft.crewId} onChange={(e) => setDraft({ ...draft, crewId: e.target.value })}>
            <option value="">—</option>
            {crew.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <button
          onClick={() => {
            setJobs((prev) => [...prev, { id: `j_${Date.now().toString(36)}`, date, ...draft }])
            setDraft({ ...draft, client: '', address: '', task: '' })
          }}
          disabled={!draft.client || !draft.crewId}
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-40">
          Add job
        </button>
      </div>

      {/* Day board */}
      {dayJobs.length > 0 ? (
        <>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {dayJobs.map((j) => {
              const member = crew.find((c) => c.id === j.crewId)
              return (
                <li key={j.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {j.time} — {j.client}
                      <span className="ml-2 rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
                        {member?.name ?? 'unassigned'}
                      </span>
                    </p>
                    <p className="text-xs text-text-muted">{j.address}</p>
                  </div>
                  <button onClick={() => setJobs((prev) => prev.filter((x) => x.id !== j.id))}
                    className="p-1.5 text-text-muted hover:text-red-600" aria-label="Remove job">
                    <Trash2 size={13} />
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-text-primary">
              Send day sheets — every change ends with these two taps
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {crew.map((c) => (
                <button key={c.id} onClick={() => sendDaySheet(c)} disabled={!c.phone}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-2 text-xs font-medium text-accent hover:bg-accent-light disabled:opacity-40">
                  <MessageCircle size={12} /> WhatsApp {c.name}&apos;s jobs
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Add crew, add the day&apos;s jobs, then WhatsApp each person their day sheet —
          one schedule instead of three WhatsApp groups and a spreadsheet.
        </p>
      )}
    </div>
  )
}
