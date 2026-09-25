import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: `How ${siteConfig.name} handles data on this website.`,
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-content px-6 pt-16 md:px-8 md:pt-24">
      <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Privacy policy</h1>
      <p className="mt-4 font-sans text-sm text-text-muted">
        Last updated 24 September 2026. {siteConfig.name} is run by {siteConfig.founderFull}.
      </p>

      <div className="prose mt-10">
        <p>
          This policy explains what I collect when you use this website, how I use it,
          and who else processes it. I try to collect only what I need to run the
          studio and the tools on this site.
        </p>

        <h2>What I collect</h2>
        <h3>Analytics</h3>
        <p>
          Standard server and product analytics may include your IP address, browser
          type, the pages you visit, and timestamps. My hosting provider (Vercel) and
          analytics provider (PostHog) process this data.
        </p>
        <h3>Session replay</h3>
        <p>
          PostHog also records a replay of how you use the site: mouse movement,
          clicks, and what&apos;s on screen, including results shown by tools like
          Landing Page Review. I use it to find bugs and confusing moments. Inputs such as
          password fields are masked automatically. You can opt out in your browser,
          as described under &ldquo;Your choices&rdquo; below.
        </p>
        <h3>Landing Page Review</h3>
        <p>
          Text or a link you paste into{' '}
          <Link href="/review">Landing Page Review</Link> is sent to Anthropic&apos;s API to
          generate the review. I don&apos;t store it beyond what&apos;s needed to serve
          that one request and apply basic rate limiting.
        </p>
        <h3>Messages</h3>
        <p>
          If you use the contact form, email me or book a call, I receive your name,
          email address, company if you give it, and whatever you write. Messages from
          the contact form are delivered to my inbox by Resend, an email service.
        </p>

        <h2>How I use it</h2>
        <ul>
          <li>To run, maintain, and improve this website and its tools</li>
          <li>To answer support requests and quote custom work</li>
          <li>To meet legal obligations where they apply</li>
        </ul>

        <h2>Who else processes it</h2>
        <p>
          I don&apos;t sell your personal information. A small set of providers process
          data on my behalf: Vercel for hosting, PostHog for analytics, Anthropic for
          the model behind Landing Page Review, Resend for delivering contact form
          messages, and Supabase for the rate-limiting database. Each has its own privacy policy.
        </p>

        <h2>How long I keep it</h2>
        <p>
          I keep email correspondence as long as I need it for support and ordinary
          business records. I don&apos;t keep a permanent copy of what you paste into
          Landing Page Review.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>
            You can turn off cookies, analytics, or session replay in your browser
            where it allows. Ad blockers and tracking protection that block PostHog also
            block replay.
          </li>
          <li>
            You can ask me anything about this policy. See the{' '}
            <Link href="/support">support page</Link>.
          </li>
        </ul>

        <h2>Children</h2>
        <p>
          This website isn&apos;t aimed at children under 13, and I don&apos;t knowingly
          collect personal information from children.
        </p>

        <h2>Changes</h2>
        <p>
          I may update this policy. When I do, the date at the top of this page changes.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can go to{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </div>
  )
}
