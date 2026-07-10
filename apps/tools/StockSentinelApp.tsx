'use client'

import { useState } from 'react'
import { Plus, Trash2, Copy, Check } from 'lucide-react'
import { Field, inputClass } from '@/apps/getpaid/components/InvoiceForm'
import { useLocalState } from '@/apps/getpaid/lib/storage'

interface Sku {
  id: string
  name: string
  stock: number
  threshold: number
}

export function StockSentinelApp() {
  const [skus, setSkus] = useLocalState<Sku[]>('tools:stock:skus', [])
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', stock: 0, threshold: 10 })
  const [copied, setCopied] = useState(false)

  const low = skus.filter((s) => s.stock <= s.threshold)

  const digest = () =>
    [
      `Low stock alert — ${new Date().toLocaleDateString('en-IN')}`,
      '',
      ...low.map((s) => `• ${s.name}: ${s.stock} left (threshold ${s.threshold})`),
    ].join('\n')

  const copyDigest = async () => {
    try {
      await navigator.clipboard.writeText(digest())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy your low-stock digest:', digest())
    }
  }

  const setStock = (id: string, stock: number) =>
    setSkus((prev) => prev.map((s) => (s.id === id ? { ...s, stock } : s)))
  const setThreshold = (id: string, threshold: number) =>
    setSkus((prev) => prev.map((s) => (s.id === id ? { ...s, threshold } : s)))

  return (
    <div className="space-y-8">
      {low.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-amber-900">
              {low.length} product{low.length === 1 ? '' : 's'} at or below threshold
            </p>
            <button onClick={copyDigest}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy digest'}
            </button>
          </div>
          <ul className="mt-2 text-sm text-amber-900">
            {low.map((s) => (
              <li key={s.id}>
                {s.name}: <strong>{s.stock}</strong> left
              </li>
            ))}
          </ul>
        </div>
      )}

      {adding ? (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-5">
          <div className="min-w-40 flex-1">
            <Field label="Product / SKU">
              <input className={inputClass} value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
          </div>
          <Field label="In stock">
            <input type="number" min={0} className={inputClass} value={draft.stock}
              onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} />
          </Field>
          <Field label="Alert below">
            <input type="number" min={0} className={inputClass} value={draft.threshold}
              onChange={(e) => setDraft({ ...draft, threshold: Number(e.target.value) })} />
          </Field>
          <button
            onClick={() => {
              setSkus((prev) => [...prev, { id: `s_${Date.now().toString(36)}`, ...draft }])
              setDraft({ name: '', stock: 0, threshold: 10 })
              setAdding(false)
            }}
            disabled={!draft.name}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
            Add
          </button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md">
          <Plus size={14} /> Track a product
        </button>
      )}

      {skus.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Product</th>
                <th className="px-4 py-2.5 text-right font-medium">In stock</th>
                <th className="px-4 py-2.5 text-right font-medium">Alert below</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {skus.map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2 font-medium text-text-primary">{s.name}</td>
                  <td className="px-4 py-2 text-right">
                    <input type="number" min={0} value={s.stock}
                      className="w-20 rounded border border-border bg-white px-2 py-1 text-right text-sm focus:border-accent focus:outline-none"
                      onChange={(e) => setStock(s.id, Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input type="number" min={0} value={s.threshold}
                      className="w-20 rounded border border-border bg-white px-2 py-1 text-right text-sm focus:border-accent focus:outline-none"
                      onChange={(e) => setThreshold(s.id, Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {s.stock <= s.threshold ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Low</span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">OK</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => setSkus((prev) => prev.filter((x) => x.id !== s.id))}
                      className="p-1 text-text-muted hover:text-red-600" aria-label="Remove product">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Add products with a stock count and an alert threshold. Update counts as
          you sell; anything at or below its threshold surfaces at the top.
          Automatic daily email digests arrive with accounts (coming soon).
        </p>
      )}
    </div>
  )
}
