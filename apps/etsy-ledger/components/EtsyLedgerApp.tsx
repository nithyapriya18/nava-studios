'use client'

import { useMemo, useState } from 'react'
import { Copy, Check, Upload } from 'lucide-react'
import { inputClass } from '@nava-studios/kit'

/**
 * Parses Etsy statement CSVs ("Payment account" / monthly statement exports).
 * Tolerant by design: finds Type/Amount-ish columns wherever they are and
 * categorizes rows by keywords, so minor format changes don't break it.
 */

interface Row {
  type: string
  title: string
  amount: number
}

type Category =
  | 'Sales'
  | 'Refunds'
  | 'Listing fees'
  | 'Transaction fees'
  | 'Processing fees'
  | 'Marketing & Etsy Ads'
  | 'Shipping'
  | 'Taxes collected/remitted'
  | 'Other'

const CATEGORY_ORDER: Category[] = [
  'Sales',
  'Refunds',
  'Listing fees',
  'Transaction fees',
  'Processing fees',
  'Marketing & Etsy Ads',
  'Shipping',
  'Taxes collected/remitted',
  'Other',
]

function categorize(type: string, title: string): Category {
  const t = `${type} ${title}`.toLowerCase()
  if (t.includes('refund')) return 'Refunds'
  if (t.includes('listing fee') || t.includes('listing')) return 'Listing fees'
  if (t.includes('transaction')) return 'Transaction fees'
  if (t.includes('processing') || t.includes('payment fee')) return 'Processing fees'
  if (t.includes('etsy ads') || t.includes('marketing') || t.includes('offsite ads'))
    return 'Marketing & Etsy Ads'
  if (t.includes('shipping') || t.includes('postage')) return 'Shipping'
  if (t.includes('tax') || t.includes('vat') || t.includes('gst'))
    return 'Taxes collected/remitted'
  if (t.includes('sale') || t.includes('order') || t.includes('deposit')) return 'Sales'
  if (t.includes('fee')) return 'Other'
  return 'Other'
}

/** Minimal CSV parser that respects quoted fields (Etsy titles contain commas). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((c) => c.trim() !== '')) rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  row.push(field)
  if (row.some((c) => c.trim() !== '')) rows.push(row)
  return rows
}

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.()-]/g, '')
  if (!cleaned) return NaN
  // Etsy shows charges like "-US$0.20" or "($0.20)"
  const negative = cleaned.includes('(') || cleaned.startsWith('-')
  const n = Number(cleaned.replace(/[()-]/g, ''))
  return negative ? -n : n
}

function extractRows(csv: string): { rows: Row[]; error?: string } {
  const table = parseCsv(csv)
  if (table.length < 2) return { rows: [], error: 'Not enough rows — paste the full CSV including the header line.' }
  const header = table[0].map((h) => h.trim().toLowerCase())
  const typeIdx = header.findIndex((h) => h === 'type' || h.includes('type'))
  const titleIdx = header.findIndex((h) => h.includes('title') || h.includes('info') || h.includes('description'))
  // Prefer Net, then Amount
  let amtIdx = header.findIndex((h) => h === 'net' || h.includes('net'))
  if (amtIdx === -1) amtIdx = header.findIndex((h) => h.includes('amount'))
  if (typeIdx === -1 || amtIdx === -1)
    return { rows: [], error: 'Could not find "Type" and "Amount/Net" columns. Use Etsy’s payment account CSV export.' }

  const rows: Row[] = []
  for (const r of table.slice(1)) {
    const amount = parseAmount(r[amtIdx] ?? '')
    if (Number.isNaN(amount)) continue
    rows.push({
      type: (r[typeIdx] ?? '').trim(),
      title: titleIdx >= 0 ? (r[titleIdx] ?? '').trim() : '',
      amount,
    })
  }
  return rows.length ? { rows } : { rows: [], error: 'No usable rows found in that CSV.' }
}

function money(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export function EtsyLedgerApp() {
  const [csv, setCsv] = useState('')
  const [copied, setCopied] = useState(false)

  const { rows, error } = useMemo(() => (csv.trim() ? extractRows(csv) : { rows: [] }), [csv])

  const summary = useMemo(() => {
    const byCategory = new Map<Category, number>()
    for (const r of rows) {
      const cat = categorize(r.type, r.title)
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + r.amount)
    }
    const income = [...byCategory.entries()]
      .filter(([, v]) => v > 0)
      .reduce((s, [, v]) => s + v, 0)
    const costs = [...byCategory.entries()]
      .filter(([, v]) => v < 0)
      .reduce((s, [, v]) => s + v, 0)
    return { byCategory, income, costs, net: income + costs }
  }, [rows])

  const taxSummary = () =>
    [
      `Etsy shop summary (${rows.length} rows)`,
      ...CATEGORY_ORDER.filter((c) => summary.byCategory.has(c)).map(
        (c) => `${c}: ${money(summary.byCategory.get(c)!)}`,
      ),
      `— Total in: ${money(summary.income)}`,
      `— Total out: ${money(summary.costs)}`,
      `— Net: ${money(summary.net)}`,
    ].join('\n')

  const onFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setCsv(String(reader.result ?? ''))
    reader.readAsText(file)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-text-muted">
          In Etsy: <em>Finances → Payment account → Monthly statement → Download CSV</em>.
          Upload or paste it here — it never leaves your browser.
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent">
          <Upload size={14} /> Upload CSV
          <input
            type="file" accept=".csv,text/csv" className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </label>
        <textarea
          rows={5}
          className={inputClass}
          placeholder="…or paste the CSV contents here, header line included"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {rows.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-text-muted">Money in</p>
              <p className="mt-1 font-display text-2xl font-semibold text-text-primary">
                {money(summary.income)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-text-muted">Fees & costs</p>
              <p className="mt-1 font-display text-2xl font-semibold text-red-600">
                {money(summary.costs)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-text-muted">Real profit</p>
              <p className={`mt-1 font-display text-2xl font-semibold ${summary.net >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {money(summary.net)}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_ORDER.filter((c) => summary.byCategory.has(c)).map((c) => {
                  const v = summary.byCategory.get(c)!
                  return (
                    <tr key={c} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 text-text-primary">{c}</td>
                      <td className={`px-4 py-2.5 text-right ${v < 0 ? 'text-red-600' : 'text-text-primary'}`}>
                        {money(v)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(taxSummary())
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              } catch {
                window.prompt('Copy your summary:', taxSummary())
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy summary for your accountant'}
          </button>
        </>
      )}
    </div>
  )
}
