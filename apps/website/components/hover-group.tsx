'use client'

import { useRef, useState, type MouseEvent, type ReactNode } from 'react'

/**
 * Aceternity's Card Hover Effect, without a motion library: one soft wash
 * slides to whichever item (matched by `items`) is under the pointer, like
 * the highlight in the nav. It wraps the list, so lists keep valid markup.
 */
export function HoverGroup({
  items,
  bleed = 0,
  children,
}: {
  items: string
  /** How far the wash reaches past the item's sides, for rows without padding. */
  bleed?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number; slide: boolean } | null>(null)

  const onMove = (e: MouseEvent) => {
    const root = ref.current
    const el = (e.target as HTMLElement).closest(items)
    if (!root || !el || !root.contains(el)) return
    const r = el.getBoundingClientRect()
    const o = root.getBoundingClientRect()
    // Fade in where the pointer enters; slide only between items.
    setBox((prev) => ({
      x: r.left - o.left - bleed,
      y: r.top - o.top,
      w: r.width + bleed * 2,
      h: r.height,
      slide: prev !== null,
    }))
  }

  return (
    <div ref={ref} className="hover-group" onMouseOver={onMove} onMouseLeave={() => setBox(null)}>
      <span
        className="hover-wash"
        aria-hidden
        style={
          box
            ? {
                transform: `translate(${box.x}px, ${box.y}px)`,
                width: box.w,
                height: box.h,
                opacity: 1,
                transitionProperty: box.slide ? 'opacity, transform, width, height' : 'opacity',
              }
            : { opacity: 0 }
        }
      />
      {children}
    </div>
  )
}
