import { createClient } from '@supabase/supabase-js'

/**
 * Blog comments, stored in Supabase (see post_comments in
 * supabase/rate-limit.sql). New comments wait for the owner's approval.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export type PublicComment = { id: number; created_at: string; name: string; body: string }

export async function approvedComments(slug: string): Promise<PublicComment[]> {
  if (!supabase) return []
  const { data, error } = await supabase.rpc('approved_comments', { p_slug: slug })
  if (error) {
    console.error('[comments] read failed:', error.message)
    return []
  }
  return (data ?? []) as PublicComment[]
}

export async function addComment(entry: {
  post_slug: string
  name: string
  email: string | null
  body: string
  ip: string
  country: string | null
  user_agent: string | null
}) {
  if (!supabase) return false
  const { error } = await supabase.rpc('add_comment', { p_entry: entry })
  if (error) console.error('[comments] insert failed:', error.message)
  return !error
}
