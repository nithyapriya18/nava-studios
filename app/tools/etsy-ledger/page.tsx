import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { EtsyLedgerApp } from '@/apps/tools/EtsyLedgerApp'

export const metadata: Metadata = {
  title: 'Etsy Ledger — real profit from your Etsy CSV',
  description:
    'Upload your Etsy payment account CSV and get categorized fees, true profit, and a summary for your accountant. Nothing leaves your browser.',
}

export default function EtsyLedgerPage() {
  return (
    <ToolShell slug="etsy-ledger">
      <EtsyLedgerApp />
    </ToolShell>
  )
}
