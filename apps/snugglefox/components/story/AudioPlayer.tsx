'use client'

import { useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  large?: boolean
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({ src, large = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play()
    } else {
      audio.pause()
    }
  }

  function seek(value: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const buttonSize = large ? 'h-24 w-24' : 'h-12 w-12'
  const iconSize = large ? 36 : 20
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  const playButton = (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={playing ? 'Pause narration' : 'Play narration'}
      className={`${buttonSize} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-candle to-amber text-night shadow-candle transition-all hover:from-amber hover:to-amber-dark hover:shadow-candle-lg`}
    >
      {playing ? <Pause size={iconSize} /> : <Play size={iconSize} className="ml-0.5" />}
    </button>
  )

  return (
    <div className={`flex w-full items-center gap-4 ${large ? 'flex-col gap-8' : ''}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />

      {large ? (
        // Centerpiece play button with layered candlelight glow
        <div className="relative">
          <div
            aria-hidden
            className="animate-pulse-slow pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/10"
          />
          {playButton}
        </div>
      ) : (
        playButton
      )}

      <div className={`flex min-w-0 flex-1 items-center gap-3 ${large ? 'w-full' : ''}`}>
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-text-muted">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          className="scrub w-full cursor-pointer"
          style={{ ['--progress' as string]: `${progress}%` }}
        />
        <span className="w-10 shrink-0 text-xs tabular-nums text-text-muted">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}
