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
