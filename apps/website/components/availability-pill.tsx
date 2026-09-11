import { siteConfig } from '@/config'

export function AvailabilityPill() {
  const { available, bookedUntil } = siteConfig.availability

  if (available) {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-text-muted">
        <span className="inline-flex h-1.5 w-1.5 bg-accent" />
        Available for new work
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-text-muted">
      <span className="inline-flex h-1.5 w-1.5 bg-text-muted" />
      Booked until {bookedUntil}
    </span>
  )
}
