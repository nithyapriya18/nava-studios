import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { ShipWatchApp } from '@/apps/tools/ShipWatchApp'

export const metadata: Metadata = {
  title: 'Ship Watch — every shipment, every carrier, one board',
  description:
    'Paste tracking numbers from any carrier into one board with live-track links and late flags.',
}

export default function ShipWatchPage() {
  return (
    <ToolShell slug="ship-watch">
      <ShipWatchApp />
    </ToolShell>
  )
}
