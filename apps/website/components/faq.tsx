'use client'

import { useState } from 'react'

/** One answer open at a time; the first starts open. Answers slide open, shadcn Accordion style. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="faq">
      {items.map((item, i) => {
        const expanded = open === i
        return (
          <div key={item.q} className="faq-item">
            <h3>
              <button
                type="button"
                className="faq-q"
                aria-expanded={expanded}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
              >
                <span>{item.q}</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M9 3.5v11M3.5 9h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div className="faq-panel" data-open={expanded || undefined}>
              <div>
                <p id={`faq-${i}`} className="faq-a">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
