import { Fragment } from 'react'

/**
 * Words fade in one at a time on first paint. Adapted from Aceternity's
 * Text Generate Effect, but done in CSS (see .reveal-word in globals.css)
 * so it ships no JavaScript and starts before hydration.
 */
export function TextReveal({
  text,
  stepMs = 80,
  startMs = 0,
}: {
  text: string
  stepMs?: number
  startMs?: number
}) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="reveal-word"
            style={{ animationDelay: `${startMs + i * stepMs}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}
