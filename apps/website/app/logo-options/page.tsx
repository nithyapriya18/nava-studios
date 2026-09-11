import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'Logo options — nine points',
  robots: { index: false, follow: false },
}

const INK = '#6E3C37'

type Pt = { x: number; y: number; r?: number }

function Dots({ pts, fill = INK }: { pts: Pt[]; fill?: string }) {
  if (pts.length !== 9) {
    throw new Error(`Need 9 points, got ${pts.length}`)
  }
  return (
    <>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r ?? 3.1} fill={fill} />
      ))}
    </>
  )
}

function Frame({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: ReactNode
}) {
  return (
    <figure className="border border-border rounded-xl bg-background p-6">
      <div className="flex items-center justify-center h-44 bg-[#F4F1EE] rounded-lg">
        <svg viewBox="0 0 80 80" width="140" height="140" aria-hidden>
          {children}
        </svg>
      </div>
      <figcaption className="mt-4">
        <p className="font-medium text-text-primary">{title}</p>
        <p className="mt-1 text-sm text-text-muted leading-relaxed">{note}</p>
        <p className="mt-2 text-xs tabular-nums text-accent">9 points</p>
      </figcaption>
    </figure>
  )
}

/** 1 — Crescent, size tapers. Same idea as your Canva #1. */
function CrescentNine() {
  const pts: Pt[] = [
    { x: 22, y: 58, r: 2.0 },
    { x: 18, y: 46, r: 2.5 },
    { x: 19, y: 34, r: 3.1 },
    { x: 26, y: 24, r: 3.6 },
    { x: 40, y: 18, r: 4.1 },
    { x: 54, y: 24, r: 3.6 },
    { x: 61, y: 34, r: 3.1 },
    { x: 62, y: 46, r: 2.5 },
    { x: 58, y: 58, r: 2.0 },
  ]
  return <Dots pts={pts} />
}

/** 2 — Crescent + one inner curve (line only). 9 dots on the rim. */
function MoonProfileNine() {
  const pts: Pt[] = [
    { x: 28, y: 62, r: 2.2 },
    { x: 20, y: 50, r: 2.6 },
    { x: 18, y: 36, r: 3.0 },
    { x: 24, y: 24, r: 3.3 },
    { x: 40, y: 16, r: 3.6 },
    { x: 56, y: 24, r: 3.3 },
    { x: 62, y: 36, r: 3.0 },
    { x: 60, y: 50, r: 2.6 },
    { x: 52, y: 62, r: 2.2 },
  ]
  return (
    <>
      <path
        d="M28 62 C 18 48, 22 22, 40 16"
        fill="none"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Dots pts={pts} />
    </>
  )
}

/** 3 — Minimal lotus: 5 tips + 4 inner joints. */
function MinimalBloom() {
  const tips: Pt[] = [
    { x: 40, y: 12, r: 3.0 },
    { x: 22, y: 22, r: 2.8 },
    { x: 58, y: 22, r: 2.8 },
    { x: 16, y: 42, r: 2.8 },
    { x: 64, y: 42, r: 2.8 },
  ]
  const joints: Pt[] = [
    { x: 32, y: 32, r: 2.4 },
    { x: 48, y: 32, r: 2.4 },
    { x: 28, y: 52, r: 2.4 },
    { x: 52, y: 52, r: 2.4 },
  ]
  return (
    <>
      <path
        d="M40 12 L32 32 L22 22 M40 12 L48 32 L58 22 M32 32 L28 52 L16 42 M48 32 L52 52 L64 42 M28 52 L52 52"
        fill="none"
        stroke={INK}
        strokeWidth="1.35"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Dots pts={[...tips, ...joints]} />
    </>
  )
}

/** 4 — Regular nine-gon (enneagon). New / complete cycle. */
function Enneagon() {
  const pts: Pt[] = Array.from({ length: 9 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 9 - Math.PI / 2
    return { x: 40 + Math.cos(a) * 24, y: 40 + Math.sin(a) * 24, r: 3.0 }
  })
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.2" />
      <Dots pts={pts} />
    </>
  )
}

/** 5 — Letter N in nine beads. */
function BeadN() {
  const pts: Pt[] = [
    { x: 24, y: 62, r: 2.8 },
    { x: 24, y: 48, r: 2.8 },
    { x: 24, y: 34, r: 2.8 },
    { x: 24, y: 20, r: 2.8 },
    { x: 36, y: 34, r: 3.0 },
    { x: 48, y: 48, r: 3.0 },
    { x: 56, y: 20, r: 2.8 },
    { x: 56, y: 40, r: 2.8 },
    { x: 56, y: 62, r: 2.8 },
  ]
  return (
    <>
      <path
        d="M24 62 L24 20 L56 62 L56 20"
        fill="none"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <Dots pts={pts} />
    </>
  )
}

/** 6 — Soft 3×3 field, no box lines. Ninth is not special. */
function FieldNine() {
  const pts: Pt[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      pts.push({
        x: 22 + col * 18 + (row === 1 ? 1 : 0),
        y: 22 + row * 18 + (col === 1 ? -1 : 0),
        r: 3.2,
      })
    }
  }
  return <Dots pts={pts} />
}

