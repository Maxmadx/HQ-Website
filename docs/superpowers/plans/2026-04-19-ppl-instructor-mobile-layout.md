# PPL Instructor Mobile Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the lead instructor cards in `/training/ppl` so that on mobile (≤768px) the photo and name/title/stats sit side-by-side on top, with the bio text spanning full width below, separated by a hairline.

**Architecture:** Two JSX wrapper elements are added to each lead instructor card (`fppl-intro__q-top` around image+info, `fppl-intro__q-bio-row` around the bio p). On desktop, `q-top` is `display: contents` (transparent to the flex layout) and `q-bio-row` wraps to its own row via `flex-basis: 100%`. On mobile, `q-top` is overridden to `display: flex` (row) and `q-card` becomes `flex-direction: column`.

**Tech Stack:** React JSX, CSS-in-JS (inline `<style>` block at bottom of FinalPPL.jsx)

---

## Files

- **Modify:** `src/pages/FinalPPL.jsx`
  - JSX: lines 441–463 (Quentin card), lines 467–490 (Mackie card)
  - CSS: base rules ~line 1206, media query ~line 2385

---

### Task 1: Restructure Quentin card JSX

**Files:**
- Modify: `src/pages/FinalPPL.jsx:441-463`

- [ ] **Step 1: Replace the Quentin card JSX**

Find this block (lines 441–463):

```jsx
<div className="fppl-intro__q-card">
  <div className="fppl-intro__q-image">
    <img src={pageImages['ppl-instructors']?.[0]?.url || '/assets/images/team/quentin-smith-profile-picture.jpg'} alt="Quentin Smith" />
  </div>
  <div className="fppl-intro__q-info">
    <h3>Quentin Smith</h3>
    <span className="fppl-intro__q-title">Founder & Managing Director</span>
    <div className="fppl-intro__q-stats">
      <div className="fppl-intro__q-stat">
        <span className="fppl-intro__stat-value"><AnimatedNumber value="18000" />+</span>
        <span className="fppl-intro__stat-label">Flight Hours</span>
      </div>
      <div className="fppl-intro__divider" />
      <div className="fppl-intro__q-stat">
        <span className="fppl-intro__stat-value"><AnimatedNumber value="35" />+</span>
        <span className="fppl-intro__stat-label">Years Flying</span>
      </div>
    </div>
    <p>
      World Helicopter Champion and the first person to fly a helicopter to the South Pole and back.
    </p>
  </div>
</div>
```

Replace with:

```jsx
<div className="fppl-intro__q-card">
  <div className="fppl-intro__q-top">
    <div className="fppl-intro__q-image">
      <img src={pageImages['ppl-instructors']?.[0]?.url || '/assets/images/team/quentin-smith-profile-picture.jpg'} alt="Quentin Smith" />
    </div>
    <div className="fppl-intro__q-info">
      <h3>Quentin Smith</h3>
      <span className="fppl-intro__q-title">Founder & Managing Director</span>
      <div className="fppl-intro__q-stats">
        <div className="fppl-intro__q-stat">
          <span className="fppl-intro__stat-value"><AnimatedNumber value="18000" />+</span>
          <span className="fppl-intro__stat-label">Flight Hours</span>
        </div>
        <div className="fppl-intro__divider" />
        <div className="fppl-intro__q-stat">
          <span className="fppl-intro__stat-value"><AnimatedNumber value="35" />+</span>
          <span className="fppl-intro__stat-label">Years Flying</span>
        </div>
      </div>
    </div>
  </div>
  <div className="fppl-intro__q-bio-row">
    <p>
      World Helicopter Champion and the first person to fly a helicopter to the South Pole and back.
    </p>
  </div>
</div>
```

---

### Task 2: Restructure Mackie card JSX

**Files:**
- Modify: `src/pages/FinalPPL.jsx:467-490`

- [ ] **Step 1: Replace the Mackie card JSX**

Find this block (lines 467–490):

```jsx
<div className="fppl-intro__q-card">
  <div className="fppl-intro__q-image">
    <img src={pageImages['ppl-instructors']?.[1]?.url || '/assets/images/team/mackie-alcantara-profile-picture.jpg'} alt="Mackie Alcantara" />
  </div>
  <div className="fppl-intro__q-info">
    <h3>Mackie Alcantara</h3>
    <span className="fppl-intro__q-title">Chief Flight Instructor</span>
    <div className="fppl-intro__q-stats">
      <div className="fppl-intro__q-stat">
        <span className="fppl-intro__stat-value"><AnimatedNumber value="8500" />+</span>
        <span className="fppl-intro__stat-label">Flight Hours</span>
      </div>
      <div className="fppl-intro__divider" />
      <div className="fppl-intro__q-stat">
        <span className="fppl-intro__stat-value"><AnimatedNumber value="15" />+</span>
        <span className="fppl-intro__stat-label">Years Teaching</span>
      </div>
    </div>
    <p>
      Leading our instructor team with exceptional skill and dedication to every lesson.
    </p>
  </div>
</div>
```

