import type { ReactNode } from 'react'

interface StepCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function StepCard({ title, subtitle, children }: StepCardProps) {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h2 className="font-display text-[1.7rem] font-semibold leading-snug text-text-primary">
          {title}
        </h2>
        {subtitle && <p className="text-sm leading-relaxed text-text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
