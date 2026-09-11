import type { ProductStatus } from '@nava-studios/catalog'

const STATUS_STYLES: Record<ProductStatus, { label: string; classes: string }> = {
  live: { label: 'Live', classes: 'bg-emerald-100 text-emerald-800' },
  beta: { label: 'Beta', classes: 'bg-sky-100 text-sky-800' },
  building: { label: 'In build', classes: 'bg-amber-100 text-amber-800' },
  planned: { label: 'Planned', classes: 'bg-stone-200 text-stone-600' },
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.classes}`}
    >
      {s.label}
    </span>
  )
}
