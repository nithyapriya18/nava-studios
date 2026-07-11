'use client'

import { AGE_BANDS, GENDERS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { OptionCard } from '@/components/ui/OptionCard'
import { StepCard } from '@/components/ui/StepCard'
import { stepIsValid } from '@/components/intake/IntakeWizard'
import { AgeGlyph } from '@/components/intake/glyphs'
import type { IntakePrefs } from '@/lib/types'

interface ChildStepProps {
  prefs: IntakePrefs
  onChange: (updates: Partial<IntakePrefs>) => void
  onNext: () => void
}

export function ChildStep({ prefs, onChange, onNext }: ChildStepProps) {
  const valid = stepIsValid(0, prefs)

  return (
    <StepCard title="Who's the story for?" subtitle="They'll be the hero of tonight's story.">
      <div className="space-y-2">
        <label htmlFor="child-name" className="text-sm font-medium text-text-primary">
          Child&rsquo;s name
        </label>
        <input
          id="child-name"
          type="text"
          value={prefs.childName}
          onChange={(e) => onChange({ childName: e.target.value })}
          placeholder="e.g. Maurya"
          autoFocus
          className="w-full rounded-xl border border-border bg-night-surface-2 px-4 py-3.5 text-text-primary transition-colors placeholder:text-text-muted/60 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/40"
        />
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-text-primary">Tonight&rsquo;s hero is a…</p>
        <div className="grid grid-cols-2 gap-3">
          {GENDERS.map((g) => (
            <OptionCard
              key={g.key}
              label={g.label}
              selected={prefs.gender === g.key}
              onSelect={() => onChange({ gender: g.key })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-text-primary">How old are they?</p>
        <div className="grid grid-cols-2 gap-3">
          {AGE_BANDS.map((band) => (
            <OptionCard
              key={band.key}
              label={band.label}
              caption={`Ages ${band.range}`}
              glyph={<AgeGlyph band={band.key} />}
              selected={prefs.ageBand === band.key}
              onSelect={() => onChange({ ageBand: band.key })}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!valid}>
          Next
        </Button>
      </div>
    </StepCard>
  )
}
