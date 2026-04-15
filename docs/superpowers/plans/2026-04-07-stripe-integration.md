# Stripe Payment Integration — Discovery Flight

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add end-to-end Stripe payment to the Discovery Flight page — user selects helicopter + duration, pays on /checkout, lands on /booking-confirmed, and receives a confirmation email.

**Architecture:** React frontend uses `@stripe/react-stripe-js` to render a Stripe Elements card input inside a custom `/checkout` page. The Express backend exposes two endpoints: `POST /api/create-payment-intent` (server-side price lookup → creates PaymentIntent → returns client secret) and `POST /api/webhook` (verifies Stripe signature → sends confirmation email via nodemailer). Stripe secret key and webhook secret live only in `.env`; the publishable key is exposed safely via `VITE_` prefix.

**Tech Stack:** React 19, Vite 8, Express 4, `stripe` (Node SDK), `@stripe/stripe-js`, `@stripe/react-stripe-js`, `nodemailer`, `vitest` (unit tests for price validation)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `api/stripe.js` | Price map, `createPaymentIntent()`, `sendConfirmationEmail()`, `handleWebhook()` |
| Create | `src/pages/Checkout.jsx` | Order summary + customer form + Stripe Elements card input + submission logic |
| Create | `src/pages/BookingConfirmed.jsx` | Post-payment confirmation screen |
| Create | `.env` | Secret keys — already gitignored |
| Create | `.env.example` | Committed placeholder showing required variable names |
| Modify | `package.json` | Add `stripe`, `nodemailer`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `vitest` |
| Modify | `server.js` | Mount `/api/create-payment-intent` and `/api/webhook` routes |
| Modify | `vite.config.js` | Add `/api` proxy so dev Vite server forwards to Express on port 7500 |
| Modify | `src/App.jsx` | Register `/checkout` and `/booking-confirmed` routes |
| Modify | `src/pages/DiscoveryFlight.jsx` | Replace `window.location.href` in `handleBook` with React Router `useNavigate` |

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install backend dependencies**

```bash
npm install stripe nodemailer
```

Expected output: added 2 packages (stripe, nodemailer appear in `dependencies` in package.json)

- [ ] **Step 2: Install frontend dependencies**

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Expected output: added 2 packages in `dependencies`.

- [ ] **Step 3: Install vitest for unit tests**

```bash
npm install --save-dev vitest
```

- [ ] **Step 4: Add test script to package.json**

Open `package.json`. Replace the test script line:

```json
"test": "echo \"No tests configured\" && exit 0"
```

with:

```json
"test": "vitest run"
```

- [ ] **Step 5: Verify**

```bash
npm test
```

