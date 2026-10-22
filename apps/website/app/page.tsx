import Image from 'next/image'
import Link from 'next/link'
import { TileStack } from '@/components/tile-stack'
import { siteConfig, contactHref, contactIsExternal } from '@/config'
import { FAQS } from '@/lib/process'
import { getAllPosts } from '@/lib/mdx'
import { reviewHref } from '@/lib/products'
import { HeroDemo } from '@/components/hero-demo'
import { Faq } from '@/components/faq'
import { ContactBand } from '@/components/contact-band'
import { Arrow, PenCircle, PenUnderline, Tick } from '@/components/pen'

const stats = [
  { n: '10 yrs', t: 'in software and product, starting as an engineer in 2014' },
  { n: '$6.4M', t: 'documented cost impact, NLP redaction platform at Novartis' },
  { n: '500K+', t: 'enterprise users on the supply chain AI I led at Resilinc' },
  { n: 'PSPO I', t: 'Professional Scrum Product Owner, Scrum.org' },
]

const builds = [
  {
    title: 'New products',
    body: 'Web apps and SaaS products for founders, with the core features your users come for.',
  },
  {
    title: 'Apps for your customers',
    body: 'Portals, booking and ordering flows: your customers get things done without calling or emailing you.',
  },
  {
    title: 'Internal tools',
    body: 'Software that replaces the spreadsheets, forms and copy-paste steps your team runs by hand.',
  },
  {
    title: 'Websites that convert',
    body: 'A site that explains what you do clearly and turns visitors into sign-ups or enquiries.',
  },
]

const steps = [
  { title: 'We talk through the idea', body: 'A paragraph, a deck or a full spec is enough. The call is free.' },
  {
    title: 'Written scope, fixed price',
    body: 'What launches, what waits, one price. Nothing billed until you accept.',
    note: 'the price is set here, once',
  },
  { title: 'I design and build it', body: 'From designs to working software. Try it while it’s built.' },
  { title: 'You try it, I refine it', body: 'In-scope changes included. Anything else quoted first.' },
  { title: 'It goes live, it’s yours', body: 'Product, code and notes any developer can pick up.' },
]

const reviewTicks = [
  'Scored on clarity, audience, value, proof, call to action and design',
  'Design reviewed from a screenshot, not just the words',
  'Each issue quotes your page and suggests a fix',
  'Re-review after changes to see your score move',
]

// Posts for someone about to start a project come first.
const FEATURED = ['what-i-need-from-the-first-call', 'what-belongs-in-a-first-version', 'from-ai-prompt-to-trusted-product']

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.']

function shortDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Home() {
  const ctaProps = contactIsExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}
  const all = getAllPosts('writing')
  const posts = FEATURED.map((slug) => all.find((p) => p.slug === slug)).filter((p) => p !== undefined)

  return (
    <TileStack>
      <section className="tile hero band" aria-labelledby="hero-h">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div className="byline">
            <span className="avatar">
              <Image src="/nithya.jpeg" alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35 }}>
              <span style={{ fontWeight: 500, fontSize: 15 }}>{siteConfig.founderFull}</span>
              <span className="muted" style={{ fontSize: 14 }}>
                {siteConfig.name} · {siteConfig.location}
              </span>
            </span>
          </div>
          <h1 id="hero-h" className="display">
            From a <PenCircle draw>napkin</PenCircle> sketch to software <em>people use</em>.
          </h1>
          <p className="lede">
            I design and build software for founders and small businesses. I scope it with you, I build
            it, and the price is fixed before any work starts.
          </p>
          <div className="btns">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              Tell me about your idea <Arrow />
            </a>
            <Link href="/start" className="more">
              How a project runs <Arrow />
            </Link>
          </div>
        </div>
        <HeroDemo />
      </section>

      <section className="tile section" aria-labelledby="who-h">
        <p className="label">Who builds it</p>
        <div className="section-body">
          <h2 id="who-h" className="pull">
            The person who scopes your product is the person who <em>builds</em> it.
          </h2>
          <p className="measure muted">
            I spent most of my career on the product side: talking to users, deciding what to build first
            and working with engineers to ship it. I started as an engineer, so when we weigh what you want
            against what it costs, both are in view from the start.
          </p>
          <div className="stats">
            {stats.map((s) => (
              <div key={s.n}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-t">{s.t}</div>
              </div>
            ))}
          </div>
          <Link href="/about" className="more">
            More about my background <Arrow />
          </Link>
        </div>
      </section>

      <section className="tile section" aria-labelledby="build-h">
        <p className="label">What I build</p>
        <div className="section-body">
          <h2 id="build-h" className="h2">
            Software that does one job <em>well</em> for your business
          </h2>
          <div className="grid2">
            {builds.map((b, i) => (
              <div key={b.title} className="cell">
                <span className="idx">{ROMAN[i]}</span>
                <h3 className="h3">{b.title}</h3>
                <p className="muted">{b.body}</p>
              </div>
            ))}
          </div>
          <p className="muted">If your project isn’t one of these, tell me about it anyway.</p>
        </div>
      </section>

      <section className="tile section" aria-labelledby="how-h">
        <p className="label">How a project runs</p>
        <div className="section-body">
          <h2 id="how-h" className="h2">
            Five steps, one <PenUnderline draw>fixed price</PenUnderline>
          </h2>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step-n">{i + 1}</span>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted" style={{ fontSize: 15 }}>
                    {s.body}
                  </p>
                </div>
                {s.note && (
                  <p className="note" style={{ fontSize: 18 }}>
                    {s.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <Link href="/start" className="more">
            Each step in detail <Arrow />
          </Link>
        </div>
      </section>

      <section className="tile section band-warm" aria-labelledby="proof-h">
        <p className="label">Something I built</p>
        <div className="section-body">
          <div className="product">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 id="proof-h" className="h2">
                Second Opinion reviews your landing page in about <em>30 seconds</em>
              </h2>
              <p className="muted">
                Paste a link or your copy. You get a score, the points a first-time visitor won’t
                understand, what’s working, and fixes you can hand to an AI tool or download as a plan. I
                designed, built and run it, the same way I’d build yours.
              </p>
              <div className="btns">
                <Link href={reviewHref} className="btn-primary">
                  Review my page, free <Arrow />
                </Link>
                <Link href="/writing/from-ai-prompt-to-trusted-product" className="more">
                  How I built it
                </Link>
              </div>
            </div>
            <ul className="ticks">
              {reviewTicks.map((t) => (
                <li key={t}>
                  <Tick />
                  <span>{t}</span>
                </li>
              ))}
              <li className="muted" style={{ fontSize: 14, display: 'block', borderTop: '1px solid var(--rule)', paddingTop: 12 }}>
                Free · two reviews a day
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="tile section" aria-labelledby="faq-h">
        <p className="label">Straight answers</p>
        <div className="section-body">
          <h2 id="faq-h" className="h2">
            What founders usually ask <em>first</em>
          </h2>
          <Faq items={FAQS.slice(0, 5)} />
          <div className="aside">
            <span className="hand">when I’m not the right fit</span>
            <p>
              I build for the team and users you have today. If you need a system designed for very large
              scale from the start, I’ll say so on the first call and tell you what kind of team to look
              for instead.
            </p>
          </div>
        </div>
      </section>

      <section className="tile section" aria-labelledby="writing-h">
        <p className="label">Writing</p>
        <div className="section-body">
          <h2 id="writing-h" className="h2">
            Notes for founders about to <em>start</em>
          </h2>
          <div className="posts">
            {posts.map((post) => (
              <Link key={post.slug} href={`/writing/${post.slug}`} className="post">
                <span className="muted num" style={{ fontSize: 14 }}>
                  {shortDate(post.date)}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="post-t">{post.title}</span>
                  <span className="muted" style={{ fontSize: 16 }}>
                    {post.excerpt}
                  </span>
                </span>
                <span className="muted" style={{ fontSize: 14 }}>
                  {post.readingTime.replace(' read', '')}
                </span>
              </Link>
            ))}
          </div>
          <Link href="/writing" className="more">
            All writing <Arrow />
          </Link>
        </div>
      </section>

      <ContactBand
        title={
          <>
            Got a <em>napkin?</em>
          </>
        }
      />
    </TileStack>
  )
}
