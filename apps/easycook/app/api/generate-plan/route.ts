import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import type { UserPreferences, MealPlan, DayPlan, Meal, GroceryItem, GroceryCategory, MealType, SpiceLevel } from '@/lib/types'

const client = new Anthropic()

// ─── Compact format types (what Claude actually returns) ──────────────────────

interface CompactMeal {
  id: string
  name: string
  cui: string
  prep: number
  cook: number
  srv: number
  desc: string
  spice: number
  allergy: string[]
  sides?: string        // e.g. "Serve with 8 rotis (3 per adult, 2 for child)"
  ing: string[]         // "Name|qty|unit|cat"
  mac: number[]         // [calories, protein, carbs, fat, fiber, sugar]
  ins: string[]         // cooking steps
}

interface CompactDay {
  day: string
  date: string          // "2024-06-24"
  prep: string[]        // "Soak chana tonight for tomorrow"
  meals: Record<string, CompactMeal>
}

interface CompactPlan {
  id: string
  at: string
  week: string
  start: string         // start date ISO
  days: CompactDay[]
  grocery: Array<{ n: string; qty: string; unit: string; cat: string; meals: string[] }>
}

// ─── Category shortcode → full name ──────────────────────────────────────────

const CAT: Record<string, GroceryCategory> = {
  prod: 'produce', dairy: 'dairy', meat: 'meat-seafood', grain: 'grains-legumes',
  spice: 'spices-condiments', oil: 'oils-fats', bev: 'beverages',
  frz: 'frozen', can: 'canned', other: 'other',
}

// ─── Expand compact → full MealPlan ──────────────────────────────────────────

