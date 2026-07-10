# Costing — minimum-cost operating budget

Rule: **₹0 fixed cost until revenue exists; every paid upgrade is triggered by a
revenue milestone, not by optimism.**

## Phase 1 — from today until first paying customer

| Item | Tool | Cost |
|---|---|---|
| Hosting | Vercel Hobby | ₹0 |
| Database | Neon free tier | ₹0 |
| Domain | inversal.* (owned) | ~₹1,000/yr renewal |
| Business email | Zoho Mail free | ₹0 |
| Transactional email | Resend free (3K/mo) | ₹0 |
| Analytics | Vercel/Umami | ₹0 |
| Design collateral | Canva free + code-generated OG images | ₹0 |
| Payments (India) | Razorpay | ₹0 fixed; ~2%/txn |
| Payments (global) | Lemon Squeezy/Paddle | ₹0 fixed; ~5%+50¢/txn |
| AI features (Claude API: Review Radar, Report Snap, Proposal Forge, SnuggleFox, EasyCook) | usage-based | ₹800–2,000/mo (~$10–25), capped by per-user limits in free tiers |
| SMS/WhatsApp (Nudge Book, GST Biller) | Twilio / Meta WhatsApp API | ~₹0.5–1 per message — **charge these products enough to cover it; never free-tier SMS** |
| One-time: CA consult | — | ₹2,000–5,000 once |

**Total: ~₹1,000–2,500/month (~$12–30) + one-time CA fee.**

## Phase 2 — upgrade triggers (spend only when the milestone fires)

| Milestone | Upgrade | New cost |
|---|---|---|
| First paying customer | Vercel Pro (commercial-use compliance) | $20/mo |
| >3K emails/mo | Resend paid | $20/mo |
| >Neon free limits | Neon Launch | $19/mo |
| ₹50K MRR | Error tracking (Sentry team), better support tooling | ~$30/mo |
| ₹1L+ MRR | CA on retainer, consider Pvt Ltd registration | ~₹3–5K/mo |

## Marketing budget

**₹0.** Every channel in the plan (build-in-public, SEO, communities, launches,
outbound DMs) is free — the spend is your 60–90 min/day. Paid ads are explicitly
banned until a product shows organic paid conversions (ads amplify a working
funnel; they cannot create one).

## Unit-economics guardrails per product

- Free tier must cost ~₹0 to serve (no SMS, capped AI calls, generous but static).
- Paid price ≥ 5× its per-user infra cost.
- SMS/WhatsApp products (Nudge Book, GST Biller): price per-message costs into the
  plan (e.g. 200 reminders/mo included) — messaging fees are the only real variable
  cost in the portfolio and the only thing that can silently eat a margin.
