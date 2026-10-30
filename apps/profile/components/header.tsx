'use client'

import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrackedLink } from '@/components/tracked-link'
import { siteConfig } from '@/config'

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Clear over the intro, frosted once you scroll. A marigold line along its
 * bottom edge fills with your progress down the page (--p, set by ScrollFx),
 * and the section you're reading is marked.
 */
export function Header() {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 24)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(SECTIONS[SECTIONS.length - 1].id)
      }
    }
    // A section counts as current once its top passes the upper third of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target.id)
        if (seen.length) setActive(seen[seen.length - 1])
      },
      { rootMargin: '0px 0px -66% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className={`top${solid ? ' solid' : ''}`}>
      <div className="top-bar">
        <a href="#top" className="brand" aria-label={`${siteConfig.name}, back to top`}>
          <span className="mono-mark" aria-hidden>
            NV
          </span>
          <span className="brand-name">{siteConfig.short}</span>
        </a>
        <nav className="top-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
        <div className="top-actions">
          <ThemeToggle />
          <TrackedLink
            href={siteConfig.resumeFile}
            download
            event="resume_downloaded"
            properties={{ location: 'header' }}
            className="btn btn-primary btn-sm"
          >
            Resume
          </TrackedLink>
        </div>
      </div>
      <span className="progress" aria-hidden />
    </header>
  )
}
