import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { CrewBoardApp } from '@/components/CrewBoardApp'

export const metadata: Metadata = {
  title: "Crew Board",
  description: "One schedule for your field crew.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="crew-board">
        <CrewBoardApp />
      </ToolShell>
    </>
  )
}
