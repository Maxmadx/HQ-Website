> **ARCHIVED 2026-05-12**
> This plan was abandoned with zero matching code in `src/` or `api/`. Replaced by `docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md` §3 (non-goals). Do not implement.

# Analytics Funnel — Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automate cart recovery emails so the owner doesn't need to click "Send recovery" for every abandoned cart. Adds a scheduler that fires recovery emails at 1h and 24h boundaries, respects quiet hours and unsubscribe lists, tracks email opens + clicks, and catches a few more abandonments via exit-intent (desktop) and tab-return (mobile) prompts.

**Architecture:** A `node-cron` job runs every 15 min inside the existing Express server. Pure scheduler logic (`computeRecoveryActions`) takes a carts snapshot + current time and returns a list of actions; a separate executor applies the actions (Firestore writes + email sends) so the scheduling logic is unit-testable without infrastructure. Email sends are extracted into a reusable function shared by the manual route, the dashboard, and the scheduler. RFC 8058 List-Unsubscribe headers added to all recovery emails for Gmail/Yahoo 2026 compliance. The whole automation is gated by `CART_RECOVERY_AUTO=true` env flag — defaults to OFF so the owner can ship the code, watch manual sends for a week, then flip.

**Tech Stack:** Existing Express + Firebase Admin SDK + nodemailer. New dep: `node-cron`. No new infra.

**Spec:** `docs/superpowers/specs/2026-04-29-squarespace-analytics-parity-design.md`

**Phase 3 explicitly does NOT include** (deferred): 90-day cart pruning beyond the basic case (the more conservative pruning rules can come later if needed); Phase 4 (GSC) and Phase 5 (geography) are separate.

---

## File Structure

**New files:**
- `api/lib/quietHours.js` — pure helpers: `isQuietHourLondon(date)`, `nextSendableTime(date)`. Europe/London time zone.
- `api/lib/quietHours.test.js`
- `api/lib/cartRecoverySend.js` — reusable function `sendCartRecoveryEmail(cartRef, type)` extracted from the existing route handler. Adds RFC 8058 headers + UTM-tagged resume link by type.
- `api/lib/cartRecoveryActions.js` — pure scheduler logic: `computeRecoveryActions(carts, now)` returns `[{cartId, action: 'mark_abandoned'|'send_1h'|'send_24h'|'mark_expired'|'prune'}]`.
- `api/lib/cartRecoveryActions.test.js`
- `api/cart-recovery-runner.js` — the cron entry point: fetches carts, calls `computeRecoveryActions`, applies actions, logs structured output. Exposed as `runRecoveryTick()` for manual triggering and tests.
- `api/templates/cart-recovery-24h.js` — Email 2 (testimonial + assurance, no discount).
- `src/components/Checkout/ExitIntentModal.jsx` — modal triggered by exit-intent (desktop) or tab-return-with-no-email (mobile).
- `src/components/Checkout/ExitIntentModal.test.jsx`
- `src/components/Checkout/useExitIntent.js` — desktop hook: returns `true` when mouse moves toward top edge.
- `src/components/Checkout/useTabReturn.js` — mobile hook: returns `true` once after a `visibilitychange → hidden` followed by `→ visible`.

**Modified files:**
- `api/templates/cart-recovery.js` — refactor: take a `type` arg ('manual'|'1h'|'24h'); for '24h', delegate to the new template; UTM tag by type.
- `api/carts.js` — extract `sendRecoveryEmail` body into `cartRecoverySend.js`; add `GET /api/carts/email-pixel` (1×1 tracking pixel); modify `GET /api/carts/by-token` to mark `clicked: true` on the matching `recoveryEmailsSent[i]` before returning.
- `server.js` — register the cron job; add `CART_RECOVERY_AUTO` to env-gate the scheduler.
- `src/pages/Checkout.jsx` — render `ExitIntentModal`, wire the two hooks.
- `.env.example` — document `CART_RECOVERY_AUTO`.
- `package.json` — add `node-cron` dep.

**Test runner:** `npm test` (vitest). All tests live next to the file under test.

---

## Task 1: Quiet hours helper

**Files:**
- Create: `api/lib/quietHours.js`
- Test: `api/lib/quietHours.test.js`

Quiet hours: 20:00–08:00 Europe/London. The scheduler tick fires every 15 min UTC, so we need a function that says "is now in quiet hours?" using London local time, plus "what's the next sendable timestamp?" so the scheduler can defer queued sends.

- [ ] **Step 1: Write failing tests**

Create `api/lib/quietHours.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { isQuietHourLondon, nextSendableTime, QUIET_START_HOUR, QUIET_END_HOUR } from './quietHours.js';

// Helper: build a UTC date with explicit London-local hour (BST: UTC+1, GMT: UTC+0)
// In May, London is BST (+1), so London 9:00 = UTC 8:00.
// In Jan, London is GMT (+0), so London 9:00 = UTC 9:00.
function londonAt(year, monthIdx0, day, londonHour, londonMin = 0) {
  // Build via a string the JS engine will localize correctly
  const iso = new Date(Date.UTC(year, monthIdx0, day, londonHour, londonMin)).toISOString();
  // Adjust by the offset of London at that moment
  const sample = new Date(Date.UTC(year, monthIdx0, day, 12, 0));
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    hour12: false,
    timeZoneName: 'short',
  });
  const parts = fmt.formatToParts(sample);
  const tzName = parts.find((p) => p.type === 'timeZoneName').value;
  const offsetH = tzName === 'BST' ? 1 : 0;
  return new Date(Date.UTC(year, monthIdx0, day, londonHour - offsetH, londonMin));
}

describe('isQuietHourLondon', () => {
  it('exports the boundary constants', () => {
    expect(QUIET_END_HOUR).toBe(8);
    expect(QUIET_START_HOUR).toBe(20);
  });

  it('returns true at midnight London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 0, 0))).toBe(true);
  });

  it('returns true at 7:59 London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 7, 59))).toBe(true);
  });

  it('returns false at 8:00 London (boundary opens)', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 8, 0))).toBe(false);
  });

  it('returns false at noon London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 12, 0))).toBe(false);
  });

  it('returns false at 19:59 London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 19, 59))).toBe(false);
  });

  it('returns true at 20:00 London (boundary closes)', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 20, 0))).toBe(true);
  });

  it('handles the GMT/BST boundary in March', () => {
    // 2026-03-29 is the spring-forward day. 9:00 GMT = 9:00 BST after the shift.
    // Both are outside quiet hours, so result stays consistent.
    expect(isQuietHourLondon(londonAt(2026, 2, 29, 9, 0))).toBe(false);
  });
});

describe('nextSendableTime', () => {
  it('returns the input unchanged when not in quiet hours', () => {
    const noon = londonAt(2026, 4, 15, 12, 0);
    expect(nextSendableTime(noon).getTime()).toBe(noon.getTime());
  });

  it('rolls forward to 08:00 London when called during night-time', () => {
    const twoAm = londonAt(2026, 4, 15, 2, 0);
    const next = nextSendableTime(twoAm);
    // Should be 08:00 London on the SAME calendar day (May 15)
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: 'numeric',
      hour12: false,
    });
    expect(fmt.format(next)).toBe('08');
  });

  it('rolls forward to 08:00 London NEXT day when called during late evening', () => {
    const elevenPm = londonAt(2026, 4, 15, 23, 0);
    const next = nextSendableTime(elevenPm);
    // Next sendable should be May 16 at 08:00 London
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      day: '2-digit',
      hour: 'numeric',
      hour12: false,
    });
    expect(fmt.format(next)).toMatch(/^16,?\s*08$/);
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- quietHours.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `api/lib/quietHours.js`**

```javascript
'use strict';

