# Leaseback Page — Design Spec

**Date:** 2026-04-25
**Status:** Draft (awaiting approval)
**Target:** new file `src/pages/Leaseback.jsx`, new route `/leaseback`
**Reference pages:** `src/pages/Sales.jsx` (`/sales/new`), `src/pages/AircraftR66.jsx` (`/aircraft/r66`), `src/pages/AircraftConsulting.jsx` (`/aircraft-consulting` — closest service-page sibling)

---

## Overview

Create a dedicated landing page for the **Leaseback Program** so the "Learn More" button on the Leaseback card on `/sales/new` (`Sales.jsx:1457`) has a real destination instead of jumping to the contact form.

Scope: **lightweight, educational landing page**, ~350–450 lines. No on-page conversion form, no CTA buttons. The page exists to explain the program; users who want to enquire continue via the site's normal contact path. Five content sections, identical brand frame to sibling pages.

---

## Architecture

Match the standalone-branded-page pattern used by `Sales.jsx`, `AircraftR66.jsx`, and `AircraftConsulting.jsx`:

```jsx
export default function Leaseback() {
  return (
    <div className="lb-page">
      <LeasebackStyles />        {/* inline <style jsx> block */}
      <LeasebackHeader />        {/* local header copying SalesHeader pattern */}
      <main>
        <LeasebackHero />
        <LeasebackIntro />
        <LeasebackHowItWorks />
        <LeasebackBenefits />
        <LeasebackEligibleAircraft />
      </main>
      <FooterMinimal />
    </div>
  );
}
```

- **CSS prefix:** `lb-` for every class on the page (`lb-hero`, `lb-intro`, `lb-how`, `lb-benefits`, `lb-aircraft`).
- **No shared abstraction extracted from the header.** Sibling pages each ship their own local `*Header` component with identical behaviour — follow that convention.
- **Animation wrapper:** local `Reveal({ children, delay, direction })` component using `framer-motion` `useInView`, copied verbatim from `Sales.jsx:113` (already used identically across sibling pages).
- **CMS hooks:** `usePageImages('leaseback')` keys hero and aircraft-strip images so they're admin-editable. Use `useCmsHighlight()` so admin click-to-edit works on this page like every other branded page. Requires registering new sections in `src/lib/imageSections.js` (see "CMS image sections" below).
- **No FAQs section** (lightweight scope) — `useFaqs` is **not** used on this page.
- **No `Helmet` / SEO meta tags.** None of the sibling branded pages (`AircraftR66`, `AircraftConsulting`, `Sales`, `SuperYachtOps`) use `react-helmet`; this page matches that convention. SEO is not in scope.

---

## Routing

Add to `src/App.jsx` next to other top-level standalone-branded routes (e.g. `/superyacht-ops`, `/pilot-provisioning`, `/aircraft-consulting`):

```jsx
import Leaseback from './pages/Leaseback';

// inside <Routes>, alongside other standalone-branded routes (around line 257):
<Route path="/leaseback" element={<Leaseback />} />
```

Place the import alphabetically near the existing imports; place the route near the cluster of other service-style routes already grouped together (`/superyacht-ops`, `/pilot-provisioning`, `/aircraft-consulting`).

---

## Wire-up: Update the Leaseback card on `/sales/new`

In `src/pages/Sales.jsx`, change the Leaseback card's CTA from a contact mailto-style anchor to a React Router link to the new page.

**Before** (`Sales.jsx:1457`):

```jsx
<a href="/contact?subject=leaseback" className="sales-btn sales-btn--white">
  Learn More
</a>
```

**After:**

```jsx
<Link to="/leaseback" className="sales-btn sales-btn--white">
  Learn More
</Link>
```

`Link` is already imported in `Sales.jsx:11`, so no new import is needed.

---

## Section-by-section content design

### 1. `lb-hero` — Hero

Pattern: full-viewport image background with dark overlay, animated headline, eyebrow, tagline, and a thin divider — modeled on `ac-hero` (`AircraftConsulting.jsx:260`).

