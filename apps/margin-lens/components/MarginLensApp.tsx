'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState } from '@nava-studios/kit'
import { formatINR } from '@nava-studios/kit'

interface FeeStack {
  platformPct: number // marketplace/platform commission %
  paymentPct: number // payment gateway %
  appsMonthly: number // fixed app/tool subscriptions per month
  shippingPerOrder: number // average shipping cost you absorb
}

interface OrderRow {
  id: string
  label: string
  revenue: number
  cogs: number
}

export function MarginLensApp() {
  const [fees, setFees] = useLocalState<FeeStack>('tools:margin:fees', {
    platformPct: 2,
    paymentPct: 2,
    appsMonthly: 0,
    shippingPerOrder: 60,
  })
  const [orders, setOrders] = useLocalState<OrderRow[]>('tools:margin:orders', [])
  const [paste, setPaste] = useState('')

  const addRow = () =>
    setOrders((prev) => [
      ...prev,
      { id: `o_${Date.now().toString(36)}`, label: `Order ${prev.length + 1}`, revenue: 0, cogs: 0 },
    ])

  const importPaste = () => {
    // Accept "label, revenue, cogs" per line (comma or tab separated).
    const rows: OrderRow[] = []
    for (const line of paste.split('\n')) {
      const parts = line.split(/[\t,]/).map((s) => s.trim())
      if (parts.length < 2) continue
      const revenue = Number(parts[1])
      if (!Number.isFinite(revenue)) continue
      rows.push({
        id: `o_${Date.now().toString(36)}_${rows.length}`,
        label: parts[0] || `Order ${rows.length + 1}`,
        revenue,
        cogs: Number(parts[2]) || 0,
      })
    }
    if (rows.length) {
      setOrders((prev) => [...prev, ...rows])
      setPaste('')
    }
  }

  const report = useMemo(() => {
    const perOrder = orders.map((o) => {
      const platformFee = (o.revenue * fees.platformPct) / 100
      const paymentFee = (o.revenue * fees.paymentPct) / 100
      const margin = o.revenue - o.cogs - platformFee - paymentFee - fees.shippingPerOrder
      return { ...o, platformFee, paymentFee, margin }
    })
    const revenue = perOrder.reduce((s, o) => s + o.revenue, 0)
    const grossMargin = perOrder.reduce((s, o) => s + o.margin, 0)
    const netMargin = grossMargin - fees.appsMonthly
    const feesTotal = perOrder.reduce((s, o) => s + o.platformFee + o.paymentFee, 0)
    const appsShare = grossMargin > 0 ? (fees.appsMonthly / grossMargin) * 100 : 0
    return { perOrder, revenue, grossMargin, netMargin, feesTotal, appsShare }
  }, [orders, fees])

  return (
    <div className="space-y-8">
      {/* Fee stack */}
      <fieldset className="rounded-2xl border border-border bg-surface p-6">
        <legend className="px-1 text-sm font-semibold text-text-primary">
          Your fee stack (set once)
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Platform fee %">
            <input type="number" min={0} step={0.1} className={inputClass} value={fees.platformPct}
              onChange={(e) => setFees({ ...fees, platformPct: Number(e.target.value) })} />
          </Field>
          <Field label="Payment fee %">
            <input type="number" min={0} step={0.1} className={inputClass} value={fees.paymentPct}
              onChange={(e) => setFees({ ...fees, paymentPct: Number(e.target.value) })} />
          </Field>
          <Field label="App subscriptions ₹/mo">
            <input type="number" min={0} className={inputClass} value={fees.appsMonthly}
              onChange={(e) => setFees({ ...fees, appsMonthly: Number(e.target.value) })} />
          </Field>
          <Field label="Avg shipping ₹/order">
            <input type="number" min={0} className={inputClass} value={fees.shippingPerOrder}
              onChange={(e) => setFees({ ...fees, shippingPerOrder: Number(e.target.value) })} />
          </Field>
        </div>
      </fieldset>

      {/* Headline numbers */}
      {orders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-text-muted">Revenue</p>
            <p className="mt-1 font-display text-2xl font-semibold text-text-primary">
              {formatINR(report.revenue)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              True margin (after apps)
            </p>
            <p className={`mt-1 font-display text-2xl font-semibold ${report.netMargin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {formatINR(report.netMargin)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Apps ate of your margin
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-amber-700">
              {report.appsShare.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-text-primary">Orders</h2>
          <button onClick={addRow}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent hover:text-accent">
            <Plus size={13} /> Add order
          </button>
        </div>

        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
            Add orders by hand, or paste rows below as <code>label, revenue, cost-of-goods</code> —
            one order per line, straight from your export.
          </p>
        )}

        {orders.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-2.5 font-medium">Order</th>
                  <th className="px-4 py-2.5 text-right font-medium">Revenue</th>
                  <th className="px-4 py-2.5 text-right font-medium">COGS</th>
                  <th className="px-4 py-2.5 text-right font-medium">Fees</th>
                  <th className="px-4 py-2.5 text-right font-medium">True margin</th>
                  <th className="px-2 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {report.perOrder.map((o) => (
                  <tr key={o.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2">
                      <input className="w-full bg-transparent text-sm focus:outline-none" value={o.label}
                        onChange={(e) => setOrders((prev) => prev.map((r) => r.id === o.id ? { ...r, label: e.target.value } : r))} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input type="number" className="w-24 bg-transparent text-right text-sm focus:outline-none" value={o.revenue || ''}
                        onChange={(e) => setOrders((prev) => prev.map((r) => r.id === o.id ? { ...r, revenue: Number(e.target.value) } : r))} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input type="number" className="w-24 bg-transparent text-right text-sm focus:outline-none" value={o.cogs || ''}
                        onChange={(e) => setOrders((prev) => prev.map((r) => r.id === o.id ? { ...r, cogs: Number(e.target.value) } : r))} />
                    </td>
                    <td className="px-4 py-2 text-right text-text-muted">
                      {formatINR(o.platformFee + o.paymentFee)}
                    </td>
                    <td className={`px-4 py-2 text-right font-medium ${o.margin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {formatINR(o.margin)}
                    </td>
                    <td className="px-2 py-2">
                      <button onClick={() => setOrders((prev) => prev.filter((r) => r.id !== o.id))}
                        className="p-1 text-text-muted hover:text-red-600" aria-label="Remove order">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <textarea rows={3} className={inputClass} placeholder={'Paste rows: label, revenue, cogs\n#1043, 1499, 700\n#1044, 899, 350'}
            value={paste} onChange={(e) => setPaste(e.target.value)} />
          <button onClick={importPaste} disabled={!paste.trim()}
            className="shrink-0 self-start rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-40">
            Import pasted rows
          </button>
        </div>
      </div>
    </div>
  )
}
