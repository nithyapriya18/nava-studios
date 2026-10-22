# Studio NPV — Brand guidelines: Indigo & Marigold

v2.0 · October 2026. This is the brand for everything Studio NPV makes: the website, decks, documents, social posts, product UI and email. The same rules as a designed page: [brand-guidelines.html](brand-guidelines.html) and [Studio-NPV-Brand-Guidelines.pdf](Studio-NPV-Brand-Guidelines.pdf). The live implementation is [apps/website/app/globals.css](../apps/website/app/globals.css). The source design is the "Indigo & Marigold (final)" page of the design canvas at https://claude.ai/artifact/2E386gd3aCLdFDpmkCtVSh.

## 1. Idea: a page, and a margin

Founders hiring a solo builder ask two things: can I trust this person with my idea, and will working with them feel human?

- **The page** answers the first question. It uses structure, real numbers, fixed prices and strong colour blocks.
- **The margin** answers the second. It uses pen notes in sindoor red and marigold circles, as if someone had marked up your plan.

The brand tells the story of a project: napkin, then scope, then shipped. The hand is loudest at the start and quietest at the end. Finished things look finished.

## 2. Colour

There are two brand colours, one pen colour and three neutrals. Every text pairing listed passes WCAG AA (4.5:1).

| Name | Hex | Text on it | Use |
|---|---|---|---|
| Neel (indigo) | `#232C82` | white, 12.0:1 | Hero and contact bands, primary buttons, numbers |
| Genda (marigold) | `#F5B53F` | Deep Neel, 8.9:1 | Buttons on indigo, pen circles, active states |
| Sindoor (vermilion) | `#C2401E` | on Kagaz, 4.6:1 | Handwritten notes, strike-throughs, low scores |
| Deep Neel | `#161B4F` | white, 16.1:1 | Footer, text on marigold |
| Kagaz (paper) | `#F4F2EC` | Ink, 15.2:1 | The page background |
| Haldi (turmeric wash) | `#FCE9C2` | Ink, 14.3:1 | Warm bands, asides, pills |
| Syahi (ink) | `#171A33` | on Kagaz, 15.2:1 | Body text and headlines |
| Slate | `#555A78` | on Kagaz, 6.0:1 | Secondary text, labels |

**Proportion across a page:** about 50% Kagaz, 25% Neel bands and 12% Haldi, then Ink text. Marigold is only an accent, and Sindoor appears only in the margin.

**Pairings**
- **On a Neel band:** white headline, accent word in marigold, marigold button.
- **On a Kagaz page:** ink text, accent word in neel, indigo button.
- **On a Haldi band:** use it for proof and next steps; notes go in sindoor.

**Dark mode**

| Role | Colour |
|---|---|
| Background | `#10143A` |
| Cards | `#1A1F4D` |
| Text | `#EEF0FB` |
| Secondary text | `#AEB3D8` |
| Accent and buttons | Marigold |
| Notes | lighter sindoor, `#FF8F6B` |

## 3. Wordmark

**studio *npv***: "studio" in Instrument Sans Medium, and "npv" in Instrument Serif Italic at 1.35× the size. Both sit on a shared baseline, and "npv" takes the accent colour of its background:

| Background | "npv" colour |
|---|---|
| Kagaz | indigo |
| Neel | marigold |
| Marigold | Deep Neel |

The wordmark is always lowercase. Never draw it by hand, circle it, or set it in Kalam. The wordmark belongs to the page, not the margin.

## 4. Type: three voices

| Voice | Typeface | Use |
|---|---|---|
| Display | Instrument Serif (400, roman and italic) | Headlines, big numbers, step numerals, FAQ questions, post titles. The italic word takes the accent colour. Never below 22px. |
| Page | Instrument Sans (400/500/600) | Body text at 17px with 1.6 line height; small text at 14–15px; labels at 12px, uppercase, 0.1em tracking. Every button, field and nav item. |
| Margin | Kalam Light (300) | Margin notes only: sindoor on Kagaz, marigold on Neel, 18–24px, one short line. Kalam has Devanagari, so a note can be in Hindi later. |

All three are free on Google Fonts.

## 5. The margin: four pen marks, used sparingly

These four marks are the whole budget for fun. Use one mark per screen view. If a mark doesn't point at something true and specific, delete it.

| Mark | Colour | Use for |
|---|---|---|
| Circle | marigold | The one word a page is about. Hero headlines only. |
| Underline | marigold | A promise. One section heading per page. |
| Margin note | sindoor | An aside in your voice, beside what it explains. Under eight words. |
| Correction (strike-through) | sindoor | What the studio doesn't do, or what waits until later. Rare. |

**Motion:** circles and underlines draw on once, over 900ms, and nothing loops. With reduced motion turned on, the marks are simply there. Marks are absolutely positioned, so they never shift the layout.

## 6. Controls

Controls belong to the page, never the margin: they are round and exact, and never drawn by hand.

- **Primary button:** Neel on Kagaz, Marigold on Neel. On hover it swaps to the other brand colour.
- **Button size:** a 48px-tall pill (44px minimum touch target) with 24px side padding, Instrument Sans Medium at 15px, and an optional →. Use one primary button per view.
- **Links:** a 1.5px marigold underline.
- **Fields:** 50px tall with a 12px radius. On focus they get a Neel border and a 3px Haldi ring. Labels always sit visibly above the field.

## 7. Layout

- **Page rhythm:** Neel hero → Kagaz sections → a Haldi band for proof → Kagaz → Neel contact band → Deep Neel footer. Every page opens on a colour block, and no stretch of plain paper runs longer than about two screens.
- **Spacing:**
  - 8px base unit.
  - Sections sit 72px apart on desktop and 48px on phones.
  - Desktop sections have a 200px label rail on the left.
  - At phone width everything stacks, with a 20px gutter.
- **Surfaces:**
  - Grouped items sit on white cards with a 1px border and a 16px radius.
  - Panels on Neel get a soft deep shadow.
  - Buttons use a 999px radius.
- **Imagery:** one real portrait, ideally on a marigold or indigo backdrop. No stock photos, no illustrated people, and no gradients or glows.

## 8. Voice

Write plainly and directly, in the first person. Say what it costs and what you get; skip describing what you are.

| Topic | Say | Not |
|---|---|---|
| Person | "I design and build…" | "We craft bespoke digital experiences" |
| Price | "a fixed price agreed before work starts" | "affordable packages" |
| Proof | "$6.4M documented cost impact" | "proven track record" |
| Limits | "If you need very large scale from day one, I'll say so." | "No project too big or small" |
| Margin | *the price is set here, once* | jokes, emoji or exclamation marks |

## 9. Do and don't

**Do**
- Open every page on a Neel block.
- Use one pen mark per view, pointing at something true.
- Keep finished UI crisp; the hand belongs to drafts and notes.
- Check every page in dark mode and at 390px.

**Don't**
- Draw buttons, fields or the wordmark by hand.
- Put marigold text on Kagaz (it fails contrast).
- Add gradients, glows, emoji or stock imagery.
- Animate anything that loops or follows the cursor.

## Using it outside the website

- **Decks:**
  - Title and section slides use a Neel background with white Instrument Serif and a marigold italic accent word.
  - Content slides use a Kagaz background.
  - Put at most one Kalam note per slide.
- **Documents:**
  - The page is Kagaz or white, with Instrument Serif headings and Instrument Sans body text.
  - Callouts sit on Haldi.
- **Social posts:**
  - Use a Neel or Haldi background and one headline.
  - Use one pen mark at most.
  - Put the wordmark bottom-left.
