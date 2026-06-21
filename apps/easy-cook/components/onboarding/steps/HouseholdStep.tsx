'use client'

import { useId } from 'react'
import { Trash2, Plus } from 'lucide-react'
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

function blankMember(index: number): Member {
  return {
    id: `member-${Date.now()}-${index}`,
    name: '',
    age: '',
    dietType: 'non-veg',
    allergies: [],
    likes: [],
    dislikes: [],
    spiceLevel: 3,
    healthGoals: ['balanced'],
  }
}

export function HouseholdStep({ prefs, onChange, onNext, onBack }: Props) {
  const members = prefs.members ?? [blankMember(0)]

  function updateMember(idx: number, updates: Partial<Member>) {
    const next = members.map((m, i) => (i === idx ? { ...m, ...updates } : m))
    onChange({ members: next })
  }

  function addMember() {
    onChange({ members: [...members, blankMember(members.length)] })
  }

  function removeMember(idx: number) {
    onChange({ members: members.filter((_, i) => i !== idx) })
  }

  const valid = members.length > 0 && members.every((m) => m.name.trim().length > 0)

  return (
    <StepCard
      title="Who's in the household?"
      subtitle="Add everyone who'll be eating — we'll customise meals for each person."
    >
      <div className="space-y-4">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="rounded-xl border border-border bg-white p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Person {idx + 1}
              </span>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  className="text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Name"
                value={member.name}
                onChange={(e) => updateMember(idx, { name: e.target.value })}
              />
              <Input
                placeholder="Age (optional)"
                type="number"
                min="1"
                max="120"
                value={member.age}
                onChange={(e) => updateMember(idx, { age: e.target.value })}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMember}
          className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-text-muted hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add another person
        </button>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
          <Button className="flex-1" onClick={onNext} disabled={!valid}>
            Continue →
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
