interface StarSpec {
  x: string
  y: string
  size: number
  dim: number
  bright: number
  dur: string
  delay: string
}

// Deterministic star field (no Math.random — keeps SSR/client markup identical).
const STARS: StarSpec[] = [
  { x: '6%', y: '14%', size: 2, dim: 0.35, bright: 0.9, dur: '5.5s', delay: '0s' },
  { x: '15%', y: '38%', size: 1.5, dim: 0.2, bright: 0.7, dur: '7s', delay: '1.2s' },
  { x: '22%', y: '8%', size: 2.5, dim: 0.4, bright: 1, dur: '4.5s', delay: '2.1s' },
  { x: '31%', y: '26%', size: 1.5, dim: 0.25, bright: 0.65, dur: '6.5s', delay: '0.6s' },
  { x: '42%', y: '6%', size: 2, dim: 0.3, bright: 0.85, dur: '5s', delay: '3s' },
  { x: '52%', y: '20%', size: 1.5, dim: 0.2, bright: 0.6, dur: '8s', delay: '1.8s' },
  { x: '61%', y: '34%', size: 2, dim: 0.3, bright: 0.8, dur: '6s', delay: '4s' },
  { x: '70%', y: '10%', size: 2.5, dim: 0.4, bright: 0.95, dur: '5s', delay: '0.9s' },
  { x: '81%', y: '30%', size: 1.5, dim: 0.2, bright: 0.65, dur: '7.5s', delay: '2.6s' },
  { x: '88%', y: '7%', size: 2, dim: 0.35, bright: 0.9, dur: '4.8s', delay: '3.6s' },
  { x: '94%', y: '22%', size: 1.5, dim: 0.25, bright: 0.7, dur: '6.2s', delay: '1.5s' },
  { x: '10%', y: '55%', size: 1.5, dim: 0.18, bright: 0.55, dur: '7.2s', delay: '2.9s' },
  { x: '47%', y: '48%', size: 1.5, dim: 0.15, bright: 0.5, dur: '8.5s', delay: '0.3s' },
  { x: '86%', y: '52%', size: 1.5, dim: 0.18, bright: 0.55, dur: '6.8s', delay: '4.4s' },
]

interface NightSkyProps {
  /** quiet = fewer, dimmer stars (wizard / reader backgrounds) */
  variant?: 'hero' | 'quiet'
  className?: string
}

/**
 * Decorative, absolutely-positioned star field. Parent must be `relative`.
 * Twinkle respects prefers-reduced-motion (stars hold at their dim opacity).
 */
export function NightSky({ variant = 'hero', className = '' }: NightSkyProps) {
  const stars = variant === 'hero' ? STARS : STARS.filter((_, i) => i % 2 === 0)
  const scale = variant === 'hero' ? 1 : 0.75
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star, i) => (
        <span
          key={i}
          className="star-dot absolute rounded-full bg-star"
          style={{
            left: star.x,
            top: star.y,
            width: star.size * scale,
            height: star.size * scale,
            opacity: star.dim * scale,
            boxShadow:
              star.size >= 2 ? '0 0 6px rgba(239, 230, 216, 0.5)' : undefined,
            ['--star-dim' as string]: String(star.dim * scale),
            ['--star-bright' as string]: String(star.bright * scale),
            ['--star-dur' as string]: star.dur,
            ['--star-delay' as string]: star.delay,
          }}
        />
      ))}
      {variant === 'hero' && (
        <>
          {/* Two four-point sparkles for variety */}
          <svg
            aria-hidden
            className="star-dot absolute"
            style={{
              left: '26%',
              top: '18%',
              opacity: 0.5,
              ['--star-dim' as string]: '0.35',
              ['--star-bright' as string]: '0.85',
              ['--star-dur' as string]: '6s',
              ['--star-delay' as string]: '1s',
            }}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14l-1.4-5.6L0 7l5.6-1.4Z" fill="#EFE6D8" />
          </svg>
          <svg
            aria-hidden
            className="star-dot absolute"
            style={{
              left: '76%',
              top: '40%',
              opacity: 0.4,
              ['--star-dim' as string]: '0.25',
              ['--star-bright' as string]: '0.7',
              ['--star-dur' as string]: '7s',
              ['--star-delay' as string]: '3.4s',
            }}
            width="10"
            height="10"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14l-1.4-5.6L0 7l5.6-1.4Z" fill="#EFE6D8" />
          </svg>
        </>
      )}
    </div>
  )
}

/** A soft crescent moon with a candlelight glow, for the home hero. */
export function CrescentMoon({ size = 72, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="36" cy="36" r="30" fill="#F3C77E" opacity="0.08" />
      <path
        d="M45 12a27 27 0 1 0 16.2 38.7A24 24 0 0 1 45 12Z"
        fill="#F3C77E"
        opacity="0.9"
      />
    </svg>
  )
}
