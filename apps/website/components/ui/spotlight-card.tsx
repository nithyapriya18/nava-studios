'use client'

import type { PointerEvent, ReactNode } from 'react'

/** A card with a soft glow that follows the pointer. Styles live in globals.css. */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={`spotlight rounded-3xl border border-border bg-card transition-colors duration-300 hover:border-accent/40 ${className}`}
    >
      {children}
    </div>
  )
}
