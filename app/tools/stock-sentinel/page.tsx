import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { StockSentinelApp } from '@/apps/tools/StockSentinelApp'

export const metadata: Metadata = {
  title: 'Stock Sentinel — dead-simple low-stock alerts',
  description:
    'Set a threshold per product and see what is running low — without a forecasting suite attached.',
}

export default function StockSentinelPage() {
  return (
    <ToolShell slug="stock-sentinel">
      <StockSentinelApp />
    </ToolShell>
  )
}
