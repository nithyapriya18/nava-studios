import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { ScopeGuardApp } from '@/components/ScopeGuardApp'

export const metadata: Metadata = {
  title: "Scope Guard",
  description: "Logs every “one small thing” and turns it into a change-order email.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="scope-guard">
        <ScopeGuardApp />
      </ToolShell>
    </>
  )
}
