'use client'

import type { AnchorHTMLAttributes } from 'react'
import { track } from '@/lib/analytics'

/**
 * A plain link that also records a named PostHog event when clicked, so
 * resume downloads, LinkedIn visits and email clicks are easy to find.
 */
export function TrackedLink({
  event,
  properties,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string
  properties?: Record<string, unknown>
}) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, properties)
        onClick?.(e)
      }}
    />
  )
}
