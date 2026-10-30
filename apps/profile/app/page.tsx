import Image from 'next/image'
import { Spotlight } from '@/components/effects'
import { Experience } from '@/components/experience'
import { FlipWords } from '@/components/flip-words'
import { Header } from '@/components/header'
import { ScrollFx } from '@/components/scroll-fx'
import { ScrollWords } from '@/components/scroll-words'
import { TrackedLink } from '@/components/tracked-link'
import { siteConfig, mailtoHref, studio } from '@/config'
import { CERTIFICATION, EDUCATION, LANGUAGES, POSTS, SKILLS, STATS } from '@/lib/profile'

function Arrow() {
  return (
    <span className="arr" aria-hidden>
      →
    </span>
  )
}

function Resume({ location, className, label = 'Resume (PDF)' }: { location: string; className: string; label?: string }) {
  return (
    <TrackedLink
      href={siteConfig.resumeFile}
      download
      event="resume_downloaded"
      properties={{ location }}
      className={className}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2.5v8m0 0L5 7.5m3 3l3-3M3 13.5h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </TrackedLink>
  )
}

function LinkedIn({ location, className }: { location: string; className: string }) {
  return (
    <TrackedLink
      href={siteConfig.linkedin}
      event="linkedin_opened"
      properties={{ location }}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      LinkedIn
    </TrackedLink>
  )
}

function SectionHead({ id, n, label, children }: { id: string; n: string; label: string; children: React.ReactNode }) {
  return (
    <div className="sec-head rv">
      <span className="eyebrow">
        <b>{n}</b> {label}
      </span>
      <h2 id={`${id}-h`} className="sec-t">
        {children}
      </h2>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <ScrollFx />

      <main id="content">
        <section id="top" className="hero" aria-label="Introduction">
          <div className="hero-in">
            <div className="hero-text">
              <span className="now">
                <span className="now-dot" aria-hidden />
                Head of Product at PetaSight · Founder of Studio NPV
              </span>
              <h1 className="hero-name">
                Nithyapriya <em>Veeraraghavan</em>
              </h1>
              <p className="hero-flip">
                <FlipWords
                  prefix="Ten years as a"
                  words={['software engineer', 'data scientist', 'product manager', 'founder']}
                  sentence={siteConfig.summary}
                />
              </p>
              <div className="actions">
                <Resume location="hero" className="btn btn-primary" />
                <LinkedIn location="hero" className="btn" />
                <TrackedLink href={mailtoHref} event="email_clicked" properties={{ location: 'hero' }} className="btn">
                  Email
                </TrackedLink>
              </div>
            </div>
            <figure className="hero-photo">
              <Image
                src="/nithya.jpeg"
                alt={`Portrait of ${siteConfig.name}`}
                fill
                sizes="(min-width: 1000px) 420px, 80vw"
                preload
              />
              <figcaption>{siteConfig.location}</figcaption>
            </figure>
          </div>
          <a href="#about" className="cue">
            <span>Scroll</span>
            <i aria-hidden />
          </a>
        </section>

        <section id="about" className="sec" aria-labelledby="about-h">
          <div className="wrap">
            <SectionHead id="about" n="01" label="About">
              Engineer, data scientist, <em>product manager</em>.
            </SectionHead>
            <ScrollWords
              className="reveal-text"
              text="I’ve spent ten years building software: first as an engineer, then as a data scientist, and for the last six years as a product manager on AI products in healthcare, supply chain and retail."
            />
            <p className="about-more rv">
              I’ve worked inside global enterprises such as Novartis and Resilinc, and as the founding product
              manager at early-stage startups. I’m at home in regulated environments with zero tolerance for
              error, and in small teams going from an idea to a first release. I also run{' '}
              <a href={studio()}>Studio NPV</a>, my own studio, where I design and build products end to end.
            </p>
            <Spotlight as="dl" className="stats">
              {STATS.map((s, i) => (
                <div key={s.t} className="stat spot rv" style={{ transitionDelay: `${i * 80}ms` }}>
                  <dt
                    data-count={s.value}
                    data-prefix={s.prefix}
                    data-suffix={s.suffix}
                    data-decimals={s.decimals}
                  >
                    {`${s.prefix}${s.value.toFixed(s.decimals)}${s.suffix}`}
                  </dt>
                  <dd>{s.t}</dd>
                </div>
              ))}
            </Spotlight>
          </div>
        </section>

        <section id="experience" className="sec" aria-labelledby="experience-h">
          <div className="wrap">
            <SectionHead id="experience" n="02" label="Experience">
              Where I’ve <em>worked</em>
            </SectionHead>
            <Experience />
          </div>
        </section>

        <section id="skills" className="sec alt" aria-labelledby="skills-h">
          <div className="wrap">
            <SectionHead id="skills" n="03" label="Skills and education">
              What I <em>bring</em>
            </SectionHead>
            <Spotlight className="skills">
              {SKILLS.map((g, i) => (
                <div key={g.group} className="card skill spot rv" style={{ transitionDelay: `${i * 80}ms` }}>
                  <h3 className="eyebrow">{g.group}</h3>
                  <ul className="chips">
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Spotlight>
            <div className="edu rv">
              {EDUCATION.map((e) => (
                <div key={e.title} className="edu-row">
                  <div>
                    <h3 className="card-t">{e.title}</h3>
                    <span className="muted">{e.org}</span>
                  </div>
                  <span className="dates">{e.dates}</span>
                </div>
              ))}
              <dl className="facts">
                <div>
                  <dt className="eyebrow">Certification</dt>
                  <dd>{CERTIFICATION}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Languages</dt>
                  <dd>{LANGUAGES}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="writing" className="sec" aria-labelledby="writing-h">
          <div className="wrap">
            <SectionHead id="writing" n="04" label="Writing">
              Notes on product and <em>craft</em>
            </SectionHead>
            <ul className="posts">
              {POSTS.map((p, i) => (
                <li key={p.slug} className="rv" style={{ transitionDelay: `${i * 80}ms` }}>
                  <a href={studio(`/writing/${p.slug}`)}>
                    <span className="post-t">{p.title}</span>
                    <span className="dates">{p.date}</span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
            <a href={studio('/writing')} className="more rv">
              All writing <Arrow />
            </a>
          </div>
        </section>

        <section id="contact" className="sec contact" aria-labelledby="contact-h">
          <div className="wrap">
            <SectionHead id="contact" n="05" label="Contact">
              Let’s <em>talk</em>.
            </SectionHead>
            <p className="contact-lede rv">
              Open to conversations about roles, collaborations and talks. If you have something you want
              built, start at <a href={studio('/contact')}>Studio NPV</a>.
            </p>
            <TrackedLink
              href={mailtoHref}
              event="email_clicked"
              properties={{ location: 'contact' }}
              className="big-mail rv"
            >
              {siteConfig.email} <Arrow />
            </TrackedLink>
            <div className="actions rv">
              <LinkedIn location="contact" className="btn" />
              <Resume location="contact" className="btn" />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <a href={studio()}>Studio NPV</a>
        </div>
      </footer>
    </>
  )
}
