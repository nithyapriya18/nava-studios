'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * A section that pins while the next one slides up over it, the way Apple's
 * product pages feel. A section taller than the window pins by its bottom
 * edge, so all of its content is seen before it's covered. Desktop only;
 * on phones the sections scroll normally.
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
  const [top, setTop] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight))
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      style={{ top }}
      className={`${dark ? 'theme-dark' : 'bg-background'} md:sticky ${
        first ? '' : 'md:rounded-t-[2.5rem] md:shadow-[0_-24px_48px_-24px_rgba(6,13,31,0.35)]'
      } ${className}`}
    >
      {children}
    </section>
  )
}
