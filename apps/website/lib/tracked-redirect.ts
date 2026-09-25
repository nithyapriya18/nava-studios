import { NextRequest, NextResponse, after } from 'next/server'
import { clientIp } from '@/lib/rate-limit'
import { requestMeta } from '@/lib/review-log'
import { logEvent, type LoggedEvent } from '@/lib/event-log'
import { OWNER_COOKIE, isOwnerKey } from '@/lib/owner'

/** Logs the visit server-side, then sends the visitor on to `destination`. */
export function trackedRedirect(req: NextRequest, event: LoggedEvent, destination: string) {
  const meta = requestMeta(req.headers)
  const owner = isOwnerKey(req.cookies.get(OWNER_COOKIE)?.value)
  after(() =>
    logEvent({
      event,
      source: req.nextUrl.searchParams.get('from')?.slice(0, 40) ?? null,
      referrer: req.headers.get('referer')?.slice(0, 300) ?? null,
      ip: clientIp(req.headers),
      ...meta,
      user_agent: owner ? `[owner] ${meta.user_agent ?? ''}` : meta.user_agent,
    }),
  )
  return NextResponse.redirect(new URL(destination, req.url), 307)
}