- **Background image:** CMS-driven via `usePageImages('leaseback')` — section id `lb-hero`. Default image: `/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg` (existing asset, wide editorial shot). No new image asset required.
- **Dark overlay:** `linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)` matching sibling-page heroes.
- **Eyebrow:** `EARN WHILE YOU OWN` — Share Tech Mono, uppercase, letter-spacing ~`0.3em`, color `#faf9f6`. Matches the eyebrow on the source card.
- **Headline:** `LEASEBACK PROGRAM` rendered as two animated words (each its own `motion.span`, staggered ~80ms apart, fade-up from `y: 24px`). Lighter than R66's letter-by-letter treatment but on-brand.
- **Tagline:** single line beneath the headline: *"Put your aircraft to work when you're not flying."* (mirrors the card body, which the user has already validated as on-brand copy).
- **Divider line** + short subtitle paragraph (one or two short editorial sentences).
- **No stat badges.** Stat badges belong to aircraft pages; this is a service page.
- **Scroll behaviour:** hero opacity / scale tied to `useScroll` + `useTransform` exactly as in `r66-hero` and `ac-hero` (fade out from 100% → 0 over the first half of scroll).

### 2. `lb-intro` — What is Leaseback

Pattern: two-column on desktop, single column on mobile, modeled on `ac-intro` (`AircraftConsulting.jsx:351`).

- **Left column:**
  - Eyebrow: `THE PROGRAM`
  - Heading: short 2–4 word tagline (e.g. *"A second life for your aircraft."*)
  - Body: 2 short paragraphs of plain-language explanation. ~50–80 words total. No marketing puff — match the editorial tone of `ac-intro`.
- **Right column:**
  - A small editorial card containing a single short pull-quote or stat. e.g. *"Charter and training operations turn idle ownership cost into productive revenue."* Styled with a thin top rule and Share Tech Mono caption.
- **Background:** warm white `#faf9f6`.

### 3. `lb-how` — How It Works (3 steps)

Pattern: editorial process row, modeled on `ac-process` (`AircraftConsulting.jsx:486`).

- Section eyebrow: `THE PROCESS`. Section heading: short.
- Three numbered steps `01 / 02 / 03`. Numbers in Share Tech Mono, large (~64px desktop / ~40px mobile), light-gray `#7a7a7a`.
- Each step: number, 2–3 word title, 1-sentence description.
- **Step copy (placeholder — admin-editable in code):**
  - **01 — Aircraft Assessment.** Independent valuation, hours, and condition review.
  - **02 — Operating Agreement.** Revenue split, scheduling, and insurance terms agreed in writing.
  - **03 — Earn While You Own.** HQ flies and maintains the aircraft on your behalf, you receive monthly statements.
- **Layout:** vertical stack on mobile, horizontal three-column row on desktop, with thin connecting rules between columns.
- **Background:** charcoal `#1a1a1a` for contrast against the surrounding warm-white sections (matches the dark-section authority pattern noted in the `AircraftConsulting.jsx` header docstring).

### 4. `lb-benefits` — Four Benefits Grid

- Section eyebrow: `WHY LEASEBACK`. Section heading: short.
- 2×2 grid on desktop, 1-column on mobile.
- Each card: small inline-SVG icon (use the existing green-check / geometric-mark visual language from the source card — single-color icon, ~24px), title, 1-sentence body.
- **Benefit copy (placeholder — admin-editable in code):**
  - **Offset Ownership Costs.** Charter and training revenue offsets fixed costs like insurance and hangarage.
  - **Professional Management.** HQ-employed pilots, scheduled maintenance, and full operational oversight.
  - **Insurance & Liability Handled.** Commercial cover and operating liability sit with HQ during leaseback hours.
  - **Transparent Reporting.** Monthly statements showing flight hours, revenue, and aircraft status.
- **Background:** warm white `#faf9f6`.

### 5. `lb-aircraft` — Eligible Aircraft Strip

