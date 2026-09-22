export type NineStep = {
  n: number
  verb: string
  title: string
  body: string
  arrow?: boolean
}

/** How an engagement at Nava typically moves. Quiet list — used on /start. */
export const NINE: NineStep[] = [
  {
    n: 1,
    verb: 'Call',
    title: 'We talk through the idea',
    body: 'The call is unpaid. Bring what you have — a note, a deck, a spec, or just the idea. I ask enough to know what a first version would be.',
  },
  {
    n: 2,
    verb: 'Scope',
    title: 'We agree what v1 includes',
    body: 'What ships now, and what waits. You can arrive with a full brief or with almost nothing. The point is a list we both understand.',
  },
  {
    n: 3,
    verb: 'Quote',
    title: 'You see a number before I write code',
    body: 'A fixed fee for that scope. Paid work does not start until you accept it.',
  },
  {
    n: 4,
    verb: 'Kickoff',
    title: 'The build begins',
    body: 'Accounts, access, and the first slice of the product. This is where the engagement is live.',
  },
  {
    n: 5,
    verb: 'Build',
    title: 'A first version you can use',
    body: 'Typically a few weeks. Something in the browser (or on a phone), not a deck of screens.',
  },
  {
    n: 6,
    verb: 'Review',
    title: 'You use it',
    body: 'You click through the real thing and tell me what is off. That is expected. First versions are not finished arguments.',
  },
  {
    n: 7,
    verb: 'Feedback',
    title: 'We change what is in scope',
    body: 'Your notes go back into the product. If something is outside the quote, we name it and price it separately.',
  },
  {
    n: 8,
    verb: 'Handoff',
    title: 'It is yours to run',
    body: 'By default the repo and hosting sit on your accounts. I can keep hosting it if you prefer. Either way, you get enough notes to keep going.',
  },
  {
    n: 9,
    verb: 'Continue',
    title: 'Keep this running, or build the next thing',
    body: 'Maintenance, a new feature, or a second product — if you want it. Each piece is quoted. Nothing is assumed.',
    arrow: true,
  },
]

export const CAREER = [
  { year: '2014', role: 'Software engineer', place: 'Tech Mahindra' },
  { year: '2018', role: 'Data scientist', place: 'Novartis' },
  { year: '2020', role: 'Healthcare AI PM', place: 'Novartis' },
  { year: '2024', role: 'Lead PM, supply chain AI', place: 'Resilinc · 500K+ users' },
  { year: '2025', role: 'Founding PM, multi-agent systems', place: 'Early-stage' },
  { year: '2026', role: 'Founder, Nava Studios', place: 'First products, one engagement at a time' },
]
