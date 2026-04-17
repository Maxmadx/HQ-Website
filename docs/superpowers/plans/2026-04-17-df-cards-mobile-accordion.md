# df-cards Mobile Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain vertical card stack on `DiscoveryFlight.jsx` (≤1024px) with a tap-to-expand accordion that matches the Luxury Minimal Aviation brand.

**Architecture:** A separate `openCard` state (string | null) controls which accordion panel is open, independent of the existing `selectedCard`/`selectedTime` booking state. On mobile mount the R22 panel is pre-opened. When a card has an active booking selection but is collapsed, a black booking strip with a Book Now button is rendered inside the card. Desktop layout (`>1024px`) is untouched.

**Tech Stack:** React 18, Framer Motion (AnimatePresence), Vitest + jsdom, inline `<style>` JSX block inside `DiscoveryFlight.jsx`.

---

## File Map

| File | Change |
|---|---|
| `src/pages/DiscoveryFlight.jsx` | All changes — state, JSX, CSS |

---

### Task 1: Add `isMobile` + `openCard` state and accordion toggle handler

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx:444-476`

- [ ] **Step 1: Add the two new state variables and useEffect**

In `ValueProposition` (line 443), directly after the existing `useState` declarations on lines 444–445, add the new state and effect. Replace this block:

```jsx
function ValueProposition() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();
```

with:

```jsx
function ValueProposition() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const navigate = useNavigate();

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

- [ ] **Step 2: Add `handleAccordionToggle` after the existing `handleBook`**

After line 476 (`};` closing `handleBook`), add:

```jsx
  const handleAccordionToggle = (id) => {
    setOpenCard(prev => prev === id ? null : id);
  };
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(discovery): add isMobile/openCard state and accordion toggle handler"
```

---

### Task 2: Add accordion CSS classes to the `<style>` block

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx` — inside the JSX `<style>` block, before the `/* ===== RESPONSIVE =====` comment

Find the line `/* ===== RESPONSIVE =====` inside the `<style>` tag and insert the following block immediately before it:

- [ ] **Step 1: Insert accordion CSS**

```css
        /* ===== ACCORDION (mobile) ===== */
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
          line-height: 1;
        }

        .df-card__acc-chevron--open {
          transform: rotate(180deg);
          color: #1a1a1a;
        }

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

- [ ] **Step 2: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(discovery): add accordion CSS classes for mobile cards"
```

---

### Task 3: Update ≤1024px CSS block for `df-cards` / `df-card`

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx` — inside `@media (max-width: 1024px)` block (~line 2335)

- [ ] **Step 1: Replace the existing mobile card CSS**

Find and replace this block (lines ~2335–2352):

```css
          .df-cards {
            flex-direction: column;
            min-height: auto;
          }

          .df-card,
          .df-card--featured,
          .df-cards.has-focus .df-card--featured,
          .df-cards.has-focus .df-card--focused {
            flex: none;
            transform: none;
            width: 100%;
            margin-bottom: 1.5rem;
          }

          .df-card--featured {
            border: 2px solid #1a1a1a;
          }
```

Replace with:

```css
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
            margin-bottom: 0;
          }

          .df-card--featured {
            border: 2px solid #1a1a1a;
          }
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(discovery): update mobile CSS for accordion card layout"
```

---

