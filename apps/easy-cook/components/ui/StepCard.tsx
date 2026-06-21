'use client'

interface StepCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function StepCard({ title, subtitle, children }: StepCardProps) {
  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