/** 7 — Seed / new: nine along a teardrop. */
function SeedNine() {
  const pts: Pt[] = [
    { x: 40, y: 14, r: 2.2 },
    { x: 32, y: 24, r: 2.6 },
    { x: 48, y: 24, r: 2.6 },
    { x: 26, y: 36, r: 3.0 },
    { x: 40, y: 34, r: 3.4 },
    { x: 54, y: 36, r: 3.0 },
    { x: 28, y: 50, r: 2.8 },
    { x: 52, y: 50, r: 2.8 },
    { x: 40, y: 64, r: 2.4 },
  ]
  return (
    <>
      <path
        d="M40 12 C 22 28, 20 50, 40 66 C 60 50, 58 28, 40 12 Z"
        fill="none"
        stroke={INK}
        strokeWidth="1.3"
      />
      <Dots pts={pts} />
    </>
  )
}

/** 8 — Forward: nine beads that read as an arrow, not a box. */
function ArrowNine() {
  const pts: Pt[] = [
    { x: 18, y: 58, r: 2.4 },
    { x: 26, y: 50, r: 2.6 },
    { x: 34, y: 42, r: 2.8 },
    { x: 42, y: 34, r: 3.0 },
    { x: 50, y: 26, r: 3.2 },
    { x: 58, y: 18, r: 3.4 },
    { x: 58, y: 32, r: 2.6 },
    { x: 58, y: 44, r: 2.4 },
    { x: 46, y: 18, r: 2.6 },
  ]
  return <Dots pts={pts} />
}

/** 9 — Constellation: 9 vertices, sparse lines (orbit). */
function OrbitNine() {
  const pts: Pt[] = [
    { x: 40, y: 14, r: 2.8 },
    { x: 58, y: 22, r: 2.6 },
    { x: 66, y: 40, r: 2.8 },
    { x: 58, y: 58, r: 2.6 },
    { x: 40, y: 66, r: 2.8 },
    { x: 22, y: 58, r: 2.6 },
    { x: 14, y: 40, r: 2.8 },
    { x: 22, y: 22, r: 2.6 },
    { x: 40, y: 40, r: 3.4 },
  ]
  return (
    <>
      <path
        d="M40 14 L58 22 L66 40 L40 40 L14 40 L22 22 Z M40 40 L58 58 L40 66 L22 58 Z"
        fill="none"
        stroke={INK}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <Dots pts={pts} />
    </>
  )
}

/** 10 — Two small crescents sharing the ninth point (Nava / Naveen echo, unspoken). */
function TwinArcNine() {
  const pts: Pt[] = [
    { x: 18, y: 28, r: 2.5 },
    { x: 22, y: 18, r: 2.7 },
    { x: 34, y: 14, r: 2.9 },
    { x: 46, y: 18, r: 2.7 },
    { x: 40, y: 40, r: 3.4 },
    { x: 34, y: 62, r: 2.7 },
    { x: 46, y: 66, r: 2.9 },
    { x: 58, y: 62, r: 2.7 },
    { x: 62, y: 52, r: 2.5 },
  ]
  return <Dots pts={pts} />
}

const OPTIONS = [
  { title: 'Crescent lunar', note: 'Nine beads, tapering. Closest to your Canva #1.', Mark: CrescentNine },
  { title: 'Moon rim', note: 'Nine on the crescent; one line for the inner curve. No extra dots.', Mark: MoonProfileNine },
  { title: 'Minimal bloom', note: 'Lotus in nine points: five tips, four joints. Your Canva #5, counted.', Mark: MinimalBloom },
  { title: 'Enneagon', note: 'A nine-sided cycle. New, complete, no leftover vertex.', Mark: Enneagon },
  { title: 'Bead N', note: 'Nithya / Nava as a letter, built from exactly nine.', Mark: BeadN },
  { title: 'Field', note: 'Nine equal points. The count is the symbol. Nothing extra in the last cell.', Mark: FieldNine },
  { title: 'Seed', note: 'New / beginning. Nine along a single drop.', Mark: SeedNine },
  { title: 'Forward', note: 'Nine beads that walk up-right. Motion, not a box.', Mark: ArrowNine },
  { title: 'Orbit', note: 'Nine vertices, sparse lines. Constellation, not a net of extras.', Mark: OrbitNine },
  { title: 'Twin arc', note: 'Two arcs, nine points total. A private echo of two lives, one studio.', Mark: TwinArcNine },
]

export default function LogoOptionsPage() {
  return (
    <div className="bg-background py-16 md:py-20">
      <div className="max-w-layout mx-auto px-6 md:px-8">
        <p className="text-sm font-medium text-accent">Internal · not in the nav</p>
        <h1 className="mt-2 text-3xl font-medium text-text-primary">
          Marks with exactly nine points
        </h1>
        <p className="mt-4 max-w-2xl text-text-muted leading-relaxed">
          Same language as your board: dots, optional thin lines. Every drawing
          has nine circles — no more.
        </p>
        <div className="mt-12 border border-border rounded-xl bg-[#F4F1EE] px-8 py-12 flex flex-col items-center">
          <Logo size={160} href="/logo-options" nameClassName="text-sm tracking-[0.2em]" />
          <p className="mt-6 text-sm text-text-muted max-w-md text-center leading-relaxed">
            Chosen lockup: nine crescent beads, nine petals reaching toward
            them, name in one line. Now in the header and favicon.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {OPTIONS.map(({ title, note, Mark }) => (
            <Frame key={title} title={title} note={note}>
              <Mark />
            </Frame>
          ))}
        </div>
      </div>
    </div>
  )
}
