> **ARCHIVED 2026-05-12**
> This plan was abandoned with zero matching code in `src/` or `api/`. Replaced by `docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md` §3 (non-goals). Do not implement.

# Analytics Funnel — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Squarespace-style purchase funnel to `/admin/analytics` for the Discovery Flight booking path, using GA4-canonical event names. Ship without any new collections — pure event extension + dashboard tile.

**Architecture:** Extend existing `trackEvent` and `page_events` ingest pipeline to accept GA4-canonical ecommerce events (`view_item`, `begin_checkout`, `add_payment_info`, `purchase`). Fire from `DiscoveryFlight.jsx`, `Checkout.jsx`, and the Stripe webhook. Aggregate at read time in pure functions; render as a funnel tile in `AdminAnalytics.jsx`. Behind a `VITE_FUNNEL_ENABLED` flag for instant rollback.

**Tech Stack:** React + Vite, Firebase Firestore, Express, Vitest. All existing — no new deps.

**Spec:** `docs/superpowers/specs/2026-04-29-squarespace-analytics-parity-design.md`

---

## File Structure

**Modified:**
- `src/lib/analytics.js` — `trackEvent` accepts an optional 4th `data` arg for ecommerce payload (`items`, `value`, `currency`, `transactionId`, `itemCategory`).
- `src/lib/analytics.test.js` — new tests for ecommerce payload pass-through.
- `api/analytics-api.js` — extend `ALLOWED_TYPES` allowlist; persist new fields with size caps.
- `src/pages/DiscoveryFlight.jsx` — fire `view_item` on mount, `begin_checkout` on Book Now.
- `src/pages/Checkout.jsx` — fire `add_payment_info` on card-form submit.
- `api/stripe.js` — fire `purchase` from webhook handler (server-side, idempotent).
- `src/pages/admin/AdminAnalytics.jsx` — register PurchaseFunnel tile behind env flag.

**New:**
- `src/components/admin/analytics/funnelAggregations.js` — pure aggregation functions.
- `src/components/admin/analytics/funnelAggregations.test.js` — exhaustive unit tests.
- `src/components/admin/analytics/PurchaseFunnel.jsx` — funnel tile component.
- `src/components/admin/analytics/PurchaseFunnel.test.jsx` — render test.

**Test runner:** `npm test` (vitest). All tests live next to the file under test.

**Discovery Flight product categories** used by tests and runtime:
- `discovery-flight` (covers `/training/trial-lessons` and `/training/discovery-flights`)

---

## Task 1: Extend `trackEvent` to accept ecommerce payload

Adds an optional 4th argument carrying GA4-shaped ecommerce data. Backwards compatible — every existing call site keeps working.

