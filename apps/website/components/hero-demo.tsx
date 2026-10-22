'use client'

import { useState } from 'react'
import Link from 'next/link'
import { reviewHref } from '@/lib/products'
import { Arrow, Note, PenCircle, PenStrike, Tick } from '@/components/pen'

const stages = ['Napkin', 'Scope', 'Shipped'] as const
const numerals = ['i.', 'ii.', 'iii.']
const notes = [
  'a few lines is enough to start',
  'what waits is written down too',
  'this one is real. Try it on your own page.',
]

/** Crit at each stage of a project: the idea, the scope, the live product. */
export function HeroDemo() {
  const [stage, setStage] = useState(0)

  return (
    <div className="demo">
      <div className="stepper" role="group" aria-label="See one of my products at each stage">
        {stages.map((label, i) => (
          <button key={label} type="button" aria-pressed={stage === i} onClick={() => setStage(i)}>
            <span>{numerals[i]}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="mock" aria-live="polite">
        {stage === 0 && (
          <>
            <div className="m-tag">
              <span>Napkin · the idea</span>
              <span>Aug 2026</span>
            </div>
            <div className="lined" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p className="m-hand big">Founders can’t tell why their landing page isn’t working.</p>
              <p className="m-hand">
                paste a link → <PenCircle>score + fixes</PenCircle>
              </p>
              <p className="m-hand">in under a minute, and free</p>
              <p className="m-hand muted">
                accounts? <PenStrike>later</PenStrike>
              </p>
            </div>
          </>
        )}

        {stage === 1 && (
          <>
            <div className="m-tag">
              <span>Scope · written, v1</span>
              <span>2 pages</span>
            </div>
            <p className="m-title">Crit, first version</p>
            <p className="muted" style={{ fontSize: 14 }}>
              A landing page review for founders. Paste a link, get a score and fixes you can use.
            </p>
            <div className="m-cols">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="label">Launch</span>
                <ul className="m-list">
                  {['Review from a link or pasted copy', 'Score on six criteria', 'Fixes as a prompt or plan.md'].map(
                    (item) => (
                      <li key={item}>
                        <Tick size={14} />
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="label">Later</span>
                <ul className="m-list muted">
                  <li>
                    <span aria-hidden>–</span>
                    <span>Accounts and history</span>
                  </li>
                  <li>
                    <span aria-hidden>–</span>
                    <span>Sharing with a team</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="m-price">
              <span>
                <b style={{ fontWeight: 500 }}>Price</b> · fixed, agreed before work starts
              </span>
              <span className="pill">Accepted</span>
            </div>
          </>
        )}

        {stage === 2 && (
          <>
            <div className="m-tag">
              <span>Shipped · live today</span>
              <span>Crit</span>
            </div>
            <div className="m-url">
              <span className="muted">https://</span>
              <span>yourproduct.com</span>
              <span className="go">Review</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="label">Example review</span>
              <span style={{ font: '400 44px/1 var(--serif)', color: 'var(--accent-c)' }}>
                6.4<span className="muted" style={{ fontSize: 20 }}>/10</span>
              </span>
            </div>
            {[
              ['Clarity', 7],
              ['Proof', 4],
              ['Design', 6],
            ].map(([label, score]) => (
              <div key={label} className="bar-row">
                <span>{label}</span>
                <span className="bar">
                  <i className={Number(score) < 5 ? 'low' : undefined} style={{ width: `${Number(score) * 10}%` }} />
                </span>
                <span className="num" style={Number(score) < 5 ? { color: 'var(--red)' } : undefined}>
                  {score}
                </span>
              </div>
            ))}
            <p
              style={{
                font: 'italic 400 19px/1.3 var(--serif)',
                borderTop: '1px solid var(--rule)',
                paddingTop: 12,
              }}
            >
              “Trusted by teams everywhere” names no one. Name one customer and one result.
            </p>
            <Link href={reviewHref} className="more" style={{ marginTop: 'auto' }}>
              Try it on your page <Arrow />
            </Link>
          </>
        )}
      </div>
      <Note>{notes[stage]}</Note>
    </div>
  )
}
