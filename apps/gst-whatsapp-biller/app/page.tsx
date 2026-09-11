import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { BillerApp } from '@/components/BillerApp'

export const metadata: Metadata = {
  title: "GST WhatsApp Biller",
  description: "Send GST invoices with a UPI pay link straight into WhatsApp.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="gst-whatsapp-biller">
        <BillerApp />
      </ToolShell>
    </>
  )
}
