export type ProductStatus = 'live' | 'beta' | 'building' | 'planned'

export type ProductFamily =
  | 'get-paid'
  | 'know-your-numbers'
  | 'win-customers'
  | 'run-the-day'
  | 'verity-home'

export interface Product {
  slug: string
  name: string
  family: ProductFamily
  /** One-liner: does the one job for who, without the thing they hate. */
  tagline: string
  /** The pain, in the buyer's words. Shown as a quote on the product page. */
  pain: string
  description: string
  features: string[]
  /** Flat, visible price. Free tiers spelled out. */
  price: string
  status: ProductStatus
  /** Route of the working tool. Absent while planned. */
  href?: string
}

export const FAMILIES: Record<
  ProductFamily,
  { name: string; promise: string; order: number }
> = {
  'get-paid': { name: 'Get Paid', promise: 'Money in the door', order: 1 },
  'know-your-numbers': {
    name: 'Know Your Numbers',
    promise: 'See where money leaks',
    order: 2,
  },
  'win-customers': {
    name: 'Win Customers',
    promise: 'Turn interest into revenue',
    order: 3,
  },
  'run-the-day': {
    name: 'Run the Day',
    promise: 'Stop drowning in busywork',
    order: 4,
  },
  'verity-home': {
    name: 'Verity Home',
    promise: 'Made for my own family',
    order: 5,
  },
}