Expected: `No test files found` or similar — no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "chore: install stripe, nodemailer, vitest"
```

---

### Task 2: Environment variables

**Files:**
- Create: `.env`
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`** (this file IS committed — it's just key names, no real values)

Create `/Users/maximussmith/Downloads/HQ-Website-main/.env.example` with:

```bash
# Stripe — get these from your Stripe dashboard after creating an account
# Test keys start with sk_test_ / pk_test_
# Live keys start with sk_live_ / pk_live_
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME

# Stripe publishable key — safe to expose on the frontend (VITE_ prefix required by Vite)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME

# Email — SMTP credentials for sending confirmation emails
# Works with any SMTP provider: SendGrid, Mailgun, Gmail SMTP, etc.
SMTP_HOST=smtp.REPLACE_ME
SMTP_PORT=587
SMTP_USER=REPLACE_ME
SMTP_PASS=REPLACE_ME
EMAIL_FROM=bookings@hqaviation.co.uk
```

- [ ] **Step 2: Create `.env`** (gitignored — never committed)

Create `/Users/maximussmith/Downloads/HQ-Website-main/.env` with the same keys but actual values left as placeholders for now:

```bash
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME
SMTP_HOST=smtp.REPLACE_ME
SMTP_PORT=587
SMTP_USER=REPLACE_ME
SMTP_PASS=REPLACE_ME
EMAIL_FROM=bookings@hqaviation.co.uk
```

- [ ] **Step 3: Load `.env` in server.js**

Open `server.js`. Add this as the very first line (before any require statements):

```js
require('dotenv').config();
```

Wait — check if `dotenv` is installed:

```bash
node -e "require('dotenv')"
```

If that throws `MODULE_NOT_FOUND`, install it:

```bash
npm install dotenv
```

Then add `require('dotenv').config();` as the first line of `server.js`.

- [ ] **Step 4: Verify env loads**

```bash
node -e "require('dotenv').config(); console.log(process.env.STRIPE_SECRET_KEY)"
```

Expected: `sk_test_REPLACE_ME`

- [ ] **Step 5: Commit**

```bash
git add .env.example server.js package.json package-lock.json
git commit -m "chore: add env variable setup and dotenv"
```

Note: `.env` is gitignored and will not be staged.

---

### Task 3: Create `api/stripe.js` — price map and Stripe logic

**Files:**
- Create: `api/stripe.js`
- Create: `api/stripe.test.js`

This file is server-side only. It uses CommonJS (`require`/`module.exports`) to match the rest of `server.js`.

- [ ] **Step 1: Write the failing test first**

Create `/Users/maximussmith/Downloads/HQ-Website-main/api/stripe.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { getPrice } from './stripe.js';

describe('getPrice', () => {
  it('returns correct price in pence for r22 30 min', () => {
    expect(getPrice('r22', 30)).toBe(18000);
  });

  it('returns correct price in pence for r44 60 min', () => {
    expect(getPrice('r44', 60)).toBe(60500);
  });

  it('returns correct price in pence for r66 30 min', () => {
    expect(getPrice('r66', 30)).toBe(45000);
  });

  it('returns correct price in pence for r66 60 min', () => {
    expect(getPrice('r66', 60)).toBe(85000);
  });

  it('returns null for unknown aircraft', () => {
    expect(getPrice('r99', 30)).toBeNull();
  });

  it('returns null for unknown duration', () => {
    expect(getPrice('r22', 45)).toBeNull();
  });

  it('returns null for null inputs', () => {
    expect(getPrice(null, null)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module './stripe.js'`

- [ ] **Step 3: Create `api/stripe.js`**

Create `/Users/maximussmith/Downloads/HQ-Website-main/api/stripe.js`:

```js
'use strict';

const Stripe = require('stripe');
const nodemailer = require('nodemailer');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Prices in pence (GBP). This is the server-side source of truth.
// Frontend only sends aircraft + duration identifiers — never an amount.
const PRICES = {
  r22: { 30: 18000, 60: 36000 },
  r44: { 30: 30500, 60: 60500 },
  r66: { 30: 45000, 60: 85000 },
};

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

/**
 * Returns the price in pence for a given aircraft + duration, or null if invalid.
 */
function getPrice(aircraft, duration) {
  if (!aircraft || !duration) return null;
  const aircraftPrices = PRICES[aircraft];
  if (!aircraftPrices) return null;
  return aircraftPrices[Number(duration)] ?? null;
}

/**
 * Creates a Stripe PaymentIntent with a server-validated price.
 * Throws with statusCode 400 if aircraft/duration is invalid.
 */
async function createPaymentIntent({ aircraft, duration, customerName, customerEmail, customerPhone }) {
  const amount = getPrice(aircraft, duration);
  if (!amount) {
    const err = new Error(`Invalid aircraft or duration: ${aircraft} / ${duration}`);
    err.statusCode = 400;
    throw err;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'gbp',
    metadata: {
      aircraft,
      aircraftName: AIRCRAFT_NAMES[aircraft],
      duration: String(duration),
      customerName,
      customerEmail,
      customerPhone,
    },
  });

  return paymentIntent;
}

/**
 * Sends a booking confirmation email to the customer.
 */
async function sendConfirmationEmail({ customerName, customerEmail, aircraft, duration, amount, bookingRef }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const priceFormatted = `£${(amount / 100).toFixed(2)}`;
  const aircraftName = AIRCRAFT_NAMES[aircraft] || aircraft;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Discovery Flight Booking Confirmed — ${aircraftName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Your Discovery Flight is Booked</h1>
        <p>Hi ${customerName},</p>
        <p>Thank you for booking your Discovery Flight with HQ Aviation. We'll be in touch shortly to schedule your flight at a date and time that suits you.</p>

        <div style="background: #f9f9f9; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 3px solid #1a1a1a;">
          <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px; color: #666;">Booking Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666;">Aircraft</td><td style="padding: 6px 0; font-weight: 600;">${aircraftName}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Duration</td><td style="padding: 6px 0; font-weight: 600;">${duration} minutes</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Amount Paid</td><td style="padding: 6px 0; font-weight: 600;">${priceFormatted}</td></tr>
            <tr><td style="padding: 6px 0; color: #aaa; font-size: 12px;">Reference</td><td style="padding: 6px 0; color: #aaa; font-size: 12px;">${bookingRef}</td></tr>
          </table>
        </div>

        <p style="color: #666; font-size: 14px; margin-top: 32px;">HQ Aviation · Denham Aerodrome · Buckinghamshire · UB9 5DF</p>
      </div>
    `,
  });
}

