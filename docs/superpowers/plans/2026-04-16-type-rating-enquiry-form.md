# Type Rating Enquiry Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inline enquiry form to the `/type-rating` page that reveals below the aircraft grid when a user clicks an Enquire button inside an expanded aircraft card, auto-populates with the selected aircraft, and submits to `/api/leads` (surfacing in the admin Leads panel).

**Architecture:** All changes are confined to `src/pages/TypeRating.jsx`. A new `tr-enquire-btn` card-style button replaces the outbound link in each expanded aircraft card. New state (`enquiryAircraft`, `formVisible`, `formData`, `formStatus`) and a `ref` drive the form reveal, auto-population, and submission. The form section sits between the fleet grid and the training process section, hidden until first Enquire click, then staying visible.

**Tech Stack:** React 18, Framer Motion (AnimatePresence already imported), fetch API, `/api/leads` POST endpoint (existing)

---

## File Structure

| Action | File | What changes |
|--------|------|--------------|
| Modify | `src/pages/TypeRating.jsx` | State, ref, handlers, button, form JSX, CSS styles |

No other files need touching. The `/api/leads` endpoint and `AdminLeads.jsx` are unchanged.

---

## Task 1: Add enquiry state, ref, and handler functions to TypeRating

**Files:**
- Modify: `src/pages/TypeRating.jsx` (around line 334, after the `selectedAircraft` useState line)

- [ ] **Step 1: Locate the insertion point**

Open `src/pages/TypeRating.jsx`. Find this exact block (around line 334):

```javascript
  const [selectedAircraft, setSelectedAircraft] = useState(0);
```

- [ ] **Step 2: Add enquiry state, ref, and handlers directly after that line**

```javascript
  const [selectedAircraft, setSelectedAircraft] = useState(0);

  // Enquiry form state
  const [enquiryAircraft, setEnquiryAircraft] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const enquiryFormRef = useRef(null);

  function handleEnquire(model) {
    setEnquiryAircraft(model);
    if (!formVisible) {
      setFormVisible(true);
      setTimeout(() => {
        enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Type Rating — ${enquiryAircraft}`,
          message: formData.message,
          source: 'type-rating-page',
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  }
```

- [ ] **Step 3: Verify the file still parses**

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
node --input-type=module --eval "import('./src/pages/TypeRating.jsx')" 2>&1 | head -5
```

If the project uses Vite, just check the dev server doesn't error. A clean start is the signal.

- [ ] **Step 4: Commit**

```bash
git add src/pages/TypeRating.jsx
git commit -m "feat(type-rating): add enquiry form state and handlers"
```

---

## Task 2: Replace the "Enquire Now" link with the tr-enquire-btn button in AircraftCard

**Files:**
- Modify: `src/pages/TypeRating.jsx` (AircraftCard component, around line 248 in the expanded state)

- [ ] **Step 1: Update AircraftCard's prop signature**

Find:
```javascript
function AircraftCard({ aircraft, isActive, onClick }) {
```

Replace with:
```javascript
function AircraftCard({ aircraft, isActive, onClick, onEnquire }) {
```

- [ ] **Step 2: Remove the existing outbound link and add the tr-enquire-btn**

Find this exact block inside the expanded state of `AircraftCard`:

```javascript
            <a
              href={`/contact?subject=type-rating-${aircraft.model.toLowerCase().replace(' ', '-')}`}
              className="tr-btn tr-btn--primary tr-btn--full"
              onClick={(e) => e.stopPropagation()}
            >
              Enquire Now
            </a>
```

Replace with:

```javascript
            <button
              className="tr-enquire-btn"
              onClick={(e) => { e.stopPropagation(); onEnquire(aircraft.model); }}
            >
              <span className="tr-enquire-btn__icon">↗</span>
              <span className="tr-enquire-btn__title">Enquire About This Type Rating</span>
              <span className="tr-enquire-btn__sub">Tell us your experience level and goals. We'll get back to you within 24 hours.</span>
            </button>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/TypeRating.jsx
git commit -m "feat(type-rating): replace enquire link with inline trigger button"
```

---

## Task 3: Pass onEnquire prop to each AircraftCard in the fleet grid

**Files:**
- Modify: `src/pages/TypeRating.jsx` (fleet grid render, around line 580)