export const PRODUCTS: Product[] = [
  // ─── Get Paid ────────────────────────────────────────────────
  {
    slug: 'gst-calculator',
    name: 'GST Calculator',
    family: 'get-paid',
    tagline:
      'Forward and reverse GST with itemized bills — no spreadsheet gymnastics.',
    pain: 'I switch between spreadsheets and a phone calculator just to split CGST/SGST on a quote.',
    description:
      'Instant forward and reverse GST breakdowns for Indian businesses, with an itemized bill builder and shareable results.',
    features: [
      'Forward & reverse GST at every slab',
      'CGST/SGST vs IGST split',
      'Itemized bill totals',
      'Shareable calculation links',
    ],
    price: 'Free',
    status: 'live',
    href: '/gst-calculator',
  },
  {
    slug: 'one-page-invoice',
    name: 'One-Page Invoice',
    family: 'get-paid',
    tagline:
      'A professional, GST-ready invoice in 60 seconds — no subscription, no signup for your first one.',
    pain: "I'm not paying a monthly fee to send three invoices a month, so I fight with a Docs template instead.",
    description:
      'Fill one form, get a clean invoice as a PDF or link — GST and non-GST modes, your branding, a payment link on the bill. The first one needs no account at all.',
    features: [
      'GST & non-GST invoice formats',
      'PDF download & shareable link',
      'UPI payment link on the invoice',
      'Saved clients & items once you sign in',
    ],
    price: 'Free to start · ₹199/mo to save & track',
    status: 'beta',
    href: '/tools/one-page-invoice',
  },
  {
    slug: 'gst-whatsapp-biller',
    name: 'GST WhatsApp Biller',
    family: 'get-paid',
    tagline:
      'Send GST invoices with a UPI pay link straight into WhatsApp — where your customers actually are.',
    pain: 'My customers live on WhatsApp. Why does my billing software pretend email is how India pays?',
    description:
      'Create a compliant invoice, tap once, and it lands in your customer’s WhatsApp with a UPI link to pay you instantly. Track who has paid and nudge who hasn’t.',
    features: [
      'GST-compliant invoices',
      'One-tap WhatsApp delivery with UPI pay link',
      'Paid / unpaid tracking',
      'Scheduled payment reminders',
    ],
    price: 'Free for 5 invoices/mo · ₹299/mo unlimited',
    status: 'beta',
    href: '/tools/gst-whatsapp-biller',
  },
  {
    slug: 'follow-up-fox',
    name: 'Follow-Up Fox',
    family: 'get-paid',
    tagline:
      'Chases your overdue invoices with polite, escalating reminders — so you never write that awkward email again.',
    pain: 'The work is done, the invoice is 40 days old, and I’m the one who feels awkward asking for my own money.',
    description:
      'Add an invoice and a due date. Fox sends polite reminders before and after it’s due, escalating gently until you mark it paid.',
    features: [
      'Escalating reminder sequences',
      'Tone presets: friendly → firm',
      'Works with invoices from any tool',
      'One dashboard of who owes you what',
    ],
    price: 'Free for 1 client · ₹199/mo unlimited',
    status: 'beta',
    href: '/tools/follow-up-fox',
  },
  {
    slug: 'trade-quote',
    name: 'Trade Quote',
    family: 'get-paid',
    tagline:
      'Phone-first quotes for the one-truck contractor — from price list to sent quote in two minutes.',
    pain: 'The big field-service suites want thousands a month. I quote from memory on paper and lose jobs for it.',
    description:
      'Keep your price list on your phone. Build a quote by tapping line items, send it as a link or PDF, and convert accepted quotes into invoices.',
    features: [
      'Saved price list, tap-to-quote',
      'Professional quote PDF/link',
      'Accept button for customers',
      'Quote → invoice in one tap',
    ],
    price: 'Free for 3 quotes/mo · ₹249/mo unlimited',
    status: 'building',
    href: '/tools/trade-quote',
  },
  {
    slug: 'proposal-forge',
    name: 'Proposal Forge',
    family: 'get-paid',
    tagline:
      'Answer six questions about the gig, get a client-ready proposal — hours of writing down to minutes.',
    pain: 'Proposal tools start at $30 a month. I write mine in Docs at midnight and they show it.',
    description:
      'Describe the project in six answers. Forge drafts a structured proposal — scope, timeline, price table — you polish it and send a link your client can accept.',
    features: [
      'AI-drafted from six answers',
      'Scope, timeline & price table structure',
      'Shareable accept-link',
      'Reusable templates per service',
    ],
    price: 'Free for 2 proposals/mo · ₹299/mo unlimited',
    status: 'building',
    href: '/tools/proposal-forge',
  },
  {
    slug: 'course-ship',
    name: 'Course Ship',
    family: 'get-paid',
    tagline:
      'Sell your course without a $199/month platform — upload lessons, set a price, done.',
    pain: 'I have one course and forty students. Kajabi wants $199 a month and charges extra for email.',
    description:
      'Host lessons (video links and text), take payments, and give students a clean login — at a price that makes sense for a creator with one course, not an empire.',
    features: [
      'Lesson hosting: video + text',
      'Checkout & student access',
      'Progress tracking',
      'No per-student pricing',
    ],
    price: '₹499/mo flat · no revenue share',
    status: 'planned',
  },
  {
    slug: 'member-gate',
    name: 'Member Gate',
    family: 'get-paid',
    tagline:
      'Put any content behind a paywall link — test a paid offering with zero platform commitment.',
    pain: 'I just want to see if anyone will pay. I don’t want to migrate my life onto a platform to find out.',
    description:
      'Wrap any link or content behind a simple paywall. Share one URL, get paid, see who joined. The lowest-friction way to test a paid community, newsletter, or resource.',
    features: [
      'Paywall any link or content',
      'One shareable URL',
      'Member list & access control',
      'Works alongside whatever you already use',
    ],
    price: 'Free + 5% per transaction',
    status: 'planned',
  },

  // ─── Know Your Numbers ───────────────────────────────────────
  {
    slug: 'margin-lens',
    name: 'Margin Lens',
    family: 'know-your-numbers',
    tagline:
      'Your true per-order profit after every fee — the number your dashboard hides.',
    pain: 'I did ₹4 lakh in sales last month. After Shopify fees, payment fees, apps, and shipping, I honestly don’t know if I made money.',
    description:
      'Import your orders, set your fee stack once, and see real margin per order and per product — including what your app subscriptions cost you as a share of profit.',
    features: [
      'CSV import, no integrations needed',
      'Fee stack: platform, payment, apps, shipping',
      'Per-order & per-SKU true margin',
      '“Your apps ate X% of profit” report',
    ],
    price: 'Free for 100 orders/mo · ₹299/mo unlimited',
    status: 'beta',
    href: '/tools/margin-lens',
  },
  {
    slug: 'etsy-ledger',
    name: 'Etsy Ledger',
    family: 'know-your-numbers',
    tagline:
      'Upload your Etsy CSV, get your real profit and a tax-ready summary — no more spreadsheet archaeology.',
    pain: 'Etsy’s fees come in six flavours and my “bookkeeping” is a spreadsheet I’m scared to open in tax season.',
    description:
      'Built around Etsy’s actual fee structure. Upload the monthly statement CSV and get categorized fees, true profit, and a clean year-end export.',
    features: [
      'Understands every Etsy fee type',
      'Monthly profit statements',
      'Tax-season export',
      'No integration, just your CSV',
    ],
    price: 'Free for 1 month back · ₹199/mo or ₹999/yr',
    status: 'building',
    href: '/tools/etsy-ledger',
  },
  {
    slug: 'rent-ledger',
    name: 'Rent Ledger',
    family: 'know-your-numbers',
    tagline:
      'Rent tracking for the 2–10 unit landlord — receipts, late flags, and a year-end report without the enterprise suite.',
    pain: 'Property management software has unit minimums and enterprise pricing. I have four flats and a spreadsheet.',
    description:
      'Track units, tenants, and rent due. Automatic receipts, late-payment flags, and a year-end income report — everything the small landlord needs and nothing else.',
    features: [
      'Units, tenants, rent schedules',
      'Automatic rent receipts',
      'Late payment flags & reminders',
      'Year-end income report',
    ],
    price: 'Free for 2 units · ₹199/mo up to 20',
    status: 'beta',
    href: '/tools/rent-ledger',
  },
  {
    slug: 'stock-sentinel',
    name: 'Stock Sentinel',
    family: 'know-your-numbers',
    tagline:
      'A plain email when a product runs low — without the ₹2,000/month forecasting suite attached.',
    pain: 'I just want an email when a SKU dips below ten units. Every app that does this bundles it into a suite.',
    description:
      'Set a threshold per product, get a daily digest of what’s running low. That’s the whole product, and that’s the point.',
    features: [
      'Per-SKU low-stock thresholds',
      'Daily email digest',
      'CSV import or manual list',
      'Nothing else — deliberately',
    ],
    price: 'Free for 25 SKUs · ₹149/mo unlimited',
    status: 'beta',
    href: '/tools/stock-sentinel',
  },
  {
    slug: 'ship-watch',
    name: 'Ship Watch',
    family: 'know-your-numbers',
    tagline:
      'Every shipment, every carrier, one board — hear about delays before your customer does.',
    pain: 'I check ten tabs across four carrier sites, and I still find out about a delay from an angry customer.',
    description:
      'Paste tracking numbers from any carrier into one board. See every shipment’s status at a glance and get alerted when something stalls.',
    features: [
      'All carriers, one board',
      'Delay & exception alerts',
      'Shareable tracking pages for customers',
      'Bulk paste, zero setup',
    ],
    price: 'Free for 20 shipments/mo · ₹249/mo unlimited',
    status: 'planned',
  },
  {
    slug: 'uptime-peek',
    name: 'Uptime Peek',
    family: 'know-your-numbers',
    tagline:
      'Uptime, response time, and a status page at an indie price — not an enterprise APM bill.',
    pain: 'I need to know if my app is down and roughly why. The tools that tell me start at $99 a month.',
    description:
      'Point it at your URLs. Get checks, response-time history, a public status page, and an alert when something breaks. Monitoring for people who run two apps, not two hundred.',
    features: [
      'Uptime & response-time checks',
      'Email/SMS alerts',
      'Public status page',
      'Watches all Verity products too — we dogfood it',
    ],
    price: 'Free for 3 monitors · ₹199/mo for 25',
    status: 'planned',
  },

  // ─── Win Customers ───────────────────────────────────────────
  {
    slug: 'nudge-book',
    name: 'Nudge Book',
    family: 'win-customers',
    tagline:
      'A booking page plus reminders that cut no-shows — ten-minute setup, not a second job.',
    pain: 'A third of my appointments no-show. The booking suites that fix it need a training course to set up.',
    description:
      'One booking page, automatic SMS and email reminders, and a daily schedule view. Reminders routinely cut no-shows from 15–30% to around 5% — that’s the whole business case.',
    features: [
      'Clean booking page',
      'Automatic SMS + email reminders',
      'Daily schedule view',
      'Ten-minute setup, honestly',
    ],
    price: 'Free for 20 bookings/mo · ₹299/mo unlimited',
    status: 'building',
    href: '/tools/nudge-book',
  },
  {
    slug: 'quote-card',
    name: 'Quote Card',
    family: 'win-customers',
    tagline:
      'An instant-quote widget for your website — catch the leads who’ll never “call for a quote”.',
    pain: 'People land on my site, see “call for pricing”, and leave. I’ll never hear from them again.',
    description:
      'Build your pricing formula once (rooms × rate + extras), embed the widget, and let visitors quote themselves. Every quote becomes a lead in your inbox.',
    features: [
      'Formula builder, no code',
      'Embeddable widget',
      'Every quote emailed to you as a lead',
      'Works for cleaning, tutoring, repairs, anything priced by formula',
    ],
    price: 'Free with badge · ₹199/mo white-label',
    status: 'beta',
    href: '/tools/quote-card',
  },
  {
    slug: 'testimonial-jar',
    name: 'Testimonial Jar',
    family: 'win-customers',
    tagline:
      'Collect testimonials with one link, show them with one embed — social proof without the monthly platform.',
    pain: 'Asking for testimonials is awkward, collecting them is chaos, and the tools that help charge like it’s hard.',
    description:
      'Send one link, customers record praise in 60 seconds, you approve what shows. Embed the wall anywhere.',
    features: [
      'One collection link',
      'Approve-before-publish moderation',
      'Embeddable testimonial wall',
      'Text now, video later',
    ],
    price: 'Free for 10 testimonials · ₹149/mo unlimited',
    status: 'beta',
    href: '/tools/testimonial-jar',
  },
  {
    slug: 'review-radar',
    name: 'Review Radar',
    family: 'win-customers',
    tagline:
      'A weekly digest of what your reviews are trying to tell you — praise, complaints, and trends.',
    pain: 'My reviews are spread across three platforms and I read them never. Somewhere in there is why sales dipped.',
    description:
      'Bring your reviews together and get a weekly email: sentiment trend, the top three complaints, the top three things customers love. Written in plain language, not analytics jargon.',
    features: [
      'Multi-source review roundup',
      'Weekly plain-language digest',
      'Top complaints & praises, ranked',
      'Trend line over time',
    ],
    price: 'Free for 1 source · ₹299/mo for 5',
    status: 'planned',
  },
  {
    slug: 'report-snap',
    name: 'Report Snap',
    family: 'win-customers',
    tagline:
      'The monthly client report, generated — stop screenshotting dashboards at 11pm.',
    pain: 'Every month I burn a full day screenshotting five dashboards into a deck. My billable rate says that’s insane.',
    description:
      'Connect your client’s analytics and ads accounts once. Every month, each client gets a clean one-page report with a plain-language summary on top. Flat price, not per-client.',
    features: [
      'GA4 & ads integrations',
      'Auto-generated monthly one-pager',
      'Plain-language executive summary',
      'Flat price — not per client',
    ],
    price: '₹499/mo flat, unlimited clients',
    status: 'planned',
  },

  // ─── Run the Day ─────────────────────────────────────────────
  {
    slug: 'doc-chaser',
    name: 'Doc Chaser',
    family: 'run-the-day',
    tagline:
      'Stops bookkeepers chasing clients for documents — the checklist chases them for you.',
    pain: 'Every month the same four clients are late with bank statements, and I become a follow-up-email writer instead of a bookkeeper.',
    description:
      'Set a monthly checklist per client. They get an upload link and automatic escalating reminders until everything is in. You get one board showing who is missing what.',
    features: [
      'Per-client monthly checklists',
      'Client upload links, no logins for them',
      'Automatic escalating reminders',
      '“Who’s missing what” board',
    ],
    price: 'Free for 3 clients · ₹399/mo unlimited',
    status: 'building',
    href: '/tools/doc-chaser',
  },
  {
    slug: 'scope-guard',
    name: 'Scope Guard',
    family: 'run-the-day',
    tagline:
      'Logs every “one small thing” clients add — and turns them into a polite change-order email.',
    pain: 'Six “tiny tweaks” later, I’ve done a week of unpaid work and I’m too awkward to bill for it.',
    description:
      'Log each out-of-scope request in ten seconds. When you’re ready, Scope Guard drafts the polite change-order email with the price — you just hit send.',
    features: [
      'Ten-second request logging',
      'Against-contract tracking',
      'Drafted change-order emails',
      'A record when you need it',
    ],
    price: 'Free for 1 project · ₹149/mo unlimited',
    status: 'beta',
    href: '/tools/scope-guard',
  },
  {
    slug: 'tiny-crm',
    name: 'Tiny CRM',
    family: 'run-the-day',
    tagline:
      'Contacts, notes, and a weekly “follow up with these five people” email. That’s it. That’s the CRM.',
    pain: 'I need to remember 200 people and who to call this week. HubSpot wants to discuss my “growth stack”.',
    description:
      'A CRM stripped to what a solo business actually uses: people, notes, next-action dates, and a Monday email telling you who to follow up with.',
    features: [
      'Contacts & notes',
      'Next-action dates',
      'Monday follow-up digest',
      'Import/export CSV, no lock-in',
    ],
    price: 'Free for 100 contacts · ₹149/mo unlimited',
    status: 'beta',
    href: '/tools/tiny-crm',
  },
  {
    slug: 'crew-board',
    name: 'Crew Board',
    family: 'run-the-day',
    tagline:
      'One schedule for your field crew — instead of a WhatsApp group, a spreadsheet, and hope.',
    pain: 'A client reschedules and the update has to reach three cleaners across two WhatsApp groups. Someone always misses it.',
    description:
      'One shared schedule. Assign jobs to crew, they see today’s work on their phone, and every change notifies exactly the people it affects.',
    features: [
      'Shared job schedule',
      'Crew phone view',
      'Change notifications',
      'Per-crew flat pricing',
    ],
    price: '₹99/mo per crew member',
    status: 'planned',
  },

  // ─── Verity Home ─────────────────────────────────────────────
  {
    slug: 'easycook',
    name: 'EasyCook',
    family: 'verity-home',
    tagline:
      'AI meal planning for real households — what to cook this week, decided.',
    pain: 'The nightly “what do we eat tomorrow” negotiation, forever.',
    description:
      'Plans the week’s meals around your household’s tastes, allergies, and schedule — with recipes, prep notes, and swaps that respect the allergy list. Built for my own kitchen first.',
    features: [
      'Weekly AI meal plans',
      'Allergy-aware swaps',
      'Prep notes & mark-as-cooked',
      'Household preferences that stick',
    ],
    price: 'Free while in beta',
    status: 'beta',
  },
  {
    slug: 'snugglefox',
    name: 'SnuggleFox',
    family: 'verity-home',
    tagline: 'Bedtime stories, made just for them.',
    pain: 'The fourth “one more story” of the night, and you’re out of material.',
    description:
      'Personalised bedtime stories for your child — their name, their day, their favourite things, woven into a gentle story. Built for my own family first.',
    features: [
      'Personalised to your child',
      'Gentle, age-appropriate stories',
      'A new story every night',
      'Parents control everything',
    ],
    price: 'Free while in beta',
    status: 'beta',
  },
]

export function productsByFamily() {
  const grouped = new Map<ProductFamily, Product[]>()
  const families = (Object.keys(FAMILIES) as ProductFamily[]).sort(
    (a, b) => FAMILIES[a].order - FAMILIES[b].order,
  )
  for (const family of families) {
    grouped.set(
      family,
      PRODUCTS.filter((p) => p.family === family),
    )
  }
  return grouped
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}