/**
 * Handles an incoming Stripe webhook request.
 * Verifies signature and processes payment_intent.succeeded.
 * req.body must be the raw Buffer (use express.raw middleware on this route).
 */
async function handleWebhook(req) {
  const sig = req.headers['stripe-signature'];

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const { aircraft, duration, customerName, customerEmail } = pi.metadata;

    await sendConfirmationEmail({
      customerName,
      customerEmail,
      aircraft,
      duration: Number(duration),
      amount: pi.amount,
      bookingRef: pi.id,
    });
  }
}

module.exports = { getPrice, createPaymentIntent, handleWebhook };
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add api/stripe.js api/stripe.test.js
git commit -m "feat: add server-side stripe price map and payment intent logic"
```

---

### Task 4: Add API routes to `server.js`

**Files:**
- Modify: `server.js`

- [ ] **Step 1: Add the require for api/stripe.js**

Open `server.js`. After the existing `require` statements at the top (after `const compression = require('compression');`), add:

```js
const { createPaymentIntent, handleWebhook } = require('./api/stripe');
```

- [ ] **Step 2: Add the two API routes**

In `server.js`, find the `// ROUTES` section comment. Add these two routes immediately after it (before any existing route handlers):

```js
// ============================================
// STRIPE API ROUTES
// ============================================

// POST /api/create-payment-intent
// Creates a Stripe PaymentIntent using server-side validated price.
// Uses express.json() middleware inline so it doesn't affect the webhook route.
app.post('/api/create-payment-intent', express.json(), async (req, res) => {
  const { aircraft, duration, customerName, customerEmail, customerPhone } = req.body || {};

  if (!aircraft || !duration || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const paymentIntent = await createPaymentIntent({
      aircraft,
      duration: Number(duration),
      customerName,
      customerEmail,
      customerPhone,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/webhook
// Receives Stripe webhook events. MUST use express.raw() — Stripe requires
// the raw body buffer to verify the webhook signature. Do NOT use express.json() here.
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await handleWebhook(req);
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});
```

- [ ] **Step 3: Verify server starts without errors**

```bash
node server.js
```

Expected: Server starts on port 7500, no crash. Press Ctrl+C to stop.

- [ ] **Step 4: Smoke-test the payment intent endpoint**

```bash
curl -X POST http://localhost:7500/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"aircraft":"r44","duration":60,"customerName":"Test User","customerEmail":"test@test.com","customerPhone":"07700900000"}'
```

Expected with placeholder key: `{"error":"No API key provided"}` or similar Stripe auth error (confirming the route is reachable and price validation passed). Once you have a real test key it will return `{"clientSecret":"pi_..."}`.

- [ ] **Step 5: Commit**

```bash
git add server.js
git commit -m "feat: add /api/create-payment-intent and /api/webhook routes"
```

---

### Task 5: Configure Vite dev proxy

**Files:**
- Modify: `vite.config.js`

In development, `npm run dev` runs the Vite dev server (port 5173). API calls to `/api/...` must be proxied to the Express server (port 7500). In production, both are served by Express so no proxy is needed.

- [ ] **Step 1: Update `vite.config.js`**