- Section eyebrow: `ELIGIBLE AIRCRAFT`. Section heading: short.
- Three editorial cards in a horizontal row on desktop (1-column on mobile, no horizontal scroll).
- **Each card** is a full `<Link>` block:
  - Image (CMS-driven via single `lb-aircraft` `cards`-type section with three slots — see "CMS image sections" below).
  - Eyebrow: `PISTON` (R44) / `TURBINE` (R66) / `TURBINE` (Hughes 500).
  - Aircraft name in Space Grotesk display weight.
  - One-line role description.
  - Trailing `→` arrow that animates right on hover.
- **Cards link to:** `/aircraft/r44`, `/aircraft/r66`, `/aircraft/h500` (all three routes already exist in `App.jsx`).
- **Background:** warm white `#faf9f6`.

### 6. `FooterMinimal`

Site-standard footer, no special treatment.

---

## CMS image sections

Two new entries added to the `SECTIONS` array in `src/lib/imageSections.js` under a new `// ─── LEASEBACK PAGE` block. Both belong to `page: 'leaseback'`.

- **`lb-hero`** — `type: 'single'`. Default `/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg`.
- **`lb-aircraft`** — `type: 'cards'`. Three fixed slots, slide labels `['Robinson R44', 'Robinson R66', 'Hughes 500']`. Defaults:
  - R44 → `/assets/images/new-aircraft/r44/r44-raven-ii-ghagl.jpg`
  - R66 → `/assets/images/new-aircraft/r66-turbine.webp`
  - H500 → `/assets/images/aircraft/h500/h500-flight-1.jpg`

All four default paths refer to existing assets verified by `find` against `/public/assets/images/`. The implementation plan must re-verify the paths before referencing them and substitute equivalent existing assets if any are missing at implementation time.

---

## Brand tokens (reference, not new tokens)

Existing site tokens, used directly:

- Background warm white: `#faf9f6`
- Charcoal text: `#1a1a1a`
- Mid-gray: `#4a4a4a`
- Light-gray: `#7a7a7a`
- Display font: `Space Grotesk`
- Mono font: `Share Tech Mono`

No new design tokens introduced.

---

## Out of scope

The following are **explicitly out of scope** for this page:

- **No CTA buttons.** No "Enquire" button, no inline contact form, no smooth-scroll-to-form. The page is purely educational.
- **No FAQ section.** `useFaqs` is not imported.
- **No revenue calculator.** Numbers and hypothetical earnings are not modeled on this page.
- **No new shared components.** The local `LeasebackHeader` and `Reveal` wrapper are page-local copies, matching the convention of every other standalone-branded page.
- **No new image assets required for launch.** Hero and aircraft-strip images reference existing assets in `/public/assets/images/` via newly-registered CMS sections (see "CMS image sections" above).
- **No SEO meta tags.** Sibling branded pages do not use `react-helmet`; this page matches that convention.

---

## Acceptance criteria

- Visiting `/leaseback` directly renders the new page with no console errors.
- Clicking "Learn More" on the Leaseback card on `/sales/new` navigates to `/leaseback` via React Router (no full page reload).
- Page renders cleanly on viewport widths 360px, 768px, 1024px, 1440px, 1920px — no horizontal scroll on any breakpoint.
- The header burger menu opens and closes the `HqMenuPanel` exactly as on `/sales/new` and `/aircraft/r66`.
- Each of the three eligible-aircraft cards on `lb-aircraft` navigates to its respective aircraft page.
- All five content sections render with their reveal animations on scroll into view.
- Admin click-to-edit (`useCmsHighlight`) lights up content on the page when the admin edit mode is active, matching sibling-page behaviour.
- No new lint errors introduced.

---

## File summary

- **New file:** `src/pages/Leaseback.jsx` — single-file page, ~350–450 lines including inline `<style jsx>` block.
- **Modified:** `src/App.jsx` — one new import and one new `<Route>` line.
- **Modified:** `src/pages/Sales.jsx` — change one `<a>` to `<Link>` at line 1457.
- **Modified:** `src/lib/imageSections.js` — add two new `SECTIONS` entries (`lb-hero`, `lb-aircraft`) under a new `// ─── LEASEBACK PAGE` block.

No other files touched.
