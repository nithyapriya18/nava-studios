'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { RefreshCw, CalendarDays, ShoppingCart, Package, ChevronRight, Settings, X, LogOut, User } from 'lucide-react'
import { WeekCalendar } from './WeekCalendar'
import { GroceryList } from './GroceryList'
import { PantryAlerts } from './PantryAlerts'
import { MealDetail } from './MealDetail'
import { Button } from '@/components/ui/Button'
import {
  loadCurrentPlan,
  loadPreferences,
  saveCurrentPlan,
  getPantryAlerts,
  deductMealFromPantry,
} from '@/lib/storage'
import { generateMonthPlan } from '@/lib/mealGenerator'
import type { MealPlan, UserPreferences, PantryAlert, Meal } from '@/lib/types'

type Tab = 'week' | 'grocery' | 'pantry'

// Feedback options shown before full-plan regen
const REGEN_REASONS = [
  { label: 'Too spicy overall',  hint: 'keep all meals mild (spice ≤ 2)' },
  { label: 'Too repetitive',     hint: 'maximise variety across the week' },
  { label: 'Wrong cuisines',     hint: 'strictly follow my cuisine preferences' },
  { label: 'Just shuffle',       hint: '' },
]

interface SwappingMeal { dayIndex: number; mealType: string }

