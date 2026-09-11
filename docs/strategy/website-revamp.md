# Inversal (veritystudios site) — Revamp Plan

Goal: the site stops being a portfolio and becomes a **storefront + story**. Every page
answers one of: *What is this? Can I trust it? Where's my tool?*

## Information architecture (after revamp)

```
/                    Home — positioning + families + featured tools + story strip
/products            All 25, grouped by the 5 families, status badges
/products/[slug]     One page per product: problem → demo → price → start
/about               Founder story ("What am I" page — the marketing engine)
/writing             Build-in-public blog (exists — keep, post weekly)
/support             Exists — keep, add per-product FAQ
/privacy /terms /refunds   Legal set (terms + refunds are NEW — required by payment gateways)
/gst-calculator      Keep as-is (live tool), re-skin to shared tokens
```

`/work` (client-work section) merges into `/about` as a "past work" strip — a studio
selling products shouldn't lead with services, it splits the positioning.

## Page-by-page

### Home
1. **Hero:** tagline + subline ("One-person studio. 25 tools. Each does one job,
   priced so you don't think twice.") + two CTAs: *Browse tools* / *Read the story*.
2. **Family grid:** 5 cards (Get Paid / Know Your Numbers / Win Customers /
   Run the Day / Home) with product counts.
3. **Featured tools:** 3 live products with one-line pain statements.
4. **Founder strip:** photo + 2 sentences + link to /about.
5. **Latest writing:** 3 posts (existing pattern).

### /products
- Grouped by family, in the order above. Card = name, one-line pain, status badge,
  price-from. Content-driven via `content/products/*.mdx` (mirrors `content/work` pattern).

### /products/[slug] — the money page, one template for all 25
1. The problem, in a real user's words (quote from forum research)
2. The tool in one sentence + screenshot/15-sec GIF
3. Price (flat, visible, no "contact us" — ever)
4. Start button (free tier or trial — no credit card for free tiers)
5. FAQ (3–5 questions) + founder note ("I'm Nithya, I built this because…")

### /about
- The story: why small businesses, why solo, why fair prices.
- "How I work": build in public, ship weekly, answer my own support email.
- Links: X/LinkedIn, writing, support. Past client work strip at the bottom.

## Design system (Wave 0 dependency)

One shared token package consumed by site + all apps: Nava palette, type scale,
spacing, radius, button/card/badge components. Family accent colors:
Get Paid = green family, Know Your Numbers = blue, Win Customers = amber,
Run the Day = violet, Home = warm rose. Same neutrals everywhere.

## SEO plan (free traffic engine)

- Every product page targets its pain keyword ("late invoice reminder tool",
  "etsy profit calculator", "gst invoice whatsapp").
- Per product, one **"[Big Tool] alternative"** comparison page once live
  (e.g. "Kajabi alternative for one course"). These convert the "too expensive"
  searchers — the exact audience from the research.
- Free calculators (GST, Margin Lens's free tier, Quote Card demos) are the
  link magnets. GST Calculator already proves this pattern.
- Basics at build time: sitemap.xml, per-page meta/OG images, fast static pages.

## Build order (inside Wave 0)

1. Shared tokens package → 2. /products + product template + 25 MDX stubs →
3. Home revamp → 4. /about → 5. /terms + /refunds → 6. re-skin GST calculator page.
