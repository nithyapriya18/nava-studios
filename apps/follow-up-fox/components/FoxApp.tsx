'use client'

import { useState } from 'react'
import { Plus, MessageCircle, Mail, Check, Trash2 } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState } from '@nava-studios/kit'
import {
  buildWhatsAppLink,
  reminderMessage,
  toneForOverdue,
  daysBetween,
  type ReminderTone,
} from '@nava-studios/kit'
import { todayISO, addDaysISO, formatINR } from '@nava-studios/kit'

interface Receivable {
  id: string
  clientName: string
  phone: string
  email: string
  invoiceNumber: string
  amount: number
  dueDate: string
  businessName: string
  upiId: string
  paid: boolean
  lastRemindedOn?: string
  remindersSent: number
}

const TONE_LABEL: Record<ReminderTone, string> = {
  friendly: 'Friendly nudge',
  neutral: 'Direct ask',
  firm: 'Firm reminder',
}

export function FoxApp() {
  const [items, setItems] = useLocalState<Receivable[]>('getpaid:fox:items', [])
  const [profile, setProfile] = useLocalState('getpaid:fox:profile', {
    businessName: '',
    upiId: '',
  })
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Receivable>(() => blank())
  const today = todayISO()

  function blank(): Receivable {
    return {
      id: `rcv_${Date.now().toString(36)}`,
      clientName: '',
      phone: '',
      email: '',
      invoiceNumber: '',
      amount: 0,
      dueDate: addDaysISO(todayISO(), 7),
      businessName: profile.businessName,
      upiId: profile.upiId,
      paid: false,
      remindersSent: 0,
    }
  }

  const unpaid = items.filter((i) => !i.paid)
  const totalOutstanding = unpaid.reduce((sum, i) => sum + i.amount, 0)

  const message = (item: Receivable) => {
    const days = daysBetween(item.dueDate, today)
    return reminderMessage({
      clientName: item.clientName,
      businessName: item.businessName || profile.businessName,
      invoiceNumber: item.invoiceNumber,
      amount: item.amount,
      dueDate: item.dueDate,
      daysOverdue: days,
      tone: toneForOverdue(days),
      upiId: item.upiId || profile.upiId || undefined,
    })
  }

  const markReminded = (item: Receivable) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, lastRemindedOn: today, remindersSent: i.remindersSent + 1 }
          : i,
      ),
    )

  const remindWhatsApp = (item: Receivable) => {
    window.open(buildWhatsAppLink(item.phone, message(item)), '_blank')
    markReminded(item)
  }

  const remindEmail = (item: Receivable) => {
    const subject = `Payment reminder — invoice ${item.invoiceNumber}`
    window.open(
      `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message(item))}`,
      '_blank',
    )
    markReminded(item)
  }

  const addItem = () => {
    setItems((prev) => [...prev, draft])
    setProfile({
      businessName: draft.businessName || profile.businessName,
      upiId: draft.upiId || profile.upiId,
    })
    setDraft(blank())
    setAdding(false)
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Waiting on
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-text-primary">
            {formatINR(totalOutstanding)}
          </p>
          <p className="text-xs text-text-muted">
            across {unpaid.length} unpaid invoice{unpaid.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            How Fox escalates
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            Before due: gentle heads-up · 1–7 days late: friendly · 8–21: direct ·
            22+: firm. Always polite, never you having to write it.
          </p>
        </div>
      </div>

      {/* Add form */}
      {adding ? (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Client name">
              <input
                className={inputClass}
                value={draft.clientName}
                onChange={(e) => setDraft({ ...draft, clientName: e.target.value })}
              />
            </Field>
            <Field label="Invoice number">
              <input
                className={inputClass}
                value={draft.invoiceNumber}
                onChange={(e) => setDraft({ ...draft, invoiceNumber: e.target.value })}
                placeholder="INV-042"
              />
            </Field>
            <Field label="Amount (₹)">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={draft.amount || ''}
                onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Due date">
              <input
                type="date"
                className={inputClass}
                value={draft.dueDate}
                onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              />
            </Field>
            <Field label="Client WhatsApp (optional)">
              <input
                className={inputClass}
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="98765 43210"
              />
            </Field>
            <Field label="Client email (optional)">
              <input
                className={inputClass}
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </Field>
            <Field label="Your business name">
              <input
                className={inputClass}
                value={draft.businessName}
                onChange={(e) => setDraft({ ...draft, businessName: e.target.value })}
              />
            </Field>
            <Field label="Your UPI ID (optional, added to reminders)">
              <input
                className={inputClass}
                value={draft.upiId}
                onChange={(e) => setDraft({ ...draft, upiId: e.target.value })}
              />
            </Field>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addItem}
              disabled={!draft.clientName || !draft.amount}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 disabled:opacity-40"
            >
              Track this invoice
            </button>
            <button
              onClick={() => setAdding(false)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
        >
          <Plus size={14} /> Track an unpaid invoice
        </button>
      )}

      {/* List */}
      {items.length > 0 && (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {[...items]
            .sort((a, b) => Number(a.paid) - Number(b.paid))
            .map((item) => {
              const days = daysBetween(item.dueDate, today)
              const tone = toneForOverdue(days)
              return (
                <li
                  key={item.id}
                  className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${item.paid ? 'opacity-50' : ''}`}
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.clientName}
                      <span className="text-text-muted">
                        {' '}· {item.invoiceNumber || 'no number'} · {formatINR(item.amount)}
                      </span>
                    </p>
                    <p className="text-xs text-text-muted">
                      {item.paid
                        ? 'Paid'
                        : days > 0
                          ? `${days}d overdue → ${TONE_LABEL[tone]}`
                          : days === 0
                            ? 'Due today'
                            : `Due ${item.dueDate}`}
                      {item.remindersSent > 0 &&
                        !item.paid &&
                        ` · reminded ${item.remindersSent}× (last ${item.lastRemindedOn})`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!item.paid && item.phone && (
                      <button
                        onClick={() => remindWhatsApp(item)}
                        title="Remind on WhatsApp"
                        className="rounded-full border border-border p-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <MessageCircle size={14} />
                      </button>
                    )}
                    {!item.paid && item.email && (
                      <button
                        onClick={() => remindEmail(item)}
                        title="Remind by email"
                        className="rounded-full border border-border p-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <Mail size={14} />
                      </button>
                    )}
                    {!item.paid && (
                      <button
                        onClick={() =>
                          setItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, paid: true } : i)),
                          )
                        }
                        title="Mark paid"
                        className="rounded-full border border-emerald-300 p-2 text-emerald-700 transition-colors hover:bg-emerald-50"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                      title="Remove"
                      className="rounded-full border border-border p-2 text-text-muted transition-colors hover:border-red-300 hover:text-red-600"
                    >
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
