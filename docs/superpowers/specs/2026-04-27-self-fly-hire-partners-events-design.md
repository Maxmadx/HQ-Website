# Self-Fly Hire — Partners, Events & Community Wall

**Page:** `/self-fly-hire` (`src/pages/SelfFlyHire.jsx`)
**Date:** 2026-04-27
**Status:** Design — pending user review

## Goal

Add three additions to the Self-Fly Hire page that round out the "where can I take this aircraft" story already established by the existing destinations grid:

1. **Our Partners** — luxury destinations and shooting grounds HQ formally works with.
2. **Events** — UK calendar events (sporting, racing, regatta) that pilots commonly fly to.
3. **Community Wall** — drop-in of the existing `WallOfCoolGr11` component as social proof of where pilots actually fly.

Sections 1 and 2 reuse the visual pattern of the existing `sfh2-destinations` section so the page reads as one continuous "where you can go" sweep. Section 3 reuses an existing self-contained component already running on `Experimentation.jsx`.

## Placement

Insert directly after the existing `sfh2-destinations` section (currently ending at `src/pages/SelfFlyHire.jsx:591`) and before the `sfh2-enquiry` section. Order on the page, top to bottom:

1. `sfh2-destinations` (existing)
2. `sfh2-partners` (new)
3. `sfh2-events` (new)
4. `WallOfCoolGr11` (new — drop-in component)
5. `sfh2-enquiry` (existing)

No other sections move. Rationale for putting Community Wall last in the new block: it acts as social proof ("see what HQ pilots actually do") immediately before the enquiry CTA.

## Section 1 — Our Partners

### Content

- **Pre-label:** `Trusted By`
- **Heading:** `Our Partners`
- **Intro:** "We work with country estates, sporting grounds and destinations who welcome arrivals by helicopter."
- **Cards (3):**

  | Category (region slot) | Name | Location (time slot) |
  |---|---|---|
  | Shooting Ground | Holland & Holland | Northwood |
  | Restaurant      | The Hut           | Isle of Wight |
  | Shooting Ground | E.J. Churchill    | West Wycombe |

The three card fields map onto the same DOM positions used by destinations cards (`region` → category, `name` → partner name, `time` → location), so the same styles apply unchanged.

### Layout

Three cards only → **fixed 3-column desktop grid**, no horizontal scroll, no pagination dots, no footer caption. On mobile (the existing destinations breakpoint at ≤768px), partners cards **stack to a single column** — there are too few cards to justify the horizontal scroll/dots treatment used by destinations and events.

### Reveal animation

Use the same `motion.div` `whileInView` reveal as the destinations header and cards (matching opacity/translate, easing `[0.16, 1, 0.3, 1]`, staggered card delay `(i % 4) * 0.05`).

## Section 2 — Events

### Content

- **Pre-label:** `The Season`
- **Heading:** `Fly to the Calendar`
- **Intro:** "From the Festival to the Regatta, we fly clients straight to the day."
- **Cards (11):**

  | Region (region slot) | Event (name slot) | Month (time slot) |
  |---|---|---|
  | Berkshire        | Royal Ascot                     | June       |
  | Oxfordshire      | Henley Royal Regatta            | July       |
  | West Sussex      | Goodwood Festival of Speed      | July       |
  | West Sussex      | Glorious Goodwood               | August     |
  | Gloucestershire  | Cheltenham Festival             | March      |
  | Merseyside       | Grand National (Aintree)        | April      |
  | Surrey           | Epsom Derby                     | June       |
  | Suffolk          | Newmarket Racing                | May–Oct    |
  | Yorkshire        | York Racecourse                 | May–Oct    |
  | Surrey           | Sandown Park                    | Year-round |
  | Berkshire        | Newbury Racecourse              | Year-round |

The third field is **month/season**, not flight time (decision: flight time is already established by the destinations section above; month adds new useful info).

### Layout

11 cards → reuse the existing destinations layout exactly:

- Desktop: 4-column grid (last row partial), no scroll.
- Mobile (≤768px): horizontal scroll with snap, 2 rows × 2 columns per viewport, dot pagination underneath.

### Pagination state

Mirror the existing pattern:

```js
const [eventsPage, setEventsPage] = useState(0);
const eventsGridRef = useRef(null);
const EVENTS_PAGES = Math.ceil(EVENTS.length / 4); // 4 per page on mobile
```

`onScroll` handler and dot `onClick` handler are direct copies of the destinations equivalents with the new ref/state names.

### Footer caption

Add a `sfh2-events__footer` line: `"Plus the rest of the calendar — let us know your day."` (mirrors the existing destinations footer treatment).

## Implementation Notes

### Data

Add two new module-scope constants alongside `DESTINATIONS` at `src/pages/SelfFlyHire.jsx:165`:

```js
const PARTNERS = [
  { category: 'Shooting Ground', name: 'Holland & Holland', location: 'Northwood' },
  { category: 'Restaurant',      name: 'The Hut',           location: 'Isle of Wight' },
  { category: 'Shooting Ground', name: 'E.J. Churchill',    location: 'West Wycombe' },
];

const EVENTS = [
  { region: 'Berkshire',       name: 'Royal Ascot',                month: 'June' },
  { region: 'Oxfordshire',     name: 'Henley Royal Regatta',       month: 'July' },
  { region: 'West Sussex',     name: 'Goodwood Festival of Speed', month: 'July' },
  { region: 'West Sussex',     name: 'Glorious Goodwood',          month: 'August' },
  { region: 'Gloucestershire', name: 'Cheltenham Festival',        month: 'March' },
  { region: 'Merseyside',      name: 'Grand National (Aintree)',   month: 'April' },
  { region: 'Surrey',          name: 'Epsom Derby',                month: 'June' },
  { region: 'Suffolk',         name: 'Newmarket Racing',           month: 'May–Oct' },
  { region: 'Yorkshire',       name: 'York Racecourse',            month: 'May–Oct' },
  { region: 'Surrey',          name: 'Sandown Park',               month: 'Year-round' },
  { region: 'Berkshire',       name: 'Newbury Racecourse',         month: 'Year-round' },
];
```

