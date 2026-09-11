'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { WelcomeStep } from './steps/WelcomeStep'
import { HouseholdStep } from './steps/HouseholdStep'
import { DietaryStep } from './steps/DietaryStep'
import { CuisineStep } from './steps/CuisineStep'
import { LikesDislikesStep } from './steps/LikesDislikes'
import { HealthGoalsStep } from './steps/HealthGoalsStep'
import { PantryStep } from './steps/PantryStep'
import { MealTimesStep } from './steps/MealTimesStep'
import { InstructionsStep } from './steps/InstructionsStep'
import { savePreferences, saveCurrentPlan } from '@/lib/storage'
import type { UserPreferences } from '@/lib/types'

const TOTAL_STEPS = 9

const DEFAULT_PREFS: Partial<UserPreferences> = {
  householdName: '',
  members: [],
  cuisinePreferences: [],
  pantryItems: [],
  primaryGoal: 'balanced',
  mealsPerDay: 3,
  additionalInstructions: '',
}

export function OnboardingWizard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(0)
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>(DEFAULT_PREFS)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(updates: Partial<UserPreferences>) {
    setPrefs((prev) => ({ ...prev, ...updates }))
  }

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const finish = useCallback(async () => {
    setGenerating(true)
    setError(null)

    const finalPrefs: UserPreferences = {
      householdName: prefs.householdName ?? 'My Household',
      members: prefs.members ?? [],
      cuisinePreferences: prefs.cuisinePreferences ?? [],
      pantryItems: prefs.pantryItems ?? [],
      primaryGoal: prefs.primaryGoal ?? 'balanced',
      mealsPerDay: prefs.mealsPerDay ?? 3,
      additionalInstructions: prefs.additionalInstructions?.trim() || undefined,
      planStartDate: prefs.planStartDate ?? new Date().toISOString().split('T')[0],
      planStartMeal: prefs.planStartMeal ?? 'breakfast',
      mealTimes: prefs.mealTimes ?? { breakfast: '08:00', lunch: '13:00', dinner: '20:00' },
      setupComplete: true,
      setupDate: new Date().toISOString(),
    }
    await savePreferences(finalPrefs)

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPrefs),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Server error ${res.status}`)
      }

      const plan = await res.json()
      await saveCurrentPlan(plan)
      router.push('/meal-plan')
    } catch (err) {
      console.error('[OnboardingWizard] plan generation failed:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setGenerating(false)
    }
  }, [prefs, router])

  // Enter key → trigger the dominant action (skip textareas/buttons/selects)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter' || generating) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'SELECT') return
      e.preventDefault()
      if (step === TOTAL_STEPS - 1) finish()
      else next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [step, generating, next, finish])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-white text-sm font-bold">EC</span>
              </div>
              <span className="font-display font-semibold text-text-primary">EasyCook</span>
            </div>
            {session?.user && (
              <div className="flex items-center gap-2">
                {session.user.image
                  ? <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                  : <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">{session.user.name?.[0]}</div>
                }
                <span className="text-sm text-text-muted hidden sm:block">{session.user.email}</span>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-red-500 border border-border rounded-lg px-2 py-1.5 hover:border-red-200 transition-colors"
                >
                  <LogOut size={12} /> Sign out
                </button>
              </div>
            )}
          </div>

          {step > 0 && <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />}

          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <p className="font-display text-lg text-text-primary">Crafting your meal plan…</p>
                <p className="text-sm text-text-muted text-center">
                  Claude is analysing your preferences and building a personalised week. This takes
                  about 30–60 seconds.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-700 font-medium">Could not generate plan</p>
                    <p className="text-xs text-red-600 mt-0.5">{error}</p>
                  </div>
                )}
                {step === 0 && <WelcomeStep prefs={prefs} onChange={update} onNext={next} />}
                {step === 1 && (
                  <HouseholdStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                )}
                {step === 2 && (
                  <DietaryStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                )}
                {step === 3 && (
                  <CuisineStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                )}
                {step === 4 && (
                  <LikesDislikesStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                )}
                {step === 5 && (
                  <HealthGoalsStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                )}
                {step === 6 && (
                  <PantryStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                )}
                {step === 7 && (
                  <MealTimesStep
                    prefs={prefs}
                    mealsPerDay={prefs.mealsPerDay ?? 3}
                    onChange={update}
                    onNext={next}
                    onBack={back}
                  />
                )}
                {step === 8 && (
                  <InstructionsStep prefs={prefs} onChange={update} onFinish={finish} onBack={back} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
