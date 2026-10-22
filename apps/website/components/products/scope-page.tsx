import Link from 'next/link'
import { ScopeCutter } from '@/components/products/scope-cutter'
import { Arrow } from '@/components/pen'

const methods = [
  {
    name: 'The Kano model',
    by: 'Noriaki Kano, 1984',
    body: 'Two questions per feature, how users would feel with it and without it, read through the standard Kano table. It separates what users expect from what delights them and what they wouldn’t notice.',
  },
  {
    name: 'Story mapping',
    by: 'Jeff Patton',
    body: 'Features hang off the steps of your user’s journey. Your first release has to be a walking skeleton: thin, but complete from the first step to the last.',
  },
  {
    name: 'Appetite',
    by: 'Basecamp, Shape Up',
    body: 'You decide how many weeks a first version is worth. Time stays fixed and scope gives way, so the tool suggests what to cut when the build runs over.',
  },
  {
    name: 'Riskiest assumption first',
    by: 'Lean Startup practice',
    body: 'Whatever tests the belief your idea depends on goes in first, because learning early is worth more than polish.',
  },
  {
    name: 'Do it by hand',
    by: 'Concierge and Wizard of Oz MVPs',
    body: 'What you can do yourself for your first customers launches by hand, the way Zappos bought each pair of shoes after the order. You build it once it’s proven.',
  },
  {
    name: 'Value for effort',
    by: 'Adapted from RICE',
    body: 'What’s left is ordered by value over effort into a queue for your next release, so you know what to build second.',
  },
]

export function ScopePage() {
  return (
    <>
      <section className="band page-head">
        <p className="label">Free tool · built and run by Studio NPV</p>
        <h1 className="display">
          Scope <em>Cutter</em>
        </h1>
        <p className="lede" style={{ maxWidth: '54ch' }}>
          Cut your feature list down to a first version you can actually ship. About ten minutes, using the
          methods product managers use, and nothing leaves your browser.
        </p>
      </section>

      <section className="sc-tool-wrap">
        <ScopeCutter />
      </section>

      <section className="section" aria-labelledby="how-h">
        <p className="label">How it decides</p>
        <div className="section-body">
          <h2 id="how-h" className="h2">
            Six methods, not a <em>coin flip</em>
          </h2>
          <div className="grid2">
            {methods.map((m) => (
              <div key={m.name} className="cell sc-method">
                <h3 className="h3">{m.name}</h3>
                <p className="label" style={{ letterSpacing: '0.06em' }}>
                  {m.by}
                </p>
                <p className="muted">{m.body}</p>
              </div>
            ))}
          </div>
          <p className="muted measure">
            Kano is designed for asking users. Here you answer for them, so the result is only as good as
            your picture of them. It works best after talking to five or so. Effort is your own estimate.
          </p>
          <Link href="/writing/what-belongs-in-a-first-version" className="more">
            Read: what belongs in a first version <Arrow />
          </Link>
        </div>
      </section>
    </>
  )
}