// Quiet hours in Europe/London local time. Recovery emails are deferred
// outside this window so we don't wake people up.
const QUIET_END_HOUR = 8;    // 08:00 — sending allowed FROM this hour
const QUIET_START_HOUR = 20; // 20:00 — sending stops AT this hour

function londonHour(date) {
  // Use Intl to extract the London-local hour without DST math
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const hourPart = parts.find((p) => p.type === 'hour');
  const h = parseInt(hourPart.value, 10);
  // Edge case: '24' represents midnight in some locales
  return h === 24 ? 0 : h;
}

function isQuietHourLondon(date = new Date()) {
  const h = londonHour(date);
  return h < QUIET_END_HOUR || h >= QUIET_START_HOUR;
}

function nextSendableTime(date = new Date()) {
  if (!isQuietHourLondon(date)) return new Date(date.getTime());

  const h = londonHour(date);
  // If we're after 20:00, jump to tomorrow's 08:00 London.
  // If we're before 08:00, jump to today's 08:00 London.
  const target = new Date(date.getTime());

  // Build today's 08:00 London by formatting + reparsing
  const dayFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const parts = dayFmt.formatToParts(date);
  const y = parts.find((p) => p.type === 'year').value;
  const m = parts.find((p) => p.type === 'month').value;
  const d = parts.find((p) => p.type === 'day').value;

  // Determine London's UTC offset at that date
  const sample = new Date(`${y}-${m}-${d}T12:00:00Z`);
  const tzFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    timeZoneName: 'short',
  });
  const tzParts = tzFmt.formatToParts(sample);
  const tzName = tzParts.find((p) => p.type === 'timeZoneName').value;
  const offsetHours = tzName === 'BST' ? 1 : 0;

  // Today 08:00 London = UTC ${08 - offsetHours}:00 on the same calendar day
  const todayEightLondonUTC = new Date(Date.UTC(
    parseInt(y, 10),
    parseInt(m, 10) - 1,
    parseInt(d, 10),
    8 - offsetHours,
    0, 0, 0,
  ));

  if (h < QUIET_END_HOUR) {
    return todayEightLondonUTC;
  }
  // h >= 20: jump to tomorrow
  const tomorrow = new Date(todayEightLondonUTC.getTime() + 24 * 3600 * 1000);
  return tomorrow;
}

module.exports = {
  QUIET_END_HOUR,
  QUIET_START_HOUR,
  isQuietHourLondon,
  nextSendableTime,
};
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- quietHours.test.js`
Expected: PASS — all 10 tests.

The test file is in CommonJS-friendly ESM (vitest auto-handles both). The `module.exports` in the implementation works because vitest resolves CJS exports as named exports for ESM imports.

- [ ] **Step 5: Commit**

```bash
git add api/lib/quietHours.js api/lib/quietHours.test.js
git commit -m "feat(carts): quietHours helper — isQuietHourLondon + nextSendableTime"
```

---

## Task 2: Refactor cart-recovery template to take a type arg + add 24h template

**Files:**
- Create: `api/templates/cart-recovery-24h.js`
- Modify: `api/templates/cart-recovery.js`

The existing template is the 1h copy. Add a 24h variant (testimonial + reassurance, no discount). Wrap both behind a `type` switch.

- [ ] **Step 1: Create `api/templates/cart-recovery-24h.js`**

```javascript
'use strict';

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

function fmtGbp(p) {
  return `£${(Math.round(p) / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function aircraftName(id) {
  return AIRCRAFT_NAMES[id] || id || 'Discovery Flight';
}

function render24hCartRecoveryEmail(cart, siteUrl) {
  const flight = cart.flight || {};
  const aircraft = aircraftName(flight.aircraftId);
  const duration = flight.duration ? `${flight.duration}-minute` : '';
  const total = fmtGbp(cart.totalP || 0);
  const resumeUrl = `${siteUrl}/checkout?t=${encodeURIComponent(cart.recoveryToken || '')}&utm_source=recovery&utm_medium=email&utm_campaign=cart-24h`;
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;
  const pixelUrl = `${siteUrl}/api/carts/email-pixel?t=${encodeURIComponent(cart.recoveryToken || '')}&type=24h`;
  const firstName = (cart.firstName || cart.email || '').split(/[ @]/)[0] || 'there';

  const subject = `Still thinking it over, ${firstName}?`;

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family:system-ui,-apple-system,sans-serif;background:#f5f5f7;padding:24px;color:#1a1a1a;line-height:1.6">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">

      <h1 style="font-size:22px;margin:0 0 8px 0">A first flight is a memorable thing.</h1>
      <p style="color:#475569;margin:0 0 24px 0">We've held your ${aircraft} ${duration} Discovery Flight while you decide. Here's what one of our recent guests said:</p>

      <blockquote style="margin:0 0 24px 0;padding:16px 20px;background:#f8fafc;border-left:3px solid #a855f7;border-radius:4px;font-style:italic;color:#1e293b">
        "Genuinely the best thing I've done in years. The instructor put me completely at ease — I even took the controls for a stretch over the South Downs. Already booking the next one as a gift."
      </blockquote>

      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px">
        <p style="margin:0 0 4px 0;font-weight:600">${aircraft} — ${duration} Discovery Flight</p>
        <p style="margin:0;color:#475569">${total}</p>
      </div>

      <p style="margin:0 0 24px 0">
        <a href="${resumeUrl}"
           style="display:inline-block;background:#a855f7;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Complete your booking
        </a>
      </p>

      <p style="color:#475569;margin:0 0 12px 0;font-size:14px"><strong>A few things people often ask:</strong></p>
      <ul style="color:#475569;margin:0 0 24px 0;padding-left:20px;font-size:14px">
        <li style="margin-bottom:6px">Worried about the weather? We reschedule for free if it's not safe to fly.</li>
        <li style="margin-bottom:6px">Buying as a gift? Let us know at checkout — we'll send a printed voucher.</li>
        <li style="margin-bottom:6px">Got questions? Reply to this email or give us a call.</li>
      </ul>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px 0">
      <p style="font-size:12px;color:#94a3b8;margin:0">
        You're receiving this because you started a booking on hqaviation.co.uk.
        <a href="${unsubUrl}" style="color:#94a3b8">Unsubscribe</a>
      </p>
      <img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px">
    </div>
  </body>
</html>`;

  const text = `A first flight is a memorable thing.

We've held your ${aircraft} ${duration} Discovery Flight while you decide.

"Genuinely the best thing I've done in years. The instructor put me completely at ease — I even took the controls for a stretch over the South Downs. Already booking the next one as a gift."

${aircraft} — ${duration} Discovery Flight
${total}

Complete your booking:
${resumeUrl}

A few things people often ask:
- Worried about the weather? We reschedule for free if it's not safe to fly.
- Buying as a gift? Let us know at checkout — we'll send a printed voucher.
- Got questions? Reply to this email or give us a call.

---
You're receiving this because you started a booking on hqaviation.co.uk.
Unsubscribe: ${unsubUrl}
`;

  return { subject, html, text };
}

