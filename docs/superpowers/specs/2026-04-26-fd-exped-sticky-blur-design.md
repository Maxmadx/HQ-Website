# Home Page (Experimentation) Expeditions → Sales Sticky-Blur Transition — Design Spec

**Date:** 2026-04-26
**Author:** Brainstorm session
**Status:** Awaiting user approval
**Scope:** `src/pages/Experimentation.jsx` only (the page mounted at `/` — the actual home page per `App.jsx:261`). No other pages touched.

## Summary

Add a desktop-only sticky-blur transition between the Expeditions section (`.fd-exped`) and the Sales parallax that follows it on the home page. When `.fd-exped`'s bottom reaches the viewport bottom while scrolling, the section pins; the next sibling — the Sales `<ParallaxSection>` — then rises over the pinned Expeditions in normal document flow while Expeditions progressively blurs and a black overlay fades in. The pattern mirrors the variants→specs transition on `/aircraft/r66`.

## Goals

- Add a high-end, cinematic transition into the Sales section that matches the visual language of the R66 page.
- Match R66's pacing exactly (10px max blur, ease-in `pow(progress / 0.95, 8)`).
- Ship without disturbing the rest of the home page or any other route.

## Non-Goals

- Mobile transitions. The effect is desktop-only (≥ 901px). Below that, the page scrolls as it does today.
- Touching any other page or any non-Sales/Expeditions section on the home page.
- Animating the rising Sales parallax itself. It just rises in the natural flow; no scroll-driven transforms applied to it.
- Refactoring the existing R66 implementation. We mirror its mechanism but do not extract a shared component.

## Behavior (Desktop ≥ 901px)

1. Page scrolls normally until `.fd-exped`'s bottom touches the viewport bottom.
2. From that point, `.fd-exped` is **pinned** (`position: sticky` with a negative `top` chosen so the pin happens at the bottom-of-viewport).
3. As scrolling continues, the next sibling — the Sales `<ParallaxSection>` (the one with the giant "SALES" parallax hero) — **rises over** the pinned Expeditions in the natural DOM flow. No transforms are applied to the parallax itself.
4. While the parallax rises, two effects ramp on the pinned Expeditions:
   - **Blur:** `0 → 10px` linearly with progress.
   - **Darken:** A `rgba(0, 0, 0, 1)` overlay fades from `0` to a max opacity of `0.55`, eased by `pow(progress / 0.95, 8)` (matches R66).
5. When the Sales parallax fully covers `.fd-exped`, sticky naturally releases at `.fd-exped`'s block bottom and the rest of the page (`fd-sales`, `fd-maintenance`, etc.) scrolls normally.
6. Below 901px viewport width: no sticky, no blur, no overlay. Standard scroll.

## Mechanism

Mirrors the variants→specs transition in `src/pages/AircraftR66.jsx` (lines 1267–1335 for the scroll handler; 2331–2374 / 3271–3293 for the CSS).

### CSS (added inside `<style>` block in `Experimentation.jsx`, gated by `@media (min-width: 901px)`)

The existing `.fd-exped` rule in Experimentation (around line 8129) is:

```css
.fd-exped {
  background: transparent;
  position: relative;
  z-index: 1;
}
```

The new media-query block is appended **after** that rule (and before `.fd-exped__glow`). The desktop branch overrides `position: relative` to `position: sticky`. `z-index: 1` is retained — sticky still establishes a stacking context, so the rising parallax needs `z-index: 3` to appear above. The transparent background is fine (the rising parallax sits above and is opaque).

```css
@media (min-width: 901px) {
  .fd-exped {
    position: sticky;
    top: var(--fd-exped-stick-top, 0);
    filter: blur(var(--fd-exped-blur, 0px));
    will-change: filter;
  }

  .fd-exped::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 1);
    opacity: var(--fd-exped-darken, 0);
    pointer-events: none;
    z-index: 2;
  }

  /* Next sibling — the Sales ParallaxSection — must stack above the pinned, blurred Expeditions */
  .fd-exped + .parallax-section,
  .fd-exped + section.parallax-section,
  .fd-exped + .parallax-section-wrapper {
    position: relative;
    z-index: 3;
  }
}
```

