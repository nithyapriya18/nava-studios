import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from 'react'

/**
 * Aceternity's Text Generate Effect in CSS: each word comes out of a blur in
 * turn. Elements inside (an <em>, a pen mark) keep their markup and their
 * words join the sequence. Server-rendered, so it costs no JavaScript.
 */
export function Generate({ children }: { children: ReactNode }) {
  let i = 0
  const split = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === 'string') {
        return child.split(/(\s+)/).map((part, k) =>
          part.trim() === '' ? (
            part
          ) : (
            <span key={k} className="gen-w" style={{ '--i': i++ } as CSSProperties}>
              {part}
            </span>
          ),
        )
      }
      if (isValidElement<{ children?: ReactNode }>(child) && child.props.children !== undefined) {
        return cloneElement(child, undefined, split(child.props.children))
      }
      return child
    })
  return <>{split(children)}</>
}
