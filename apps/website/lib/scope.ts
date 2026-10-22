/**
 * Scope Cutter: turns a founder's feature wish list into a first release,
 * using established product methods rather than one-off rules:
 *
 * - Kano model (Noriaki Kano, 1984): each feature gets the paired
 *   "if it's there / if it's missing" questions, classified with the
 *   standard evaluation table.
 * - User story mapping (Jeff Patton): features hang off the steps of the
 *   user's journey, and the first release must be a walking skeleton that
 *   covers every essential step end to end.
 * - Appetite (Basecamp, Shape Up): time is fixed and scope is variable. The
 *   founder sets how many weeks the first version is worth, and the scope
 *   is cut to fit rather than the time stretched.
 * - Riskiest assumption testing (Lean Startup practice): whatever is needed to
 *   test the riskiest belief goes in first, because learning beats polish.
 * - Concierge and Wizard of Oz MVPs: what can be done by hand for the first
 *   customers launches by hand instead of being built.
 * - Value over effort, adapted from RICE (Intercom) without reach, since a
 *   founder scoping alone has no usage data yet: orders what comes next.
 *
 * Kano is designed for asking users. Here the founder answers on their
 * users' behalf, which the page says plainly; it works best after talking to
 * a handful of them. Pure functions, no imports: checkable on its own with
 * `node --experimental-strip-types`.
 */

// ---------------------------------------------------------------- inputs

export type KanoAnswer = 'like' | 'expect' | 'neutral' | 'tolerate' | 'dislike'
export type Effort = 's' | 'm' | 'l' | 'xl'
export type ByHand = 'yes' | 'partly' | 'no'
export type Bucket = 'launch' | 'later' | 'never'

export type Step = { id: string; name: string; essential: boolean }

export type Feature = {
  id: string
  name: string
  step?: string
  /** "If your first users had this, how would they feel?" */
  functional?: KanoAnswer
  /** "If it were missing, how would they feel?" */
  dysfunctional?: KanoAnswer
  effort?: Effort
  byHand?: ByHand
  /** Needed to test the riskiest assumption. */
  bet?: boolean
  /** The founder moved it; this wins over the engine. */
  moved?: Bucket
}

export type Scope = {
  idea: string
  audience: string
  /** The job users hire the product for (Jobs to be Done). */
  job: string
  /** The belief that, if wrong, sinks the idea. */
  risk: string
  /** Weeks the first version is worth (Shape Up appetite). */
  appetite: number
  steps: Step[]
  features: Feature[]
}

export const MAX_FEATURES = 30
export const MAX_STEPS = 8
export const MAX_NAME = 80
export const APPETITES = [2, 4, 6, 8, 12]

/** Build days per week a solo builder actually gets, after the unplanned. */
export const FOCUS_DAYS_PER_WEEK = 3.5

export const KANO_OPTIONS: { id: KanoAnswer; label: string }[] = [
  { id: 'like', label: 'They’d love it' },
  { id: 'expect', label: 'They’d expect it' },
  { id: 'neutral', label: 'They wouldn’t care' },
  { id: 'tolerate', label: 'They could live with it' },
  { id: 'dislike', label: 'They’d dislike it' },
]

export const EFFORTS: { id: Effort; label: string; days: number }[] = [
  { id: 's', label: 'A day or two', days: 2 },
  { id: 'm', label: 'About a week', days: 5 },
  { id: 'l', label: 'About two weeks', days: 10 },
  { id: 'xl', label: 'Three weeks or more', days: 20 },
]

export const BY_HAND: { id: ByHand; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'partly', label: 'Partly' },
  { id: 'no', label: 'No' },
]

// ---------------------------------------------------------------- Kano

/**
 * A attractive, O one-dimensional (performance), M must-be, I indifferent,
 * R reverse, Q questionable (contradictory answers).
 */
export type KanoCategory = 'A' | 'O' | 'M' | 'I' | 'R' | 'Q'

const ORDER: KanoAnswer[] = ['like', 'expect', 'neutral', 'tolerate', 'dislike']

