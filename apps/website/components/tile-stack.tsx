'use client'

import { useEffect, useRef, type ReactNode } from 'react'

const TOP = 76 // where tiles pin, just under the floating nav

/**
 * Sections as a deck of tiles: each `.tile` child pins as it reaches the top
 * and the next slides up over it, while the covered tile recedes and fades
 * away, so only one tile is ever in view under the nav. A tile
 * taller than the screen pins by its bottom edge, so all of it is seen
 * before it's covered.
 */
export function TileStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const tiles = Array.from(root.querySelectorAll<HTMLElement>(':scope > .tile'))
    const pins: number[] = []

    // Where each tile pins depends on its height, so it's set from JS.
    const layout = () => {
      const vh = window.innerHeight
      tiles.forEach((tile, i) => {
        const pin = Math.min(TOP, vh - tile.offsetHeight)
        pins[i] = pin
        tile.style.top = `${pin}px`
      })
      update()
    }

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      tiles.forEach((tile, i) => {
        const next = tiles[i + 1]
        let cover = 0
        if (next) {
          const pinned = tile.getBoundingClientRect().top <= pins[i] + 1
          if (pinned) {
            const nextTop = next.getBoundingClientRect().top
            cover = Math.min(1, Math.max(0, (vh - nextTop) / (vh * 0.8)))
          }
        }
        tile.style.setProperty('--cover', cover.toFixed(3))
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const resize = new ResizeObserver(layout)
    tiles.forEach((tile) => resize.observe(tile))
    window.addEventListener('resize', layout)
    window.addEventListener('scroll', onScroll, { passive: true })
    layout()
    return () => {
      resize.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="tiles">
      {children}
    </div>
  )
}
