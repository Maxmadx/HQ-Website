# Stripe Integration Design — Discovery Flight Booking

**Date:** 2026-04-07  
**Status:** Approved  
**Scope:** Payment flow for Discovery Flight helicopter experience bookings

---

## Overview

Enable users to purchase a Discovery Flight experience directly on the HQ Aviation website. The user selects a helicopter and duration on the Discovery Flight page, is redirected to a custom checkout page, enters their details and card information, and on success sees a confirmation page and receives a confirmation email. Date/time scheduling happens later via phone call with the HQ team.

---

## User Flow

```
DiscoveryFlight page
  → User selects helicopter (R22 / R44 / R66) + duration (30 / 60 mins)
  → Clicks "Book Now"
  → Redirected to /checkout?aircraft=r44&duration=60&price=605

/checkout page
  → Displays order summary (aircraft, duration, price)
  → User fills in: name, email, phone
  → User enters card details via Stripe Elements
  → Clicks "Pay £XXX"
  → On success → redirect to /booking-confirmed

/booking-confirmed page
  → Shows booking reference, aircraft, duration, price paid
  → Notes that HQ will be in touch to schedule the flight

(Background) Stripe webhook → payment_intent.succeeded
  → Sends confirmation email to customer
```

---

## Architecture

### Frontend (React/Vite)

| File | Purpose |
|------|---------|
| `src/pages/Checkout.jsx` | Checkout page with order summary, customer form, Stripe Elements |
| `src/pages/BookingConfirmed.jsx` | Post-payment confirmation page |
| `src/config/routes.js` | Add `/checkout` and `/booking-confirmed` routes |
| `src/pages/DiscoveryFlight.jsx` | Wire "Select Duration" buttons to navigate with query params |

### Backend (Express)

| File | Purpose |
|------|---------|
| `src/api/stripe.js` | Price map, payment intent creation logic |
| `server.js` | Add `/api/create-payment-intent` and `/api/webhook` endpoints |

### Environment & Config

| File | Purpose |
|------|---------|
| `.env` | Secret keys — gitignored |
| `.env.example` | Committed placeholder showing required variable names |

---

## Price Map (Server-Side — Source of Truth)

Prices are defined exclusively on the server in pence. The frontend passes `aircraft` and `duration` identifiers only — never the amount — preventing client-side price manipulation.

```js
const PRICES = {
  r22: { 30: 18000, 60: 36000 },   // £180 / £360
  r44: { 30: 30500, 60: 60500 },   // £305 / £605
  r66: { 30: 45000, 60: 85000 },   // £450 / £850
}
```

---

## API Endpoints

### POST /api/create-payment-intent

**Request:**
```json
{
  "aircraft": "r44",
  "duration": 60,
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+44 7700 900000"
}
```

**Server behaviour:**
1. Look up price from server-side `PRICES` map using `aircraft` + `duration`
2. Reject unknown aircraft/duration combinations with 400
3. Create Stripe PaymentIntent with `amount`, `currency: "gbp"`, and metadata (aircraft, duration, name, email, phone)
4. Return `{ clientSecret }` to frontend

**Response:**
```json
{ "clientSecret": "pi_xxx_secret_xxx" }
```

### POST /api/webhook

- Receives Stripe webhook events
- Verifies signature using `STRIPE_WEBHOOK_SECRET` before processing
- Handles `payment_intent.succeeded`:
  - Extracts customer details from PaymentIntent metadata
  - Sends confirmation email via SMTP (nodemailer)
- Returns `200` immediately to acknowledge receipt

---

## Checkout Page (Stripe Elements)

1. **Order summary panel** — aircraft name, duration, price (read from query params, display only)
2. **Customer form** — name (required), email (required), phone (required)
3. **Stripe Elements card input** — mounts using publishable key from `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`
4. **Submit button** — "Pay £XXX", disabled during loading
5. **Error display** — Stripe decline messages shown inline below card input; network errors shown as generic message

---

## Confirmation Email

Sent from webhook on `payment_intent.succeeded`. Contains:
- Aircraft type and duration
- Price paid
- Booking reference (Stripe PaymentIntent ID)
- Note that HQ Aviation will be in touch to schedule the flight

Transport: `nodemailer` with SMTP — credentials supplied via environment variables, compatible with any provider (SendGrid, Mailgun, Gmail SMTP, etc.).

---

## Error Handling

| Scenario | Handling |
|----------|---------|
| Invalid/missing query params on `/checkout` | Redirect to `/training/trial-lessons` |
| Unknown aircraft or duration sent to API | 400 response, frontend shows generic error |
| Stripe card decline | Display Stripe's error message below card input |
| Network error on payment intent creation | Generic "Something went wrong, please try again" |
| Invalid webhook signature | 400, do not process |

---

## Environment Variables

```bash
# .env (never commit this file)

# Stripe — fill in after creating your Stripe account
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME

# Stripe — safe to expose on frontend (publishable key)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME

# Email — fill in with your SMTP provider credentials
SMTP_HOST=smtp.REPLACE_ME
SMTP_PORT=587
SMTP_USER=REPLACE_ME
SMTP_PASS=REPLACE_ME
EMAIL_FROM=bookings@hqaviation.co.uk
```

---

## Dependencies to Install

```bash
# Backend
npm install stripe nodemailer

# Frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## Security Checklist

- [x] Stripe secret key only on server, never in frontend bundle
- [x] Publishable key exposed via `VITE_` prefix (Vite convention, safe by design)
- [x] Price calculated server-side from trusted map — frontend cannot manipulate amount
- [x] Webhook signature verified before processing
- [x] `.env` gitignored
- [x] Customer data attached as PaymentIntent metadata only — no PII stored in your own database

---

## Placeholders to Fill In Later

1. `STRIPE_SECRET_KEY` — from Stripe dashboard after account creation
2. `VITE_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard
3. `STRIPE_WEBHOOK_SECRET` — generated when registering webhook endpoint in Stripe dashboard (set endpoint to `https://yourdomain.com/api/webhook`)
4. SMTP credentials — from your chosen email provider
5. `EMAIL_FROM` — your sending address
