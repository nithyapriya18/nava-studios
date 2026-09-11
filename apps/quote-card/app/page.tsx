import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { QuoteCardApp } from '@/components/QuoteCardApp'

export const metadata: Metadata = {
  title: "Quote Card",
  description: "An instant-quote widget for your website.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="quote-card">
        <QuoteCardApp />
      </ToolShell>
    </>
  )
}
