import type {
  AgeBand,
  AgeBandInfo,
  DeliveryModeInfo,
  Gender,
  LengthKey,
  LengthPresetInfo,
} from './types'

export const GENDERS: { key: Gender; label: string }[] = [
  { key: 'boy', label: 'Boy' },
  { key: 'girl', label: 'Girl' },
]

export const AGE_BANDS: AgeBandInfo[] = [
  { key: 'toddler', label: 'Toddler', range: '2-4', promptAge: 3 },
  { key: 'little-kid', label: 'Little Kid', range: '5-7', promptAge: 6 },
  { key: 'big-kid', label: 'Big Kid', range: '8-9', promptAge: 8 },
  { key: 'tween', label: 'Tween', range: '10-12', promptAge: 11 },
]

export function getAgeBand(key: AgeBand): AgeBandInfo {
  const band = AGE_BANDS.find((b) => b.key === key)
  if (!band) throw new Error(`Unknown age band: ${key}`)
  return band
}

export const LENGTH_PRESETS: LengthPresetInfo[] = [
  { key: 'short', label: 'Short', caption: '~3 min', targetWords: 350, maxTokens: 700 },
  { key: 'medium', label: 'Medium', caption: '~5 min', targetWords: 700, maxTokens: 1300 },
  { key: 'long', label: 'Long', caption: '~8 min', targetWords: 1100, maxTokens: 2200 },
]

export function getLengthPreset(key: LengthKey): LengthPresetInfo {
  const preset = LENGTH_PRESETS.find((p) => p.key === key)
  if (!preset) throw new Error(`Unknown length preset: ${key}`)
  return preset
}

export const DELIVERY_MODES: DeliveryModeInfo[] = [
  { key: 'text', label: 'Text only', caption: 'Read it aloud yourself' },
  { key: 'text-audio', label: 'Text + Audio', caption: 'Read along with narration' },
  { key: 'audio', label: 'Audio only', caption: 'Lights off, just listen' },
]
