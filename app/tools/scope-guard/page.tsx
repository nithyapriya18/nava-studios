import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { ScopeGuardApp } from '@/apps/tools/ScopeGuardApp'

export const metadata: Metadata = {
  title: 'Scope Guard — log scope creep, bill it politely',
  description:
    'Log every "one small thing" clients add and turn them into a polite change-order email with the price.',
}

export default function ScopeGuardPage() {
  return (
    <ToolShell slug="scope-guard">
      <ScopeGuardApp />
    </ToolShell>
  )
}
