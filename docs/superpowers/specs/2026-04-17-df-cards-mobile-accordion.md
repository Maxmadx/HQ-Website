# df-cards Mobile Accordion

**Date:** 2026-04-17  
**File:** `src/pages/DiscoveryFlight.jsx`  
**Breakpoint:** `≤1024px` (tablets and phones)

---

## Overview

On desktop, `df-cards` displays aircraft side-by-side with a featured card scaled slightly larger. On mobile/tablet this layout collapses to a vertical stack that loses brand identity. This spec replaces the current plain vertical stack with a tap-to-expand accordion that follows the Luxury Minimal Aviation brand (`#1a1a1a` / `#faf9f6`, Space Grotesk + Share Tech Mono).

---

## Design Decisions

| Decision | Choice |
|---|---|
| Layout | Tap-to-expand accordion |
| Default open card | R22 (`id: 'r22'`) |
| Open behaviour | Auto-close — only one card open at a time |
| State model | Approach B: separate `openCard` state, booking state unchanged |
| Selected-but-collapsed | Black booking strip at bottom of card |
| Breakpoint | `≤1024px` |

---

## State Model

### New state — `openCard`

Add inside `ValuePropSection` (the component that owns `selectedCard`):

```js
const [openCard, setOpenCard] = useState(null);
```

**Initialisation:** On mount, if the viewport is ≤1024px, set `openCard` to `'r22'`. Use a `useEffect` with a `matchMedia` check. Also add a resize listener so that navigating to desktop (>1024px) resets `openCard` to `null` (prevents stale open state bleeding into desktop layout).

```js
useEffect(() => {
  const mq = window.matchMedia('(max-width: 1024px)');
  if (mq.matches) setOpenCard('r22');
  const handler = (e) => { if (!e.matches) setOpenCard(null); };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}, []);
```

### Existing state — `selectedCard` + `selectedTime`

No changes. These continue to be set only when the user taps a duration row via `handleTimeSelect`. Switching accordion panels does not modify them.

### Header tap handler

```js
const handleAccordionToggle = (id) => {
  setOpenCard(prev => prev === id ? null : id);
};
```

Tapping an open card's header collapses it (sets `openCard` to `null`). Tapping a closed card's header opens it and auto-closes any other.

---

## Visual Design

### Collapsed card header

Horizontal flex row:

```
[ thumbnail (46×38px radial-gradient bg) ] [ meta ] [ chevron ]
```

**Meta column:**
- If `aircraft.featured`: "RECOMMENDED" pill (`background: #1a1a1a`, `color: #fff`, `font-size: 0.38rem`, Space Grotesk 700, uppercase, `border-radius: 10px`) above the name — always visible even when collapsed.
- Aircraft name — Space Grotesk 700, `0.65rem`, `#1a1a1a`
- From-price — Share Tech Mono, `0.52rem`, `#888`, text: `from £{aircraft.priceFmt[30]}`

**Chevron:** `▼`, `color: #aaa`, rotates 180° with CSS `transform: rotate(180deg)` when open. Color becomes `#1a1a1a` when open.

### Expanded card body

Revealed below the header (framer-motion `AnimatePresence` + `motion.div` with `initial={{ height: 0, opacity: 0 }}` → `animate={{ height: 'auto', opacity: 1 }}`):

- Description text — Space Grotesk, `0.5rem`, `#888`, `line-height: 1.5`
- Seats label — Space Grotesk, `0.42rem`, uppercase, `letter-spacing: 0.1em`, `#bbb`
- Two pricing rows (30 min / 60 min) — same structure as desktop `.df-card__time`:
  - Left: duration label + description (Share Tech Mono / Space Grotesk)
  - Right: price in Share Tech Mono
  - Selected state: `background: #1a1a1a`, all text `#fff`
  - `onClick={() => handleTimeSelect(aircraft.id, 30|60)}`
- Book Now button — same classes as desktop `.df-card__btn` / `.df-card__btn.active`

### Selected-but-collapsed booking strip

When `selectedCard === aircraft.id && selectedTime` AND the card is collapsed (`openCard !== aircraft.id`), render a strip **between** the header and the card's bottom edge (appended inside the card, after the header):

```
[ R44 · 30 min · £399 ]  [ Book Now ]
```

- Background: `#1a1a1a`
- Left text: Share Tech Mono, `0.42rem`, `#fff`, `letter-spacing: 0.05em`
  - Format: `{t(sectionForAircraft[aircraft.id], 'name')} · {selectedTime} min · {aircraft.priceFmt[selectedTime]}`
- Book Now button: Space Grotesk 700, `0.4rem`, uppercase, `background: #fff`, `color: #1a1a1a`, `border-radius: 8px`, `padding: 2px 7px`
  - `onClick={() => handleBook(aircraft.id)}`

The strip is invisible when the card is expanded (Book Now button is visible in the body instead).

### Card borders

- Default: `border: 1px solid #e8e6e2`, `border-radius: 12px`
- Featured (`aircraft.featured === true`): `border: 2px solid #1a1a1a` always (even when collapsed)
- No `transform: scale()` — flat on mobile

---

## CSS Changes (≤1024px)

Replace the current mobile block for `.df-cards` and `.df-card` variants with:

