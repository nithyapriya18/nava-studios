// Central typed config. This is the ONLY file allowed to contain literal
// model-name strings — everything else reads from `config` so providers and
// models can be upgraded via .env.local without a rewrite.

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not set — add it to apps/snugglefox/.env.local`)
  }
  return value
}

export interface SnugglefoxConfig {
  storyProvider: string
  storyModel: string
  ttsProvider: string
  ttsModel: string
  audioStorage: string
}

export const config: SnugglefoxConfig = {
  storyProvider: process.env.STORY_PROVIDER ?? 'anthropic',
  storyModel: process.env.STORY_MODEL ?? 'claude-haiku-4-5',
  ttsProvider: process.env.TTS_PROVIDER ?? 'openai',
  ttsModel: process.env.TTS_MODEL ?? 'gpt-4o-mini-tts',
  audioStorage: process.env.AUDIO_STORAGE ?? 'local',
}
