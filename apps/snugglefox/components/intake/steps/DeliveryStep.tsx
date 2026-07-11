'use client'

import { DELIVERY_MODES, LENGTH_PRESETS } from '@/lib/constants'
import { VOICE_PRESETS } from '@/lib/ai/voices'
import { Button } from '@/components/ui/Button'
import { OptionCard } from '@/components/ui/OptionCard'
import { StepCard } from '@/components/ui/StepCard'
import { stepIsValid } from '@/components/intake/IntakeWizard'
import { DeliveryGlyph, LengthGlyph, VoiceGlyph } from '@/components/intake/glyphs'
import type { IntakePrefs } from '@/lib/types'

interface DeliveryStepProps {
  prefs: IntakePrefs
  onChange: (updates: Partial<IntakePrefs>) => void
  onNext: () => void
  onBack: () => void
}

export function DeliveryStep({ prefs, onChange, onNext, onBack }: DeliveryStepProps) {
  const needsVoice = prefs.deliveryMode !== 'text'
  const valid = stepIsValid(2, prefs)

  return (
    <StepCard title="How should tonight go?" subtitle="Pick a length and how you want to share it.">
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-text-primary">Story length</p>
        <div className="grid grid-cols-3 gap-3">
          {LENGTH_PRESETS.map((preset) => (
            <OptionCard
              key={preset.key}
              label={preset.label}
              caption={preset.caption}
              glyph={<LengthGlyph length={preset.key} />}
              selected={prefs.lengthKey === preset.key}
              onSelect={() => onChange({ lengthKey: preset.key })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-text-primary">Delivery</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DELIVERY_MODES.map((mode) => (
            <OptionCard
              key={mode.key}
              label={mode.label}
              caption={mode.caption}
              glyph={<DeliveryGlyph mode={mode.key} />}
              selected={prefs.deliveryMode === mode.key}
              onSelect={() => onChange({ deliveryMode: mode.key })}
            />
          ))}
        </div>
      </div>

      {needsVoice && (
        <div className="animate-fade-in space-y-2.5">
          <p className="text-sm font-medium text-text-primary">Narration voice</p>
          <div className="grid grid-cols-2 gap-3">
            {VOICE_PRESETS.map((voice) => (
              <OptionCard
                key={voice.key}
                label={voice.label}
                caption={voice.caption}
                glyph={<VoiceGlyph voice={voice.key} />}
                selected={prefs.voiceKey === voice.key}
                onSelect={() => onChange({ voiceKey: voice.key })}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!valid}>
          Create tonight&rsquo;s story
        </Button>
      </div>
    </StepCard>
  )
}
