import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} handles data on this website.`,
}

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-accent mb-3">Legal</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
                Privacy Policy
              </h1>
              <p className="text-text-muted text-sm mb-10">
                Last updated: 13 September 2026 · Operated by {siteConfig.name}
              </p>

              <div className="prose prose-invert max-w-none space-y-8 text-text-primary/90 leading-relaxed">
                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Introduction</h2>
                  <p className="text-text-muted">
                    This policy describes how I collect, use, and protect
                    information when you use this website. I aim to collect
                    only what is needed to run the studio and the tools on it.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Information I collect</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text-muted">
                    <li>
                      <strong className="text-text-primary">Website analytics:</strong> Standard server and product
                      analytics may include IP address, browser type, pages visited, and timestamps, processed by my
                      hosting provider (Vercel) and analytics provider (PostHog).
                    </li>
                    <li>
                      <strong className="text-text-primary">Session replay:</strong> PostHog also records a replay of
                      how you use this site (mouse movement, clicks, and on-screen content, including anything shown
                      in results from tools like Roast My Launch) to help me spot bugs and confusing moments. Inputs
                      like password fields are masked automatically. You can opt out in your browser (see &ldquo;Your
                      choices&rdquo; below).
                    </li>
                    <li>
                      <strong className="text-text-primary">Roast My Launch:</strong> Text or a URL you paste into the{' '}
                      <Link href="/roast" className="text-accent hover:underline">
                        Roast My Launch
                      </Link>{' '}
                      tool is sent to Anthropic&apos;s API to generate a response. It is not stored by me beyond what is
                      needed to serve that one request and apply basic rate limiting.
                    </li>
                    <li>
                      <strong className="text-text-primary">Communications:</strong> If you email me or book a call, I
                      receive your contact details and the contents of your message.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">How I use information</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text-muted">
                    <li>To operate, maintain, and improve this website and the tools on it.</li>
                    <li>To respond to support requests and quote custom work.</li>
                    <li>To comply with legal obligations where applicable.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Sharing and third parties</h2>
                  <p className="text-text-muted">
                    I do not sell your personal information. I use a small set of service providers — hosting
                    (Vercel), analytics (PostHog), the underlying model for Roast My Launch (Anthropic), and a
                    database for rate limiting (Supabase) — who process data on my behalf. Those providers are
                    subject to their own privacy policies.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Data retention</h2>
                  <p className="text-text-muted">
                    Email correspondence is retained as needed to provide support and for ordinary business records.
                    I do not keep a permanent copy of what you paste into Roast My Launch.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Your choices</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text-muted">
                    <li>
                      You may disable cookies, analytics, or session replay in your browser where applicable (for
                      example, ad-blockers and tracking-protection settings that block PostHog will also block
                      replay).
                    </li>
                    <li>You may contact me to ask questions about this policy (see Support).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Children</h2>
                  <p className="text-text-muted">
                    This website is not directed at children under 13, and I do not knowingly collect personal
                    information from children.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Changes</h2>
                  <p className="text-text-muted">
                    I may update this policy from time to time. The &quot;Last updated&quot; date at the top will
                    change when I do.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Contact</h2>
                  <p className="text-text-muted">
                    Questions about this policy:{' '}
                    <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                      {siteConfig.email}
                    </a>{' '}
                    ·{' '}
                    <Link href="/support" className="text-accent hover:underline">
                      Support page
                    </Link>
                  </p>
                </section>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
