import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db, schema } from '@/lib/db/client'
import { auth } from '@/auth'
import type { MealPlan } from '@/lib/types'

async function getHouseholdId(userId: string): Promise<string | null> {
  const [household] = await db
    .select({ id: schema.households.id })
    .from(schema.households)
    .where(eq(schema.households.userId, userId))
  return household?.id ?? null
}

// GET /api/plans — load the current active plan for the signed-in user
export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json(null, { status: 401 })

  const householdId = await getHouseholdId(session.user.id)
  if (!householdId) return NextResponse.json(null)

  const [plan] = await db
    .select()
    .from(schema.mealPlans)
    .where(and(eq(schema.mealPlans.householdId, householdId), eq(schema.mealPlans.isCurrent, true)))
    .limit(1)

  if (!plan) return NextResponse.json(null)

  const mealPlan: MealPlan = {
    id: plan.id,
    generatedAt: plan.generatedAt.toISOString(),
    weekLabel: plan.weekLabel,
    days: plan.days as MealPlan['days'],
    groceryList: plan.groceryList as MealPlan['groceryList'],
  }

  return NextResponse.json(mealPlan)
}

// POST /api/plans — save a new plan and mark it as current
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const householdId = await getHouseholdId(session.user.id)
  if (!householdId) return NextResponse.json({ error: 'No household found' }, { status: 400 })

  const plan: MealPlan = await req.json()

  // Demote previous current plans
  await db
    .update(schema.mealPlans)
    .set({ isCurrent: false })
    .where(and(eq(schema.mealPlans.householdId, householdId), eq(schema.mealPlans.isCurrent, true)))

  await db.insert(schema.mealPlans).values({
    id: plan.id,
    householdId,
    generatedAt: new Date(plan.generatedAt),
    weekLabel: plan.weekLabel,
    days: plan.days,
    groceryList: plan.groceryList,
    isCurrent: true,
  })

  return NextResponse.json({ ok: true })
}
