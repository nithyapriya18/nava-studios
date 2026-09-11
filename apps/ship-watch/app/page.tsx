import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { ShipWatchApp } from '@/components/ShipWatchApp'

export const metadata: Metadata = {
  title: "Ship Watch",
  description: "Every shipment, every carrier, one board.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="ship-watch">
        <ShipWatchApp />
      </ToolShell>
    </>
  )
}
