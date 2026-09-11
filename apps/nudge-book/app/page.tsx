import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { NudgeBookApp } from '@/components/NudgeBookApp'

export const metadata: Metadata = {
  title: "Nudge Book",
  description: "A booking page plus reminders that cut no-shows.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="nudge-book">
        <NudgeBookApp />
      </ToolShell>
    </>
  )
}
