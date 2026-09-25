export type NineStep = {
  n: number
  verb: string
  title: string
  body: string
}

/** How a project runs, start to finish. Shown on /start. */
export const NINE: NineStep[] = [
  {
    n: 1,
    verb: 'Call',
    title: 'We talk through the idea',
    body: "You tell me what you want to build, who it's for and what you already have, whether that's a paragraph, a deck or a full spec. You don't pay for this call, and it doesn't commit you to anything.",
  },
  {
    n: 2,
    verb: 'Scope',
    title: 'I write down what the project includes',
    body: "You get a short document that lists what the product will do at launch, what can come later, and anything I'll need from you. We adjust it together until it matches what you had in mind.",
  },
  {
    n: 3,
    verb: 'Quote',
    title: 'You get a fixed price',
    body: 'The price covers everything in the scope. Nothing starts, and nothing is billed, until you accept it.',
  },
  {
    n: 4,
    verb: 'Kickoff',
    title: 'Paid work begins',
    body: 'I set up the project and everything it needs, and we agree how you would like to follow progress during the build.',
  },
  {
    n: 5,
    verb: 'Build',
    title: 'I design and build the product',
    body: 'I take it from designs through to working software. Most projects take a few weeks, and you can try the product while it is being built.',
  },
  {
    n: 6,
    verb: 'Review',
    title: 'You use it the way your users will',
    body: 'You work through the real product and note anything that feels wrong, slow or unclear. Every new product has a few of these, and this is the point to catch them.',
  },
  {
    n: 7,
    verb: 'Feedback',
    title: 'I make the changes',
    body: "Changes within the agreed scope are included in the price. If something falls outside it, I'll tell you what it would take before doing any of the work.",
  },
  {
    n: 8,
    verb: 'Handoff',
    title: 'The product goes live',
    body: "I launch it and hand over the product, the code and notes that let you, or any developer, keep it running. If you'd rather I host it for you, I can.",
  },
  {
    n: 9,
    verb: 'Continue',
    title: 'You decide what comes next',
    body: 'You can run it yourself, ask me for fixes and improvements, or plan the next version together. Any new work is quoted separately.',
  },
]

export const CAREER = [
  { year: '2014', role: 'Software engineer', place: 'Tech Mahindra' },
  { year: '2018', role: 'Data scientist', place: 'Novartis' },
  { year: '2020', role: 'Product manager, healthcare AI', place: 'Novartis' },
  { year: '2024', role: 'Lead product manager, supply chain AI', place: 'Resilinc' },
  { year: '2025', role: 'Founding product manager, multi-agent systems', place: 'Early-stage companies' },
  { year: '2026', role: 'Founder', place: 'Studio NPV' },
]