// Rows: functional answer. Columns: dysfunctional answer. The standard table.
const TABLE: KanoCategory[][] = [
  ['Q', 'A', 'A', 'A', 'O'],
  ['R', 'I', 'I', 'I', 'M'],
  ['R', 'I', 'I', 'I', 'M'],
  ['R', 'I', 'I', 'I', 'M'],
  ['R', 'R', 'R', 'R', 'Q'],
]

export function kano(
  functional: KanoAnswer,
  dysfunctional: KanoAnswer
): KanoCategory {
  const row = ORDER.indexOf(functional)
  const col = ORDER.indexOf(dysfunctional)
  return row === -1 || col === -1 ? 'Q' : TABLE[row][col]
}

export const KANO_NAMES: Record<KanoCategory, string> = {
  M: 'Must-have',
  O: 'More is better',
  A: 'Delighter',
  I: 'Indifferent',
  R: 'Unwanted',
  Q: 'Unclear',
}

// ---------------------------------------------------------------- engine

export type Mode = 'build' | 'basic' | 'hand'

export type Placement = {
  feature: Feature
  category: KanoCategory
  bucket: Bucket
  /** For launch: build it, build a basic version, or do it by hand. */
  mode?: Mode
  reason: string
  /** Build days this costs in its bucket (launch only counts toward the budget). */
  days: number
  /** Value over effort; orders Later into a next-release queue. */
  priority: number
  /** True when the engine must keep it in launch (essential coverage or the bet). */
  protected: boolean
}

export type Analysis = {
  placements: Placement[]
  capacity: number
  used: number
  /** Essential journey steps with nothing at launch. */
  gaps: Step[]
  /** Essential steps no feature belongs to at all. */
  emptySteps: Step[]
  /** Features to move to Later, in order, to fit the appetite. */
  trims: { feature: Feature; saves: number }[]
  /** Days still over the appetite after every safe trim. */
  stillOver: number
  /** Features whose questions aren't all answered. */
  unanswered: Feature[]
  measure: string
}

export function isAnswered(f: Feature): boolean {
  return (
    ORDER.includes(f.functional!) &&
    ORDER.includes(f.dysfunctional!) &&
    EFFORTS.some((e) => e.id === f.effort) &&
    BY_HAND.some((b) => b.id === f.byHand)
  )
}

const WEIGHT: Record<KanoCategory, number> = {
  M: 3,
  O: 2,
  A: 1.5,
  I: 0.5,
  Q: 1,
  R: 0,
}

function effortDays(f: Feature): number {
  return EFFORTS.find((e) => e.id === f.effort)?.days ?? 5
}

/** Launch cost after doing what we can by hand, and trimming to a basic version. */
function launchDays(f: Feature, mode: Mode): number {
  const full = effortDays(f)
  if (mode === 'hand') return f.byHand === 'yes' ? 0.5 : full / 2
  if (mode === 'basic') return Math.max(1, full / 2)
  return full
}

function stepOf(scope: Scope, f: Feature): Step | undefined {
  return scope.steps.find((s) => s.id === f.step)
}

/** The engine's own call for one answered feature, before budget and coverage. */
function decide(
  scope: Scope,
  f: Feature,
  category: KanoCategory
): Omit<Placement, 'days' | 'priority' | 'protected'> {
  const step = stepOf(scope, f)
  const essential = !!step?.essential
  const byHand = f.byHand !== 'no'

  if (category === 'R') {
    return {
      feature: f,
      category,
      bucket: 'never',
      reason: 'Some of your users would rather not have it at all.',
    }
  }
  if (f.bet) {
    return {
      feature: f,
      category,
      bucket: 'launch',
      mode: byHand ? 'hand' : category === 'O' ? 'basic' : 'build',
      reason: byHand
        ? 'Tests your riskiest assumption. Run it by hand first; build it once the bet holds.'
        : 'Tests your riskiest assumption, so it goes first: learning beats polish.',
    }
  }
  if (category === 'M') {
    if (!essential && step) {
      return {
        feature: f,
        category,
        bucket: 'later',
        reason: `Expected, but “${step.name}” isn’t part of the core journey yet.`,
      }
    }
    return {
      feature: f,
      category,
      bucket: 'launch',
      mode: byHand ? 'hand' : 'build',
      reason: byHand
        ? 'Users expect it, and you can do it by hand for your first customers.'
        : 'Users expect it; without it the product feels broken.',
    }
  }
  if (category === 'O') {
    if (essential) {
      return {
        feature: f,
        category,
        bucket: 'launch',
        mode: byHand ? 'hand' : 'basic',
        reason: byHand
          ? 'More of it is better, but by hand covers your first customers.'
          : 'More of it is better: launch a basic version and grow it with use.',
      }
    }
    return {
      feature: f,
      category,
      bucket: 'later',
      reason: 'Worth growing once the core journey works.',
    }
  }
  if (category === 'A') {
    return {
      feature: f,
      category,
      bucket: 'later',
      reason:
        'A delighter. Nobody misses it at launch; it can set you apart later.',
    }
  }
  if (category === 'Q') {
    return {
      feature: f,
      category,
      bucket: 'later',
      reason:
        'Your two answers contradict each other. Worth asking real users.',
    }
  }
  return {
    feature: f,
    category,
    bucket: 'never',
    reason: 'Users wouldn’t notice either way.',
  }
}

