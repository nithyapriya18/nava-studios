import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { FoxApp } from '@/components/FoxApp'

export const metadata: Metadata = {
  title: "Follow-Up Fox",
  description: "Polite, escalating reminders for overdue invoices.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="follow-up-fox">
        <FoxApp />
      </ToolShell>
    </>
  )
}
