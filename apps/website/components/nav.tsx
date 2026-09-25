'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { contactHref, contactLabel, contactIsExternal } from '@/config'
import { Wordmark } from '@/components/wordmark'

const links = [
  { href: '/start', label: 'How it works' },
  { href: '/products', label: 'Products' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
]

/**
 * Full width at the top of the page; after a little scroll it narrows into a
 * floating pill. Adapted from Aceternity's Resizable Navbar, but animated with
 * CSS transitions so the nav (on every page) doesn't pull in a motion library.
 */
export function Nav() {
  const pathname = usePathname()
  const [floating, setFloating] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setFloating(window.scrollY > 80)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 md:px-6">
      {/* Desktop */}
      <div
        className={`mx-auto hidden items-center justify-between rounded-full py-2.5 pl-5 pr-2.5 transition-[max-width,transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:flex ${
          floating
            ? 'max-w-[760px] translate-y-1.5 bg-background/85 shadow-[0_10px_30px_-12px_rgba(33,26,27,0.18),0_0_0_1px_rgba(33,26,27,0.06)] backdrop-blur-md'
            : 'max-w-[1080px] bg-transparent'
        }`}
      >
        <Wordmark className="text-[1.3rem]" />
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-[0.9375rem] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive(link.href)
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href={contactHref} className="btn-primary ml-2 !py-2" {...ctaProps}>
            {contactLabel}
          </a>
        </nav>
      </div>

      {/* Mobile */}
      <div
        className={`flex items-center justify-between rounded-full px-4 py-2 transition-colors md:hidden ${
          floating || open
            ? 'bg-background/90 shadow-[0_0_0_1px_rgba(33,26,27,0.06)] backdrop-blur'
            : ''
        }`}
      >
        <Wordmark className="text-[1.25rem]" />
        <button
          type="button"
          className="-mr-1 rounded-full p-2 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="menu-in absolute inset-x-4 top-[4.25rem] rounded-3xl border border-border bg-background p-3 shadow-[0_20px_40px_-20px_rgba(33,26,27,0.25)] md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`block rounded-2xl px-4 py-3 text-lg ${
                isActive(link.href) ? 'bg-surface text-text-primary' : 'text-text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href={contactHref} className="btn-primary mt-2 w-full" {...ctaProps}>
            {contactLabel}
          </a>
        </nav>
      )}
    </header>
  )
}