- [ ] **Step 1: Find the AircraftCard usage in the fleet grid**

Find:
```javascript
                <AircraftCard
                  aircraft={aircraft}
                  isActive={selectedAircraft === i}
                  onClick={() => setSelectedAircraft(selectedAircraft === i ? null : i)}
                />
```

Replace with:
```javascript
                <AircraftCard
                  aircraft={aircraft}
                  isActive={selectedAircraft === i}
                  onClick={() => setSelectedAircraft(selectedAircraft === i ? null : i)}
                  onEnquire={handleEnquire}
                />
```

- [ ] **Step 2: Manual verification**

Start the dev server (`npm run dev` or `npm start`). Navigate to `/type-rating`. Click an aircraft card to expand it. Confirm the "Enquire Now" link is gone and the new button is visible with icon, title, and subtitle text. Check the browser console for errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/TypeRating.jsx
git commit -m "feat(type-rating): wire onEnquire handler to aircraft cards"
```

---

## Task 4: Add the enquiry form section JSX between fleet and process sections

**Files:**
- Modify: `src/pages/TypeRating.jsx` (between `</section>` closing the fleet section and `{/* ========== TRAINING PROCESS ========== */}`)

- [ ] **Step 1: Locate the insertion point**

Find this comment (it comes right after the fleet section closing tag):

```javascript
      {/* ========== TRAINING PROCESS ========== */}
