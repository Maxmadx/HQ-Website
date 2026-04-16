# Wall of Cool — Editorial Module & Scroll Target

**Date:** 2026-04-16
**Status:** Approved

## Summary

Add an editorial split-module to `Home.jsx` in the training section that entices visitors to scroll down and view the community photo gallery (Wall of Cool). Also wire `WallOfCoolSection` into the home page as the scroll target.

---

## Placement

- **Module:** Inserted as a `sqs-block reveal-element` after the training intro paragraph (`id="helicopter-training"` section), before the training carousel.
- **Scroll target:** `WallOfCoolSection` added to `Home.jsx` above the Contact section, wrapped in `<section id="wall-of-cool">`.

---

## The Module

### Layout
Split card: left column (copy) / right column (button). Uses `display: grid; grid-template-columns: 1fr auto`. On mobile (≤580px) stacks to a single column.

### Left column
| Element | Value |
|---|---|
| Overline | `"Community · Real flights, real people"` — `Share Tech Mono`, 0.6rem, letter-spacing 0.22em, uppercase, color `#888` |
| Headline | `"See flying at HQ through our community"` — `Space Grotesk`, ~1.05rem, weight 700, uppercase, letter-spacing -0.02em |
| Body | `"First solos, scenic cross-countries, night flights — captured and shared by the pilots who fly with us every day."` — 0.82rem, color `#888`, line-height 1.65 |

### Right column
| Element | Value |
|---|---|
| Button text | `"Wall of Cool →"` |
| Button style | `hq-btn hq-btn--primary` (dark `#1a1a1a` fill, full-width in right col) |
| Button action | Smooth scroll to `#wall-of-cool` (React scroll or native `href="#wall-of-cool"` with `scroll-behavior: smooth` already on `html`) |
| Sub-label | `"Community photos · Updated regularly"` — `Share Tech Mono`, 0.58rem, color `#aaa` |

### Container styling
- Background: `#fff`
- Border: `1px solid #e8e6e2`
- Border-radius: `0` (sharp, on-brand)
- Right column background: `#faf9f6`
- Right column border-left: `1px solid #e8e6e2`
- Wrapped in `.sqs-block .sqs-block-content .reveal-element` for scroll-reveal consistency

---

## WallOfCoolSection integration

- Import `WallOfCoolSection` from `../../components/Trust/WallOfCoolSection` (already exists, no changes to the component itself)
- Wrap in `<section id="wall-of-cool">` so the scroll anchor works
- Position: immediately before the existing Contact section in `Home.jsx`

---

## Files changed

| File | Change |
|---|---|
| `src/pages/Home.jsx` | Add editorial module after training intro para; add `WallOfCoolSection` before Contact section |

No new files, no new CSS classes beyond what's already in the approved component system.

---

## Out of scope

- Changes to `WallOfCoolSection` itself
- A separate `/wall-of-cool` route
- Any changes to the admin panel
