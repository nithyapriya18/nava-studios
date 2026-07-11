import { NextRequest, NextResponse } from 'next/server'
import { getAudioStorage } from '@/lib/storage/audioStorage'
import { isUuid } from '@/lib/validation'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { storyId } = await params
    if (!isUuid(storyId)) {
      return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
    }

    const mp3 = await getAudioStorage().get(storyId)
    if (!mp3) return NextResponse.json({ error: 'Audio not found' }, { status: 404 })

    return new NextResponse(new Uint8Array(mp3), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(mp3.length),
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('[audio/[storyId]:GET]', err)
    return NextResponse.json({ error: 'Failed to load audio' }, { status: 500 })
  }
}
