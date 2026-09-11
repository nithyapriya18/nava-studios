import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { TradeQuoteApp } from '@/components/TradeQuoteApp'

export const metadata: Metadata = {
  title: "Trade Quote",
  description: "Phone-first quotes for the one-truck contractor.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="trade-quote">
        <TradeQuoteApp />
      </ToolShell>
    </>
  )
}
