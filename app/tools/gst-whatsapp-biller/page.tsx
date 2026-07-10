import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { BillerApp } from '@/apps/getpaid/components/BillerApp'

export const metadata: Metadata = {
  title: 'GST WhatsApp Biller — invoices with UPI pay links on WhatsApp',
  description:
    'Create GST invoices and send them into WhatsApp with a UPI payment link. Track paid vs unpaid and nudge politely.',
}

export default function BillerPage() {
  return (
    <ToolShell slug="gst-whatsapp-biller">
      <BillerApp />
    </ToolShell>
  )
}
