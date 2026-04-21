# PPL Instructor Section — Mobile Layout

**Date:** 2026-04-19
**Scope:** `fppl-intro__network` inside `src/pages/FinalPPL.jsx`
**Breakpoint target:** ≤ 768px (existing mobile breakpoint)

---

## What we're changing

The instructor network section (`fppl-intro__network`) on the PPL page currently stacks lead instructor cards into a single column on mobile and centers all content. The bio sits inside the horizontal row alongside the image, which gets cramped.

The approved mobile design restructures each lead card as follows:

### Lead Instructor Card layout (mobile)

```
┌─────────────────────────────────┐
│ [Photo 72×72] │ Name            │
│               │ Title           │
│               │ 18,000+ │ 35+  │
│               │ Flt Hrs  Yrs   │
├───────────────────────────────── │  ← hairline separator
│ Full-width bio text across      │
│ entire card width               │
└─────────────────────────────────┘
```

- Card uses `flex-direction: column`
- Top section (`.a-top`) uses `flex-direction: row` — photo left, info right
- Photo: 72×72px, `object-fit: cover`, `object-position: top center`
- Bio row sits below, separated by a `border-top: 1px solid #f0f0ee`
- Left border accent (3px solid #1a1a1a) is preserved from desktop

### Supporting instructor team strip

No layout change needed — the existing `flex-wrap: wrap; justify-content: center` at 768px already works.

---

## Implementation

**File:** `src/pages/FinalPPL.jsx` — the `<style>` block at the bottom of the component (around line 2376).

Replace the existing `@media (max-width: 768px)` rules for `.fppl-intro__q-card`, `.fppl-intro__q-image`, `.fppl-intro__q-stats` with the new two-part structure:

1. **Remove:** `flex-direction: column`, `text-align: center`, `margin: 0 auto` on q-card/q-image/q-stats
2. **Add:**
   - `.fppl-intro__q-card` → `flex-direction: column; gap: 0.75rem; padding: 1rem`
   - `.fppl-intro__q-card__top` (new inner wrapper) → `display: flex; gap: 0.875rem; align-items: flex-start`
   - `.fppl-intro__q-image img` → `width: 72px; height: 72px; object-position: top center`
   - `.fppl-intro__q-bio-row` (new wrapper) → `padding-top: 0.625rem; border-top: 1px solid #f0f0ee`

Since the JSX doesn't currently have `.q-card__top` or `.q-bio-row` wrapper divs, the JSX in `FinalPPL.jsx` also needs two small structural changes:
- Wrap the image + info div pair in a `<div className="fppl-intro__q-top">`
- Wrap the `<p>` bio in a `<div className="fppl-intro__q-bio-row">`

---

## Out of scope

- No changes to desktop layout (≥ 769px)
- No changes to other sections of FinalPPL.jsx
- No changes to the supporting instructor team strip styling
