import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { ProposalForgeApp } from '@/components/ProposalForgeApp'

export const metadata: Metadata = {
  title: "Proposal Forge",
  description: "Answer six questions, get a client-ready proposal.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="proposal-forge">
        <ProposalForgeApp />
      </ToolShell>
    </>
  )
}