### Markup

Two new `<section>` blocks inserted at line 592 (after the destinations section closes), each following the same shape as `sfh2-destinations`:

```
section.sfh2-{partners|events}
  div.sfh2-{...}__inner
    motion.div.sfh2-{...}__header
      span.sfh2-pre-label
      h2.sfh2-section-heading
      p.sfh2-{...}__intro
    div.sfh2-{...}__grid (ref + onScroll for events only)
      motion.div.sfh2-{...}__card
        div.sfh2-{...}__card-region
        div.sfh2-{...}__card-name
        div.sfh2-{...}__card-time
    div.sfh2-{...}__dots (events only)
    p.sfh2-{...}__footer (events only)
```

Partners markup omits the scroll ref, dots, and footer (since 3 cards fit in one row).

### CSS

Inside the existing styled-jsx block in `SelfFlyHire.jsx`, add new rule blocks that mirror `.sfh2-destinations*` styles for both `.sfh2-partners*` and `.sfh2-events*`. Two changes vs. the destinations rules:

1. **Partners desktop grid**: `grid-template-columns: repeat(3, 1fr);` (instead of `repeat(4, 1fr)`).
2. **Partners on mobile** (≤768px): override to `grid-template-columns: 1fr;` (single-column stack). No overflow-x scroll, no scroll-snap, no dots. Differs intentionally from destinations/events because 3 cards don't justify pagination.

Events styles are a near-verbatim copy of the destinations rules. (Acceptable duplication — destinations is one of several scroll-card patterns on the page; introducing a shared base class would touch unrelated sections and is out of scope.)

### Section heading + pre-label

Both sections reuse the page-level `.sfh2-section-heading` and `.sfh2-pre-label` classes already defined globally in this file. No new typography rules needed.

### CMS hooks

Both new sections should carry `data-cms-section` attributes for consistency with the rest of the page:

- `data-cms-section="sfh-partners"`
- `data-cms-section="sfh-events"`

(Card text is hardcoded in JS for now — matches how `DESTINATIONS` is currently handled. Migration to CMS-managed data is out of scope for this change.)

## Section 3 — Community Wall (Wall of Cool)

### What it is

The existing `src/components/WallOfCoolGr11.jsx` component, currently rendered on `src/pages/Experimentation.jsx:5221`. It's a fully self-contained section: title, two-row scroll-reveal gallery on desktop, horizontal carousel on mobile, footer with pagination/upload/fullscreen actions, Firestore-backed image source with a fallback list.

### How it gets added

Add an import at the top of `SelfFlyHire.jsx`:

```js
import WallOfCoolGr11 from '../components/WallOfCoolGr11';
```

Render it as a sibling section between the new `sfh2-events` section and the existing `sfh2-enquiry` section:

```jsx
<WallOfCoolGr11 />
```

No props, no wrappers. The component handles its own background, padding, full-bleed margin (`width: 100vw; margin-left: calc(50% - 50vw)`), Firestore loading, scroll-reveal hook and mobile breakpoints. The existing `#community-wall` id stays intact, so deep-linking continues to work.

### Risks / things to verify on first paint

- The component sets `width: 100vw` with negative margins — verify it doesn't break the parent `sfh2-page` layout (it works inside `Experimentation.jsx`, which has the same outer container shape, so this should be fine).
- It pulls Firestore data via `db` from `../lib/firebase`; SelfFlyHire already runs in the same app shell so credentials are present.
- It has its own scroll-position-driven animation — confirm it doesn't fight with the existing `sfh2` motion reveals on neighbouring sections (visually inspect the boundaries).

### Out of scope for this change

- Modifications to `WallOfCoolGr11` itself.
- Custom title/subtitle for the SFH context (keeping the default "Helicopter Adventures / Community Wall").
- Per-page filtered Firestore query (it uses the global approved list).

## Out of Scope

- Partner logos / logo strip treatment (rejected during brainstorming in favour of text cards for visual consistency).
- Event imagery / hero images per card.
- Linking partner cards to external partner sites.
- CMS-managed partner/event data.
- Refactoring the duplicated scroll/dot pattern into a shared component.

## Acceptance Criteria

1. `/self-fly-hire` renders four sections in order between destinations and the enquiry form: existing destinations → new Our Partners → new Events → existing-component Community Wall → existing enquiry.
2. Partners section shows three cards in a single row on desktop and stacks to a single column on mobile.
3. Events section shows 11 cards in a 4-column grid on desktop and mirrors the destinations mobile scroll pattern with working dot pagination.
4. All new partners/events cards use the same typography, spacing, hover state and border treatment as `sfh2-destinations__card`.
5. Community Wall renders identically to its current appearance on `Experimentation.jsx`: scroll-reveal gallery on desktop, horizontal carousel on mobile, footer chrome intact.
6. No regression to the existing destinations section, enquiry form, or any sticky-blur behaviour above/below.
