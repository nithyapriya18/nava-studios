'use client'

import { StepCard } from '@/components/ui/StepCard'
import { Button } from '@/components/ui/Button'
import type { UserPreferences } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  mealsPerDay: number
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
  onBack: () => void
}

const DEFAULTS = {
  breakfast: '08:00',
  lunch: '13:00',
  dinner: '20:00',
  snack: '16:30',
}

const MEAL_LABELS: Record<string, { label: string; emoji: string; hint: string }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅', hint: 'Morning meal' },
  lunch:     { label: 'Lunch',     emoji: '☀️',  hint: 'Midday meal' },
  dinner:    { label: 'Dinner',    emoji: '🌙', hint: 'Evening meal' },
  snack:     { label: 'Snack',     emoji: '🍎', hint: 'Afternoon snack' },
}

function to12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function MealTimesStep({ prefs, mealsPerDay, onChange, onNext, onBack }: Props) {
  const times = prefs.mealTimes ?? {
    breakfast: DEFAULTS.breakfast,
    lunch: DEFAULTS.lunch,
    dinner: DEFAULTS.dinner,
    ...(mealsPerDay >= 4 ? { snack: DEFAULTS.snack } : {}),
  }

  const mealKeys = mealsPerDay >= 4
    ? ['breakfast', 'lunch', 'dinner', 'snack']
    : ['breakfast', 'lunch', 'dinner']

  function setTime(meal: string, value: string) {
    onChange({ mealTimes: { ...times, [meal]: value } as UserPreferences['mealTimes'] })
  }

  return (
    <StepCard
      title="When do you eat?"
      subtitle="We'll use these times to highlight your next upcoming meal and remind you to start cooking."
    >
      <div className="space-y-4">
        {mealKeys.map((meal) => {
          const info = MEAL_LABELS[meal]
          const value = (times as Record<string, string>)[meal] ?? DEFAULTS[meal as keyof typeof DEFAULTS]
          return (
            <div key={meal} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{info.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{info.label}</p>
                  <p className="text-xs text-text-muted">{info.hint}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">{to12h(value)}</span>
                <input
                  type="time"
                  value={value}
                  onChange={(e) => setTime(meal, e.target.value)}
                  className="rounded-lg border border-border px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
              </div>
            </div>
          )
        })}

        <p className="text-xs text-text-muted text-center">
          You can change these anytime from Settings.
        </p>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onBack}>← Back</Button>
          <Button className="flex-1" onClick={onNext}>Next →</Button>
        </div>
      </div>
    </StepCard>
  )
}
