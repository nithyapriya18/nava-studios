'use client'

import { useState } from 'react'
import { Clock, Users, Flame, RefreshCw } from 'lucide-react'
import type { Meal, Micros } from '@/lib/types'

const SWAP_REASONS = ['Too spicy', 'Too complex', 'Repetitive', 'Wrong cuisine', 'Different']

interface MealCardProps {
  meal: Meal
  compact?: boolean
  onSwap?: (reason: string) => void
  swapping?: boolean
  onClick?: () => void
}

const MEAL_TYPE_COLORS = {
  breakfast: 'bg-warning-light text-warning border-warning/20',
  lunch: 'bg-success-light text-success border-success/20',
  dinner: 'bg-accent-light text-accent border-accent/20',
  snack: 'bg-surface text-text-muted border-border',
}

const MEAL_TYPE_LABEL = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

function MacroPill({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center bg-surface rounded-lg px-2 py-1.5 min-w-0">
      <span className="text-xs font-semibold text-text-primary">{Math.round(value)}{unit}</span>
      <span className="text-[10px] text-text-muted leading-tight">{label}</span>
    </div>
  )
}

function MicroRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary font-medium">{Math.round(value * 10) / 10}{unit}</span>
    </div>
  )
}

const MICRO_LABELS: { key: keyof Micros; label: string; unit: string }[] = [
  { key: 'vitaminA',   label: 'Vitamin A',   unit: 'mcg' },
  { key: 'vitaminC',   label: 'Vitamin C',   unit: 'mg'  },
  { key: 'vitaminD',   label: 'Vitamin D',   unit: 'mcg' },
  { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
  { key: 'iron',       label: 'Iron',        unit: 'mg'  },
  { key: 'calcium',    label: 'Calcium',     unit: 'mg'  },
  { key: 'potassium',  label: 'Potassium',   unit: 'mg'  },
  { key: 'sodium',     label: 'Sodium',      unit: 'mg'  },
  { key: 'zinc',       label: 'Zinc',        unit: 'mg'  },
  { key: 'magnesium',  label: 'Magnesium',   unit: 'mg'  },
  { key: 'folate',     label: 'Folate',      unit: 'mcg' },
  { key: 'omega3',     label: 'Omega-3',     unit: 'mg'  },
]

export function MealCard({ meal, compact = false, onSwap, swapping = false, onClick }: MealCardProps) {
  const [showSwapPanel, setShowSwapPanel] = useState(false)
  const totalTime = meal.prepTime + meal.cookTime
  const macros = meal.nutrition?.macros
  const micros = meal.nutrition?.micros
  const calories = macros?.calories ?? 0

  const activeMicros = micros
    ? MICRO_LABELS.filter((m) => micros[m.key] != null && (micros[m.key] as number) > 0)
    : []

  function handleSwap(reason: string) {
    setShowSwapPanel(false)
    onSwap?.(reason)
  }

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-white p-3 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{meal.name}</p>
            <p className="text-xs text-text-muted mt-0.5">{meal.cuisine}</p>
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">{totalTime}m</span>
        </div>
        {macros && (
          <div className="flex gap-2 mt-2 text-[10px] text-text-muted">
            <span>{Math.round(calories)} kcal</span>
            <span>·</span>
            <span>P {Math.round(macros.protein)}g</span>
            <span>·</span>
            <span>C {Math.round(macros.carbs)}g</span>
            <span>·</span>
            <span>F {Math.round(macros.fat)}g</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border border-border bg-white overflow-hidden transition-shadow group relative ${onClick ? 'hover:shadow-md hover:border-accent/30 cursor-pointer' : 'hover:shadow-md'}`}
      onClick={!showSwapPanel ? onClick : undefined}
    >
      {/* Loading overlay */}
      {swapping && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 rounded-xl gap-2">
          <RefreshCw size={20} className="animate-spin text-accent" />
          <p className="text-xs text-text-muted">Finding a better meal…</p>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-2 ${MEAL_TYPE_COLORS[meal.type]}`}
            >
              {MEAL_TYPE_LABEL[meal.type]}
            </span>
            <h3 className="font-display font-semibold text-text-primary leading-tight">
              {meal.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">{meal.cuisine}</p>
          </div>

          {onSwap && (
            <button
              type="button"
              onClick={() => setShowSwapPanel((v) => !v)}
              disabled={swapping}
              title="Swap this meal"
              className="shrink-0 flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors px-2 py-1 rounded-lg hover:bg-surface disabled:opacity-40"
            >
              <RefreshCw size={12} />
              Swap
            </button>
          )}
        </div>

        {/* Inline swap reason picker */}
        {showSwapPanel && onSwap && (
          <div className="rounded-lg bg-surface border border-border p-3 space-y-2 animate-fade-in">
            <p className="text-xs font-medium text-text-muted">Why swap?</p>
            <div className="flex flex-wrap gap-1.5">
              {SWAP_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleSwap(reason)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-white hover:border-accent hover:text-accent transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted leading-relaxed">{meal.description}</p>

        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Flame size={11} />
            {Math.round(calories)} kcal
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            Serves {meal.servings}
          </span>
        </div>

        {meal.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {meal.allergens.map((a) => (
              <span
                key={a}
                className="text-xs bg-red-50 text-red-500 border border-red-100 rounded px-1.5 py-0.5"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Macros */}
      {macros && (
        <div className="border-t border-border px-4 py-3 bg-surface/50 space-y-3">
          <div>
            <p className="text-xs font-medium text-text-muted mb-2">Macronutrients</p>
            <div className="grid grid-cols-5 gap-1.5">
              <MacroPill label="Protein" value={macros.protein} unit="g" />
              <MacroPill label="Carbs"   value={macros.carbs}   unit="g" />
              <MacroPill label="Fat"     value={macros.fat}     unit="g" />
              <MacroPill label="Fiber"   value={macros.fiber}   unit="g" />
              <MacroPill label="Sugar"   value={macros.sugar}   unit="g" />
            </div>
          </div>

          {activeMicros.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted mb-1.5">Micronutrients</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                {activeMicros.map(({ key, label, unit }) => (
                  <MicroRow
                    key={key}
                    label={label}
                    value={micros![key] as number}
                    unit={unit}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ingredients */}
      <div className="border-t border-border px-4 py-3 bg-surface/30">
        <p className="text-xs font-medium text-text-muted mb-1.5">Key ingredients</p>
        <p className="text-xs text-text-primary">
          {meal.ingredients
            .slice(0, 5)
            .map((i) => i.name)
            .join(', ')}
          {meal.ingredients.length > 5 && ` +${meal.ingredients.length - 5} more`}
        </p>
      </div>
    </div>
  )
}
