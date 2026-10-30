'use client'

import { useEffect, useState } from 'react'

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

/** The sidebar's table of contents; the section you're reading is marked. */
export function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el) => el !== null)
    // A section counts as current once its top passes the upper third of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target.id)
        if (seen.length) setActive(seen[seen.length - 1])
      },
      { rootMargin: '0px 0px -66% 0px' },
    )
    els.forEach((el) => io.observe(el))
    // The last section is too short to reach the upper third, so the page's end counts as it.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(SECTIONS[SECTIONS.length - 1].id)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav className="toc" aria-label="Sections">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
          {s.label}
        </a>
      ))}
    </nav>
  )
}
