'use client'

import { useMemo, useState } from 'react'
import {
  Plus,
  MessageCircle,
  Printer,
  Check,
  ArrowLeft,
  BellRing,
  IndianRupee,
} from 'lucide-react'
import { InvoiceForm } from './InvoiceForm'
import { InvoiceDoc, computeInvoice } from './InvoiceDoc'
import { useLocalState, encodeShare } from '../lib/storage'
import {
  buildWhatsAppLink,
  invoiceMessage,
  reminderMessage,
  toneForOverdue,
  daysBetween,
} from '../lib/links'
import {
  EMPTY_BUSINESS,
  EMPTY_CLIENT,
  newInvoiceId,
  todayISO,
  addDaysISO,
  formatINR,
  type Invoice,
  type BusinessProfile,
  type InvoiceStatus,
} from '../lib/types'

const STATUS_LABEL: Record<InvoiceStatus, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-stone-200 text-stone-600' },
  sent: { label: 'Sent', classes: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Paid', classes: 'bg-emerald-100 text-emerald-800' },
}

function nextNumber(invoices: Invoice[]): string {
  const date = todayISO().replaceAll('-', '').slice(2)
  return `INV-${date}-${String(invoices.length + 1).padStart(2, '0')}`
}

export function BillerApp() {
  const [invoices, setInvoices] = useLocalState<Invoice[]>('getpaid:biller:invoices', [])
  const [business, setBusiness] = useLocalState<BusinessProfile>(
    'getpaid:business',
    EMPTY_BUSINESS,
  )
  const [editingId, setEditingId] = useState<string | null>(null)

  const editing = invoices.find((i) => i.id === editingId) ?? null
  const today = todayISO()

  const totals = useMemo(() => {
    let outstanding = 0
    let collected = 0
    for (const inv of invoices) {
      const { totals } = computeInvoice(inv)
      if (inv.status === 'paid') collected += totals.total
      else outstanding += totals.total
    }
    return { outstanding, collected }
  }, [invoices])

  const overdue = invoices.filter(
    (i) => i.status === 'sent' && daysBetween(i.dueDate, today) > 0,
  )

  const upsert = (invoice: Invoice) => {
    setInvoices((prev) => {
      const exists = prev.some((i) => i.id === invoice.id)
      return exists ? prev.map((i) => (i.id === invoice.id ? invoice : i)) : [...prev, invoice]
    })
    setBusiness(invoice.business)
  }

  const createInvoice = () => {
    const date = todayISO()
    const invoice: Invoice = {
      id: newInvoiceId(),
      number: nextNumber(invoices),
      date,
      dueDate: addDaysISO(date, 15),
      gstMode: true,
      gstRatePercent: 18,
      supplyType: 'intra',
      business,
      client: EMPTY_CLIENT,
      lines: [{ description: '', hsn: '', quantity: 1, unitRate: 0 }],
      notes: '',
      status: 'draft',
    }
    upsert(invoice)
    setEditingId(invoice.id)
  }

  const shareUrl = (invoice: Invoice) =>
    `${window.location.origin}/tools/one-page-invoice/view#${encodeShare(invoice)}`

  const sendInvoice = (invoice: Invoice) => {
    const { totals } = computeInvoice(invoice)
    const message = invoiceMessage(invoice, totals.total, shareUrl(invoice))
    window.open(buildWhatsAppLink(invoice.client.phone, message), '_blank')
    if (invoice.status === 'draft') upsert({ ...invoice, status: 'sent' })
  }

  const sendReminder = (invoice: Invoice) => {
    const { totals } = computeInvoice(invoice)
    const days = daysBetween(invoice.dueDate, today)
    const message = reminderMessage({
      clientName: invoice.client.name,
      businessName: invoice.business.name,
      invoiceNumber: invoice.number,
      amount: totals.total,
      dueDate: invoice.dueDate,
      daysOverdue: days,
      tone: toneForOverdue(days),
      upiId: invoice.business.upiId || undefined,
    })
    window.open(buildWhatsAppLink(invoice.client.phone, message), '_blank')
  }

  // ── Editor view ──────────────────────────────────────────────
  if (editing) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setEditingId(null)}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent print:hidden"
        >
          <ArrowLeft size={14} /> All invoices
        </button>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="print:hidden">
            <InvoiceForm invoice={editing} onChange={upsert} />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                onClick={() => sendInvoice(editing)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
              >
                <MessageCircle size={14} /> Send on WhatsApp
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                <Printer size={14} /> Print / PDF
              </button>
              {editing.status !== 'paid' && (
                <button
                  onClick={() => upsert({ ...editing, status: 'paid', paidOn: today })}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  <Check size={14} /> Mark paid
                </button>
              )}
            </div>
            <div className="print-area">
              <InvoiceDoc invoice={editing} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Outstanding</p>
          <p className="mt-1 font-display text-2xl font-semibold text-text-primary">
            {formatINR(totals.outstanding)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Collected</p>
          <p className="mt-1 font-display text-2xl font-semibold text-emerald-700">
            {formatINR(totals.collected)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-muted">Needs a nudge</p>
          <p className="mt-1 font-display text-2xl font-semibold text-amber-700">
            {overdue.length} invoice{overdue.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* Overdue callout */}
      {overdue.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-900">
            <BellRing size={15} /> Overdue — one tap sends a polite WhatsApp reminder
          </p>
          <ul className="mt-3 space-y-2">
            {overdue.map((inv) => {
              const { totals } = computeInvoice(inv)
              const days = daysBetween(inv.dueDate, today)
              return (
                <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-amber-900">
                    {inv.client.name || 'Client'} · {inv.number} · {formatINR(totals.total)} ·{' '}
                    {days}d overdue
                  </span>
                  <button
                    onClick={() => sendReminder(inv)}
                    className="rounded-full border border-amber-300 px-3 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100"
                  >
                    Remind on WhatsApp
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Invoice list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text-primary">Invoices</h2>
          <button
            onClick={createInvoice}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
          >
            <Plus size={14} /> New invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <IndianRupee size={22} className="mx-auto text-text-muted" />
            <p className="mt-3 text-sm text-text-muted">
              No invoices yet. Create one, send it on WhatsApp with a UPI pay link,
              and track it here until it&apos;s paid.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {[...invoices].reverse().map((inv) => {
              const { totals } = computeInvoice(inv)
              const s = STATUS_LABEL[inv.status]
              return (
                <li
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <button
                    onClick={() => setEditingId(inv.id)}
                    className="text-left transition-colors hover:text-accent"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      {inv.client.name || 'Unnamed client'}{' '}
                      <span className="text-text-muted">· {inv.number}</span>
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatINR(totals.total)} · due {inv.dueDate}
                    </p>
                  </button>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.classes}`}
                    >
                      {s.label}
                    </span>
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => sendInvoice(inv)}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
                      >
                        Send
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
