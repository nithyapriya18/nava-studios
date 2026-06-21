'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { StepCard } from '@/components/ui/StepCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Member, UserPreferences } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
  onBack: () => void
}

// Base vegetarian items (safe for all diet types)
const VEG_LIKES       = ['Paneer', 'Rice', 'Pasta', 'Salads', 'Soups', 'Tofu', 'Noodles', 'Pizza', 'Biryani', 'Dal', 'Roti', 'Cheese', 'Idli', 'Dosa']
const VEGAN_LIKES     = ['Rice', 'Pasta', 'Salads', 'Soups', 'Tofu', 'Noodles', 'Dal', 'Roti', 'Hummus', 'Lentils', 'Avocado', 'Idli', 'Dosa']
const EGG_LIKES       = [...VEG_LIKES, 'Eggs', 'Omelette', 'Frittata']
const SEAFOOD_EXTRAS  = ['Salmon', 'Tuna', 'Prawns', 'Fish curry', 'Grilled fish']
const MEAT_EXTRAS     = ['Chicken', 'Mutton', 'Biryani', 'Kebabs', 'Grilled chicken']
const PESCATARIAN_LIKES = [...VEG_LIKES, 'Eggs', ...SEAFOOD_EXTRAS]
const NON_VEG_LIKES   = [...VEG_LIKES, 'Eggs', ...SEAFOOD_EXTRAS, ...MEAT_EXTRAS]

const LIKES_BY_DIET: Record<string, string[]> = {
  veg:          VEG_LIKES,
  vegan:        VEGAN_LIKES,
  eggetarian:   EGG_LIKES,
  pescatarian:  PESCATARIAN_LIKES,
  'non-veg':    NON_VEG_LIKES,
}

const COMMON_DISLIKES = ['Bitter gourd', 'Mushrooms', 'Eggplant', 'Olives', 'Cilantro', 'Okra', 'Liver', 'Anchovies']

function TagInput({
  label,
  tags,
  suggestions,
  onChange,
}: {
  label: string
  tags: string[]
  suggestions: string[]
  onChange: (tags: string[]) => void
}) {
  const [input, setInput] = useState('')

  function add(val: string) {
    const trimmed = val.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  function remove(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s))

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</label>
      <div className="min-h-[48px] rounded-lg border border-border bg-white p-2 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-accent-light text-accent text-xs px-2.5 py-1 font-medium"
          >
            {tag}
            <button type="button" onClick={() => remove(tag)}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] text-sm outline-none placeholder:text-text-muted/50"
          placeholder="Type and press Enter…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(input)
            }
          }}
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {unusedSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="rounded-full border border-dashed border-border text-xs text-text-muted px-2 py-0.5 hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
            >
              <Plus size={10} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function LikesDislikesStep({ prefs, onChange, onNext, onBack }: Props) {
  const members = prefs.members ?? []

  function updateMember(idx: number, updates: Partial<Member>) {
    const next = members.map((m, i) => (i === idx ? { ...m, ...updates } : m))
    onChange({ members: next })
  }

  return (
    <StepCard
      title="Likes & dislikes"
      subtitle="Help us avoid meals no one will eat and make more of what everyone loves."
    >
      <div className="space-y-6">
        {members.map((member, idx) => {
          const likeSuggestions = LIKES_BY_DIET[member.dietType] ?? NON_VEG_LIKES
          // Don't suggest items that conflict with their allergens
          const allergenWords = member.allergies.map((a) => a.toLowerCase())
          const safeLikes = likeSuggestions.filter(
            (s) => !allergenWords.some((a) => s.toLowerCase().includes(a)),
          )
          return (
            <div key={member.id} className="rounded-xl border border-border bg-white p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {member.name || `Person ${idx + 1}`}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 capitalize">
                  {member.dietType.replace('-', ' ')}
                  {member.allergies.length > 0 && ` · allergic to ${member.allergies.join(', ')}`}
                </p>
              </div>
              <TagInput
                label="Loves to eat"
                tags={member.likes}
                suggestions={safeLikes}
                onChange={(v) => updateMember(idx, { likes: v })}
              />
              <TagInput
                label="Doesn't like"
                tags={member.dislikes}
                suggestions={COMMON_DISLIKES}
                onChange={(v) => updateMember(idx, { dislikes: v })}
              />
            </div>
          )
        })}

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
          <Button className="flex-1" onClick={onNext}>
            Continue →
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