const CATEGORY_RANK: Record<KanoCategory, number> = {
  M: 0,
  O: 1,
  A: 2,
  Q: 3,
  I: 4,
  R: 5,
}

export function analyse(scope: Scope): Analysis {
  const capacity = scope.appetite * FOCUS_DAYS_PER_WEEK
  const unanswered = scope.features.filter((f) => !isAnswered(f))
  const answered = scope.features.filter(isAnswered)

  let placements: Placement[] = answered.map((f) => {
    const category = kano(f.functional!, f.dysfunctional!)
    const d = decide(scope, f, category)
    const step = stepOf(scope, f)
    const value =
      WEIGHT[category] * (f.bet ? 1.5 : 1) * (step?.essential ? 1.25 : 1)
    return { ...d, days: 0, priority: value / effortDays(f), protected: false }
  })

  // Walking skeleton: every essential step needs something at launch. Pull in
  // the strongest feature for any step that has none.
  for (const step of scope.steps.filter((s) => s.essential)) {
    const onStep = placements.filter((p) => p.feature.step === step.id)
    if (onStep.length === 0 || onStep.some((p) => p.bucket === 'launch'))
      continue
    const best = onStep
      .filter((p) => p.category !== 'R')
      .sort(
        (a, b) =>
          CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category] ||
          b.priority - a.priority
      )[0]
    if (!best) continue
    best.bucket = 'launch'
    best.mode = best.feature.byHand !== 'no' ? 'hand' : 'basic'
    best.reason = `Without it nobody can get through “${step.name}”, so a ${
      best.mode === 'hand' ? 'by-hand' : 'basic'
    } version goes in.`
  }

  // Protect what the first release can't lose: the bet, and the only launch
  // item on an essential step.
  for (const p of placements) {
    if (p.bucket !== 'launch') continue
    const step = stepOf(scope, p.feature)
    const sole =
      !!step?.essential &&
      placements.filter(
        (q) => q.bucket === 'launch' && q.feature.step === step.id
      ).length === 1
    p.protected = !!p.feature.bet || sole
  }

  // The founder's own moves win.
  placements = placements.map((p) => {
    const moved = p.feature.moved
    if (!moved || moved === p.bucket) return p
    const mode: Mode | undefined =
      moved !== 'launch'
        ? undefined
        : p.feature.byHand !== 'no'
          ? 'hand'
          : p.category === 'O'
            ? 'basic'
            : 'build'
    return {
      ...p,
      bucket: moved,
      mode,
      reason: 'Moved here by you.',
      protected: moved === 'launch',
    }
  })

  for (const p of placements)
    p.days =
      p.bucket === 'launch' ? launchDays(p.feature, p.mode ?? 'build') : 0
  const used = placements.reduce((sum, p) => sum + p.days, 0)

  // Fit the appetite (Shape Up's scope hammering): suggest moving launch items
  // to Later, weakest kind first (must-haves last), then lowest value for
  // effort, never leaving an essential step with nothing at launch.
  const trims: Analysis['trims'] = []
  let over = used - capacity
  const atLaunch = new Map<string | undefined, number>()
  for (const p of placements) {
    if (p.bucket === 'launch')
      atLaunch.set(p.feature.step, (atLaunch.get(p.feature.step) ?? 0) + 1)
  }
  const candidates = placements
    .filter((p) => p.bucket === 'launch' && !p.protected && p.days > 0)
    .sort(
      (a, b) =>
        CATEGORY_RANK[b.category] - CATEGORY_RANK[a.category] ||
        a.priority - b.priority
    )
  for (const p of candidates) {
    if (over <= 0) break
    const step = stepOf(scope, p.feature)
    const left = atLaunch.get(p.feature.step) ?? 0
    if (step?.essential && left <= 1) continue
    atLaunch.set(p.feature.step, left - 1)
    trims.push({ feature: p.feature, saves: p.days })
    over -= p.days
  }
  const stillOver = Math.max(0, over)

  const launchSteps = new Set(
    placements.filter((p) => p.bucket === 'launch').map((p) => p.feature.step)
  )
  const essentials = scope.steps.filter((s) => s.essential)
  const gaps = essentials.filter((s) => !launchSteps.has(s.id))
  const emptySteps = essentials.filter(
    (s) => !scope.features.some((f) => f.step === s.id)
  )

  const lastStep = essentials.at(-1)
  const measure = lastStep
    ? `How many new users reach “${lastStep.name}” in their first week. That’s the core job done, and the number to watch.`
    : 'How many new users finish the core job in their first week.'

  return {
    placements,
    capacity,
    used,
    gaps,
    emptySteps,
    trims,
    stillOver,
    unanswered,
    measure,
  }
}

