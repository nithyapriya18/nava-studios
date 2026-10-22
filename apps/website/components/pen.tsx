import type { ReactNode } from 'react'

/*
 * The margin layer: the four pen marks from the brand guidelines. One mark per
 * screen view, and only where it points at something true. `draw` animates
 * the stroke on once; leave it off for marks inside the demo.
 */

const CIRCLE =
  'M30 52 C 18 30, 70 8, 130 9 C 195 10, 236 26, 230 46 C 224 66, 160 74, 104 72 C 50 70, 8 58, 14 38 C 20 22, 60 12, 96 10'

/** Marigold circle, for the one word a hero headline is about. */
export function PenCircle({ children, draw = false }: { children: ReactNode; draw?: boolean }) {
  return (
    <span className="pen-o">
      {children}
      <svg className={draw ? 'draw' : undefined} viewBox="0 0 240 80" preserveAspectRatio="none" aria-hidden>
        <path pathLength={1} d={CIRCLE} fill="none" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/** Marigold underline, for a promise. One section heading per page. */
export function PenUnderline({ children, draw = false }: { children: ReactNode; draw?: boolean }) {
  return (
    <span className="pen-u">
      {children}
      <svg className={draw ? 'draw' : undefined} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
        <path
          pathLength={1}
          d="M2 8 C 40 3, 80 11, 120 6 S 180 4, 198 7"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

/** Sindoor strike-through, for what waits until later. Rare. */
export function PenStrike({ children }: { children: ReactNode }) {
  return (
    <span className="pen-x">
      {children}
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
        <path d="M2 6 C 30 3, 60 7, 98 4" fill="none" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/** A handwritten aside with a small arrow. Under eight words. */
export function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`note ${className}`}>
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden>
        <path
          d="M24 15 C 16 15, 9 11, 4 5 M4 5 L 4 12 M4 5 L 11 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </p>
  )
}

export function Arrow() {
  return (
    <span className="arr" aria-hidden>
      →
    </span>
  )
}

export function Tick({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
