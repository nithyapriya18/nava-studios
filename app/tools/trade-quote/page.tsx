import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { TradeQuoteApp } from '@/apps/tools/TradeQuoteApp'

export const metadata: Metadata = {
  title: 'Trade Quote — phone-first quotes for contractors',
  description:
    'Keep your price list on your phone, build a quote by tapping, send it on WhatsApp, and convert accepted quotes to invoices.',
}

export default function TradeQuotePage() {
  return (
    <ToolShell slug="trade-quote">
      <TradeQuoteApp />
    </ToolShell>
  )
}
