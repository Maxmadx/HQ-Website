# Wall of Cool Editorial Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an editorial split-module to the Home page training section that scrolls down to the WallOfCoolSection community photo gallery.

**Architecture:** Two edits to `src/pages/Home.jsx` only — (1) insert the editorial module JSX after the training intro paragraph, (2) import and mount `WallOfCoolSection` with a scroll anchor before the Contact section. No new files, no new CSS.

**Tech Stack:** React 18, React Router v6, existing brand CSS (`hq-btn hq-btn--primary` from `approved-components.css`, inline styles matching the rest of `Home.jsx`), Firestore (consumed by the existing `WallOfCoolSection` component — no changes needed there).

**Spec:** `docs/superpowers/specs/2026-04-16-wall-of-cool-button-design.md`

---

## File map

| File | Change |
|---|---|
| `src/pages/Home.jsx` | Add import (line 4 area) · insert editorial module (after line 286) · mount WallOfCoolSection (before line 599) |

---

### Task 1: Add the WallOfCoolSection import

**Files:**
- Modify: `src/pages/Home.jsx:1-4`

- [ ] **Step 1: Add the import**

Open `src/pages/Home.jsx`. After the existing imports at the top of the file (currently lines 1–4), add:

```jsx
import WallOfCoolSection from '../components/Trust/WallOfCoolSection';
```

The top of the file should look like this after the change:

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageImages } from '../hooks/usePageImages';
import WallOfCoolSection from '../components/Trust/WallOfCoolSection';
```

- [ ] **Step 2: Verify the dev server still compiles**

```bash
# In the project root
npm run dev
```

Expected: no import errors in the terminal, page loads.

---

### Task 2: Mount WallOfCoolSection with scroll anchor

**Files:**
- Modify: `src/pages/Home.jsx` — insert before the `{/* Contact Section */}` comment (currently line 599)

- [ ] **Step 1: Insert the section**

Find this exact line in `Home.jsx` (currently line 599):

```jsx
      {/* Contact Section */}
```

Insert the following block **immediately above** it (no blank line needed between):

```jsx
      {/* Wall of Cool Section */}
      <section id="wall-of-cool">
        <WallOfCoolSection />
      </section>

```

After the edit that area of the file should read:

```jsx
        </div>
      </section>

      {/* Wall of Cool Section */}
      <section id="wall-of-cool">
        <WallOfCoolSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="Index-page">
```

- [ ] **Step 2: Verify in browser**

With the dev server running, open the home page. Scroll to the bottom — you should see the Wall of Cool photo grid appear above the contact section (it will be empty/hidden if there are no approved photos in Firestore yet, which is expected — `WallOfCoolSection` returns `null` when `images.length === 0`).

---

### Task 3: Insert the editorial split module

**Files:**
- Modify: `src/pages/Home.jsx` — insert after line 286 (closing `</div>` of the training intro paragraph block), before the `{/* Training Carousel */}` comment

- [ ] **Step 1: Find the insertion point**

Locate this exact block in `Home.jsx` (currently lines 278–288):

```jsx
            <div className="sqs-block html-block sqs-block-html reveal-element">
              <div className="sqs-block-content">
                <div className="sqs-html-content">
                  <p style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                    Unlock your true potential in the skies with HQ Aviation...
                  </p>
                </div>
              </div>
            </div>

            {/* Training Carousel - Exact structure from reference */}
```

- [ ] **Step 2: Insert the module between those two blocks**

Replace the gap between them (the blank line after `</div>` and before `{/* Training Carousel */}`) with the following JSX:

```jsx

            {/* Wall of Cool Teaser */}
            <div className="sqs-block reveal-element">
              <div className="sqs-block-content">
                <div style={{
                  background: '#fff',
                  border: '1px solid #e8e6e2',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                }}>
                  {/* Left: copy */}
                  <div style={{
                    padding: '1.75rem 2rem',
                    borderRight: '1px solid #e8e6e2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.55rem',
                  }}>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.6rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#888',
                    }}>
                      Community · Real flights, real people
                    </span>
                    <h3 style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      color: '#1a1a1a',
                      margin: 0,
                    }}>
                      See flying at HQ<br />through our community
                    </h3>
                    <p style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.82rem',
                      color: '#888',
                      lineHeight: 1.65,
                      maxWidth: '340px',
                      margin: 0,
                    }}>
                      First solos, scenic cross-countries, night flights — captured and shared by the pilots who fly with us every day.
                    </p>
                  </div>
                  {/* Right: CTA */}
                  <div style={{
                    padding: '1.75rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    minWidth: '195px',
                    background: '#faf9f6',
                  }}>
                    <a
                      href="#wall-of-cool"
                      className="hq-btn hq-btn--primary"
                      style={{ width: '100%', textAlign: 'center', display: 'block' }}
                    >
                      Wall of Cool →
                    </a>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.58rem',
                      letterSpacing: '0.1em',
                      color: '#aaa',
                      textAlign: 'center',
                    }}>
                      Community photos · Updated regularly
                    </span>
                  </div>
                </div>
              </div>
            </div>

```

- [ ] **Step 3: Verify in browser**

Reload the home page. You should see the editorial split module appear in the training section, below the intro paragraph and above the training carousel tabs. It should look like:

```
[ Community · Real flights, real people           ][ Wall of Cool →         ]
[ See flying at HQ through our community          ][ Community photos ·     ]
[ First solos, scenic cross-countries...          ][ Updated regularly      ]
```

Clicking "Wall of Cool →" should smooth-scroll to the bottom of the page where the `#wall-of-cool` section is.

---

### Task 4: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add Wall of Cool editorial module and scroll target to Home page"
```

Expected output: 1 file changed.
