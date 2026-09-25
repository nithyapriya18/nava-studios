'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { CRESCENT } from '@/components/logo'

export interface TimelineStep {
  n: number
  verb: string
  title: string
  body: string
}

/**
 * The nine steps as a scroll timeline. Adapted from Aceternity's Timeline:
 * a line fills as you scroll, and each marker is one bead from the Nava
 * mark, at the same size it has in the logo, so the fifth step (Build) is
 * the largest.
 */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const [height, setHeight] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const update = () => setHeight(el.getBoundingClientRect().height)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 65%', 'end 65%'],
  })
  const beam = useTransform(scrollYProgress, [0, 1], [0, height])

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[11px] top-3 w-px bg-border"
        style={{ height: Math.max(height - 24, 0) }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 w-px bg-accent"
          style={{ height: reduce ? '100%' : beam }}
        />
      </div>

      <ol ref={listRef} className="relative">
        {steps.map((step, i) => (
          <Step
            key={step.n}
            step={step}
            index={i}
            total={steps.length}
            progress={scrollYProgress}
            lit={!!reduce}
          />
        ))}
      </ol>
    </div>
  )
}

function Step({
  step,
  index,
  total,
  progress,
  lit,
}: {
  step: TimelineStep
  index: number
  total: number
  progress: MotionValue<number>
  lit: boolean
}) {
  const at = total > 1 ? index / (total - 1) : 0
  const fill = useTransform(progress, [Math.max(at - 0.04, 0), at], [0, 1])
  const size = Math.round((CRESCENT[index]?.r ?? 3) * 3.2)

  return (
    <li className="relative grid grid-cols-[24px_1fr] gap-x-6 pb-12 last:pb-0 md:gap-x-10">
      <span className="relative flex h-7 items-center justify-center" aria-hidden>
        <span
          className="block rounded-full bg-bead ring-4 ring-background"
          style={{ width: size, height: size }}
        />
        <motion.span
          className="absolute rounded-full bg-accent"
          style={{ width: size, height: size, opacity: lit ? 1 : fill }}
        />
      </span>

      <div className="grid gap-x-10 md:grid-cols-[10rem_1fr]">
        <h3 className="flex items-baseline gap-3 text-2xl font-semibold text-text-primary">
          <span className="text-sm font-medium tabular-nums text-text-muted">
            {step.n}
          </span>
          {step.verb}
        </h3>
        <div className="mt-2 md:mt-1">
          <p className="font-sans text-lg font-medium text-text-primary">{step.title}</p>
          <p className="mt-2 max-w-xl leading-relaxed text-text-muted">{step.body}</p>
        </div>
      </div>
    </li>
  )
}
