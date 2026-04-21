# Aircraft Detail Page Enquiry Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the aircraft detail page enquiry form to `/api/leads`, style the submit button to match the site's intent-button design, and show a success confirmation on submission.

**Architecture:** All changes are in one file — `src/pages/UsedAircraftDetail.jsx`. CSS is added to the existing `styles` template literal. State and handler are added to the `UsedAircraftDetail` component. JSX is updated to be controlled, add the success conditional, and replace the submit button.

**Tech Stack:** React 19, fetch API, existing `/api/leads` Express endpoint (writes to Firestore `leads` collection)

---

## File Map

| File | Change |
|---|---|
| `src/pages/UsedAircraftDetail.jsx` | CSS + state + handler + JSX — all changes |

---

### Task 1: Replace old submit button CSS and add new intent-button + success styles

The `styles` string currently has a `.uad-form button` rule (lines 432–445) that would override the new class-based styling due to higher CSS specificity. Replace it with the new classes.

**Files:**
- Modify: `src/pages/UsedAircraftDetail.jsx:432-445` (CSS in `styles` string)

- [ ] **Step 1: Find and replace the `.uad-form button` block**

Find this exact block in the `styles` string:
```css
.uad-form button {
  grid-column: 1 / -1;
  padding: 13px 24px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.uad-form button:hover { background: #333; }
```

Replace with:
```css
/* Intent-style submit button */
.uad-intent-btn {
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem;
  background: #faf9f6; border: 1px solid #e0deda; padding: 1.25rem 1.5rem;
  cursor: pointer; text-align: left;
  transition: border-color 0.2s, background 0.2s;
  width: 100%; grid-column: 1 / -1;
}
.uad-intent-btn:hover:not(:disabled) { border-color: #1a1a1a; background: #f3f1ed; }
.uad-intent-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.uad-intent-icon { font-size: 1.2rem; color: #1a1a1a; }
.uad-intent-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem; font-weight: 700; color: #1a1a1a;
}
.uad-intent-sub { font-size: 0.78rem; color: #888; line-height: 1.5; }

/* Form error */
.uad-form-error {
  grid-column: 1 / -1;
  font-size: 0.78rem; color: #dc2626; padding: 0.5rem 0;
  margin: 0;
}

/* Success state */
.uad-success {
  text-align: center; padding: 2rem; background: #faf9f6;
}
.uad-success-icon {
  display: flex; align-items: center; justify-content: center;
  width: 48px; height: 48px;
  background: #1a1a1a; color: #fff;
  border-radius: 50%; font-size: 1.1rem;
  margin: 0 auto 1rem;
}
.uad-success-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: -0.01em;
  margin-bottom: 0.5rem; color: #1a1a1a;
}
.uad-success-sub { font-size: 0.82rem; color: #888; line-height: 1.5; margin: 0; }
```

- [ ] **Step 2: Verify the styles string still closes correctly**

Confirm the `styles` string still ends with the closing backtick on its own line:
```js
`;
```
at approximately line 520 (it will shift slightly due to added lines). The line just after it should be a blank line followed by `// ============================================`.

---

### Task 2: Add form state and submit handler to the component

**Files:**
- Modify: `src/pages/UsedAircraftDetail.jsx:526-565` (component state and hooks)

- [ ] **Step 1: Add form state after existing state declarations**

Find this block (around line 528):
```js
function UsedAircraftDetail() {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [loadingAircraft, setLoadingAircraft] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
```

Change to:
```js
function UsedAircraftDetail() {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [loadingAircraft, setLoadingAircraft] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Enquiry form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
```

- [ ] **Step 2: Add the submit handler**

Find the `useEffect` that loads the aircraft doc:
```js
  useEffect(() => {
    getDoc(doc(db, 'listings', id)).then((snap) => {
```

Insert the handler **before** that `useEffect`:
```js
  async function handleEnquirySubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setEnquiryError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          subject: `Aircraft Enquiry — ${aircraft.model}${aircraft.registration ? ` (${aircraft.registration})` : ''}`,
          message: message || 'No additional message provided.',
          source: 'aircraft-detail-enquiry',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setEnquiryError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

```

