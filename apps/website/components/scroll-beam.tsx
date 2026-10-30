'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Aceternity's Timeline beam: a marigold line draws down the timeline as you
 * scroll, and each dot fills once the line reaches it. The list sets
 * --beam (0 to 1) for its ::after, and .passed on the items behind the line.
 */
export function ScrollBeam({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = ref.current
    if (!list) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = list.getBoundingClientRect()
      // The line's tip sits just below the middle of the screen.
      const tip = window.innerHeight * 0.6 - rect.top
      list.style.setProperty('--beam', Math.min(1, Math.max(0, tip / rect.height)).toFixed(3))
      for (const item of Array.from(list.children) as HTMLElement[]) {
        item.classList.toggle('passed', item.offsetTop + 16 <= tip)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <ol ref={ref} className={`beam ${className}`}>
      {children}
    </ol>
  )
}
