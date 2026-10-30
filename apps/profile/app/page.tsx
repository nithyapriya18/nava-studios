import Image from 'next/image'
import { SectionNav } from '@/components/section-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrackedLink } from '@/components/tracked-link'
import { siteConfig, mailtoHref, studio } from '@/config'
import { CERTIFICATION, EDUCATION, LANGUAGES, POSTS, ROLES, SKILLS, STATS, STUDIO } from '@/lib/profile'

function Arrow() {
  return (
    <span className="arr" aria-hidden>
      →
    </span>
  )
}

function Resume({ location, className }: { location: string; className: string }) {
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
      Resume (PDF)
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

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={`${id}-h`} className="sec-h">
      {children}
    </h2>
  )
}

export default function Home() {
  return (
    <div className="shell">
      <aside className="side">
        <div className="side-top">
          <div className="portrait">
            <Image src="/nithya.jpeg" alt={`Portrait of ${siteConfig.name}`} fill sizes="112px" preload />
          </div>
          <ThemeToggle />
        </div>
        <h1 className="name">{siteConfig.name}</h1>
        <p className="tagline">{siteConfig.summary}</p>
        <p className="where">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          {siteConfig.location}
        </p>
        <div className="actions">
          <Resume location="sidebar" className="btn btn-primary" />
          <LinkedIn location="sidebar" className="btn" />
          <TrackedLink href={mailtoHref} event="email_clicked" properties={{ location: 'sidebar' }} className="btn">
            Email
          </TrackedLink>
        </div>
        <SectionNav />
      </aside>

      <main id="content" className="main">
        <section id="about" aria-labelledby="about-h" className="sec">
          <Heading id="about">About</Heading>
          <div className="prose">
            <p className="lead">
              I’ve spent ten years building software: first as an engineer, then as a data scientist, and for
              the last six years as a product manager on AI products in healthcare, supply chain and retail.
            </p>
            <p>
              I’ve worked inside global enterprises such as Novartis and Resilinc, and as the founding product
              manager at early-stage startups. I’m at home in regulated environments with zero tolerance for
              error, and in small teams going from an idea to a first release. I also run{' '}
              <a href={studio()}>Studio NPV</a>, my own studio, where I design and build products end to end.
            </p>
          </div>
          <dl className="stats">
            {STATS.map((s) => (
              <div key={s.n} className="stat">
                <dt>{s.n}</dt>
                <dd>{s.t}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="experience" aria-labelledby="experience-h" className="sec">
          <Heading id="experience">Experience</Heading>

          <article className="venture">
            <div className="role-head">
              <div>
                <span className="kicker">My own company</span>
                <h3 className="role-t">
                  {STUDIO.title}, <a href={studio()}>{STUDIO.org}</a>
                </h3>
              </div>
              <span className="dates">{STUDIO.dates}</span>
            </div>
            <p className="muted">{STUDIO.body}</p>
            <div className="products">
              {STUDIO.products.map((p) => (
                <a key={p.name} href={p.href} className="product">
                  <span className="product-t">
                    {p.name} <Arrow />
                  </span>
                  <span className="muted">{p.body}</span>
                </a>
              ))}
            </div>
            <TrackedLink
              href={studio()}
              event="studio_opened"
              properties={{ location: 'experience' }}
              className="more"
            >
              Visit studionpv.com <Arrow />
            </TrackedLink>
          </article>

          <ol className="roles">
            {ROLES.map((r) => (
              <li key={`${r.org}-${r.title}`} className="role">
                <div className="role-head">
                  <div>
                    <h3 className="role-t">{r.title}</h3>
                    <span className="org">{r.org}</span>
                  </div>
                  <span className="dates">{r.dates}</span>
                </div>
                <ul className="points">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section id="skills" aria-labelledby="skills-h" className="sec">
          <Heading id="skills">Skills</Heading>
          <div className="skills">
            {SKILLS.map((g) => (
              <div key={g.group} className="skill-group">
                <h3 className="kicker">{g.group}</h3>
                <ul className="chips">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="education" aria-labelledby="education-h" className="sec">
          <Heading id="education">Education</Heading>
          <ul className="roles">
            {EDUCATION.map((e) => (
              <li key={e.title} className="role">
                <div className="role-head">
                  <div>
                    <h3 className="role-t">{e.title}</h3>
                    <span className="org">{e.org}</span>
                  </div>
                  <span className="dates">{e.dates}</span>
                </div>
              </li>
            ))}
          </ul>
          <dl className="facts">
            <div>
              <dt className="kicker">Certification</dt>
              <dd>{CERTIFICATION}</dd>
            </div>
            <div>
              <dt className="kicker">Languages</dt>
              <dd>{LANGUAGES}</dd>
            </div>
          </dl>
        </section>

        <section id="writing" aria-labelledby="writing-h" className="sec">
          <Heading id="writing">Writing</Heading>
          <ul className="posts">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <a href={studio(`/writing/${p.slug}`)}>
                  <span>{p.title}</span>
                  <span className="dates">{p.date}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={studio('/writing')} className="more">
            All writing <Arrow />
          </a>
        </section>

        <section id="contact" aria-labelledby="contact-h" className="sec contact">
          <Heading id="contact">Contact</Heading>
          <p className="lead">Open to conversations about roles, collaborations and talks.</p>
          <p className="muted">
            Email or LinkedIn reaches me fastest. If you have something you want built, start at{' '}
            <a href={studio('/contact')}>Studio NPV</a>.
          </p>
          <div className="actions">
            <TrackedLink href={mailtoHref} event="email_clicked" properties={{ location: 'contact' }} className="btn btn-primary">
              {siteConfig.email}
            </TrackedLink>
            <LinkedIn location="contact" className="btn" />
            <Resume location="contact" className="btn" />
          </div>
        </section>

        <footer className="foot">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <a href={studio()}>Studio NPV</a>
        </footer>
      </main>
    </div>
  )
}