Replace the entire contents of `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7500',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 2: Verify dev server starts**

In one terminal:
```bash
node server.js
```

In another terminal:
```bash
npm run dev
```

Expected: Vite dev server starts without errors.

- [ ] **Step 3: Commit**

```bash
git add vite.config.js
git commit -m "chore: add vite proxy for /api routes in development"
```

---

### Task 6: Update `DiscoveryFlight.jsx` — wire "Book Now" to `/checkout`

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx:530-543`

The `FlightSelector` component at line 530 currently uses `window.location.href` in `handleBook`. Replace it with React Router's `useNavigate`.

- [ ] **Step 1: Add `useNavigate` import**

Open `src/pages/DiscoveryFlight.jsx`. Find the existing React Router import (line ~13):

```js
import { Link } from 'react-router-dom';
```

Replace with:

```js
import { Link, useNavigate } from 'react-router-dom';
```

- [ ] **Step 2: Update `FlightSelector` to use `useNavigate`**

Find the `FlightSelector` function (line ~530). Replace the entire function definition — specifically the state declarations and both handlers — as follows.

Find this block (lines ~530–543):

```js
function FlightSelector() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeSelect = (cardId, time) => {
    setSelectedCard(cardId);
    setSelectedTime(time);
  };

  const handleBook = (cardId) => {
    if (selectedCard === cardId && selectedTime) {
      window.location.href = `/contact?subject=discovery-flight&aircraft=${cardId}&time=${selectedTime}`;
    }
  };
```

Replace with:

```js
function FlightSelector() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const handleTimeSelect = (cardId, time) => {
    setSelectedCard(cardId);
    setSelectedTime(time);
  };

  const handleBook = (cardId) => {
    if (selectedCard === cardId && selectedTime) {
      const aircraft = aircraftData.find(a => a.id === cardId);
      const price = aircraft.pricing[selectedTime];
      navigate(`/checkout?aircraft=${cardId}&duration=${selectedTime}&price=${price}`);
    }
  };
```

- [ ] **Step 3: Verify the page still renders**

```bash
npm run dev
```

Navigate to `/training/trial-lessons`. Select a duration on any card — the "Book Now" button should become active. Clicking it should attempt to navigate to `/checkout?aircraft=...` (will 404 until Task 8, that's fine).

- [ ] **Step 4: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat: wire discovery flight book button to /checkout"
```

---

### Task 7: Create `src/pages/Checkout.jsx`

**Files:**
- Create: `src/pages/Checkout.jsx`

- [ ] **Step 1: Create `src/pages/Checkout.jsx`**

```jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: "'Space Grotesk', Arial, sans-serif",
      '::placeholder': { color: '#aaa' },
    },
    invalid: { color: '#e74c3c' },
  },
};

