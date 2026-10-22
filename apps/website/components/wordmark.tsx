import Link from 'next/link'
import { siteConfig } from '@/config'

/** "studio npv": sans, then the initials in serif italic, in the accent colour. */
export function Wordmark() {
  return (
    <Link href="/" aria-label={`${siteConfig.name}, home`} className="logo">
      studio <b>npv</b>
    </Link>
  )
}
