import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { RentLedgerApp } from '@/apps/tools/RentLedgerApp'

export const metadata: Metadata = {
  title: 'Rent Ledger — rent tracking for the 2–10 unit landlord',
  description:
    'Track units, tenants and rent due. WhatsApp reminders and receipts, late flags, without enterprise property software.',
}

export default function RentLedgerPage() {
  return (
    <ToolShell slug="rent-ledger">
      <RentLedgerApp />
    </ToolShell>
  )
}