// ─── Payment Form ────────────────────────────────────────────────────────────
function CheckoutForm({ aircraft, duration, price }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // 1. Ask the server to create a PaymentIntent (price is validated server-side)
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aircraft,
          duration: Number(duration),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment.');

      // 2. Confirm the card payment using the client secret from the server
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email, phone },
        },
      });

      if (result.error) {
        // Stripe provides user-friendly decline messages
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        navigate(
          `/booking-confirmed?ref=${result.paymentIntent.id}` +
          `&aircraft=${aircraft}&duration=${duration}&price=${price}` +
          `&name=${encodeURIComponent(name)}`
        );
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input
          style={styles.input}
          type="tel"
          placeholder="+44 7700 900000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Details</label>
        <div style={styles.cardElement}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={!stripe || loading} style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
        {loading ? 'Processing…' : `Pay £${price}`}
      </button>

      <p style={styles.secureNote}>
        🔒 Payments are processed securely by Stripe. HQ Aviation never sees your card details.
      </p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');

  // Redirect back if query params are missing or aircraft is unrecognised
  if (!aircraft || !duration || !price || !AIRCRAFT_NAMES[aircraft]) {
    navigate('/training/trial-lessons', { replace: true });
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back link */}
        <Link to="/training/trial-lessons" style={styles.back}>← Back</Link>

        <h1 style={styles.heading}>Complete Your Booking</h1>
        <p style={styles.subheading}>Pay now — we'll call you to schedule your flight.</p>

        <div style={styles.layout}>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryHeading}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Aircraft</span>
              <span style={styles.summaryValue}>{AIRCRAFT_NAMES[aircraft]}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Experience</span>
              <span style={styles.summaryValue}>{duration} Minute Discovery Flight</span>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginTop: '8px' }}>
              <span style={{ ...styles.summaryLabel, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
              <span style={{ ...styles.summaryValue, fontWeight: 700, fontSize: '1.25rem' }}>£{price}</span>
            </div>
            <p style={styles.summaryNote}>
              After payment, a member of the HQ Aviation team will contact you to arrange a date and time.
            </p>
          </div>

          {/* Payment Form */}
          <div style={styles.formPanel}>
            <h2 style={styles.formHeading}>Your Details &amp; Payment</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm aircraft={aircraft} duration={duration} price={price} />
            </Elements>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#faf9f6',
    padding: '40px 20px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  back: {
    display: 'inline-block',
    marginBottom: '32px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.05em',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 8px',
  },
  subheading: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 40px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr',
    gap: '40px',
    alignItems: 'start',
  },
  summary: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    padding: '28px',
  },
  summaryHeading: {
    fontSize: '13px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    margin: '0 0 20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#666',
  },
  summaryValue: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: 500,
    textAlign: 'right',
  },
  summaryNote: {
    fontSize: '12px',
    color: '#999',
    lineHeight: 1.6,
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
  },
  formPanel: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    padding: '28px',
  },
  formHeading: {
    fontSize: '13px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    margin: '0 0 20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1a1a1a',
    letterSpacing: '0.02em',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    color: '#1a1a1a',
    background: '#faf9f6',
    outline: 'none',
  },
  cardElement: {
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    background: '#faf9f6',
  },
  error: {
    color: '#c0392b',
    fontSize: '14px',
    margin: '0',
    padding: '10px 14px',
    background: '#fdf0ef',
    borderRadius: '6px',
    border: '1px solid #f5c6c2',
  },
  btn: {
    padding: '14px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  btnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  secureNote: {
    fontSize: '12px',
    color: '#aaa',
    textAlign: 'center',
    margin: '0',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat: add Checkout page with Stripe Elements"
```

---

### Task 8: Create `src/pages/BookingConfirmed.jsx`

**Files:**
- Create: `src/pages/BookingConfirmed.jsx`

- [ ] **Step 1: Create `src/pages/BookingConfirmed.jsx`**

```jsx
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
};

export default function BookingConfirmed() {
  const [searchParams] = useSearchParams();

  const ref = searchParams.get('ref');
  const aircraft = searchParams.get('aircraft');
  const duration = searchParams.get('duration');
  const price = searchParams.get('price');
  const name = searchParams.get('name');

  const aircraftName = AIRCRAFT_NAMES[aircraft] || aircraft || 'Discovery Flight';

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Success mark */}
        <div style={styles.checkmark}>✓</div>

        <h1 style={styles.heading}>Booking Confirmed</h1>
        <p style={styles.subheading}>
          {name ? `Thank you, ${name}.` : 'Thank you.'} Your Discovery Flight has been booked.
        </p>

        {/* Summary card */}
        <div style={styles.card}>
          <h2 style={styles.cardHeading}>Booking Summary</h2>

          <div style={styles.row}>
            <span style={styles.label}>Aircraft</span>
            <span style={styles.value}>{aircraftName}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Duration</span>
            <span style={styles.value}>{duration} minutes</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Amount Paid</span>
            <span style={styles.value}>£{price}</span>
          </div>
          {ref && (
            <div style={{ ...styles.row, borderTop: '1px solid #f0f0f0', marginTop: '12px', paddingTop: '12px' }}>
              <span style={{ ...styles.label, fontSize: '12px', color: '#bbb' }}>Booking Reference</span>
              <span style={{ ...styles.value, fontSize: '12px', color: '#bbb', fontFamily: "'Share Tech Mono', monospace" }}>{ref}</span>
            </div>
          )}
        </div>

        <p style={styles.nextStep}>
          A member of the HQ Aviation team will be in touch shortly to arrange a date and time for your flight.
        </p>

        <p style={styles.emailNote}>
          A confirmation email has been sent to your inbox.
        </p>

        <Link to="/" style={styles.homeLink}>Return to HQ Aviation</Link>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#faf9f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  },
  container: {
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
  },
  checkmark: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 12px',
  },
  subheading: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 32px',
    lineHeight: 1.6,
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    padding: '28px',
    textAlign: 'left',
    marginBottom: '28px',
  },
  cardHeading: {
    fontSize: '13px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    margin: '0 0 20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
  },
  label: {
    fontSize: '14px',
    color: '#666',
  },
  value: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: 600,
  },
  nextStep: {
    fontSize: '15px',
    color: '#444',
    lineHeight: 1.7,
    margin: '0 0 12px',
  },
  emailNote: {
    fontSize: '13px',
    color: '#aaa',
    margin: '0 0 32px',
  },
  homeLink: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/BookingConfirmed.jsx
