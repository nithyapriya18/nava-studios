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
}): Promise<{ id: number; token: string } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('add_comment', { p_entry: entry })
  if (error) {
    console.error('[comments] insert failed:', error.message)
    return null
  }
  const row = Array.isArray(data) ? data[0] : data
  return row?.id ? { id: Number(row.id), token: String(row.moderation_token) } : { id: 0, token: '' }
}

export type ModerationView = {
  post_slug: string
  name: string
  body: string
  approved: boolean
  created_at: string
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const validRef = (id: number, token: string) => Number.isInteger(id) && id > 0 && UUID.test(token)

/** The comment behind a moderation link, or null if the link isn't valid. */
export async function commentForModeration(id: number, token: string): Promise<ModerationView | null> {
  if (!supabase || !validRef(id, token)) return null
  const { data, error } = await supabase.rpc('comment_for_moderation', { p_id: id, p_token: token })
  if (error) {
    console.error('[comments] moderation lookup failed:', error.message)
    return null
  }
  return (Array.isArray(data) ? data[0] : null) ?? null
}

export async function moderateComment(id: number, token: string, action: 'approve' | 'delete') {
  if (!supabase || !validRef(id, token)) return false
  const { data, error } = await supabase.rpc('moderate_comment', { p_id: id, p_token: token, p_action: action })
  if (error) console.error('[comments] moderation failed:', error.message)
  return data === 'ok'
}
