import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { UptimePeekApp } from '@/apps/tools/UptimePeekApp'

export const metadata: Metadata = {
  title: 'Uptime Peek — is it down right now?',
  description:
    'Live reachability and latency checks on your sites from your browser, with a latency sparkline per monitor.',
}

export default function UptimePeekPage() {
  return (
    <ToolShell slug="uptime-peek">
      <UptimePeekApp />
    </ToolShell>
  )
}