git commit -m "feat: add BookingConfirmed page"
```

---

### Task 9: Register new routes in `App.jsx`

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add imports**

Open `src/App.jsx`. After the last import (line ~73, before `// Import styles`), add:

```js
import Checkout from './pages/Checkout';
import BookingConfirmed from './pages/BookingConfirmed';
```

- [ ] **Step 2: Add routes**

In the `<Routes>` block, find the `DiscoveryFlight` route (line ~130):

```jsx
<Route path="/training/trial-lessons" element={<DiscoveryFlight />} />
```

Add the two new routes immediately after it:

```jsx
<Route path="/checkout" element={<Checkout />} />
<Route path="/booking-confirmed" element={<BookingConfirmed />} />
```

- [ ] **Step 3: Verify the full dev flow**

Start both servers:

```bash
# Terminal 1
node server.js

# Terminal 2
npm run dev
```

1. Go to `http://localhost:5173/training/trial-lessons`
2. Click a duration row (e.g. R44 — 30 MINS) → button becomes "Book Now - £305"
3. Click "Book Now" → should redirect to `/checkout?aircraft=r44&duration=30&price=305`
4. Checkout page should render with order summary and payment form
5. Navigate to `/booking-confirmed?aircraft=r44&duration=30&price=305&name=Test` — confirmation page should render

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: register /checkout and /booking-confirmed routes"
```

---

### Task 10: Fill in Stripe keys and test end-to-end

This task is for when you have created your Stripe account. Follow these steps once you have real test keys.

- [ ] **Step 1: Get your Stripe test keys**

1. Create an account at [stripe.com](https://stripe.com)
2. Go to Developers → API keys in the Stripe dashboard
3. Copy the **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)
4. Update `.env` with both values

- [ ] **Step 2: Register the webhook endpoint**

1. In Stripe dashboard → Developers → Webhooks → Add endpoint
2. Set URL to `https://yourdomain.com/api/webhook` (or use the Stripe CLI for local testing — see Step 3)
3. Select event: `payment_intent.succeeded`
4. Copy the **Signing secret** (`whsec_...`) → add to `.env` as `STRIPE_WEBHOOK_SECRET`

- [ ] **Step 3: Test webhook locally with Stripe CLI**

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe login
stripe listen --forward-to localhost:7500/api/webhook
```

The CLI will print a webhook signing secret — add it to `.env` as `STRIPE_WEBHOOK_SECRET`.

- [ ] **Step 4: Fill in SMTP credentials**

Update `.env` with your email provider credentials:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

If using Gmail with an App Password:
- `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=your@gmail.com`, `SMTP_PASS=your-app-password`

- [ ] **Step 5: End-to-end test with Stripe test card**

1. Go to `/training/trial-lessons` → select R22 30 min → click "Book Now"
2. Fill in name, email, phone
3. Enter Stripe test card: `4242 4242 4242 4242` · any future expiry · any CVC
4. Click "Pay £180"
5. Confirm redirect to `/booking-confirmed`
6. Confirm confirmation email arrives in inbox
7. Check Stripe dashboard → Payments — payment should appear as "Succeeded"

- [ ] **Step 6: Test card decline handling**

Use Stripe test card `4000 0000 0000 9995` (card declined). Confirm the error message appears below the card input without crashing.
