# Wedge Plan — Get Paid engine + Fable-window build sprint

Supersedes the 6-wave build order in marketing-sales-plan.md / go-live-checklist.md.
The 25-product research stays as the **backlog** (re-ranked later by the site's
"what's slowing you down" form); the **build list is 6 products**.

## The wedge

**Family:** Get Paid. **Market:** Indian SMEs first (founder-market fit, existing
GST Calculator SEO asset). **Thesis:** getting paid is a bleeding-neck problem;
the 4 products are one engine with 4 skins.

Build order: GST Calculator (improve) → One-Page Invoice → GST WhatsApp Biller →
Follow-Up Fox. Deferred until these share a live user base: Trade Quote, Proposal
Forge, Course Ship, Member Gate, and all other families.

## Products page (honest version)

- **Get Paid:** 4 tiles, honestly labeled Live / Beta / Coming soon
- **Verity Home:** EasyCook, SnuggleFox ("made for my own family")
- One line + form: "More tools coming — tell me what's slowing you down."
  (free product discovery; replaces the 25-tile wall)

## Stack decisions (repo-reality corrections to the external plan)

- **DB/auth:** Neon + Drizzle (already in repo) + email-code auth via Resend.
  NOT Supabase — no second vendor.
- **WhatsApp v1:** `wa.me` deep links with pre-filled invoice + UPI link — ₹0, no
  BSP, no API approval. BSP automation is a post-validation upgrade behind a
  `WhatsAppSender` interface (v1 implementation = share-link mode).
- **Payments:** UPI deep links (free) on invoices day one; Razorpay checkout behind
  an adapter, wired when her account exists. Product billing (subscriptions) also
  Razorpay, same adapter.
- **PDF:** one invoice-PDF service in the engine, used by all skins.
- **Cron:** Vercel cron for reminder sending (Follow-Up Fox + Biller reminders).

## Fable-window sprint (build now, roll out slowly later)

Everything builds behind honest labels; nothing is publicly announced until Nithya
flips it. External services (Razorpay keys, Resend domain, WhatsApp BSP) are stubbed
behind adapters with a `.env.example` documenting exactly what to paste in later.

**Block A — Foundation**
1. Shared design tokens + UI kit (site + apps consume)
2. Site revamp: home (wedge version), /products (6 tiles + request form), /about
   (founder-intro.md copy + nithya.jpeg), /terms, /refunds, product page template
3. GST Calculator improvements: shareable permalink per calculation, reverse GST,
   re-skin to tokens, soft CTA → One-Page Invoice. No login. (SEO magnet)

**Block B — Get Paid engine (`packages/getpaid-engine`)**
4. Schema: businesses, clients, invoices (GST-compliant fields incl. GSTIN, HSN/SAC,
   CGST/SGST/IGST), payments, reminders. Email-code auth. Invoice-PDF generator.
   UPI-link builder. WhatsAppSender (share-link v1). RazorpayAdapter (stub until keys).
   ReminderScheduler (cron endpoint + templates).

**Block C — Product skins**
5. One-Page Invoice: first invoice with NO account (activation), account to
   save/send/track. GST + non-GST modes.
6. GST WhatsApp Biller: invoice → wa.me send with UPI link → status tracking →
   scheduled WhatsApp/email reminders. Target price ₹199–499/mo, free tier capped.
7. Follow-Up Fox: unpaid-invoice reminder automation (email v1), escalating
   templates, works on invoices from #5/#6 or manually added ones.

**Block D — Gate**
8. Walk every flow end-to-end; /code-review on the full diff; /security-review
   (auth + payments + user data); small logical commits throughout; no push
   without explicit OK.

## Rollout after the sprint (slow, deliberate — her cadence)

- **Week 1:** wire real keys (Resend, Razorpay), CA consult, soft-launch site +
  improved GST Calculator. Announce nothing else yet.
- **Week 2–3:** One-Page Invoice live; calculator CTA on; first launch post.
- **Week 4–6:** Biller beta with 10 founding users from CA/SME communities
  (collateral-kit.md DM template); iterate on their feedback.
- **Fox rule:** don't enable Follow-Up Fox marketing until the Biller has ≥10 real
  users — no invoices means nothing to remind, and that's a repositioning signal.
- Marketing rhythm + metrics: unchanged from marketing-sales-plan.md, but all
  energy on one family.

## Milestones

- End of July 2026: engine + improved calculator live
- Mid-August: One-Page Invoice live
- September: Biller in paid beta; Fox gated on Biller traction
