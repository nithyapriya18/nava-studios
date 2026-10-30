'use client'

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'

const REDUCE = '(prefers-reduced-motion: reduce)'
const watchReduce = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/**
 * Aceternity's Flip Words without a motion library: every few seconds the
 * word lifts away in a blur and the next one types itself in, letter by
 * letter. Screen readers get the whole list as one sentence instead, and
 * with reduced motion the sentence simply stands still.
 */
export function FlipWords({
  prefix,
  words,
  sentence,
  interval = 2800,
}: {
  prefix: string
  words: string[]
  sentence: string
  interval?: number
}) {
  // How many flips so far; the word on show is n modulo the list.
  const [n, setN] = useState(0)
  const still = useSyncExternalStore(
    watchReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )

  useEffect(() => {
    if (still) return
    const t = setInterval(() => {
      if (!document.hidden) setN((x) => x + 1)
    }, interval)
    return () => clearInterval(t)
  }, [interval, still])

  if (still) return <>{sentence}</>

  const word = words[n % words.length]
  const prev = n > 0 ? words[(n - 1) % words.length] : null
  return (
    <>
      <span className="sr-only">{sentence}</span>
      <span aria-hidden>
        {prefix}{' '}
        <span className="flip">
          {prev && (
            <span key={`out-${n}`} className="flip-out">
              {prev}
            </span>
          )}
          <span key={`in-${n}`} className="flip-in">
            {Array.from(word).map((ch, k) => (
              <span key={k} style={{ '--k': k } as CSSProperties}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        </span>
      </span>
    </>
  )
}