module.exports = { render24hCartRecoveryEmail };
```

- [ ] **Step 2: Refactor `api/templates/cart-recovery.js` to switch on type**

Read the current file. Modify the export so it dispatches on `type`:

```javascript
'use strict';

const { render24hCartRecoveryEmail } = require('./cart-recovery-24h');

const AIRCRAFT_NAMES = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

function fmtGbp(p) {
  return `£${(Math.round(p) / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function aircraftName(id) {
  return AIRCRAFT_NAMES[id] || id || 'Discovery Flight';
}

function render1hCartRecoveryEmail(cart, siteUrl, campaignTag) {
  const flight = cart.flight || {};
  const aircraft = aircraftName(flight.aircraftId);
  const duration = flight.duration ? `${flight.duration}-minute` : '';
  const total = fmtGbp(cart.totalP || 0);
  const resumeUrl = `${siteUrl}/checkout?t=${encodeURIComponent(cart.recoveryToken || '')}&utm_source=recovery&utm_medium=email&utm_campaign=${encodeURIComponent(campaignTag)}`;
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;
  const pixelUrl = `${siteUrl}/api/carts/email-pixel?t=${encodeURIComponent(cart.recoveryToken || '')}&type=${encodeURIComponent(campaignTag)}`;

  const subject = `Your HQ Aviation booking is saved`;

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family:system-ui,-apple-system,sans-serif;background:#f5f5f7;padding:24px;color:#1a1a1a;line-height:1.5">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
      <h1 style="font-size:22px;margin:0 0 8px 0">Your booking is held.</h1>
      <p style="color:#475569;margin:0 0 24px 0">We've saved your ${aircraft} ${duration} Discovery Flight so you can come back when you're ready.</p>

      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px">
        <p style="margin:0 0 4px 0;font-weight:600">${aircraft} — ${duration} Discovery Flight</p>
        <p style="margin:0;color:#475569">${total}</p>
      </div>

      <p style="margin:0 0 24px 0">
        <a href="${resumeUrl}"
           style="display:inline-block;background:#a855f7;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Complete your booking
        </a>
      </p>

      <p style="color:#475569;margin:0 0 24px 0">
        First-flight nerves are normal. Your instructor will walk you through every minute.
        Any questions? Reply to this email or call us — happy to help.
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px 0">
      <p style="font-size:12px;color:#94a3b8;margin:0">
        You're receiving this because you started a booking on hqaviation.co.uk.
        <a href="${unsubUrl}" style="color:#94a3b8">Unsubscribe</a>
      </p>
      <img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px">
    </div>
  </body>
</html>`;

  const text = `Your booking is held.

We've saved your ${aircraft} ${duration} Discovery Flight so you can come back when you're ready.

${aircraft} — ${duration} Discovery Flight
${total}

Complete your booking:
${resumeUrl}

First-flight nerves are normal. Your instructor will walk you through every minute. Any questions? Reply to this email or call us — happy to help.

---
You're receiving this because you started a booking on hqaviation.co.uk.
Unsubscribe: ${unsubUrl}
`;

  return { subject, html, text };
}

/**
 * Top-level dispatcher. type ∈ { 'manual', '1h', '24h' }.
 * 'manual' uses the 1h copy with campaign='cart-manual' for attribution.
 * '1h' uses the 1h copy with campaign='cart-1h'.
 * '24h' delegates to render24hCartRecoveryEmail.
 */
function renderCartRecoveryEmail(cart, siteUrl, type = 'manual') {
  if (type === '24h') return render24hCartRecoveryEmail(cart, siteUrl);
  const campaign = type === '1h' ? 'cart-1h' : 'cart-manual';
  return render1hCartRecoveryEmail(cart, siteUrl, campaign);
}

module.exports = { renderCartRecoveryEmail };
```

- [ ] **Step 3: Verify both files load**

```bash
node -e "const t = require('./api/templates/cart-recovery'); console.log(t.renderCartRecoveryEmail({recoveryToken:'tok'}, 'https://example.com', '24h').subject);"
```

Expected: prints the 24h subject line.

- [ ] **Step 4: Commit**

```bash
git add api/templates/cart-recovery.js api/templates/cart-recovery-24h.js
git commit -m "feat(carts): cart-recovery template takes type arg + 24h variant with testimonial copy"
```

---

## Task 3: Extract sendRecoveryEmail into reusable function

**Files:**
- Create: `api/lib/cartRecoverySend.js`
- Modify: `api/carts.js`

The existing `POST /api/carts/:id/send-recovery` route handler embeds all the sending logic. Extract it into a function that takes `(cartId, type, sentBy)` and returns the new email-sent record. The route handler becomes a thin wrapper. The scheduler in Task 6 will call the same function.

- [ ] **Step 1: Create `api/lib/cartRecoverySend.js`**

```javascript
'use strict';

const admin = require('../firebase-admin');
const { getTransporter } = require('./mailer');
const { renderCartRecoveryEmail } = require('../templates/cart-recovery');

/**
 * Send a cart-recovery email and record the audit entry.
 * @param {string} cartId
 * @param {'manual'|'1h'|'24h'} type
 * @param {string} sentBy  Admin UID or 'cron'
 * @returns {Promise<{ok:true}>} or throws an Error with .statusCode
 */
