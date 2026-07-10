'use client'

import { useState } from 'react'
import { Plus, Trash2, Copy, Check, Mail } from 'lucide-react'
import { Field, inputClass } from '@/apps/getpaid/components/InvoiceForm'
import { useLocalState } from '@/apps/getpaid/lib/storage'
import { todayISO, formatINR } from '@/apps/getpaid/lib/types'

interface ScopeItem {
  id: string
  project: string
  request: string
  estimate: number
  date: string
  billed: boolean
}

function changeOrderEmail(project: string, items: ScopeItem[]) {
  const total = items.reduce((s, i) => s + i.estimate, 0)
  return [
    `Subject: ${project} — additional work outside our original scope`,
    ``,
    `Hi,`,
    ``,
    `As we've worked through ${project}, a few requests have come up that sit outside the scope we originally agreed. I've been happy to accommodate where possible — here's a quick summary so we can align before I take them further:`,
    ``,
    ...items.map((i) => `• ${i.date}: ${i.request} — est. ${formatINR(i.estimate)}`),
    ``,
    `Total additional work: ${formatINR(total)}`,
    ``,
    `If you'd like to go ahead with these, I'll add them as a change order and get started. If any aren't needed, no problem at all — just let me know which.`,
    ``,
    `Thanks!`,
  ].join('\n')
}

export function ScopeGuardApp() {
  const [items, setItems] = useLocalState<ScopeItem[]>('tools:scope:items', [])
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ project: '', request: '', estimate: 0 })
  const [copied, setCopied] = useState(false)

  const projects = [...new Set(items.map((i) => i.project))]
  const [selectedProject, setSelectedProject] = useState<string>('')
  const project = selectedProject || projects[0] || ''
  const unbilled = items.filter((i) => i.project === project && !i.billed)

  const copyEmail = async () => {
    const text = changeOrderEmail(project, unbilled)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy your change-order email:', text)
    }
  }

  const mailEmail = () => {
    const text = changeOrderEmail(project, unbilled)
    const [subjectLine, ...bodyLines] = text.split('\n')
    const subject = subjectLine.replace('Subject: ', '')
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n').trim())}`,
      '_blank',
    )
  }

  return (
    <div className="space-y-8">
      {adding ? (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Project / client">
              <input className={inputClass} value={draft.project} list="sg-projects"
                onChange={(e) => setDraft({ ...draft, project: e.target.value })} />
            </Field>
            <datalist id="sg-projects">
              {projects.map((p) => <option key={p} value={p} />)}
            </datalist>
            <Field label="What they asked for">
              <input className={inputClass} value={draft.request}
                placeholder='"Just one small change to…"'
                onChange={(e) => setDraft({ ...draft, request: e.target.value })} />
            </Field>
            <Field label="Your estimate (₹)">
              <input type="number" min={0} className={inputClass} value={draft.estimate || ''}
                onChange={(e) => setDraft({ ...draft, estimate: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setItems((prev) => [...prev, {
                  id: `sc_${Date.now().toString(36)}`,
                  ...draft,
                  date: todayISO(),
                  billed: false,
                }])
                setDraft({ project: draft.project, request: '', estimate: 0 })
                setAdding(false)
              }}
              disabled={!draft.project || !draft.request}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
              Log it (10 seconds, done)
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
          <Plus size={14} /> Log an out-of-scope request
        </button>
      )}

      {projects.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {projects.map((p) => (
              <button key={p} onClick={() => setSelectedProject(p)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${p === project ? 'border-accent bg-accent-light text-accent' : 'border-border text-text-muted hover:text-text-primary'}`}>
                {p}
              </button>
            ))}
          </div>

          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {items.filter((i) => i.project === project).map((i) => (
              <li key={i.id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 ${i.billed ? 'opacity-50' : ''}`}>
                <div>
                  <p className="text-sm text-text-primary">{i.request}</p>
                  <p className="text-xs text-text-muted">
                    {i.date} · {formatINR(i.estimate)} · {i.billed ? 'in change order' : 'unbilled'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setItems((prev) => prev.map((x) => x.id === i.id ? { ...x, billed: !x.billed } : x))}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted hover:border-accent hover:text-accent">
                    {i.billed ? 'Reopen' : 'Mark billed'}
                  </button>
                  <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
                    className="p-1.5 text-text-muted hover:text-red-600" aria-label="Remove">
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {unbilled.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm font-medium text-text-primary">
                {unbilled.length} unbilled request{unbilled.length === 1 ? '' : 's'} on {project} —{' '}
                {formatINR(unbilled.reduce((s, i) => s + i.estimate, 0))} of work you haven&apos;t charged for
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Scope Guard drafts the polite change-order email; you just review and send.
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy the email'}
                </button>
                <button onClick={mailEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:border-accent hover:text-accent">
                  <Mail size={14} /> Open in email
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {items.length === 0 && !adding && (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Next time a client says &ldquo;just one small thing&rdquo; — log it here in
          ten seconds. When you&apos;re ready, Scope Guard turns the log into a
          polite change-order email with the total.
        </p>
      )}
    </div>
  )
}
