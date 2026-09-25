'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

export interface HoverListItem {
  href: string
  title: string
  description: string
  meta?: string
}

/**
 * A list where a soft highlight slides to whichever item you point at or
 * tab to. Adapted from Aceternity's Card Hover Effect.
 */
export function HoverList({
  id,
  items,
  columns = 1,
}: {
  /** Unique per page, so two lists never share one highlight. */
  id: string
  items: HoverListItem[]
  columns?: 1 | 2
}) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <ul
      className={`-mx-4 grid gap-1 ${columns === 2 ? 'md:grid-cols-2' : ''}`}
      onMouseLeave={() => setActive(null)}
    >
      {items.map((item, i) => (
        <li
          key={item.href}
          className="relative"
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <AnimatePresence>
            {active === i && (
              <motion.span
                layoutId={`hover-${id}`}
                className="absolute inset-0 rounded-2xl bg-accent-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>
          <Link
            href={item.href}
            className="relative z-10 block rounded-2xl p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:p-5"
          >
            {item.meta ? (
              <p className="font-sans text-sm text-text-muted">{item.meta}</p>
            ) : null}
            <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
            <p className="mt-1.5 leading-relaxed text-text-muted">{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
