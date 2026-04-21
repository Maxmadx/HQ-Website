# Runway SVG Background — fd-about__split-left

**Date:** 2026-04-18  
**Status:** Approved

## What

Add an inline SVG to the background of `fd-about__split-left` in `Experimentation.jsx`. The SVG depicts EGLD (Denham Aerodrome) runway 24/06 in a perspective (pilot's-eye) view — wide at the bottom receding to a vanishing point at the top — styled as a light cream/warm technical drawing with dark ink markings at 20% opacity.

## Visual Design

- **Style:** Perspective view, light cream ground (`#f0ece4`), dark ink markings (`#2a2824`)
- **Opacity:** 0.2 (whisper — ambient texture, doesn't compete with the video)
- **Runway designators:** "24" near (bottom), "06" far (top, small, ~45% opacity)
- **Markings included:**
  - Tarmac trapezoid strip (filled, `#b8b2a8`)
  - Near threshold line + 9 bars
  - Runway number "24" (Arial Black, 60px, letter-spacing 12)
  - Aiming point bars (two pairs either side of centreline, ~⅗ up)
  - Centreline dashes — ~22 dashes, perspective-scaled (small/narrow at top, large/wide at bottom)
  - Far threshold — 7 small bars
  - Runway number "06" (small, faded)

## Implementation

**File:** `src/pages/Experimentation.jsx`  
**Location:** First child of `<div className="fd-about__split-left">` (line ~3144)

```jsx
<div className="fd-about__split-left">
  {/* Runway SVG background */}
  <svg
    viewBox="0 0 400 800"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.2,
      pointerEvents: 'none',
    }}
    preserveAspectRatio="xMidYMid meet"
  >
    {/* … SVG paths … */}
  </svg>
  <div className="fd-about__video">
    …
  </div>
</div>
```

No CSS changes needed — `.fd-about__split-left` already has `position: sticky` which establishes a containing block for the absolute SVG. `overflow: hidden` is already set so the SVG won't bleed out.

## Out of scope

- Mobile (`.fd-about__split-left` is already `display:none` on mobile via existing media query)
- Animation or scroll-driven effects
- Any other page or component
