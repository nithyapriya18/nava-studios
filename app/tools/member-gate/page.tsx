import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { MemberGateApp } from '@/apps/tools/MemberGateApp'

export const metadata: Metadata = {
  title: 'Member Gate — a paywall link for anything',
  description:
    'Put any community, newsletter, or content behind a UPI paywall link. You approve every member personally.',
}

export default function MemberGatePage() {
  return (
    <ToolShell slug="member-gate">
      <MemberGateApp />
    </ToolShell>
  )
}
