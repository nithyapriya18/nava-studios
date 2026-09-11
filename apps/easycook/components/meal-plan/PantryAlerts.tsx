'use client'

import { AlertTriangle, AlertCircle, X } from 'lucide-react'
import { useState } from 'react'
import type { PantryAlert } from '@/lib/types'

interface PantryAlertsProps {
  alerts: PantryAlert[]
}

export function PantryAlerts({ alerts }: PantryAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  if (alerts.length === 0) return null

  const visible = alerts.filter((a) => !dismissed.has(a.item.id + a.type))

  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      {visible.map((alert) => {
        const key = alert.item.id + alert.type
        const isExpired = alert.type === 'expired'
        return (
          <div
            key={key}
            className={`
              flex items-start gap-3 rounded-xl border p-3 text-sm
              ${isExpired ? 'bg-red-50 border-red-200 text-red-700' : 'bg-warning-light border-warning/30 text-warning'}
            `}
          >
            {isExpired ? (
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            )}
            <span className="flex-1 text-sm">{alert.message}</span>
            <button
              type="button"
              onClick={() => setDismissed((prev) => new Set([...prev, key]))}
              className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
