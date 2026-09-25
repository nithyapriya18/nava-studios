import { createClient } from '@supabase/supabase-js'

/**
 * A private, server-side record of a few key visitor actions (resume
 * downloads, LinkedIn visits), so they're counted even when an ad blocker
 * stops PostHog. Rows go in through log_event, a security definer function;
 * the event_log table has RLS on and no policies, so the site's public key
 * can add rows but never read them. The owner reads it in Supabase.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export type LoggedEvent = 'resume_downloaded' | 'linkedin_opened'

export async function logEvent(entry: {
  event: LoggedEvent
  source: string | null
  referrer: string | null
  ip: string
  country: string | null
  city: string | null
  user_agent: string | null
}) {
  if (!supabase) return
  const { error } = await supabase.rpc('log_event', { p_entry: entry })
  if (error) console.error('[event-log] insert failed:', error.message)
}
