'use client'

import { useEffect, useRef, useState } from 'react'
import { TiltCard } from '@/components/effects'
import { TrackedLink } from '@/components/tracked-link'
import { studio } from '@/config'
import { ROLES, STUDIO } from '@/lib/profile'

const ENTRIES = [
  { org: STUDIO.org, title: STUDIO.title, dates: STUDIO.dates },
  ...ROLES.map((r) => ({ org: r.org, title: r.title, dates: r.dates })),
]

function Arrow() {
  return (
    <span className="arr" aria-hidden>
      →
    </span>
  )
}

/**
 * Aceternity's Sticky Scroll Reveal: on desktop a panel stays beside the
 * roles and shows the one in the middle of the screen, with a list of every
 * role to jump between. On phones each card carries its own heading.
 */
export function Experience() {
  const [active, setActive] = useState(0)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const cards = Array.from(list.current?.children ?? [])
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(cards.indexOf(e.target))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  const now = ENTRIES[active]
  return (
    <div className="xp">
      <aside className="xp-panel" aria-hidden>
        <span className="xp-count">
          {String(active + 1).padStart(2, '0')} <span>/ {String(ENTRIES.length).padStart(2, '0')}</span>
        </span>
        <div key={active} className="xp-now">
          <span className="xp-org">{now.org}</span>
          <span className="xp-title">{now.title}</span>
          <span className="xp-dates">{now.dates}</span>
        </div>
        <ol className="xp-index">
          {ENTRIES.map((e, i) => (
            <li key={`${e.org}-${e.title}`} data-on={i === active || undefined}>
              <a href={`#role-${i}`} tabIndex={-1}>
                {e.org}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <ol ref={list} className="xp-cards">
        <li id="role-0" className="rv">
          <TiltCard className="card venture">
            <div className="card-head">
              <div>
                <span className="eyebrow">My own company</span>
                <h3 className="card-t">
                  {STUDIO.title}, <a href={studio()}>{STUDIO.org}</a>
                </h3>
              </div>
              <span className="dates">{STUDIO.dates}</span>
            </div>
            <p className="muted">{STUDIO.body}</p>
            <div className="products">
              {STUDIO.products.map((p) => (
                <a key={p.name} href={p.href} className="product">
                  <span className="product-t">
                    {p.name} <Arrow />
                  </span>
                  <span className="muted">{p.body}</span>
                </a>
              ))}
            </div>
            <TrackedLink
              href={studio()}
              event="studio_opened"
              properties={{ location: 'experience' }}
              className="more"
            >
              Visit studionpv.com <Arrow />
            </TrackedLink>
          </TiltCard>
        </li>
        {ROLES.map((r, i) => (
          <li key={`${r.org}-${r.title}`} id={`role-${i + 1}`} className="rv">
            <article className="card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">{r.org}</span>
                  <h3 className="card-t">{r.title}</h3>
                </div>
                <span className="dates">{r.dates}</span>
              </div>
              <ul className="points">
                {r.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}
