import { getAgeBand } from '@/lib/constants'
import type { AgeBand, VoiceKey, VoicePreset } from '@/lib/types'

// Four curated, research-backed narration personas. Each maps onto one of the
// fixed OpenAI TTS voices — the persona (label/caption) is what the user sees;
// openaiVoice/toneInstruction are the TTS-facing implementation details.
export const VOICE_PRESETS: VoicePreset[] = [
  {
    key: 'papa-bear',
    label: 'Papa Bear',
    caption: 'Warm & steady',
    openaiVoice: 'onyx',
    toneInstruction:
      "Narrate this bedtime story in a warm, steady, gently confident father's voice. Calm warmth throughout, a little playful energy on the fun parts, never rushed.",
  },
  {
    key: 'mama-bear',
    label: 'Mama Bear',
    caption: 'Soft & soothing',
    openaiVoice: 'shimmer',
    toneInstruction:
      "Narrate this bedtime story in a soft, soothing, tender mother's voice. Low and gentle, warm and comforting, calming by nature.",
  },
  {
    key: 'story-fox',
    label: 'Story Fox',
    caption: 'Excited & playful',
    openaiVoice: 'fable',
    toneInstruction:
      'Narrate this bedtime story with excitement and playful energy — animated character voices, bright enthusiasm and fun emphasis on action moments — but settle into a calm, soft tone for the final paragraph so the child can wind down.',
  },
  {
    key: 'sleepy-owl',
    label: 'Sleepy Owl',
    caption: 'Calm & sleepy',
    openaiVoice: 'echo',
    toneInstruction:
      'Narrate this bedtime story slowly and very calmly, almost a hushed whisper by the end — an unhurried, sleepy, hypnotic pace meant to help a child drift off.',
  },
]

export function getVoicePreset(key: VoiceKey): VoicePreset {
  const preset = VOICE_PRESETS.find((v) => v.key === key)
  if (!preset) throw new Error(`Unknown voice preset: ${key}`)
  return preset
}

/** Full `instructions` payload for the TTS call: persona tone + age reminder. */
export function buildInstructions(preset: VoicePreset, ageBand: AgeBand): string {
  const band = getAgeBand(ageBand)
  return `${preset.toneInstruction} This story is for a young child around age ${band.promptAge}.`
}
