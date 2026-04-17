# Mobile Nav Burger Reveal — Design Spec

**Date:** 2026-04-17  
**File:** `src/pages/Experimentation.jsx`  
**Scope:** Mobile only (`max-width: 640px`)

---

## Overview

When the user scrolls into the Clubhouse section on mobile, the sticky `fd-nav` accordion bar hides automatically (existing behaviour). This feature adds a `.hq-menu-btn` burger button that appears inside the right side of that nav bar when it hides, allowing the user to manually reveal the nav again.

---

## State

Two additions to the `Experimentation` component:

- `navManuallyShown` (bool, default `false`) — user-overridden nav visibility
- `useEffect` watching `navHidden`: resets `navManuallyShown → false` when `navHidden` becomes `false` (user scrolled away from clubhouse)

---

## Class Logic

| Condition | Classes on `<nav>` |
|---|---|
| Not at clubhouse | `fd-nav` (+ compact if applicable) |
| At clubhouse, nav hidden | `fd-nav fd-nav--hidden fd-nav--clubhouse` |
| At clubhouse, burger clicked | `fd-nav fd-nav--clubhouse` (hidden removed) |

```jsx
<nav className={`fd-nav 
  ${navCompact ? 'fd-nav--compact' : ''} 
  ${navHidden && !navManuallyShown ? 'fd-nav--hidden' : ''}
  ${navHidden ? 'fd-nav--clubhouse' : ''}`}
  ref={navRef}>
```

---

## DOM Structure

The existing nav content is wrapped in `<div className="fd-nav__content">`. The burger button is added as a sibling before it, inside the nav:

```jsx
<button
  className={`fd-nav__burger hq-menu-btn ${navManuallyShown ? 'open' : ''}`}
  onClick={() => setNavManuallyShown(v => !v)}
  aria-label="Toggle navigation"
>
  <span></span><span></span><span></span>
</button>

<div className="fd-nav__content">
  {/* existing fd-nav__header + fd-nav__accordion — unchanged */}
</div>
```

---

## CSS Changes (inline styles in Experimentation.jsx)

### 1. `fd-nav--hidden` — hide content only, not the bar

```css
/* REMOVE these from .fd-nav--hidden: */
/* opacity: 0; pointer-events: none; */

/* ADD: */
.fd-nav--hidden .fd-nav__content {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
```

### 2. Burger button — hidden by default, visible on mobile when clubhouse active

```css
.fd-nav__burger {
  display: none;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 101;
}

@media (max-width: 640px) {
  .fd-nav--clubhouse .fd-nav__burger {
    display: flex;
  }
}
```

### 3. No change to `.hq-menu-btn` CSS

The existing open/close X animation (from `navigation.css`) applies automatically via the `open` class toggle.

---

## Behaviour Summary

1. User scrolls into clubhouse on mobile → `navHidden = true` → nav content fades out, burger appears right side of bar
2. User taps burger → `navManuallyShown = true` → nav content fades back in, burger shows as X
3. User taps X → `navManuallyShown = false` → nav content fades out again
4. User scrolls away from clubhouse → `navHidden = false` → `navManuallyShown` resets to `false`, nav shows normally

---

## Files Changed

- `src/pages/Experimentation.jsx` — state, class logic, DOM structure, CSS