export function MealPlanView() {
  const router = useRouter()
  const { data: session } = useSession()
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [tab, setTab] = useState<Tab>('week')
  const [alerts, setAlerts] = useState<PantryAlert[]>([])

  // Full-plan regen state
  const [regenerating, setRegenerating] = useState(false)
  const [showRegenPanel, setShowRegenPanel] = useState(false)
  const [fullRegenCount, setFullRegenCount] = useState(0)

  // Per-meal swap state
  const [swappingMeal, setSwappingMeal] = useState<SwappingMeal | null>(null)

  // Meal detail modal
  const [selectedMeal, setSelectedMeal] = useState<{ meal: Meal; dayName: string } | null>(null)

  function handleMealClick(dayIndex: number, mealType: string) {
    if (!plan) return
    const day = plan.days[dayIndex]
    const meal = (day.meals as unknown as Record<string, Meal>)[mealType]
    if (meal) setSelectedMeal({ meal, dayName: day.dayName })
  }

  async function handleMarkCooked(meal: Meal) {
    if (!prefs) return
    const updated = await deductMealFromPantry(meal, prefs)
    setPrefs(updated)
    setAlerts(getPantryAlerts(updated.pantryItems))
  }

  const [extendedPlans, setExtendedPlans] = useState<MealPlan[] | null>(null)
  const [activeWeek, setActiveWeek] = useState(0)

  useEffect(() => {
    async function load() {
      const [savedPlan, savedPrefs] = await Promise.all([loadCurrentPlan(), loadPreferences()])
      if (!savedPrefs?.setupComplete) {
        router.replace('/onboarding')
        return
      }
      setPlan(savedPlan)
      setPrefs(savedPrefs)
      setAlerts(getPantryAlerts(savedPrefs.pantryItems))
    }
    load()
  }, [router])

  // ─── Full plan regeneration ───────────────────────────────────────────────

  async function regenerate(feedbackHint?: string) {
    if (!prefs) return
    setShowRegenPanel(false)
    setRegenerating(true)
    setFullRegenCount((c) => c + 1)

    const prefsWithHint = feedbackHint
      ? {
          ...prefs,
          additionalInstructions: [prefs.additionalInstructions, feedbackHint]
            .filter(Boolean)
            .join('. '),
        }
      : prefs

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefsWithHint),
      })
      if (!res.ok) throw new Error('Generation failed')
      const newPlan: MealPlan = await res.json()
      await saveCurrentPlan(newPlan)
      setPlan(newPlan)
      setExtendedPlans(null)
      setActiveWeek(0)
    } finally {
      setRegenerating(false)
    }
  }

  // ─── Per-meal swap ────────────────────────────────────────────────────────

  async function swapMeal(dayIndex: number, mealType: string, reason: string) {
    if (!plan || !prefs) return
    setSwappingMeal({ dayIndex, mealType })

    const day = plan.days[dayIndex]
    const sibling: Record<string, string> = {}
    if (day.meals.breakfast) sibling.breakfast = day.meals.breakfast.name
    if (day.meals.lunch) sibling.lunch = day.meals.lunch.name
    if (day.meals.dinner) sibling.dinner = day.meals.dinner.name
    if (day.meals.snack) sibling.snack = day.meals.snack.name

    try {
      const res = await fetch('/api/generate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayIndex,
          dayName: day.dayName,
          mealType,
          existingMealName: (day.meals as unknown as Record<string, Meal>)[mealType]?.name ?? '',
          sibling,
          reason,
          prefs,
        }),
      })
      if (!res.ok) throw new Error('Swap failed')
      const newMeal: Meal = await res.json()

      // Immutably update just this one meal in the plan
      const newPlan: MealPlan = {
        ...plan,
        days: plan.days.map((d, i) =>
          i !== dayIndex
            ? d
            : { ...d, meals: { ...d.meals, [mealType]: newMeal } },
        ),
      }
      setPlan(newPlan)
      await saveCurrentPlan(newPlan)
    } finally {
      setSwappingMeal(null)
    }
  }

  function extendToMonth() {
    if (!prefs) return
    const plans = generateMonthPlan(prefs)
    setExtendedPlans(plans)
    setActiveWeek(0)
  }

  if (!plan || !prefs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
      </div>
    )
  }

  const displayPlans = extendedPlans ?? [plan]
  const currentPlan = displayPlans[activeWeek] ?? plan

  const TABS = [
    { id: 'week' as Tab, label: 'Meal Plan', icon: CalendarDays },
    { id: 'grocery' as Tab, label: 'Grocery List', icon: ShoppingCart },
    { id: 'pantry' as Tab, label: 'Pantry', icon: Package },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-layout mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white text-sm font-bold">EC</span>
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary leading-tight">EasyCook</p>
              <p className="text-xs text-text-muted">{prefs.householdName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowRegenPanel((v) => !v)}
              disabled={regenerating}
            >
              <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
              {regenerating ? 'Generating…' : 'New plan'}
            </Button>

            {/* User profile button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-1.5 hover:bg-surface transition-colors"
              >
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                )}
                <span className="text-xs font-medium text-text-primary hidden sm:block max-w-[100px] truncate">
                  {session?.user?.name?.split(' ')[0] ?? 'Account'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-border shadow-lg z-20 py-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-text-primary truncate">{session?.user?.name}</p>
                    <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
                    {prefs && <p className="text-xs text-accent mt-0.5">{prefs.householdName}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowUserMenu(false); router.push('/settings') }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-surface transition-colors"
                  >
                    <Settings size={14} /> Settings & Household
                  </button>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-layout mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Full-plan regen feedback panel */}
        {showRegenPanel && (
          <div className="rounded-xl border border-border bg-white p-4 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">What should change?</p>
              <button
                type="button"
                onClick={() => setShowRegenPanel(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {REGEN_REASONS.map(({ label, hint }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => regenerate(hint || undefined)}
                  className="text-sm px-3 py-1.5 rounded-full border border-border bg-surface hover:border-accent hover:text-accent transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
            {fullRegenCount >= 2 && (
              <p className="text-xs text-text-muted border-t border-border pt-2">
                Tip: tap <strong>Swap</strong> on any individual meal — it&apos;s faster and only costs 1/7th as much.
              </p>
            )}
          </div>
        )}

        {alerts.length > 0 && <PantryAlerts alerts={alerts} />}

        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-text-primary">
            {extendedPlans ? `Month plan — ${currentPlan.weekLabel}` : 'This week'}
          </h1>

          {!extendedPlans ? (
            <Button variant="secondary" size="sm" onClick={extendToMonth}>
              Extend to 4 weeks <ChevronRight size={14} />
            </Button>
          ) : (
            <div className="flex gap-1">
              {extendedPlans.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveWeek(idx)}
                  className={`
                    px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                    ${
                      activeWeek === idx
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white border-border text-text-muted hover:border-accent/40'
                    }
                  `}
                >
                  W{idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all
                  ${active ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}
                `}
              >
                <Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'week' && (
          <WeekCalendar
            days={currentPlan.days}
            mealsPerDay={prefs.mealsPerDay}
            startDate={currentPlan.startDate}
            mealTimes={prefs.mealTimes}
            onSwap={swapMeal}
            swappingMeal={swappingMeal}
            onMealClick={handleMealClick}
          />
        )}

        {tab === 'grocery' && (
          <div className="animate-fade-in">
            <GroceryList items={currentPlan.groceryList} />
          </div>
        )}

        {tab === 'pantry' && (
          <div className="animate-fade-in space-y-4">
            <div className="rounded-xl border border-border bg-white divide-y divide-border">
              {prefs.pantryItems.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-muted">
                  No pantry items tracked yet.
                </div>
              ) : (
                prefs.pantryItems.map((item) => {
                  const low = item.quantity <= 0.2
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const expiring =
                    item.expiryDate &&
                    Math.ceil(
                      (new Date(item.expiryDate).getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) <= 3

                  return (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 gap-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{item.name}</p>
                        {item.expiryDate && (
                          <p className={`text-xs ${expiring ? 'text-warning font-medium' : 'text-text-muted'}`}>
                            Expires {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${low ? 'text-red-500' : 'text-text-primary'}`}>
                          {item.quantity} {item.unit}
                        </p>
                        {low && <p className="text-xs text-red-400">Low stock</p>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </main>

      {selectedMeal && (
        <MealDetail
          meal={selectedMeal.meal}
          dayName={selectedMeal.dayName}
          onClose={() => setSelectedMeal(null)}
          onMarkCooked={() => handleMarkCooked(selectedMeal.meal)}
        />
      )}
    </div>
  )
}
