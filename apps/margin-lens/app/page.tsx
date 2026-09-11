import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { MarginLensApp } from '@/components/MarginLensApp'

export const metadata: Metadata = {
  title: "Margin Lens",
  description: "Your true per-order profit after every fee.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="margin-lens">
        <MarginLensApp />
      </ToolShell>
    </>
  )
}
