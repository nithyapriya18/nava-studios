'use client'

import { useState } from 'react'
import { MealCard } from './MealCard'
import type { DayPlan } from '@/lib/types'

interface SwappingMeal { dayIndex: number; mealType: string }

interface MealTimes { breakfast: string; lunch: string; dinner: string; snack?: string }

interface WeekCalendarProps {
  days: DayPlan[]
  mealsPerDay: number
  startDate?: string
  mealTimes?: MealTimes
  onSwap?: (dayIndex: number, mealType: string, reason: string) => void
  swappingMeal?: SwappingMeal | null
  onMealClick?: (dayIndex: number, mealType: string) => void
}

function getNextMeal(mealTimes?: MealTimes): string | null {
  if (!mealTimes) return null
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const meals = ['breakfast', 'lunch', 'dinner', 'snack'].filter((m) => mealTimes[m as keyof MealTimes])
  const toMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  // find the next meal that hasn't passed yet (within 30 min grace)
  const upcoming = meals.find((m) => toMins(mealTimes[m as keyof MealTimes]!) >= nowMins - 30)
  return upcoming ?? null
}

export function WeekCalendar({ days, mealsPerDay, startDate, mealTimes, onSwap, swappingMeal, onMealClick }: WeekCalendarProps) {
  // Default to today's day index if it falls within this plan's range
  const defaultDay = (() => {
    if (!startDate) return 0
    const todayIso = new Date().toISOString().split('T')[0]
    const idx = days.findIndex((d) => d.date === todayIso)
    return idx >= 0 ? idx : 0
  })()

  const [selectedDay, setSelectedDay] = useState<number>(defaultDay)
  const activeDay = days[selectedDay]
  const isToday = selectedDay === defaultDay
  const nextMeal = isToday ? getNextMeal(mealTimes) : null

  function makeSwapHandler(dayIndex: number, mealType: string) {
    return onSwap ? (reason: string) => onSwap(dayIndex, mealType, reason) : undefined
  }

  function isSwapping(dayIndex: number, mealType: string) {
    return swappingMeal?.dayIndex === dayIndex && swappingMeal?.mealType === mealType
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, idx) => {
          const isActive = selectedDay === idx
          const dateLabel = day.date
            ? new Date(day.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
            : ''
          return (
            <button
              key={day.dayName}
              type="button"
              onClick={() => setSelectedDay(idx)}
              className={`
                rounded-xl border p-2 text-center transition-all
                ${
                  isActive
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-white border-border hover:border-accent/40 text-text-primary'
                }
              `}
            >
              <p className="text-xs font-medium">{day.dayName.slice(0, 3)}</p>
              {dateLabel && <p className={`text-[10px] mt-0.5 ${isActive ? 'text-white/70' : 'text-text-muted'}`}>{dateLabel}</p>}
              <div className="mt-1.5 flex flex-col gap-0.5 items-center">
                {(['breakfast', 'lunch', 'dinner'] as const).map((type) => (
                  <div
                    key={type}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-white/60' : {
                        breakfast: 'bg-warning',
                        lunch: 'bg-success',
                        dinner: 'bg-accent',
                      }[type]
                    }`}
                  />
                ))}
                {mealsPerDay >= 4 && day.meals.snack && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/40' : 'bg-border'}`}
                  />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {activeDay ? (
        <div className="animate-slide-up space-y-3">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            {activeDay.dayName}
          </h3>
          {nextMeal && (
            <p className="text-xs font-medium text-accent flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
              Next up: {nextMeal.charAt(0).toUpperCase() + nextMeal.slice(1)}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['breakfast', 'lunch', 'dinner'] as const).map((type) => (
              <div key={type} className={nextMeal === type ? 'ring-2 ring-accent rounded-xl' : ''}>
                <MealCard
                  meal={activeDay.meals[type]}
                  onSwap={makeSwapHandler(activeDay.dayIndex, type)}
                  swapping={isSwapping(activeDay.dayIndex, type)}
                  onClick={onMealClick ? () => onMealClick(activeDay.dayIndex, type) : undefined}
                />
              </div>
            ))}
            {activeDay.meals.snack && (
              <div className={nextMeal === 'snack' ? 'ring-2 ring-accent rounded-xl' : ''}>
                <MealCard
                  meal={activeDay.meals.snack}
                  onSwap={makeSwapHandler(activeDay.dayIndex, 'snack')}
                  swapping={isSwapping(activeDay.dayIndex, 'snack')}
                  onClick={onMealClick ? () => onMealClick(activeDay.dayIndex, 'snack') : undefined}
                />
              </div>
            )}
          </div>

          {/* Day prep notes */}
          {activeDay.prepNotes && activeDay.prepNotes.length > 0 && (
            <div className="rounded-xl border border-warning/30 bg-warning-light px-4 py-3 space-y-1.5">
              <p className="text-xs font-semibold text-warning uppercase tracking-wide">Tonight — prep for tomorrow</p>
              <ul className="space-y-1">
                {activeDay.prepNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                    <span className="text-warning mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tomorrow's ingredients shopping list */}
          {(() => {
            const tomorrow = days[selectedDay + 1]
            if (!tomorrow) return null
            const allIng = Object.values(tomorrow.meals as unknown as Record<string, { ingredients: { name: string; quantity: string; unit: string }[] }>)
              .flatMap((m) => m?.ingredients ?? [])
            if (allIng.length === 0) return null
            return (
              <div className="rounded-xl border border-border bg-white px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                  Ingredients needed for {tomorrow.dayName}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {allIng.map((ing, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-1 text-xs">
                      <span className="text-text-primary truncate">{ing.name}</span>
                      <span className="text-text-muted shrink-0">{ing.quantity} {ing.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-text-muted">
            Select a day above to see the full meal breakdown
          </p>
        </div>
      )}
    </div>
  )
}
