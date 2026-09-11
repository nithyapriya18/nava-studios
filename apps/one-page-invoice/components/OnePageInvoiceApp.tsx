'use client'

import { useEffect, useMemo, useState } from 'react'
import { Printer, Link2, MessageCircle, Check } from 'lucide-react'
import { APP_LINKS } from '@nava-studios/catalog'
import { InvoiceForm } from '@nava-studios/kit'
import { InvoiceDoc, computeInvoice } from '@nava-studios/kit'
import { useLocalState, encodeShare } from '@nava-studios/kit'
import { buildWhatsAppLink, invoiceMessage } from '@nava-studios/kit'
import {
  EMPTY_BUSINESS,
  EMPTY_CLIENT,
  newInvoiceId,
  todayISO,
  addDaysISO,
  type Invoice,
  type BusinessProfile,
} from '@nava-studios/kit'

function freshInvoice(business: BusinessProfile): Invoice {
  const date = todayISO()
  return {
    id: newInvoiceId(),
    number: `INV-${date.replaceAll('-', '').slice(2)}-01`,
    date,
    dueDate: addDaysISO(date, 15),
    gstMode: true,
    gstRatePercent: 18,
    supplyType: 'intra',
    business,
    client: EMPTY_CLIENT,
    lines: [{ description: '', hsn: '', quantity: 1, unitRate: 0 }],
    notes: '',
    status: 'draft',
  }
}

export function OnePageInvoiceApp() {
  // Business profile persists across invoices; the invoice itself is ephemeral.
  const [savedBusiness, setSavedBusiness, businessHydrated] =
    useLocalState<BusinessProfile>('getpaid:business', EMPTY_BUSINESS)
  const [invoice, setInvoice] = useState<Invoice>(() => freshInvoice(EMPTY_BUSINESS))
  const [copied, setCopied] = useState(false)

  // Pull the saved business profile in once storage hydrates.
  useEffect(() => {
    if (businessHydrated && savedBusiness.name) {
      setInvoice((inv) =>
        inv.business.name ? inv : { ...inv, business: savedBusiness },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessHydrated])

  const { totals } = useMemo(() => computeInvoice(invoice), [invoice])

  const handleChange = (next: Invoice) => {
    setInvoice(next)
    setSavedBusiness(next.business)
  }

  const shareUrl = () => {
    const encoded = encodeShare(invoice)
    return `${APP_LINKS["one-page-invoice"]}/view#${encoded}`
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this invoice link:', shareUrl())
    }
  }

  const sendWhatsApp = () => {
    const message = invoiceMessage(invoice, totals.total, shareUrl())
    window.open(buildWhatsAppLink(invoice.client.phone, message), '_blank')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="print:hidden">
        <InvoiceForm invoice={invoice} onChange={handleChange} />
      </div>

      {/* Preview + actions */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? 'Copied!' : 'Copy invoice link'}
          </button>
          <button
            onClick={sendWhatsApp}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            <MessageCircle size={14} /> Send on WhatsApp
          </button>
        </div>
        <div className="print-area">
          <InvoiceDoc invoice={invoice} />
        </div>
        <p className="text-xs text-text-muted print:hidden">
          The invoice link contains the invoice itself — nothing is stored on any
          server. Anyone with the link can view it.
        </p>
      </div>
    </div>
  )
}
