'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { NightSky } from '@/components/brand/NightSky'
import { GeneratingScene } from './GeneratingScene'
import { ChildStep } from './steps/ChildStep'
import { ScenarioStep } from './steps/ScenarioStep'
import { DeliveryStep } from './steps/DeliveryStep'
import type { IntakePrefs, Story } from '@/lib/types'
import { getOrCreateDeviceId } from '@/lib/device'

const STEP_NAMES = ['The hero', 'The adventure', 'The telling']

const TOTAL_STEPS = 3
const PREFS_KEY = 'nava-studios:snugglefox.prefs'
const LEGACY_PREFS_KEY = 'snugglefox.prefs'

const DEFAULT_PREFS: IntakePrefs = {
  childName: '',
  gender: null,
  ageBand: null,
  prompt: '',
  lengthKey: 'medium',
  deliveryMode: 'text-audio',
  voiceKey: null,
}

// Exported so each step component checks the exact same rule the Enter-key
// handler below uses for its own button's disabled state — two copies of this
// drifting apart would let Enter advance past a field the button blocks on.
export function stepIsValid(step: number, prefs: IntakePrefs): boolean {
  switch (step) {
    case 0:
      return prefs.childName.trim().length > 0 && prefs.gender !== null && prefs.ageBand !== null
    case 1:
      return prefs.prompt.trim().length > 0
    case 2:
      return prefs.deliveryMode === 'text' || prefs.voiceKey !== null
    default:
      return false
  }
}

export function IntakeWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [prefs, setPrefs] = useState<IntakePrefs>(DEFAULT_PREFS)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Bootstrap deviceId + restore saved prefs (not the scenario prompt — that's
  // fresh every night).
  useEffect(() => {
    getOrCreateDeviceId()
    try {
      const saved = localStorage.getItem(PREFS_KEY) ?? localStorage.getItem(LEGACY_PREFS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<IntakePrefs>
        setPrefs((prev) => ({ ...prev, ...parsed, prompt: '' }))
      }
    } catch {
      // corrupted prefs — start fresh
    }
  }, [])

  const update = useCallback((updates: Partial<IntakePrefs>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...updates }
      const { prompt: _prompt, ...persisted } = merged
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(persisted))
      } catch {
        // storage full/unavailable — non-fatal
      }
      return merged
    })
  }, [])

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const finish = useCallback(async () => {
    if (!stepIsValid(2, prefs) || !prefs.ageBand) return
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getOrCreateDeviceId(),
          childName: prefs.childName.trim(),
          gender: prefs.gender,
          ageBand: prefs.ageBand,
          prompt: prefs.prompt.trim(),
          lengthKey: prefs.lengthKey,
          deliveryMode: prefs.deliveryMode,
          voiceKey: prefs.deliveryMode === 'text' ? undefined : prefs.voiceKey,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Server error ${res.status}`)
      }

      const story: Story = await res.json()
      router.push(`/story/${story.id}`)
    } catch (err) {
      console.error('[IntakeWizard] story generation failed:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setGenerating(false)
    }
  }, [prefs, router])

  // Enter key → advance (skip textareas/buttons/selects)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter' || generating) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'SELECT') return
      e.preventDefault()
      if (!stepIsValid(step, prefs)) return
      if (step === TOTAL_STEPS - 1) finish()
      else next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [step, prefs, generating, next, finish])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-night">
      <NightSky variant="quiet" className="h-[360px]" />

      <div className="relative flex flex-1 flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-content space-y-7">
          <Link href="/" className="inline-flex w-fit" aria-label="Snugglefox home">
            <BrandLogo size="sm" />
          </Link>

          {/* Named progress steps */}
          <div
            className="flex items-center justify-center gap-1.5 sm:gap-2"
            aria-label={`Step ${step + 1} of ${TOTAL_STEPS}: ${STEP_NAMES[step]}`}
          >
            {STEP_NAMES.map((name, i) => (
              <div key={name} className="flex items-center gap-1.5 sm:gap-2">
                {i > 0 && (
                  <span
                    aria-hidden
                    className={`h-px w-5 transition-colors sm:w-8 ${
                      i <= step ? 'bg-amber/60' : 'bg-border'
                    }`}
                  />
                )}
                <span
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    i === step
                      ? 'font-semibold text-candle'
                      : i < step
                        ? 'text-text-muted'
                        : 'text-text-muted/50'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      i === step
                        ? 'bg-candle shadow-candle'
                        : i < step
                          ? 'bg-amber/70'
                          : 'bg-night-surface-2'
                    }`}
                  />
                  {name}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-night-surface/90 p-6 shadow-card backdrop-blur-sm sm:p-8">
            {generating ? (
              <GeneratingScene childName={prefs.childName} />
            ) : (
              <>
                {error && (
                  <div className="mb-5 rounded-xl border border-danger/50 bg-danger-light px-4 py-3">
                    <p className="text-sm font-medium text-danger">Could not create the story</p>
                    <p className="mt-0.5 text-xs text-danger/80">{error}</p>
                  </div>
                )}
                {/* Keyed on step so the slide-in transition replays on every step change */}
                <div key={step} className="animate-step-in">
                  {step === 0 && <ChildStep prefs={prefs} onChange={update} onNext={next} />}
                  {step === 1 && (
                    <ScenarioStep prefs={prefs} onChange={update} onNext={next} onBack={back} />
                  )}
                  {step === 2 && (
                    <DeliveryStep prefs={prefs} onChange={update} onNext={finish} onBack={back} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
