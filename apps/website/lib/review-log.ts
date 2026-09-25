import { createClient } from '@supabase/supabase-js'

/**
 * A private log of every Second Opinion attempt, for the site owner only.
 *
 * Rows go in through log_review (supabase/rate-limit.sql), a security definer
 * function, so the site's existing publishable key is enough. The
 * review_log table has RLS on and no policies, so that key can't read it;
 * the owner sees it in the Supabase dashboard. If Supabase isn't configured
 * the log is skipped and reviews still work.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export type ReviewOutcome = 'reviewed' | 'limit_visitor' | 'limit_site' | 'unreadable_link' | 'error'

export type ReviewLogEntry = {
  outcome: ReviewOutcome
  input_type: 'link' | 'text'
  input: string
  score?: number
  verdict?: string
  review?: unknown
  ip: string
  country: string | null
  city: string | null
  user_agent: string | null
}

/** Where the request came from, as Vercel reports it. */
export function requestMeta(headers: Headers) {
  const city = headers.get('x-vercel-ip-city')
  return {
    country: headers.get('x-vercel-ip-country'),
    city: city ? decodeURIComponent(city) : null,
    user_agent: headers.get('user-agent'),
  }
}

export async function logReview(entry: ReviewLogEntry) {
  if (!supabase) return
  const { error } = await supabase.rpc('log_review', { p_entry: entry })
  if (error) console.error('[review-log] insert failed:', error.message)
}
