import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { MemberGateApp } from '@/components/MemberGateApp'

export const metadata: Metadata = {
  title: "Member Gate",
  description: "Put any content behind a paywall link.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="member-gate">
        <MemberGateApp />
      </ToolShell>
    </>
  )
}
