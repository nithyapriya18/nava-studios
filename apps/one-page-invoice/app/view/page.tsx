'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Printer } from 'lucide-react'
import { InvoiceDoc } from '@nava-studios/kit'
import { decodeShare } from '@nava-studios/kit'
import type { Invoice } from '@nava-studios/kit'

/** Read-only invoice view — the whole invoice travels in the URL hash. */
export default function InvoiceViewPage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setInvoice(decodeShare<Invoice>(hash))
    setChecked(true)
  }, [])

  return (
    <div className="bg-background py-10 md:py-14">
      <div className="max-w-content mx-auto space-y-5 px-6 md:px-8">
        {invoice ? (
          <>
            <div className="flex items-center justify-between print:hidden">
              <p className="text-sm text-text-muted">
                Invoice {invoice.number} from {invoice.business.name}
              </p>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                <Printer size={13} /> Print / Save PDF
              </button>
            </div>
            <div className="print-area">
              <InvoiceDoc invoice={invoice} />
            </div>
            <p className="pt-2 text-center text-xs text-text-muted print:hidden">
              Made with{' '}
              <Link href="/" className="text-accent hover:underline">
                One-Page Invoice
              </Link>{' '}
              — free invoices by Nava Studios
            </p>
          </>
        ) : (
          <p className="py-20 text-center text-sm text-text-muted">
            {checked
              ? 'This invoice link is invalid or incomplete — ask the sender to share it again.'
              : 'Loading invoice…'}
          </p>
        )}
      </div>
    </div>
  )
}
