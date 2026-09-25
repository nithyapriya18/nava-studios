export type NineStep = {
  n: number
  verb: string
  title: string
  body: string
}

/** How a project with Nava moves, start to finish. Shown on /start only. */
export const NINE: NineStep[] = [
  {
    n: 1,
    verb: 'Call',
    title: 'We talk through the idea',
    body: 'Bring whatever you have, from a single paragraph to a full spec. I ask enough to understand what a first version would be. This call is unpaid.',
  },
  {
    n: 2,
    verb: 'Scope',
    title: 'We agree what version one includes',
    body: 'What ships now and what waits for later, written as a list we both understand.',
  },
  {
    n: 3,
    verb: 'Quote',
    title: 'You see a number before any code',
    body: 'A fixed fee for that scope. Nothing starts until you accept it.',
  },
  {
    n: 4,
    verb: 'Kickoff',
    title: 'Paid work begins',
    body: 'We set up accounts and access, and I start on the first slice of the product.',
  },
  {
    n: 5,
    verb: 'Build',
    title: 'A first version you can use',
    body: 'Usually a few weeks. At the end there is something running in a browser or on a phone.',
  },
  {
    n: 6,
    verb: 'Review',
    title: 'You try the real thing',
    body: 'You click through it and tell me what feels off. First versions always have some of that.',
  },
  {
    n: 7,
    verb: 'Feedback',
    title: 'I fold your notes back in',
    body: 'Changes inside the scope are part of the job. If something falls outside the quote, I name it and price it separately.',
  },
  {
    n: 8,
    verb: 'Handoff',
    title: 'It moves to your accounts',
    body: 'The repository and hosting go to you, with enough notes to keep going. If you would rather I keep hosting it, I can.',
  },
  {
    n: 9,
    verb: 'Continue',
    title: 'Keep it running, or build the next thing',
    body: 'Maintenance, a new feature, or a second product, if you want any of them. Each gets its own quote.',
  },
]

export const CAREER = [
  { year: '2014', role: 'Software engineer', place: 'Tech Mahindra' },
  { year: '2018', role: 'Data scientist', place: 'Novartis' },
  { year: '2020', role: 'Product manager, healthcare AI', place: 'Novartis' },
  { year: '2024', role: 'Lead product manager, supply chain AI', place: 'Resilinc' },
  { year: '2025', role: 'Founding product manager, multi-agent systems', place: 'Early-stage companies' },
  { year: '2026', role: 'Founder', place: 'Nava Studios' },
]