Replace with:

```jsx
<div className="fppl-intro__q-card">
  <div className="fppl-intro__q-top">
    <div className="fppl-intro__q-image">
      <img src={pageImages['ppl-instructors']?.[1]?.url || '/assets/images/team/mackie-alcantara-profile-picture.jpg'} alt="Mackie Alcantara" />
    </div>
    <div className="fppl-intro__q-info">
      <h3>Mackie Alcantara</h3>
      <span className="fppl-intro__q-title">Chief Flight Instructor</span>
      <div className="fppl-intro__q-stats">
        <div className="fppl-intro__q-stat">
          <span className="fppl-intro__stat-value"><AnimatedNumber value="8500" />+</span>
          <span className="fppl-intro__stat-label">Flight Hours</span>
        </div>
        <div className="fppl-intro__divider" />
        <div className="fppl-intro__q-stat">
          <span className="fppl-intro__stat-value"><AnimatedNumber value="15" />+</span>
          <span className="fppl-intro__stat-label">Years Teaching</span>
        </div>
      </div>
    </div>
  </div>
  <div className="fppl-intro__q-bio-row">
    <p>
      Leading our instructor team with exceptional skill and dedication to every lesson.
    </p>
  </div>
</div>
```

---

### Task 3: Update base CSS for new wrapper classes

**Files:**
- Modify: `src/pages/FinalPPL.jsx` — `<style>` block, section `/* ===== INTRO ===== */`

The new classes need base (desktop) rules. `fppl-intro__q-top` uses `display: contents` so it is invisible to the flex layout — its children (image and info) remain direct flex children of the card, preserving the current desktop appearance. `fppl-intro__q-bio-row` uses `flex-basis: 100%` to force a new row in the wrapping flex container.

- [ ] **Step 1: Add `flex-wrap: wrap` to the card base rule**

Find (around line 1206):
```css
.fppl-intro__q-card {
  display: flex;
  gap: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 0 6px 6px 0;
  position: relative;
}
```

Replace with:
```css
.fppl-intro__q-card {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 0 6px 6px 0;
  position: relative;
}
```

- [ ] **Step 2: Add base rules for the two new classes**

Directly after the `.fppl-intro__q-card::before` rule (around line 1223), add:

```css
.fppl-intro__q-top {
  display: contents;
}

.fppl-intro__q-bio-row {
  flex-basis: 100%;
  padding-top: 0.625rem;
  border-top: 1px solid #f0f0ee;
}

.fppl-intro__q-bio-row p {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.85rem;
}
```

---

### Task 4: Update mobile media query

**Files:**
- Modify: `src/pages/FinalPPL.jsx` — `@media (max-width: 768px)` block (~line 2385)

On mobile, `q-card` flips to `flex-direction: column`. `q-top` is overridden from `display: contents` to `display: flex` (row) so image and info sit side-by-side. The existing centering rules are removed.

- [ ] **Step 1: Replace the mobile card rules**

Find this block inside `@media (max-width: 768px)`:
```css
.fppl-intro__q-card {
  flex-direction: column;
  text-align: center;
}

.fppl-intro__q-image {
  margin: 0 auto;
}

.fppl-intro__q-stats {
  justify-content: center;
}
```

Replace with:
```css
.fppl-intro__q-card {
  flex-direction: column;
  gap: 0.75rem;
}

.fppl-intro__q-top {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
}

.fppl-intro__q-image img {
  width: 72px;
  height: 72px;
  object-position: top center;
}

.fppl-intro__q-bio-row {
  flex-basis: auto;
}
```

---

### Task 5: Verify and commit

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:5173/training/ppl` in browser.

- [ ] **Step 2: Check mobile layout**

Open DevTools → toggle device toolbar → set width to 375px (iPhone).

Verify each lead card shows:
- Photo (72×72) on the left, name + title + stats on the right
- Bio text spanning full card width below, separated by a hairline
- No centered text

- [ ] **Step 3: Check desktop layout is unbroken**

Set width back to 1280px. Verify:
- Two cards still sit side-by-side in the grid
- Photo left, info right (with bio below as a new wrapped row — acceptable desktop change)
- No visual regressions in other sections

- [ ] **Step 4: Commit**

```bash
git add src/pages/FinalPPL.jsx
git commit -m "feat(ppl): mobile instructor cards — photo+info row, full-width bio below"
```
