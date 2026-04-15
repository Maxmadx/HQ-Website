# Horizontal Scroll on Vertical Scroll (Mobile)

## Approved Component - Scroll-Jacking Pattern

Works on mobile touch devices using CSS `position: sticky` + JS `translateX`.

### Structure

```
runway (tall container, height set by JS, position: relative)
  └── sticky (position: sticky; top: centered; overflow: clip)
        └── hscroll (overflow: clip)
              └── inner (width: max-content; will-change: transform; grid single row)
                    └── cards (flex-shrink: 0; fixed width)
```

### Height Formula

```js
const totalWidth = inner.scrollWidth;
const viewportWidth = window.innerWidth;
const lastCard = inner.lastElementChild;
const cardWidth = lastCard.offsetWidth;
const centerStop = totalWidth - (viewportWidth + cardWidth) / 2;
const speedMultiplier = 3; // 3x faster scroll
const stickyH = stickyEl.offsetHeight;
runway.style.height = `${centerStop / speedMultiplier + stickyH}px`;
```

### JS Scroll Handler

```js
const offsetTop = stickyEl.offsetTop * speedMultiplier;
const overflow = totalWidth - window.innerWidth;
const clamped = Math.min(offsetTop, overflow);
inner.style.transform = `translateX(${-clamped}px)`;
```

### Key Details

- `stickyEl.offsetTop` naturally increases as user scrolls - this is the input value
- Multiply by speed factor for faster horizontal movement
- Clamp to overflow to prevent overshooting
- Use `overflow: clip` (not `hidden`) on scroller - doesn't create scroll container, doesn't break sticky
- Parent training section needs `overflow: visible` for sticky to work
- All ancestors must NOT have `overflow: hidden/auto/scroll`
- Use `{ passive: true }` on scroll listener for touch performance
- Center sticky vertically: `top = (viewportHeight - elementHeight) / 2` set via JS

### Background Image

- `position: fixed; inset: 0` covering full viewport
- Opacity fades from 0 to 1 proportional to scroll progress
- `visibility: hidden` when not in hscroll zone
- `pointer-events: none` to not block interaction
- `display: none` on desktop

### Progress Bar

- Custom HTML element (not native scrollbar - mobile browsers hide those)
- Thumb position: `translateX(pct * (trackWidth - thumbWidth))`
- 3px track, grey thumb on light background

### Why This Works on Mobile

- Uses native vertical scrolling (no scroll hijacking)
- `position: sticky` is CSS-managed, no touch event conflicts
- JS only reads `offsetTop` and writes `transform` (GPU composited)
- Scroll listener is `{ passive: true }`

### Common Pitfalls

1. `overflow: hidden` on ANY ancestor breaks `position: sticky`
2. `overflow: hidden` on scroller makes `scrollWidth === clientWidth` (use `clip`)
3. `position: fixed` blocks touch events on mobile - use `sticky` instead
4. Must re-measure after images load (card widths change)
5. `inner.offsetWidth` unreliable inside `overflow: hidden` - use `scroller.scrollWidth`
