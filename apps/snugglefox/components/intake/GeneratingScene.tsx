import { FoxMark } from '@/components/brand/FoxMark'
import { NightSky } from '@/components/brand/NightSky'

const WEAVE_LINES = [
  'Choosing the perfect opening line…',
  'Sprinkling in a little stardust…',
  'Teaching the characters their parts…',
  'Dimming the lights for the ending…',
]

interface GeneratingSceneProps {
  childName: string
}

/**
 * The "weaving tonight's story" moment shown while the story request is in
 * flight. Purely presentational — the copy lines rotate with CSS keyframes
 * (held on the first line under prefers-reduced-motion).
 */
export function GeneratingScene({ childName }: GeneratingSceneProps) {
  const name = childName.trim() || 'Your little one'
  return (
    <div className="animate-fade-in relative flex flex-col items-center justify-center gap-5 overflow-hidden py-14">
      <NightSky variant="quiet" />

      <div className="relative">
        {/* Candlelight halo behind the sleeping fox */}
        <div
          aria-hidden
          className="animate-pulse-slow absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/15 blur-2xl"
        />
        <div className="animate-drift relative">
          <FoxMark size={64} />
        </div>
      </div>

      <div className="relative text-center">
        <p className="font-display text-xl font-semibold text-text-primary">
          Weaving tonight&rsquo;s story…
        </p>
        <p className="mt-2 text-sm text-text-muted">
          {name} is about to star in a brand-new bedtime story.
        </p>
      </div>

      {/* Rotating progress copy — stacked lines, CSS-timed */}
      <div className="relative h-5 w-full" aria-live="polite">
        {WEAVE_LINES.map((line) => (
          <span
            key={line}
            className="weave-line absolute inset-x-0 text-center text-xs text-amber/90"
          >
            {line}
          </span>
        ))}
      </div>

      <p className="relative text-center text-xs text-text-muted/70">
        This usually takes 15–30 seconds.
      </p>
    </div>
  )
}
