'use client'

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

/** True where a mouse hovers and nobody asked for less motion. */
const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
 * Aceternity's Card Spotlight: a soft light follows the pointer across
 * whichever .spot card in the group it's over.
 */
export function Spotlight({
  as: Tag = 'div',
  className,
  style,
  children,
}: {
  as?: 'div' | 'dl'
  className: string
  style?: CSSProperties
  children: ReactNode
}) {
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const card = (e.target as HTMLElement).closest<HTMLElement>('.spot')
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - r.left}px`)
    card.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <Tag className={className} style={style} onPointerMove={move}>
      {children}
    </Tag>
  )
}
