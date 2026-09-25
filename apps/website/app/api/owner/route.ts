import { NextRequest, NextResponse } from 'next/server'
import { OWNER_COOKIE, isOwnerKey } from '@/lib/owner'
import { reviewHref } from '@/lib/products'

export const dynamic = 'force-dynamic'

/** /api/owner?key=... turns on the owner pass in this browser; ?off=1 turns it off. */
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL(reviewHref, req.url))
  if (req.nextUrl.searchParams.has('off')) {
    res.cookies.delete(OWNER_COOKIE)
    return res
  }
  const key = req.nextUrl.searchParams.get('key')
  if (!isOwnerKey(key)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  res.cookies.set(OWNER_COOKIE, key!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 400,
  })
  return res
}
