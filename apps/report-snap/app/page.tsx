import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { ReportSnapApp } from '@/components/ReportSnapApp'

export const metadata: Metadata = {
  title: "Report Snap",
  description: "The monthly client report, generated.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="report-snap">
        <ReportSnapApp />
      </ToolShell>
    </>
  )
}
