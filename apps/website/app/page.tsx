import Image from 'next/image'
import Link from 'next/link'
import { TileStack } from '@/components/tile-stack'
import { siteConfig, contactHref, contactIsExternal } from '@/config'
import { FAQS } from '@/lib/process'
import { getAllPosts } from '@/lib/mdx'
import { reviewHref } from '@/lib/products'
import { HeroDemo } from '@/components/hero-demo'
import { Generate } from '@/components/generate'
import { HoverGroup } from '@/components/hover-group'
import { Faq } from '@/components/faq'
import { ContactBand } from '@/components/contact-band'
import { Arrow, Note, PenCircle, PenUnderline, Tick } from '@/components/pen'

const stats = [
  { n: '10 yrs', t: 'in software and product, starting as an engineer in 2014' },
  { n: '$6.4M', t: 'documented cost impact, NLP redaction platform at Novartis' },
  { n: '500K+', t: 'enterprise users on the supply chain AI I led at Resilinc' },
  { n: 'PSPO I', t: 'Professional Scrum Product Owner, Scrum.org' },
]

const leadTicks = [
  'The core features your first users come for, and nothing they don’t need yet',
  'The admin screens you need to run it day to day',
  'Live, with the code and notes handed over to you',
]

const also = [
  { title: 'Apps for your customers', body: 'Portals, booking and ordering flows.' },
  { title: 'Internal tools', body: 'Replace the spreadsheets and copy-paste your team runs by hand.' },
  { title: 'Websites that convert', body: 'A clear site that turns visitors into enquiries.' },
]

// Facts from "Turning an AI prompt into a product people can trust".
const caseStudy = [
  {
    label: 'The problem',
    body: 'Founders can’t tell why their landing page isn’t working, and asking a chatbot gives a different essay every time.',
  },
  {
    label: 'What I built',
    body: 'A review with the same structure every time: a score, six areas, each problem quoted from the page with a fix. It reads the words and screenshots the design.',
  },
  {
    label: 'How it runs',
    body: 'Two free reviews a day, about a cent each to run, with a site-wide limit. Pages that can’t be read don’t use up a review, and submissions stay private.',
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

// Posts for someone about to start a project come first.
const FEATURED = ['what-i-need-from-the-first-call', 'what-belongs-in-a-first-version', 'from-ai-prompt-to-trusted-product']

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
            <Generate>
              From a <PenCircle draw>napkin</PenCircle> sketch to software <em>people use</em>.
            </Generate>
          </h1>
          <p className="lede">
            I design and build first versions of new products for founders: web apps and SaaS that real
            users can sign up for. I scope it with you, I build it, and the price is fixed before any work
            starts.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
            <a href={contactHref} className="btn-primary btn-lg" {...ctaProps}>
              Tell me about your idea <Arrow />
            </a>
            <Link href="/start" className="quiet-link">
              or see how a project runs
            </Link>
          </div>
        </div>
        <HeroDemo />
      </section>

      <section className="tile section" aria-labelledby="build-h">
        <p className="label">What I build</p>
        <div className="section-body">
          <h2 id="build-h" className="h2">
            First versions of new products, built to be <em>used</em>
          </h2>
          <div className="lead-offer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 className="h3" style={{ fontSize: 22 }}>
                New products for founders
              </h3>
              <p className="muted">
                You have an idea and the people it’s for. I turn it into a web app or SaaS product they can
                sign up for and use, usually within a few weeks.
              </p>
            </div>
            <ul className="ticks" style={{ padding: 0, background: 'none' }}>
              {leadTicks.map((t) => (
                <li key={t}>
                  <Tick />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="label">The same approach also works for</span>
            <HoverGroup items=".also li">
              <ul className="also">
                {also.map((a) => (
                  <li key={a.title}>
                    <span className="h3">{a.title}</span>
                    <span className="muted">{a.body}</span>
                  </li>
                ))}
              </ul>
            </HoverGroup>
          </div>
        </div>
      </section>

      <section className="tile section band-warm" aria-labelledby="case-h">
        <p className="label">Case study</p>
        <div className="section-body">
          <h2 id="case-h" className="h2">
            Crit: from a napkin to a live <em>product</em>
          </h2>
          <p className="measure muted">
            A free tool that reviews a landing page in about 30 seconds. I scoped, designed, built and run
            it the same way I’d build yours.
          </p>
          <div className="case">
            {caseStudy.map((c) => (
              <div key={c.label} className="case-col">
                <span className="label">{c.label}</span>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <Note>the easy part was getting it right once</Note>
          <div className="btns">
            <Link href={reviewHref} className="btn-primary">
              Try it on your page, free <Arrow />
            </Link>
            <Link href="/writing/from-ai-prompt-to-trusted-product" className="more">
              Read how I built it <Arrow />
            </Link>
          </div>
        </div>
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
          <HoverGroup items="a.post" bleed={16}>
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
          </HoverGroup>
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
