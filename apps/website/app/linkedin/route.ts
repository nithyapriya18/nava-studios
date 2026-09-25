import { NextRequest, NextResponse } from 'next/server'
import { linkedinHref } from '@/config'
import { trackedRedirect } from '@/lib/tracked-redirect'

export const dynamic = 'force-dynamic'

/** /linkedin?from=footer: records the visit, then goes to the LinkedIn profile. */
export function GET(req: NextRequest) {
  if (!linkedinHref) return NextResponse.redirect(new URL('/', req.url))
  return trackedRedirect(req, 'linkedin_opened', linkedinHref)
}
