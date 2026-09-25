import type { CSSProperties } from 'react'

const layers = [
  { cls: 'ha-plan', z: 0, delay: 200 },
  { cls: 'ha-frame', z: 46, delay: 550 },
  { cls: 'ha-product', z: 92, delay: 900 },
]

/**
 * Abstract hero art: three layers (a plan, a structure, the finished product)
 * drop into an isometric stack, then drift. Soft brand-coloured light moves
 * behind them and a thin ring turns slowly. CSS only (keyframes in
 * globals.css); decorative, so hidden from screen readers.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[480px] select-none">
      <span className="ha-orb ha-orb-blue" />
      <span className="ha-orb ha-orb-teal" />
      <span className="ha-orb ha-orb-green" />

      <div className="ha-ring">
        <span className="ha-dot left-1/2 top-0 bg-[#012987]" />
        <span className="ha-dot bottom-[14%] left-[6%] bg-[#006278]" />
        <span className="ha-dot bottom-[14%] right-[6%] bg-[#11ab8c]" />
      </div>

      <div className="ha-stage">
        <div className="ha-iso">
          {layers.map((layer, i) => (
            <div
              key={layer.cls}
              className="ha-drop"
              style={{ '--z': `${layer.z}px`, animationDelay: `${layer.delay}ms` } as CSSProperties}
            >
              <div
                className={`ha-bob ${layer.cls}`}
                style={{ animationDelay: `${1600 + i * 700}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
