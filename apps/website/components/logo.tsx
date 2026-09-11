import Link from 'next/link'
import { siteConfig } from '@/config'

interface LogoMarkProps {
  size?: number
}

const CRESCENT: { x: number; y: number; r: number }[] = [
  { x: 22, y: 44, r: 2.0 },
  { x: 18, y: 35, r: 2.5 },
  { x: 19, y: 26.5, r: 3.1 },
  { x: 26, y: 19, r: 3.6 },
  { x: 40, y: 14.5, r: 4.1 },
  { x: 54, y: 19, r: 3.6 },
  { x: 61, y: 26.5, r: 3.1 },
  { x: 62, y: 35, r: 2.5 },
  { x: 58, y: 44, r: 2.0 },
]

const LOTUS_CENTER = { x: 40, y: 62 }

function n(value: number) {
  return value.toFixed(3)
}

function petalPath(dot: { x: number; y: number }, width: number) {
  const dx = dot.x - LOTUS_CENTER.x
  const dy = dot.y - LOTUS_CENTER.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux
  const reach = 0.78
  const tipX = LOTUS_CENTER.x + ux * len * reach
  const tipY = LOTUS_CENTER.y + uy * len * reach
  const mx = LOTUS_CENTER.x + ux * len * reach * 0.48
  const my = LOTUS_CENTER.y + uy * len * reach * 0.48
  const w = width
  return `M ${n(LOTUS_CENTER.x)} ${n(LOTUS_CENTER.y)} Q ${n(mx + px * w)} ${n(my + py * w)} ${n(tipX)} ${n(tipY)} Q ${n(mx - px * w)} ${n(my - py * w)} ${n(LOTUS_CENTER.x)} ${n(LOTUS_CENTER.y)}`
}

const PETAL_WIDTHS = [7.2, 8.4, 9.2, 9.8, 10.2, 9.8, 9.2, 8.4, 7.2]

/** Nine crescent beads; nine lotus petals reaching toward them. */
export function LogoMark({ size = 36 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
    >
      {CRESCENT.map((p, i) => (
        <path
          key={`petal-${i}`}
          d={petalPath(p, PETAL_WIDTHS[i])}
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      ))}
      {CRESCENT.map((p, i) => (
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={p.r} fill="currentColor" />
      ))}
    </svg>
  )
}

interface LogoProps {
  showName?: boolean
  size?: number
  className?: string
  href?: string
  nameClassName?: string
}

export function Logo({
  showName = true,
  size = 36,
  className = '',
  href = '/',
  nameClassName = '',
}: LogoProps) {
  const inner = (
    <span className={`inline-flex flex-col items-center gap-1 group ${className}`}>
      <span className="text-accent">
        <LogoMark size={size} />
      </span>
      {showName && (
        <span
          className={`whitespace-nowrap text-[11px] font-medium tracking-[0.16em] text-text-primary ${nameClassName}`}
        >
          nava studios
        </span>
      )}
    </span>
  )

  return (
    <Link
      href={href}
      className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={siteConfig.name}
    >
      {inner}
    </Link>
  )
}
