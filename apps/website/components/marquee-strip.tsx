'use client'

import { siteConfig } from '@/config'

export function MarqueeStrip() {
  const text = `Nava Studios · ${siteConfig.founder} · ${siteConfig.location} ·`
  const repeated = `${text} ${text}`

  return (
    <div className="bg-surface border-b border-border overflow-hidden py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-xs text-text-muted tracking-wide mx-8">{repeated}</span>
        <span className="text-xs text-text-muted tracking-wide mx-8" aria-hidden>
          {repeated}
        </span>
      </div>
    </div>
  )
}
