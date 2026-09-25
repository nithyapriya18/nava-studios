import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config'
import { REVIEW_PRODUCT, reviewHref } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: `How ${siteConfig.name} collects, uses and protects personal data on this website.`,
}

export default function PrivacyPage() {
  const email = <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>

  return (
    <div className="mx-auto max-w-content px-6 pt-16 md:px-8 md:pt-24">
      <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Privacy policy</h1>
      <p className="mt-4 font-sans text-sm text-text-muted">Last updated 25 September 2026</p>

      <div className="prose mt-10">
        <p>
          This policy explains what personal data this website collects, why, who helps
          process it, how long it is kept and the choices you have. It applies to{' '}
          {siteConfig.url.replace('https://', '')} and the tools on it, including{' '}
          {REVIEW_PRODUCT.name}.
        </p>
        <p>
          The website is run by {siteConfig.founderFull}, trading as {siteConfig.name},{' '}
          {siteConfig.location}, India, who is responsible for the personal data described
          here. I collect only what I need to run the site, provide its tools and respond
          to people who get in touch, and I don&apos;t sell personal data or use it for
          advertising.
        </p>

        <h2>1. What I collect</h2>

        <h3>Visits and use of the site</h3>
        <p>
          When you visit, my analytics provider records the pages you view, when and for
          how long, the page or site that referred you, your device and browser type, and
          your approximate location (country and city), which is worked out from your IP
          address. It also records certain actions, such as opening a page, submitting a
          form, using {REVIEW_PRODUCT.name}, downloading my resume or following the link to
          my LinkedIn profile. For these actions it records that they happened, not what
          you typed.
        </p>

        <h3>Session recordings</h3>
        <p>
          My analytics provider may also record how a visit unfolds, such as scrolling,
          clicks and what appears on screen, so I can find and fix problems with the site.
          Text you type into form fields is masked in these recordings.
        </p>

        <h3>{REVIEW_PRODUCT.name}</h3>
        <p>
          When you use <Link href={reviewHref}>{REVIEW_PRODUCT.name}</Link>, I keep a
          record of the text or link you submit, the review produced, the time, your IP
          address, approximate location and browser type. To produce the review, what you
          submit is sent to an AI service provider. I also keep a count of reviews by IP
          address, which is how the limit of two free reviews a day is applied. Please
          don&apos;t submit confidential or personal information to the tool.
        </p>

        <h3>Resume downloads and profile visits</h3>
        <p>
          When you download my resume or follow the link to my LinkedIn profile from this
          site, I keep a record of the time, the page you were on, your IP address,
          approximate location and browser type. This helps me understand interest in my
          work.
        </p>

        <h3>Messages</h3>
        <p>
          If you use the contact form or email me, I receive your name, email address,
          company or website if you give it, and your message.
        </p>

        <h3>Hosting</h3>
        <p>
          Like most websites, the site&apos;s host keeps standard technical logs, such as
          IP addresses and request times, to operate and secure the service.
        </p>

        <h2>2. How I use it</h2>
        <ul>
          <li>To run the website and its tools, and keep them secure and working well</li>
          <li>To provide {REVIEW_PRODUCT.name}, apply its fair-use limits and prevent misuse</li>
          <li>To understand how the site is used and which of my services interest visitors</li>
          <li>To reply to messages, discuss projects and prepare quotes</li>
          <li>To meet legal obligations</li>
        </ul>
        <p>
          I don&apos;t use your data for advertising, sell it or share it with anyone for
          their own marketing, and I don&apos;t use it to contact you unless you have
          contacted me first.
        </p>

        <h2>3. Legal basis and consent</h2>
        <p>
          I handle personal data in line with applicable data protection laws, including
          India&apos;s Digital Personal Data Protection Act, 2023. By using this website and
          choosing to submit information through it, you consent to the processing
          described in this policy. Where other laws apply, I rely on my legitimate
          interest in operating, securing and improving the site and in responding to
          interest in my services, and on legal obligations where relevant. You can
          withdraw your consent at any time by contacting me; this doesn&apos;t affect
          processing carried out before you withdraw it.
        </p>

        <h2>4. Cookies and similar technologies</h2>
        <p>
          The analytics tool uses a cookie and your browser&apos;s local storage to
          recognise a returning visitor and group the pages of a single visit. I don&apos;t
          use advertising cookies or track you across other websites. You can block or
          delete cookies in your browser settings, and the site will still work.
        </p>

        <h2>5. Who processes it</h2>
        <p>
          I use a small number of trusted service providers who process data on my behalf
          and only for the purposes above:
        </p>
        <ul>
          <li>Vercel, for hosting the website</li>
          <li>PostHog, for analytics and session recordings</li>
          <li>Supabase, for the database that holds the records and limits described above</li>
          <li>Anthropic, the AI service that writes {REVIEW_PRODUCT.name} reviews</li>
          <li>Resend, for delivering contact form messages to my inbox</li>
        </ul>
        <p>
          These providers may store or process data outside India, including in the United
          States and the European Union, under their own security and privacy commitments.
          I may also disclose information where required by law.
        </p>

        <h2>6. How long it is kept</h2>
        <ul>
          <li>
            {REVIEW_PRODUCT.name} records, resume download and profile visit records: up to
            12 months
          </li>
          <li>Review counts used for the daily limit: reset every 24 hours</li>
          <li>Analytics and session recordings: no longer than my analytics plan retains them</li>
          <li>
            Messages: as long as needed to handle your enquiry and for ordinary business
            records
          </li>
        </ul>

        <h2>7. How it is protected</h2>
        <p>
          Access to this data is limited to me, through password-protected accounts. The
          records described above are stored so that they can&apos;t be read through the
          website itself, and the site is served over an encrypted connection. No system is
          completely secure, but I take reasonable steps to protect the data I hold.
        </p>

        <h2>8. Your rights</h2>
        <p>
          Subject to applicable law, you can ask to access the personal data I hold about
          you, have it corrected or deleted, withdraw your consent, or nominate someone to
          exercise these rights on your behalf. To make a request, email {email} with enough
          detail for me to find the relevant records, for example roughly when you visited
          or what you submitted. I&apos;ll respond within 30 days.
        </p>
        <p>
          If you&apos;re not satisfied with my response, you may raise a complaint with the
          relevant data protection authority, which in India is the Data Protection Board of
          India.
        </p>

        <h2>9. Automated reviews</h2>
        <p>
          {REVIEW_PRODUCT.name} produces an automated review of the content you submit. It
          assesses that content only, and isn&apos;t used to make decisions about you.
        </p>

        <h2>10. Children</h2>
        <p>
          This website is intended for business users and isn&apos;t aimed at anyone under
          18. I don&apos;t knowingly collect personal data from children.
        </p>

        <h2>11. Changes to this policy</h2>
        <p>
          I may update this policy from time to time. The date at the top shows when it was
          last changed, and significant changes will be reflected here before they take
          effect.
        </p>

        <h2>12. Contact</h2>
        <p>
          For any question or request about your personal data, contact {siteConfig.founderFull}{' '}
          at {email}.
        </p>
      </div>
    </div>
  )
}