function expandPlan(c: CompactPlan): MealPlan {
  function expandMeal(m: CompactMeal, type: string): Meal {
    return {
      id: m.id,
      name: m.name,
      type: type as MealType,
      cuisine: m.cui,
      dietTypes: [],
      healthGoals: [],
      prepTime: m.prep,
      cookTime: m.cook,
      servings: m.srv,
      description: m.desc,
      spiceLevel: (m.spice ?? 3) as SpiceLevel,
      allergens: m.allergy ?? [],
      sides: m.sides,
      instructions: m.ins ?? [],
      ingredients: (m.ing ?? []).map((s) => {
        const [name, quantity, unit, cat] = s.split('|')
        return { name, quantity, unit, category: CAT[cat] ?? 'other' }
      }),
      nutrition: {
        macros: {
          calories: m.mac?.[0] ?? 0,
          protein: m.mac?.[1] ?? 0,
          carbs: m.mac?.[2] ?? 0,
          fat: m.mac?.[3] ?? 0,
          fiber: m.mac?.[4] ?? 0,
          sugar: m.mac?.[5] ?? 0,
        },
        micros: {},
      },
    }
  }

  return {
    id: c.id,
    generatedAt: c.at,
    weekLabel: c.week,
    startDate: c.start,
    days: c.days.map((d, i): DayPlan => ({
      dayIndex: i,
      dayName: d.day,
      date: d.date,
      prepNotes: d.prep ?? [],
      meals: Object.fromEntries(
        Object.entries(d.meals).map(([type, meal]) => [type, expandMeal(meal, type)])
      ) as unknown as DayPlan['meals'],
    })),
    groceryList: (c.grocery ?? []).map((g): GroceryItem => ({
      ingredientName: g.n,
      quantity: g.qty,
      unit: g.unit,
      category: CAT[g.cat] ?? 'other',
      meals: g.meals ?? [],
    })),
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(prefs: UserPreferences): string {
  // Household composition
  const adults = prefs.members.filter((m) => !m.age || parseInt(m.age) >= 12).length || 2
  const children = prefs.members.filter((m) => m.age && parseInt(m.age) < 12).length
  const totalSrv = adults + children

  const rotiNote = adults > 0
    ? `For meals with roti/bread: ${adults * 3 + children * 2} rotis total (${adults} adult×3, ${children > 0 ? `${children} child×2` : 'no children'})`
    : ''
  const riceNote = `For meals with rice: ${adults * 150 + children * 75}g total (${adults} adult×150g, ${children > 0 ? `${children} child×75g` : ''})`

  const members = prefs.members
    .map(
      (m) =>
        `  - ${m.name} (age ${m.age || '?'}): diet=${m.dietType}, spice=${m.spiceLevel}/5` +
        (m.allergies.length ? `, allergies=[${m.allergies.join(',')}]` : '') +
        (m.likes.length ? `, likes=[${m.likes.join(',')}]` : '') +
        (m.dislikes.length ? `, dislikes=[${m.dislikes.join(',')}]` : '') +
        (m.healthGoals.length ? `, goals=[${m.healthGoals.join(',')}]` : ''),
    )
    .join('\n')

  const pantry = prefs.pantryItems
    .map((p) => `  ${p.name}: ${p.quantity}${p.unit}${p.expiryDate ? ` exp:${p.expiryDate}` : ''}`)
    .join('\n')

  const startDate = prefs.planStartDate ?? new Date().toISOString().split('T')[0]
  const days = Array.from({ length: 7 }, (_, i) => {
    const iso = addDays(startDate, i)
    return { iso, label: formatDate(iso) }
  })
  const weekLabel = `${days[0].label} – ${days[6].label}`
  const allMealTypes = prefs.mealsPerDay === 4
    ? ['breakfast', 'lunch', 'dinner', 'snack']
    : prefs.mealsPerDay === 3
      ? ['breakfast', 'lunch', 'dinner']
      : ['breakfast', 'dinner']
  const mealTypes = allMealTypes.join(',')

  // Day 1 may start partway through (e.g. only dinner if user sets up in the evening)
  const startMeal = prefs.planStartMeal ?? 'breakfast'
  const startMealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }
  const day1MealTypes = allMealTypes.filter(
    (m) => (startMealOrder[m as keyof typeof startMealOrder] ?? 0) >= startMealOrder[startMeal]
  )
  const day1Note = startMeal !== 'breakfast'
    ? `DAY 1 SPECIAL: Start from ${startMeal} only — skip earlier meals. Day 1 meals: ${day1MealTypes.join(', ')}.`
    : ''

  return `Generate a 7-day personalised meal plan as compact JSON.

HOUSEHOLD: "${prefs.householdName}"
MEMBERS (total ${totalSrv} — ${adults} adult${adults !== 1 ? 's' : ''}, ${children} child${children !== 1 ? 'ren' : ''}):
${members || '  (2 adults)'}
SETTINGS: cuisines=[${prefs.cuisinePreferences.join(',') || 'any'}], goal=${prefs.primaryGoal}, meals/day=${prefs.mealsPerDay} (${mealTypes})
PANTRY (use first):
${pantry || '  (empty)'}
${prefs.additionalInstructions ? `SPECIAL INSTRUCTIONS (override defaults): ${prefs.additionalInstructions}\n` : ''}
SERVING RULES:
- All quantities must feed ${totalSrv} people (${adults} adult${adults !== 1 ? 's' : ''}, ${children} child${children !== 1 ? 'ren' : ''})
- ${rotiNote}
- ${riceNote}
- NEVER serve a main dish alone. Always include accompaniments as ingredients (rotis, rice, raita, bread, etc.)
- Example: Paneer Bhurji dinner must include whole wheat flour (for rotis) + ghee in the ingredient list

PLAN RULES:
1. Respect ALL diet restrictions and allergens
2. Vary cuisines — no same cuisine on consecutive days
3. Accurate macros for full meal including sides
4. Use pantry items first; grocery list = items NOT in pantry
5. STRICT MAX 6 ingredients per meal (include accompaniments, cut the rest)
6. Prep notes: if any ingredient needs advance prep, add to PREVIOUS day's prep array. Max 1 prep note per day.
7. desc: max 6 words. NO ins field — instructions are loaded separately on demand
${day1Note ? `9. ${day1Note}` : ''}
PLAN DATES:
${days.map((d, i) => `  Day ${i}: ${d.label} (${d.iso})`).join('\n')}

Output MINIFIED JSON only — no spaces, no newlines, no markdown. Every byte counts.
{"id":"plan-001","at":"<ISO>","week":"${weekLabel}","start":"${startDate}","days":[{"day":"${days[0].label}","date":"${days[0].iso}","prep":["prep note"],"meals":{${day1MealTypes.map((m) => `"${m}":{"id":"d0-${m.slice(0,1)}","name":"","cui":"","prep":10,"cook":15,"srv":${totalSrv},"desc":"6 words","spice":2,"allergy":[],"sides":"X rotis","ing":["Name|qty|unit|cat"],"mac":[cal,p,c,f,fi,s]}`).join(',')}}},{"day":"${days[1].label}","date":"${days[1].iso}","prep":[...],"meals":{...}},{"day":"${days[2].label}","date":"${days[2].iso}","prep":[...],"meals":{...}},{"day":"${days[3].label}","date":"${days[3].iso}","prep":[...],"meals":{...}},{"day":"${days[4].label}","date":"${days[4].iso}","prep":[...],"meals":{...}},{"day":"${days[5].label}","date":"${days[5].iso}","prep":[...],"meals":{...}},{"day":"${days[6].label}","date":"${days[6].iso}","prep":[...],"meals":{...}}],"grocery":[{"n":"","qty":"","unit":"","cat":"","meals":["meal name"]}]}

Category codes: prod=produce dairy=dairy meat=meat-seafood grain=grains-legumes spice=spices-condiments oil=oils-fats bev=beverages frz=frozen can=canned other=other
mac order: [calories,protein_g,carbs_g,fat_g,fiber_g,sugar_g]`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const prefs: UserPreferences = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured. Add it to .env.local.' },
        { status: 500 },
      )
    }

    const prompt = buildPrompt(prefs)

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })

    const message = await stream.finalMessage()

    if (message.stop_reason === 'max_tokens') {
      return NextResponse.json(
        { error: 'Plan generation was cut short — please try again.' },
        { status: 500 },
      )
    }

    const rawText = (message.content as Anthropic.ContentBlock[])
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b: Anthropic.TextBlock) => b.text)
      .join('')

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim()

    const compact: CompactPlan = JSON.parse(cleaned)
    const plan = expandPlan(compact)

    return NextResponse.json(plan)
  } catch (err) {
    console.error('[generate-plan]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
