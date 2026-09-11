import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { RentLedgerApp } from '@/components/RentLedgerApp'

export const metadata: Metadata = {
  title: "Rent Ledger",
  description: "Rent tracking for the 2–10 unit landlord.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="rent-ledger">
        <RentLedgerApp />
      </ToolShell>
    </>
  )
}
