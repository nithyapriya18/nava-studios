'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { loadPreferences, clearPreferences } from '@/lib/storage'
import type { UserPreferences } from '@/lib/types'
import { DIET_TYPE_LABELS, HEALTH_GOAL_LABELS } from '@/lib/types'

export default function SettingsPage() {
  const router = useRouter()
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadPreferences().then(setPrefs)
  }, [])

  async function reset() {
    await clearPreferences()
    router.push('/onboarding')
  }

  if (!prefs) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-layout mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-semibold text-text-primary">Settings</h1>
        </div>
      </header>

      <main className="max-w-content mx-auto px-4 sm:px-6 py-8 space-y-6">
        <section className="rounded-xl border border-border bg-white divide-y divide-border">
          <div className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Household</p>
            <p className="text-base font-display font-semibold text-text-primary">{prefs.householdName}</p>
            <p className="text-sm text-text-muted mt-0.5">{prefs.members.length} member{prefs.members.length !== 1 ? 's' : ''}</p>
          </div>

          {prefs.members.map((member) => (
            <div key={member.id} className="p-4 space-y-1">
              <p className="text-sm font-medium text-text-primary">{member.name}</p>
              <p className="text-xs text-text-muted">
                {DIET_TYPE_LABELS[member.dietType]} · Spice {member.spiceLevel}/5
              </p>
              {member.allergies.length > 0 && (
                <p className="text-xs text-red-500">Allergies: {member.allergies.join(', ')}</p>
              )}
              {member.healthGoals.length > 0 && (
                <p className="text-xs text-text-muted">
                  Goals: {member.healthGoals.map((g) => HEALTH_GOAL_LABELS[g]).join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-border bg-white divide-y divide-border">
          <div className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Preferences</p>
            <div className="space-y-1 text-sm text-text-primary">
              <p>Cuisines: {prefs.cuisinePreferences.join(', ')}</p>
              <p>Meals per day: {prefs.mealsPerDay}</p>
              <p>Primary goal: {HEALTH_GOAL_LABELS[prefs.primaryGoal]}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Pantry</p>
            <p className="text-sm text-text-primary">
              {prefs.pantryItems.length} item{prefs.pantryItems.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Sign out</p>
            <p className="text-xs text-text-muted mt-0.5">You can sign back in anytime</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
            <LogOut size={14} /> Sign out
          </Button>
        </section>

        <section className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-red-700">Reset everything</p>
          <p className="text-xs text-red-600">
            This will clear all your preferences and pantry data and restart the setup wizard.
          </p>
          {!confirming ? (
            <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
              <Trash2 size={14} /> Reset & start over
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={reset}>
                Yes, reset
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
