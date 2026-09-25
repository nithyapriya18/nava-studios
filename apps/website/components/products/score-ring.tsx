/** A circular score gauge out of 10, drawn in the brand gradient. */
export function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const filled = (Math.max(0, Math.min(10, score)) / 10) * c

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="score-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a3a9c" />
            <stop offset="1" stopColor="#11ab8c" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-surface" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#score-ring)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c}`}
          className="score-ring-arc"
        />
      </svg>
      <p className="relative text-center leading-none">
        <span className="text-4xl font-bold tabular-nums text-text-primary">{score}</span>
        <span className="block pt-1 text-xs text-text-muted">out of 10</span>
      </p>
    </div>
  )
}
