import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Two limits protect /api/roast:
 *  - per-IP: stops one person/script from hammering the endpoint
 *  - daily global: a hard ceiling on total Anthropic spend per day
 *
 * Backed by Upstash Redis when UPSTASH_REDIS_REST_URL / _TOKEN are set
 * (works correctly across Vercel's separate serverless instances).
 * Falls back to an in-memory limiter when those aren't set yet, so the
 * route still works locally / before Upstash is wired up — but an
 * in-memory limiter resets on every cold start and isn't shared across
 * concurrent instances, so it is NOT a real guarantee in production.
 * Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (free tier at
 * upstash.com, a couple minutes to set up) before pointing real traffic
 * at this.
 */

const PER_IP_LIMIT = 5
const PER_IP_WINDOW = '10 m'
const DAILY_LIMIT = Number(process.env.ROAST_DAILY_LIMIT ?? 500)

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

let ipLimiter: Ratelimit | null = null
let dailyLimiter: Ratelimit | null = null

if (hasUpstash) {
  const redis = Redis.fromEnv()
  ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(PER_IP_LIMIT, PER_IP_WINDOW),
    prefix: 'roast:ip',
    analytics: true,
  })
  dailyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(DAILY_LIMIT, '1 d'),
    prefix: 'roast:daily',
    analytics: true,
  })
} else {
  console.warn(
    '[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — using an in-memory fallback. ' +
      'Fine for local dev, not safe for real production traffic (see lib/rate-limit.ts).',
  )
}

// --- in-memory fallback (dev only) ---
const memoryHits = new Map<string, number[]>()

function memoryCheck(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < windowMs)
  const success = hits.length < limit
  if (success) hits.push(now)
  memoryHits.set(key, hits)
  return { success, remaining: Math.max(0, limit - hits.length) }
}

export async function checkIpLimit(ip: string) {
  if (ipLimiter) {
    const { success, remaining } = await ipLimiter.limit(ip)
    return { success, remaining }
  }
  return memoryCheck(`ip:${ip}`, PER_IP_LIMIT, 10 * 60 * 1000)
}

export async function checkDailyLimit() {
  if (dailyLimiter) {
    const { success, remaining } = await dailyLimiter.limit('global')
    return { success, remaining }
  }
  return memoryCheck('daily:global', DAILY_LIMIT, 24 * 60 * 60 * 1000)
}

export function clientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip') ?? 'unknown'
}
