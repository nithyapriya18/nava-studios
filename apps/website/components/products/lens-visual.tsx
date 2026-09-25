import type { CSSProperties } from 'react'

// Findings sit at an angle (degrees, clockwise from 12 o'clock) and a radius
// (% of the lens). Each one glows as the sweep passes it.
const findings = [
  { angle: 40, radius: 34, color: '#57e0b8' },
  { angle: 115, radius: 22, color: '#7d96ff' },
  { angle: 200, radius: 40, color: '#57e0b8' },
  { angle: 285, radius: 28, color: '#7d96ff' },
  { angle: 330, radius: 14, color: '#57e0b8' },
]

const SWEEP_SECONDS = 6

/**
 * Abstract art for Second Opinion: a lens of rings with a slow gradient
 * sweep, and small points that light up as it passes. CSS only; decorative.
 */
export function LensVisual() {
  return (
    <div aria-hidden className="relative grid h-full min-h-[320px] place-items-center overflow-hidden">
      <span className="ha-orb ha-orb-blue opacity-80" />
      <span className="ha-orb ha-orb-teal opacity-80" />

      <div className="relative aspect-square w-[78%] max-w-[340px]">
        {[100, 72, 44].map((size) => (
          <span
            key={size}
            className="absolute rounded-full border border-white/10"
            style={{ inset: `${(100 - size) / 2}%` }}
          />
        ))}
        <span className="absolute inset-[48%] rounded-full bg-white/70" />

        <span
          className="lens-sweep absolute inset-0 rounded-full"
          style={{ animationDuration: `${SWEEP_SECONDS}s` }}
        />

        {findings.map((f, i) => {
          const rad = (f.angle * Math.PI) / 180
          const style = {
            left: `${50 + Math.sin(rad) * f.radius}%`,
            top: `${50 - Math.cos(rad) * f.radius}%`,
            background: f.color,
            '--glow': f.color,
            animationDuration: `${SWEEP_SECONDS}s`,
            // Glow when the sweep's leading edge reaches this angle.
            animationDelay: `${(f.angle / 360) * SWEEP_SECONDS}s`,
          } as CSSProperties
          return <span key={i} className="lens-dot absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={style} />
        })}
      </div>
    </div>
  )
}