```css
@media (max-width: 1024px) {
  .df-cards {
    flex-direction: column;
    min-height: auto;
    gap: 10px;
    padding: 1rem 0 0;
  }

  .df-cards > * {
    flex: none;
    width: 100%;
  }

  .df-card,
  .df-card--featured,
  .df-cards.has-focus .df-card--featured,
  .df-cards.has-focus .df-card--focused {
    flex: none;
    transform: none;
    width: 100%;
    margin-bottom: 0;   /* gap on .df-cards handles spacing */
  }

  .df-card--featured {
    border: 2px solid #1a1a1a;
  }
}
```

Add new classes for the accordion elements (inside the `<style>` tag in the JSX):

```css
/* Accordion header — mobile only */
.df-card__acc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  cursor: pointer;
  user-select: none;
}

.df-card__acc-thumb {
  width: 50px;
  height: 42px;
  flex-shrink: 0;
  background: radial-gradient(circle at center, #f4f3f0 0%, #fff 80%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.df-card__acc-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.df-card__acc-meta {
  flex: 1;
  min-width: 0;
}

.df-card__acc-rec {
  display: inline-block;
  background: #1a1a1a;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.38rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 10px;
  margin-bottom: 3px;
}

.df-card__acc-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: #1a1a1a;
  display: block;
}

.df-card__acc-from {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #888;
  margin-top: 2px;
  display: block;
}

.df-card__acc-chevron {
  font-size: 0.55rem;
  color: #aaa;
  flex-shrink: 0;
  transition: transform 0.25s ease, color 0.25s ease;
}

.df-card__acc-chevron--open {
  transform: rotate(180deg);
  color: #1a1a1a;
}

/* Booking strip — collapsed selected card */
.df-card__acc-strip {
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
}

.df-card__acc-strip-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.45rem;
  color: #fff;
  letter-spacing: 0.05em;
}

.df-card__acc-strip-btn {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.42rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: #fff;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  padding: 3px 9px;
  cursor: pointer;
}
```

---

## JSX Structure — Mobile Card (≤1024px)

The `ValuePropSection` component uses `isMobile` (derived from `openCard !== null || window.matchMedia('(max-width: 1024px)').matches`) to conditionally render the accordion header in place of the existing card structure, or keep the same structure and use CSS to hide/show parts.

**Recommended approach:** use a single JSX structure with conditional rendering gated on a `isMobile` boolean derived from the `matchMedia` check (stored in state alongside `openCard`).

```jsx
const [isMobile, setIsMobile] = useState(false);
const [openCard, setOpenCard] = useState(null);

useEffect(() => {
  const mq = window.matchMedia('(max-width: 1024px)');
  setIsMobile(mq.matches);
  if (mq.matches) setOpenCard('r22');
  const handler = (e) => {
    setIsMobile(e.matches);
    if (!e.matches) setOpenCard(null);
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}, []);
```

Each card then renders:

```jsx
{isMobile ? (
  // ACCORDION LAYOUT
  <div className={`df-card ...`}>
    <div className="df-card__acc-header" onClick={() => handleAccordionToggle(aircraft.id)}>
      <div className="df-card__acc-thumb"><img src={aircraft.image} alt={aircraft.name} /></div>
      <div className="df-card__acc-meta">
        {aircraft.featured && <span className="df-card__acc-rec">Recommended</span>}
        <span className="df-card__acc-name">{t(sectionForAircraft[aircraft.id], 'name')}</span>
        <span className="df-card__acc-from">from {aircraft.priceFmt[30]}</span>
      </div>
      <span className={`df-card__acc-chevron ${openCard === aircraft.id ? 'df-card__acc-chevron--open' : ''}`}>▼</span>
    </div>

    {/* Booking strip — only when selected but collapsed */}
    {selectedCard === aircraft.id && selectedTime && openCard !== aircraft.id && (
      <div className="df-card__acc-strip">
        <span className="df-card__acc-strip-text">
          {t(sectionForAircraft[aircraft.id], 'name')} · {selectedTime} min · {aircraft.priceFmt[selectedTime]}
        </span>
        <button className="df-card__acc-strip-btn" onClick={() => handleBook(aircraft.id)}>
          Book Now
        </button>
      </div>
    )}

    {/* Expanded body — animated */}
    <AnimatePresence>
      {openCard === aircraft.id && (
        <motion.div
          key="body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div className="df-card__content">
            {/* existing header, pricing rows, and button markup unchanged */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
) : (
  // DESKTOP LAYOUT — existing markup, unchanged
  <motion.div className={`df-card ...`} whileHover={{ y: -4 }}>
    {/* existing desktop markup */}
  </motion.div>
)}
```

---

## What Does Not Change

- Desktop layout (`>1024px`) — no modifications whatsoever
- `handleTimeSelect`, `handleBook`, `selectedCard`, `selectedTime` logic
- Checkout navigation
- The `has-focus` class on `.df-cards` (still applied, used by desktop CSS only)
- `Reveal` animation wrappers (retained around each card)
- CMS `data-cms-section` attribute

---

## Out of Scope

- The instructor section, steps, FAQ, or any other section on the page
- Any other page than `DiscoveryFlight.jsx`
