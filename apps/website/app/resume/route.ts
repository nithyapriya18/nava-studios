import { NextRequest } from 'next/server'
import { siteConfig } from '@/config'
import { trackedRedirect } from '@/lib/tracked-redirect'

export const dynamic = 'force-dynamic'

/** /resume?from=footer: records the download, then serves the PDF. */
export function GET(req: NextRequest) {
  return trackedRedirect(req, 'resume_downloaded', siteConfig.resumeFile)
}
