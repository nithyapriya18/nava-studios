import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { EtsyLedgerApp } from '@/components/EtsyLedgerApp'

export const metadata: Metadata = {
  title: "Etsy Ledger",
  description: "Upload your Etsy CSV, get your real profit.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="etsy-ledger">
        <EtsyLedgerApp />
      </ToolShell>
    </>
  )
}
