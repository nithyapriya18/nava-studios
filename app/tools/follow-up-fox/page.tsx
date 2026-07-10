import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { FoxApp } from '@/apps/getpaid/components/FoxApp'

export const metadata: Metadata = {
  title: 'Follow-Up Fox — polite payment reminders for overdue invoices',
  description:
    'Track unpaid invoices and send polite, escalating payment reminders on WhatsApp or email — without writing another awkward message.',
}

export default function FoxPage() {
  return (
    <ToolShell slug="follow-up-fox">
      <FoxApp />
    </ToolShell>
  )
}
