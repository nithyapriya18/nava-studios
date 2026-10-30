'use client'

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'

/** True where a mouse hovers and nobody asked for less motion. */
const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Aceternity's Timeline: a gradient beam draws down the rail as you scroll,
 * and each role's dot lights up once the beam reaches it. The list sets
 * --beam (0 to 1) for its ::after, and .passed on the items behind the tip.
 */
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = ref.current
    if (!list) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = list.getBoundingClientRect()
      const tip = window.innerHeight * 0.55 - rect.top
      list.style.setProperty('--beam', Math.min(1, Math.max(0, tip / rect.height)).toFixed(3))
      for (const item of Array.from(list.children) as HTMLElement[]) {
        item.classList.toggle('passed', item.offsetTop + 12 <= tip)
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
    <ol ref={ref} className="tline">
      {children}
    </ol>
  )
}

/**
 * Aceternity's 3D Card Effect: the card leans towards the pointer, and the
 * cards inside it lift off its surface.
 */
export function TiltCard({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse' || !canHover()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`
    el.dataset.tilt = ''
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    delete el.dataset.tilt
  }

  return (
    <div className="tilt-stage">
      <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
        {children}
      </div>
    </div>
  )
}

/**
 * Aceternity's Card Spotlight: a soft marigold light follows the pointer
 * across whichever card in the group it's over.
 */
export function Spotlight({ className, children }: { className: string; children: ReactNode }) {
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const card = (e.target as HTMLElement).closest<HTMLElement>('.spot')
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - r.left}px`)
    card.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <dl className={className} onPointerMove={move}>
      {children}
    </dl>
  )
}
