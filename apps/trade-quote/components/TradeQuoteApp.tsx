'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2, MessageCircle, Printer, FileText, Check } from 'lucide-react'
import { APP_LINKS } from '@nava-studios/catalog'
import { Field, inputClass } from '@nava-studios/kit'
import { InvoiceDoc, computeInvoice } from '@nava-studios/kit'
import { useLocalState, encodeShare } from '@nava-studios/kit'
import { buildWhatsAppLink } from '@nava-studios/kit'
import {
  EMPTY_BUSINESS,
  EMPTY_CLIENT,
  newInvoiceId,
  todayISO,
  addDaysISO,
  formatINR,
  type Invoice,
  type BusinessProfile,
} from '@nava-studios/kit'

interface PriceItem {
  id: string
  name: string
  rate: number
  unit: string // "per hour", "per sq ft", "fixed"
}

export function TradeQuoteApp() {
  const [priceList, setPriceList] = useLocalState<PriceItem[]>('tools:trade:prices', [])
  const [business, setBusiness] = useLocalState<BusinessProfile>(
    'getpaid:business',
    EMPTY_BUSINESS,
  )
  const [quote, setQuote] = useState<Invoice | null>(null)
  const [newItem, setNewItem] = useState({ name: '', rate: 0, unit: 'fixed' })
  const [converted, setConverted] = useState(false)

  const startQuote = () => {
    const date = todayISO()
    setConverted(false)
    setQuote({
      id: newInvoiceId(),
      heading: 'Quotation',
      number: `QUO-${date.replaceAll('-', '').slice(2)}-${Math.floor(Math.random() * 90 + 10)}`,
      date,
      dueDate: addDaysISO(date, 15),
      gstMode: false,
      gstRatePercent: 18,
      supplyType: 'intra',
      business,
      client: EMPTY_CLIENT,
      lines: [],
      notes: 'Quote valid for 15 days.',
      status: 'draft',
    })
  }

  const addToQuote = (item: PriceItem) => {
    if (!quote) return
    setQuote({
      ...quote,
      lines: [
        ...quote.lines,
        { description: `${item.name}${item.unit !== 'fixed' ? ` (${item.unit})` : ''}`, hsn: '', quantity: 1, unitRate: item.rate },
      ],
    })
  }

  const totals = useMemo(() => (quote ? computeInvoice(quote).totals : null), [quote])

  const sendQuote = () => {
    if (!quote || !totals) return
    const url = `${APP_LINKS["one-page-invoice"]}/view#${encodeShare(quote)}`
    const msg = [
      `Hi ${quote.client.name || 'there'},`,
      ``,
      `Here's your quote from ${quote.business.name}: ${formatINR(totals.total)}.`,
      ``,
      `View it here: ${url}`,
      ``,
      `Reply "yes" and we'll get you on the schedule!`,
    ].join('\n')
    window.open(buildWhatsAppLink(quote.client.phone, msg), '_blank')
  }

  const convertToInvoice = () => {
    if (!quote) return
    const date = todayISO()
    const invoice: Invoice = {
      ...quote,
      id: newInvoiceId(),
      heading: undefined,
      number: quote.number.replace('QUO', 'INV'),
      date,
      dueDate: addDaysISO(date, 15),
      status: 'draft',
    }
    // Lands in the GST WhatsApp Biller's list — same storage key.
    try {
      const nextKey = 'nava-studios:getpaid:biller:invoices'
      const legacyKey = 'verity:getpaid:biller:invoices'
      const raw =
        window.localStorage.getItem(nextKey) ??
        window.localStorage.getItem(legacyKey)
      const list: Invoice[] = raw ? JSON.parse(raw) : []
      window.localStorage.setItem(nextKey, JSON.stringify([...list, invoice]))
      setConverted(true)
    } catch {
      // storage unavailable — nothing sensible to do client-side
    }
  }

  return (
    <div className="space-y-8">
      {/* Price list */}
      <fieldset className="rounded-2xl border border-border bg-surface p-6">
        <legend className="px-1 text-sm font-semibold text-text-primary">
          Your price list (set once, quote forever)
        </legend>
        <div className="space-y-2">
          {priceList.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-primary">
                {p.name} — {formatINR(p.rate)}
                {p.unit !== 'fixed' && <span className="text-text-muted"> {p.unit}</span>}
              </span>
              <span className="flex gap-1.5">
                {quote && (
                  <button onClick={() => addToQuote(p)}
                    className="rounded-full border border-accent px-3 py-1 text-xs font-medium text-accent hover:bg-accent-light">
                    Add to quote
                  </button>
                )}
                <button onClick={() => setPriceList((prev) => prev.filter((x) => x.id !== p.id))}
                  className="p-1 text-text-muted hover:text-red-600" aria-label="Remove">
                  <Trash2 size={13} />
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div className="min-w-40 flex-1">
            <Field label="Service / material">
              <input className={inputClass} value={newItem.name} placeholder="Bathroom leak repair"
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            </Field>
          </div>
          <Field label="Rate (₹)">
            <input type="number" min={0} className={inputClass} value={newItem.rate || ''}
              onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })} />
          </Field>
          <Field label="Unit">
            <select className={inputClass} value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
              <option value="fixed">fixed</option>
              <option value="per hour">per hour</option>
              <option value="per day">per day</option>
              <option value="per sq ft">per sq ft</option>
              <option value="per unit">per unit</option>
            </select>
          </Field>
          <button
            onClick={() => {
              setPriceList((prev) => [...prev, { id: `p_${Date.now().toString(36)}`, ...newItem }])
              setNewItem({ name: '', rate: 0, unit: newItem.unit })
            }}
            disabled={!newItem.name || !newItem.rate}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent disabled:opacity-40">
            <Plus size={13} className="mr-1 inline" /> Save
          </button>
        </div>
      </fieldset>

      {!quote ? (
        <button onClick={startQuote}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md">
          <FileText size={14} /> Start a quote
        </button>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 print:hidden">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Your business name">
                <input className={inputClass} value={quote.business.name}
                  onChange={(e) => {
                    const b = { ...quote.business, name: e.target.value }
                    setQuote({ ...quote, business: b })
                    setBusiness(b)
                  }} />
              </Field>
              <Field label="Customer name">
                <input className={inputClass} value={quote.client.name}
                  onChange={(e) => setQuote({ ...quote, client: { ...quote.client, name: e.target.value } })} />
              </Field>
              <Field label="Customer WhatsApp">
                <input className={inputClass} value={quote.client.phone} placeholder="98765 43210"
                  onChange={(e) => setQuote({ ...quote, client: { ...quote.client, phone: e.target.value } })} />
              </Field>
            </div>

            {/* Quote lines with qty edit */}
            {quote.lines.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
                Tap &ldquo;Add to quote&rdquo; on price-list items above — or add a
                custom line below.
              </p>
            ) : (
              <ul className="space-y-2">
                {quote.lines.map((l, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="flex-1 text-text-primary">{l.description}</span>
                    <input type="number" min={0} value={l.quantity}
                      className="w-16 rounded border border-border px-2 py-1 text-right text-sm focus:border-accent focus:outline-none"
                      onChange={(e) =>
                        setQuote({
                          ...quote,
                          lines: quote.lines.map((x, j) => j === i ? { ...x, quantity: Number(e.target.value) } : x),
                        })} />
                    <span className="w-24 text-right text-text-muted">{formatINR(l.unitRate)}</span>
                    <button onClick={() => setQuote({ ...quote, lines: quote.lines.filter((_, j) => j !== i) })}
                      className="p-1 text-text-muted hover:text-red-600" aria-label="Remove line">
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setQuote({ ...quote, lines: [...quote.lines, { description: 'Custom item', hsn: '', quantity: 1, unitRate: 0 }] })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent">
              <Plus size={13} /> Custom line
            </button>

            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={sendQuote} disabled={quote.lines.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
                <MessageCircle size={14} /> Send on WhatsApp
              </button>
              <button onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:border-accent hover:text-accent">
                <Printer size={14} /> Print / PDF
              </button>
              <button onClick={convertToInvoice} disabled={quote.lines.length === 0 || converted}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-40">
                <Check size={14} /> {converted ? 'In your Biller ✓' : 'Accepted → make invoice'}
              </button>
            </div>
            {converted && (
              <p className="text-xs text-text-muted">
                Invoice created in the GST WhatsApp Biller — open it there to send and track payment.
              </p>
            )}
          </div>

          <div className="print-area">
            <InvoiceDoc invoice={quote} />
          </div>
        </div>
      )}
    </div>
  )
}
