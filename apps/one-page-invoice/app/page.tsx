import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { OnePageInvoiceApp } from '@/components/OnePageInvoiceApp'

export const metadata: Metadata = {
  title: "One-Page Invoice — free GST invoice generator",
  description: "Create a professional, GST-ready invoice in 60 seconds. Free, no signup — download as PDF or send on WhatsApp.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="one-page-invoice">
        <OnePageInvoiceApp />
      </ToolShell>
    </>
  )
}
