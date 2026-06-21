'use client'

import { StepCard } from '@/components/ui/StepCard'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { SpiceSlider } from '@/components/ui/SpiceSlider'
import { Button } from '@/components/ui/Button'
import { COMMON_ALLERGENS, DIET_TYPE_LABELS } from '@/lib/types'
import type { Member, UserPreferences, DietType, SpiceLevel } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
  onBack: () => void
}

const DIET_OPTIONS = (Object.entries(DIET_TYPE_LABELS) as [DietType, string][]).map(
  ([value, label]) => ({ value, label })
)

const ALLERGEN_OPTIONS = COMMON_ALLERGENS.map((a) => ({ value: a, label: a }))

export function DietaryStep({ prefs, onChange, onNext, onBack }: Props) {
  const members = prefs.members ?? []

  function updateMember(idx: number, updates: Partial<Member>) {
    const next = members.map((m, i) => (i === idx ? { ...m, ...updates } : m))
    onChange({ members: next })
  }

  return (
    <StepCard
      title="Dietary preferences"
      subtitle="Set the diet type, spice level, and allergies for each person."
    >
      <div className="space-y-6">
        {members.map((member, idx) => (
          <div key={member.id} className="rounded-xl border border-border bg-white p-4 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">
              {member.name || `Person ${idx + 1}`}
            </h3>

            <ChipSelect
              label="Diet type"
              options={DIET_OPTIONS}
              selected={[member.dietType]}
              multi={false}
              onChange={([v]) => updateMember(idx, { dietType: v as DietType })}
            />

            <SpiceSlider
              label="Spice tolerance"
              value={member.spiceLevel}
              onChange={(v) => updateMember(idx, { spiceLevel: v as SpiceLevel })}
            />

            <ChipSelect
              label="Allergies (select all that apply)"
              options={ALLERGEN_OPTIONS}
              selected={member.allergies}
              onChange={(v) => updateMember(idx, { allergies: v })}
            />
          </div>
        ))}

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
          <Button className="flex-1" onClick={onNext}>
            Continue →
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
