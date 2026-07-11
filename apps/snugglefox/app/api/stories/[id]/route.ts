import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/lib/db/client'
import { isUuid } from '@/lib/validation'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!isUuid(id)) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const [row] = await db
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.id, id))
      .limit(1)

    if (!row) return NextResponse.json({ error: 'Story not found' }, { status: 404 })

    return NextResponse.json(row)
  } catch (err) {
    console.error('[stories/[id]:GET]', err)
    return NextResponse.json({ error: 'Failed to load story' }, { status: 500 })
  }
}
