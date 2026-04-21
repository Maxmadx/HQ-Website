# Mobile Nav Burger Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On mobile, when the `fd-nav` hides as the user scrolls into the Clubhouse section, a `.hq-menu-btn` burger appears in the right side of the nav bar — clicking it reveals the nav; clicking again hides it.

**Architecture:** Single-file change in `Experimentation.jsx`. New `navManuallyShown` state overrides the hidden class. The existing nav content is wrapped in `fd-nav__content` so CSS can target it independently of the burger. The `.hq-menu-btn` design (already in `navigation.css`) is reused with no modifications.

**Tech Stack:** React (useState, useEffect), CSS (inline styles block inside Experimentation.jsx), existing `navigation.css` classes.

---

### Task 1: Add `navManuallyShown` state and reset effect

**Files:**
- Modify: `src/pages/Experimentation.jsx:1970-1971` (state declarations)
- Modify: `src/pages/Experimentation.jsx:2753` (after clubhouse IntersectionObserver)

- [ ] **Step 1: Add `navManuallyShown` state**

At line 1970, the current code is:
```js
  const [navCompact, setNavCompact] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [trainingSlide, setTrainingSlide] = useState(0);
```

Change to:
```js
  const [navCompact, setNavCompact] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navManuallyShown, setNavManuallyShown] = useState(false);
  const [trainingSlide, setTrainingSlide] = useState(0);
```

- [ ] **Step 2: Add reset effect after the clubhouse IntersectionObserver**

The clubhouse observer block ends at line 2753. Immediately after it, insert:
```js
  // Reset manual override when clubhouse section leaves view
  useEffect(() => {
    if (!navHidden) setNavManuallyShown(false);
  }, [navHidden]);
```

- [ ] **Step 3: Verify no syntax errors**

Run: `grep -n "navManuallyShown" src/pages/Experimentation.jsx`

Expected output — 2 lines (the setter reference is added in Task 2):
```
1972:  const [navManuallyShown, setNavManuallyShown] = useState(false);
2755:    if (!navHidden) setNavManuallyShown(false);
```
(line numbers may differ by ±2)

---

### Task 2: Update the nav JSX

**Files:**
- Modify: `src/pages/Experimentation.jsx:3347-3377` (the `<nav>` block)

- [ ] **Step 1: Replace the entire `<nav>` block**

Current code (lines 3347–3377):
```jsx
      {/* ===== HORIZONTAL ACCORDION NAVIGATION ===== */}
      <nav className={`fd-nav ${navCompact ? 'fd-nav--compact' : ''} ${navHidden ? 'fd-nav--hidden' : ''}`} ref={navRef}>
        <div className="fd-nav__header">
          <span className="fd-nav__line"></span>
          <span>Explore</span>
          <span className="fd-nav__line"></span>
        </div>

        <div className="fd-nav__accordion">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`fd-nav__item-wrap ${activeNavSection === item.id ? 'fd-nav__item-wrap--active' : ''}`}
            >
              <button
                className={`fd-nav__item ${activeNavSection === item.id ? 'fd-nav__item--active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="fd-nav__item-icon">{item.icon}</span>
                <span className="fd-nav__item-label">{item.label}</span>
              </button>
              {item.subItems && item.subItems.length > 0 && (
                <div className="fd-nav__dropdown">
                  {item.subItems.map((sub) => (
                    <Link key={sub.label} to={sub.to} className="fd-nav__dropdown-item">{sub.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
```

Replace with:
```jsx
      {/* ===== HORIZONTAL ACCORDION NAVIGATION ===== */}
      <nav
        className={`fd-nav ${navCompact ? 'fd-nav--compact' : ''} ${navHidden && !navManuallyShown ? 'fd-nav--hidden' : ''} ${navHidden ? 'fd-nav--clubhouse' : ''}`}
        ref={navRef}
      >
        <button
          className={`fd-nav__burger hq-menu-btn ${navManuallyShown ? 'open' : ''}`}
          onClick={() => setNavManuallyShown(v => !v)}
          aria-label="Toggle navigation"
        >
          <span></span><span></span><span></span>
        </button>

        <div className="fd-nav__content">
          <div className="fd-nav__header">
            <span className="fd-nav__line"></span>
            <span>Explore</span>
            <span className="fd-nav__line"></span>
          </div>

          <div className="fd-nav__accordion">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`fd-nav__item-wrap ${activeNavSection === item.id ? 'fd-nav__item-wrap--active' : ''}`}
              >
                <button
                  className={`fd-nav__item ${activeNavSection === item.id ? 'fd-nav__item--active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className="fd-nav__item-icon">{item.icon}</span>
                  <span className="fd-nav__item-label">{item.label}</span>
                </button>
                {item.subItems && item.subItems.length > 0 && (
                  <div className="fd-nav__dropdown">
                    {item.subItems.map((sub) => (
                      <Link key={sub.label} to={sub.to} className="fd-nav__dropdown-item">{sub.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
```

- [ ] **Step 2: Verify the nav renders without crash**

Run the dev server and open the page. The nav should look identical to before — no visible change yet.

---

### Task 3: Update the CSS

**Files:**
- Modify: `src/pages/Experimentation.jsx` — the inline `<style>` block, around the `.fd-nav--hidden` rule (currently ~line 6405)

- [ ] **Step 1: Update `.fd-nav--hidden` and add new rules**

Find this block:
```css
        .fd-nav--hidden {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, border-top-color 1.2s ease, box-shadow 0.3s ease;
        }
```

Replace with:
```css
        .fd-nav--hidden .fd-nav__content {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

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

- [ ] **Step 2: Verify `.fd-nav` still has `position: relative` context**

The `.fd-nav` uses `position: sticky` which acts as a containing block for absolutely-positioned children — no extra CSS needed. Confirm the burger appears anchored to the right of the nav bar on mobile (not to the viewport).

---

### Task 4: Manual verification

- [ ] **Step 1: Open the page on mobile viewport (≤640px)**

In devtools, switch to a mobile viewport (e.g. iPhone SE, 375px wide). Scroll down to the Clubhouse section.

Expected:
- The `fd-nav` accordion content fades out
- A two-line burger icon appears on the right side of the nav bar

- [ ] **Step 2: Tap the burger**

Expected:
- The nav content fades back in
- The burger icon transforms into an X (existing `.hq-menu-btn.open` animation from `navigation.css`)

- [ ] **Step 3: Tap the X**

Expected:
- The nav content fades out again
- The X returns to the two-line icon

- [ ] **Step 4: Scroll away from Clubhouse**

Expected:
- `navHidden` becomes false
- Nav content shows normally
- Burger disappears
- Manual state is reset (tapping burger again from outside clubhouse does nothing — burger is not shown)

- [ ] **Step 5: Verify desktop is unaffected**

Switch devtools to desktop viewport (≥641px). Scroll to clubhouse section.

Expected: no burger appears, nav behaves exactly as before.

---

### Task 5: Commit

- [ ] **Commit the change**

```bash
git add src/pages/Experimentation.jsx
git commit -m "feat(mobile): add burger reveal for hidden fd-nav at clubhouse section"
```