**Files:**
- Modify: `src/lib/analytics.js`
- Test: `src/lib/analytics.test.js`

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/analytics.test.js` (inside the existing `describe('analytics', …)` block, before the closing `});`):

```javascript
  it('trackEvent passes ecommerce payload fields through', async () => {
    await trackEvent('view_item', null, '/training/trial-lessons', {
      items: [{ item_id: 'r44-60', item_name: 'R44 60min', item_category: 'discovery-flight', price: 350, currency: 'gbp' }],
      value: 350,
      currency: 'gbp',
      itemCategory: 'discovery-flight',
    });
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.eventType).toBe('view_item');
    expect(body.items).toEqual([{ item_id: 'r44-60', item_name: 'R44 60min', item_category: 'discovery-flight', price: 350, currency: 'gbp' }]);
    expect(body.value).toBe(350);
    expect(body.currency).toBe('gbp');
    expect(body.itemCategory).toBe('discovery-flight');
  });

  it('trackEvent omits ecommerce fields when not provided', async () => {
    await trackEvent('pageview');
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.items).toBeUndefined();
    expect(body.value).toBeUndefined();
    expect(body.currency).toBeUndefined();
    expect(body.transactionId).toBeUndefined();
    expect(body.itemCategory).toBeUndefined();
  });

  it('trackEvent passes transactionId for purchase events', async () => {
    await trackEvent('purchase', null, '/booking-confirmed', {
      transactionId: 'pi_123abc',
      value: 350,
      currency: 'gbp',
      items: [{ item_id: 'r44-60', item_category: 'discovery-flight' }],
      itemCategory: 'discovery-flight',
    });
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.transactionId).toBe('pi_123abc');
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- analytics.test.js`
Expected: FAIL — the 3 new tests fail because `trackEvent` does not accept the 4th arg.

- [ ] **Step 3: Update `trackEvent` signature**

Replace the entire contents of `src/lib/analytics.js` with:

```javascript
/**
 * Lightweight client-side analytics utility.
 * Session ID persists for the browser tab (sessionStorage).
 */

export function getSessionId() {
  const key = 'hq_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Read UTM params from the current URL.
 * Returns an object with utmSource/Medium/Campaign/Term/Content (null when absent).
 */
function getUtmParams() {
  if (typeof window === 'undefined') {
    return { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    utmTerm: params.get('utm_term'),
    utmContent: params.get('utm_content'),
  };
}

/**
 * Send a tracking event to the server. Fire-and-forget — never throws.
 * @param {string} eventType  pageview | cta_click | form_submit | image_view | scroll_depth | page_exit | view_item | begin_checkout | add_payment_info | purchase
 * @param {string|null} [elementId]  Optional element identifier
 * @param {string|null} [page]  Defaults to window.location.pathname
 * @param {object} [data]  Optional ecommerce payload: { items, value, currency, transactionId, itemCategory }
 */
export async function trackEvent(eventType, elementId = null, page = null, data = null) {
  try {
    const body = {
      sessionId: getSessionId(),
      page: page ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
      eventType,
      elementId,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      ...getUtmParams(),
    };
    if (data) {
      if (data.items !== undefined) body.items = data.items;
      if (data.value !== undefined) body.value = data.value;
      if (data.currency !== undefined) body.currency = data.currency;
      if (data.transactionId !== undefined) body.transactionId = data.transactionId;
      if (data.itemCategory !== undefined) body.itemCategory = data.itemCategory;
    }
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // Silently swallow — analytics must never break the site
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- analytics.test.js`
Expected: PASS — all 8 tests (5 original + 3 new).

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.js src/lib/analytics.test.js
git commit -m "feat(analytics): trackEvent accepts ecommerce payload (items/value/currency/transactionId/itemCategory)"
```

---

## Task 2: Extend allowed event types and persist ecommerce fields server-side

**Files:**
- Modify: `api/analytics-api.js`

- [ ] **Step 1: Add new event types to allowlist**

In `api/analytics-api.js`, replace the `ALLOWED_TYPES` declaration (currently around line 9) with:

```javascript
const ALLOWED_TYPES = [
  'pageview', 'cta_click', 'form_submit', 'image_view', 'scroll_depth', 'page_exit',
  'view_item', 'begin_checkout', 'add_payment_info', 'purchase',
];
```

- [ ] **Step 2: Persist ecommerce fields with size caps**

In the same file, replace the `router.post('/', analyticsLimiter, async (req, res) => { … })` body's destructuring + Firestore write block (currently around lines 77-108) with:

```javascript
router.post('/', analyticsLimiter, async (req, res) => {
  try {
    const {
      sessionId, page, eventType, elementId, referrer,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      items, value, currency, transactionId, itemCategory,
    } = req.body;

    if (!ALLOWED_TYPES.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid eventType' });
    }

    const ip = req.ip || null;
    const geo = await geoLookup(ip);

    // Items: cap at 20 entries; drop any entry whose JSON-stringified form is >500 chars
    let safeItems = null;
    if (Array.isArray(items)) {
      safeItems = items
        .slice(0, 20)
        .filter((it) => {
          try {
            return JSON.stringify(it || {}).length <= 500;
          } catch {
            return false;
          }
        });
    }

    await admin.firestore().collection('page_events').add({
      sessionId: String(sessionId || '').slice(0, 64),
      page: String(page || '').slice(0, 300),
      eventType,
      elementId: elementId ? String(elementId).slice(0, 100) : null,
      referrer: String(referrer || '').slice(0, 300),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      ip,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      utmSource: utmSource ? String(utmSource).slice(0, 100) : null,
      utmMedium: utmMedium ? String(utmMedium).slice(0, 100) : null,
      utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 100) : null,
      utmTerm: utmTerm ? String(utmTerm).slice(0, 100) : null,
      utmContent: utmContent ? String(utmContent).slice(0, 100) : null,
      items: safeItems,
      value: typeof value === 'number' ? value : null,
      currency: currency ? String(currency).slice(0, 8) : null,
      transactionId: transactionId ? String(transactionId).slice(0, 100) : null,
      itemCategory: itemCategory ? String(itemCategory).slice(0, 64) : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Analytics ingest error:', err);
    return res.status(500).json({ error: 'Failed to record event' });
  }
});
```

- [ ] **Step 3: Manual sanity check via curl**

Start the dev server (`npm run dev`), then in another terminal:

```bash
curl -X POST http://localhost:3000/api/analytics \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"test-1","page":"/training/trial-lessons","eventType":"view_item","items":[{"item_id":"r44-60","item_category":"discovery-flight"}],"value":350,"currency":"gbp","itemCategory":"discovery-flight"}'
```

Expected: `{"ok":true}` and a new document in the Firestore `page_events` collection with `eventType: 'view_item'` and the items array. Then test rejection:

```bash
curl -X POST http://localhost:3000/api/analytics \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"test-1","page":"/","eventType":"bogus_event"}'
```

Expected: `400 {"error":"Invalid eventType"}`.

- [ ] **Step 4: Commit**

```bash
git add api/analytics-api.js
git commit -m "feat(analytics): allow GA4 ecommerce event types + persist items/value/currency/transactionId/itemCategory"
```

---

## Task 3: Fire `view_item` from DiscoveryFlight on mount

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx`

- [ ] **Step 1: Add the trackEvent import**

At the top of `src/pages/DiscoveryFlight.jsx`, ensure `trackEvent` is imported. If `useEffect` is not already imported, add it. Find the existing React import and update it:

```javascript
import { useEffect, useState, useRef } from 'react';  // add useEffect if not already present
import { trackEvent } from '../lib/analytics';        // new line
```

(Keep all other imports unchanged.)

- [ ] **Step 2: Add the view_item fire on mount**

Inside the top-level component function in `DiscoveryFlight.jsx` (likely `function DiscoveryFlight() {` or `export default function DiscoveryFlight() {`), add this `useEffect` near the top of the function body, BEFORE any conditional returns:

```javascript
  useEffect(() => {
    trackEvent('view_item', null, window.location.pathname, {
      itemCategory: 'discovery-flight',
      items: [{ item_category: 'discovery-flight' }],
      currency: 'gbp',
    });
  }, []);
```

- [ ] **Step 3: Smoke test in browser**

Run `npm run dev`. In a browser, open `http://localhost:5173/training/trial-lessons` with DevTools Network tab open. Filter by `analytics`. Reload the page.

Expected: a `POST /api/analytics` request appears with payload `eventType: "view_item"`, `itemCategory: "discovery-flight"`. A `pageview` event also fires (existing behaviour) — both are correct.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(analytics): fire view_item on DiscoveryFlight mount"
```

---

## Task 4: Fire `begin_checkout` from DiscoveryFlight Book Now click

**Files:**
- Modify: `src/pages/DiscoveryFlight.jsx`

- [ ] **Step 1: Locate the Book Now handler**

In `src/pages/DiscoveryFlight.jsx`, find the existing `handleBook` function (around line 439):

```javascript
  const handleBook = (cardId) => {
    if (selectedCard === cardId && selectedTime) {
      const aircraft = aircraftWithPricing.find(a => a.id === cardId);
      navigate(`/checkout?aircraft=${cardId}&duration=${selectedTime}&price=${aircraft.pricing[selectedTime]}`);
    }
  };
```

- [ ] **Step 2: Fire `begin_checkout` before navigate**

Replace the function with:

```javascript
  const handleBook = (cardId) => {
    if (selectedCard === cardId && selectedTime) {
      const aircraft = aircraftWithPricing.find(a => a.id === cardId);
      const price = aircraft.pricing[selectedTime];
      trackEvent('begin_checkout', `${cardId}-${selectedTime}`, window.location.pathname, {
        itemCategory: 'discovery-flight',
        items: [{
          item_id: `${cardId}-${selectedTime}`,
          item_name: `${aircraft.name || cardId} ${selectedTime}min Discovery Flight`,
          item_category: 'discovery-flight',
          price,
          currency: 'gbp',
          quantity: 1,
        }],
        value: price,
        currency: 'gbp',
      });
      navigate(`/checkout?aircraft=${cardId}&duration=${selectedTime}&price=${price}`);
    }
  };
```

- [ ] **Step 3: Smoke test in browser**

In the browser at `/training/trial-lessons`, pick a card + duration, click Book Now. In DevTools Network, expect a `POST /api/analytics` with `eventType: "begin_checkout"` and `value` set to the chosen price BEFORE the navigate happens.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DiscoveryFlight.jsx
git commit -m "feat(analytics): fire begin_checkout on DiscoveryFlight Book Now click"
```

---

## Task 5: Fire `add_payment_info` from Checkout card-form submit

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Add the trackEvent import**

At the top of `src/pages/Checkout.jsx`, add the analytics import (verify it isn't already present):

```javascript
import { trackEvent } from '../lib/analytics';
```

- [ ] **Step 2: Fire `add_payment_info` at the start of `handleSubmit`**

In `src/pages/Checkout.jsx`, find the discovery-flight checkout's `handleSubmit` function (around line 48). Insert the trackEvent call as the first line inside the function body, after `e.preventDefault()` (or equivalent) but before any state updates or fetch calls:

```javascript
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Fire add_payment_info before any network work — captures intent even if Stripe call fails
    const params = new URLSearchParams(window.location.search);
    const aircraft = params.get('aircraft');
    const duration = params.get('duration');
    const priceParam = parseFloat(params.get('price') || '0');
    trackEvent('add_payment_info', `${aircraft}-${duration}`, window.location.pathname, {
      itemCategory: 'discovery-flight',
      items: [{
        item_id: `${aircraft}-${duration}`,
        item_category: 'discovery-flight',
        price: priceParam,
        currency: 'gbp',
        quantity: 1,
      }],
      value: priceParam,
      currency: 'gbp',
    });

    // ... existing handleSubmit body continues unchanged
```

If `Checkout.jsx` reads aircraft/duration/price from React state instead of URL params, use those state values instead of `URLSearchParams`. Inspect lines 30-60 of the file before editing to confirm.

- [ ] **Step 3: Smoke test**

In the browser, complete the flow: Discovery Flight → Book Now → /checkout → fill card details (use `4242 4242 4242 4242` Stripe test card) → click Pay. Network tab should show `POST /api/analytics` with `eventType: "add_payment_info"` immediately after the Pay click, BEFORE the `/api/create-payment-intent` request.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(analytics): fire add_payment_info on Checkout card submit"
```

---

## Task 6: Fire `purchase` from Stripe webhook (server-side, idempotent)

This event fires from the server, not the client, so the `transaction_id` (Stripe payment intent id) is the canonical dedup key. Even if the webhook is delivered twice by Stripe, our existing `set({...}, { merge: true })` on `bookings/{pi.id}` is already idempotent — we extend that pattern.

**Files:**
- Modify: `api/stripe.js`

- [ ] **Step 1: Add a helper that writes a server-side analytics event**

Add this helper near the top of `api/stripe.js`, after the existing imports and Stripe init (around line 30):

```javascript
async function recordPurchaseEvent({ paymentIntentId, value, currency, items, itemCategory, sessionId, country, countryCode }) {
  try {
    // Idempotency: skip if a purchase event for this transactionId already exists
    const existing = await admin.firestore()
      .collection('page_events')
      .where('eventType', '==', 'purchase')
      .where('transactionId', '==', paymentIntentId)
      .limit(1)
      .get();
    if (!existing.empty) return;

    await admin.firestore().collection('page_events').add({
      sessionId: sessionId || null,
      page: '/booking-confirmed',
      eventType: 'purchase',
      transactionId: paymentIntentId,
      value: typeof value === 'number' ? value : null,
      currency: currency || 'gbp',
      items: items || null,
      itemCategory: itemCategory || null,
      country: country || null,
      countryCode: countryCode || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error('[stripe webhook] failed to record purchase event:', err.message);
  }
}
```

- [ ] **Step 2: Call the helper from the webhook handler**

In the same file, find `handleWebhook(req)` (around line 629) and the `if (event.type === 'payment_intent.succeeded')` block. After the `try { … } catch` block that writes to `bookings` (around line 707) but before the confirmation-email block, insert:

```javascript
    // Record GA4-canonical purchase event for funnel analytics
    {
      const productCategory = (() => {
        if (productType === 'london-tour') return 'london-tour';
        if (productType === 'misc') return 'misc';
        return 'discovery-flight';
      })();

      const purchaseItems = (() => {
        if (productType === 'london-tour') {
          const { experience, timeOfDay, quantity } = pi.metadata;
          return [{
            item_id: `london-tour-${experience}-${timeOfDay}`,
            item_name: `London Tour: ${experience} ${timeOfDay}`,
            item_category: 'london-tour',
            price: pi.amount / 100,
            quantity: Number(quantity) || 1,
            currency: 'gbp',
          }];
        }
        if (productType === 'misc') {
          const { itemId, itemName, qty } = pi.metadata;
          return [{
            item_id: itemId || 'misc',
            item_name: itemName || 'Misc item',
            item_category: 'misc',
            price: pi.amount / 100,
            quantity: Number(qty) || 1,
            currency: 'gbp',
          }];
        }
        const { aircraft, duration } = pi.metadata;
        return [{
          item_id: `${aircraft}-${duration}`,
          item_name: `${aircraft} ${duration}min Discovery Flight`,
          item_category: 'discovery-flight',
          price: pi.amount / 100,
          quantity: 1,
          currency: 'gbp',
        }];
      })();

      await recordPurchaseEvent({
        paymentIntentId: pi.id,
        value: pi.amount / 100,
        currency: 'gbp',
        items: purchaseItems,
        itemCategory: productCategory,
        sessionId: pi.metadata.sessionId || null,
      });
    }
```

- [ ] **Step 3: Add an export so the helper is testable**

At the bottom of `api/stripe.js`, where module exports already live, ensure `recordPurchaseEvent` is exported alongside whatever else this file exports. Locate the `module.exports = { … }` block (it exists; current exports include `handleWebhook`, `recordBooking`, etc.) and add `recordPurchaseEvent` to it:

```javascript
module.exports = {
  // ...existing exports
  recordPurchaseEvent,
};
```

The unit test for idempotency is intentionally deferred: per the project memory, `api/stripe.test.js` already fails in dev because Firebase credentials aren't configured locally. Adding a Firestore-touching idempotency test would inherit the same failure. The webhook handler's idempotency is covered by the manual end-to-end smoke in Step 4 below, plus the existing `bookings/{pi.id}` write being a `set({...}, { merge: true })` (already idempotent at the booking layer). When CI gains Firebase emulator support, add the unit test then.

- [ ] **Step 4: Manual end-to-end smoke**

Trigger a Stripe test webhook locally (Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook` then `stripe trigger payment_intent.succeeded`). Confirm in Firestore that a new `page_events` doc appears with `eventType: 'purchase'` and the correct `transactionId`. Re-trigger the same webhook — Firestore should still have only one matching `purchase` event.

- [ ] **Step 5: Commit**

```bash
git add api/stripe.js api/stripe.test.js
git commit -m "feat(analytics): fire idempotent purchase event from Stripe webhook"
```

---

## Task 7: Pure aggregation functions in `funnelAggregations.js`

These are the analytics math. Pure functions, fixture-driven tests — no Firestore here.

**Files:**
- Create: `src/components/admin/analytics/funnelAggregations.js`
- Test: `src/components/admin/analytics/funnelAggregations.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/components/admin/analytics/funnelAggregations.test.js` with:

```javascript
import { describe, it, expect } from 'vitest';
import {
  computeFunnel,
  computeFunnelValue,
  segmentFunnelBySource,
  medianTimeToConversionHours,
} from './funnelAggregations';

const tsHoursAgo = (h) => ({ toMillis: () => Date.now() - h * 3600 * 1000 });

const fixtureEvents = [
  // session A: full funnel, converted
  { sessionId: 'a', eventType: 'pageview',         page: '/',                           timestamp: tsHoursAgo(48), utmSource: 'google' },
  { sessionId: 'a', eventType: 'view_item',        itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(47), utmSource: 'google' },
  { sessionId: 'a', eventType: 'begin_checkout',   itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(46), value: 350, utmSource: 'google' },
  { sessionId: 'a', eventType: 'add_payment_info', itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(45), value: 350, utmSource: 'google' },
  { sessionId: 'a', eventType: 'purchase',         itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(44), value: 350, transactionId: 'pi_a' },

  // session B: viewed, never converted
  { sessionId: 'b', eventType: 'pageview',     page: '/training/trial-lessons',  timestamp: tsHoursAgo(20), utmSource: 'instagram' },
  { sessionId: 'b', eventType: 'view_item',    itemCategory: 'discovery-flight', timestamp: tsHoursAgo(19), utmSource: 'instagram' },

  // session C: viewed + began checkout, never paid
  { sessionId: 'c', eventType: 'view_item',      itemCategory: 'discovery-flight', timestamp: tsHoursAgo(10), utmSource: null },
  { sessionId: 'c', eventType: 'begin_checkout', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(9),  value: 150, utmSource: null },

  // session D: bought a different product (london-tour) — must be excluded from discovery-flight funnel
  { sessionId: 'd', eventType: 'view_item', itemCategory: 'london-tour', timestamp: tsHoursAgo(5) },
  { sessionId: 'd', eventType: 'purchase',  itemCategory: 'london-tour', timestamp: tsHoursAgo(4), value: 200, transactionId: 'pi_d' },

  // session E: webhook double-fire on the same pi — must dedupe via transactionId
  { sessionId: 'e', eventType: 'view_item',      itemCategory: 'discovery-flight', timestamp: tsHoursAgo(3) },
  { sessionId: 'e', eventType: 'begin_checkout', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(2), value: 350 },
  { sessionId: 'e', eventType: 'purchase',       itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, transactionId: 'pi_e' },
  { sessionId: 'e', eventType: 'purchase',       itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, transactionId: 'pi_e' },
];

describe('computeFunnel', () => {
  it('counts unique sessions at each stage for the requested category', () => {
    const out = computeFunnel(fixtureEvents, { itemCategory: 'discovery-flight' });
    expect(out.visits).toBe(4); // sessions a, b, c, e (d only fired non-funnel-counted events for this category)
    expect(out.viewedProduct).toBe(4); // a, b, c, e
    expect(out.beganCheckout).toBe(3); // a, c, e
    expect(out.purchased).toBe(2); // a, e (e dedupes via transactionId)
  });

  it('returns zeros for an empty event list', () => {
    expect(computeFunnel([], { itemCategory: 'discovery-flight' })).toEqual({
      visits: 0, viewedProduct: 0, beganCheckout: 0, purchased: 0,
    });
  });

  it('excludes events outside the date range', () => {
    const events = [
      { sessionId: 'x', eventType: 'view_item', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(200) },
      { sessionId: 'y', eventType: 'view_item', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(2) },
    ];
    const since = Date.now() - 24 * 3600 * 1000;
    const out = computeFunnel(events, { itemCategory: 'discovery-flight', sinceMs: since });
    expect(out.viewedProduct).toBe(1);
  });
});

describe('computeFunnelValue', () => {
  it('sums purchase value and computes AOV', () => {
    const out = computeFunnelValue(fixtureEvents, { itemCategory: 'discovery-flight' });
    expect(out.totalValue).toBe(700); // 350 (a) + 350 (e)
    expect(out.purchasedCount).toBe(2);
    expect(out.aov).toBe(350);
  });

  it('returns zero AOV when no purchases', () => {
    expect(computeFunnelValue([], { itemCategory: 'discovery-flight' })).toEqual({
      totalValue: 0, purchasedCount: 0, aov: 0,
    });
  });
});

describe('segmentFunnelBySource', () => {
  it('groups funnel counts by utmSource (with "direct" bucket for null)', () => {
    const rows = segmentFunnelBySource(fixtureEvents, { itemCategory: 'discovery-flight' });
    const bySource = Object.fromEntries(rows.map((r) => [r.source, r]));
    expect(bySource.google.purchased).toBe(1);
    expect(bySource.instagram.purchased).toBe(0);
    expect(bySource.direct.purchased).toBe(1); // session e (null utmSource)
  });
});

describe('medianTimeToConversionHours', () => {
  it('returns the median hours between first pageview/view_item and purchase', () => {
    const out = medianTimeToConversionHours(fixtureEvents, { itemCategory: 'discovery-flight' });
    // session a: 48h - 44h = 4h
    // session e: 3h - 1h = 2h
    // median of [4, 2] = 3
    expect(out).toBe(3);
  });

  it('returns null when there are no completed conversions', () => {
    const noPurchase = fixtureEvents.filter((e) => e.eventType !== 'purchase');
    expect(medianTimeToConversionHours(noPurchase, { itemCategory: 'discovery-flight' })).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- funnelAggregations.test.js`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement the aggregation module**

Create `src/components/admin/analytics/funnelAggregations.js` with:

```javascript
/**
 * Pure aggregation functions for the purchase funnel dashboard tile.
 * Inputs are arrays of page_events docs (already fetched from Firestore by the caller).
 * No Firestore access here — keeps everything unit-testable with fixtures.
 */

function eventTimeMs(ev) {
  if (!ev || !ev.timestamp) return 0;
  if (typeof ev.timestamp.toMillis === 'function') return ev.timestamp.toMillis();
  if (ev.timestamp instanceof Date) return ev.timestamp.getTime();
  if (typeof ev.timestamp === 'number') return ev.timestamp;
  return 0;
}

function inRange(ev, sinceMs, untilMs) {
  const t = eventTimeMs(ev);
  if (sinceMs && t < sinceMs) return false;
  if (untilMs && t > untilMs) return false;
  return true;
}

function isCategoryMatch(ev, itemCategory) {
  if (!itemCategory) return true;
  // purchase / view_item / begin_checkout / add_payment_info all carry itemCategory
  if (ev.itemCategory === itemCategory) return true;
  // pageview events don't carry itemCategory — they count toward "Visits" via sessionId only
  return false;
}

/**
 * Funnel counts: unique sessionIds at each stage, with `purchased` deduped by transactionId.
 */
export function computeFunnel(events, { itemCategory, sinceMs, untilMs } = {}) {
  const visits = new Set();
  const viewed = new Set();
  const began = new Set();
  const purchasedTx = new Set();

  for (const ev of events) {
    if (!inRange(ev, sinceMs, untilMs)) continue;

    // "Visits" counts every session that fired any event in range
    if (ev.sessionId) visits.add(ev.sessionId);

    if (!isCategoryMatch(ev, itemCategory)) continue;
    if (ev.eventType === 'view_item' && ev.sessionId) viewed.add(ev.sessionId);
    if (ev.eventType === 'begin_checkout' && ev.sessionId) began.add(ev.sessionId);
    if (ev.eventType === 'purchase' && ev.transactionId) purchasedTx.add(ev.transactionId);
  }

  return {
    visits: visits.size,
    viewedProduct: viewed.size,
    beganCheckout: began.size,
    purchased: purchasedTx.size,
  };
}

/**
 * £ value totals for the funnel. Only `purchase` events contribute to revenue.
 */
export function computeFunnelValue(events, { itemCategory, sinceMs, untilMs } = {}) {
  const seenTx = new Set();
  let totalValue = 0;
  let purchasedCount = 0;

  for (const ev of events) {
    if (!inRange(ev, sinceMs, untilMs)) continue;
    if (ev.eventType !== 'purchase') continue;
    if (!isCategoryMatch(ev, itemCategory)) continue;
    if (!ev.transactionId || seenTx.has(ev.transactionId)) continue;
    seenTx.add(ev.transactionId);
    purchasedCount += 1;
    totalValue += typeof ev.value === 'number' ? ev.value : 0;
  }

  return {
    totalValue,
    purchasedCount,
    aov: purchasedCount > 0 ? totalValue / purchasedCount : 0,
  };
}

/**
 * Funnel split by traffic source (utmSource). Null/empty utmSource bucketed as "direct".
 */
export function segmentFunnelBySource(events, opts = {}) {
  const sources = new Map();

  function bucket(ev) {
    return (ev.utmSource && String(ev.utmSource).trim()) || 'direct';
  }

  // First, group sessionId → source by the earliest event's utmSource
  const sessionSource = new Map();
  for (const ev of events) {
    if (!ev.sessionId) continue;
    if (!sessionSource.has(ev.sessionId)) {
      sessionSource.set(ev.sessionId, bucket(ev));
    }
  }

  // Then walk events and group funnel counts per source
  const grouped = new Map();
  for (const ev of events) {
    if (!ev.sessionId) continue;
    const source = sessionSource.get(ev.sessionId);
    if (!grouped.has(source)) {
      grouped.set(source, { source, visits: new Set(), viewed: new Set(), began: new Set(), purchasedTx: new Set() });
    }
    const row = grouped.get(source);
    row.visits.add(ev.sessionId);
    if (!isCategoryMatch(ev, opts.itemCategory)) continue;
    if (ev.eventType === 'view_item') row.viewed.add(ev.sessionId);
    if (ev.eventType === 'begin_checkout') row.began.add(ev.sessionId);
    if (ev.eventType === 'purchase' && ev.transactionId) row.purchasedTx.add(ev.transactionId);
  }

  return Array.from(grouped.values()).map((r) => ({
    source: r.source,
    visits: r.visits.size,
    viewedProduct: r.viewed.size,
    beganCheckout: r.began.size,
    purchased: r.purchasedTx.size,
  }));
}

/**
 * Median hours from each converted session's first relevant event to its purchase.
 * Returns null if no conversions in range.
 */
export function medianTimeToConversionHours(events, { itemCategory, sinceMs, untilMs } = {}) {
  // Bucket events per session (in range, category-matching)
  const perSession = new Map();
  for (const ev of events) {
    if (!inRange(ev, sinceMs, untilMs)) continue;
    if (!ev.sessionId) continue;
    if (!isCategoryMatch(ev, itemCategory)) continue;
    if (!perSession.has(ev.sessionId)) perSession.set(ev.sessionId, []);
    perSession.get(ev.sessionId).push(ev);
  }

  const durations = [];
  for (const [, evs] of perSession) {
    const purchaseEv = evs.find((e) => e.eventType === 'purchase');
    if (!purchaseEv) continue;
    const earliest = evs
      .filter((e) => e.eventType === 'view_item' || e.eventType === 'pageview')
      .reduce((min, e) => Math.min(min, eventTimeMs(e)), Infinity);
    if (!Number.isFinite(earliest)) continue;
    const ms = eventTimeMs(purchaseEv) - earliest;
    if (ms > 0) durations.push(ms / 3600000);
  }

  if (durations.length === 0) return null;
  durations.sort((a, b) => a - b);
  const mid = Math.floor(durations.length / 2);
  if (durations.length % 2 === 0) {
    return (durations[mid - 1] + durations[mid]) / 2;
  }
  return durations[mid];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- funnelAggregations.test.js`
Expected: PASS — all 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/funnelAggregations.js src/components/admin/analytics/funnelAggregations.test.js
git commit -m "feat(analytics): pure funnel aggregation utilities (counts, value, source segments, time-to-conversion)"
```

---

## Task 8: `PurchaseFunnel.jsx` admin tile component

**Files:**
- Create: `src/components/admin/analytics/PurchaseFunnel.jsx`
- Test: `src/components/admin/analytics/PurchaseFunnel.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/analytics/PurchaseFunnel.test.jsx`:

```javascript
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PurchaseFunnel from './PurchaseFunnel';

const tsHoursAgo = (h) => ({ toMillis: () => Date.now() - h * 3600 * 1000 });

const events = [
  { sessionId: 'a', eventType: 'view_item', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(2), utmSource: 'google' },
  { sessionId: 'a', eventType: 'begin_checkout', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, utmSource: 'google' },
  { sessionId: 'a', eventType: 'purchase', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, transactionId: 'pi_a' },
];

describe('PurchaseFunnel', () => {
  it('renders the four funnel stages with counts', () => {
    render(<PurchaseFunnel events={events} itemCategory="discovery-flight" />);
    expect(screen.getByText(/Visits/i)).toBeInTheDocument();
    expect(screen.getByText(/Viewed Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Started Checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/Purchased/i)).toBeInTheDocument();
  });

  it('renders the £ AOV alongside the funnel', () => {
    render(<PurchaseFunnel events={events} itemCategory="discovery-flight" />);
    expect(screen.getByText(/AOV/i)).toBeInTheDocument();
    expect(screen.getByText(/£350/)).toBeInTheDocument();
  });

  it('shows an empty state when no events match', () => {
    render(<PurchaseFunnel events={[]} itemCategory="discovery-flight" />);
    expect(screen.getByText(/Awaiting first purchase/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify test infra**

Confirm `@testing-library/react` is in `package.json`. If not, the project may use a different render helper. Run:

```bash
grep -E '"@testing-library/react"' /Users/maximussmith/Downloads/HQ-Website-main/package.json
```

If absent, install: `npm install --save-dev @testing-library/react @testing-library/jest-dom`. If present, proceed.

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- PurchaseFunnel.test.jsx`
Expected: FAIL — component does not exist.

- [ ] **Step 4: Implement the component**

Create `src/components/admin/analytics/PurchaseFunnel.jsx`:

```javascript
import { useMemo, useState } from 'react';
import {
  computeFunnel,
  computeFunnelValue,
  segmentFunnelBySource,
  medianTimeToConversionHours,
} from './funnelAggregations';

const STAGE_COLORS = {
  visits: '#5b21b6',
  viewedProduct: '#7c3aed',
  beganCheckout: '#a855f7',
  purchased: '#c084fc',
};

function fmtGbp(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '£0';
  return `£${Math.round(n).toLocaleString('en-GB')}`;
}

function pct(numer, denom) {
  if (!denom) return 0;
  return Math.round((numer / denom) * 100);
}

export default function PurchaseFunnel({ events = [], itemCategory = 'discovery-flight', dateLabel = '' }) {
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    if (sourceFilter === 'all') return events;
    if (sourceFilter === 'direct') {
      return events.filter((e) => !e.utmSource);
    }
    return events.filter((e) => e.utmSource === sourceFilter);
  }, [events, sourceFilter]);

  const funnel = useMemo(() => computeFunnel(filteredEvents, { itemCategory }), [filteredEvents, itemCategory]);
  const value = useMemo(() => computeFunnelValue(filteredEvents, { itemCategory }), [filteredEvents, itemCategory]);
  const ttc = useMemo(() => medianTimeToConversionHours(filteredEvents, { itemCategory }), [filteredEvents, itemCategory]);
  const sources = useMemo(() => segmentFunnelBySource(events, { itemCategory }), [events, itemCategory]);

  const sourceOptions = useMemo(() => {
    const set = new Set(['all']);
    sources.forEach((s) => set.add(s.source));
    return Array.from(set);
  }, [sources]);

  const isEmpty = funnel.purchased === 0 && funnel.viewedProduct === 0;

  const stages = [
    { key: 'visits',         label: 'Visits',           count: funnel.visits },
    { key: 'viewedProduct',  label: 'Viewed Product',   count: funnel.viewedProduct },
    { key: 'beganCheckout',  label: 'Started Checkout', count: funnel.beganCheckout },
    { key: 'purchased',      label: 'Purchased',        count: funnel.purchased },
  ];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Purchase Funnel — Discovery Flight</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {dateLabel && <span style={{ opacity: 0.7, fontSize: 13 }}>{dateLabel}</span>}
          <label style={{ fontSize: 13 }}>
            Source:{' '}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '4px 8px', borderRadius: 4 }}
            >
              {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 24, margin: '20px 0', flexWrap: 'wrap' }}>
        <Stat label="AOV" value={fmtGbp(value.aov)} />
        <Stat label="Revenue" value={fmtGbp(value.totalValue)} />
        <Stat label="Median time to convert" value={ttc !== null ? `${ttc.toFixed(1)}h` : '—'} />
      </div>

      {isEmpty ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic' }}>Awaiting first purchase in this range.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stages.map((stage, i) => {
            const widthPct = (stage.count / maxCount) * 100;
            const dropPct = i > 0 ? pct(stage.count, stages[i - 1].count) : null;
            return (
              <div key={stage.key} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px 60px', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14 }}>{stage.label}</span>
                <div style={{ background: '#2a2a2a', borderRadius: 4, overflow: 'hidden', height: 28 }}>
                  <div style={{
                    width: `${widthPct}%`, background: STAGE_COLORS[stage.key],
                    height: '100%', transition: 'width 250ms ease',
                  }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{stage.count.toLocaleString('en-GB')}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{dropPct !== null ? `${dropPct}%` : ''}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- PurchaseFunnel.test.jsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/analytics/PurchaseFunnel.jsx src/components/admin/analytics/PurchaseFunnel.test.jsx
git commit -m "feat(admin-analytics): PurchaseFunnel tile with source filter, AOV, and time-to-conversion"
```

---

## Task 9: Wire `PurchaseFunnel` into `AdminAnalytics.jsx` behind env flag

**Files:**
- Modify: `src/pages/admin/AdminAnalytics.jsx`

- [ ] **Step 1: Import the component**

Near the top of `src/pages/admin/AdminAnalytics.jsx`, alongside the other component imports, add:

```javascript
import PurchaseFunnel from '../../components/admin/analytics/PurchaseFunnel';
```

- [ ] **Step 2: Render the tile behind the flag**

Find the JSX section that renders the existing analytics tiles (look for the area inside `AdminLayout` that contains the existing `AreaChart` / `DonutChart` calls). Add a new section, ideally near the top of the tiles area:

```javascript
{import.meta.env.VITE_FUNNEL_ENABLED !== 'false' && (
  <div style={{ marginBottom: 24 }}>
    <PurchaseFunnel
      events={events}
      itemCategory="discovery-flight"
      dateLabel={`Last ${days} days`}
    />
  </div>
)}
```

The flag defaults to enabled. Set `VITE_FUNNEL_ENABLED=false` in `.env` to roll back instantly without redeploy.

- [ ] **Step 3: Smoke test in the browser**

Run `npm run dev`. Sign in as admin, visit `/admin/analytics`. The Purchase Funnel tile should render. With no real funnel data yet, expect the "Awaiting first purchase" empty state.

To populate test data, in another tab visit `/training/trial-lessons`, pick a card + duration, click Book Now (this fires `view_item` + `begin_checkout`). Reload `/admin/analytics`. The funnel should now show Visits, Viewed Product, and Started Checkout counts of at least 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminAnalytics.jsx
git commit -m "feat(admin-analytics): mount PurchaseFunnel tile behind VITE_FUNNEL_ENABLED flag"
```

---

## Task 10: Document the env flag and rollout in README

**Files:**
- Modify: `.env.example` (if present) or create a brief note

- [ ] **Step 1: Check for `.env.example`**

Run: `ls /Users/maximussmith/Downloads/HQ-Website-main/.env.example 2>/dev/null && echo found || echo missing`

If `found`: open it and add at the bottom:

```
# Phase 1 analytics funnel — set to "false" to hide the tile and skip event firing in dashboards
VITE_FUNNEL_ENABLED=true
```

If `missing`: skip this step. The flag is documented in this plan.

- [ ] **Step 2: Commit if changed**

```bash
git add .env.example 2>/dev/null
git diff --cached --quiet || git commit -m "docs(env): document VITE_FUNNEL_ENABLED for analytics funnel rollout"
```

---

## Task 11: Final integration smoke test (manual)

This is the verification gate before declaring Phase 1 complete.

- [ ] **Step 1: Full happy-path walk**

With `npm run dev` running:

1. Open an incognito browser window (clean session) → `http://localhost:5173/training/trial-lessons`. DevTools Network → filter `analytics`. Confirm a `view_item` POST fires with `itemCategory: 'discovery-flight'`.
2. Pick a card + duration → click Book Now. Confirm `begin_checkout` POST fires with the correct `value` BEFORE the route changes.
3. On `/checkout`, fill the form with Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC. Click Pay. Confirm `add_payment_info` POST fires immediately, then the `/api/create-payment-intent` POST.
4. After payment success, confirm via Stripe CLI / dashboard logs that the webhook fired AND that a new `page_events` doc with `eventType: 'purchase'` and `transactionId` matching the payment-intent id was written.

- [ ] **Step 2: Idempotency check**

In the Stripe CLI, re-trigger the `payment_intent.succeeded` webhook for the same payment-intent id. Inspect the `page_events` collection: still exactly one `purchase` doc for that `transactionId`.

- [ ] **Step 3: Admin self-exclusion check**

If `ADMIN_IP` is set in your local `.env` and includes your IP, confirm that funnel counts on `/admin/analytics` exclude your test session. (Existing `excludedIps` machinery handles this — no new code, just verify behaviour.)

- [ ] **Step 4: Rollback flag check**

Set `VITE_FUNNEL_ENABLED=false` in `.env`, restart `npm run dev`, reload `/admin/analytics`. The Purchase Funnel tile should NOT render. Restore `VITE_FUNNEL_ENABLED=true` (or remove the line) and confirm the tile is back.

- [ ] **Step 5: Final commit (if any docs/lint touch-ups)**

```bash
git status
# If anything outstanding, commit it. Otherwise nothing to do.
```

---

## Acceptance criteria for Phase 1

- All 11 tasks above marked complete with green tests where applicable.
- `/admin/analytics` shows a Purchase Funnel tile with: Visits / Viewed Product / Started Checkout / Purchased counts, plus AOV, total revenue, and median time-to-conversion, plus a source filter dropdown.
- New events fire from the four call sites (DiscoveryFlight mount, Book Now click, checkout submit, Stripe webhook) and land in `page_events` with the correct `itemCategory`, `value`, `currency`, and (for `purchase`) `transactionId`.
- `transactionId` dedup is verified: a duplicate webhook produces exactly one `purchase` event.
- `VITE_FUNNEL_ENABLED=false` hides the tile without redeploying app code.
- Existing analytics tiles (Overview, Engagement, etc.) still render correctly — no regression.

## Out of scope for Phase 1 (deferred to later phases)

- Carts collection and email-first checkout step (Phase 2)
- Automated recovery emails (Phase 3)
- Google Search Console keyword tile (Phase 4)
- Geography map (Phase 5)
- Daily rollups / `page_events` retention (covered in spec, not load-bearing yet at current volume)
