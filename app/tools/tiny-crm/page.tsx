import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { TinyCrmApp } from '@/apps/tools/TinyCrmApp'

export const metadata: Metadata = {
  title: 'Tiny CRM — contacts, notes, and who to follow up with',
  description:
    'A CRM stripped to what a solo business actually uses: people, notes, next-action dates, and a follow-up list.',
}

export default function TinyCrmPage() {
  return (
    <ToolShell slug="tiny-crm">
      <TinyCrmApp />
    </ToolShell>
  )
}
