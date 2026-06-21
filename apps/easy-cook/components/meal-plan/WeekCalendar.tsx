'use client'

import { useState } from 'react'
import { MealCard } from './MealCard'
import type { DayPlan } from '@/lib/types'

interface SwappingMeal { dayIndex: number; mealType: string }

interface WeekCalendarProps {
  days: DayPlan[]
  mealsPerDay: number
  onSwap?: (dayIndex: number, mealType: string, reason: string) => void
  swappingMeal?: SwappingMeal | null
}

export function WeekCalendar({ days, mealsPerDay, onSwap, swappingMeal }: WeekCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const activeDay = selectedDay !== null ? days[selectedDay] : null

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
          return (
            <button
              key={day.dayName}
              type="button"
              onClick={() => setSelectedDay(isActive ? null : idx)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MealCard
              meal={activeDay.meals.breakfast}
              onSwap={makeSwapHandler(activeDay.dayIndex, 'breakfast')}
              swapping={isSwapping(activeDay.dayIndex, 'breakfast')}
            />
            <MealCard
              meal={activeDay.meals.lunch}
              onSwap={makeSwapHandler(activeDay.dayIndex, 'lunch')}
              swapping={isSwapping(activeDay.dayIndex, 'lunch')}
            />
            <MealCard
              meal={activeDay.meals.dinner}
              onSwap={makeSwapHandler(activeDay.dayIndex, 'dinner')}
              swapping={isSwapping(activeDay.dayIndex, 'dinner')}
            />
            {activeDay.meals.snack && (
              <MealCard
                meal={activeDay.meals.snack}
                onSwap={makeSwapHandler(activeDay.dayIndex, 'snack')}
                swapping={isSwapping(activeDay.dayIndex, 'snack')}
              />
            )}
          </div>
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
