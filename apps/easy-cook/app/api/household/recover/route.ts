import { NextResponse } from 'next/server'
import { eq, isNull } from 'drizzle-orm'
import { db, schema } from '@/lib/db/client'
import { auth } from '@/auth'

// POST /api/household/recover
// Finds any household with user_id = NULL and stamps the current user's Google ID onto it.
// This handles the case where a household was created before OAuth was added.
export async function POST() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  try {
    // Check if user already has a household
    const [existing] = await db
      .select({ id: schema.households.id })
      .from(schema.households)
      .where(eq(schema.households.userId, userId))

    if (existing) {
      return NextResponse.json({ ok: true, message: 'already_linked' })
    }

    // Find any orphaned household (created before OAuth, user_id is NULL)
    const [orphan] = await db
      .select({ id: schema.households.id, name: schema.households.name })
      .from(schema.households)
      .where(isNull(schema.households.userId))
      .limit(1)

    if (!orphan) {
      return NextResponse.json({ error: 'No existing household found. Please complete setup.' }, { status: 404 })
    }

    // Claim it
    await db
      .update(schema.households)
      .set({ userId, updatedAt: new Date() })
      .where(eq(schema.households.id, orphan.id))

    return NextResponse.json({ ok: true, household: orphan.name })
  } catch (err) {
    console.error('[recover]', err)
    return NextResponse.json(
      { error: 'Database error — make sure you have run the migrations in Neon.' },
      { status: 503 },
    )
  }
}
