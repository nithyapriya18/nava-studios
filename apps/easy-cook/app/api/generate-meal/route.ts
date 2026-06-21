import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import type { UserPreferences, Meal, GroceryCategory, MealType, SpiceLevel } from '@/lib/types'

const client = new Anthropic()

const CAT: Record<string, GroceryCategory> = {
  prod: 'produce', dairy: 'dairy', meat: 'meat-seafood', grain: 'grains-legumes',
  spice: 'spices-condiments', oil: 'oils-fats', bev: 'beverages',
  frz: 'frozen', can: 'canned', other: 'other',
}

// Extra constraint injected into the prompt based on user's swap reason
const REASON_HINTS: Record<string, string> = {
  'Too spicy':    'Keep spice level ≤ 2. Use mild ingredients.',
  'Too complex':  'Keep total prep+cook time ≤ 20 minutes. Simple recipe.',
  'Repetitive':   'Use a completely different cuisine and different main protein from the other meals today.',
  'Wrong cuisine': 'Use a different cuisine from the other meals today.',
  'Different':    'Just suggest a different meal from a different cuisine.',
}

interface SwapRequest {
  dayIndex: number
  dayName: string
  mealType: string
  existingMealName: string
  sibling: Record<string, string>   // { breakfast: "Meal Name", lunch: "..." }
  reason: string
  prefs: UserPreferences
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { dayIndex, dayName, mealType, existingMealName, sibling, reason, prefs }: SwapRequest =
      await req.json()

    const allAllergens = [...new Set(prefs.members.flatMap((m) => m.allergies))]
    const allDietTypes = [...new Set(prefs.members.map((m) => m.dietType))]
    const strictestDiet = allDietTypes.includes('veg')
      ? 'veg'
      : allDietTypes.includes('vegan')
        ? 'vegan'
        : allDietTypes.includes('eggetarian')
          ? 'eggetarian'
          : 'non-veg'

    const members = prefs.members
      .map((m) =>
        `${m.name}: diet=${m.dietType}, spice=${m.spiceLevel}/5` +
        (m.allergies.length ? `, allergies=[${m.allergies.join(',')}]` : ''),
      )
      .join('; ')

    const pantry = prefs.pantryItems
      .map((p) => `${p.name} ${p.quantity}${p.unit}`)
      .join(', ') || 'empty'

    const siblingList = Object.entries(sibling)
      .filter(([type]) => type !== mealType)
      .map(([type, name]) => `${type}=${name}`)
      .join(', ')

    const hint = REASON_HINTS[reason] ?? REASON_HINTS['Different']

    const hardRules = [
      allAllergens.length
        ? `NEVER use these allergens (household allergy): ${allAllergens.join(', ')}`
        : null,
      strictestDiet === 'veg'
        ? 'NO meat, fish, seafood, or eggs — at least one member is vegetarian'
        : strictestDiet === 'vegan'
          ? 'NO meat, fish, seafood, eggs, or dairy — at least one member is vegan'
          : strictestDiet === 'eggetarian'
            ? 'NO meat or fish — at least one member is eggetarian'
            : null,
    ]
      .filter(Boolean)
      .join('\n')

    const prompt = `Generate ONE replacement ${mealType} for ${dayName}.

HOUSEHOLD: members=[${members}], cuisines=[${prefs.cuisinePreferences.join(',') || 'any'}], goal=${prefs.primaryGoal}
PANTRY: ${pantry}
OTHER MEALS TODAY: ${siblingList || 'none'}
REPLACE: "${existingMealName}" — do NOT suggest the same meal again
REASON: ${reason}. ${hint}
${hardRules ? `\nHARD RULES (violations are unacceptable):\n${hardRules}` : ''}

Return ONE compact meal JSON (no markdown, no explanation):
{"id":"d${dayIndex}-${mealType.slice(0,1)}","name":"","cui":"","prep":5,"cook":15,"srv":${prefs.members.length || 2},"desc":"max 10 words","spice":2,"allergy":[],"ing":["Name|qty|unit|cat"],"mac":[cal,protein,carbs,fat,fiber,sugar]}

Category codes: prod dairy meat grain spice oil bev frz can other`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = (message.content as Anthropic.ContentBlock[])
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')

    const cleaned = rawText.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim()
    const c = JSON.parse(cleaned)

    const meal: Meal = {
      id: c.id,
      name: c.name,
      type: mealType as MealType,
      cuisine: c.cui,
      dietTypes: [],
      healthGoals: [],
      prepTime: c.prep,
      cookTime: c.cook,
      servings: c.srv,
      description: c.desc,
      spiceLevel: (c.spice ?? 3) as SpiceLevel,
      allergens: c.allergy ?? [],
      ingredients: (c.ing ?? []).map((s: string) => {
        const [name, quantity, unit, cat] = s.split('|')
        return { name, quantity, unit, category: CAT[cat] ?? 'other' }
      }),
      nutrition: {
        macros: {
          calories: c.mac?.[0] ?? 0,
          protein: c.mac?.[1] ?? 0,
          carbs: c.mac?.[2] ?? 0,
          fat: c.mac?.[3] ?? 0,
          fiber: c.mac?.[4] ?? 0,
          sugar: c.mac?.[5] ?? 0,
        },
        micros: {},
      },
    }

    return NextResponse.json(meal)
  } catch (err) {
    console.error('[generate-meal]', err)
    return NextResponse.json({ error: 'Failed to generate meal' }, { status: 500 })
  }
}
