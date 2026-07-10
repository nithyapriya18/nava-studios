import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { MarginLensApp } from '@/apps/tools/MarginLensApp'

export const metadata: Metadata = {
  title: 'Margin Lens — your true per-order profit after every fee',
  description:
    'See real margin per order after platform fees, payment fees, apps and shipping. The number your sales dashboard hides.',
}

export default function MarginLensPage() {
  return (
    <ToolShell slug="margin-lens">
      <MarginLensApp />
    </ToolShell>
  )
}
