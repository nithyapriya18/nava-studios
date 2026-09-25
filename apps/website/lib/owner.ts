import { timingSafeEqual } from 'node:crypto'

/**
 * The site owner's pass. Opening /api/owner?key=OWNER_KEY once in a browser
 * sets a long-lived cookie, and requests carrying it skip the review limits.
 * Tied to the browser rather than an IP, since home and mobile IPs change.
 */
export const OWNER_COOKIE = 'npv_owner'

export function isOwnerKey(value: string | undefined | null) {
  const key = process.env.OWNER_KEY
  if (!key || !value) return false
  const a = Buffer.from(value)
  const b = Buffer.from(key)
  return a.length === b.length && timingSafeEqual(a, b)
}
