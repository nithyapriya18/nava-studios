'use client'

import type { UserPreferences, MealPlan, PantryItem, PantryAlert, Meal } from './types'
import { LOW_STOCK_THRESHOLD, EXPIRY_WARNING_DAYS } from './types'

// ─── DB-backed API calls ──────────────────────────────────────────────────────

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  await fetch('/api/household', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs),
  })
}

export async function loadPreferences(): Promise<UserPreferences | null> {
  try {
    const res = await fetch('/api/household')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function clearPreferences(): Promise<void> {
  await fetch('/api/household', { method: 'DELETE' })
}

export async function saveCurrentPlan(plan: MealPlan): Promise<void> {
  await fetch('/api/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  })
}

export async function loadCurrentPlan(): Promise<MealPlan | null> {
  try {
    const res = await fetch('/api/plans')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─── Pantry helpers (still sync — operate on in-memory prefs) ─────────────────

/**
 * Deducts ingredients used in a meal from the pantry and persists to DB.
 */
export async function deductMealFromPantry(
  meal: Meal,
  prefs: UserPreferences,
): Promise<UserPreferences> {
  const updatedPantry = prefs.pantryItems.map((item) => {
    const used = meal.ingredients.find(
      (ing) =>
        ing.name.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(ing.name.toLowerCase()),
    )
    if (!used) return item
    const deductAmount = parseFloat(used.quantity) || 0
    const newQty = Math.max(0, item.quantity - deductAmount)
    return { ...item, quantity: newQty }
  })

  const updated = { ...prefs, pantryItems: updatedPantry }
  await savePreferences(updated)
  return updated
}

export function getPantryAlerts(pantryItems: PantryItem[]): PantryAlert[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const alerts: PantryAlert[] = []

  for (const item of pantryItems) {
    if (item.quantity <= LOW_STOCK_THRESHOLD) {
      alerts.push({
        type: 'low-stock',
        item,
        message: `${item.name} is running low (${item.quantity} ${item.unit} left). Time to restock!`,
      })
    }

    if (item.expiryDate) {
      const expiry = new Date(item.expiryDate)
      expiry.setHours(0, 0, 0, 0)
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        alerts.push({
          type: 'expired',
          item,
          message: `${item.name} expired on ${expiry.toLocaleDateString()}. Please discard.`,
        })
      } else if (diffDays <= EXPIRY_WARNING_DAYS) {
        alerts.push({
          type: 'expiring-soon',
          item,
          message: `${item.name} expires in ${diffDays} day${diffDays === 1 ? '' : 's'} — use it soon!`,
        })
      }
    }
  }

  return alerts
}
