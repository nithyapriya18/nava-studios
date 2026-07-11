import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { ReportSnapApp } from '@/apps/tools/ReportSnapApp'

export const metadata: Metadata = {
  title: 'Report Snap — the monthly client report, done in minutes',
  description:
    'A clean one-page client report with a plain-language summary on top. Print it or share a link.',
}

export default function ReportSnapPage() {
  return (
    <ToolShell slug="report-snap">
      <ReportSnapApp />
    </ToolShell>
  )
}
