'use client'

import type { ReactNode } from 'react'

interface OptionCardProps {
  label: string
  caption?: string
  /** Small decorative motif (inline SVG) shown above the label. */
  glyph?: ReactNode
  selected: boolean
  onSelect: () => void
}

export function OptionCard({ label, caption, glyph, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        selected
          ? 'border-amber/80 bg-amber-light shadow-candle'
          : 'border-border bg-night-surface-2 hover:border-amber/40 hover:bg-night-surface-2/70'
      }`}
    >
      {glyph && (
        <span
          aria-hidden
          className={`mb-2.5 block transition-colors ${selected ? 'text-candle' : 'text-text-muted'}`}
        >
          {glyph}
        </span>
      )}
      <span
        className={`block text-sm font-semibold ${selected ? 'text-candle' : 'text-text-primary'}`}
      >
        {label}
      </span>
      {caption && <span className="mt-0.5 block text-xs text-text-muted">{caption}</span>}
    </button>
  )
}
