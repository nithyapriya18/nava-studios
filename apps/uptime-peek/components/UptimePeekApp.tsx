'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Play, Square } from 'lucide-react'
import { Field, inputClass } from '@nava-studios/kit'
import { useLocalState } from '@nava-studios/kit'

interface Monitor {
  id: string
  url: string
  history: { at: number; ok: boolean; ms: number }[]
}

const MAX_HISTORY = 60

/**
 * Live checks from YOUR browser while this tab is open (no-cors fetch: resolves
 * if the host answers at all, fails on DNS/network death). 24/7 server-side
 * monitoring arrives with accounts — this is the honest free version.
 */
export function UptimePeekApp() {
  const [monitors, setMonitors] = useLocalState<Monitor[]>('tools:uptime:monitors', [])
  const [url, setUrl] = useState('')
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkAll = async () => {
    const results = await Promise.all(
      monitors.map(async (m) => {
        const start = performance.now()
        try {
          await fetch(m.url, { mode: 'no-cors', cache: 'no-store' })
          return { id: m.id, ok: true, ms: Math.round(performance.now() - start) }
        } catch {
          return { id: m.id, ok: false, ms: Math.round(performance.now() - start) }
        }
      }),
    )
    setMonitors((prev) =>
      prev.map((m) => {
        const r = results.find((x) => x.id === m.id)
        if (!r) return m
        return {
          ...m,
          history: [...m.history, { at: Date.now(), ok: r.ok, ms: r.ms }].slice(-MAX_HISTORY),
        }
      }),
    )
  }

  useEffect(() => {
    if (running) {
      checkAll()
      timer.current = setInterval(checkAll, 30_000)
    }
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-56 flex-1">
          <Field label="URL to watch">
            <input className={inputClass} value={url} placeholder="https://mysite.com"
              onChange={(e) => setUrl(e.target.value)} />
          </Field>
        </div>
        <button
          onClick={() => {
            const u = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
            setMonitors((prev) => [...prev, { id: `m_${Date.now().toString(36)}`, url: u, history: [] }])
            setUrl('')
          }}
          disabled={!url.trim()}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary hover:border-accent hover:text-accent disabled:opacity-40">
          <Plus size={12} className="mr-1 inline" /> Add
        </button>
        <button
          onClick={() => setRunning(!running)}
          disabled={monitors.length === 0}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-40 ${running ? 'border border-red-300 text-red-600 hover:bg-red-50' : 'bg-accent text-white hover:bg-accent/90'}`}>
          {running ? <><Square size={13} /> Stop watching</> : <><Play size={13} /> Watch (checks every 30s)</>}
        </button>
      </div>

      {monitors.length > 0 && (
        <ul className="space-y-3">
          {monitors.map((m) => {
            const last = m.history[m.history.length - 1]
            const upCount = m.history.filter((h) => h.ok).length
            return (
              <li key={m.id} className="rounded-2xl border border-border bg-background p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{m.url}</p>
                    <p className="text-xs text-text-muted">
                      {last
                        ? `${last.ok ? 'reachable' : 'UNREACHABLE'} · ${last.ms}ms · ${upCount}/${m.history.length} checks ok`
                        : 'no checks yet — hit Watch'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {last && (
                      <span className={`h-3 w-3 rounded-full ${last.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    )}
                    <button onClick={() => setMonitors((prev) => prev.filter((x) => x.id !== m.id))}
                      className="p-1.5 text-text-muted hover:text-red-600" aria-label="Remove monitor">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {/* Latency sparkline */}
                {m.history.length > 1 && (
                  <div className="mt-3 flex h-10 items-end gap-0.5">
                    {m.history.map((h, i) => {
                      const max = Math.max(...m.history.map((x) => x.ms), 1)
                      return (
                        <div key={i} title={`${h.ms}ms`}
                          className={`w-1.5 rounded-t ${h.ok ? 'bg-emerald-400' : 'bg-red-400'}`}
                          style={{ height: `${Math.max(8, (h.ms / max) * 100)}%` }} />
                      )
                    })}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-xs text-text-muted">
        Checks run from your browser while this tab is open. Round-the-clock
        monitoring with alerts arrives with accounts — this free version is for
        &ldquo;is it down right now?&rdquo; and watching a deploy settle.
      </p>
    </div>
  )
}
