'use client'

import { useState } from 'react'
import { Plus, Check, MessageCircle, Trash2 } from 'lucide-react'
import { Field, inputClass } from '@/apps/getpaid/components/InvoiceForm'
import { useLocalState } from '@/apps/getpaid/lib/storage'
import { buildWhatsAppLink } from '@/apps/getpaid/lib/links'
import { todayISO, formatINR } from '@/apps/getpaid/lib/types'

interface Unit {
  id: string
  label: string
  tenant: string
  phone: string
  rent: number
  dueDay: number // day of month rent is due
}

/** "2026-07" period key. */
function currentPeriod() {
  return todayISO().slice(0, 7)
}

export function RentLedgerApp() {
  const [units, setUnits] = useLocalState<Unit[]>('tools:rent:units', [])
  // paid["2026-07"] = list of unit ids paid that month
  const [paid, setPaid] = useLocalState<Record<string, string[]>>('tools:rent:paid', {})
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Unit>(() => blank())

  function blank(): Unit {
    return {
      id: `u_${Date.now().toString(36)}`,
      label: '',
      tenant: '',
      phone: '',
      rent: 0,
      dueDay: 5,
    }
  }

  const period = currentPeriod()
  const paidThisMonth = paid[period] ?? []
  const dayOfMonth = Number(todayISO().slice(8, 10))

  const monthName = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  const expected = units.reduce((s, u) => s + u.rent, 0)
  const collected = units
    .filter((u) => paidThisMonth.includes(u.id))
    .reduce((s, u) => s + u.rent, 0)

  const togglePaid = (unitId: string) =>
    setPaid((prev) => {
      const list = prev[period] ?? []
      return {
        ...prev,
        [period]: list.includes(unitId)
          ? list.filter((id) => id !== unitId)
          : [...list, unitId],
      }
    })

  const remind = (u: Unit) => {
    const msg = `Hi ${u.tenant}, a gentle reminder that rent of ${formatINR(u.rent)} for ${u.label} (${monthName}) is due. Thank you!`
    window.open(buildWhatsAppLink(u.phone, msg), '_blank')
  }

  const receipt = (u: Unit) => {
    const msg = `Rent receipt — ${monthName}\n\nReceived ${formatINR(u.rent)} from ${u.tenant} for ${u.label}.\nDate: ${todayISO()}\n\nThank you!`
    window.open(buildWhatsAppLink(u.phone, msg), '_blank')
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">{monthName}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-text-primary">
            {formatINR(collected)} <span className="text-sm text-text-muted">/ {formatINR(expected)}</span>
          </p>
          <p className="text-xs text-text-muted">collected so far</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Units</p>
          <p className="mt-1 font-display text-2xl font-semibold text-text-primary">{units.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Pending</p>
          <p className="mt-1 font-display text-2xl font-semibold text-amber-700">
            {units.length - paidThisMonth.length}
          </p>
        </div>
      </div>

      {adding ? (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Unit (e.g. Flat 2B, Shop 1)">
              <input className={inputClass} value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
            </Field>
            <Field label="Tenant name">
              <input className={inputClass} value={draft.tenant}
                onChange={(e) => setDraft({ ...draft, tenant: e.target.value })} />
            </Field>
            <Field label="Tenant WhatsApp">
              <input className={inputClass} value={draft.phone} placeholder="98765 43210"
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Field>
            <Field label="Monthly rent (₹)">
              <input type="number" min={0} className={inputClass} value={draft.rent || ''}
                onChange={(e) => setDraft({ ...draft, rent: Number(e.target.value) })} />
            </Field>
            <Field label="Due day of month">
              <input type="number" min={1} max={28} className={inputClass} value={draft.dueDay}
                onChange={(e) => setDraft({ ...draft, dueDay: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setUnits((prev) => [...prev, draft]); setDraft(blank()); setAdding(false) }}
              disabled={!draft.label || !draft.rent}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
              Add unit
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
          <Plus size={14} /> Add a unit
        </button>
      )}

      {units.length > 0 && (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {units.map((u) => {
            const isPaid = paidThisMonth.includes(u.id)
            const isLate = !isPaid && dayOfMonth > u.dueDay
            return (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {u.label} <span className="text-text-muted">· {u.tenant}</span>
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatINR(u.rent)} · due day {u.dueDay} ·{' '}
                    {isPaid ? (
                      <span className="text-emerald-700">paid this month</span>
                    ) : isLate ? (
                      <span className="font-medium text-red-600">late</span>
                    ) : (
                      'pending'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {!isPaid && u.phone && (
                    <button onClick={() => remind(u)} title="Remind on WhatsApp"
                      className="rounded-full border border-border p-2 text-text-muted hover:border-accent hover:text-accent">
                      <MessageCircle size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => { if (!isPaid && u.phone) receipt(u); togglePaid(u.id) }}
                    title={isPaid ? 'Mark unpaid' : 'Mark paid + send receipt'}
                    className={`rounded-full border p-2 ${isPaid ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-border text-text-muted hover:border-emerald-300 hover:text-emerald-700'}`}>
                    <Check size={14} />
                  </button>
                  <button onClick={() => setUnits((prev) => prev.filter((x) => x.id !== u.id))}
                    title="Remove unit" className="rounded-full border border-border p-2 text-text-muted hover:border-red-300 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