---

### Task 3: Update JSX — success conditional, controlled inputs, intent button

**Files:**
- Modify: `src/pages/UsedAircraftDetail.jsx:733-768`

- [ ] **Step 1: Replace the entire `uad-register` block**

Find this entire block (lines ~733–768):
```jsx
          <div className="uad-register">
            <div className="uad-register-header">
              <div className="uad-register-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <div className="uad-register-title">Register Your Interest</div>
                <div className="uad-register-subtitle">Get in touch about this aircraft and similar listings</div>
              </div>
            </div>

            <div className="uad-call">
              <div className="uad-call-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div className="uad-call-label">Call Our Sales Team</div>
                <a href="tel:+441895833838" className="uad-call-number">+44 (0) 1895 833 838</a>
              </div>
            </div>

            <div className="uad-divider-or">or send an enquiry</div>

            <form className="uad-form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="First name" required />
              <input type="text" placeholder="Last name" required />
              <input type="email" placeholder="Email address" required className="uad-form--full" />
              <input type="tel" placeholder="Phone number" className="uad-form--full" />
              <textarea placeholder={`Tell us about your interest in this ${aircraft.model}...`} />
              <button type="submit">Submit Enquiry</button>
            </form>
          </div>
```

Replace with:
```jsx
          {submitted ? (
            <div className="uad-success">
              <span className="uad-success-icon">✓</span>
              <p className="uad-success-title">Enquiry Received</p>
              <p className="uad-success-sub">
                Thank you — we'll be in touch about this {aircraft.model} shortly.
              </p>
            </div>
          ) : (
            <div className="uad-register">
              <div className="uad-register-header">
                <div className="uad-register-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <div className="uad-register-title">Register Your Interest</div>
                  <div className="uad-register-subtitle">Get in touch about this aircraft and similar listings</div>
                </div>
              </div>

              <div className="uad-call">
                <div className="uad-call-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="uad-call-label">Call Our Sales Team</div>
                  <a href="tel:+441895833838" className="uad-call-number">+44 (0) 1895 833 838</a>
                </div>
              </div>

              <div className="uad-divider-or">or send an enquiry</div>

              <form className="uad-form" onSubmit={handleEnquirySubmit}>
                <input type="text" placeholder="First name" required
                  value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last name" required
                  value={lastName} onChange={e => setLastName(e.target.value)} />
                <input type="email" placeholder="Email address" required className="uad-form--full"
                  value={email} onChange={e => setEmail(e.target.value)} />
                <input type="tel" placeholder="Phone number" className="uad-form--full"
                  value={phone} onChange={e => setPhone(e.target.value)} />
                <textarea
                  placeholder={`Tell us about your interest in this ${aircraft.model}...`}
                  value={message} onChange={e => setMessage(e.target.value)}
                />
                {enquiryError && <p className="uad-form-error">{enquiryError}</p>}
                <button type="submit" className="uad-intent-btn" disabled={submitting}>
                  <span className="uad-intent-icon">→</span>
                  <span className="uad-intent-title">{submitting ? 'Sending…' : 'Submit Enquiry'}</span>
                  <span className="uad-intent-sub">We'll respond within one business day.</span>
                </button>
              </form>
            </div>
          )}
```

- [ ] **Step 2: Verify end-to-end manually**

1. Run `npm run dev`
2. Go to `/sales/pre-owned` — click any aircraft card (requires at least one listing in Firestore)
3. Scroll to the "Register Your Interest" section
4. Confirm the submit button looks like a card: off-white background, border, arrow icon, "Submit Enquiry" title, subtitle text
5. Fill in the form and submit — button should show "Sending…" while in flight
6. Confirm the form section is replaced by "✓ Enquiry Received" success state
7. Go to `/admin/leads` — confirm the lead appears with status "new" and subject "Aircraft Enquiry — [model]"
8. Submit again with empty required fields — confirm browser validation prevents it (no network request)
9. To test the error state: temporarily break the fetch URL to `/api/leads-bad`, submit, confirm error message appears inline