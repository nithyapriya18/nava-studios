'use client'

import { SPICE_LABELS } from '@/lib/types'
import type { SpiceLevel } from '@/lib/types'

interface SpiceSliderProps {
  value: SpiceLevel
  onChange: (v: SpiceLevel) => void
  label?: string
}

const EMOJI = ['🌿', '🌶', '🌶🌶', '🌶🌶🌶', '🔥']

export function SpiceSlider({ value, onChange, label }: SpiceSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <div className="flex gap-2">
        {([1, 2, 3, 4, 5] as SpiceLevel[]).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`
              flex-1 rounded-lg border py-2 text-center text-xs font-medium transition-all
              ${
                value === level
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white border-border text-text-muted hover:border-accent/40'
              }
            `}
          >
            <span className="block text-base">{EMOJI[level - 1]}</span>
            {SPICE_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  )
}
