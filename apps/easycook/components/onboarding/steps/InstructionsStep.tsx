'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Sparkles } from 'lucide-react'
import { StepCard } from '@/components/ui/StepCard'
import { Button } from '@/components/ui/Button'
import type { UserPreferences } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onFinish: () => void
  onBack: () => void
}

// Minimal type cover for the Web Speech API (not in lib.dom by default)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: Event) => void) | null
  onend: (() => void) | null
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

const PLACEHOLDERS = [
  'e.g. We have a dinner party on Wednesday, make that day extra special…',
  'e.g. Avoid anything with onions this week, one of us is recovering…',
  'e.g. We\'re in the mood for something light and summery…',
  'e.g. Include at least 2 high-protein breakfasts for gym days…',
]

export function InstructionsStep({ prefs, onChange, onFinish, onBack }: Props) {
  const [listening, setListening] = useState(false)
  const [micAvailable, setMicAvailable] = useState(false)
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const placeholder = PLACEHOLDERS[0]

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    setMicAvailable(!!Ctor)
  }, [])

  function toggleMic() {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) return

    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      let final = ''
      let interimText = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else interimText += e.results[i][0].transcript
      }
      if (final) {
        onChange({
          additionalInstructions: ((prefs.additionalInstructions ?? '') + ' ' + final).trim(),
        })
      }
      setInterim(interimText)
    }

    rec.onerror = () => {
      setListening(false)
      setInterim('')
    }

    rec.onend = () => {
      setListening(false)
      setInterim('')
    }

    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }

  const displayValue = listening && interim
    ? (prefs.additionalInstructions ?? '') + (prefs.additionalInstructions ? ' ' : '') + interim
    : (prefs.additionalInstructions ?? '')

  return (
    <StepCard
      title="Any special instructions?"
      subtitle="Optional — tell Claude anything specific about this week. Speak or type it."
    >
      <div className="space-y-4">
        <div className="relative">
          <textarea
            rows={6}
            placeholder={placeholder}
            value={displayValue}
            onChange={(e) => onChange({ additionalInstructions: e.target.value })}
            className={[
              'w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-text-primary resize-none',
              'placeholder:text-text-muted/50 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
              listening ? 'border-accent ring-2 ring-accent/20' : 'border-border',
            ].join(' ')}
          />

          {/* Mic button */}
          {micAvailable && (
            <button
              type="button"
              onClick={toggleMic}
              title={listening ? 'Stop recording' : 'Speak your instructions'}
              className={[
                'absolute bottom-3 right-3 rounded-full p-2 transition-all',
                listening
                  ? 'bg-red-500 text-white shadow-md animate-pulse'
                  : 'bg-surface text-text-muted hover:bg-accent/10 hover:text-accent',
              ].join(' ')}
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}
        </div>

        {listening && (
          <p className="text-xs text-accent flex items-center gap-1.5 -mt-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Listening… speak now
          </p>
        )}

        {/* Example prompts */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
            Ideas to get you started
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              'We have a dinner party on Wednesday — make it special',
              'Keep breakfasts very quick, under 10 minutes',
              'We\'re trying to reduce sugar this week',
              'Include one new cuisine we haven\'t tried before',
            ].map((hint) => (
              <button
                key={hint}
                type="button"
                onClick={() =>
                  onChange({
                    additionalInstructions: prefs.additionalInstructions
                      ? `${prefs.additionalInstructions}. ${hint}`
                      : hint,
                  })
                }
                className="text-left text-xs text-text-muted px-3 py-1.5 rounded-lg border border-dashed border-border hover:border-accent hover:text-accent transition-colors flex items-center gap-2"
              >
                <Sparkles size={10} className="flex-shrink-0" />
                {hint}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
          <Button className="flex-1" onClick={onFinish}>
            {prefs.additionalInstructions?.trim()
              ? 'Generate my meal plan →'
              : 'Skip & generate →'}
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
