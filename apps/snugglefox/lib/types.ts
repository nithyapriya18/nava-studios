// ---------------------------------------------------------------------------
// Core union types
// ---------------------------------------------------------------------------

export type AgeBand = 'toddler' | 'little-kid' | 'big-kid' | 'tween'
export type Gender = 'boy' | 'girl'
export type VoiceKey = 'papa-bear' | 'mama-bear' | 'story-fox' | 'sleepy-owl'
export type LengthKey = 'short' | 'medium' | 'long'
export type DeliveryMode = 'text' | 'text-audio' | 'audio'
export type AudioStatus = 'none' | 'pending' | 'ready' | 'failed'

// ---------------------------------------------------------------------------
// Preset / option metadata
// ---------------------------------------------------------------------------

export interface AgeBandInfo {
  key: AgeBand
  label: string
  range: string
  /** The concrete age interpolated into the Claude prompt for calibration. */
  promptAge: number
}

export interface VoicePreset {
  key: VoiceKey
  label: string
  caption: string
  /** Fixed OpenAI TTS voice persona backing this preset. */
  openaiVoice: string
  /** Tone instruction passed as the `instructions` field to the TTS call. */
  toneInstruction: string
}

export interface LengthPresetInfo {
  key: LengthKey
  label: string
  caption: string
  targetWords: number
  maxTokens: number
}

export interface DeliveryModeInfo {
  key: DeliveryMode
  label: string
  caption: string
}

// ---------------------------------------------------------------------------
// Requests / rows
// ---------------------------------------------------------------------------

export interface StoryRequest {
  deviceId: string
  childName: string
  gender: Gender
  ageBand: AgeBand
  prompt: string
  lengthKey: LengthKey
  deliveryMode: DeliveryMode
  voiceKey?: VoiceKey
}

/** Mirrors a row in the `stories` table. */
export interface Story {
  id: string
  deviceId: string
  userId: string | null // future auth seam
  childName: string
  gender: Gender
  ageBand: AgeBand
  prompt: string
  lengthKey: LengthKey
  deliveryMode: DeliveryMode
  voiceKey: VoiceKey | null
  title: string
  storyText: string
  audioStatus: AudioStatus
  audioDurationSec: number | null
  storyModel: string
  ttsModel: string | null
  createdAt: string | Date | null
}

// ---------------------------------------------------------------------------
// Intake wizard state
// ---------------------------------------------------------------------------

export interface IntakePrefs {
  childName: string
  gender: Gender | null
  ageBand: AgeBand | null
  prompt: string
  lengthKey: LengthKey
  deliveryMode: DeliveryMode
  voiceKey: VoiceKey | null
}
