import type { Metadata } from 'next'
import { siteConfig } from '@/config'
import { ContactBand } from '@/components/contact-band'
import { PenUnderline } from '@/components/pen'

export const metadata: Metadata = {
  title: 'Get in touch',
  description: `Tell ${siteConfig.founder} about the product you want to build. You'll get a reply by email, then a call, a written scope and a fixed price.`,
}

export default function ContactPage() {
  return (
    <ContactBand
      page
      title={
        <>
          Tell me about your{' '}
          <PenUnderline draw>
            <em>idea</em>
          </PenUnderline>
        </>
      }
    />
  )
}