```

- [ ] **Step 2: Insert the enquiry form section immediately before that comment**

```javascript
      {/* ========== ENQUIRY FORM ========== */}
      <AnimatePresence>
        {formVisible && (
          <motion.section
            ref={enquiryFormRef}
            className="tr-enquiry"
            key="enquiry-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="tr-enquiry__container">
              {formStatus === 'success' ? (
                <div className="tr-enquiry__success">
                  <span className="tr-enquiry__success-icon">✓</span>
                  <h3>Enquiry Sent</h3>
                  <p>We'll be in touch within 24 hours.</p>
                  <button
                    className="tr-btn tr-btn--outline"
                    onClick={() => { setFormStatus('idle'); setFormVisible(false); }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="tr-enquiry__header">
                    <span className="tr-pre-text">Type Rating Enquiry</span>
                    <h2>
                      <span className="tr-text--dark">{enquiryAircraft}</span>
                    </h2>
                  </div>

                  <form className="tr-enquiry__form" onSubmit={handleFormSubmit} noValidate>
                    <div className="tr-enquiry__field tr-enquiry__field--readonly">
                      <label>Aircraft</label>
                      <input type="text" value={enquiryAircraft} readOnly />
                    </div>

                    <div className="tr-enquiry__row">
                      <div className="tr-enquiry__field">
                        <label htmlFor="enq-name">Name *</label>
                        <input
                          id="enq-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="tr-enquiry__field">
                        <label htmlFor="enq-email">Email *</label>
                        <input
                          id="enq-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="tr-enquiry__field">
                      <label htmlFor="enq-phone">Phone</label>
                      <input
                        id="enq-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+44 7700 000000"
                      />
                    </div>

                    <div className="tr-enquiry__field">
                      <label htmlFor="enq-message">Message</label>
                      <textarea
                        id="enq-message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Tell us about your experience and what you're hoping to achieve..."
                      />
                    </div>

                    {formStatus === 'error' && (
                      <p className="tr-enquiry__error">
                        Something went wrong. Please try again or contact us directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="tr-btn tr-btn--primary tr-btn--full"
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ========== TRAINING PROCESS ========== */}
```

- [ ] **Step 3: Manual verification**

With the dev server running, click an aircraft card to expand it, then click the new Enquire button. Confirm:
- The form animates into view below the fleet grid
- The Aircraft field shows the correct aircraft model (read-only)
- Clicking Enquire on a different card updates the Aircraft field and re-scrolls

- [ ] **Step 4: Commit**

```bash
git add src/pages/TypeRating.jsx
git commit -m "feat(type-rating): add reveal-on-demand enquiry form section"
```

---

## Task 5: Add CSS styles for the enquire button and form section

**Files:**
- Modify: `src/pages/TypeRating.jsx` (the `<style>` block at the bottom, before the closing backtick)

- [ ] **Step 1: Locate the end of the existing style block**

Find the closing of the style tag near the bottom of the file:

```javascript
      `}
```

Just before that closing backtick, add the following CSS:

```css

        /* ===== ENQUIRE BUTTON ===== */
        .tr-enquire-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 4px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s, border-color 0.2s;
          margin-top: 1rem;
        }

        .tr-enquire-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.35);
        }

        .tr-enquire-btn__icon {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 0.35rem;
          line-height: 1;
        }

        .tr-enquire-btn__title {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #fff;
          margin-bottom: 0.3rem;
        }

        .tr-enquire-btn__sub {
          display: block;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        /* ===== ENQUIRY FORM SECTION ===== */
        .tr-enquiry {
          background: #faf9f6;
        }

        .tr-enquiry__container {
          max-width: 680px;
          margin: 0 auto;
          padding: 5rem 2rem;
        }

        .tr-enquiry__header {
          margin-bottom: 2.5rem;
        }

        .tr-enquiry__header h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0.5rem 0 0;
          line-height: 1.1;
        }

        .tr-enquiry__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .tr-enquiry__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .tr-enquiry__field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .tr-enquiry__field label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: #999;
          font-weight: 600;
        }

        .tr-enquiry__field input,
        .tr-enquiry__field textarea {
          background: #fff;
          border: 1px solid #e0ddd8;
          border-radius: 3px;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          font-family: inherit;
          color: #1a1a1a;
          transition: border-color 0.2s;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        .tr-enquiry__field input:focus,
        .tr-enquiry__field textarea:focus {
          border-color: #1a1a1a;
        }

        .tr-enquiry__field--readonly input {
          background: #f2f0ec;
          color: #666;
          cursor: default;
        }

        .tr-enquiry__field textarea {
          resize: vertical;
          min-height: 110px;
        }

        .tr-enquiry__error {
          font-size: 0.8rem;
          color: #c0392b;
          margin: 0;
        }

        .tr-enquiry__success {
          text-align: center;
          padding: 3rem 0;
        }

        .tr-enquiry__success-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #fff;
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .tr-enquiry__success h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tr-enquiry__success p {
          color: #666;
          margin: 0 0 2rem;
        }

        .tr-btn--outline {
          background: transparent;
          border: 1px solid #1a1a1a;
          color: #1a1a1a;
        }

        .tr-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        @media (max-width: 600px) {
          .tr-enquiry__row {
            grid-template-columns: 1fr;
          }
          .tr-enquiry__container {
            padding: 3rem 1.25rem;
          }
        }
```

- [ ] **Step 2: Verify visually in the browser**

With the dev server running, test:
- Expanded card → Enquire button has dark card background, ↗ icon, bold title, muted subtitle
- Clicking Enquire → form reveals with smooth animation, Aircraft field pre-populated and greyed out
- Form fields have correct focus states (border darkens)
- Mobile (< 600px): Name/Email stack to single column

- [ ] **Step 3: Commit**

```bash
git add src/pages/TypeRating.jsx
git commit -m "feat(type-rating): add enquire button and form section styles"
```

---

## Task 6: End-to-end verification and form submission test

- [ ] **Step 1: Full happy-path test**

With the dev server + backend running (`npm run dev` in one terminal, `node server.js` or equivalent in another):

1. Go to `/type-rating`
2. Click the R44 card → it expands
3. Click the Enquire button → form reveals, "Robinson R44" pre-populated
4. Click the R66 card → expands, click Enquire → form updates to "Robinson R66", re-scrolls
5. Fill in: Name = "Test Pilot", Email = "test@hqaviation.com", Message = "Test enquiry"
6. Click "Send Enquiry"
7. Confirm "Enquiry Sent" success state appears

- [ ] **Step 2: Verify in admin panel**

Go to `/admin` → Leads. Confirm a new lead appears with:
- Subject: "Type Rating — Robinson R66"
- Source: "type-rating-page"
- Name, email, message as entered

- [ ] **Step 3: Error state test**

With the backend stopped, submit the form. Confirm the error message appears and the button re-enables.

- [ ] **Step 4: Final commit**

```bash
git add src/pages/TypeRating.jsx
git commit -m "feat(type-rating): inline enquiry form with admin integration complete"
```
