import { createClient } from '@supabase/supabase-js'

/**
 * A private log of every Second Opinion attempt, for the site owner only.
 *
 * Written with the Supabase secret key, which bypasses row level security and
 * never leaves the server. The review_log table has RLS on and no policies,
 * so the public key used elsewhere on the site can't read or write it.
 * Without SUPABASE_SECRET_KEY the log is skipped and reviews still work.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

const admin = url && secret ? createClient(url, secret, { auth: { persistSession: false } }) : null

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
  if (!admin) return
  const { error } = await admin.from('review_log').insert(entry)
  if (error) console.error('[review-log] insert failed:', error.message)
}
