import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { CourseShipApp } from '@/components/CourseShipApp'

export const metadata: Metadata = {
  title: "Course Ship",
  description: "Sell your course without a $199/month platform.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="course-ship">
        <CourseShipApp />
      </ToolShell>
    </>
  )
}
