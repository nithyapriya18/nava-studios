import type { ReactNode } from 'react'
import type { AgeBand, DeliveryMode, LengthKey, VoiceKey } from '@/lib/types'

/**
 * Tiny stroke-based motifs for the wizard's option cards. Everything inherits
 * `currentColor`, so a card can tint its glyph muted vs. candlelight-gold
 * purely with a text-color class.
 */

interface GlyphProps {
  size?: number
}

function Glyph({ size = 24, children }: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/* ---------- Age bands: a night sky that grows up with them ---------- */

const AGE_GLYPHS: Record<AgeBand, ReactNode> = {
  // Toddler — one little star
  toddler: (
    <Glyph>
      <path d="M12 4.5l1.7 5.8 5.8 1.7-5.8 1.7-1.7 5.8-1.7-5.8L4.5 12l5.8-1.7Z" />
    </Glyph>
  ),
  // Little kid — crescent moon
  'little-kid': (
    <Glyph>
      <path d="M14.5 3.5a9 9 0 1 0 6 13.5 9.5 9.5 0 0 1-6-13.5Z" />
    </Glyph>
  ),
  // Big kid — shooting star
  'big-kid': (
    <Glyph>
      <path d="M16.8 6.2l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" />
      <path d="M3.5 8.5h5.5M2.5 12.5h4.5M3.5 16.5h5.5" />
    </Glyph>
  ),
  // Tween — a constellation of their own
  tween: (
    <Glyph>
      <path d="M4.5 18l5.5-5 4 2.5 5.5-9" />
      <circle cx="4.5" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
    </Glyph>
  ),
}

export function AgeGlyph({ band }: { band: AgeBand }) {
  return <>{AGE_GLYPHS[band]}</>
}

/* ---------- Story lengths: candles burning taller ---------- */

function Candle({ top }: { top: number }) {
  // Candle body from `top` down to the base line, flame floating above it.
  const flameBase = top - 1.5
  return (
    <Glyph>
      <path d={`M12 ${flameBase - 4.4} c1.6 2.2 0.9 4 0 4 s-1.6 -1.8 0 -4 Z`} />
      <rect x="9.25" y={top} width="5.5" height={19.5 - top} rx="1.2" />
      <path d="M6 19.5h12" />
    </Glyph>
  )
}

const LENGTH_GLYPHS: Record<LengthKey, ReactNode> = {
  short: <Candle top={13.5} />,
  medium: <Candle top={10.5} />,
  long: <Candle top={7.5} />,
}

export function LengthGlyph({ length }: { length: LengthKey }) {
  return <>{LENGTH_GLYPHS[length]}</>
}

/* ---------- Delivery modes ---------- */

const DELIVERY_GLYPHS: Record<DeliveryMode, ReactNode> = {
  // Text — an open book
  text: (
    <Glyph>
      <path d="M12 6.8C10 5.2 7.4 4.7 4.5 5.2v13c2.9-.5 5.5 0 7.5 1.6 2-1.6 4.6-2.1 7.5-1.6v-13c-2.9-.5-5.5 0-7.5 1.6Z" />
      <path d="M12 6.8v13" />
    </Glyph>
  ),
  // Text + audio — open book with a small sound arc
  'text-audio': (
    <Glyph>
      <path d="M10.5 8.3c-1.7-1.4-4-1.8-6.5-1.4v11.4c2.5-.4 4.8 0 6.5 1.4 1.7-1.4 4-1.8 6.5-1.4v-4.8" />
      <path d="M10.5 8.3v11.4" />
      <path d="M16.5 3.8a5.2 5.2 0 0 1 0 6.4M18.9 2.2a8.4 8.4 0 0 1 0 9.6" />
    </Glyph>
  ),
  // Audio only — soundwave in the dark
  audio: (
    <Glyph>
      <path d="M4 10v4M8 7.5v9M12 4.5v15M16 8v8M20 10.5v3" />
    </Glyph>
  ),
}

export function DeliveryGlyph({ mode }: { mode: DeliveryMode }) {
  return <>{DELIVERY_GLYPHS[mode]}</>
}

/* ---------- Narration voices: four little characters ---------- */

const VOICE_GLYPHS: Record<VoiceKey, ReactNode> = {
  // Papa Bear — round bear, steady smile
  'papa-bear': (
    <Glyph>
      <circle cx="6.8" cy="6.8" r="2.5" />
      <circle cx="17.2" cy="6.8" r="2.5" />
      <circle cx="12" cy="13.2" r="7.3" />
      <path d="M8.2 12.6c1 1.1 2.1 1.1 3.1 0M12.7 12.6c1 1.1 2.1 1.1 3.1 0" />
      <path d="M10.5 16.4c.9.9 2.1.9 3 0" />
    </Glyph>
  ),
  // Mama Bear — softer ears, sleepy lashes, tiny heart
  'mama-bear': (
    <Glyph>
      <circle cx="7.2" cy="7.6" r="2.2" />
      <circle cx="16.8" cy="7.6" r="2.2" />
      <circle cx="12" cy="13.6" r="6.9" />
      <path d="M8.5 13c.9 1 1.9 1 2.8 0M12.7 13c.9 1 1.9 1 2.8 0" />
      <path d="M10.8 16.6c.75.7 1.65.7 2.4 0" />
      <path d="M12 2.2c.5-.9 1.9-.8 1.9.3 0 .8-1.9 1.9-1.9 1.9s-1.9-1.1-1.9-1.9c0-1.1 1.4-1.2 1.9-.3Z" />
    </Glyph>
  ),
  // Story Fox — pointed ears, bright and playful
  'story-fox': (
    <Glyph>
      <path d="M5.3 9.8 4.8 3l6 3.7" />
      <path d="M18.7 9.8 19.2 3l-6 3.7" />
      <circle cx="12" cy="13.6" r="7" />
      <path d="M8.3 12.8c.9 1 2 1 2.9 0M12.8 12.8c.9 1 2 1 2.9 0" />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none" />
    </Glyph>
  ),
  // Sleepy Owl — big closed eyes, ear tufts
  'sleepy-owl': (
    <Glyph>
      <path d="M5 8.5c0-2.8 3.1-5 7-5s7 2.2 7 5v7c0 3.6-3.1 6-7 6s-7-2.4-7-6Z" />
      <path d="M6.8 5.2 5.4 2.6M17.2 5.2l1.4-2.6" />
      <path d="M6.9 11c1.4 1.8 2.9 1.8 4.3 0M12.8 11c1.4 1.8 2.9 1.8 4.3 0" />
      <path d="M11 14.6l1 1.4 1-1.4" />
    </Glyph>
  ),
}

export function VoiceGlyph({ voice }: { voice: VoiceKey }) {
  return <>{VOICE_GLYPHS[voice]}</>
}
