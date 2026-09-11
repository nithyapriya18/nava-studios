import type { UserPreferences, Meal, DayPlan, MealPlan, GroceryItem, DayMeals, DietType, HealthGoal } from './types'
import { MEAL_DATABASE } from './mealData'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getHouseholdDietTypes(prefs: UserPreferences): Set<DietType> {
  return new Set(prefs.members.map((m) => m.dietType))
}

function mealFitsHousehold(
  meal: Meal,
  dietTypes: Set<DietType>,
  allergens: Set<string>,
  preferredCuisines: string[],
  spiceMax: SpiceLevel
): boolean {
  const hasValidDiet = meal.dietTypes.some((d) => dietTypes.has(d))
  if (!hasValidDiet) return false

  const hasAllergen = meal.allergens.some((a) => allergens.has(a))
  if (hasAllergen) return false

  if (meal.spiceLevel > spiceMax) return false

  return true
}

function cuisineScore(meal: Meal, preferredCuisines: string[]): number {
  return preferredCuisines.includes(meal.cuisine) ? 1 : 0
}

function healthGoalScore(meal: Meal, goals: Set<HealthGoal>): number {
  return meal.healthGoals.filter((g) => goals.has(g)).length
}

function pickMeal(
  pool: Meal[],
  used: Set<string>,
  preferredCuisines: string[],
  healthGoals: Set<HealthGoal>
): Meal {
  const available = pool.filter((m) => !used.has(m.id))
  if (available.length === 0) {
    const fallback = pool.find((m) => !used.has(m.id)) ?? pool[0]
    return fallback
  }

  const scored = available.map((m) => ({
    meal: m,
    score: cuisineScore(m, preferredCuisines) * 2 + healthGoalScore(m, healthGoals),
  }))
  scored.sort((a, b) => b.score - a.score)

  const topN = Math.min(3, scored.length)
  const pick = scored[Math.floor(Math.random() * topN)]
  return pick.meal
}

import type { SpiceLevel } from './types'

export function generateWeekPlan(prefs: UserPreferences): MealPlan {
  const dietTypes = getHouseholdDietTypes(prefs)

  const allAllergens = new Set(prefs.members.flatMap((m) => m.allergies))

  const spiceMax = Math.max(...prefs.members.map((m) => m.spiceLevel)) as SpiceLevel

  const healthGoals = new Set(
    prefs.members.flatMap((m) => m.healthGoals).concat([prefs.primaryGoal])
  )

  const filter = (m: Meal) =>
    mealFitsHousehold(m, dietTypes, allAllergens, prefs.cuisinePreferences, spiceMax)

  const breakfastPool = MEAL_DATABASE.filter((m) => m.type === 'breakfast' && filter(m))
  const lunchPool = MEAL_DATABASE.filter((m) => m.type === 'lunch' && filter(m))
  const dinnerPool = MEAL_DATABASE.filter((m) => m.type === 'dinner' && filter(m))
  const snackPool = MEAL_DATABASE.filter((m) => m.type === 'snack' && filter(m))

  const usedBreakfasts = new Set<string>()
  const usedLunches = new Set<string>()
  const usedDinners = new Set<string>()
  const usedSnacks = new Set<string>()

  const days: DayPlan[] = DAY_NAMES.map((dayName, idx) => {
    const breakfast = pickMeal(
      breakfastPool.length > 0 ? breakfastPool : MEAL_DATABASE.filter((m) => m.type === 'breakfast'),
      usedBreakfasts,
      prefs.cuisinePreferences,
      healthGoals
    )
    usedBreakfasts.add(breakfast.id)

    const lunch = pickMeal(
      lunchPool.length > 0 ? lunchPool : MEAL_DATABASE.filter((m) => m.type === 'lunch'),
      usedLunches,
      prefs.cuisinePreferences,
      healthGoals
    )
    usedLunches.add(lunch.id)

    const dinner = pickMeal(
      dinnerPool.length > 0 ? dinnerPool : MEAL_DATABASE.filter((m) => m.type === 'dinner'),
      usedDinners,
      prefs.cuisinePreferences,
      healthGoals
    )
    usedDinners.add(dinner.id)

    let snack: Meal | undefined
    if (prefs.mealsPerDay >= 4) {
      snack = pickMeal(
        snackPool.length > 0 ? snackPool : MEAL_DATABASE.filter((m) => m.type === 'snack'),
        usedSnacks,
        prefs.cuisinePreferences,
        healthGoals
      )
      usedSnacks.add(snack.id)
    }

    const meals: DayMeals = { breakfast, lunch, dinner, snack }
    return { dayIndex: idx, dayName, meals }
  })

  const groceryList = buildGroceryList(days, prefs)

  return {
    id: `plan-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    weekLabel: 'Week 1',
    days,
    groceryList,
  }
}

export function generateMonthPlan(prefs: UserPreferences): MealPlan[] {
  return [1, 2, 3, 4].map((weekNum) => {
    const plan = generateWeekPlan(prefs)
    return { ...plan, id: `plan-week-${weekNum}-${Date.now()}`, weekLabel: `Week ${weekNum}` }
  })
}

function buildGroceryList(days: DayPlan[], prefs: UserPreferences): GroceryItem[] {
  const pantryNames = new Set(
    prefs.pantryItems
      .filter((p) => p.quantity > LOW_STOCK_THRESHOLD)
      .map((p) => p.name.toLowerCase())
  )

  const aggregated = new Map<string, GroceryItem>()

  for (const day of days) {
    const meals = [day.meals.breakfast, day.meals.lunch, day.meals.dinner, day.meals.snack].filter(
      Boolean
    ) as Meal[]

    for (const meal of meals) {
      for (const ing of meal.ingredients) {
        const key = ing.name.toLowerCase()
        const inPantry = [...pantryNames].some(
          (p) => p.includes(key) || key.includes(p)
        )
        if (inPantry) continue

        if (aggregated.has(key)) {
          const existing = aggregated.get(key)!
          if (!existing.meals.includes(meal.name)) {
            existing.meals.push(meal.name)
          }
        } else {
          aggregated.set(key, {
            ingredientName: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            category: ing.category,
            meals: [meal.name],
          })
        }
      }
    }
  }

  return Array.from(aggregated.values()).sort((a, b) =>
    a.category.localeCompare(b.category)
  )
}

const LOW_STOCK_THRESHOLD = 0.2
