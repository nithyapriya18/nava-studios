import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { UptimePeekApp } from '@/components/UptimePeekApp'

export const metadata: Metadata = {
  title: "Uptime Peek",
  description: "Uptime, response time, and a status page at an indie price.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="uptime-peek">
        <UptimePeekApp />
      </ToolShell>
    </>
  )
}
