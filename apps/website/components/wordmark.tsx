import Link from 'next/link'
import { siteConfig } from '@/config'

/** "studio npv", with npv in the brand gradient. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, home`}
      className={`inline-flex items-baseline gap-[0.28em] whitespace-nowrap rounded-lg font-sans leading-none tracking-[-0.02em] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
    >
      <span className="font-normal text-text-primary/70">studio</span>
      <span className="text-grad font-extrabold">npv</span>
    </Link>
  )
}
