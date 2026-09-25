import type { Metadata } from 'next'
import { siteConfig } from '@/config'
import { ContactBand } from '@/components/contact-band'

export const metadata: Metadata = {
  title: 'Get in touch',
  description: `Tell ${siteConfig.founder} about the product you want to build. You'll get a reply by email, then a call, a written scope and a fixed price.`,
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-layout px-4 pt-10 md:px-6 md:pt-16">
      <ContactBand heading="h1" />
    </div>
  )
}
