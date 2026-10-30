import type { CSSProperties } from 'react'

/**
 * Aceternity's Text Reveal: a paragraph whose words go from faint to full
 * as you read down it. Server-rendered; ScrollFx sets --w (0 to 1) on the
 * paragraph and each word works out its own opacity from its place.
 */
export function ScrollWords({ text, className }: { text: string; className: string }) {
  const words = text.split(' ')
  return (
    <p className={className} data-words style={{ '--n': words.length } as CSSProperties}>
      {words.map((w, i) => (
        <span key={i} className="sw" style={{ '--i': i } as CSSProperties}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}
