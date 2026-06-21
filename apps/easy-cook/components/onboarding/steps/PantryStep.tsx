'use client'

import { useState } from 'react'
import { Trash2, Plus, PackageCheck } from 'lucide-react'
import { StepCard } from '@/components/ui/StepCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { COMMON_PANTRY_ITEMS } from '@/lib/types'
import type { UserPreferences, PantryItem } from '@/lib/types'

interface Props {
  prefs: Partial<UserPreferences>
  onChange: (updates: Partial<UserPreferences>) => void
  onNext: () => void
  onBack: () => void
}

// Canonical units — grouped so Claude and the app always see the same strings
const UNIT_GROUPS: { label: string; units: string[] }[] = [
  { label: 'Weight',    units: ['g', 'kg', 'oz', 'lb'] },
  { label: 'Volume',   units: ['ml', 'L', 'tsp', 'tbsp', 'cup', 'fl oz'] },
  { label: 'Count',    units: ['pcs', 'dozen'] },
  { label: 'Packaging', units: ['can', 'packet', 'box', 'bag', 'bunch', 'loaf', 'slice', 'handful', 'clove', 'head', 'sprig'] },
]

function UnitSelect({
  value,
  invalid,
  onChange,
}: {
  value: string
  invalid: boolean
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        'w-full rounded-lg border bg-white px-2 py-2.5 text-sm transition-colors appearance-none cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
        invalid
          ? 'border-red-400 text-red-500 ring-1 ring-red-300'
          : value === ''
            ? 'border-border text-text-muted/60'
            : 'border-border text-text-primary',
      ].join(' ')}
    >
      <option value="" disabled>Unit</option>
      {UNIT_GROUPS.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

function newPantryItem(name: string = ''): PantryItem {
  return {
    id: `pantry-${Date.now()}-${Math.random()}`,
    name,
    quantity: 1,
    unit: '',
    expiryDate: '',
  }
}

export function PantryStep({ prefs, onChange, onNext, onBack }: Props) {
  const pantry = prefs.pantryItems ?? []
  const [showErrors, setShowErrors] = useState(false)

  function updateItem(idx: number, updates: Partial<PantryItem>) {
    const next = pantry.map((item, i) => (i === idx ? { ...item, ...updates } : item))
    onChange({ pantryItems: next })
  }

  function addCustom() {
    onChange({ pantryItems: [...pantry, newPantryItem()] })
  }

  function addFromSuggestion(name: string) {
    if (pantry.some((p) => p.name.toLowerCase() === name.toLowerCase())) return
    onChange({ pantryItems: [...pantry, newPantryItem(name)] })
  }

  function remove(idx: number) {
    onChange({ pantryItems: pantry.filter((_, i) => i !== idx) })
  }

  function handleFinish() {
    const missingUnit = pantry.some((p) => p.name.trim() !== '' && p.unit === '')
    if (missingUnit) {
      setShowErrors(true)
      return
    }
    onNext()
  }

  const missingUnitCount = pantry.filter((p) => p.name.trim() !== '' && p.unit === '').length

  const usedSuggestions = new Set(pantry.map((p) => p.name.toLowerCase()))
  const suggestions = COMMON_PANTRY_ITEMS.filter((s) => !usedSuggestions.has(s.toLowerCase()))

  return (
    <StepCard
      title="What's in your pantry?"
      subtitle="Tell us what you already have. We'll skip these from the grocery list and track quantities as you cook."
    >
      <div className="space-y-4">
        {pantry.length > 0 && (
          <div className="space-y-1">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_80px_110px_148px_32px] gap-2 px-3">
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Ingredient</span>
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Qty</span>
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
                Unit <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">
                Expiry date <span className="normal-case font-normal">(optional)</span>
              </span>
              <span />
            </div>

            <div className="space-y-2">
              {pantry.map((item, idx) => {
                const isInvalid = showErrors && item.name.trim() !== '' && item.unit === ''
                return (
                  <div
                    key={item.id}
                    className={[
                      'rounded-lg border bg-white p-3 grid grid-cols-[1fr_80px_110px_148px_32px] gap-2 items-center transition-colors',
                      isInvalid ? 'border-red-300 bg-red-50/30' : 'border-border',
                    ].join(' ')}
                  >
                    <Input
                      placeholder="e.g. Rice"
                      value={item.name}
                      onChange={(e) => updateItem(idx, { name: e.target.value })}
                    />
                    <Input
                      placeholder="1"
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })}
                    />
                    <UnitSelect
                      value={item.unit}
                      invalid={isInvalid}
                      onChange={(v) => updateItem(idx, { unit: v })}
                    />
                    <Input
                      type="date"
                      value={item.expiryDate ?? ''}
                      onChange={(e) => updateItem(idx, { expiryDate: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-text-muted hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>

            {showErrors && missingUnitCount > 0 && (
              <p className="text-xs text-red-500 px-1 pt-1">
                {missingUnitCount === 1
                  ? '1 item is missing a unit — please select one before continuing.'
                  : `${missingUnitCount} items are missing a unit — please select one for each before continuing.`}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={addCustom}
          className="w-full rounded-xl border border-dashed border-border py-2.5 text-sm text-text-muted hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add item manually
        </button>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide flex items-center gap-1.5">
              <PackageCheck size={12} /> Quick add from common pantry items
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.slice(0, 16).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addFromSuggestion(s)}
                  className="rounded-full border border-dashed border-border text-xs text-text-muted px-2.5 py-1 hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
                >
                  <Plus size={10} /> {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-surface p-3 text-xs text-text-muted">
          <strong className="text-text-primary">Tip:</strong> Expiry dates are optional — but if you add them, we'll remind you before items go bad.
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            ← Back
          </Button>
          <Button className="flex-1" onClick={handleFinish}>
            Next →
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
