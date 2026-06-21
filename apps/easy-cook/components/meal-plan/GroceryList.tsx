'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import type { GroceryItem, GroceryCategory } from '@/lib/types'

const CATEGORY_LABELS: Record<GroceryCategory, string> = {
  produce: '🥦 Produce',
  dairy: '🥛 Dairy',
  'meat-seafood': '🥩 Meat & Seafood',
  'grains-legumes': '🌾 Grains & Legumes',
  'spices-condiments': '🧂 Spices & Condiments',
  'oils-fats': '🫙 Oils & Fats',
  beverages: '🧃 Beverages',
  frozen: '🧊 Frozen',
  canned: '🥫 Canned Goods',
  other: '📦 Other',
}

interface GroceryListProps {
  items: GroceryItem[]
}

export function GroceryList({ items }: GroceryListProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const grouped = items.reduce(
    (acc, item) => {
      const cat = item.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<GroceryCategory, GroceryItem[]>
  )

  const categories = Object.keys(grouped) as GroceryCategory[]
  const doneCount = checked.size
  const total = items.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={16} className="text-accent" />
          <span className="text-sm font-medium text-text-primary">
            {total} items needed
          </span>
        </div>
        {doneCount > 0 && (
          <span className="text-xs text-text-muted">
            {doneCount}/{total} ticked off
          </span>
        )}
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
              {CATEGORY_LABELS[cat]}
            </p>
            <div className="space-y-1.5">
              {grouped[cat].map((item) => {
                const key = item.ingredientName.toLowerCase()
                const done = checked.has(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(key)}
                    className={`
                      w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all
                      ${
                        done
                          ? 'border-success/20 bg-success-light'
                          : 'border-border bg-white hover:border-accent/30'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                        ${done ? 'bg-success border-success' : 'border-border'}
                      `}
                    >
                      {done && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm flex-1 ${done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                      {item.ingredientName}
                    </span>
                    {item.quantity && (
                      <span className="text-xs text-text-muted">
                        {item.quantity} {item.unit}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
