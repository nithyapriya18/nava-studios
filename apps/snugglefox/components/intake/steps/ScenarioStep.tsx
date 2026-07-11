'use client'

import { Button } from '@/components/ui/Button'
import { StepCard } from '@/components/ui/StepCard'
import type { IntakePrefs } from '@/lib/types'

interface ScenarioStepProps {
  prefs: IntakePrefs
  onChange: (updates: Partial<IntakePrefs>) => void
  onNext: () => void
  onBack: () => void
}

const EXAMPLE_CHIPS = [
  'A day as the boss of a construction site, driving the big crane',
  'Exploring a glowing coral reef with a friendly baby whale',
  'A moonlight picnic on a cloud with talking stars',
]

export function ScenarioStep({ prefs, onChange, onNext, onBack }: ScenarioStepProps) {
  const valid = prefs.prompt.trim().length > 0

  return (
    <StepCard
      title="What's tonight's story about?"
      subtitle="Anything goes — a place they love, a dream they mentioned, a silly idea."
    >
      <textarea
        value={prefs.prompt}
        onChange={(e) => onChange({ prompt: e.target.value })}
        placeholder='e.g. "Maurya spends the day at a construction site and helps the crane operator save the day"'
        rows={5}
        autoFocus
        className="w-full resize-none rounded-xl border border-border bg-night-surface-2 px-4 py-3.5 leading-relaxed text-text-primary transition-colors placeholder:text-text-muted/60 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/40"
      />

      <div className="space-y-2.5">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-text-muted">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14l-1.4-5.6L0 7l5.6-1.4Z" fill="currentColor" />
          </svg>
          Need a spark?
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_CHIPS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange({ prompt: example })}
              className="rounded-full border border-border bg-night-surface-2 px-3.5 py-2 text-left text-xs leading-snug text-text-muted transition-colors hover:border-amber/60 hover:text-candle"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!valid}>
          Next
        </Button>
      </div>
    </StepCard>
  )
}
