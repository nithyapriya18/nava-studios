'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { contactHref } from '@/config'
import { scopeUrl } from '@/lib/products'
import { track } from '@/lib/analytics'
import {
  APPETITES,
  BUCKETS,
  BY_HAND,
  EFFORTS,
  EXAMPLE,
  KANO_NAMES,
  KANO_OPTIONS,
  MAX_FEATURES,
  MAX_STEPS,
  MODE_LABEL,
  analyse,
  fileName,
  fmtDays,
  isAnswered,
  ordered,
  parseLines,
  toMarkdown,
  type Bucket,
  type Feature,
  type Scope,
  type Step,
} from '@/lib/scope'
import { Arrow, Note } from '@/components/pen'

type Stage = 'frame' | 'journey' | 'features' | 'assess' | 'result'
type Draft = Scope & { stage: Stage; stepsText: string; featuresText: string }

// The draft lives only in this browser, so a reload or a later visit picks up
// where the founder left off. Nothing is sent anywhere.
const STORAGE_KEY = 'scope-cutter:v2'

const EMPTY: Draft = {
  stage: 'frame',
  idea: '',
  audience: '',
  job: '',
  risk: '',
  appetite: 6,
  steps: [],
  features: [],
  stepsText: '',
  featuresText: '',
}

const STAGES: { id: Stage; label: string }[] = [
  { id: 'frame', label: 'The idea' },
  { id: 'journey', label: 'The journey' },
  { id: 'features', label: 'Features' },
  { id: 'assess', label: 'Assess' },
  { id: 'result', label: 'Your scope' },
]

function readSaved(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null
  try {
    const d = JSON.parse(raw) as Draft
    if (!Array.isArray(d.features) || !Array.isArray(d.steps)) return null
    if (!STAGES.some((s) => s.id === d.stage)) return null
    if (!APPETITES.includes(d.appetite)) d.appetite = EMPTY.appetite
    return d.idea || d.features.length || d.steps.length
      ? { ...EMPTY, ...d }
      : null
  } catch {
    return null
  }
}

/**
 * Keep ids, answers and settings when the list is edited: match by name
 * first, then by position, so fixing a typo keeps what was attached.
 */
function mergeByName<T extends { id: string; name: string }>(
  names: string[],
  old: T[],
  make: (name: string, i: number) => T
): T[] {
  const byName = new Map(old.map((x) => [x.name.toLowerCase(), x]))
  const used = new Set<string>()
  const first = names.map((name) => {
    const hit = byName.get(name.toLowerCase())
    if (hit) used.add(hit.id)
    return hit
  })
  return names.map((name, i) => {
    if (first[i]) return first[i]
    const atIndex = old[i]
    if (
      atIndex &&
      !used.has(atIndex.id) &&
      !names.some((n) => n.toLowerCase() === atIndex.name.toLowerCase())
    ) {
      used.add(atIndex.id)
      return { ...atIndex, name }
    }
    return make(name, i)
  })
}

function lineCount(text: string): number {
  return text.split('\n').filter((l) => l.trim()).length
}