The exact next-sibling selector will be confirmed during implementation by inspecting the rendered class on `<ParallaxSection>` (the component already exists; we only need its outermost class). If `<ParallaxSection>` renders with a different root class, the rule is updated to that class. The intent — "make the immediate next sibling stack above" — is unchanged.

### JavaScript (one new `useEffect` in the `Experimentation` component, near other scroll-driven hooks)

```jsx
useEffect(() => {
  if (typeof window === 'undefined') return;

  const section = document.querySelector('.fd-exped');
  if (!section) return;

  const MAX_BLUR = 10;
  const MAX_DARKEN = 0.55;
  const FADE_COMPLETE = 0.95;
  const MEDIA = window.matchMedia('(min-width: 901px)');

  // Defensive: prefer the actual next sibling, but fall back to a query if the
  // adjacent element is unexpectedly something other than the Sales parallax.
  const findRisingSection = () => {
    const next = section.nextElementSibling;
    if (next && (next.classList.contains('parallax-section') ||
                 next.querySelector?.('.parallax-section'))) return next;
    // Fallback: the parallax that immediately precedes #sales.
    const sales = document.getElementById('sales');
    if (!sales) return next;
    let prev = sales.previousElementSibling;
    return prev || next;
  };

  const setStickTop = () => {
    if (!MEDIA.matches) {
      section.style.removeProperty('--fd-exped-stick-top');
      return;
    }
    const vh = window.innerHeight;
    const h = section.offsetHeight;
    section.style.setProperty('--fd-exped-stick-top', `${Math.min(0, vh - h)}px`);
  };

  const onScroll = () => {
    if (!MEDIA.matches) {
      section.style.setProperty('--fd-exped-blur', '0px');
      section.style.setProperty('--fd-exped-darken', '0');
      return;
    }
    const next = findRisingSection();
    if (!next) return;
    const vh = window.innerHeight;
    const rect = next.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / vh));
    const adjusted = Math.min(1, progress / FADE_COMPLETE);
    const darken = Math.pow(adjusted, 8) * MAX_DARKEN;

    section.style.setProperty('--fd-exped-blur', `${progress * MAX_BLUR}px`);
    section.style.setProperty('--fd-exped-darken', `${darken}`);
  };

  const onResize = () => { setStickTop(); onScroll(); };
  const onMediaChange = () => { setStickTop(); onScroll(); };

  setStickTop();
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  MEDIA.addEventListener('change', onMediaChange);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    MEDIA.removeEventListener('change', onMediaChange);
  };
}, []);
```

Notes:
- `section.nextElementSibling` is the rising element (the Sales `<ParallaxSection>`). If a stray comment node or wrapper is introduced later, the lookup is via `nextElementSibling` (not `nextSibling`), so comment nodes are skipped.
- The mobile branch zeroes the CSS vars so a resize from desktop → mobile during interaction cannot leave the section blurred or darkened.

### Numerical constants

| Constant | Value | Rationale |
|---|---|---|
| `MAX_BLUR` | `10px` | Matches R66 (`AircraftR66.jsx` line 776 / 1311 (R66 reference page is unchanged)). |
| `MAX_DARKEN` | `0.55` | Strong enough to read as "much darker" without going fully opaque before the rising section covers Expeditions. |
| `FADE_COMPLETE` | `0.95` | Matches R66 (`AircraftR66.jsx` line 810). Keeps the section nearly clear for most of the scroll, then ramps fast at the end. |
| Easing | `pow(adjusted, 8)` | Matches R66. Ease-in power curve. |

## Affected Files

- `src/pages/Experimentation.jsx` — add CSS rules inside the existing `<style>` block (near `.fd-exped` rule at line 8129), and add one new `useEffect` near the other expedition-related scroll hooks (e.g. after the globe/glow positioning effect that ends near line 2295).

No other files touched. No new components, no new exports, no new dependencies.

## Externalities Verified

