import type { Metadata } from 'next'
import { siteConfig, contactHref, contactIsExternal } from '@/config'
import { FAQS, STEPS, STEP_GETS } from '@/lib/process'
import { TrackedLink } from '@/components/tracked-link'
import { Faq } from '@/components/faq'
import { TileStack } from '@/components/tile-stack'
import { Arrow, Note, PenUnderline } from '@/components/pen'
import { Generate } from '@/components/generate'

export const metadata: Metadata = {
  title: 'How it works',
  description: `How a project with ${siteConfig.name} runs, from the first call to launch. You get a written scope and a fixed price before any work starts.`,
}

export default function StartPage() {
  const ctaProps = contactIsExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  return (
    <TileStack>
      <section className="tile band page-head">
        <p className="label">How it works</p>
        <h1 className="display">
          <Generate>
            How a project{' '}
            <PenUnderline draw>
              <em>runs</em>
            </PenUnderline>
          </Generate>
        </h1>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Every project follows the same five steps, from the first conversation to launch. At each one
          you know what it costs and what you get.
        </p>
      </section>

      <section className="tile section" aria-labelledby="steps-h">
        <p className="label" id="steps-h">
          The five steps
        </p>
        <div className="section-body">
          <ol className="steps long">
            {STEPS.map((step, i) => (
              <li key={step.n} className="step">
                <span className="step-n">{step.n}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span className="label">{step.verb}</span>
                  <h2 className="h2" style={{ fontSize: 'clamp(26px, 3vw, 34px)' }}>
                    {step.title}
                  </h2>
                  <p className="measure muted">{step.body}</p>
                  <p className="get">
                    <span className="label">You get</span>
                    <b>{STEP_GETS[i]}</b>
                  </p>
                </div>
                {i === 1 && <Note>the price is set here, once</Note>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tile section" aria-labelledby="faq-h">
        <p className="label">Common questions</p>
        <div className="section-body">
          <h2 id="faq-h" className="h2">
            Common <em>questions</em>
          </h2>
          <Faq items={FAQS} />
          <p className="muted">If yours isn’t here, send it over. It’s a good thing to talk about on the first call.</p>
        </div>
      </section>

      <section className="tile section band-warm" aria-labelledby="start-h">
        <p className="label">Start</p>
        <div className="section-body">
          <h2 id="start-h" className="h2">
            Start with a <em>message</em>
          </h2>
          <p className="measure muted">
            Tell me what you want to build and who it’s for. A few lines is enough, and I’ll reply by email
            with any questions before we talk.
          </p>
          <div className="btns">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              Get in touch <Arrow />
            </a>
            <TrackedLink
              href={siteConfig.profileUrl}
              event="profile_opened"
              properties={{ location: 'how_it_works' }}
              className="more"
            >
              Read my profile first <Arrow />
            </TrackedLink>
          </div>
        </div>
      </section>
    </TileStack>
  )
}
