import { siteConfig, mailtoHref } from '@/config'
import { ContactForm } from '@/components/contact-form'
import { TrackedLink } from '@/components/tracked-link'

const next = [
  'I reply by email, usually with a few questions.',
  'We have a call to talk the idea through.',
  'You get a written scope and a fixed price.',
]

/** The gradient panel with the contact form, used on Home and /contact. */
export function ContactBand({ heading = 'h2' }: { heading?: 'h1' | 'h2' }) {
  const Heading = heading
  return (
    <div className="bg-band overflow-hidden rounded-[2rem] px-6 py-12 text-white md:px-12 md:py-16">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-14">
        <div>
          <Heading className="text-3xl font-semibold leading-tight md:text-5xl">
            Tell me about your project
          </Heading>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
            A few lines about what you want to build and who it&apos;s for is enough to
            start. There&apos;s no cost or commitment at this stage.
          </p>
          <h3 className="mt-10 font-semibold text-white">
            What happens next
          </h3>
          <ol className="mt-4 space-y-3">
            {next.map((step, i) => (
              <li key={step} className="flex gap-3 leading-relaxed text-white/90">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 text-sm font-semibold tabular-nums">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[0.9375rem] text-white/70">
            Prefer email?{' '}
            <TrackedLink
              href={mailtoHref}
              event="email_clicked"
              properties={{ location: 'contact_panel' }}
              className="text-white underline underline-offset-4"
            >
              {siteConfig.email}
            </TrackedLink>
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
