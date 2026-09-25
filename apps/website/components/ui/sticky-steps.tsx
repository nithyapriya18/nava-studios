'use client'

import { useEffect, useRef, useState } from 'react'
import type { NineStep } from '@/lib/nine'

/**
 * Steps scroll on the left while the card on the right stays put and
 * changes to match the step in the middle of the screen. On phones the
 * card is hidden and each step shows its own number.
 */
export function StickySteps({ steps }: { steps: NineStep[] }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const step = steps[active]

  return (
    <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
      <ol>
        {steps.map((s, i) => (
          <li
            key={s.n}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-index={i}
            className={`border-t border-border py-8 transition-opacity duration-300 md:min-h-[min(42vh,400px)] md:py-10 ${
              i === active ? 'md:opacity-100' : 'md:opacity-40'
            }`}
          >
            <p className="font-sans text-sm text-accent">
              <span className="tabular-nums">{String(s.n).padStart(2, '0')}</span> {s.verb}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-text-primary">{s.title}</h3>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="hidden md:block">
        <div className="theme-dark sticky top-32 overflow-hidden rounded-[2rem] p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#006278]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#012987]/60 blur-3xl" />
          <div className="relative">
            <p className="font-sans text-sm text-text-muted">
              Step {step.n} of {steps.length}
            </p>
            <p
              key={step.n}
              className="reveal-word text-grad mt-6 font-sans text-[7rem] font-bold leading-none tracking-[-0.05em] tabular-nums"
            >
              {String(step.n).padStart(2, '0')}
            </p>
            <p className="mt-6 font-sans text-3xl font-semibold text-text-primary">{step.verb}</p>
            <div className="mt-10 flex gap-1.5" aria-hidden>
              {steps.map((s, i) => (
                <span
                  key={s.n}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= active ? 'bg-[#57e0b8]' : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
