'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { contactHref, contactLabel, contactIsExternal } from '@/config'
import { reviewHref } from '@/lib/products'
import { Wordmark } from '@/components/wordmark'

const links = [
  { href: '/start', label: 'How it works' },
  { href: reviewHref, label: 'Free review' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
]

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Wordmark />
        <nav className="nav" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a href={contactHref} className="btn-primary btn-sm" {...ctaProps}>
          {contactLabel}
        </a>
        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav id="menu" className="sheet" aria-label="Menu">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
          <a href={contactHref} className="btn btn-primary" {...ctaProps}>
            {contactLabel}
          </a>
        </nav>
      )}
    </header>
  )
}
