'use client'

import { StepCard } from '@/components/ui/StepCard'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Button } from '@/components/ui/Button'
import { CUISINES } from '@/lib/types'
import type { UserPreferences } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
  onBack: () => void
}

const CUISINE_OPTIONS = CUISINES.map((c) => ({ value: c, label: c }))

const MEALS_PER_DAY_OPTIONS = [
  { value: '2', label: '2 meals', description: 'Lunch + Dinner' },
  { value: '3', label: '3 meals', description: 'Breakfast + Lunch + Dinner' },
  { value: '4', label: '4 meals', description: '3 meals + Snack' },
]

export function CuisineStep({ prefs, onChange, onNext, onBack }: Props) {
  const selected = prefs.cuisinePreferences ?? []
  const mealCount = prefs.mealsPerDay ?? 3

  return (
    <StepCard
      title="Cuisine & meal preferences"
      subtitle="Pick the cuisines your household enjoys. Select multiple!"
    >
      <div className="space-y-6">
        <ChipSelect
          label="Favourite cuisines (pick at least one)"
          options={CUISINE_OPTIONS}
          selected={selected}
          onChange={(v) => onChange({ cuisinePreferences: v })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Meals per day</label>
          <div className="grid grid-cols-3 gap-2">
            {MEALS_PER_DAY_OPTIONS.map((opt) => {
              const active = mealCount === Number(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ mealsPerDay: Number(opt.value) as 2 | 3 | 4 })}
                  className={`
                    rounded-xl border p-3 text-left transition-all
                    ${
                      active
                        ? 'bg-accent-light border-accent'
                        : 'bg-white border-border hover:border-accent/40'
                    }
                  `}
                >
                  <p className={`text-sm font-semibold ${active ? 'text-accent' : 'text-text-primary'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{opt.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
          <Button
            className="flex-1"
            onClick={onNext}
            disabled={selected.length === 0}
          >
            Continue →
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
