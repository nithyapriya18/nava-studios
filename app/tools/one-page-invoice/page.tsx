import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { OnePageInvoiceApp } from '@/apps/getpaid/components/OnePageInvoiceApp'

export const metadata: Metadata = {
  title: 'One-Page Invoice — free GST invoice generator',
  description:
    'Create a professional, GST-ready invoice in 60 seconds. Free, no signup — download as PDF or send on WhatsApp.',
}

export default function OnePageInvoicePage() {
  return (
    <ToolShell slug="one-page-invoice">
      <OnePageInvoiceApp />
    </ToolShell>
  )
}