### Task 4: Replace the card JSX with the mobile/desktop conditional

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx:493-548`

This is the largest change. Replace the entire `aircraftWithPricing.map(...)` block (lines 493–548) with the conditional version below. Desktop layout is preserved inside the `else` branch — it is identical to the current code.

- [ ] **Step 1: Replace the map block**

Find this exact block:

```jsx
          <div className={`df-cards ${selectedCard ? 'has-focus' : ''}`} data-cms-section="discovery-aircraft">
            {aircraftWithPricing.map((aircraft, index) => (
              <Reveal key={aircraft.id} delay={index * 0.1}>
                <motion.div
                  className={`df-card ${aircraft.featured ? 'df-card--featured' : ''} ${selectedCard === aircraft.id ? 'df-card--focused' : ''}`}
                  whileHover={{ y: -4 }}
                >
                  {aircraft.featured && !selectedCard && (
                    <span className="df-card__badge">RECOMMENDED</span>
                  )}
                  <div className="df-card__image">
                    <img src={aircraft.image} alt={aircraft.name} />
                  </div>
                  <div className="df-card__content">
                    <div className="df-card__header">
                      <h3 className="df-card__name">{t(sectionForAircraft[aircraft.id], 'name')}</h3>
                      <p className="df-card__tagline">{t(sectionForAircraft[aircraft.id], 'tagline')}</p>
                      <p className="df-card__desc">{t(sectionForAircraft[aircraft.id], 'description')}</p>
                      <div className="df-card__seats"><span>{t(sectionForAircraft[aircraft.id], 'seats')}</span></div>
                    </div>
                    <div className="df-card__pricing">
                      <div
                        className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 30 ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(aircraft.id, 30)}
                      >
                        <div className="df-card__time-info">
                          <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_30min')}</span>
                          <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_30min')}</span>
                        </div>
                        <span className="df-card__price">{aircraft.priceFmt[30]}</span>
                      </div>
                      <div
                        className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 60 ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(aircraft.id, 60)}
                      >
                        <div className="df-card__time-info">
                          <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_60min')}</span>
                          <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_60min')}</span>
                        </div>
                        <span className="df-card__price">{aircraft.priceFmt[60]}</span>
                      </div>
                    </div>
                    <button
                      className={`df-card__btn ${selectedCard === aircraft.id && selectedTime ? 'active' : ''}`}
                      onClick={() => handleBook(aircraft.id)}
                      disabled={selectedCard !== aircraft.id || !selectedTime}
                    >
                      {selectedCard === aircraft.id && selectedTime
                        ? `Book Now - ${aircraft.priceFmt[selectedTime]}`
                        : 'Select Duration'}
                    </button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
```

Replace with:

```jsx
          <div className={`df-cards ${selectedCard ? 'has-focus' : ''}`} data-cms-section="discovery-aircraft">
            {aircraftWithPricing.map((aircraft, index) => (
              <Reveal key={aircraft.id} delay={index * 0.1}>
                {isMobile ? (
                  /* ---- MOBILE: accordion ---- */
                  <div className={`df-card ${aircraft.featured ? 'df-card--featured' : ''}`}>
                    <div
                      className="df-card__acc-header"
                      onClick={() => handleAccordionToggle(aircraft.id)}
                    >
                      <div className="df-card__acc-thumb">
                        <img src={aircraft.image} alt={aircraft.name} />
                      </div>
                      <div className="df-card__acc-meta">
                        {aircraft.featured && (
                          <span className="df-card__acc-rec">Recommended</span>
                        )}
                        <span className="df-card__acc-name">{t(sectionForAircraft[aircraft.id], 'name')}</span>
                        <span className="df-card__acc-from">from {aircraft.priceFmt[30]}</span>
                      </div>
                      <span className={`df-card__acc-chevron ${openCard === aircraft.id ? 'df-card__acc-chevron--open' : ''}`}>▼</span>
                    </div>

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
                            <div className="df-card__header">
                              <h3 className="df-card__name">{t(sectionForAircraft[aircraft.id], 'name')}</h3>
                              <p className="df-card__tagline">{t(sectionForAircraft[aircraft.id], 'tagline')}</p>
                              <p className="df-card__desc">{t(sectionForAircraft[aircraft.id], 'description')}</p>
                              <div className="df-card__seats"><span>{t(sectionForAircraft[aircraft.id], 'seats')}</span></div>
                            </div>
                            <div className="df-card__pricing">
                              <div
                                className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 30 ? 'selected' : ''}`}
                                onClick={() => handleTimeSelect(aircraft.id, 30)}
                              >
                                <div className="df-card__time-info">
                                  <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_30min')}</span>
                                  <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_30min')}</span>
                                </div>
                                <span className="df-card__price">{aircraft.priceFmt[30]}</span>
                              </div>
                              <div
                                className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 60 ? 'selected' : ''}`}
                                onClick={() => handleTimeSelect(aircraft.id, 60)}
                              >
                                <div className="df-card__time-info">
                                  <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_60min')}</span>
                                  <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_60min')}</span>
                                </div>
                                <span className="df-card__price">{aircraft.priceFmt[60]}</span>
                              </div>
                            </div>
                            <button
                              className={`df-card__btn ${selectedCard === aircraft.id && selectedTime ? 'active' : ''}`}
                              onClick={() => handleBook(aircraft.id)}
                              disabled={selectedCard !== aircraft.id || !selectedTime}
                            >
                              {selectedCard === aircraft.id && selectedTime
                                ? `Book Now - ${aircraft.priceFmt[selectedTime]}`
                                : 'Select Duration'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* ---- DESKTOP: unchanged ---- */
                  <motion.div
                    className={`df-card ${aircraft.featured ? 'df-card--featured' : ''} ${selectedCard === aircraft.id ? 'df-card--focused' : ''}`}
                    whileHover={{ y: -4 }}
                  >
                    {aircraft.featured && !selectedCard && (
                      <span className="df-card__badge">RECOMMENDED</span>
                    )}
                    <div className="df-card__image">
                      <img src={aircraft.image} alt={aircraft.name} />
                    </div>
                    <div className="df-card__content">
                      <div className="df-card__header">
                        <h3 className="df-card__name">{t(sectionForAircraft[aircraft.id], 'name')}</h3>
                        <p className="df-card__tagline">{t(sectionForAircraft[aircraft.id], 'tagline')}</p>
                        <p className="df-card__desc">{t(sectionForAircraft[aircraft.id], 'description')}</p>
                        <div className="df-card__seats"><span>{t(sectionForAircraft[aircraft.id], 'seats')}</span></div>
                      </div>
                      <div className="df-card__pricing">
                        <div
                          className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 30 ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(aircraft.id, 30)}
                        >
                          <div className="df-card__time-info">
                            <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_30min')}</span>
                            <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_30min')}</span>
                          </div>
                          <span className="df-card__price">{aircraft.priceFmt[30]}</span>
                        </div>
                        <div
                          className={`df-card__time ${selectedCard === aircraft.id && selectedTime === 60 ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(aircraft.id, 60)}
                        >
                          <div className="df-card__time-info">
                            <span className="df-card__time-duration">{t(sectionForAircraft[aircraft.id], 'label_60min')}</span>
                            <span className="df-card__time-desc">{t(sectionForAircraft[aircraft.id], 'desc_60min')}</span>
                          </div>
                          <span className="df-card__price">{aircraft.priceFmt[60]}</span>
                        </div>
                      </div>
                      <button
                        className={`df-card__btn ${selectedCard === aircraft.id && selectedTime ? 'active' : ''}`}
                        onClick={() => handleBook(aircraft.id)}
                        disabled={selectedCard !== aircraft.id || !selectedTime}
                      >
                        {selectedCard === aircraft.id && selectedTime
                          ? `Book Now - ${aircraft.priceFmt[selectedTime]}`
                          : 'Select Duration'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </Reveal>
            ))}
          </div>
```

- [ ] **Step 2: Verify the dev server compiles without errors**

```bash
npm run dev
```

Expected: no console errors, page loads at `http://localhost:5173/discovery-flight`

- [ ] **Step 3: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(discovery): mobile accordion JSX with booking strip and animated expand"
```

---

### Task 5: Manual verification checklist

Run `npm run dev` and open `http://localhost:5173/discovery-flight` in a browser. Resize the window to test both breakpoints.

- [ ] **Mobile (≤1024px) — resize browser or use DevTools device mode**

  1. Page loads → R22 card is expanded, R44 and R66 are collapsed
  2. R44 header shows "RECOMMENDED" pill when R44 has `featured: true` (or skip if all aircraft currently have `featured: false`)
  3. Tap R44 header → R22 animates closed, R44 animates open
  4. Tap R44 header again → R44 collapses (toggle off)
  5. Open R22, tap "30 min" pricing row → row highlights in `#1a1a1a`, Book Now button activates in the body
  6. Tap R44 header (open it, auto-closing R22) → black booking strip appears at the bottom of the collapsed R22 card showing "R22 name · 30 min · £X" and a white "Book Now" button
  7. Tap "Book Now" on the strip → navigates to `/checkout?aircraft=r22&duration=30&price=...`
  8. Tap a duration row inside the open R44 card → selectedCard switches to r44, R22 strip disappears
  9. Resize to >1024px → accordion disappears, standard desktop side-by-side layout is intact

- [ ] **Desktop (>1024px) — no changes expected**

  1. Cards display side-by-side with gap
  2. Featured card (if any) is scaled 1.02×
  3. Hover lifts cards by 4px
  4. Selecting a card expands it, others reduce
  5. Book Now navigates to checkout

- [ ] **Final commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(discovery): df-cards mobile accordion complete"
```
