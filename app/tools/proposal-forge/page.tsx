import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { ProposalForgeApp } from '@/apps/tools/ProposalForgeApp'

export const metadata: Metadata = {
  title: 'Proposal Forge — six answers, one client-ready proposal',
  description:
    'Answer six questions about the gig and get a structured proposal with an accept button. No monthly proposal platform.',
}

export default function ProposalForgePage() {
  return (
    <ToolShell slug="proposal-forge">
      <ProposalForgeApp />
    </ToolShell>
  )
}
