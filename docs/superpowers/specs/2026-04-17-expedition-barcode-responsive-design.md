# Spec: ExpeditionBarcode Responsive Fixes

**Date:** 2026-04-17  
**Component:** `src/components/Expeditions/ExpeditionBarcode.jsx`  
**Status:** Approved

---

## Problem

Two breakpoints cause visual/layout failures in `ExpeditionBarcode`:

1. **Below 450px** — `generateBarcode` produces 25 bars per card. At narrow card widths, this overflows the bars container and breaks the visual.
2. **Below 380px** — The side-mounted chevrons consume too much horizontal space, leaving insufficient room for the card grid. The column gap also needs tightening.

---

## Solution

### 1. Barcode bar count reduction (JS) — `<= 450px`

- Add a `useEffect` + `useState` that uses `window.matchMedia('(max-width: 450px)')` to track whether the viewport is narrow.
- Pass `length = 15` to `generateBarcode` when narrow, `length = 25` otherwise.
- The `barcodes` memo already depends on `cmsDestinations` — add the narrow flag as a dependency so it recomputes when the threshold is crossed.
- No external dependencies required.

### 2. Chevron layout and column gap (CSS) — `<= 380px`

Add a `@media (max-width: 380px)` block:

- `.exp-barcode__scroll-row`: change to `flex-direction: column; align-items: stretch`
- `.exp-barcode__scroll-chevron` row: wrap both chevrons in a centred row — `display: flex; justify-content: center; gap: 1.5rem` — by targeting the two chevron buttons as siblings at the bottom of the scroll-row via CSS order or a wrapper element.
- `.exp-barcode__grid`: reduce `gap` from `1rem` to `0.5rem`.
- Remove left/right margins from individual chevrons at this breakpoint (`margin: 0`).

**Implementation — CSS `order` approach (no DOM changes):**

Use CSS `order` on the existing three children of `.exp-barcode__scroll-row` at `<= 380px`:
- `.exp-barcode__grid-wrapper`: `order: 1; flex: 0 0 100%`
- Left chevron: `order: 2; flex: 0 0 auto`
- Right chevron: `order: 3; flex: 0 0 auto`
- Scroll-row: `flex-wrap: wrap; justify-content: center; gap: 0.75rem`

The grid-wrapper takes the full first row; both chevrons wrap onto a second centred row.

---

## Breakpoints Summary

| Breakpoint | Change |
|---|---|
| `<= 450px` | Barcode bar count: 25 → 15 |
| `<= 380px` | Chevrons centred below grid, grid gap 1rem → 0.5rem |

---

## Files Changed

- `src/components/Expeditions/ExpeditionBarcode.jsx` (only file)

---

## Out of Scope

- `ExpeditionVideoSlider.jsx` — not affected
- Any change to barcode bar widths or styling
- Any change to card thumbnail sizes
