'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    async function checkSetup() {
      const res = await fetch('/api/household')
      if (res.status === 503) {
        setDbError(true)
        return
      }
      if (!res.ok) {
        router.replace('/onboarding')
        return
      }
      const prefs = await res.json().catch(() => null)
      if (prefs?.setupComplete) {
        router.replace('/meal-plan')
      } else {
        router.replace('/onboarding')
      }
    }
    checkSetup()
  }, [router])

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-border shadow-sm p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="font-display text-xl font-semibold text-text-primary">Database setup needed</h1>
          <p className="text-sm text-text-muted">
            New columns were added to the database. Run this in your{' '}
            <strong>Neon SQL Editor</strong>:
          </p>
          <pre className="text-left text-xs bg-surface rounded-xl border border-border p-4 overflow-x-auto whitespace-pre-wrap">
{`ALTER TABLE households ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_households_user ON households(user_id);
ALTER TABLE households ADD COLUMN IF NOT EXISTS plan_start_date TEXT;
ALTER TABLE households ADD COLUMN IF NOT EXISTS plan_start_meal TEXT;
ALTER TABLE households ADD COLUMN IF NOT EXISTS meal_times JSONB;`}
          </pre>
          <button
            type="button"
            onClick={() => { setDbError(false); window.location.reload() }}
            className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            I ran it — reload
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
    </div>
  )
}
