'use client'

const STEPS = [
  'Welcome',
  'Household',
  'Dietary',
  'Cuisines',
  'Preferences',
  'Goals',
  'Pantry',
  'Instructions',
]

interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
}

export function ProgressBar({ currentStep, totalSteps = STEPS.length }: ProgressBarProps) {
  const pct = Math.round((currentStep / (totalSteps - 1)) * 100)
  const label = STEPS[currentStep] ?? `Step ${currentStep + 1}`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
