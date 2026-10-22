export type Step = {
  n: number
  verb: string
  title: string
  body: string
}

/** How a project runs, start to finish. Shown on /start. */
export const STEPS: Step[] = [
  {
    n: 1,
    verb: 'Call',
    title: 'We talk through the idea',
    body: "You tell me what you want to build, who it's for and what you already have, whether that's a paragraph, a deck or a full spec. You don't pay for this call, and it doesn't commit you to anything.",
  },
  {
    n: 2,
    verb: 'Scope',
    title: 'You get a written scope and a fixed price',
    body: "I send a short document that lists what the product will do at launch, what can come later and anything I'll need from you, with one fixed price for all of it. We adjust it together, and nothing starts or is billed until you accept.",
  },
  {
    n: 3,
    verb: 'Build',
    title: 'I design and build the product',
    body: "Once you accept, I set up the project and take it from designs through to working software. Most projects take a few weeks, and you can try the product while it's being built.",
  },
  {
    n: 4,
    verb: 'Review',
    title: 'You try it, and I refine it',
    body: "You use the real product the way your users will and note anything that feels wrong or unclear. Changes within the scope are included in the price. If something falls outside it, I'll tell you what it would take before doing any of the work.",
  },
  {
    n: 5,
    verb: 'Launch',
    title: 'It goes live, and it is yours',
    body: 'I launch it and hand over the product, the code and notes that let you, or any developer, keep it running. After that you can run it yourself, have me host it, or ask for improvements and new features, which are quoted separately.',
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

/** Shown on /start; the home page shows the first five. */
export const FAQS = [
  {
    q: 'How much does it cost?',
    a: 'Each project has a fixed price based on its scope, so there are no hourly bills. I send it after our first call, once we have agreed what to build, and nothing is billed until you accept it.',
  },
  {
    q: 'How long does a project take?',
    a: 'Most take a few weeks. The exact time depends on what the project includes, and you will have it in writing along with the quote.',
  },
  {
    q: 'What if my idea is still rough?',
    a: 'That is a normal place to start. Part of the first call is working out what the product should do at launch, and most ideas get clearer in that conversation. Sometimes we find it is too early to build, which is worth knowing before anyone spends money.',
  },
  {
    q: 'Do I need a technical co-founder or developer?',
    a: 'No. I handle the design, the code and the setup, and I explain the decisions in plain language so you can make the calls that matter to your business.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do. When the work is done, the product, code and data are handed over to you, and you can take them to any developer.',
  },
  {
    q: 'What happens after launch?',
    a: 'That is up to you. Some founders run the product themselves, and others ask me for fixes, improvements or the next version. New work is quoted separately, and I can host the product for you if you prefer.',
  },
]

/** What you have in hand at the end of each step, shown on /start. */
export const STEP_GETS = [
  'a clear next step, at no cost',
  'a written scope and one fixed price',
  'a preview you can use during the build',
  'in-scope changes at no extra cost',
  'the product, the code and the notes',
]
