'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * A section that pins while the next one slides up over it, the way Apple's
 * product pages feel. A section taller than the screen pins by its bottom
 * edge, so all of its content is seen before it's covered.
 *
 * The pin point is worked out against 100svh, the screen height with the
 * phone's address bar showing. Unlike window.innerHeight, that doesn't change
 * as the bar slides in and out while scrolling, so sections don't jump.
 */
export function StackSection({
  children,
  dark = false,
  first = false,
  className = '',
  id,
}: {
  children: ReactNode
  dark?: boolean
  first?: boolean
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      style={{ top: height ? `min(0px, calc(100svh - ${height}px))` : 0 }}
      className={`sticky ${dark ? 'theme-dark' : 'bg-background'} ${
        first
          ? ''
          : 'rounded-t-[1.75rem] shadow-[0_-16px_32px_-18px_rgba(6,13,31,0.35)] md:rounded-t-[2.5rem] md:shadow-[0_-24px_48px_-24px_rgba(6,13,31,0.35)]'
      } ${className}`}
    >
      {children}
    </section>
  )
}
