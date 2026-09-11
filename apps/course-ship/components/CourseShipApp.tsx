'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Link2, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState, encodeShare, decodeShare } from '@nava-studios/kit'
import { buildUpiLink, buildWhatsAppLink } from '@nava-studios/kit'
import { formatINR } from '@nava-studios/kit'

export interface Course {
  title: string
  author: string
  whatsapp: string
  upiId: string
  price: number
  lessons: { title: string; videoUrl: string; text: string }[]
}

export function CourseShipApp() {
  const [course, setCourse] = useLocalState<Course>('tools:course:draft', {
    title: '', author: '', whatsapp: '', upiId: '', price: 0,
    lessons: [{ title: 'Lesson 1', videoUrl: '', text: '' }],
  })
  const [copied, setCopied] = useState<string | null>(null)

  const set = (patch: Partial<Course>) => setCourse({ ...course, ...patch })
  const setLesson = (i: number, patch: Partial<Course['lessons'][0]>) =>
    set({ lessons: course.lessons.map((l, j) => (j === i ? { ...l, ...patch } : l)) })

  const courseUrl = () =>
    `${window.location.origin}/learn#${encodeShare(course)}`

  const copy = async (which: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      window.prompt('Copy:', text)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Course title">
          <input className={inputClass} value={course.title}
            onChange={(e) => set({ title: e.target.value })} placeholder="Watercolor Basics in 7 Days" />
        </Field>
        <Field label="Your name">
          <input className={inputClass} value={course.author}
            onChange={(e) => set({ author: e.target.value })} />
        </Field>
        <Field label="Price (₹) — 0 for free">
          <input type="number" min={0} className={inputClass} value={course.price || ''}
            onChange={(e) => set({ price: Number(e.target.value) })} />
        </Field>
        <Field label="Your UPI ID (students pay here)">
          <input className={inputClass} value={course.upiId} placeholder="name@okbank"
            onChange={(e) => set({ upiId: e.target.value })} />
        </Field>
        <Field label="Your WhatsApp (students confirm payment here)">
          <input className={inputClass} value={course.whatsapp} placeholder="98765 43210"
            onChange={(e) => set({ whatsapp: e.target.value })} />
        </Field>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-text-primary">Lessons</legend>
        {course.lessons.map((l, i) => (
          <div key={i} className="space-y-2 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <input className={inputClass} value={l.title} placeholder={`Lesson ${i + 1} title`}
                onChange={(e) => setLesson(i, { title: e.target.value })} />
              <button onClick={() => set({ lessons: course.lessons.filter((_, j) => j !== i) })}
                disabled={course.lessons.length === 1}
                className="rounded-lg border border-border p-2 text-text-muted hover:border-red-300 hover:text-red-600 disabled:opacity-40"
                aria-label="Remove lesson">
                <Trash2 size={14} />
              </button>
            </div>
            <input className={inputClass} value={l.videoUrl}
              placeholder="Video link (YouTube unlisted / Vimeo / Drive) — optional"
              onChange={(e) => setLesson(i, { videoUrl: e.target.value })} />
            <textarea rows={3} className={inputClass} value={l.text}
              placeholder="Lesson notes, steps, homework…"
              onChange={(e) => setLesson(i, { text: e.target.value })} />
          </div>
        ))}
        <button
          onClick={() => set({ lessons: [...course.lessons, { title: `Lesson ${course.lessons.length + 1}`, videoUrl: '', text: '' }] })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent">
          <Plus size={13} /> Add lesson
        </button>
      </fieldset>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-medium text-text-primary">Your course link</p>
        <p className="mt-1 text-xs text-text-muted">
          {course.price > 0
            ? 'Share the sales pitch publicly; send this full course link only to students who have paid (their UPI payment pings your phone, they tap "I\'ve paid" on WhatsApp, you reply with this link).'
            : 'Free course — share the link anywhere.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => copy('course', courseUrl())}
            disabled={!course.title || course.lessons.every((l) => !l.title)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40">
            {copied === 'course' ? <Check size={14} /> : <Link2 size={14} />}
            {copied === 'course' ? 'Copied!' : 'Copy course link'}
          </button>
          {course.price > 0 && (
            <button
              onClick={() => copy('pitch', `${window.location.origin}/pitch#${encodeShare(course)}`)}
              disabled={!course.title}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:border-accent hover:text-accent disabled:opacity-40">
              {copied === 'pitch' ? <Check size={14} /> : <Link2 size={14} />}
              {copied === 'pitch' ? 'Copied!' : 'Copy public sales-page link'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** Student view — the whole course travels in the URL hash. */
export function CourseLearnApp() {
  const [course, setCourse] = useState<Course | null>(null)
  const [checked, setChecked] = useState(false)
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useLocalState<Record<string, number[]>>('tools:course:progress', {})

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setCourse(decodeShare<Course>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!course)
    return <p className="py-20 text-center text-sm text-text-muted">This course link is invalid.</p>

  const key = course.title
  const doneList = done[key] ?? []
  const lesson = course.lessons[idx]
  const toggleDone = () =>
    setDone({
      ...done,
      [key]: doneList.includes(idx) ? doneList.filter((i) => i !== idx) : [...doneList, idx],
    })

  return (
    <div className="mx-auto max-w-content space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-primary">{course.title}</h1>
        <p className="text-sm text-text-muted">
          by {course.author} · {doneList.length}/{course.lessons.length} lessons done
        </p>
      </div>

      {/* Lesson nav */}
      <div className="flex flex-wrap gap-1.5">
        {course.lessons.map((l, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${i === idx ? 'border-accent bg-accent-light text-accent' : doneList.includes(i) ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-border text-text-muted'}`}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">{lesson.title}</h2>
        {lesson.videoUrl && (
          <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-block rounded-full bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/90">
            ▶ Watch the video
          </a>
        )}
        {lesson.text && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-primary">{lesson.text}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
          className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary disabled:opacity-40">
          <ChevronLeft size={13} /> Previous
        </button>
        <button onClick={toggleDone}
          className={`rounded-full px-4 py-2 text-xs font-medium ${doneList.includes(idx) ? 'bg-emerald-100 text-emerald-800' : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}>
          {doneList.includes(idx) ? '✓ Done' : 'Mark done'}
        </button>
        <button onClick={() => setIdx(Math.min(course.lessons.length - 1, idx + 1))}
          disabled={idx === course.lessons.length - 1}
          className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary disabled:opacity-40">
          Next <ChevronRight size={13} />
        </button>
      </div>
      <p className="text-center text-xs text-text-muted">Hosted with Course Ship — Nava Studios</p>
    </div>
  )
}

/** Public sales page for a paid course. */
export function CoursePitchApp() {
  const [course, setCourse] = useState<Course | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setCourse(decodeShare<Course>(hash))
    setChecked(true)
  }, [])

  if (!checked) return <p className="py-20 text-center text-sm text-text-muted">Loading…</p>
  if (!course) return <p className="py-20 text-center text-sm text-text-muted">Invalid link.</p>

  const paid = () => {
    const msg = `Hi ${course.author}! I've just paid ${formatINR(course.price)} by UPI for "${course.title}". Please send my course link!`
    window.open(buildWhatsAppLink(course.whatsapp, msg), '_blank')
  }

  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-text-primary">{course.title}</h1>
      <p className="text-sm text-text-muted">
        {course.lessons.length} lessons · by {course.author}
      </p>
      <ol className="space-y-1 rounded-2xl border border-border bg-white p-5 text-left text-sm text-text-primary">
        {course.lessons.map((l, i) => (
          <li key={i}>{i + 1}. {l.title}</li>
        ))}
      </ol>
      {course.upiId && (
        <a href={buildUpiLink({ upiId: course.upiId, payeeName: course.author, amount: course.price, note: course.title })}
          className="block w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90">
          Pay {formatINR(course.price)} by UPI
        </a>
      )}
      <button onClick={paid}
        className="w-full rounded-full border border-accent px-5 py-3 text-sm font-medium text-accent hover:bg-accent-light">
        I&apos;ve paid — get my course link
      </button>
      <p className="text-xs text-text-muted">Sold with Course Ship — Nava Studios</p>
    </div>
  )
}
