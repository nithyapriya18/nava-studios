# Go-Live Checklist — everything a solo founder needs (zero assumed knowledge)

"Go live" = a stranger can find the site, use a tool, pay you money, and get help —
legally and reliably. You do NOT wait for 25 products. **Go live with Wave 0**
(site + 3 existing products), then each wave is a mini-launch.

## A. Business & legal (India) — the only part that needs real-world errands

- [ ] **Operate as a sole proprietorship to start.** In India this needs no
      registration to exist — you + your PAN are the business. Register a company
      (Pvt Ltd) only when revenue justifies the compliance cost; not now.
- [ ] **One consult with a CA (₹2,000–5,000, one time).** Ask exactly three things:
      (1) when you must register for GST given online software sales
      (services threshold is ₹20L/year, but selling through some channels can
      trigger it earlier), (2) how to invoice foreign customers (export of services,
      LUT for zero-rated GST), (3) what records to keep monthly. Do what they say.
- [ ] **Separate bank account** for business money (a second savings account works
      day one; current account when a gateway requires it). Never mix personal spend.
- [ ] **Legal pages on the site (required by payment gateways):** Terms of Service,
      Privacy Policy, Refund/Cancellation Policy, Contact page with a real address.
      I can draft all four from templates; a lawyer review is a later luxury.
- [ ] **Data protection basics:** India's DPDP Act + GDPR hygiene — collect the
      minimum, delete on request, name it in the privacy policy. SnuggleFox extra
      care: it's a kids' product — accounts belong to parents, no child data collected.

## B. Money collection

- [ ] **Razorpay** for Indian customers (₹0 fixed, ~2% per transaction). Needs PAN,
      bank account, and your legal pages live.
- [ ] **Lemon Squeezy or Paddle** for international customers (~5% + 50¢/transaction).
      They act as *merchant of record* — meaning THEY handle US/EU sales tax and VAT
      for you. This is the single biggest complexity-avoider available to you; do not
      integrate Stripe directly for global sales as a solo founder.
- [ ] Refund policy: 14-day no-questions refund. Cheapest trust-builder that exists.

## C. Infrastructure (all free tiers to start)

- [ ] **Domain:** you have inversal.* — every product lives at
      `/products/<name>` (subpaths, not new domains; one domain = one SEO pool = ₹0 extra)
- [ ] **Hosting:** Vercel Hobby (free). Note: commercial use officially wants the
      $20/mo Pro plan — upgrade when first revenue arrives, it's your first real cost.
- [ ] **Database:** Neon free tier (already used by SnuggleFox/EasyCook — keep it).
- [ ] **Transactional email** (receipts, reminders — the products send these):
      Resend free tier (3,000/mo), one account, per-product sender names.
- [ ] **Business email:** Zoho Mail free plan on your domain (support@, hello@) — ₹0.
- [ ] **Analytics:** Vercel Analytics free tier or self-hosted Umami — ₹0.
- [ ] **Uptime monitoring:** your own Uptime Peek watches all 25 (dogfood; it's
      also the demo for the product).
- [ ] **Backups:** Neon keeps point-in-time restore; export a monthly dump anyway.
- [ ] **Support inbox:** support@ + a FAQ page. No helpdesk software until it hurts.
- [ ] **Password manager + 2FA on everything** (Bitwarden free). Non-negotiable —
      a solo founder's account takeover is a company-ending event.

## D. Per-product go-live gate (every product, every wave)

- [ ] The one job works end-to-end (walked personally, happy path + 2 edge cases)
- [ ] /code-review passed; /security-review if it touches payments or user data
- [ ] Price visible, payment flow tested with a real ₹/test-mode transaction
- [ ] Product page: pain quote, GIF, price, FAQ, founder note
- [ ] Error monitoring on (even just email-me-on-error), Uptime Peek watching it
- [ ] Data it stores is named in the privacy policy
- [ ] Launch checklist from marketing-sales-plan.md scheduled

## E. When to go live (the calendar)

| When | What |
|---|---|
| Week 1–2 | Wave 0: revamped site + positioning + 3 existing products polished → **soft launch** (site is public, /writing announces the plan) |
| Week 3+ | One wave every 2–3 weeks, each with its launch checklist |
| Month 2 | First Product Hunt launch (Get Paid family) once 3+ of its tools are live |
| Month 4–5 | All 25 live; PH launches done; outbound running on all B2B tools |

## F. Things only YOU can do (I can't do these for you)

1. The CA consultation (A) and bank account (A).
2. Create accounts: Razorpay, Lemon Squeezy/Paddle, Resend, Zoho, X/LinkedIn if missing.
3. Put a real face + name on /about (photo, 2 sentences — I'll draft the rest).
4. 60–90 minutes/day on the marketing rhythm — consistency is the entire game.
5. Reply to every early user personally. That's the moat big companies can't copy.