- **Parent of `.fd-exped`** is the page wrapper inside `Experimentation`. No `overflow: hidden` or `transform` on the chain that would defeat sticky.
- **Preceding section** is the `scrolling-strips-wrapper` (line 3960) — untouched.
- **Following sections** (`fd-sales`, then maintenance/contact, etc.) are untouched. Once `.fd-exped`'s natural block bottom passes, sticky releases and normal flow resumes.
- **No `reveal-element` class on `.fd-exped`** in the Experimentation markup — so there is no IntersectionObserver-driven opacity reveal to interact with.
- **Existing scroll/resize handler that positions `.fd-exped__glow` and `.fd-exped__globe`** (line 2298) computes positions in document coordinates (`getBoundingClientRect() + window.scrollY`) — sticky positioning does not break that math. Glow remains pinned to the section's painted box, which is exactly the desired behaviour while the section is stuck.
- **`.fd-exped__glow` already has `filter: blur(50px)`** (line 8141). Our new `filter: blur(var(--fd-exped-blur))` on the parent composes on top. As blur ramps up, the glow becomes proportionally more diffuse — visually consistent with the section blurring out.
- **Existing `.fd-exped` `z-index: 1`** (line 8132) is preserved. The next-sibling parallax gets `z-index: 3` to stack above.
- **Fixed top nav** is in its own fixed layer; `z-index: 3` on the next sibling does not interfere with it.
- **Other sticky elements on the page** — `EditorialStrips` / `scrolling-strips-wrapper` etc. complete before `.fd-exped`. Their stacking is independent.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| `nextElementSibling` returns an unexpected element if the JSX is reorganized later | Add a defensive class check: if it doesn't have `.parallax-section`-family class, fall back to `document.querySelector` for the Sales parallax. (Implemented in plan.) |
| Reduced motion users | Wrap blur + overlay in `@media (prefers-reduced-motion: no-preference)` so users with reduced motion get the sticky pin without the visual effects. |
| Resize from desktop → mobile mid-scroll leaves stale CSS vars | The scroll handler's mobile branch explicitly zeroes the vars, and the matchMedia change listener re-runs `setStickTop` and `onScroll`. |
| `position: sticky` overlap with z-indexed children inside `.fd-exped` (e.g., the cinematic overlay at line 4961) | The overlay `::after` uses `z-index: 2` on `.fd-exped` itself (which becomes a stacking context). The interior content keeps its existing z-indexes; the overlay is on top because it's an `::after` of `.fd-exped`, not of the children. |

## Testing Plan

Manual verification on `/` (home) at desktop viewport (≥ 1280px):

1. Scroll down past the hero. Expeditions enters view normally.
2. Continue scrolling — when `.fd-exped`'s bottom reaches the viewport bottom, the section pins and the Sales parallax begins to rise over it from the bottom.
3. As the parallax rises, the visible portion of `.fd-exped` blurs and darkens.
4. When the parallax fully covers `.fd-exped`, scrolling continues into `.fd-sales` content normally.
5. Scroll back up — effect reverses cleanly (no flicker, no stuck blur).

Resize verification:

6. At 1200px wide, effect is on. Drag window down to 800px wide — effect turns off, no visual artifact remains.
7. Drag back to 1200px — effect re-engages.

Regression check:

8. All sections after Expeditions (`fd-sales`, `fd-maintenance`, contact, footer) render and scroll normally.
9. Header nav scroll-spy continues to track the correct section as you cross the transition.
10. No console errors. No new layout shifts (CLS).

Reduced-motion verification:

11. Toggle macOS / DevTools "prefers-reduced-motion: reduce" — the section still pins (sticky is fine for vestibular concerns since it does not move) but blur/darken are skipped.

## Open Questions

None. Decision on overlay color resolved: pure black (`rgba(0, 0, 0, 1)`, max opacity 0.55).

## Out of Scope (Explicit)

- Equivalent transitions on other home-page section boundaries.
- Refactoring R66 + Experimentation to share a `useStickyBlur` hook. (Worth considering later, but not now — the two implementations differ in the "stick-top" math and any abstraction would need to support both.)
- Mobile equivalent treatment. Mobile keeps the existing scroll behavior unchanged.
