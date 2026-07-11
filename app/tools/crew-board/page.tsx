import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { CrewBoardApp } from '@/apps/tools/CrewBoardApp'

export const metadata: Metadata = {
  title: 'Crew Board — one schedule for your field crew',
  description:
    'Plan the day, assign jobs, and WhatsApp each crew member their day sheet — instead of three group chats and a spreadsheet.',
}

export default function CrewBoardPage() {
  return (
    <ToolShell slug="crew-board">
      <CrewBoardApp />
    </ToolShell>
  )
}
