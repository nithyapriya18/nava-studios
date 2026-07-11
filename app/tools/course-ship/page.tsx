import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { CourseShipApp } from '@/apps/tools/CourseShipApp'

export const metadata: Metadata = {
  title: 'Course Ship — sell your course without a $199/month platform',
  description:
    'Build lessons, share a sales page with UPI payment, and send students their course link. No platform fees.',
}

export default function CourseShipPage() {
  return (
    <ToolShell slug="course-ship">
      <CourseShipApp />
    </ToolShell>
  )
}
