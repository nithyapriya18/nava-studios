import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { ReviewRadarApp } from '@/apps/tools/ReviewRadarApp'

export const metadata: Metadata = {
  title: 'Review Radar — what your reviews are trying to tell you',
  description:
    'Paste your reviews and get sentiment, top complaint themes, and top praises — analysed in your browser.',
}

export default function ReviewRadarPage() {
  return (
    <ToolShell slug="review-radar">
      <ReviewRadarApp />
    </ToolShell>
  )
}
