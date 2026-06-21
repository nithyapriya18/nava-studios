import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/lib/db/client'
import { auth } from '@/auth'
import type { UserPreferences } from '@/lib/types'

async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

// GET /api/household — load full household data for the signed-in user
export async function GET(_req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json(null, { status: 401 })

  const [household] = await db
    .select()
    .from(schema.households)
    .where(eq(schema.households.userId, userId))

  if (!household) return NextResponse.json(null)

  const members = await db
    .select()
    .from(schema.members)
    .where(eq(schema.members.householdId, household.id))

  const pantryItems = await db
    .select()
    .from(schema.pantryItems)
    .where(eq(schema.pantryItems.householdId, household.id))

  const prefs: UserPreferences = {
    householdName: household.name,
    primaryGoal: household.primaryGoal as UserPreferences['primaryGoal'],
    mealsPerDay: household.mealsPerDay as UserPreferences['mealsPerDay'],
    cuisinePreferences: household.cuisinePreferences,
    additionalInstructions: household.additionalInstructions ?? undefined,
    setupComplete: household.setupComplete,
    setupDate: household.setupDate?.toISOString() ?? '',
    members: members.map((m) => ({
      id: m.id,
      name: m.name,
      age: m.age,
      dietType: m.dietType as UserPreferences['members'][0]['dietType'],
      spiceLevel: m.spiceLevel as UserPreferences['members'][0]['spiceLevel'],
      allergies: m.allergies,
      likes: m.likes,
      dislikes: m.dislikes,
      healthGoals: m.healthGoals as UserPreferences['members'][0]['healthGoals'],
    })),
    pantryItems: pantryItems.map((p) => ({
      id: p.id,
      name: p.name,
      quantity: parseFloat(p.quantity),
      unit: p.unit,
      expiryDate: p.expiryDate ?? undefined,
    })),
  }

  return NextResponse.json(prefs)
}

// POST /api/household — upsert full household preferences for the signed-in user
export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const prefs: UserPreferences = await req.json()

  // Upsert household keyed on userId
  const [household] = await db
    .insert(schema.households)
    .values({
      userId,
      name: prefs.householdName,
      primaryGoal: prefs.primaryGoal,
      mealsPerDay: prefs.mealsPerDay,
      cuisinePreferences: prefs.cuisinePreferences,
      additionalInstructions: prefs.additionalInstructions ?? null,
      setupComplete: prefs.setupComplete,
      setupDate: prefs.setupDate ? new Date(prefs.setupDate) : null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.households.userId,
      set: {
        name: prefs.householdName,
        primaryGoal: prefs.primaryGoal,
        mealsPerDay: prefs.mealsPerDay,
        cuisinePreferences: prefs.cuisinePreferences,
        additionalInstructions: prefs.additionalInstructions ?? null,
        setupComplete: prefs.setupComplete,
        setupDate: prefs.setupDate ? new Date(prefs.setupDate) : null,
        updatedAt: new Date(),
      },
    })
    .returning()

  const householdId = household.id

  // Replace members
  await db.delete(schema.members).where(eq(schema.members.householdId, householdId))
  if (prefs.members.length > 0) {
    await db.insert(schema.members).values(
      prefs.members.map((m) => ({
        id: m.id,
        householdId,
        name: m.name,
        age: m.age,
        dietType: m.dietType,
        spiceLevel: m.spiceLevel,
        allergies: m.allergies,
        likes: m.likes,
        dislikes: m.dislikes,
        healthGoals: m.healthGoals,
      })),
    )
  }

  // Replace pantry items
  await db.delete(schema.pantryItems).where(eq(schema.pantryItems.householdId, householdId))
  if (prefs.pantryItems.length > 0) {
    await db.insert(schema.pantryItems).values(
      prefs.pantryItems.map((p) => ({
        id: p.id,
        householdId,
        name: p.name,
        quantity: String(p.quantity),
        unit: p.unit,
        expiryDate: p.expiryDate ?? null,
        updatedAt: new Date(),
      })),
    )
  }

  return NextResponse.json({ householdId })
}

// DELETE /api/household — clear all data (reset, keeps the user signed in)
export async function DELETE(_req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [household] = await db
    .select({ id: schema.households.id })
    .from(schema.households)
    .where(eq(schema.households.userId, userId))

  if (household) {
    await db.delete(schema.households).where(eq(schema.households.id, household.id))
  }

  return NextResponse.json({ ok: true })
}
