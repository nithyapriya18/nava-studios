'use client'

import { StepCard } from '@/components/ui/StepCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { UserPreferences } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
}

const MEAL_OPTIONS: { value: 'breakfast' | 'lunch' | 'dinner'; label: string; hint: string }[] = [
  { value: 'breakfast', label: 'Breakfast', hint: 'Full day' },
  { value: 'lunch',     label: 'Lunch',     hint: 'Skip this morning' },
  { value: 'dinner',   label: 'Dinner',    hint: 'Just tonight' },
]

function defaultStartMeal(): 'breakfast' | 'lunch' | 'dinner' {
  const hour = new Date().getHours()
  if (hour < 11) return 'breakfast'
  if (hour < 15) return 'lunch'
  return 'dinner'
}

export function WelcomeStep({ prefs, onChange, onNext }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const selectedDate = prefs.planStartDate ?? today
  const isToday = selectedDate === today
  const selectedMeal = prefs.planStartMeal ?? (isToday ? defaultStartMeal() : 'breakfast')

  function handleDateChange(date: string) {
    const isTodayNow = date === today
    onChange({
      planStartDate: date,
      // reset to breakfast if a future date, else smart-default to current meal
      planStartMeal: isTodayNow ? defaultStartMeal() : 'breakfast',
    })
  }

  return (
    <StepCard
      title="Welcome to EasyCook"
      subtitle="Let's set up your household profile. This takes about 5 minutes and you'll never need to do it again."
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-accent-light border border-accent/20 p-4">
          <p className="text-sm text-accent font-medium">What you'll get</p>
          <ul className="mt-2 space-y-1.5 text-sm text-text-primary">
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span> Personalised 7-day meal plans
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span> Auto-generated grocery lists
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span> Pantry tracking with restock alerts
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span> Meals tailored to every family member
            </li>
          </ul>
        </div>

        <Input
          label="What should we call your household?"
          placeholder="e.g. The Sharma Family, Our Home…"
          value={prefs.householdName ?? ''}
          onChange={(e) => onChange({ householdName: e.target.value })}
        />

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">When do you want to start?</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>

          {/* Starting meal — only meaningful when starting today */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">
              Starting from which meal?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MEAL_OPTIONS.map((opt) => {
                const active = selectedMeal === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ planStartMeal: opt.value })}
                    className={`rounded-xl border px-3 py-2.5 text-center transition-all ${
                      active
                        ? 'bg-accent text-white border-accent shadow-sm'
                        : 'bg-white border-border text-text-primary hover:border-accent/40'
                    }`}
                  >
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className={`text-[10px] mt-0.5 ${active ? 'text-white/70' : 'text-text-muted'}`}>
                      {opt.hint}
                    </p>
                  </button>
                )
              })}
            </div>
            {!isToday && (
              <p className="text-xs text-text-muted">
                Starting on a future date — Day 1 will include all meals from breakfast.
              </p>
            )}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={onNext}
          disabled={!prefs.householdName?.trim()}
        >
          Let&apos;s get started →
        </Button>
      </div>
    </StepCard>
  )
}
