# ExpeditionBarcode Responsive Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `ExpeditionBarcode` so barcode bars don't overflow at ≤450px, and chevrons stack centred below the card grid at ≤380px with a tighter column gap.

**Architecture:** Two independent CSS/JS changes to a single component. JS: add a `matchMedia` listener that reduces bar count from 25→15 at ≤450px. CSS: add a `@media (max-width: 380px)` block that reorders flex children so chevrons wrap onto a centred second row, and tightens grid gap.

**Tech Stack:** React 19, Vitest 4 (jsdom), inline `<style>` in JSX component

---

## File Map

| Action | Path |
|---|---|
| Export helper (tiny change) | `src/components/Expeditions/ExpeditionBarcode.jsx` |
| New test file | `src/components/Expeditions/ExpeditionBarcode.test.js` |
| Modify (main impl) | `src/components/Expeditions/ExpeditionBarcode.jsx` |

---

## Task 1: Export `generateBarcode` and write the failing test

**Files:**
- Modify: `src/components/Expeditions/ExpeditionBarcode.jsx` — add `export` keyword to `generateBarcode`
- Create: `src/components/Expeditions/ExpeditionBarcode.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/components/Expeditions/ExpeditionBarcode.test.js`:
```js
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { generateBarcode } from './ExpeditionBarcode';

describe('generateBarcode', () => {
  it('returns an array of the requested length', () => {
    expect(generateBarcode('arctic', 25)).toHaveLength(25);
    expect(generateBarcode('arctic', 15)).toHaveLength(15);
  });

  it('returns only 0 or 1 values', () => {
    const bars = generateBarcode('iceland', 20);
    bars.forEach(b => expect([0, 1]).toContain(b));
  });

  it('is deterministic — same input produces same output', () => {
    expect(generateBarcode('norway', 25)).toEqual(generateBarcode('norway', 25));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main && npx vitest run src/components/Expeditions/ExpeditionBarcode.test.js
```
Expected: import error — `generateBarcode` is not a named export.

- [ ] **Step 3: Export `generateBarcode`**

In `ExpeditionBarcode.jsx`, change line 129:
```js
// before
function generateBarcode(str, length = 30) {
// after
export function generateBarcode(str, length = 30) {
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/Expeditions/ExpeditionBarcode.test.js
```
Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Commit**

```bash
git add src/components/Expeditions/ExpeditionBarcode.jsx src/components/Expeditions/ExpeditionBarcode.test.js
git commit -m "test(expedition-barcode): export generateBarcode and add unit tests"
```

---

## Task 2: Implement `isNarrow` matchMedia hook and reduce bar count at ≤450px

**Files:**
- Modify: `src/components/Expeditions/ExpeditionBarcode.jsx`

- [ ] **Step 1: Add `isNarrow` state and matchMedia effect**

Inside `function ExpeditionBarcode`, after the existing `useState`/`useRef` declarations (around line 151), add:

```js
const [isNarrow, setIsNarrow] = useState(
  () => typeof window !== 'undefined' && window.matchMedia('(max-width: 450px)').matches
);

useEffect(() => {
  const mq = window.matchMedia('(max-width: 450px)');
  const handler = (e) => setIsNarrow(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}, []);
```

- [ ] **Step 2: Update the `barcodes` memo to use `isNarrow`**

Find the existing `barcodes` useMemo (around line 174):
```js
const barcodes = useMemo(() => {
  return cmsDestinations.map(d => ({
    ...d,
    code: generateBarcode(d.id + d.name, 25)
  }));
}, [cmsDestinations]);
```

Replace with:
```js
const barcodes = useMemo(() => {
  const barCount = isNarrow ? 15 : 25;
  return cmsDestinations.map(d => ({
    ...d,
    code: generateBarcode(d.id + d.name, barCount)
  }));
}, [cmsDestinations, isNarrow]);
```

- [ ] **Step 3: Run the existing test suite to confirm nothing broke**

```bash
npx vitest run src/components/Expeditions/ExpeditionBarcode.test.js
```
Expected: 3 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/Expeditions/ExpeditionBarcode.jsx
git commit -m "feat(expedition-barcode): reduce barcode bar count to 15 at <=450px viewport"
```

---

## Task 3: Add `@media (max-width: 380px)` CSS for chevron layout and grid gap

**Files:**
- Modify: `src/components/Expeditions/ExpeditionBarcode.jsx` — inline `<style>` block

- [ ] **Step 1: Locate the existing `@media (max-width: 500px)` block in the inline style**

It is near the bottom of the `<style>` tag (around line 845 of the original file):
```css
@media (max-width: 500px) {
  .exp-barcode { ... }
  ...
}
```

- [ ] **Step 2: Add a new `@media (max-width: 380px)` block immediately after the `@media (max-width: 500px)` block**

```css
@media (max-width: 380px) {
  /* Grid wrapper fills full width; chevrons wrap to a centred second row */
  .exp-barcode__scroll-row {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .exp-barcode__grid-wrapper {
    order: 1;
    flex: 0 0 100%;
    min-width: 0;
  }

  .exp-barcode__scroll-chevron--left {
    order: 2;
    margin-right: 0;
  }

  .exp-barcode__scroll-chevron--right {
    order: 3;
    margin-left: 0;
  }

  /* Tighten the card grid column gap */
  .exp-barcode__grid {
    gap: 0.5rem;
  }
}
```

- [ ] **Step 3: Run the full test suite to confirm nothing regressed**

```bash
npx vitest run
```
Expected: all existing tests pass (the new component test file passes its 3 tests).

- [ ] **Step 4: Visual verification — start dev server and check both breakpoints**

```bash
npm run dev
```

Open browser devtools, toggle device toolbar. Check:
- At **440px** wide: each destination card shows 15 bars (visually fewer/less dense barcode)
- At **375px** wide (iPhone SE): chevrons appear centred below the card grid as `‹   ›`, cards fill full width and scroll horizontally, grid gap is visibly tighter

- [ ] **Step 5: Commit**

```bash
git add src/components/Expeditions/ExpeditionBarcode.jsx
git commit -m "feat(expedition-barcode): stack chevrons below grid and tighten gap at <=380px"
```
