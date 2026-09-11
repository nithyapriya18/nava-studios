import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { DocChaserApp } from '@/components/DocChaserApp'

export const metadata: Metadata = {
  title: "Doc Chaser",
  description: "Stops bookkeepers chasing clients for documents.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="doc-chaser">
        <DocChaserApp />
      </ToolShell>
    </>
  )
}
