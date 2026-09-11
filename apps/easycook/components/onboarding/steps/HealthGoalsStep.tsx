'use client'

import { StepCard } from '@/components/ui/StepCard'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Button } from '@/components/ui/Button'
import { HEALTH_GOAL_LABELS } from '@/lib/types'
import type { Member, UserPreferences, HealthGoal } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
  onBack: () => void
}

const GOAL_OPTIONS = (Object.entries(HEALTH_GOAL_LABELS) as [HealthGoal, string][]).map(
  ([value, label]) => ({ value, label })
)

const PRIMARY_GOAL_OPTIONS = GOAL_OPTIONS.map((o) => ({
  ...o,
  description: {
    'weight-loss': 'Calorie-conscious meals',
    'muscle-gain': 'High protein, higher calories',
    balanced: 'A bit of everything',
    'high-protein': 'Extra protein every meal',
    'low-carb': 'Fewer grains and starches',
    'heart-healthy': 'Low saturated fat, high fibre',
  }[o.value as HealthGoal],
}))

export function HealthGoalsStep({ prefs, onChange, onNext, onBack }: Props) {
  const members = prefs.members ?? []
  const primaryGoal = prefs.primaryGoal ?? 'balanced'

  function updateMember(idx: number, updates: Partial<Member>) {
    const next = members.map((m, i) => (i === idx ? { ...m, ...updates } : m))
    onChange({ members: next })
  }

  return (
    <StepCard
      title="Health goals"
      subtitle="What matters most for your household? We'll weight the meal plan accordingly."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Primary household goal</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRIMARY_GOAL_OPTIONS.map((opt) => {
              const active = primaryGoal === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ primaryGoal: opt.value as HealthGoal })}
                  className={`
                    rounded-xl border p-3 text-left transition-all
                    ${
                      active
                        ? 'bg-accent-light border-accent'
                        : 'bg-white border-border hover:border-accent/40'
                    }
                  `}
                >
                  <p className={`text-sm font-semibold ${active ? 'text-accent' : 'text-text-primary'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{opt.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <p className="text-sm font-medium text-text-primary">Individual goals (optional)</p>
          {members.map((member, idx) => (
            <div key={member.id} className="space-y-2">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wide">
                {member.name || `Person ${idx + 1}`}
              </p>
              <ChipSelect
                options={GOAL_OPTIONS}
                selected={member.healthGoals}
                onChange={(v) => updateMember(idx, { healthGoals: v as HealthGoal[] })}
              />
            </div>
          ))}
        </div>

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
