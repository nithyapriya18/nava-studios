import { config, requireEnv } from '@/lib/config'
import type { AgeBand, VoiceKey } from '@/lib/types'
import { buildInstructions, getVoicePreset } from './voices'

export interface TtsRequest {
  text: string
  voiceKey: VoiceKey
  ageBand: AgeBand
}

export interface TtsProvider {
  synthesize(req: TtsRequest): Promise<Buffer>
}

// The OpenAI speech endpoint caps input around 4096 characters — stay under it
// with headroom.
const MAX_CHUNK_CHARS = 3800

/** Split text into <= MAX_CHUNK_CHARS chunks, preferring paragraph boundaries. */
export function splitIntoChunks(text: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const chunks: string[] = []
  let current = ''

  const pushCurrent = () => {
    if (current) {
      chunks.push(current)
      current = ''
    }
  }

  for (const para of paragraphs) {
    if (para.length > MAX_CHUNK_CHARS) {
      // A single monster paragraph: flush what we have, then hard-slice it.
      pushCurrent()
      for (let i = 0; i < para.length; i += MAX_CHUNK_CHARS) {
        chunks.push(para.slice(i, i + MAX_CHUNK_CHARS))
      }
      continue
    }
    const candidate = current ? `${current}\n\n${para}` : para
    if (candidate.length > MAX_CHUNK_CHARS) {
      pushCurrent()
      current = para
    } else {
      current = candidate
    }
  }
  pushCurrent()

  return chunks.length > 0 ? chunks : [text.trim()]
}

async function synthesizeChunk(
  chunk: string,
  voice: string,
  instructions: string,
  apiKey: string,
): Promise<Buffer> {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: config.ttsModel, voice, input: chunk, instructions }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`TTS request failed (${res.status}): ${detail.slice(0, 300)}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

class OpenAiTtsProvider implements TtsProvider {
  async synthesize({ text, voiceKey, ageBand }: TtsRequest): Promise<Buffer> {
    if (!text.trim()) throw new Error('Cannot synthesize empty story text')

    const apiKey = requireEnv('OPENAI_API_KEY')
    const preset = getVoicePreset(voiceKey)
    const instructions = buildInstructions(preset, ageBand)
    const chunks = splitIntoChunks(text)

    // Chunks are independent requests — run them concurrently. Promise.all
    // preserves input order in its result array regardless of completion
    // order, so concatenation below still matches reading order.
    const buffers = await Promise.all(
      chunks.map((chunk) => synthesizeChunk(chunk, preset.openaiVoice, instructions, apiKey)),
    )

    // Known MVP simplification: naive MP3 stream concatenation only carries
    // the first chunk's duration header, so a multi-chunk (Long) story's
    // player-reported duration undercounts the real length. Fixing this
    // properly needs real MP3 muxing (e.g. an ffmpeg pass) — deferred; see
    // README's v2 backlog.
    return Buffer.concat(buffers)
  }
}

export function getTtsProvider(): TtsProvider {
  switch (config.ttsProvider) {
    case 'openai':
      return new OpenAiTtsProvider()
    default:
      throw new Error(
        `Unsupported TTS_PROVIDER "${config.ttsProvider}" — only "openai" is implemented`,
      )
  }
}
