'use client'

import { useState } from 'react'
import { NINE } from '@/lib/nine'

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill="none">
      <path
        d="M3 13 L13 3 M13 3 H6 M13 3 V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NineBoard() {
  const [active, setActive] = useState(0)
  const step = NINE[active]

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 items-start">
      <div>
        <div className="grid grid-cols-3 gap-1.5">
          {NINE.map((s, i) => {
            const on = i === active
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                aria-label={`Step ${s.n}: ${s.verb}. ${s.title}`}
                className={`min-h-[4.5rem] sm:min-h-[5.25rem] rounded-xl border px-2.5 py-2 text-left flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  on
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-background text-text-primary hover:border-text-primary'
                }`}
              >
                <span className={`text-[10px] tabular-nums ${on ? 'text-white/80' : 'text-text-muted'}`}>
                  {String(s.n).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium inline-flex items-center gap-1">
                  {s.arrow ? <ArrowIcon className="w-3.5 h-3.5" /> : null}
                  {s.verb}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-sm text-text-muted leading-relaxed">
          Left to right. The ninth step is Continue: keep this running, or start the next piece of work.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 md:p-8 min-h-[14rem]">
        <p className="text-sm font-medium text-accent mb-2 tabular-nums">
          {String(step.n).padStart(2, '0')}
          {step.arrow ? ' · arrow' : ''}
        </p>
        <h3 className="text-2xl font-medium text-text-primary mb-2">{step.verb}</h3>
        <p className="text-lg text-text-primary mb-4">{step.title}</p>
        <p className="text-base leading-relaxed text-text-muted">{step.body}</p>
      </div>
    </div>
  )
}