/** Launch first, then Later as a queue (best value for effort first), then Not now. */
export function ordered(a: Analysis, bucket: Bucket): Placement[] {
  const list = a.placements.filter((p) => p.bucket === bucket)
  if (bucket === 'later') return list.sort((x, y) => y.priority - x.priority)
  return list
}

// ---------------------------------------------------------------- helpers

/** One item per line; trims bullets and numbering, drops blanks and repeats. */
export function parseLines(text: string, max: number): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of text.split('\n')) {
    const name = raw
      .replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '')
      .trim()
      .slice(0, MAX_NAME)
    const key = name.toLowerCase()
    if (!name || seen.has(key)) continue
    seen.add(key)
    out.push(name)
    if (out.length === max) break
  }
  return out
}

export const BUCKETS: { id: Bucket; label: string; hint: string }[] = [
  { id: 'launch', label: 'Launch', hint: 'Your first version' },
  { id: 'later', label: 'Later', hint: 'Next, in this order' },
  { id: 'never', label: 'Not now', hint: 'Only if users ask' },
]

export const MODE_LABEL: Record<Mode, string> = {
  build: 'Build',
  basic: 'Basic version',
  hand: 'By hand',
}

function fmtDays(d: number): string {
  const r = Math.round(d * 2) / 2
  return `${r} day${r === 1 ? '' : 's'}`
}

export { fmtDays }

