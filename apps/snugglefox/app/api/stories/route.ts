import { NextRequest, NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { AGE_BANDS, DELIVERY_MODES, GENDERS, LENGTH_PRESETS } from '@/lib/constants'
import { config } from '@/lib/config'
import { db, schema } from '@/lib/db/client'
import { getStoryProvider } from '@/lib/ai/storyProvider'
import { VOICE_PRESETS } from '@/lib/ai/voices'
import type { StoryRequest } from '@/lib/types'

const HISTORY_LIMIT = 20

function validationError(body: Partial<StoryRequest>): string | null {
  const required: (keyof StoryRequest)[] = [
    'deviceId',
    'childName',
    'gender',
    'ageBand',
    'prompt',
    'lengthKey',
    'deliveryMode',
  ]
  for (const field of required) {
    if (!body[field] || typeof body[field] !== 'string') return `Missing required field: ${field}`
  }
  if (!GENDERS.some((g) => g.key === body.gender)) return `Invalid gender: ${body.gender}`
  if (!AGE_BANDS.some((b) => b.key === body.ageBand)) return `Invalid ageBand: ${body.ageBand}`
  if (!LENGTH_PRESETS.some((p) => p.key === body.lengthKey))
    return `Invalid lengthKey: ${body.lengthKey}`
  if (!DELIVERY_MODES.some((m) => m.key === body.deliveryMode))
    return `Invalid deliveryMode: ${body.deliveryMode}`
  if (body.deliveryMode !== 'text') {
    if (!body.voiceKey) return 'voiceKey is required when deliveryMode includes audio'
    if (!VOICE_PRESETS.some((v) => v.key === body.voiceKey))
      return `Invalid voiceKey: ${body.voiceKey}`
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body: StoryRequest = await req.json()

    const error = validationError(body)
    if (error) return NextResponse.json({ error }, { status: 400 })

    const { title, text } = await getStoryProvider().generateStory({
      childName: body.childName.trim(),
      gender: body.gender,
      ageBand: body.ageBand,
      prompt: body.prompt.trim(),
      lengthKey: body.lengthKey,
    })

    const [row] = await db
      .insert(schema.stories)
      .values({
        deviceId: body.deviceId,
        childName: body.childName.trim(),
        gender: body.gender,
        ageBand: body.ageBand,
        prompt: body.prompt.trim(),
        lengthKey: body.lengthKey,
        deliveryMode: body.deliveryMode,
        voiceKey: body.deliveryMode === 'text' ? null : body.voiceKey,
        title,
        storyText: text,
        storyModel: config.storyModel,
      })
      .returning()

    return NextResponse.json(row)
  } catch (err) {
    console.error('[stories:POST]', err)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const deviceId = req.nextUrl.searchParams.get('deviceId')
    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId query param is required' }, { status: 400 })
    }

    const rows = await db
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.deviceId, deviceId))
      .orderBy(desc(schema.stories.createdAt))
      .limit(HISTORY_LIMIT)

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[stories:GET]', err)
    return NextResponse.json({ error: 'Failed to load stories' }, { status: 500 })
  }
}
