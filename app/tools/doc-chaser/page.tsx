import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { DocChaserApp } from '@/apps/tools/DocChaserApp'

export const metadata: Metadata = {
  title: 'Doc Chaser — stop chasing clients for documents',
  description:
    'Per-client monthly checklists, shareable checklist links, and one-tap polite chase messages for bookkeepers and accountants.',
}

export default function DocChaserPage() {
  return (
    <ToolShell slug="doc-chaser">
      <DocChaserApp />
    </ToolShell>
  )
}
