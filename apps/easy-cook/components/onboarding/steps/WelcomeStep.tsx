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

export function WelcomeStep({ prefs, onChange, onNext }: Props) {
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

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">When do you want to start?</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={prefs.planStartDate ?? new Date().toISOString().split('T')[0]}
            onChange={(e) => onChange({ planStartDate: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
          <p className="text-xs text-text-muted">Day 1 of your meal plan. Defaults to today.</p>
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
