'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { Invoice, InvoiceLine } from '../lib/types'
import { GST_RATES } from '../lib/rates'

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

export function InvoiceForm({
  invoice,
  onChange,
}: {
  invoice: Invoice
  onChange: (invoice: Invoice) => void
}) {
  const set = (patch: Partial<Invoice>) => onChange({ ...invoice, ...patch })
  const setBusiness = (patch: Partial<Invoice['business']>) =>
    set({ business: { ...invoice.business, ...patch } })
  const setClient = (patch: Partial<Invoice['client']>) =>
    set({ client: { ...invoice.client, ...patch } })
  const setLine = (i: number, patch: Partial<InvoiceLine>) => {
    const lines = invoice.lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l))
    set({ lines })
  }

  return (
    <div className="space-y-8">
      {/* Invoice settings */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Invoice number">
          <input
            className={inputClass}
            value={invoice.number}
            onChange={(e) => set({ number: e.target.value })}
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            className={inputClass}
            value={invoice.date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </Field>
        <Field label="Due date">
          <input
            type="date"
            className={inputClass}
            value={invoice.dueDate}
            onChange={(e) => set({ dueDate: e.target.value })}
          />
        </Field>
        <Field label="Invoice type">
          <select
            className={inputClass}
            value={invoice.gstMode ? 'gst' : 'plain'}
            onChange={(e) => set({ gstMode: e.target.value === 'gst' })}
          >
            <option value="gst">GST invoice</option>
            <option value="plain">Simple (no GST)</option>
          </select>
        </Field>
      </div>

      {invoice.gstMode && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="GST rate">
            <select
              className={inputClass}
              value={invoice.gstRatePercent}
              onChange={(e) => set({ gstRatePercent: Number(e.target.value) })}
            >
              {GST_RATES.map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </select>
          </Field>
          <Field label="Supply type">
            <select
              className={inputClass}
              value={invoice.supplyType}
              onChange={(e) => set({ supplyType: e.target.value as Invoice['supplyType'] })}
            >
              <option value="intra">Within state (CGST + SGST)</option>
              <option value="inter">Interstate (IGST)</option>
            </select>
          </Field>
        </div>
      )}

      {/* Business */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-text-primary">Your business</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Business name">
            <input
              className={inputClass}
              value={invoice.business.name}
              onChange={(e) => setBusiness({ name: e.target.value })}
              placeholder="Sharma Traders"
            />
          </Field>
          {invoice.gstMode && (
            <Field label="Your GSTIN (optional)">
              <input
                className={inputClass}
                value={invoice.business.gstin}
                onChange={(e) => setBusiness({ gstin: e.target.value.toUpperCase() })}
                placeholder="29ABCDE1234F1Z5"
              />
            </Field>
          )}
          <Field label="Phone (optional)">
            <input
              className={inputClass}
              value={invoice.business.phone}
              onChange={(e) => setBusiness({ phone: e.target.value })}
              placeholder="98765 43210"
            />
          </Field>
          <Field label="UPI ID (shown on invoice for payment)">
            <input
              className={inputClass}
              value={invoice.business.upiId}
              onChange={(e) => setBusiness({ upiId: e.target.value })}
              placeholder="name@okbank"
            />
          </Field>
        </div>
        <Field label="Address (optional)">
          <textarea
            className={inputClass}
            rows={2}
            value={invoice.business.address}
            onChange={(e) => setBusiness({ address: e.target.value })}
          />
        </Field>
      </fieldset>

      {/* Client */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-text-primary">Bill to</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Client name">
            <input
              className={inputClass}
              value={invoice.client.name}
              onChange={(e) => setClient({ name: e.target.value })}
              placeholder="Acme Pvt Ltd"
            />
          </Field>
          {invoice.gstMode && (
            <Field label="Client GSTIN (optional)">
              <input
                className={inputClass}
                value={invoice.client.gstin}
                onChange={(e) => setClient({ gstin: e.target.value.toUpperCase() })}
              />
            </Field>
          )}
          <Field label="WhatsApp number (to send the invoice)">
            <input
              className={inputClass}
              value={invoice.client.phone}
              onChange={(e) => setClient({ phone: e.target.value })}
              placeholder="98765 43210"
            />
          </Field>
          <Field label="Email (optional)">
            <input
              className={inputClass}
              value={invoice.client.email}
              onChange={(e) => setClient({ email: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Address (optional)">
          <textarea
            className={inputClass}
            rows={2}
            value={invoice.client.address}
            onChange={(e) => setClient({ address: e.target.value })}
          />
        </Field>
      </fieldset>

      {/* Line items */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-text-primary">Items</legend>
        {invoice.lines.map((line, i) => (
          <div key={i} className="grid grid-cols-[1fr_72px_72px_100px_36px] items-end gap-2">
            <Field label={i === 0 ? 'Description' : ''}>
              <input
                className={inputClass}
                value={line.description}
                onChange={(e) => setLine(i, { description: e.target.value })}
                placeholder="Consulting — June"
              />
            </Field>
            {invoice.gstMode ? (
              <Field label={i === 0 ? 'HSN/SAC' : ''}>
                <input
                  className={inputClass}
                  value={line.hsn}
                  onChange={(e) => setLine(i, { hsn: e.target.value })}
                />
              </Field>
            ) : (
              <span />
            )}
            <Field label={i === 0 ? 'Qty' : ''}>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={line.quantity}
                onChange={(e) => setLine(i, { quantity: Number(e.target.value) })}
              />
            </Field>
            <Field label={i === 0 ? 'Rate (₹)' : ''}>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={line.unitRate}
                onChange={(e) => setLine(i, { unitRate: Number(e.target.value) })}
              />
            </Field>
            <button
              type="button"
              aria-label="Remove item"
              className="mb-0.5 rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-40"
              onClick={() => set({ lines: invoice.lines.filter((_, idx) => idx !== i) })}
              disabled={invoice.lines.length === 1}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          onClick={() =>
            set({
              lines: [...invoice.lines, { description: '', hsn: '', quantity: 1, unitRate: 0 }],
            })
          }
        >
          <Plus size={13} /> Add item
        </button>
      </fieldset>

      <Field label="Notes (optional — payment terms, thank-you, bank details)">
        <textarea
          className={inputClass}
          rows={2}
          value={invoice.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </Field>
    </div>
  )
}
