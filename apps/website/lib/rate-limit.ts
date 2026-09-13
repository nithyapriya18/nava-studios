import { createClient } from '@supabase/supabase-js'

/**
 * Two limits protect /api/roast:
 *  - per-IP: stops one person/script from hammering the endpoint
 *  - daily global: a hard ceiling on total Anthropic spend per day
 *
 * Backed by a Postgres function (`check_rate_limit`, see supabase/rate-limit.sql)
 * in Supabase when NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are set —
 * atomic, and correct across Vercel's separate serverless instances.
 * Falls back to an in-memory limiter when those aren't set yet, so the route
 * still works locally / before Supabase is wired up — but an in-memory limiter
 * resets on every cold start and isn't shared across concurrent instances, so
 * it is NOT a real guarantee in production. Run supabase/rate-limit.sql in your
 * Supabase project's SQL editor, then add the two env vars, before pointing
 * real traffic at this.
 *
 * If the Supabase call itself errors (network blip, etc.) this fails OPEN —
 * the request is allowed through rather than the roast feature breaking. That
 * means the daily cap isn't a 100%-airtight guarantee during a Supabase
 * outage, which is the right trade-off for a free tool.
 */

const PER_IP_LIMIT = 5
const PER_IP_WINDOW_SECONDS = 10 * 60 // 10 minutes
const DAILY_LIMIT = Number(process.env.ROAST_DAILY_LIMIT ?? 500)
const DAILY_WINDOW_SECONDS = 24 * 60 * 60

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// The publishable (anon) key is enough here — check_rate_limit is a
// `security definer` function, so it runs with the privileges it needs
// regardless of which key called it. No reason to use the more powerful
// service_role key for a simple counter.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const hasSupabase = Boolean(supabaseUrl && supabaseKey)

const supabase = hasSupabase ? createClient(supabaseUrl!, supabaseKey!) : null

if (!hasSupabase) {
  console.warn(
    '[rate-limit] NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set — using an ' +
      'in-memory fallback. Fine for local dev, not safe for real production traffic ' +
      '(see lib/rate-limit.ts and supabase/rate-limit.sql).',
  )
}

// --- in-memory fallback (dev only) ---
const memoryHits = new Map<string, number[]>()

function memoryCheck(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < windowMs)
  const allowed = hits.length < limit
  if (allowed) hits.push(now)
  memoryHits.set(key, hits)
  return allowed
}

async function check(key: string, maxCount: number, windowSeconds: number) {
  if (supabase) {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_max_count: maxCount,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      console.error('[rate-limit] Supabase RPC failed, failing open:', error.message)
      return true
    }
    return Boolean(data)
  }
  return memoryCheck(key, maxCount, windowSeconds * 1000)
}

export async function checkIpLimit(ip: string) {
  const success = await check(`ip:${ip}`, PER_IP_LIMIT, PER_IP_WINDOW_SECONDS)
  return { success }
}

export async function checkDailyLimit() {
  const success = await check('daily:global', DAILY_LIMIT, DAILY_WINDOW_SECONDS)
  return { success }
}

export function clientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip') ?? 'unknown'
}
