'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { AudioPlayer } from './AudioPlayer'
import { NightSky } from '@/components/brand/NightSky'
import type { AudioStatus, Story } from '@/lib/types'

interface StoryViewProps {
  story: Story
}

/** Small ✦ · ✦ ornament between the title block and the story body. */
function Ornament() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3 text-amber/60">
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14l-1.4-5.6L0 7l5.6-1.4Z" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14l-1.4-5.6L0 7l5.6-1.4Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function Reader({ story }: { story: Story }) {
  return (
    <article className="animate-fade-in">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
          A story for {story.childName}
        </p>
        <h1 className="mx-auto mt-3 max-w-lg font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
          {story.title}
        </h1>
        <div className="mt-6">
          <Ornament />
        </div>
      </header>
      <div className="story-body mx-auto mt-10 max-w-prose space-y-6">
        {story.storyText
          .split(/\n\s*\n/)
          .filter((p) => p.trim())
          .map((paragraph, i) => (
            <p key={i} className="font-display text-lg leading-[1.85] text-star sm:text-xl">
              {paragraph.trim()}
            </p>
          ))}
      </div>
    </article>
  )
}

export function StoryView({ story }: StoryViewProps) {
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(story.audioStatus)
  const [showText, setShowText] = useState(false)
  const requested = useRef(false)

  const audioUrl = `/api/audio/${story.id}`
  const wantsAudio = story.deliveryMode !== 'text'

  // Polls the story record until narration leaves 'pending' — used when our own
  // POST loses the atomic claim to a concurrent request (409) so we still learn
  // when that other request finishes rather than showing a false failure.
  const pollUntilSettled = useCallback(async () => {
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise((r) => setTimeout(r, 2000))
      try {
        const res = await fetch(`/api/stories/${story.id}`)
        if (!res.ok) continue
        const latest: Story = await res.json()
        if (latest.audioStatus === 'ready' || latest.audioStatus === 'failed') {
          setAudioStatus(latest.audioStatus)
          return
        }
      } catch {
        // transient — keep polling
      }
    }
    setAudioStatus('failed')
  }, [story.id])

  const requestAudio = useCallback(async () => {
    setAudioStatus('pending')
    try {
      const res = await fetch(`/api/stories/${story.id}/audio`, { method: 'POST' })
      if (res.status === 409) {
        void pollUntilSettled()
        return
      }
      if (!res.ok) throw new Error(`Narration failed (${res.status})`)
      setAudioStatus('ready')
    } catch (err) {
      console.error('[StoryView] narration request failed:', err)
      setAudioStatus('failed')
    }
  }, [story.id, pollUntilSettled])

  // Fire narration in the background on mount for audio modes, unless it's
  // already ready or in flight.
  useEffect(() => {
    if (!wantsAudio || requested.current) return
    if (story.audioStatus === 'ready' || story.audioStatus === 'pending') return
    requested.current = true
    void requestAudio()
  }, [wantsAudio, story.audioStatus, requestAudio])

  const playerState =
    audioStatus === 'ready' ? (
      <AudioPlayer src={audioUrl} large={story.deliveryMode === 'audio'} />
    ) : audioStatus === 'failed' ? (
      <div className="flex items-center justify-center gap-3">
        <p className="text-sm text-danger">Narration failed.</p>
        <button
          type="button"
          onClick={() => void requestAudio()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:border-amber hover:text-candle"
        >
          <RotateCcw size={12} /> Retry
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-center gap-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber/20 border-t-amber" />
        <p className="text-sm text-text-muted">Preparing narration…</p>
      </div>
    )

  // ------- audio-only: calm full-bleed player -------
  if (story.deliveryMode === 'audio') {
    return (
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-night px-4 py-8">
        <NightSky variant="quiet" className="h-[420px]" />

        {/* Ambient candlelight glow (pulse disabled under prefers-reduced-motion) */}
        <div
          aria-hidden
          className="animate-pulse-slow pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/10 blur-3xl"
        />

        <div className="relative mx-auto flex w-full max-w-content flex-1 flex-col">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center gap-10 py-16 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                A story for {story.childName}
              </p>
              <h1 className="mx-auto mt-3 max-w-md font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
                {story.title}
              </h1>
            </div>

            <div className="w-full max-w-md">{playerState}</div>

            <button
              type="button"
              onClick={() => setShowText((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              {showText ? <EyeOff size={14} /> : <Eye size={14} />}
              {showText ? 'Hide text' : 'Show text'}
            </button>
          </div>

          {showText && (
            <div className="pb-16">
              <Reader story={story} />
            </div>
          )}
        </div>
      </main>
    )
  }

  // ------- text / text-audio: reader layout -------
  return (
    <main className="relative mx-auto w-full max-w-content px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} /> Home
      </Link>

      <div className={`mt-10 ${story.deliveryMode === 'text-audio' ? 'pb-32' : 'pb-16'}`}>
        <Reader story={story} />
      </div>

      {story.deliveryMode === 'text-audio' && (
        <div className="fixed inset-x-0 bottom-0 px-3 pb-3">
          <div className="mx-auto max-w-content rounded-2xl border border-border bg-night-surface/95 px-4 py-3 shadow-card backdrop-blur">
            {playerState}
          </div>
        </div>
      )}
    </main>
  )
}