function Chips<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string
  legend: string
  options: { id: T; label: string }[]
  value?: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="sc-q">
      <legend>{legend}</legend>
      <div className="sc-chips">
        {options.map((o) => (
          <label key={o.id} className="sc-chip">
            <input
              type="radio"
              name={name}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function ScopeCutter() {
  const saved = useSyncExternalStore(subscribe, readSaved, () => null)
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [touched, setTouched] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [copied, setCopied] = useState(false)

  const savedDraft = useMemo(
    () => (touched ? null : parseDraft(saved)),
    [saved, touched]
  )
  const analysis = useMemo(() => analyse(draft), [draft])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    if (!touched) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Private mode or storage full: the tool still works, it just won't remember.
    }
  }, [draft, touched])

  const update = (next: Partial<Draft>) => {
    setTouched(true)
    setDraft((d) => ({ ...d, ...next }))
  }
  const go = (stage: Stage) => {
    update({ stage })
    document.getElementById('scope-tool')?.scrollIntoView({ block: 'start' })
  }
  const setFeature = (id: string, patch: Partial<Feature>) =>
    update({
      features: draft.features.map((f) =>
        f.id === id ? { ...f, ...patch } : f
      ),
    })

  function loadExample() {
    update({
      ...EXAMPLE,
      stage: 'result',
      stepsText: EXAMPLE.steps.map((s) => s.name).join('\n'),
      featuresText: EXAMPLE.features.map((f) => f.name).join('\n'),
    })
    track('scope_example_loaded')
  }

  function reset() {
    setCursor(0)
    update(EMPTY)
  }

  // ---- export
  async function copy() {
    try {
      await navigator.clipboard.writeText(toMarkdown(draft, scopeUrl))
      setCopied(true)
      track('scope_exported', { as: 'copy' })
    } catch {
      // Clipboard blocked: the download still works.
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([toMarkdown(draft, scopeUrl)], { type: 'text/markdown' })
    )
    const a = document.createElement('a')
    a.href = url
    a.download = fileName(draft.idea)
    a.click()
    // Revoking straight away can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    track('scope_exported', { as: 'markdown' })
  }
  function print() {
    track('scope_exported', { as: 'print' })
    window.print()
  }

  if (savedDraft) {
    return (
      <div id="scope-tool" className="panel sc-panel">
        <span className="hand">you were partway through</span>
        <p style={{ font: '400 28px/1.15 var(--serif)' }}>
          {savedDraft.idea || 'Your last scope'} is saved in this browser.
        </p>
        <div className="btns">
          <button
            type="button"
            className="btn-primary"
            onClick={() => update(savedDraft)}
          >
            Carry on <Arrow />
          </button>
          <button type="button" className="btn-quiet" onClick={reset}>
            Start a new one
          </button>
        </div>
      </div>
    )
  }

  // A saved draft can't sit in Assess with nothing to assess.
  const stage: Stage =
    draft.stage === 'assess' && draft.features.length === 0
      ? 'features'
      : draft.stage
  const stageIndex = STAGES.findIndex((s) => s.id === stage)
  const steps = (
    <ol className="sc-stages" aria-label="Progress">
      {STAGES.map((s, i) => (
        <li
          key={s.id}
          aria-current={s.id === stage ? 'step' : undefined}
          className={i < stageIndex ? 'done' : ''}
        >
          <span className="num">{i + 1}</span> {s.label}
        </li>
      ))}
    </ol>
  )

  // ---------------------------------------------------------------- 1. idea
  if (stage === 'frame') {
    return (
      <form
        id="scope-tool"
        className="panel sc-panel form"
        onSubmit={(e) => {
          e.preventDefault()
          track('scope_started')
          go('journey')
        }}
      >
        {steps}
        <div className="field">
          <label htmlFor="sc-idea">The idea in one line</label>
          <input
            id="sc-idea"
            className="input"
            required
            maxLength={120}
            value={draft.idea}
            onChange={(e) => update({ idea: e.target.value })}
            placeholder="A marketplace where parents book online tutors"
          />
        </div>
        <div className="field">
          <label htmlFor="sc-who">Who it’s for, specifically</label>
          <input
            id="sc-who"
            className="input"
            required
            maxLength={120}
            value={draft.audience}
            onChange={(e) => update({ audience: e.target.value })}
            placeholder="Parents of school students in Bengaluru"
          />
        </div>
        <div className="field">
          <label htmlFor="sc-job">
            The job they hire it for{' '}
            <span className="hint">(When…, I want to…, so I can…)</span>
          </label>
          <textarea
            id="sc-job"
            className="input sc-short"
            maxLength={240}
            value={draft.job}
            onChange={(e) => update({ job: e.target.value })}
            placeholder="When my child is falling behind, I want a tutor I can trust quickly, so their marks recover before exams."
          />
        </div>
        <div className="field">
          <label htmlFor="sc-risk">
            Your riskiest assumption{' '}
            <span className="hint">
              (the belief that, if wrong, sinks the idea)
            </span>
          </label>
          <input
            id="sc-risk"
            className="input"
            maxLength={160}
            value={draft.risk}
            onChange={(e) => update({ risk: e.target.value })}
            placeholder="Parents will pay upfront for a tutor they found online"
          />
        </div>
        <fieldset className="sc-q">
          <legend>How long is a first version worth to you?</legend>
          <div className="sc-chips">
            {APPETITES.map((w) => (
              <label key={w} className="sc-chip">
                <input
                  type="radio"
                  name="appetite"
                  checked={draft.appetite === w}
                  onChange={() => update({ appetite: w })}
                />
                <span>{w} weeks</span>
              </label>
            ))}
          </div>
          <p className="muted sc-help">
            Fixed time, flexible scope: the scope gets cut to fit this, not the
            other way round.
          </p>
        </fieldset>
        <div className="btns">
          <button type="submit" className="btn-primary btn-lg">
            Next: the journey <Arrow />
          </button>
          <button type="button" className="quiet-link" onClick={loadExample}>
            or see a worked example first
          </button>
        </div>
        <p className="muted sc-help">
          Everything stays in your browser. Nothing is sent or stored anywhere
          else.
        </p>
      </form>
    )
  }

  // ---------------------------------------------------------------- 2. journey
  if (stage === 'journey') {
    return (
      <form
        id="scope-tool"
        className="panel sc-panel form"
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.steps.length < 2) return
          go('features')
        }}
      >
        {steps}
        <div className="field">
          <label htmlFor="sc-steps">
            The steps a user takes to get the job done, in order{' '}
            <span className="hint">(up to {MAX_STEPS})</span>
          </label>
          <textarea
            id="sc-steps"
            className="input"
            rows={6}
            value={draft.stepsText}
            onChange={(e) =>
              update({
                stepsText: e.target.value,
                steps: mergeByName<Step>(
                  parseLines(e.target.value, MAX_STEPS),
                  draft.steps,
                  (name, i) => ({
                    id: `s${Date.now()}-${i}`,
                    name,
                    essential: true,
                  })
                ),
              })
            }
            placeholder={
              'Find a tutor\nBook a session\nPay\nAttend the session\nCome back for more'
            }
          />
          <p className="muted sc-help">
            This is the backbone of a story map. Your first version has to let
            someone get through every essential step, end to end, even if some
            steps are done by hand.
            {lineCount(draft.stepsText) > draft.steps.length &&
              ` Repeats and anything past ${MAX_STEPS} steps are left out.`}
          </p>
        </div>
        {draft.steps.length > 0 && (
          <fieldset className="sc-q">
            <legend>Which steps does the core job need on day one?</legend>
            <div className="sc-steplist">
              {draft.steps.map((s, i) => (
                <label key={s.id} className="sc-check">
                  <input
                    type="checkbox"
                    checked={s.essential}
                    onChange={() =>
                      update({
                        steps: draft.steps.map((x) =>
                          x.id === s.id ? { ...x, essential: !x.essential } : x
                        ),
                      })
                    }
                  />
                  <span>
                    <span className="num">{i + 1}.</span> {s.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="btns">
          <button
            type="submit"
            className="btn-primary"
            disabled={draft.steps.length < 2}
          >
            Next: features <Arrow />
          </button>
          <button
            type="button"
            className="quiet-link"
            onClick={() => go('frame')}
          >
            ← Back
          </button>
        </div>
      </form>
    )
  }

  // ---------------------------------------------------------------- 3. features
  if (stage === 'features') {
    const unplaced = draft.features.filter(
      (f) => !draft.steps.some((s) => s.id === f.step)
    )
    return (
      <form
        id="scope-tool"
        className="panel sc-panel form"
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.features.length === 0 || unplaced.length > 0) return
          setCursor(
            Math.max(
              0,
              draft.features.findIndex((f) => !isAnswered(f))
            )
          )
          go(draft.features.every(isAnswered) ? 'result' : 'assess')
        }}
      >
        {steps}
        <div className="field">
          <label htmlFor="sc-features">
            Every feature you’re imagining, one per line
          </label>
          <textarea
            id="sc-features"
            className="input"
            rows={8}
            value={draft.featuresText}
            onChange={(e) =>
              update({
                featuresText: e.target.value,
                features: mergeByName<Feature>(
                  parseLines(e.target.value, MAX_FEATURES),
                  draft.features,
                  (name, i) => ({ id: `f${Date.now()}-${i}`, name })
                ),
              })
            }
            placeholder={
              'Tutor profiles\nSearch by subject\nBooking calendar\nPayments\nVideo calls\nReviews\nMobile app'
            }
          />
          <span className="muted sc-help" aria-live="polite">
            {draft.features.length} of {MAX_FEATURES}.{' '}
            {lineCount(draft.featuresText) > draft.features.length
              ? 'Repeats and anything past 30 are left out. '
              : ''}
            Include the ones you suspect you don’t need; that’s the point.
          </span>
        </div>
        {draft.features.length > 0 && (
          <fieldset className="sc-q">
            <legend>Which step does each one belong to?</legend>
            <div className="sc-assign">
              {draft.features.map((f) => (
                <label key={f.id} className="sc-assign-row">
                  <span>{f.name}</span>
                  <select
                    value={f.step ?? ''}
                    onChange={(e) =>
                      setFeature(f.id, { step: e.target.value || undefined })
                    }
                  >
                    <option value="">Choose a step</option>
                    {draft.steps.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="btns">
          <button
            type="submit"
            className="btn-primary"
            disabled={draft.features.length === 0 || unplaced.length > 0}
          >
            Next: assess each one <Arrow />
          </button>
          <button
            type="button"
            className="quiet-link"
            onClick={() => go('journey')}
          >
            ← Back
          </button>
        </div>
        {draft.features.length > 0 && unplaced.length > 0 && (
          <p className="muted sc-help">{unplaced.length} still need a step.</p>
        )}
      </form>
    )
  }

  // ---------------------------------------------------------------- 4. assess
  if (stage === 'assess') {
    const i = Math.min(cursor, draft.features.length - 1)
    const f = draft.features[i]
    const step = draft.steps.find((s) => s.id === f.step)
    const last = i === draft.features.length - 1
    const next = () => {
      if (!last) return setCursor(i + 1)
      const missed = draft.features.findIndex((x) => !isAnswered(x))
      if (missed !== -1) return setCursor(missed)
      go('result')
      track('scope_completed', {
        features: draft.features.length,
        appetite: draft.appetite,
      })
    }
    return (
      <div id="scope-tool" className="panel sc-panel">
        {steps}
        <div className="sc-progress" aria-hidden>
          <i
            style={{
              width: `${(draft.features.filter(isAnswered).length / draft.features.length) * 100}%`,
            }}
          />
        </div>
        <p className="label">
          Feature {i + 1} of {draft.features.length}
          {step ? ` · ${step.name}` : ''}
        </p>
        <h2 className="sc-feature" aria-live="polite">
          {f.name}
        </h2>
        <p className="muted sc-help">
          Answer as your first users would feel, not as you would.
        </p>

        <Chips
          name={`fn-${f.id}`}
          legend="If your first users had it, how would they feel?"
          options={KANO_OPTIONS}
          value={f.functional}
          onChange={(v) => setFeature(f.id, { functional: v })}
        />
        <Chips
          name={`dy-${f.id}`}
          legend="If it were missing, how would they feel?"
          options={KANO_OPTIONS}
          value={f.dysfunctional}
          onChange={(v) => setFeature(f.id, { dysfunctional: v })}
        />
        <Chips
          name={`ef-${f.id}`}
          legend="Roughly how long to build it properly?"
          options={EFFORTS}
          value={f.effort}
          onChange={(v) => setFeature(f.id, { effort: v })}
        />
        <Chips
          name={`bh-${f.id}`}
          legend="Could you do it by hand for your first 20 customers?"
          options={BY_HAND}
          value={f.byHand}
          onChange={(v) => setFeature(f.id, { byHand: v })}
        />
        {draft.risk && (
          <label className="sc-check sc-bet">
            <input
              type="checkbox"
              checked={!!f.bet}
              onChange={() => setFeature(f.id, { bet: !f.bet })}
            />
            <span>Needed to test “{draft.risk}”</span>
          </label>
        )}

        <div className="btns">
          <button
            type="button"
            className="btn-primary"
            disabled={!isAnswered(f)}
            onClick={next}
          >
            {last ? 'See my scope' : 'Next feature'} <Arrow />
          </button>
          <button
            type="button"
            className="quiet-link"
            onClick={() => (i > 0 ? setCursor(i - 1) : go('features'))}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------- 5. result
  const a = analysis
  const pct = Math.min(100, (a.used / a.capacity) * 100)
  const over = a.used > a.capacity
  return (
    <div id="scope-tool" className="panel sc-panel scope-doc">
      <div className="no-print">{steps}</div>
      <div className="sc-doc-head">
        <p className="label">Your first version</p>
        <h2 className="h2">{draft.idea || 'Your product'}</h2>
        {draft.audience && (
          <p className="muted">
            <span className="label">For</span>&nbsp; {draft.audience}
          </p>
        )}
        {draft.job && <p className="sc-job">“{draft.job}”</p>}
      </div>

      <div className="sc-budget">
        <div className="sc-budget-top">
          <span className="label">Build time at launch</span>
          <span className="num">
            {fmtDays(a.used)} of {fmtDays(a.capacity)} ({draft.appetite} weeks)
          </span>
        </div>
        <div
          className={`sc-meter${over ? ' over' : ''}`}
          role="img"
          aria-label={`${Math.round(pct)}% of the appetite used`}
        >
          <i style={{ width: `${pct}%` }} />
        </div>
        <p className="muted sc-help">
          Counts about 3.5 focused build days a week for a solo builder, after
          everything unplanned.
        </p>
      </div>

      <div className="sc-journey" aria-label="The core journey at launch">
        {draft.steps.map((s) => {
          const covered = a.placements.some(
            (p) => p.bucket === 'launch' && p.feature.step === s.id
          )
          return (
            <div
              key={s.id}
              className={`sc-jstep${!s.essential ? ' optional' : covered ? ' ok' : ' gap'}`}
            >
              <span className="sc-jmark" aria-hidden>
                {!s.essential ? '·' : covered ? '✓' : '!'}
              </span>
              <span>{s.name}</span>
              <span className="sr-only">
                {!s.essential
                  ? '(not essential yet)'
                  : covered
                    ? '(covered at launch)'
                    : '(not covered)'}
              </span>
            </div>
          )
        })}
      </div>

      {a.unanswered.length > 0 && (
        <div className="aside no-print">
          <p>
            {a.unanswered.length === 1
              ? '1 feature still needs'
              : `${a.unanswered.length} features still need`}{' '}
            answers and isn’t on the board yet:{' '}
            {a.unanswered.map((f) => f.name).join(', ')}.
          </p>
          <div>
            <button
              type="button"
              className="btn-quiet btn-sm"
              onClick={() => {
                setCursor(draft.features.findIndex((f) => !isAnswered(f)))
                go('assess')
              }}
            >
              Answer them
            </button>
          </div>
        </div>
      )}
      {a.emptySteps.length > 0 && (
        <Note className="no-print">
          no feature covers {a.emptySteps.map((s) => `“${s.name}”`).join(', ')}{' '}
          yet
        </Note>
      )}
      {(a.trims.length > 0 || a.stillOver > 0) && (
        <div className="aside sc-trim no-print">
          <span className="hand">
            over your appetite by {fmtDays(a.used - a.capacity)}
          </span>
          {a.trims.length > 0 && (
            <p>
              To fit {draft.appetite} weeks, move these to Later. The weakest go
              first, and the core journey stays whole:
            </p>
          )}
          {a.trims.length > 0 && (
            <ul>
              {a.trims.map((t) => (
                <li key={t.feature.id}>
                  {t.feature.name}{' '}
                  <span className="muted">(saves {fmtDays(t.saves)})</span>
                </li>
              ))}
            </ul>
          )}
          {a.stillOver > 0 && (
            <p>
              {a.trims.length > 0 ? 'Even then, it’s' : 'It’s'}{' '}
              {fmtDays(a.stillOver)} over without breaking the core journey.
              Choose a longer appetite, or do more of it by hand.
            </p>
          )}
          {a.trims.length > 0 && (
            <div>
              <button
                type="button"
                className="btn-quiet btn-sm"
                onClick={() =>
                  update({
                    features: draft.features.map((f) =>
                      a.trims.some((t) => t.feature.id === f.id)
                        ? { ...f, moved: 'later' as Bucket }
                        : f
                    ),
                  })
                }
              >
                Move them to Later
              </button>
            </div>
          )}
        </div>
      )}

      <div className="sc-board">
        {BUCKETS.map((b) => {
          const items = ordered(a, b.id)
          return (
            <section
              key={b.id}
              className={`sc-col sc-${b.id}`}
              aria-labelledby={`sc-${b.id}-h`}
            >
              <h3 id={`sc-${b.id}-h`} className="sc-col-h">
                {b.label} <span className="muted">{items.length}</span>
              </h3>
              <p className="muted sc-hint">{b.hint}</p>
              {items.length === 0 && (
                <p className="muted sc-empty">Nothing here</p>
              )}
              <ul className="sc-items">
                {items.map((p) => (
                  <li key={p.feature.id} className="sc-item">
                    <span className="sc-item-name">{p.feature.name}</span>
                    <span className="sc-tags">
                      <span className="sc-tag">{KANO_NAMES[p.category]}</span>
                      {p.bucket === 'launch' && p.mode && (
                        <span className={`sc-tag mode-${p.mode}`}>
                          {MODE_LABEL[p.mode]} · {fmtDays(p.days)}
                        </span>
                      )}
                    </span>
                    <span className="muted sc-item-reason">{p.reason}</span>
                    <label className="sc-move no-print">
                      <span className="sr-only">Move {p.feature.name} to</span>
                      <select
                        value={b.id}
                        onChange={(e) =>
                          setFeature(p.feature.id, {
                            moved: e.target.value as Bucket,
                          })
                        }
                      >
                        {BUCKETS.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.id === b.id
                              ? `In ${o.label}`
                              : `Move to ${o.label}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="sc-measure">
        <span className="label">What to measure after launch</span>
        <p>{a.measure}</p>
      </div>

      <div className="btns no-print">
        <button type="button" className="btn-primary" onClick={download}>
          Download scope
        </button>
        <button
          type="button"
          className="btn-quiet"
          onClick={copy}
          aria-live="polite"
        >
          {copied ? 'Copied' : 'Copy as text'}
        </button>
        <button type="button" className="btn-quiet" onClick={print}>
          Print or save as PDF
        </button>
      </div>
      <div className="sc-foot no-print">
        <button
          type="button"
          className="quiet-link"
          onClick={() => go('features')}
        >
          Edit features
        </button>
        <button
          type="button"
          className="quiet-link"
          onClick={() => {
            setCursor(0)
            go('assess')
          }}
        >
          Review my answers
        </button>
        <button type="button" className="quiet-link" onClick={reset}>
          Start over
        </button>
      </div>

      <div className="aside band-card sc-cta no-print">
        <span className="hand">this is the first call, on paper</span>
        <p style={{ font: '400 28px/1.15 var(--serif)' }}>
          Want this built? I design and build first versions for a fixed price.
        </p>
        <div className="btns">
          <Link
            href={contactHref}
            className="btn-primary"
            onClick={() => track('scope_cta_clicked')}
          >
            Tell me about your idea <Arrow />
          </Link>
        </div>
      </div>
      <p className="sc-made muted">
        Made with Scope Cutter · {scopeUrl.replace('https://', '')}
      </p>
    </div>
  )
}
