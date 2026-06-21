# EasyCook — Parking Lot

Features to build later, so nothing gets forgotten.

---

## Settings & Household Management

- **Household member editor** — Settings page lists every member with their full profile (name, age, diet type, spice level, allergies, likes/dislikes, health goals). Each member is expandable/editable inline. Can add new members or remove existing ones. Changing a member's profile should offer to regenerate the meal plan.

- **Measurement system toggle** — User picks Metric (g, kg, ml, L) or Imperial (oz, lb, fl oz, cup) in settings. All quantities in pantry, recipes, grocery list, and generated meal plans convert automatically. Store the raw value + unit internally; convert only on display.

---

## Messaging & Notifications

- **Daily WhatsApp message** — User sets a time (e.g. 7 AM) and a phone number. Every day at that time, send a WhatsApp message with today's meals + full recipe for each. Use WhatsApp Business API or Twilio's WhatsApp channel. Message should be formatted cleanly (meal name, ingredients, steps).

- **Cook/helper contact integration** — User can add contacts (name + WhatsApp number) labelled as "cook", "helper", etc. When the daily meal message is configured, user can choose to send it directly to the cook instead of (or in addition to) themselves.

---

## Recipe & Meal Management

- **Paste a recipe link to import** — User pastes any URL (NYT Cooking, AllRecipes, personal blog, etc.). App scrapes or uses an LLM to extract: meal name, ingredients + quantities, prep/cook time, servings, nutrition. Saved as a custom meal that can be slotted into the plan.

- **Editable recipes** — Any meal in the plan can be opened in an edit mode. User can change ingredient quantities, swap an ingredient, adjust prep steps, rename the meal. Edits persist and are used for pantry deduction + grocery list.

- **Drag meals between days** — Weekly calendar view supports dragging a meal card from one day/slot to another. Swapping two meals should also be supported. Grocery list and pantry deductions recalculate on drop.

- **Favourite meals** — Heart icon on every meal card. Favourited meals appear in a "Favourites" tab/drawer. When regenerating a plan, user can pin favourites so Claude preferentially includes them. Also useful for quick manual swaps.

---

## Mobile

- **Expo mobile app** — Mirror the web app on iOS/Android using React Native + Expo. Priority screens: onboarding wizard, today's meals, pantry quick-update (scan barcode or type), grocery list (checkable), notifications for pantry expiry. Share the same `lib/types.ts` and storage logic where possible; use AsyncStorage instead of localStorage.

---

## Smart Member Detection & Proactive Suggestions

- **Age-based automatic detection** — When a member's age is entered during onboarding (or in the member editor), auto-tag them: children (≤12) → "kid-friendly", teens (13–17) → "teen", seniors (65+) → "senior". Surface these tags visibly on the member card so the household knows the system has picked them up.

- **Kid-friendly meal suggestions** — For households with children, Claude's prompt should explicitly ask for child-appropriate options: mild spice, familiar textures, fun presentation (e.g. wraps, mini portions, colourful plates). Flag meals as "kid-friendly" on the card so parents can spot them instantly. Avoid common child allergens proactively even if not listed.

- **Senior-friendly meal suggestions** — For members 65+, Claude should factor in: softer textures, lower sodium, calcium/vitamin D-rich options, easier chewing, smaller portion sizes. Flag meals as "senior-friendly". Optionally surface a weekly micro-nutrient alert if the plan falls short of RDA targets for seniors.

- **Proactive household alerts** — After plan generation, show a summary banner: "2 kid-friendly dinners this week · 1 high-calcium meal for seniors · 3 high-protein options for Rahul's muscle-gain goal." Gives the household confidence the plan actually accounts for everyone without them having to check each card.

- **Allergy proactiveness** — If a new allergen is added to any member mid-week, flag all existing meals in the current plan that may contain it and offer to regenerate affected days.

---

## Other Ideas

- **Barcode scanner for pantry** — Mobile only. Scan a product barcode to auto-fill the ingredient name and detect unit type from the product database.

- **Shopping list sharing** — Export grocery list as a shareable link or send via WhatsApp. Checklist format so whoever is shopping can tick items off.

- **Nutrition weekly summary** — End-of-week view showing average daily calories, protein, carbs, fat across the week vs. goal targets per household member.