async function sendCartRecoveryEmail(cartId, type, sentBy) {
  const cartRef = admin.firestore().collection('carts').doc(cartId);
  const snap = await cartRef.get();
  if (!snap.exists) {
    const err = new Error('Cart not found');
    err.statusCode = 404;
    throw err;
  }
  const cart = snap.data();

  if (!cart.email) throw Object.assign(new Error('No email on file'), { statusCode: 400 });
  if (cart.noEmail) throw Object.assign(new Error('Customer has unsubscribed'), { statusCode: 400 });
  if (cart.status === 'completed') throw Object.assign(new Error('Cart already completed'), { statusCode: 400 });
  if (cart.excludedFromAnalytics) throw Object.assign(new Error('Admin/excluded cart'), { statusCode: 400 });

  const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
  const { subject, html, text } = renderCartRecoveryEmail(cart, siteUrl, type);

  // RFC 8058 one-click unsubscribe headers (Gmail / Yahoo 2026 requirement when sending bulk)
  const unsubUrl = `${siteUrl}/api/carts/unsubscribe?t=${encodeURIComponent(cart.recoveryToken || '')}`;

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: cart.email,
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<mailto:${process.env.EMAIL_FROM}?subject=unsubscribe>, <${unsubUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'Precedence': 'bulk',
      'X-Auto-Response-Suppress': 'All',
    },
  });

  await cartRef.set({
    recoveryEmailsSent: [
      ...(cart.recoveryEmailsSent || []),
      {
        at: admin.firestore.FieldValue.serverTimestamp(),
        type,
        sentBy: sentBy || 'unknown',
        opened: false,
        clicked: false,
      },
    ],
    status: cart.status === 'completed' ? cart.status : 'abandoned',
    abandonedAt: cart.abandonedAt || admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { ok: true };
}

module.exports = { sendCartRecoveryEmail };
```

- [ ] **Step 2: Update `api/carts.js` route to use the helper**

Find the existing `POST /api/carts/:id/send-recovery` handler. Replace its body with a thin wrapper that calls the helper:

```javascript
const { sendCartRecoveryEmail } = require('./lib/cartRecoverySend');

// existing route, simplified:
router.post('/:id/send-recovery', requireAdmin, async (req, res) => {
  try {
    await sendCartRecoveryEmail(req.params.id, 'manual', req.adminUid || 'admin');
    return res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    console.error('[carts] send-recovery error:', err.message);
    return res.status(500).json({ error: 'Failed to send recovery email' });
  }
});
```

Remove the now-unused imports of `getTransporter` and `renderCartRecoveryEmail` from `api/carts.js` if they were only used by this route — verify with `grep`.

- [ ] **Step 3: Verify the route still works**

`node -e "require('./api/carts')"` — should not throw. Run `npm test` — confirm no regression.

- [ ] **Step 4: Commit**

```bash
git add api/lib/cartRecoverySend.js api/carts.js
git commit -m "refactor(carts): extract sendCartRecoveryEmail into reusable helper + add RFC 8058 headers"
```

---

## Task 4: Open-pixel + click tracking endpoints

**Files:**
- Modify: `api/carts.js`

Two new endpoints:
- `GET /api/carts/email-pixel?t=<token>&type=1h` — returns 1×1 transparent GIF, marks the matching `recoveryEmailsSent[i].opened = true`.
- The existing `GET /api/carts/by-token` is extended to mark `clicked: true` on the most recent `recoveryEmailsSent` entry before returning the cart.

- [ ] **Step 1: Add the email-pixel endpoint**

In `api/carts.js`, before `module.exports`, add:

```javascript
// 1×1 transparent GIF, base64
const TRANSPARENT_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

// GET /api/carts/email-pixel?t=<token>&type=<1h|24h|manual>
// Returns a 1×1 transparent GIF and marks the matching recoveryEmailsSent[i].opened = true.
router.get('/email-pixel', async (req, res) => {
  // Always return the pixel — never reveal whether the token was valid.
  res.set('Content-Type', 'image/gif');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  const token = String(req.query.t || '').trim();
  const type = String(req.query.type || '').trim();

  // Send pixel immediately so email clients render the image.
  res.send(TRANSPARENT_GIF);

  // Then update Firestore in the background. Errors are logged, never returned.
  if (!token || token.length < 16) return;
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('recoveryToken', '==', token)
      .limit(1)
      .get();
    if (snap.empty) return;

    const doc = snap.docs[0];
    const cart = doc.data();
    const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent.slice() : [];
    if (sent.length === 0) return;

    // Find the entry that matches the type (most-recent-first)
    let updatedIndex = -1;
    for (let i = sent.length - 1; i >= 0; i -= 1) {
      if (!type || sent[i].type === type) {
        if (sent[i].opened) return; // already marked
        sent[i] = { ...sent[i], opened: true };
        updatedIndex = i;
        break;
      }
    }
    if (updatedIndex === -1) return;

    await doc.ref.set({
      recoveryEmailsSent: sent,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[carts] email-pixel error:', err.message);
  }
});
```

- [ ] **Step 2: Modify the by-token endpoint to mark clicked**

Find the existing `router.get('/by-token', …)` handler. Inside, after the `cart.status === 'completed'` early-return and before the `return res.json(...)`, add:

```javascript
    // Click tracking: mark the most-recent recoveryEmailsSent entry clicked
    try {
      const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent.slice() : [];
      if (sent.length > 0 && !sent[sent.length - 1].clicked) {
        sent[sent.length - 1] = { ...sent[sent.length - 1], clicked: true };
        await doc.ref.set({
          recoveryEmailsSent: sent,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (clickErr) {
      console.error('[carts] click-track error:', clickErr.message);
    }
```

- [ ] **Step 3: Sanity check**

`node -e "require('./api/carts')"` — must not throw. Run `npm test` — confirm no regression.

- [ ] **Step 4: Commit**

```bash
git add api/carts.js
git commit -m "feat(carts): email-pixel open tracking + resume-link click tracking"
```

---

## Task 5: Pure scheduler logic — `computeRecoveryActions`

**Files:**
- Create: `api/lib/cartRecoveryActions.js`
- Test: `api/lib/cartRecoveryActions.test.js`

Pure function: given a list of cart docs and `now`, return the actions the scheduler should take. No Firestore. No emails. Fully unit-testable with fixtures.

- [ ] **Step 1: Write failing tests**

Create `api/lib/cartRecoveryActions.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { computeRecoveryActions } from './cartRecoveryActions.js';

const MIN_AGE_HOURS = 1;
const FOLLOW_UP_HOURS = 24;
const EXPIRE_DAYS = 7;
const PRUNE_DAYS = 90;

const tsHoursAgo = (now, h) => ({ toMillis: () => now.getTime() - h * 3600 * 1000 });
const tsDaysAgo = (now, d) => tsHoursAgo(now, d * 24);

// Pick a noon UTC weekday so quiet-hours don't interfere with the test cases (12:00 UTC = 13:00 BST in May, well inside the awake window)
const NOW = new Date('2026-05-15T12:00:00Z');

describe('computeRecoveryActions', () => {
  it('marks active carts as abandoned after 1h idle', () => {
    const carts = [{
      id: 'a', status: 'active', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 1.5), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'a', action: 'mark_abandoned' });
  });

  it('does NOT mark active carts as abandoned before 1h', () => {
    const carts = [{
      id: 'a', status: 'active', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 0.5), excludedFromAnalytics: false,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('queues 1h email for an abandoned cart with email + no recovery sent', () => {
    const carts = [{
      id: 'b', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'b', action: 'send_1h' });
  });

  it('does NOT queue 1h email if cart has noEmail or no email', () => {
    const carts = [
      { id: 'c1', status: 'abandoned', email: null,    noEmail: false, recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false },
      { id: 'c2', status: 'abandoned', email: 'x@y.z', noEmail: true,  recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false },
    ];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('queues 24h email when 1h email was sent at least 24h ago', () => {
    const carts = [{
      id: 'd', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [{ at: tsHoursAgo(NOW, 25), type: '1h', opened: true, clicked: false }],
      updatedAt: tsHoursAgo(NOW, 25), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'd', action: 'send_24h' });
  });

  it('does NOT queue 24h email before 24h has passed', () => {
    const carts = [{
      id: 'd', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [{ at: tsHoursAgo(NOW, 23), type: '1h' }],
      updatedAt: tsHoursAgo(NOW, 23), excludedFromAnalytics: false,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('does NOT queue a third email after 24h was sent', () => {
    const carts = [{
      id: 'e', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [
        { at: tsHoursAgo(NOW, 50), type: '1h' },
        { at: tsHoursAgo(NOW, 25), type: '24h' },
      ],
      updatedAt: tsHoursAgo(NOW, 25), excludedFromAnalytics: false,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('marks abandoned cart as expired after 7 days', () => {
    const carts = [{
      id: 'f', status: 'abandoned', email: 'x@y.z', noEmail: false,
      recoveryEmailsSent: [{ at: tsDaysAgo(NOW, 6), type: '24h' }],
      updatedAt: tsDaysAgo(NOW, 7.5), excludedFromAnalytics: false,
    }];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions).toContainEqual({ cartId: 'f', action: 'mark_expired' });
  });

  it('queues prune for completed/expired carts older than 90 days', () => {
    const carts = [
      { id: 'g1', status: 'completed', updatedAt: tsDaysAgo(NOW, 100), excludedFromAnalytics: false, email: 'a@b.c', noEmail: false, recoveryEmailsSent: [] },
      { id: 'g2', status: 'expired',   updatedAt: tsDaysAgo(NOW, 100), excludedFromAnalytics: false, email: 'a@b.c', noEmail: false, recoveryEmailsSent: [] },
    ];
    const actions = computeRecoveryActions(carts, NOW);
    expect(actions.filter((a) => a.action === 'prune').map((a) => a.cartId).sort()).toEqual(['g1', 'g2']);
  });

  it('does NOT prune completed/expired carts younger than 90 days', () => {
    const carts = [{ id: 'h', status: 'completed', updatedAt: tsDaysAgo(NOW, 30), excludedFromAnalytics: false, email: 'a@b.c', noEmail: false, recoveryEmailsSent: [] }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('skips excluded-from-analytics carts entirely', () => {
    const carts = [{
      id: 'i', status: 'abandoned', email: 'admin@hq.co', noEmail: false,
      recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: true,
    }];
    expect(computeRecoveryActions(carts, NOW)).toEqual([]);
  });

  it('caps the number of email actions per tick (default 50)', () => {
    const carts = [];
    for (let i = 0; i < 80; i += 1) {
      carts.push({
        id: `bulk-${i}`, status: 'abandoned', email: `u${i}@x.com`, noEmail: false,
        recoveryEmailsSent: [], updatedAt: tsHoursAgo(NOW, 2), excludedFromAnalytics: false,
      });
    }
    const actions = computeRecoveryActions(carts, NOW);
    const sends = actions.filter((a) => a.action === 'send_1h' || a.action === 'send_24h');
    expect(sends.length).toBeLessThanOrEqual(50);
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- cartRecoveryActions.test.js`

- [ ] **Step 3: Implement `api/lib/cartRecoveryActions.js`**

```javascript
'use strict';

const HOUR_MS = 3600 * 1000;
const DAY_MS = 24 * HOUR_MS;

const ABANDON_AFTER_HOURS = 1;
const FOLLOW_UP_AFTER_HOURS = 24;
const EXPIRE_AFTER_DAYS = 7;
const PRUNE_AFTER_DAYS = 90;
const MAX_SENDS_PER_TICK = 50;

function timeMs(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === 'number') return ts;
  return 0;
}

function lastEmailTimeMs(cart) {
  const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent : [];
  if (sent.length === 0) return 0;
  return timeMs(sent[sent.length - 1].at);
}

function hasEmailSent(cart, type) {
  const sent = Array.isArray(cart.recoveryEmailsSent) ? cart.recoveryEmailsSent : [];
  return sent.some((e) => e.type === type);
}

function isContactable(cart) {
  return cart.email && !cart.noEmail && !cart.excludedFromAnalytics;
}

/**
 * Pure scheduler — return the list of actions to apply.
 * Inputs:
 *   carts: array of cart docs (each must have id, status, email, noEmail, recoveryEmailsSent, updatedAt, excludedFromAnalytics)
 *   now: a Date object representing the current tick's time
 *
 * Returns: array of { cartId, action } where action ∈ { 'mark_abandoned', 'send_1h', 'send_24h', 'mark_expired', 'prune' }
 *
 * Send actions are capped at MAX_SENDS_PER_TICK to prevent runaway loops.
 * State-transition actions (mark_*) are NOT capped — they're cheap Firestore updates.
 */
function computeRecoveryActions(carts, now) {
  const nowMs = now.getTime();
  const actions = [];
  let sendCount = 0;

  for (const cart of carts) {
    if (cart.excludedFromAnalytics) continue;

    const updatedMs = timeMs(cart.updatedAt);
    const ageMs = nowMs - updatedMs;

    // Prune: completed or expired and older than 90 days
    if ((cart.status === 'completed' || cart.status === 'expired') && ageMs > PRUNE_AFTER_DAYS * DAY_MS) {
      actions.push({ cartId: cart.id, action: 'prune' });
      continue;
    }

    // Mark expired: abandoned and older than 7 days
    if (cart.status === 'abandoned' && ageMs > EXPIRE_AFTER_DAYS * DAY_MS) {
      actions.push({ cartId: cart.id, action: 'mark_expired' });
      continue;
    }

    // Mark abandoned: active and idle for >= 1h
    if (cart.status === 'active' && ageMs >= ABANDON_AFTER_HOURS * HOUR_MS) {
      actions.push({ cartId: cart.id, action: 'mark_abandoned' });
      continue;
    }

    // Email queues: only for abandoned, contactable carts
    if (cart.status === 'abandoned' && isContactable(cart) && sendCount < MAX_SENDS_PER_TICK) {
      const has1h = hasEmailSent(cart, '1h') || hasEmailSent(cart, 'manual');
      const has24h = hasEmailSent(cart, '24h');

      if (!has1h) {
        actions.push({ cartId: cart.id, action: 'send_1h' });
        sendCount += 1;
        continue;
      }

      if (!has24h) {
        const lastSentAge = nowMs - lastEmailTimeMs(cart);
        if (lastSentAge >= FOLLOW_UP_AFTER_HOURS * HOUR_MS) {
          actions.push({ cartId: cart.id, action: 'send_24h' });
          sendCount += 1;
        }
      }
    }
  }

  return actions;
}

module.exports = {
  computeRecoveryActions,
  ABANDON_AFTER_HOURS,
  FOLLOW_UP_AFTER_HOURS,
  EXPIRE_AFTER_DAYS,
  PRUNE_AFTER_DAYS,
  MAX_SENDS_PER_TICK,
};
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- cartRecoveryActions.test.js`
Expected: PASS — all 11 tests.

- [ ] **Step 5: Commit**

```bash
git add api/lib/cartRecoveryActions.js api/lib/cartRecoveryActions.test.js
git commit -m "feat(carts): pure scheduler — computeRecoveryActions returns state transitions + email queue"
```

---

## Task 6: Recovery runner (executor + Firestore + emails)

**Files:**
- Create: `api/cart-recovery-runner.js`

The runner is the impure side: fetches carts, calls `computeRecoveryActions`, applies the actions (Firestore writes + email sends via `sendCartRecoveryEmail`). It respects quiet hours: send actions are deferred when `isQuietHourLondon(now) === true`.

- [ ] **Step 1: Create the runner**

```javascript
'use strict';

const admin = require('./firebase-admin');
const { computeRecoveryActions } = require('./lib/cartRecoveryActions');
const { sendCartRecoveryEmail } = require('./lib/cartRecoverySend');
const { isQuietHourLondon } = require('./lib/quietHours');

/**
 * Runs one tick: fetch non-pruned carts, compute actions, apply them.
 * Returns a structured log object for observability.
 */
async function runRecoveryTick(now = new Date()) {
  const tick = { startedAt: now.toISOString(), scanned: 0, marked: 0, sent: 0, pruned: 0, deferred_quiet: 0, errors: [] };

  let carts;
  try {
    const snap = await admin.firestore()
      .collection('carts')
      .where('status', 'in', ['active', 'abandoned', 'completed', 'expired'])
      .limit(500)
      .get();
    carts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    tick.scanned = carts.length;
  } catch (err) {
    tick.errors.push(`fetch: ${err.message}`);
    console.error('[cart-recovery] fetch failed:', err.message);
    return tick;
  }

  const actions = computeRecoveryActions(carts, now);
  const quiet = isQuietHourLondon(now);

  for (const { cartId, action } of actions) {
    try {
      if (action === 'mark_abandoned') {
        await admin.firestore().collection('carts').doc(cartId).set({
          status: 'abandoned',
          abandonedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        tick.marked += 1;
      } else if (action === 'mark_expired') {
        await admin.firestore().collection('carts').doc(cartId).set({
          status: 'expired',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        tick.marked += 1;
      } else if (action === 'prune') {
        await admin.firestore().collection('carts').doc(cartId).delete();
        tick.pruned += 1;
      } else if (action === 'send_1h' || action === 'send_24h') {
        if (quiet) {
          tick.deferred_quiet += 1;
          continue;
        }
        const type = action === 'send_1h' ? '1h' : '24h';
        await sendCartRecoveryEmail(cartId, type, 'cron');
        tick.sent += 1;
      }
    } catch (err) {
      tick.errors.push(`${cartId}/${action}: ${err.message}`);
      console.error(`[cart-recovery] ${cartId} ${action} failed:`, err.message);
    }
  }

  console.log(`[cart-recovery] tick`, JSON.stringify(tick));
  return tick;
}

module.exports = { runRecoveryTick };
```

- [ ] **Step 2: Sanity check**

`node -e "require('./api/cart-recovery-runner')"` — must not throw. Run `npm test` — confirm no regression.

- [ ] **Step 3: Commit**

```bash
git add api/cart-recovery-runner.js
git commit -m "feat(carts): cart-recovery-runner — applies scheduler actions, defers sends in quiet hours"
```

---

## Task 7: Wire node-cron in server.js behind CART_RECOVERY_AUTO

**Files:**
- Modify: `server.js`
- Modify: `package.json` (add node-cron)

The cron runs every 15 min. The whole thing is gated by `CART_RECOVERY_AUTO=true` — defaults to OFF so the server can ship without auto-emailing customers until the owner explicitly turns it on.

- [ ] **Step 1: Install node-cron**

```bash
npm install node-cron
```

- [ ] **Step 2: Register the cron in server.js**

Open `server.js`. After the existing route mounts, before `app.listen`, add a new section:

```javascript
// ============================================
// CART RECOVERY CRON (Phase 3)
// ============================================
if (process.env.CART_RECOVERY_AUTO === 'true') {
  const cron = require('node-cron');
  const { runRecoveryTick } = require('./api/cart-recovery-runner');

  console.log('[cart-recovery] auto mode ENABLED — scheduling every 15 minutes');
  cron.schedule('*/15 * * * *', () => {
    runRecoveryTick(new Date()).catch((err) => {
      console.error('[cart-recovery] tick threw:', err.message);
    });
  });
} else {
  console.log('[cart-recovery] auto mode DISABLED (set CART_RECOVERY_AUTO=true to enable)');
}
```

- [ ] **Step 3: Verify the server boots in both modes**

Without the flag:
```bash
NODE_ENV=development node -e "require('./server')" 2>&1 | head -5
```
Expected: prints `[cart-recovery] auto mode DISABLED ...` (and probably some Firebase-init noise — ignore).

With the flag:
```bash
CART_RECOVERY_AUTO=true NODE_ENV=development node -e "require('./server')" 2>&1 | head -5
```
Expected: prints `[cart-recovery] auto mode ENABLED — scheduling every 15 minutes`. (Cron is scheduled but won't actually fire because the require returns immediately — node-cron doesn't keep the process alive.)

- [ ] **Step 4: Commit**

```bash
git add server.js package.json
git commit -m "feat(carts): wire node-cron for recovery scheduler — gated by CART_RECOVERY_AUTO env flag"
```

---

## Task 8: ExitIntentModal component

**Files:**
- Create: `src/components/Checkout/ExitIntentModal.jsx`
- Test: `src/components/Checkout/ExitIntentModal.test.jsx`

A small modal that appears overlaid on `/checkout` when the user is about to leave WITHOUT having entered an email. Asks for email so we can save the cart.

- [ ] **Step 1: Write failing tests**

```javascript
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExitIntentModal from './ExitIntentModal';

describe('ExitIntentModal', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(<ExitIntentModal open={false} onSave={() => {}} onDismiss={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when open is true', () => {
    render(<ExitIntentModal open={true} onSave={() => {}} onDismiss={() => {}} />);
    expect(screen.getByText(/save your booking/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('disables the save button until a valid email is entered', () => {
    render(<ExitIntentModal open={true} onSave={() => {}} onDismiss={() => {}} />);
    const button = screen.getByRole('button', { name: /save & email/i });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    expect(button).not.toBeDisabled();
  });

  it('calls onSave with the email when clicked', () => {
    const onSave = vi.fn();
    render(<ExitIntentModal open={true} onSave={onSave} onDismiss={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save & email/i }));
    expect(onSave).toHaveBeenCalledWith('jane@example.com');
  });

  it('calls onDismiss when the dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<ExitIntentModal open={true} onSave={() => {}} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /no thanks/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- ExitIntentModal.test.jsx`

- [ ] **Step 3: Implement the component**

```javascript
import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ExitIntentModal({ open, onSave, onDismiss }) {
  const [email, setEmail] = useState('');
  if (!open) return null;
  const valid = EMAIL_RE.test(email.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 16,
      }}
    >
      <div style={{
        background: '#0f172a', color: '#f1f5f9',
        borderRadius: 12, padding: 28, maxWidth: 420, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Save your booking?</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.5 }}>
          We'll email you a link so you can come back when you're ready. No commitment.
        </p>
        <label htmlFor="exit-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
        <input
          id="exit-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            width: '100%', padding: '10px 12px', fontSize: 15,
            borderRadius: 6, border: '1px solid #334155',
            background: '#1e293b', color: '#f1f5f9', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              flex: 1, padding: '10px 16px', fontSize: 14,
              borderRadius: 6, border: '1px solid #334155',
              background: 'transparent', color: '#cbd5e1', cursor: 'pointer',
            }}
          >
            No thanks
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onSave(email.trim())}
            style={{
              flex: 1, padding: '10px 16px', fontSize: 14, fontWeight: 600,
              borderRadius: 6, border: 'none',
              background: valid ? '#a855f7' : '#334155',
              color: '#fff', cursor: valid ? 'pointer' : 'not-allowed',
            }}
          >
            Save &amp; email
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- ExitIntentModal.test.jsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/Checkout/ExitIntentModal.jsx src/components/Checkout/ExitIntentModal.test.jsx
git commit -m "feat(checkout): ExitIntentModal — save-your-booking email prompt with email-or-dismiss"
```

---

## Task 9: useExitIntent + useTabReturn hooks

**Files:**
- Create: `src/components/Checkout/useExitIntent.js`
- Create: `src/components/Checkout/useTabReturn.js`
- Test: `src/components/Checkout/useExitIntent.test.js` (single combined file)

Two hooks. `useExitIntent` (desktop): returns `true` once when the mouse moves toward the top edge of the viewport. `useTabReturn` (mobile): returns `true` once after the page goes hidden then visible again.

- [ ] **Step 1: Write failing tests**

```javascript
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useExitIntent from './useExitIntent';
import useTabReturn from './useTabReturn';

describe('useExitIntent', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: true }));
    expect(result.current).toBe(false);
  });

  it('returns true after mouseleave near the top edge', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: true }));
    act(() => {
      const evt = new MouseEvent('mouseleave', { bubbles: true, clientY: 5 });
      document.dispatchEvent(evt);
    });
    expect(result.current).toBe(true);
  });

  it('does NOT trigger when disabled', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: false }));
    act(() => {
      const evt = new MouseEvent('mouseleave', { bubbles: true, clientY: 5 });
      document.dispatchEvent(evt);
    });
    expect(result.current).toBe(false);
  });

  it('does NOT trigger if mouse leaves the side, not the top', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: true }));
    act(() => {
      const evt = new MouseEvent('mouseleave', { bubbles: true, clientY: 500 });
      document.dispatchEvent(evt);
    });
    expect(result.current).toBe(false);
  });
});

describe('useTabReturn', () => {
  let originalVisibility;
  beforeEach(() => {
    originalVisibility = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  });
  afterEach(() => {
    if (originalVisibility) {
      Object.defineProperty(Document.prototype, 'visibilityState', originalVisibility);
    }
  });

  it('returns false initially', () => {
    const { result } = renderHook(() => useTabReturn({ enabled: true }));
    expect(result.current).toBe(false);
  });

  it('returns true after hidden → visible', () => {
    const { result } = renderHook(() => useTabReturn({ enabled: true }));
    act(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(true);
  });

  it('does NOT trigger if disabled', () => {
    const { result } = renderHook(() => useTabReturn({ enabled: false }));
    act(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- useExitIntent.test.js`

- [ ] **Step 3: Implement `src/components/Checkout/useExitIntent.js`**

```javascript
import { useEffect, useState } from 'react';

const TOP_THRESHOLD_PX = 20;

/**
 * Returns true (latched) once the mouse leaves the viewport near the top edge.
 * Disabled (always false) when `enabled` is false.
 */
export default function useExitIntent({ enabled }) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    function onLeave(e) {
      if (typeof e.clientY === 'number' && e.clientY < TOP_THRESHOLD_PX) {
        setTriggered(true);
      }
    }
    document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, [enabled]);

  return triggered;
}
```

- [ ] **Step 4: Implement `src/components/Checkout/useTabReturn.js`**

```javascript
import { useEffect, useRef, useState } from 'react';

/**
 * Returns true (latched) once after the document goes hidden, then visible again.
 * Disabled (always false) when `enabled` is false.
 */
export default function useTabReturn({ enabled }) {
  const wasHidden = useRef(false);
  const [returned, setReturned] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        wasHidden.current = true;
      } else if (document.visibilityState === 'visible' && wasHidden.current) {
        setReturned(true);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [enabled]);

  return returned;
}
```

- [ ] **Step 5: Run tests, expect PASS**

Run: `npm test -- useExitIntent.test.js`

- [ ] **Step 6: Commit**

```bash
git add src/components/Checkout/useExitIntent.js src/components/Checkout/useTabReturn.js src/components/Checkout/useExitIntent.test.js
git commit -m "feat(checkout): useExitIntent (desktop) + useTabReturn (mobile) hooks for ExitIntentModal trigger"
```

---

## Task 10: Wire ExitIntentModal into Checkout.jsx

**Files:**
- Modify: `src/pages/Checkout.jsx`

Render the modal whenever (a) we don't have an email yet AND (b) either exit-intent fires (desktop) or tab-return fires (mobile). Save → calls the same `handleEmailContinue` already wired in Phase 2. Dismiss → no-op (modal closes).

- [ ] **Step 1: Add imports**

In `src/pages/Checkout.jsx`, add at the top:

```javascript
import ExitIntentModal from '../components/Checkout/ExitIntentModal';
import useExitIntent from '../components/Checkout/useExitIntent';
import useTabReturn from '../components/Checkout/useTabReturn';
```

- [ ] **Step 2: Use the hooks + modal in the discovery-flight component**

After the existing state declarations (around the `[email, setEmail]` line), add:

```javascript
  const [exitDismissed, setExitDismissed] = useState(false);

  const exitTriggered = useExitIntent({ enabled: !isMisc && !email && !exitDismissed });
  const returnTriggered = useTabReturn({ enabled: !isMisc && !email && !exitDismissed });
  const showExitModal = !isMisc && !email && !exitDismissed && (exitTriggered || returnTriggered);
```

In the existing component's return JSX (right before the existing card form OR the EmailFirstStep render — anywhere that renders unconditionally), add:

```javascript
      <ExitIntentModal
        open={showExitModal}
        onSave={(typedEmail) => { setExitDismissed(true); handleEmailContinue(typedEmail); }}
        onDismiss={() => setExitDismissed(true)}
      />
```

(The modal renders nothing when `open=false`, so adding it unconditionally is safe and keeps hook order stable.)

- [ ] **Step 3: Run tests, expect no regression**

Run: `npm test`. The 165+ tests from Phase 2 + Phase 3's new tests should all pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(checkout): wire ExitIntentModal — exit-intent (desktop) + tab-return (mobile) triggers"
```

---

## Task 11: Document CART_RECOVERY_AUTO

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Append the env doc**

Open `.env.example`. Add at the bottom:

```
# Phase 3 — Automated cart recovery emails (cron). Default: false (manual sends only).
# When true, server.js registers a node-cron job that runs every 15 minutes:
#   - Marks active carts as abandoned after 1h idle
#   - Sends a 1h recovery email (respects quiet hours: 20:00–08:00 Europe/London)
#   - Sends a 24h follow-up after the first email
#   - Marks abandoned carts expired after 7 days, prunes completed/expired after 90 days
# Send rate is capped at 50 emails per tick.
# Recommended rollout: ship with this OFF for ~1 week, watch manual sends, then enable.
CART_RECOVERY_AUTO=false
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs(env): document CART_RECOVERY_AUTO scheduler flag with rollout guidance"
```

---

## Task 12: Final integration smoke test (manual)

This is the verification gate. The cron itself is hard to test live without waiting 15 minutes — instead, expose `runRecoveryTick` via a temporary admin endpoint OR trigger it directly via `node -e` for the smoke test.

- [ ] **Step 1: Restart dev server**

```bash
npm run dev
```

Confirm console prints `[cart-recovery] auto mode DISABLED` — the safe default.

- [ ] **Step 2: Send a recovery email manually (smoke the new template + headers)**

From `/admin/analytics`, click "Send recovery" on any test cart. Open the email. Verify:
- Subject line: `Your HQ Aviation booking is saved`
- Resume link contains `utm_source=recovery&utm_medium=email&utm_campaign=cart-manual`
- Bottom of HTML has a 1×1 image (open the email source to see it)
- Email headers (in your client's "Show original" / "Raw source") include:
  - `List-Unsubscribe: <mailto:…>, <https://…/api/carts/unsubscribe?t=…>`
  - `List-Unsubscribe-Post: List-Unsubscribe=One-Click`

- [ ] **Step 3: Open tracking**

Open the email. Wait 5 seconds. Reload `/admin/analytics`. The cart's send count should now show as opened (look at Firestore directly if the dashboard doesn't surface this yet — `recoveryEmailsSent[0].opened` should be `true`).

- [ ] **Step 4: Click tracking**

Click the "Complete your booking" link in the email. You should land on `/checkout?t=<token>...` and the cart's basket should rehydrate. Reload `/admin/analytics` — `recoveryEmailsSent[0].clicked` should now be `true` in Firestore.

- [ ] **Step 5: Exit-intent (desktop only)**

In an incognito window, go to `/training/trial-lessons` → pick + Book Now → land on `/checkout`. Without entering an email, move the mouse rapidly toward the top of the screen as if to close the tab. The ExitIntentModal should appear.

Click "No thanks" — modal closes, no further prompts.

- [ ] **Step 6: Tab-return (mobile only)**

Open `/training/trial-lessons` on a phone (or in DevTools' mobile-emulation mode), pick + Book Now → `/checkout`. Without entering an email, switch to another tab/app, then switch back. The ExitIntentModal should appear. Type an email + click Save → cart is created with the email.

- [ ] **Step 7: Cron tick (manual trigger)**

While the dev server is NOT running auto-mode, run a one-off tick from the CLI:

```bash
node -e "(async () => {
  const { runRecoveryTick } = require('./api/cart-recovery-runner');
  const tick = await runRecoveryTick(new Date());
  console.log(JSON.stringify(tick, null, 2));
})();"
```

Inspect the output:
- `scanned`: number of carts looked at
- `marked`: number of state transitions written
- `sent`: number of emails sent
- `pruned`: number of old carts deleted
- `deferred_quiet`: number of sends skipped because we're in quiet hours
- `errors`: array of any per-cart errors

Try setting your machine's clock or use a fake `now` to test the boundaries:

```bash
node -e "(async () => {
  const { runRecoveryTick } = require('./api/cart-recovery-runner');
  // Simulate 02:00 London (quiet hours)
  const fakeNow = new Date('2026-05-15T01:00:00Z'); // 02:00 BST
  const tick = await runRecoveryTick(fakeNow);
  console.log(JSON.stringify(tick, null, 2));
})();"
```

Expected: `deferred_quiet > 0` if there are any cart that would have been emailed.

- [ ] **Step 8: Enable auto mode**

Set `CART_RECOVERY_AUTO=true` in `.env`. Restart dev server. Console prints `[cart-recovery] auto mode ENABLED — scheduling every 15 minutes`. Wait 15 minutes (or just verify the schedule is registered — `node-cron` keeps the timer in memory; you'll see ticks run every 15 min).

- [ ] **Step 9: Final commit (if any docs/lint touch-ups)**

```bash
git status
# If anything outstanding, commit it. Otherwise nothing to do.
```

---

## Acceptance criteria for Phase 3

- All 12 tasks complete with green tests where applicable.
- `runRecoveryTick()` correctly transitions cart states (active→abandoned at 1h, abandoned→expired at 7d, prune at 90d) and queues emails (1h, 24h follow-up).
- Recovery emails carry RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers.
- Open pixel writes `recoveryEmailsSent[i].opened = true`; resume link writes `clicked = true`.
- Quiet hours (20:00–08:00 London) prevent send actions; state transitions still happen.
- `CART_RECOVERY_AUTO=false` (default) skips cron registration entirely; the server boots and logs the disabled state.
- ExitIntentModal appears on `/checkout` for desktop mouse-leave OR mobile tab-return when no email captured; pressing Save creates a cart, pressing No thanks dismisses without creating a cart.
- 90-day pruning deletes completed/expired carts permanently.
- All Phase 1 + Phase 2 tests still pass; no regression.

## Out of scope for Phase 3 (deferred)

- A 3rd email at 72h (kept disabled — feature flag exists in plan, no code yet).
- DKIM signature verification on the List-Unsubscribe headers (relies on existing transport DKIM).
- Geo-enrichment of server-side `purchase` events (still TODO from Phase 1).
- Phase 4: Search Console keyword tile.
- Phase 5: Geography map + Top Pageviews tile.
