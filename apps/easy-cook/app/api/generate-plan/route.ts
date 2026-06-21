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
  ing: string[]         // "Name|qty|unit|cat" e.g. "Rice|200|g|grain"
  mac: number[]         // [calories, protein, carbs, fat, fiber, sugar]
}

interface CompactDay {
  day: string           // "Mon", "Tue", ...
  meals: Record<string, CompactMeal>
}

interface CompactPlan {
  id: string
  at: string
  week: string
  days: CompactDay[]
  grocery: Array<{ n: string; qty: string; unit: string; cat: string; meals: string[] }>
}

// ─── Category shortcode → full name ──────────────────────────────────────────

const CAT: Record<string, GroceryCategory> = {
  prod: 'produce',
  dairy: 'dairy',
  meat: 'meat-seafood',
  grain: 'grains-legumes',
  spice: 'spices-condiments',
  oil: 'oils-fats',
  bev: 'beverages',
  frz: 'frozen',
  can: 'canned',
  other: 'other',
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
    days: c.days.map((d, i): DayPlan => ({
      dayIndex: i,
      dayName: DAYS[i] ?? d.day,
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

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(prefs: UserPreferences): string {
  const members = prefs.members
    .map(
      (m) =>
        `  - ${m.name} (${m.age}): diet=${m.dietType}, spice=${m.spiceLevel}/5` +
        (m.allergies.length ? `, allergies=[${m.allergies.join(',')}]` : '') +
        (m.likes.length ? `, likes=[${m.likes.join(',')}]` : '') +
        (m.dislikes.length ? `, dislikes=[${m.dislikes.join(',')}]` : '') +
        (m.healthGoals.length ? `, goals=[${m.healthGoals.join(',')}]` : ''),
    )
    .join('\n')

  const pantry = prefs.pantryItems
    .map((p) => `  ${p.name}: ${p.quantity}${p.unit}${p.expiryDate ? ` exp:${p.expiryDate}` : ''}`)
    .join('\n')

  const today = new Date()
  const weekLabel = `Week of ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  const mealTypes = prefs.mealsPerDay === 4 ? 'breakfast,lunch,dinner,snack' : prefs.mealsPerDay === 3 ? 'breakfast,lunch,dinner' : 'breakfast,dinner'

  return `Generate a 7-day personalised meal plan as compact JSON.

HOUSEHOLD: "${prefs.householdName}"
MEMBERS:
${members || '  (none)'}
SETTINGS: cuisines=[${prefs.cuisinePreferences.join(',') || 'any'}], goal=${prefs.primaryGoal}, meals/day=${prefs.mealsPerDay} (${mealTypes})
PANTRY (use first):
${pantry || '  (empty)'}
${prefs.additionalInstructions ? `SPECIAL INSTRUCTIONS (override defaults): ${prefs.additionalInstructions}\n` : ''}
RULES: 1.Respect all diet restrictions/allergens 2.Vary cuisines (no same 2 days in a row) 3.Accurate macros 4.Use pantry first 5.Grocery list=only items NOT in pantry 6.Max 7 ingredients/meal

Return ONLY valid compact JSON (no markdown):
{
  "id":"plan-001","at":"<ISO>","week":"${weekLabel}",
  "days":[
    {"day":"Mon","meals":{
      "breakfast":{"id":"d0-b","name":"","cui":"","prep":10,"cook":15,"srv":2,"desc":"max 10 words","spice":3,"allergy":[],"ing":["Name|qty|unit|cat"],"mac":[cal,protein,carbs,fat,fiber,sugar]},
      "lunch":{...},"dinner":{...}
    }},
    {"day":"Tue",...},{"day":"Wed",...},{"day":"Thu",...},{"day":"Fri",...},{"day":"Sat",...},{"day":"Sun",...}
  ],
  "grocery":[{"n":"","qty":"","unit":"","cat":"","meals":["meal name"]}]
}

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
      max_tokens: 8000,
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
