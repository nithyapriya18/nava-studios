'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { FoxMark } from '@/components/brand/FoxMark'
import { CrescentMoon, NightSky } from '@/components/brand/NightSky'
import type { Story } from '@/lib/types'

const DEVICE_ID_KEY = 'snugglefox.deviceId'

function formatDate(value: Story['createdAt']): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function modeLabel(mode: Story['deliveryMode']): string {
  return mode === 'text' ? 'Text' : mode === 'audio' ? 'Audio' : 'Text + Audio'
}

export default function HomePage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const deviceId = localStorage.getItem(DEVICE_ID_KEY)
    if (!deviceId) {
      setLoading(false)
      return
    }
    fetch(`/api/stories?deviceId=${encodeURIComponent(deviceId)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: Story[]) => setStories(Array.isArray(rows) ? rows : []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Night-sky hero backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px]">
        <div className="absolute inset-0 bg-gradient-to-b from-night-surface/60 to-transparent" />
        <NightSky variant="hero" />
        <CrescentMoon
          size={84}
          className="absolute right-[8%] top-16 sm:right-[14%] sm:top-20"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-content flex-1 flex-col px-4 py-8">
        <header>
          <BrandLogo />
        </header>

        {/* Hero */}
        <section className="mt-16 text-center sm:mt-20">
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Bedtime stories,
            <br />
            made just for them
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-text-muted">
            Tell us tonight&rsquo;s idea — a construction site, a coral reef, a castle in the
            clouds — and we&rsquo;ll weave a story starring your child.
          </p>
          <Link
            href="/new"
            className="mt-8 inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-gradient-to-b from-candle to-amber px-8 py-3.5 text-[15px] font-semibold text-night shadow-candle-lg transition-all hover:from-amber hover:to-amber-dark"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15 6.4 9.6 1 8l5.4-1.6Z"
                fill="currentColor"
              />
            </svg>
            Tonight&rsquo;s story
          </Link>
        </section>

        {/* Recent stories */}
        <section className="mt-20 flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Recent stories
          </h2>

          {loading ? (
            <p className="mt-5 text-sm text-text-muted">Loading…</p>
          ) : stories.length === 0 ? (
            <div className="mt-5 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-night-surface/50 px-6 py-12 text-center">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/10 blur-xl"
                />
                <FoxMark size={52} className="relative opacity-90" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-text-primary">
                  The bookshelf is still empty
                </p>
                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-text-muted">
                  Tonight&rsquo;s the night for the first one — the fox is ready when you are.
                </p>
              </div>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {stories.map((story) => (
                <li key={story.id}>
                  <Link
                    href={`/story/${story.id}`}
                    className="group relative block overflow-hidden rounded-2xl border border-border bg-night-surface p-4 pl-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-candle"
                  >
                    {/* Book-spine accent */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-candle/80 via-terracotta/70 to-terracotta/40"
                    />
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-[17px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-candle">
                        {story.title}
                      </span>
                      <span className="shrink-0 text-xs text-text-muted">
                        {formatDate(story.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-text-muted">
                      For {story.childName}
                      <span aria-hidden className="mx-1.5 text-border">
                        ✦
                      </span>
                      {modeLabel(story.deliveryMode)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer credit */}
        <footer className="mt-16 pb-2 pt-8 text-center">
          <p className="text-xs tracking-wide text-text-muted/60">
            made with care by{' '}
            <span className="font-display font-medium text-text-muted/80">Verity Studio</span>
          </p>
        </footer>
      </div>
    </main>
  )
}
