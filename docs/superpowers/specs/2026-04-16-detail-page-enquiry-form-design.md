# Aircraft Detail Page Enquiry Form — Design Spec

**Date:** 2026-04-16
**Status:** Approved

## Problem

The enquiry form on `UsedAircraftDetail.jsx` (`/sales/pre-owned/:id`) has:
- `onSubmit={(e) => e.preventDefault()}` — submits nothing
- No connection to admin leads (`/api/leads` endpoint or Firestore `leads` collection)
- No user feedback on submission
- A plain unstyled submit button inconsistent with the rest of the site's design language

## Goal

- Wire form to `/api/leads` — enquiries appear in `/admin/leads`
- Replace plain submit button with `fd-sales__intent-btn` style (icon + title + sub)
- Show `fd-sales__unmanned-success` style confirmation when submitted
- Show inline error message if submission fails
- All changes contained to `src/pages/UsedAircraftDetail.jsx`

## Changes — `src/pages/UsedAircraftDetail.jsx`

### 1. New state (add inside `UsedAircraftDetail` component)

```js
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [message, setMessage] = useState('');
const [submitting, setSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [enquiryError, setEnquiryError] = useState('');
```

### 2. Submit handler (add inside component, after state)

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

### 3. JSX — wrap `uad-register` in submitted conditional

Replace the existing `<div className="uad-register">` block (lines ~733–768) with:

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
    {/* ...header, call strip, divider unchanged... */}
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

### 4. CSS — add to `styles` string

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
.uad-success-sub { font-size: 0.82rem; color: #888; line-height: 1.5; }
```

## Data Flow

```
User fills form → handleEnquirySubmit fires
  → POST /api/leads { name, email, phone, subject, message, source: 'aircraft-detail-enquiry' }
  → api/leads.js validates + writes to Firestore 'leads' collection
  → setSubmitted(true) → uad-register replaced with uad-success
  → Lead appears in /admin/leads with status 'new'
```

## Out of Scope

- Email notifications to admin (existing `/api/leads` does not send emails — separate feature)
- Email confirmation to the enquirer
- Any changes outside `UsedAircraftDetail.jsx`
