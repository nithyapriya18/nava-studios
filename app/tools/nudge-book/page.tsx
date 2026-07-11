import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { NudgeBookApp } from '@/apps/tools/NudgeBookApp'

export const metadata: Metadata = {
  title: 'Nudge Book — a booking page plus reminders that cut no-shows',
  description:
    'One booking link for your customers and one-tap WhatsApp reminders that cut no-shows from 30% to 5%.',
}

export default function NudgeBookPage() {
  return (
    <ToolShell slug="nudge-book">
      <NudgeBookApp />
    </ToolShell>
  )
}
