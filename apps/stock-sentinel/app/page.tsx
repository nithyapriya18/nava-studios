import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { StockSentinelApp } from '@/components/StockSentinelApp'

export const metadata: Metadata = {
  title: "Stock Sentinel",
  description: "A plain email when a product runs low.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="stock-sentinel">
        <StockSentinelApp />
      </ToolShell>
    </>
  )
}
