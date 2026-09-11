'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { contactHref, contactLabel, contactIsExternal } from '@/config'
import { Logo } from '@/components/logo'

const navLinks = [
  { href: '/lab', label: 'Lab' },
  { href: '/about', label: 'About' },
  { href: '/writing', label: 'Writing' },
]

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? 'bg-background/95 border-b border-border' : 'bg-background'
      }`}
    >
      <div className="max-w-layout mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Logo size={40} />

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-text-primary ${
                pathname.startsWith(link.href)
                  ? 'text-text-primary font-medium'
                  : 'text-text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={contactHref}
            {...(contactIsExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="btn-primary"
          >
            {contactLabel}
          </Link>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-text-muted hover:text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-text-primary/20 z-30"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-background border-l border-border z-40 flex flex-col p-8 gap-1"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 text-lg border-b border-border ${
                    pathname.startsWith(link.href)
                      ? 'text-text-primary font-medium'
                      : 'text-text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={contactHref}
                {...(contactIsExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="btn-primary mt-6 w-full"
              >
                {contactLabel}
              </Link>
              <Link
                href="/start"
                className="mt-3 block text-center py-3 text-sm text-text-muted"
              >
                How an engagement works
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
