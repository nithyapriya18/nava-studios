'use client'

import { useEffect, useState } from 'react'

/**
 * Namespaced localStorage state hook shared by all Get Paid tools.
 * Server-safe: initial render uses the fallback, then hydrates from storage.
 */
export function useLocalState<T>(key: string, fallback: T) {
  const storageKey = `verity:${key}`
  const [value, setValue] = useState<T>(fallback)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw !== null) setValue(JSON.parse(raw) as T)
    } catch {
      // corrupted entry — fall back silently
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // storage full/unavailable — state still works in-memory
    }
  }, [storageKey, value, hydrated])

  return [value, setValue, hydrated] as const
}

/** Base64url helpers for encoding documents into shareable URLs (no backend). */
export function encodeShare(data: unknown): string {
  const json = JSON.stringify(data)
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShare<T>(encoded: string): T | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as T
  } catch {
    return null
  }
}
