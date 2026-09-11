import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { TinyCrmApp } from '@/components/TinyCrmApp'

export const metadata: Metadata = {
  title: "Tiny CRM",
  description: "Contacts, notes, and a weekly follow-up email.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="tiny-crm">
        <TinyCrmApp />
      </ToolShell>
    </>
  )
}
