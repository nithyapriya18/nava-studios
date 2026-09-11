import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { ReviewRadarApp } from '@/components/ReviewRadarApp'

export const metadata: Metadata = {
  title: "Review Radar",
  description: "A weekly digest of what your reviews are trying to tell you.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="review-radar">
        <ReviewRadarApp />
      </ToolShell>
    </>
  )
}
