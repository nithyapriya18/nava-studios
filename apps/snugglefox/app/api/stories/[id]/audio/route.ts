import { NextRequest, NextResponse } from 'next/server'
import { and, eq, inArray } from 'drizzle-orm'
import { config } from '@/lib/config'
import { db, schema } from '@/lib/db/client'
import { getTtsProvider } from '@/lib/ai/ttsProvider'
import { getAudioStorage } from '@/lib/storage/audioStorage'
import { isUuid } from '@/lib/validation'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    if (!isUuid(id)) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const [story] = await db
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.id, id))
      .limit(1)

    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 })

    // Idempotent: already narrated — hand back the URL without regenerating.
    if (story.audioStatus === 'ready') {
      return NextResponse.json({ audioUrl: `/api/audio/${id}` })
    }

    if (!story.voiceKey) {
      return NextResponse.json(
        { error: 'This story has no narration voice (text-only delivery)' },
        { status: 400 },
      )
    }

    // Atomic claim: only one concurrent request can flip none/failed -> pending.
    // A second request racing the first (e.g. a duplicate background POST from
    // a re-render) gets zero rows back and backs off instead of double-billing
    // the TTS API or racing the file write below.
    const claimed = await db
      .update(schema.stories)
      .set({ audioStatus: 'pending' })
      .where(and(eq(schema.stories.id, id), inArray(schema.stories.audioStatus, ['none', 'failed'])))
      .returning({ id: schema.stories.id })

    if (claimed.length === 0) {
      return NextResponse.json(
        { error: 'Narration is already being generated for this story' },
        { status: 409 },
      )
    }

    let mp3: Buffer
    try {
      mp3 = await getTtsProvider().synthesize({
        text: story.storyText,
        voiceKey: story.voiceKey,
        ageBand: story.ageBand,
      })
      await getAudioStorage().put(id, mp3)
    } catch (synthesisErr) {
      // Only release our own claim — never stomp a row another request has
      // since moved past 'pending' (shouldn't happen given the atomic claim
      // above, but this keeps the state machine honest under any future change).
      await db
        .update(schema.stories)
        .set({ audioStatus: 'failed' })
        .where(and(eq(schema.stories.id, id), eq(schema.stories.audioStatus, 'pending')))
      throw synthesisErr
    }

    await db
      .update(schema.stories)
      .set({ audioStatus: 'ready', ttsModel: config.ttsModel })
      .where(eq(schema.stories.id, id))

    return NextResponse.json({ audioUrl: `/api/audio/${id}` })
  } catch (err) {
    console.error('[stories/[id]/audio:POST]', err)
    return NextResponse.json({ error: 'Failed to generate narration' }, { status: 500 })
  }
}
