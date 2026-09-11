import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { APP_LINKS } from '@nava-studios/catalog'
import { GstCalculatorApp } from '@/components/GstCalculatorApp'

export const metadata: Metadata = {
  title: "GST Calculator — forward & reverse GST with itemized bills",
  description: "Free GST calculator for Indian businesses: forward & reverse GST, CGST/SGST vs IGST split, and itemized bill totals.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="gst-calculator">
        <GstCalculatorApp />
      </ToolShell>
      <section className="border-t border-border bg-surface py-10">
        <div className="max-w-layout mx-auto flex flex-wrap items-center justify-between gap-4 px-6 md:px-8">
          <div>
            <p className="font-display text-lg font-semibold text-text-primary">
              Calculated the GST? Now send the invoice.
            </p>
            <p className="mt-1 text-sm text-text-muted">
              One-Page Invoice turns these numbers into a professional, GST-ready
              invoice — free, no signup for your first one.
            </p>
          </div>
          <a
            href={APP_LINKS['one-page-invoice']}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-md"
          >
            Create the invoice
          </a>
        </div>
      </section>
    </>
  )
}
