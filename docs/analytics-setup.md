# Analytics — GA4 + Microsoft Clarity setup

This site has two client-side analytics layers wired in (in addition to the
custom server-side `/api/analytics` pipeline that pre-dates them):

| Layer | What it captures | Free? | Lives at |
|---|---|---|---|
| **GA4 (Google Analytics 4)** | Pageviews, ecommerce events, traffic sources, audience, attribution | Yes, always | analytics.google.com |
| **Microsoft Clarity** | Session recordings, heatmaps, scroll, rage-click + dead-click detection, JS errors | Yes, always | clarity.microsoft.com |
| **Custom (`/api/analytics`)** | Same events as GA4, written to Firestore `analytics_*` collections for our own reporting | n/a | this repo |

All three fire from the same `trackEvent()` call in `src/lib/analytics.js`, so
existing call sites get all three layers automatically.

---

## ⚠️ UK GDPR / PECR — consent gate not implemented

Tracking cookies (GA4, Clarity) are **non-essential cookies** under UK PECR.
Setting them without explicit user consent is illegal and exposes the company
to ICO complaints + fines.

No consent banner is wired on the site yet. The consent gate hook lives in
`src/lib/analytics.js#_canTrack()` and currently always returns `true`.

**Two responsible paths forward:**

1. **Leave the env vars empty** until a consent banner is built. The init
   functions are no-ops without env vars, so no scripts load and no cookies
   are set. Safe legal position.
2. **Wire a consent banner** (e.g. CookieYes, Cookiebot, or a custom
   `<ConsentBanner>` component) that writes a `localStorage` key. Update
   `_canTrack()` to check that key. Then set the env vars.

Until one of those is in place, set `VITE_GA_MEASUREMENT_ID` and
`VITE_CLARITY_PROJECT_ID` only with informed consent of the risk.

---

## Setup — one-time

### 1. Create a GA4 property
1. https://analytics.google.com → Admin → **Create Property**.
2. Property name: `HQ Aviation`. Time zone: UK. Currency: GBP.
3. Under the new property → **Data Streams** → **Add stream** → **Web**.
4. Website URL: `https://hqaviation.com`. Stream name: `Production`.
5. Copy the **Measurement ID** (format `G-XXXXXXXXXX`).

### 2. Create a Microsoft Clarity project
1. https://clarity.microsoft.com → **+ New project**.
2. Project name: `HQ Aviation`. Site URL: `https://hqaviation.com`.
3. Copy the **Project ID** (10-character alphanumeric, e.g. `wq3ln0swwj`).

### 3. Set env vars
Local dev (`.env.local`, never commit):
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=xxxxxxxxxx
```

Production — set the same two vars at build time. With the current Cloud
Build + Firebase Hosting pipeline that means setting them as build args on
the deploy step (Vite substitutes `import.meta.env.VITE_*` at build, not at
runtime, so a runtime env var on Cloud Run has no effect on the SPA).

### 4. Deploy + verify
1. `npm run build`
2. `firebase deploy --only hosting`
3. Open https://hqaviation.com in an incognito window.
4. **GA4 verify**: GA4 → Reports → Realtime. You should appear within 30 sec.
5. **Clarity verify**: clarity.microsoft.com → your project → Recordings.
   First recording can take 10–30 min to render (Clarity batches uploads).

---

## What gets tracked automatically

Every call to `trackEvent(type, elementId, page, data)` fires the same event
to all three layers. The codebase already calls `trackEvent` from:

| File | Events fired | When |
|---|---|---|
| `src/components/PageTracker.jsx` | `pageview`, `scroll_depth`, `page_exit` | Every SPA route change + scroll/exit |
| `src/pages/DiscoveryFlight.jsx` | `view_item`, `begin_checkout` | Trial-lesson page + booking start |
| `src/pages/Checkout.jsx` | `add_payment_info` | Stripe payment step |
| `src/pages/BookingConfirmed.jsx` | `purchase` | Booking completion |

GA4 reserved names are mapped automatically (e.g. `pageview` → `page_view`,
`scroll_depth` → `scroll`). Custom events pass through with the same name.

To add more conversion events, just call `trackEvent` — all three layers
pick it up.

---

## Adding the consent banner (TODO)

When the consent banner ships:
1. Replace `_canTrack()` in `src/lib/analytics.js` to read the consent state.
2. `_canTrack()` is checked inside `initGA4`, `initClarity`, and on every
   `trackEvent` mirror, so flipping consent state on/off should work
   end-to-end without other changes.
3. If consent is **denied**, the scripts have already loaded (if the page
   bootstrapped with consent unknown) — call `gtag('consent', 'update', {
   'analytics_storage': 'denied' })` to suppress subsequent events without
   removing the script.
4. Document the chosen consent library / pattern in this file.

---

## Dashboards / where to look weekly

- **GA4 → Reports → Acquisition → Traffic acquisition** — where visitors come
  from. Compare organic / direct / social / referral.
- **GA4 → Reports → Engagement → Pages and screens** — most-viewed pages
  + bounce rate.
- **GA4 → Reports → Monetisation → Ecommerce purchases** — value, revenue,
  AOV (once `purchase` events stabilise).
- **Clarity → Recordings** — pick 3-5 sessions per week, watch the trial
  lesson booking journey and the contact form path. Most insight comes from
  qualitative viewing, not quantitative dashboards.
- **Clarity → Heatmaps** — pick a page, view its click heatmap to see CTA
  effectiveness.
