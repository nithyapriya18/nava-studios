# Design System Document: GST Mobile Editorial Experience

## 1. Overview & Creative North Star: "The Sovereign Ledger"
This design system moves away from the sterile, "template-first" look of typical tax and utility applications. Our North Star, **"The Sovereign Ledger,"** treats financial data with the prestige of a physical archival document while maintaining the velocity of a modern digital tool. 

By leveraging the "Rupee Reserve" heritage palette against a cool, expansive `surface` (#F7F9FB), we create an environment of "Authoritative Calm." We break the standard grid through **intentional asymmetry**: using heavy left-aligned typographic anchors and overlapping surface containers to create a sense of tactile depth. This is not just a utility; it is a professional high-end workspace.

---

## 2. Colors: Tonal Depth vs. Structural Lines
The palette is rooted in heritage, but the application is contemporary. 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition needed.

### Surface Hierarchy & Nesting
Instead of a flat grid, treat the UI as a series of physical layers.
- **Base:** `surface` (#F7F9FB)
- **Nested Content:** `surface-container-low` (#F2F4F6) for secondary modules.
- **Active Focus:** `surface-container-lowest` (#FFFFFF) for the primary data entry cards to provide maximum "pop."

### The "Glass & Gradient" Rule
To elevate CTAs beyond standard flat buttons:
- **Signature Gradients:** Use a subtle linear gradient (Top-Left to Bottom-Right) transitioning from `primary` (#703321) to `primary_container` (#8D4A36). This provides a "burnished" metallic feel that communicates value and security.
- **Glassmorphism:** For floating action buttons or navigation bars, use `surface` at 80% opacity with a `20px` backdrop-blur.

---

## 3. Typography: The Editorial Scale
We pair **Manrope** (Headlines) for its geometric stability with **Work Sans** (Body) for its high legibility in dense data environments.

*   **Display (Manrope):** Large-scale Indian currency formatting (₹) should always use `display-lg`. This makes the "Bottom Line" the hero of the screen.
*   **Headlines (Manrope):** Used for section titles. Use `headline-sm` with increased letter spacing (0.05em) for a sophisticated, "bank-ledger" aesthetic.
*   **Body (Work Sans):** All financial data and labels must use `body-md` or `body-lg`. Work Sans’s open counters ensure that numbers like '0', '6', and '8' are never confused, even at small scales.
*   **Indian Numbering:** Always format values using the Indian system (e.g., ₹1,00,000 rather than ₹100,000).

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-generic." We use **Ambient Depth**.

*   **The Layering Principle:** Stack `surface-container-highest` (#E0E3E5) behind a `surface-container-lowest` (#FFFFFF) card to create a natural lift.
*   **Ambient Shadows:** If a shadow is required for a floating modal, use: `box-shadow: 0 12px 32px rgba(25, 28, 30, 0.06);`. This mimics soft, overhead office lighting.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline_variant` at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Buttons & CTAs
*   **Primary:** Rounded `xl` (0.75rem). Gradient fill (`primary` to `primary_container`). White text (`on_primary`).
*   **Secondary:** Ghost style. No background, no border. `secondary` (#046B5E) text with a heavy weight.
*   **Large Touch Targets:** All buttons must have a minimum height of `56px` to accommodate professional users in high-speed environments.

### Input Fields (GST Specific)
*   **The "Ledger" Input:** No box. Use a `surface-container-highest` bottom bar (2px) that turns `primary` on focus. 
*   **Focus State:** The label should animate to a `label-sm` using the `secondary` (#046B5E) color to signal "System Ready."

### Cards & Lists
*   **Constraint:** Zero dividers. 
*   **Separation:** Use `8px` or `16px` of vertical white space combined with a `surface-container-low` background on every second item to create a "zebra-stripe" effect that feels intentional rather than clinical.

### High-End Utility Components
*   **The "Tax Summary" Chip:** A wide, `full` rounded chip using `tertiary_container` (#4B606A) with `on_tertiary_container` text. This is used for status tags (e.g., "Filed," "Pending").
*   **Progressive Disclosure Stepper:** Use vertical lines only in the stepper, utilizing `outline_variant` (#D9C2BB) to guide the user through multi-step GST filings.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts where the left margin is wider than the right (e.g., 24px left, 16px right) to create an editorial feel.
*   **Do** use the `secondary` Teal (#00695C) exclusively for "Success," "Money In," and "Verified" states.
*   **Do** emphasize the ₹ symbol by reducing its opacity to 60% relative to the amount digits.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#191C1E) to maintain the "Rupee Reserve" tonal warmth.
*   **Don't** use "Standard" Material Design blue. If a blue is needed, use the system’s `tertiary` Slate Blue (#455A64).
*   **Don't** use sharp corners. Use the `lg` (0.5rem) or `xl` (0.75rem) tokens to keep the interface feeling approachable and modern.