/** The finished scope as Markdown, for copying or downloading. */
export function toMarkdown(
  scope: Scope,
  link: string,
  date = new Date()
): string {
  const a = analyse(scope)
  const lines: string[] = [`# ${scope.idea || 'Product scope'}`, '']
  if (scope.audience) lines.push(`**For:** ${scope.audience}`)
  if (scope.job) lines.push(`**The job:** ${scope.job}`)
  if (scope.risk) lines.push(`**Riskiest assumption:** ${scope.risk}`)
  lines.push(
    `**Appetite:** ${scope.appetite} weeks (about ${fmtDays(a.capacity)} of build time). Launch uses ${fmtDays(a.used)}.`,
    ''
  )
  if (scope.steps.length) {
    lines.push('## The core journey', '')
    lines.push(
      ...scope.steps.map(
        (s, i) =>
          `${i + 1}. ${s.name}${s.essential ? '' : ' _(not essential yet)_'}`
      ),
      ''
    )
  }
  for (const b of BUCKETS) {
    const items = ordered(a, b.id)
    lines.push(`## ${b.label}`, `_${b.hint}_`, '')
    if (items.length === 0) lines.push('- Nothing here', '')
    else
      lines.push(
        ...items.map((p) => {
          const tag =
            p.bucket === 'launch' && p.mode
              ? ` (${MODE_LABEL[p.mode]}, ${fmtDays(p.days)})`
              : ''
          return `- **${p.feature.name}**${tag} · ${KANO_NAMES[p.category]}. ${p.reason}`
        }),
        ''
      )
  }
  if (a.unanswered.length)
    lines.push(
      `**Not yet assessed:** ${a.unanswered.map((f) => f.name).join(', ')}.`,
      ''
    )
  if (a.gaps.length)
    lines.push(
      `**Gaps:** nothing at launch covers ${a.gaps.map((s) => `“${s.name}”`).join(', ')}.`,
      ''
    )
  if (a.trims.length)
    lines.push(
      `**Over the appetite.** To fit ${scope.appetite} weeks, move these to Later: ${a.trims.map((t) => t.feature.name).join(', ')}.`,
      ''
    )
  if (a.stillOver > 0)
    lines.push(
      `**Still ${fmtDays(a.stillOver)} over** without breaking the core journey. Choose a longer appetite or do more by hand.`,
      ''
    )
  lines.push('## What to measure', '', a.measure, '')
  const day = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  lines.push(
    '---',
    `Made with Scope Cutter (${link}) on ${day}. Methods: Kano model, user story mapping, Shape Up appetite, riskiest assumption testing, concierge MVPs.`
  )
  return lines.join('\n')
}

export function fileName(idea: string): string {
  const slug = idea
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return slug ? `${slug}-scope.md` : 'product-scope.md'
}

// ---------------------------------------------------------------- example

const ex = (
  id: string,
  name: string,
  step: string,
  functional: KanoAnswer,
  dysfunctional: KanoAnswer,
  effort: Effort,
  byHand: ByHand,
  bet = false
): Feature => ({
  id,
  name,
  step,
  functional,
  dysfunctional,
  effort,
  byHand,
  bet,
})

/** A fully answered example, so a first-time visitor sees the result at once. */
export const EXAMPLE: Scope = {
  idea: 'A marketplace where parents book online tutors',
  audience: 'Parents of school students in Bengaluru',
  job: 'When my child is falling behind in a subject, I want a tutor I can trust quickly, so their marks recover before exams.',
  risk: 'Parents will pay upfront for a tutor they found online.',
  appetite: 6,
  steps: [
    { id: 's1', name: 'Find a tutor', essential: true },
    { id: 's2', name: 'Book a session', essential: true },
    { id: 's3', name: 'Pay', essential: true },
    { id: 's4', name: 'Attend the session', essential: true },
    { id: 's5', name: 'Come back for more', essential: false },
  ],
  features: [
    ex('f1', 'Tutor profiles', 's1', 'expect', 'dislike', 'm', 'no'),
    ex(
      'f2',
      'Search by subject and grade',
      's1',
      'like',
      'dislike',
      'm',
      'partly'
    ),
    ex('f3', 'Booking calendar', 's2', 'like', 'dislike', 'l', 'yes'),
    ex(
      'f4',
      'Card and UPI payments',
      's3',
      'expect',
      'dislike',
      'l',
      'yes',
      true
    ),
    ex('f5', 'Built-in video calls', 's4', 'like', 'tolerate', 'xl', 'no'),
    ex(
      'f13',
      'A video link for each session',
      's4',
      'expect',
      'dislike',
      's',
      'yes'
    ),
    ex('f6', 'Session reminders', 's4', 'like', 'tolerate', 's', 'yes'),
    ex('f7', 'Reviews and ratings', 's5', 'like', 'dislike', 'm', 'no'),
    ex(
      'f8',
      'Chat between parent and tutor',
      's2',
      'like',
      'neutral',
      'l',
      'partly'
    ),
    ex('f9', 'Referral rewards', 's5', 'like', 'neutral', 'm', 'no'),
    ex('f10', 'Mobile app', 's1', 'neutral', 'neutral', 'xl', 'no'),
    ex(
      'f11',
      'Tutor earnings analytics',
      's5',
      'neutral',
      'neutral',
      'l',
      'no'
    ),
    ex('f12', 'Sign-up and login', 's2', 'expect', 'dislike', 's', 'no'),
  ],
}
