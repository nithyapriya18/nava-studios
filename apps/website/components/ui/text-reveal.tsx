import { Fragment } from 'react'

/**
 * Words fade in from a soft blur, one after another, on first paint.
 * Adapted from Aceternity's Text Generate Effect, done in CSS so there is no
 * JavaScript cost. Words from `highlightFrom` on get the brand gradient,
 * spread across them so it reads as one continuous sweep.
 */
export function TextReveal({
  text,
  stepMs = 80,
  startMs = 0,
  highlightFrom,
}: {
  text: string
  stepMs?: number
  startMs?: number
  highlightFrom?: number
}) {
  const words = text.split(' ')
  const lit = highlightFrom === undefined ? 0 : words.length - highlightFrom

  return (
    <>
      {words.map((word, i) => {
        const k = highlightFrom === undefined ? -1 : i - highlightFrom
        const style =
          k >= 0
            ? {
                animationDelay: `${startMs + i * stepMs}ms`,
                backgroundSize: `${lit * 100}% 100%`,
                backgroundPosition: lit > 1 ? `${(k / (lit - 1)) * 100}% 0` : '0 0',
              }
            : { animationDelay: `${startMs + i * stepMs}ms` }
        return (
          <Fragment key={`${word}-${i}`}>
            <span className={`reveal-word ${k >= 0 ? 'text-grad pb-[0.08em]' : ''}`} style={style}>
              {word}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        )
      })}
    </>
  )
}
