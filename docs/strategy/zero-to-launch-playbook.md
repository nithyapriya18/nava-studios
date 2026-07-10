# Zero-to-Launch Playbook — START HERE

You said: "I have nothing set up and I'm completely clueless — don't assume anything."
This document assumes exactly that. It is the master doc; the others in this folder
are the deep dives. Read this top to bottom once, then just follow the checkboxes.

---

## PART 1 — Setting up your company from absolute zero (India)

### 1.1 The single most important fact

**You do not need to register a company to start selling software in India.**
Operating as yourself is called a *sole proprietorship* — it exists the moment you
start doing business. Your PAN card IS the business identity. Income from the
products is just your income, declared at tax time. Everyone starts here.
Registering a Private Limited company is a later step (think: ₹50K+/year in
compliance costs) that only makes sense once real revenue exists. **Do not do it now.**

### 1.2 This week — three errands (total: ~2 hours + one meeting)

- [ ] **Open a separate bank account.** Any savings account at your existing bank,
      used ONLY for business money in/out. Why: come tax time, one clean statement
      instead of untangling your personal spending. (A "current account" — a
      business account — comes later, when Razorpay asks for it.)
- [ ] **Find a CA (Chartered Accountant) and book ONE paid consultation** (₹2,000–5,000).
      How to find one: ask literally any founder/freelancer you know for their CA, or
      use ClearTax/IndiaFilings' consult services online. Ask these EXACT questions
      and write down the answers:
      1. "I'm going to sell software subscriptions online as an individual, in India
         and abroad. **When do I need to register for GST?**" (Background so you can
         follow the answer: GST registration for services is generally required once
         you cross ₹20 lakh/year turnover — but selling online and selling to foreign
         customers have special rules. The CA gives you YOUR answer.)
      2. "When foreign customers pay me, **what do I need for export of services?**"
         (Words you'll hear: LUT, zero-rated. Just do what they say.)
      3. "**What records should I keep monthly** so year-end is painless?"
- [ ] **Check your domain.** You need to own a domain (your website's address).
      If you already own one for Inversal, done. If not: buy one at Cloudflare or
      Namecheap (~₹800–1,200/year). This is the only mandatory spend on this page.

### 1.3 What is Zoho and do you need it?

Zoho is an Indian software company; the only piece you need is **Zoho Mail's free
plan**: it gives you professional email addresses on your own domain —
`hello@yourdomain.com` instead of a Gmail address. Why it matters: customers trust
`support@inversal.com`; payment gateways prefer it too. Setup is: create free Zoho
Mail account → it shows you 3–4 settings to paste into your domain dashboard
(these are called DNS records — think of them as your domain's settings page) →
wait an hour → your email works. I can walk you through it live when you do it.

### 1.4 Accounts to create, in this exact order (all free to open)

| # | Account | What it is | You need it for | Needs first |
|---|---|---|---|---|
| 1 | **Vercel** | Where the website runs | Deploying everything I build | GitHub account |
| 2 | **Neon** | The database | Products that save data | nothing |
| 3 | **Zoho Mail** | Email on your domain | hello@ / support@ | domain |
| 4 | **Resend** | Sends automated emails (receipts, reminders — the products send these, not you) | Follow-Up Fox, Doc Chaser, etc. | domain |
| 5 | **Razorpay** | Takes payments from Indian customers (UPI/cards), puts money in your bank | Charging for anything | PAN + bank account + website with Terms/Privacy/Refunds pages (I've built those) |
| 6 | **Lemon Squeezy** | Takes payments from foreign customers AND handles their taxes for you | International sales | Do this LAST, only when a foreign customer actually appears |

Each one: sign up, then paste the API keys it gives you into the `.env` file I
document in the handoff. That's the entire integration step on your side.

### 1.5 Things you might think you need but DON'T (yet)

Trademark · Pvt Ltd company · MSME/Udyam registration · an accountant on retainer ·
paid design tools · a business phone number · an office · GST registration on day
one (see CA question #1). Every one of these is a "when revenue exists" decision.

---

## PART 2 — The wedge plan (what we're building & releasing, in order)

Full detail: `wedge-plan.md`. The one-paragraph version:

Everything gets built now (your call — locked behind status flags only you flip).
But it goes LIVE in this order: **GST Calculator (free, brings Google traffic) →
One-Page Invoice (free first invoice — turns visitors into users) → GST WhatsApp
Biller (the paid one — invoices with UPI pay links delivered on WhatsApp, ₹299/mo)
→ Follow-Up Fox (auto-chases unpaid invoices — keeps users forever).** These four
share one engine; each unlock takes you one flag-flip and one announcement post.
Everything else stays "coming soon" until these four have real users.
**Rule that protects you:** don't unlock Fox's marketing until the Biller has 10
real users. If nobody adopts the Biller, that's a signal to change the pitch, not
to release more products.

---

## PART 3 — Marketing, sales & networking (the real plan)

### 3.1 The only sentence you need to memorise

> "I run Verity Studio — I build small, fair-priced tools that help small
> businesses get paid. One job each, no bloat, no enterprise pricing."

That's your answer at every meetup, in every bio, in every DM.

### 3.2 Where to get noticed — ranked for YOU specifically

**1. LinkedIn (your unfair advantage — use it first).** You have 10+ years of AI/PM
credibility and a network full of product people. Post 3×/week: one build-in-public
update (screenshot + what you learned), one small-business-pain observation, one
milestone with real numbers. Headline: *"Building 25 small, fair-priced tools for
small businesses — solo, in public | Verity Studio"*. Your network reshares → their
founder friends see it → early users.

**2. WhatsApp + CA channel (for the GST products — India-specific).** CAs and
accountants each advise dozens of small businesses; ONE CA who likes your Biller is
a distribution channel. Where: CAclubindia forums, CA/tax LinkedIn communities, and
literally your own CA from Part 1 ("would your clients use this?"). Also: share the
free GST calculator into business WhatsApp groups you can reach — free tool, no
selling, the tool sells.

**3. X/Twitter build-in-public.** Same 3 posts as LinkedIn, reformatted shorter.
The #buildinpublic community follows solo-founder journeys; monthly revenue-number
posts (even ₹0) get followed.

**4. Reddit + niche forums (per product, when it unlocks).** r/freelance,
r/smallbusiness, r/IndiaBusiness, r/EtsySellers, r/sweatystartup. Rule from
collateral-kit.md: answer the question fully first, mention your tool second, always
with "I built this" disclosure. 3 answers/week.

**5. Product directories & launches.** Each unlocked product: submit to free
directories (BetaList, Uneed, MicroLaunch, AlternativeTo). Product Hunt: ONE big
launch when the Get Paid family has 3 live products — not per-product.

**6. Bengaluru in-person networking (monthly, pick two).** You're in India's startup
capital — use it: **SaaSBoomi** events (THE Indian SaaS founder community — join
their online community too), **Headstart Bangalore** (Startup Saturday), **TiE
Bangalore** events, and any indie-hacker/builder meetup you find on Lu.ma or
Meetup.com. Go with the one sentence from 3.1 and a phone that can demo the Biller
in 60 seconds. Goal per event: 5 real conversations, not 50 cards.

**7. Peerlist (Indian builder community — like LinkedIn for makers).** Create a
profile, post your launches there; Indian audience, high signal.

### 3.3 The sales motion (how strangers become paying customers)

1. **Free tools are the net.** GST Calculator + free invoice = people arrive with a
   problem, get value in 60 seconds, no signup wall.
2. **The product upsells at the moment of need.** You made an invoice → "want it
   sent on WhatsApp with a pay link?" → that's the Biller. Invoice unpaid for 15
   days → "want Fox to chase this politely?" Nothing is pitched before the need is felt.
3. **Founding-customer offers for the B2B tools** (Doc Chaser, Nudge Book): 20
   personal DMs/week using the collateral-kit.md template. Offer: free setup + 3
   months half price for the first 10, in exchange for blunt feedback.
4. **Every happy user gets the day-14 testimonial ask** (template in collateral kit),
   and testimonials go on the product pages (via Testimonial Jar — dogfooded).

### 3.4 Your first 30 days after Fable (the actual calendar)

**Week 1 — Foundations:** Part 1 errands (bank, CA, domain check) + create accounts
1–4 + paste keys + deploy. Soft-launch: site is live, LinkedIn post #1: "I'm
building 25 small tools for small businesses, solo, in public. Here's why."
**Week 2 — First traffic:** GST Calculator announced (LinkedIn + X + 2 WhatsApp
groups + Peerlist). Start the 3-posts/week rhythm. Set up Razorpay meanwhile.
**Week 3 — First users:** Unlock One-Page Invoice. Announce. Submit both tools to
3 directories. First Reddit answers.
**Week 4 — First revenue attempt:** Unlock the Biller with founding-user offer
(50% off for first 20). DM 20 people who engaged with your posts. Attend first
Bengaluru event. Month-end: post real numbers publicly.

**Weekly rhythm from then on (90 min/day):** Mon: write the week's posts. Tue: 20
outbound DMs. Wed: blog post. Thu: 3 community answers. Fri: metrics + reply to everything.

### 3.5 The metric that matters each month

Month 1: is anyone using the free tools? (target: 100 uses)
Month 2: is anyone signing up? (target: 50 accounts)
Month 3: is anyone paying? (target: first 10 paying customers, ~₹3–5K MRR)
If a stage stalls, fix THAT stage — more products is never the fix.

---

## PART 4 — When you feel lost (you will)

The loop is always the same: **ship one thing → tell 10 humans → listen → adjust →
repeat.** Everything in this folder is just that loop with details. And nothing
here is irreversible — every plan survives being wrong about half of itself.
