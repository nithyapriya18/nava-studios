# Build Handoff — what exists, how to run it, what's next

Written at the end of the Fable build sprint (10 July 2026).

## What was built (all committed on `main`, nothing pushed)

**Site (Inversal):** `/products` catalog (25 products, 5 families, status
badges driven by `lib/products.ts`), `/about` (founder story + photo),
`/terms`, `/refunds`, nav/footer updates, products grid + SnuggleFox/EasyCook
work stories on home and `/work`, CTA from GST Calculator into invoicing.

**11 working tools** (client-first: data lives in the visitor's browser
localStorage; share links carry documents in the URL itself; WhatsApp/UPI via
free wa.me / upi:// deep links — zero API keys needed):

| Tool | Route | Notes |
|---|---|---|
| GST Calculator | /gst-calculator | pre-existing, now with invoice CTA |
| One-Page Invoice | /tools/one-page-invoice | GST/plain invoices, PDF via print, share link, WhatsApp send |
| GST WhatsApp Biller | /tools/gst-whatsapp-biller | invoice list, send with UPI link, paid tracking, overdue nudges |
| Follow-Up Fox | /tools/follow-up-fox | escalating reminders (friendly→firm) via WhatsApp/email |
| Margin Lens | /tools/margin-lens | fee stack + per-order true margin, paste-import |
| Rent Ledger | /tools/rent-ledger | units, paid/late tracking, WhatsApp reminders + receipts |
| Stock Sentinel | /tools/stock-sentinel | thresholds, low-stock digest |
| Scope Guard | /tools/scope-guard | log creep, drafted change-order email |
| Tiny CRM | /tools/tiny-crm | contacts, next actions, follow-up list |
| Quote Card | /tools/quote-card | formula builder + public calculator link (`/q#…`) |
| Testimonial Jar | /tools/testimonial-jar | collection link (`/say#…`) + embeddable wall HTML |

**Statuses in `lib/products.ts`:** the 10 new tools are `beta`; GST Calculator
`live`; EasyCook + SnuggleFox `beta`; Etsy Ledger, Trade Quote, Proposal Forge,
Nudge Book, Doc Chaser `building` (next build queue); the remaining 7 `planned`.
**You control visibility by editing one `status` field per product.**

## How to run

```bash
npm run dev        # root site + all tools on localhost:3000
```
EasyCook and SnuggleFox are separate apps in `apps/` with their own `npm run dev`
(ports 3001/3002 — they need the Neon/Anthropic keys already in their .env files).

## Known limits (deliberate v1 trade-offs)

- No accounts yet: each tool's data lives in that browser. Clearing browser data
  clears the tool. The upgrade path (Neon + email auth, already designed in
  wedge-plan.md) adds sync + the paid tiers.
- "Email digest"-type automation (Stock Sentinel daily email, Fox auto-send)
  needs the server layer — buttons currently generate/copy the message instead.
- WhatsApp = wa.me deep links (opens WhatsApp with the message ready); true
  background sending needs a BSP later.
- Contact email everywhere is `siteConfig.email` in `config.ts` — currently the
  personal Gmail. **Change to hello@your-domain before deploying** (one line).

## Next build queue (in order)

1. Etsy Ledger (CSV parser exists as pattern in Margin Lens)
2. Trade Quote (reuse invoice engine + quote→invoice)
3. Proposal Forge (template-based v1)
4. Nudge Book, Doc Chaser (share-link pattern, same as Quote Card)
5. Server layer: Neon schema + email auth + paid tiers (Razorpay)

## Review status

Inline code review done at the end of the sprint; 6 findings, 5 fixed
(stale-index crash in Quote Card, phone normalization, render-phase setState,
Biller delete, Rent Ledger ordinal), 1 open: swap `config.ts` email before
deploy. Full security review recommended before enabling accounts/payments —
current tools store nothing server-side, so the attack surface is minimal.
