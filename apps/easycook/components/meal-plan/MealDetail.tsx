'use client'

import { useState } from 'react'
import { X, Clock, Flame, Users, ChefHat, CheckCircle, RefreshCw } from 'lucide-react'
import type { Meal } from '@/lib/types'

const MEAL_TYPE_COLORS = {
  breakfast: 'bg-warning-light text-warning border-warning/20',
  lunch: 'bg-success-light text-success border-success/20',
  dinner: 'bg-accent-light text-accent border-accent/20',
  snack: 'bg-surface text-text-muted border-border',
}

const MEAL_TYPE_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' }

interface MealDetailProps {
  meal: Meal
  dayName: string
  onClose: () => void
  onMarkCooked?: () => Promise<void>
}

export function MealDetail({ meal, dayName, onClose, onMarkCooked }: MealDetailProps) {
  const macros = meal.nutrition?.macros
  const totalTime = meal.prepTime + meal.cookTime
  const [cooked, setCooked] = useState(false)
  const [marking, setMarking] = useState(false)
  const [instructions, setInstructions] = useState<string[]>(meal.instructions ?? [])
  const [loadingInstructions, setLoadingInstructions] = useState(false)
  const [instructionsError, setInstructionsError] = useState<string | null>(null)

  async function handleMarkCooked() {
    if (!onMarkCooked || cooked) return
    setMarking(true)
    await onMarkCooked()
    setCooked(true)
    setMarking(false)
  }

  async function loadInstructions() {
    setLoadingInstructions(true)
    setInstructionsError(null)
    try {
      const res = await fetch('/api/generate-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: meal.name,
          ingredients: meal.ingredients,
          servings: meal.servings,
          cuisine: meal.cuisine,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setInstructions(data.instructions ?? [])
    } catch {
      setInstructionsError('Could not load recipe. Try again.')
    } finally {
      setLoadingInstructions(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div>
            <p className="text-xs text-text-muted mb-1">{dayName}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${MEAL_TYPE_COLORS[meal.type]}`}>
                {MEAL_TYPE_LABEL[meal.type]}
              </span>
              <span className="text-xs text-text-muted">{meal.cuisine}</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-text-primary mt-1">{meal.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Meta row */}
          <div className="flex items-center gap-5 text-sm text-text-muted">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {totalTime} min</span>
            <span className="flex items-center gap-1.5"><Flame size={14} /> {Math.round(macros?.calories ?? 0)} kcal</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> Serves {meal.servings}</span>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">{meal.description}</p>

          {/* Sides / serving note */}
          {meal.sides && (
            <div className="flex items-start gap-2 rounded-xl bg-success-light border border-success/20 px-4 py-3">
              <span className="text-success mt-0.5">🍽</span>
              <p className="text-sm text-text-primary font-medium">{meal.sides}</p>
            </div>
          )}

          {/* Allergens */}
          {meal.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meal.allergens.map((a) => (
                <span key={a} className="text-xs bg-red-50 text-red-500 border border-red-100 rounded-full px-2.5 py-0.5">
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
              Ingredients (serves {meal.servings})
            </h3>
            <div className="rounded-xl border border-border overflow-hidden">
              {meal.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${i !== 0 ? 'border-t border-border' : ''}`}
                >
                  <span className="text-text-primary">{ing.name}</span>
                  <span className="text-text-muted font-medium">{ing.quantity} {ing.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Macros */}
          {macros && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
                Nutrition (per serving)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: 'Calories', value: macros.calories, unit: 'kcal' },
                  { label: 'Protein',  value: macros.protein,  unit: 'g' },
                  { label: 'Carbs',    value: macros.carbs,    unit: 'g' },
                  { label: 'Fat',      value: macros.fat,      unit: 'g' },
                  { label: 'Fiber',    value: macros.fiber,    unit: 'g' },
                  { label: 'Sugar',    value: macros.sugar,    unit: 'g' },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="flex flex-col items-center bg-surface rounded-lg px-2 py-2">
                    <span className="text-sm font-semibold text-text-primary">{Math.round(value)}{unit}</span>
                    <span className="text-[10px] text-text-muted mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cooking instructions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3 flex items-center gap-1.5">
              <ChefHat size={12} /> How to make
            </h3>
            {instructions.length > 0 ? (
              <ol className="space-y-3">
                {instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-text-primary leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="rounded-xl border border-border p-4 text-center space-y-3">
                {instructionsError && (
                  <p className="text-xs text-red-500">{instructionsError}</p>
                )}
                <button
                  type="button"
                  onClick={loadInstructions}
                  disabled={loadingInstructions}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors"
                >
                  <RefreshCw size={13} className={loadingInstructions ? 'animate-spin' : ''} />
                  {loadingInstructions ? 'Loading recipe…' : 'Load recipe'}
                </button>
              </div>
            )}
          </div>

          {/* Mark as cooked */}
          {onMarkCooked && (
            <button
              type="button"
              onClick={handleMarkCooked}
              disabled={cooked || marking}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all ${
                cooked
                  ? 'bg-success-light text-success border border-success/30 cursor-default'
                  : 'bg-accent text-white hover:bg-accent/90 active:scale-[0.98]'
              }`}
            >
              <CheckCircle size={16} />
              {cooked ? 'Marked as cooked — pantry updated' : marking ? 'Updating pantry…' : 'Mark as cooked'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
