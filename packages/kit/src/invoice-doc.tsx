import type { Invoice } from './types'
import { formatINR } from './types'
import {
  computeInvoiceItem,
  computeInvoiceTotals,
  type InvoiceItemComputed,
} from './gst'

export function computeInvoice(invoice: Invoice) {
  const rate = invoice.gstMode ? invoice.gstRatePercent : 0
  const items: InvoiceItemComputed[] = invoice.lines.map((line) =>
    computeInvoiceItem({
      item: {
        description: line.description,
        quantity: line.quantity,
        unitRate: line.unitRate,
      },
      gstRatePercent: rate,
      supplyType: invoice.supplyType,
    }),
  )
  return { items, totals: computeInvoiceTotals(items) }
}

/** Clean printable invoice. Wrap in .print-area and call window.print() for PDF. */
export function InvoiceDoc({ invoice }: { invoice: Invoice }) {
  const { items, totals } = computeInvoice(invoice)
  const intra = invoice.supplyType === 'intra'

  return (
    <div className="rounded-2xl border border-border bg-white p-8 text-[#1A1A18] shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="font-display text-xl font-semibold">{invoice.business.name || 'Your business'}</p>
          {invoice.business.address && (
            <p className="mt-1 whitespace-pre-line text-xs text-stone-500">{invoice.business.address}</p>
          )}
          {invoice.gstMode && invoice.business.gstin && (
            <p className="mt-1 text-xs text-stone-500">GSTIN: {invoice.business.gstin}</p>
          )}
          {(invoice.business.phone || invoice.business.email) && (
            <p className="mt-1 text-xs text-stone-500">
              {[invoice.business.phone, invoice.business.email].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            {invoice.heading ?? (invoice.gstMode ? 'Tax Invoice' : 'Invoice')}
          </p>
          <p className="mt-1 font-semibold">{invoice.number}</p>
          <p className="mt-1 text-xs text-stone-500">Date: {invoice.date}</p>
          <p className="text-xs text-stone-500">Due: {invoice.dueDate}</p>
        </div>
      </div>

      {/* Bill to */}
      <div className="mt-6">
        <p className="text-xs uppercase tracking-widest text-stone-400">Billed to</p>
        <p className="mt-1 font-medium">{invoice.client.name || 'Client'}</p>
        {invoice.client.address && (
          <p className="mt-0.5 whitespace-pre-line text-xs text-stone-500">{invoice.client.address}</p>
        )}
        {invoice.gstMode && invoice.client.gstin && (
          <p className="mt-0.5 text-xs text-stone-500">GSTIN: {invoice.client.gstin}</p>
        )}
      </div>

      {/* Lines */}
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-400">
            <th className="py-2 pr-2 font-medium">Item</th>
            {invoice.gstMode && <th className="py-2 pr-2 font-medium">HSN/SAC</th>}
            <th className="py-2 pr-2 text-right font-medium">Qty</th>
            <th className="py-2 pr-2 text-right font-medium">Rate</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-stone-100">
              <td className="py-2.5 pr-2">{item.description || `Item ${i + 1}`}</td>
              {invoice.gstMode && (
                <td className="py-2.5 pr-2 text-stone-500">{invoice.lines[i]?.hsn || '—'}</td>
              )}
              <td className="py-2.5 pr-2 text-right">{item.quantity}</td>
              <td className="py-2.5 pr-2 text-right">{formatINR(item.unitRate)}</td>
              <td className="py-2.5 text-right">{formatINR(item.taxableValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-6 ml-auto w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatINR(totals.taxableValue)}</span>
        </div>
        {invoice.gstMode && intra && (
          <>
            <div className="flex justify-between text-stone-600">
              <span>CGST ({invoice.gstRatePercent / 2}%)</span>
              <span>{formatINR(totals.cgst)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>SGST ({invoice.gstRatePercent / 2}%)</span>
              <span>{formatINR(totals.sgst)}</span>
            </div>
          </>
        )}
        {invoice.gstMode && !intra && (
          <div className="flex justify-between text-stone-600">
            <span>IGST ({invoice.gstRatePercent}%)</span>
            <span>{formatINR(totals.igst)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold">
          <span>Total due</span>
          <span>{formatINR(totals.total)}</span>
        </div>
      </div>

      {/* Payment + notes */}
      {(invoice.business.upiId || invoice.notes) && (
        <div className="mt-8 border-t border-stone-200 pt-4 text-xs text-stone-500">
          {invoice.business.upiId && (
            <p>
              Pay by UPI: <span className="font-medium text-stone-700">{invoice.business.upiId}</span>
              {invoice.business.upiName ? ` (${invoice.business.upiName})` : ''}
            </p>
          )}
          {invoice.notes && <p className="mt-2 whitespace-pre-line">{invoice.notes}</p>}
        </div>
      )}
    </div>
  )
}
