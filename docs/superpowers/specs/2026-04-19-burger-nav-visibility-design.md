# Burger Menu & fd-nav Visibility Design

**Date:** 2026-04-19  
**Files:** `src/pages/Experimentation.jsx`, `src/pages/HeroSectionFinalTesting.jsx`

---

## Problem

The burger button (`fd-header-burger`) on the home page is currently only visible on mobile when the `fd-nav` disappears during the clubhouse section. This leaves gaps:

- No burger visible when header has faded in but `fd-nav` hasn't reached its sticky position yet
- On mobile, no burger guarantee once past the hero section
- No way to close the `fd-nav` once it's stuck (no X available)
- Clicking the burger doesn't scroll to the nav — it just toggles a hidden state

---

## Scroll Lifecycle (context)

| Phase | Scroll position | fd-nav state | Current burger |
|-------|----------------|--------------|----------------|
| Hero | ~0–35% vh | Below viewport | Hidden (header transparent) |
| Hero fade-in | ~35–60% vh | Below viewport | Hidden (opacity: 0 on btn) |
| Post-hero, pre-stuck | 60% vh → nav stick point | In flow, visible | Hidden |
| fd-nav stuck | Past stick point | Sticky at top: 49px | Hidden (desktop) / Visible (mobile clubhouse only) |
| fd-nav compact | 200px past stuck | "Explore" header faded | Same |
| Mobile: clubhouse | Clubhouse in view | Hidden (max-height: 0) | Visible (current behaviour) |

---

## New Behaviour

### Burger visibility

**Always visible once the header has faded in.** The header's own `opacity` animation (0→1 during hero scroll-through) gates visibility — the burger inherits the header's opacity since it lives inside it.

Implementation: change `fd-header-burger.hq-menu-btn` default from `opacity: 0; pointer-events: none` to `opacity: 1; pointer-events: auto`. Remove the `fd-header-burger--visible` toggle mechanism.

### Burger icon state

`navIsVisible = (!navHidden || navManuallyShown) && !navManuallyClosed`

- **X (open)** when `navIsVisible` — nav is showing
- **Hamburger** when `!navIsVisible` — nav is hidden or closed

### Click handler

```
if (navRect.top > 54):        // above stick point
  → smooth scroll to stick point: window.scrollY + navRect.top - 49

else (nav is at sticky position):
  if visible → close nav
    - if navHidden context: clear navManuallyShown
    - otherwise: set navManuallyClosed = true
  if hidden → open nav
    - if navManuallyClosed: clear navManuallyClosed
    - if navHidden: set navManuallyShown = true
```

The `54px` threshold (sticky `top: 49px` + 5px buffer) distinguishes "nav is stuck" from "nav is still approaching its stick point".

### fd-nav hidden condition

`(navHidden && !navManuallyShown) || navManuallyClosed`

The `fd-nav--hidden` CSS rule must apply on **all screen sizes** (remove the existing `@media (max-width: 768px)` wrapper) so manual close works on desktop.

---

## New State

Both live in `Experimentation.jsx`:

| State | Initial | Set by |
|-------|---------|--------|
| `navIsStuck` | `false` | Compact-nav `useEffect` — same `isStuck` boolean already computed there |
| `navManuallyClosed` | `false` | `handleBurgerClick` |

**Reset rule:** when `navIsStuck` becomes `false` (user scrolls back above the nav's natural position), `navManuallyClosed` resets to `false` via a `useEffect` dependency on `navIsStuck`.

---

## Props Changes

### `HeroSectionFinalTesting`

Add props: `navIsStuck: boolean`, `navManuallyClosed: boolean`  
Change `onToggleNav` from inline arrow to `handleBurgerClick` defined in parent.

### `TestingHeader`

Add props: `navIsStuck: boolean`, `navManuallyClosed: boolean`  
Derive `navIsVisible` locally and use it for the `.open` class on the burger.

---

## CSS Changes

### In `Experimentation.jsx` inline `<style>`:

```css
/* Before */
.fd-header-burger.hq-menu-btn {
  opacity: 0;
  pointer-events: none;
  ...
}
.fd-header-burger--visible.hq-menu-btn {
  opacity: 1;
  pointer-events: auto;
}

/* After */
.fd-header-burger.hq-menu-btn {
  opacity: 1;
  pointer-events: auto;
  /* fd-header-burger--visible class no longer needed */
}
```

```css
/* Before */
.fd-nav { /* no overflow/max-height/transition */ }
@media (max-width: 768px) {
  .fd-nav {
    overflow: hidden;
    max-height: 300px;
    transition: max-height 0.6s ease, opacity 0.6s ease, ...;
  }
  .fd-nav--hidden {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }
}

/* After — promote to base rule so desktop close also animates */
.fd-nav {
  overflow: hidden;
  max-height: 300px;
  transition: max-height 0.6s ease, opacity 0.6s ease,
              border-top-color 1.2s ease, box-shadow 0.3s ease;
}
/* fd-nav--hidden no longer needs a media query */
.fd-nav--hidden {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}
/* Remove the old @media (max-width: 768px) block that duplicated these */
```

---

## What Does NOT Change

- The `fd-nav` sticky positioning (`position: sticky; top: 49px`)
- The `navHidden` / `navManuallyShown` logic (mobile clubhouse hide/show still works as before)
- The compact-nav (Explore header fade) logic
- The `fd-nav--compact` behaviour
- The header spotlight animation
- All other pages (these components are only used in `Experimentation.jsx`)
