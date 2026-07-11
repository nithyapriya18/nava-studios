import { getAgeBand, getLengthPreset } from '@/lib/constants'
import type { AgeBand, Gender, LengthKey } from '@/lib/types'

export interface StoryPromptInput {
  childName: string
  gender: Gender
  ageBand: AgeBand
  prompt: string
  lengthKey: LengthKey
}

export interface BuiltStoryPrompt {
  prompt: string
  maxTokens: number
}

export function buildStoryPrompt({
  childName,
  gender,
  ageBand,
  prompt,
  lengthKey,
}: StoryPromptInput): BuiltStoryPrompt {
  const band = getAgeBand(ageBand)
  const length = getLengthPreset(lengthKey)
  const pronouns = gender === 'boy' ? 'he/him' : 'she/her'

  const storyPrompt = `Write a personalized bedtime story for a child.

CHILD: ${childName}, a ${gender} — make ${childName} the protagonist and hero of the story, using ${pronouns} pronouns throughout.
AGE: about ${band.promptAge} years old. Calibrate vocabulary, sentence length, and theme complexity to a ${band.promptAge}-year-old. Use words they know, with maybe one or two fun new ones explained naturally.
SCENARIO (use as the plot seed): ${prompt}
LENGTH: target about ${length.targetWords} words.

STORY RULES:
- Follow a gentle arc: a cozy opening, a small playful adventure or discovery, then wind down to a calm, sleepy, reassuring ending — ${childName} should end the story safe, happy, and drowsy.
- This is a BEDTIME story. Absolutely nothing scary, violent, sad, or upsetting: no monsters that threaten, no peril, no injuries, no loss, no darkness played for fear. Any tension must be mild and resolved warmly.
- Kind, soothing tone throughout. Sensory, cozy details (soft blankets, warm light, gentle sounds) are encouraged, especially near the end.
- Give the story a short, charming title.

Return compact JSON ONLY (no markdown, no commentary):
{"title": "...", "story": "..."}

Use \\n\\n between paragraphs inside the "story" string.`

  return { prompt: storyPrompt, maxTokens: length.maxTokens }
}
