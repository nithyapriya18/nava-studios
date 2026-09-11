# Nava Studios

One-person product studio in Bengaluru. Nithya takes an idea and builds the first version a small or mid-size team can use.

Repo: [github.com/nithyapriya18/nava-studios](https://github.com/nithyapriya18/nava-studios)

## Layout

- `apps/website` — the Nava Studios site
- `apps/<product>` — one standalone Next.js (or Expo) app per product
- `packages/catalog` — product list and local URLs
- `packages/ui` — shared chrome
- `packages/kit` — shared invoice / GST helpers
- `apps/gst-mobile` — Expo app (install separately; not in the npm workspace)

## Run

```bash
npm install
npm run dev                 # website on :3000
npm run dev -w gst-calculator
npm run dev -w easycook
```
