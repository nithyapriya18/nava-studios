import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { QuoteCardApp } from '@/apps/tools/QuoteCardApp'

export const metadata: Metadata = {
  title: 'Quote Card — an instant-quote calculator for your business',
  description:
    'Build your pricing formula once, share one link. Visitors quote themselves and booking requests land in your WhatsApp.',
}

export default function QuoteCardPage() {
  return (
    <ToolShell slug="quote-card">
      <QuoteCardApp />
    </ToolShell>
  )
}
