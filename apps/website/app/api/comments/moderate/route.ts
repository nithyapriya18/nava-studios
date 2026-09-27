import { NextRequest, NextResponse } from 'next/server'
import { moderateComment } from '@/lib/comments'

export const dynamic = 'force-dynamic'

/** Approve or delete a comment from the moderation page (a form POST, never a plain link). */
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const id = Number(form.get('id'))
  const token = String(form.get('t') ?? '')
  const action = form.get('action') === 'delete' ? 'delete' : 'approve'
  const ok = await moderateComment(id, token, action)
  const back = new URL('/comments/moderate', req.url)
  back.searchParams.set('done', ok ? (action === 'approve' ? 'approved' : 'deleted') : 'failed')
  if (action === 'approve') {
    back.searchParams.set('id', String(id))
    back.searchParams.set('t', token)
  }
  return NextResponse.redirect(back, 303)
}
