> **ARCHIVED 2026-05-12**
> This plan was abandoned with zero matching code in `src/` or `api/`. Replaced by `docs/superpowers/specs/2026-05-12-site-hardening-roadmap-design.md` §3 (non-goals). Do not implement.

# Analytics Info Tooltips — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small `(i)` info icon next to every tile heading and every metric label on `/admin/analytics`. Clicking it opens a popover with a plain-English explanation of what the metric means and how to interpret it. The owner can use the dashboard without needing technical knowledge.

**Architecture:** A reusable `<InfoTooltip topic="..." />` component renders a small icon-button that toggles a popover. All explanation copy lives in one central glossary file (`analyticsGlossary.js`), keyed by `topic`, so the copy can be edited in one place without touching the tiles. Click-to-open (not hover) for touch-friendliness and keyboard accessibility.

**Tech Stack:** React + Vite + vitest + @testing-library/react. No new deps.

---

## Glossary scope (every label that gets an info icon)

**Top metric cards** (5 items): Page Views, Unique Sessions, Bounce Rate, Avg. Time on Page, Avg. Scroll Depth

**Phase 1 — PurchaseFunnel tile** (8 items): Tile heading, Viewed Product, Started Checkout, Purchased, AOV, Revenue, Median time to convert, Source filter

**Phase 2 — AbandonedCartTile tile** (7 items): Tile heading, "Recoverable £" headline, Carts, Abandoned, Recoverable, Emailed, Recovered

**Phase 4 — SearchKeywords tile** (5 items): Tile heading, Clicks, Impressions, CTR, Avg. Position

**Existing AdminAnalytics CardTitles** (12 items): Page Views & Sessions chart, Time on Page by URL, Booking Journey, Top Pages, Traffic Sources, Top Referrers, Devices & Browsers, Top Countries, Sessions by Hour, Scroll Depth by Page, Top User Journeys, Top UTM Campaigns, Top UTM Sources, Top CTA Clicks, Top Form Submit Pages

Total: **~37 explanation entries**, all in `analyticsGlossary.js`.

---

## File Structure

**New files:**
- `src/components/admin/analytics/InfoTooltip.jsx` — the `(i)` icon-button + popover component. Click-to-open, click-outside-to-close, Esc-to-close.
- `src/components/admin/analytics/InfoTooltip.test.jsx` — render, click-to-open, click-outside-to-close, Esc-to-close, missing-topic graceful behaviour.
- `src/components/admin/analytics/analyticsGlossary.js` — single object: `{ topic: { title, body } }` for every tooltipped item.

**Modified files (small additions only):**
- `src/components/admin/analytics/PurchaseFunnel.jsx` — info icon next to each Stat label + tile heading + each funnel stage label.
- `src/components/admin/analytics/AbandonedCartTile.jsx` — info icon next to heading + the "£X recoverable" tag + each funnel stage label.
- `src/components/admin/analytics/SearchKeywords.jsx` — info icon next to heading + each Stat label.
- `src/pages/admin/AdminAnalytics.jsx` — info icon next to each `<CardTitle>` and each `<MetricCard label=...>`.

**Test runner:** `npm test` (vitest). Tests next to file under test.

---

## Task 1: InfoTooltip component

**Files:**
- Create: `src/components/admin/analytics/InfoTooltip.jsx`
- Test: `src/components/admin/analytics/InfoTooltip.test.jsx`

A small icon-button. Click toggles a popover containing the explanation. Click outside or press Esc to close.

- [ ] **Step 1: Write failing tests**

Create `src/components/admin/analytics/InfoTooltip.test.jsx`:

```javascript
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoTooltip from './InfoTooltip';

describe('InfoTooltip', () => {
  it('renders an info button with aria-label', () => {
    render(<InfoTooltip topic="aov" />);
    const button = screen.getByRole('button', { name: /more info/i });
    expect(button).toBeInTheDocument();
  });

  it('does not show the popover initially', () => {
    render(<InfoTooltip topic="aov" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the popover with the glossary content when clicked', () => {
    render(<InfoTooltip topic="aov" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // The default glossary entry for 'aov' should appear
    expect(screen.getByText(/Average Order Value/i)).toBeInTheDocument();
  });

  it('closes the popover when the close button is clicked', () => {
    render(<InfoTooltip topic="aov" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the popover when Escape is pressed', () => {
    render(<InfoTooltip topic="aov" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders gracefully (no crash) when given an unknown topic', () => {
    render(<InfoTooltip topic="this-does-not-exist" />);
    fireEvent.click(screen.getByRole('button', { name: /more info/i }));
    // Popover opens with a sensible fallback
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/no description available/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- InfoTooltip.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/admin/analytics/InfoTooltip.jsx`**

```javascript
import { useEffect, useRef, useState } from 'react';
import { GLOSSARY } from './analyticsGlossary';

const FALLBACK = { title: 'No description available', body: 'This metric does not have an explanation registered yet.' };

export default function InfoTooltip({ topic }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const entry = GLOSSARY[topic] || FALLBACK;

  return (
    <span ref={wrapperRef} style={{ position: 'relative', display: 'inline-block', marginLeft: 6 }}>
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: 'transparent', color: '#94a3b8',
          border: '1px solid #475569',
          fontSize: 11, fontWeight: 600, fontStyle: 'italic',
          cursor: 'pointer', padding: 0, lineHeight: 1,
        }}
      >
        i
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            background: '#0f172a', color: '#f1f5f9',
            border: '1px solid #334155', borderRadius: 8,
            padding: '14px 16px',
            width: 320, maxWidth: '90vw',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 100,
            fontSize: 13, lineHeight: 1.5,
            textTransform: 'none',
            letterSpacing: 0,
            fontWeight: 400,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <strong style={{ fontSize: 13, color: '#f1f5f9' }}>{entry.title}</strong>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent', color: '#94a3b8',
                border: 'none', padding: 0, fontSize: 16, cursor: 'pointer', lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, color: '#cbd5e1' }}>{entry.body}</p>
        </div>
      )}
    </span>
  );
}
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- InfoTooltip.test.jsx`
Expected: PASS — all 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/InfoTooltip.jsx src/components/admin/analytics/InfoTooltip.test.jsx
git commit -m "feat(admin-analytics): InfoTooltip — click-open popover for metric explanations"
```

---

## Task 2: Glossary module

**Files:**
- Create: `src/components/admin/analytics/analyticsGlossary.js`

The single source of truth for every explanation. Keyed by `topic` string.

- [ ] **Step 1: Create the glossary**

```javascript
/**
 * Plain-English explanations for every tile/metric on /admin/analytics.
 * Each entry: { title, body }. Title appears bold at top of the popover; body is the prose.
 *
 * Edit copy here without touching component code.
 */

export const GLOSSARY = {
  // ─── Top Metric Cards ─────────────────────────────────────────
  pageViews: {
    title: 'Page Views',
    body: 'The total number of pages loaded on your site in this period. One person visiting four pages counts as four page views. A high number means people are exploring rather than bouncing off the first page they land on.',
  },
  uniqueSessions: {
    title: 'Unique Sessions',
    body: 'The number of separate visits to your site. One person opening the site, browsing for ten minutes, then leaving counts as one session. A new session starts after 30 minutes of inactivity. This is your closest equivalent to "how many real visitors today".',
  },
  bounceRate: {
    title: 'Bounce Rate',
    body: 'The percentage of visitors who leave after viewing only one page. Lower is better. Under 40% is healthy for an aviation site — visitors are clicking through to learn more. Over 60% suggests the landing page is not engaging or the visitor was not who you expected.',
  },
  avgTimeOnPage: {
    title: 'Average Time on Page',
    body: 'How long, on average, visitors spend on a single page before moving on. Two minutes is good — they are reading, not skimming. Under 30 seconds suggests the page is not holding their attention or they could not find what they wanted.',
  },
  avgScrollDepth: {
    title: 'Average Scroll Depth',
    body: 'How far down the page visitors scroll, on average. 100% means they reach the very bottom. Above 60% means most people are reading the full page. Below 40% suggests the most important content needs to move higher up.',
  },

  // ─── Purchase Funnel tile ─────────────────────────────────────
  purchaseFunnel: {
    title: 'Purchase Funnel — Discovery Flight',
    body: 'How many people moved through each step toward a Discovery Flight booking. The funnel narrows from "looked at a flight" to "actually paid". A big drop between two steps tells you exactly where customers hesitate — that is the spot to fix.',
  },
  viewedProduct: {
    title: 'Viewed Product',
    body: 'The number of separate visits where someone reached the Discovery Flight page (/training/trial-lessons or /training/discovery-flights). They have shown active interest but have not yet picked a card or clicked Book Now.',
  },
  startedCheckout: {
    title: 'Started Checkout',
    body: 'Visits where someone picked an aircraft + duration and clicked Book Now. They are committed enough to start filling in their details. The drop from this number to "Purchased" is your biggest lever — that is where you save abandoned carts.',
  },
  purchased: {
    title: 'Purchased',
    body: 'Confirmed payments. Each one is a real Discovery Flight booking processed by Stripe. Counts unique payment intents — duplicate webhooks (Stripe occasionally sends the same one twice) are deduped automatically.',
  },
  aov: {
    title: 'AOV (Average Order Value)',
    body: 'The average amount paid per booking. £350 means every booking is worth £350 on average. If this drops, it suggests buyers are picking shorter cheaper flights or skipping add-ons. If it rises, premium options are selling well.',
  },
  revenue: {
    title: 'Revenue',
    body: 'The total amount paid by Discovery Flight customers in this period. This is gross revenue from Stripe — before any refunds, fees, or tax. Match it against the Stripe dashboard for a reconciliation check.',
  },
  medianTimeToConvert: {
    title: 'Median Time to Convert',
    body: 'Half of your buyers complete payment faster than this number; half take longer. If it says "3 hours", most decide quickly. If it says "5 days", they are researching for a while before booking — which means follow-up email and remarketing matter more than a perfect first impression.',
  },
  funnelSourceFilter: {
    title: 'Source Filter',
    body: 'Splits the funnel by where the visitor came from (Google, Instagram, direct, etc.). Switch the filter to see if Google traffic converts better than Instagram, or whether direct visitors are your warmest audience. The biggest insights live behind this dropdown.',
  },

  // ─── Abandoned Cart tile ──────────────────────────────────────
  abandonedCarts: {
    title: 'Abandoned Carts',
    body: 'People who started a Discovery Flight booking and stopped before paying. We save their email at step one of checkout, so we can follow up and try to win them back. The recoverable carts table below shows who you can email right now.',
  },
  recoverableHeadline: {
    title: '£X Recoverable',
    body: 'The total pound value of abandoned carts that have an email on file and have not unsubscribed. This is the money sitting on the table — every pound here is reachable with a recovery email. Click "Send recovery" on any cart to try.',
  },
  cartsTotal: {
    title: 'Carts',
    body: 'The total number of carts created in this period — every booking-in-progress, including the ones that completed. The denominator for everything else.',
  },
  cartsAbandoned: {
    title: 'Abandoned',
    body: 'Carts that did not complete checkout. By default a cart is marked abandoned after 1 hour of inactivity. Industry average abandonment rate is around 70%. Over half of these are typically still recoverable.',
  },
  cartsRecoverable: {
    title: 'Recoverable',
    body: 'Abandoned carts where we have an email AND the customer has not unsubscribed. These are the carts you (or the auto-recovery cron) can email a "your booking is saved" message to.',
  },
  cartsEmailed: {
    title: 'Emailed',
    body: 'Recoverable carts where at least one recovery email has been sent (manual or automatic). If "Recoverable" is high but "Emailed" is low, there are abandoned bookings waiting for you to reach out — click Send recovery on any row in the table.',
  },
  cartsRecovered: {
    title: 'Recovered',
    body: 'Carts that were abandoned, received a recovery email, and then completed payment. This is the success metric — every recovered cart is a booking you would have lost without the follow-up. Industry benchmark is 5–15% recovery rate.',
  },

  // ─── Search Keywords (GSC) tile ───────────────────────────────
  searchKeywords: {
    title: 'Search Keywords (Google)',
    body: 'What people typed into Google to find your site, and how often you appeared in results. Pulled nightly from Google Search Console. Data lags 2 days (Google\'s reporting delay), so today is not yet visible.',
  },
  gscClicks: {
    title: 'Clicks',
    body: 'How many times someone clicked through to your site from a Google search result. The most important number on this tile — clicks are real visitors who chose you over competitors in the search list.',
  },
  gscImpressions: {
    title: 'Impressions',
    body: 'How many times your site appeared in Google search results — whether or not anyone clicked. High impressions with low clicks means people see your listing but it is not compelling enough to click. Time to improve titles and descriptions.',
  },
  gscCtr: {
    title: 'CTR (Click-Through Rate)',
    body: 'Of all the times your site appeared in search results, what percentage actually clicked. A 3% CTR means 3 in 100 searchers chose you. Aviation queries average 2–5%. Higher means your listing stands out; lower means competitors are winning the click.',
  },
  gscAvgPosition: {
    title: 'Avg. Position',
    body: 'Where you typically appear in Google search results, on average. 1 = top of page one. 10 = bottom of page one. 11+ = page two or worse. Below 4 is good — almost everyone clicks through. Above 10 means you are buried and rarely seen.',
  },

  // ─── Existing AdminAnalytics CardTitles ───────────────────────
  pageViewsAndSessions: {
    title: 'Page Views & Sessions over Time',
    body: 'A daily view of traffic over the selected period. Purple is unique sessions (real people); blue is page views (total page loads). The two lines tell you whether more people are visiting OR existing visitors are looking at more pages.',
  },
  timeOnPageByUrl: {
    title: 'Time on Page by URL',
    body: 'Which pages hold attention longest. The trial-lessons or discovery-flights page should ideally be near the top — that means people are reading the value prop, not bouncing. A short time on a key sales page is a warning sign.',
  },
  bookingJourney: {
    title: 'Booking Journey',
    body: 'A simplified path from landing on the site to completing a booking. Useful as a sanity check that the funnel still flows the way you expect. If you see drop-offs at unexpected steps, those are the pages to investigate.',
  },
  topPages: {
    title: 'Top Pages',
    body: 'The pages people view most often, ranked by page views. Your homepage will usually be #1. If a non-homepage page (like a specific aircraft listing) ranks high, that page is doing real marketing work for you.',
  },
  trafficSources: {
    title: 'Traffic Sources',
    body: 'How people arrive at your site, grouped by category: Google, social media (Instagram/Facebook), direct (typed the URL or clicked a saved link), email, and other. Tells you which marketing channels are actually delivering visitors.',
  },
  topReferrers: {
    title: 'Top Referrers',
    body: 'The specific external sites sending you traffic. Google.com is usually #1. If a flying-themed forum, blog, or partner site appears here, that is a relationship worth cultivating — they are doing free marketing for you.',
  },
  devicesAndBrowsers: {
    title: 'Devices & Browsers',
    body: 'Mobile vs desktop vs tablet, and which browsers people use. If 70% of your traffic is mobile, the mobile experience needs to be flawless. If a particular browser is over-represented, test the booking flow on it.',
  },
  topCountries: {
    title: 'Top Countries',
    body: 'Where in the world your visitors are based, by IP geolocation. UK should dominate. International visitors are interesting — they may be planning aviation holidays, looking for unusual experiences, or competitors checking up on you.',
  },
  sessionsByHour: {
    title: 'Sessions by Hour (UTC)',
    body: 'When during the day people visit. Typically a daytime curve with peaks around lunch and evening. If you see a flat distribution, you have international traffic balancing UK time zones. Useful for picking the best time to push a social post.',
  },
  scrollDepthByPage: {
    title: 'Scroll Depth by Page',
    body: 'How far down each page visitors scroll before leaving. A sales page that gets only 30% scroll depth is not delivering its message — the call-to-action is below where most people stop reading.',
  },
  topUserJourneys: {
    title: 'Top User Journeys',
    body: 'The most common sequences of pages people visit. "Home → Trial Lessons → Checkout" is the path you want to see frequently. Unexpected journeys (e.g. visitors looping through About Us repeatedly) often reveal that they are looking for something specific they cannot find.',
  },
  topUtmCampaigns: {
    title: 'Top UTM Campaigns',
    body: 'Visits tagged with a specific marketing campaign via UTM parameters in the URL (utm_campaign=...). Tells you which paid or tracked campaigns are actually delivering traffic. Untagged links show as "(none)".',
  },
  topUtmSources: {
    title: 'Top UTM Sources',
    body: 'The platform/source that brought tagged visitors (utm_source=...). Common values: google, facebook, instagram, newsletter. If you tag your social posts, this tile tells you which platform actually drives clicks.',
  },
  topCtaClicks: {
    title: 'Top CTA Clicks',
    body: 'Which call-to-action buttons people click most often: Book Now, Contact, Sign Up, etc. A high "Book Now" count is good. A high "Contact" count alongside few bookings suggests visitors have unanswered questions blocking the booking — worth a FAQ rewrite.',
  },
  topFormSubmits: {
    title: 'Top Form Submit Pages',
    body: 'The pages where visitors submit a form (contact, enquiry, alert signup). Tells you which pages are converting interest into a contactable lead. If a page gets lots of views but no submits, the form might be hidden or the page is not ready to ask for the email yet.',
  },
};
```

- [ ] **Step 2: Verify the module loads**

```bash
node -e "const { GLOSSARY } = require('./src/components/admin/analytics/analyticsGlossary'); console.log(Object.keys(GLOSSARY).length, 'entries');"
```

(Won't work directly — Vite uses ESM. The file loads at runtime via Vitest tests in Task 1.)

Skip this Step 2 — Task 1's `InfoTooltip.test.jsx` already imports the glossary indirectly via the component, so a full `npm test` validates the file loads.

- [ ] **Step 3: Run tests**

`npm test -- InfoTooltip.test.jsx` should still pass (the AOV test in Task 1 expects "Average Order Value" in the popover; this glossary delivers it).

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/analytics/analyticsGlossary.js
git commit -m "feat(admin-analytics): analytics glossary — central plain-English explanations for every metric"
```

---

## Task 3: Wire info icons into PurchaseFunnel

**Files:**
- Modify: `src/components/admin/analytics/PurchaseFunnel.jsx`

Add `<InfoTooltip topic="..." />` next to:
- The h2 heading (`Purchase Funnel — Discovery Flight`)
- Each of the four Stat labels (AOV, Revenue, Median time to convert, plus the Source filter label)
- Each funnel stage label (Viewed Product, Started Checkout, Purchased)

- [ ] **Step 1: Add the import**

In `src/components/admin/analytics/PurchaseFunnel.jsx`, add at the top with other imports:

```javascript
import InfoTooltip from './InfoTooltip';
```

- [ ] **Step 2: Add icon next to heading**

Find:
```jsx
<h2 style={{ margin: 0, fontSize: 18 }}>Purchase Funnel — Discovery Flight</h2>
```

Replace with:
```jsx
<h2 style={{ margin: 0, fontSize: 18 }}>Purchase Funnel — Discovery Flight<InfoTooltip topic="purchaseFunnel" /></h2>
```

- [ ] **Step 3: Add icons next to Stat labels**

The `Stat` component currently renders just the label. Modify it inline OR use a new `topic` prop. Find the Stat function definition near the bottom of the file:

```jsx
function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
```

Replace with:

```jsx
function Stat({ label, value, topic }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}{topic && <InfoTooltip topic={topic} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
```

Then find the Stat call sites:
```jsx
<Stat label="AOV" value={fmtGbp(value.aov)} />
<Stat label="Revenue" value={fmtGbp(value.totalValue)} />
<Stat label="Median time to convert" value={ttc !== null ? `${ttc.toFixed(1)}h` : '—'} />
```

Replace with:
```jsx
<Stat label="AOV" value={fmtGbp(value.aov)} topic="aov" />
<Stat label="Revenue" value={fmtGbp(value.totalValue)} topic="revenue" />
<Stat label="Median time to convert" value={ttc !== null ? `${ttc.toFixed(1)}h` : '—'} topic="medianTimeToConvert" />
```

- [ ] **Step 4: Add icon next to Source filter**

Find:
```jsx
<label style={{ fontSize: 13 }}>
  Source:{' '}
```

Replace with:
```jsx
<label style={{ fontSize: 13 }}>
  Source:<InfoTooltip topic="funnelSourceFilter" />{' '}
```

- [ ] **Step 5: Add icons next to funnel stage labels**

Find the `stages` array:
```jsx
  const stages = [
    { key: 'viewedProduct',  label: 'Viewed Product',   count: funnel.viewedProduct },
    { key: 'beganCheckout',  label: 'Started Checkout', count: funnel.beganCheckout },
    { key: 'purchased',      label: 'Purchased',        count: funnel.purchased },
  ];
```

Replace with:
```jsx
  const stages = [
    { key: 'viewedProduct',  label: 'Viewed Product',   count: funnel.viewedProduct,   topic: 'viewedProduct' },
    { key: 'beganCheckout',  label: 'Started Checkout', count: funnel.beganCheckout,   topic: 'startedCheckout' },
    { key: 'purchased',      label: 'Purchased',        count: funnel.purchased,       topic: 'purchased' },
  ];
```

Find where stages are rendered (the `.map((stage, i) =>` block). Locate the line:
```jsx
                <span style={{ fontSize: 14 }}>{stage.label}</span>
```

Replace with:
```jsx
                <span style={{ fontSize: 14 }}>{stage.label}<InfoTooltip topic={stage.topic} /></span>
```

- [ ] **Step 6: Run tests, verify no regression**

Run: `npm test -- PurchaseFunnel.test.jsx`
Expected: PASS — all existing tests still pass. The InfoTooltip icons add to the DOM but don't break any of the existing assertions (which look for stage labels by text — the tooltips render after the label, not inside it).

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/analytics/PurchaseFunnel.jsx
git commit -m "feat(admin-analytics): info tooltips on PurchaseFunnel — heading, stats, stages, source filter"
```

---

## Task 4: Wire info icons into AbandonedCartTile

**Files:**
- Modify: `src/components/admin/analytics/AbandonedCartTile.jsx`

Add `<InfoTooltip topic="..." />` next to:
- The h2 heading (`Abandoned Carts`)
- The "£X recoverable" headline span
- Each funnel stage label (Carts, Abandoned, Recoverable, Emailed, Recovered)

- [ ] **Step 1: Add the import**

```javascript
import InfoTooltip from './InfoTooltip';
```

- [ ] **Step 2: Add icon next to heading**

Find:
```jsx
<h2 style={{ margin: 0, fontSize: 18 }}>Abandoned Carts</h2>
```

Replace with:
```jsx
<h2 style={{ margin: 0, fontSize: 18 }}>Abandoned Carts<InfoTooltip topic="abandonedCarts" /></h2>
```

- [ ] **Step 3: Add icon next to recoverable headline**

Find:
```jsx
<span style={{ fontSize: 22, fontWeight: 600, color: '#a855f7' }}>{fmtGbp(funnel.recoverableValueP)} recoverable</span>
```

Replace with:
```jsx
<span style={{ fontSize: 22, fontWeight: 600, color: '#a855f7' }}>
  {fmtGbp(funnel.recoverableValueP)} recoverable
  <InfoTooltip topic="recoverableHeadline" />
</span>
```

- [ ] **Step 4: Add icons next to funnel stage labels**

Find the `stages` array:
```jsx
  const stages = [
    { key: 'totalCarts',  label: 'Carts',       count: funnel.totalCarts },
    { key: 'abandoned',   label: 'Abandoned',   count: funnel.abandoned },
    { key: 'recoverable', label: 'Recoverable', count: funnel.recoverable },
    { key: 'emailed',     label: 'Emailed',     count: funnel.emailed },
    { key: 'recovered',   label: 'Recovered',   count: funnel.recovered },
  ];
```

Replace with:
```jsx
  const stages = [
    { key: 'totalCarts',  label: 'Carts',       count: funnel.totalCarts,  topic: 'cartsTotal' },
    { key: 'abandoned',   label: 'Abandoned',   count: funnel.abandoned,   topic: 'cartsAbandoned' },
    { key: 'recoverable', label: 'Recoverable', count: funnel.recoverable, topic: 'cartsRecoverable' },
    { key: 'emailed',     label: 'Emailed',     count: funnel.emailed,     topic: 'cartsEmailed' },
    { key: 'recovered',   label: 'Recovered',   count: funnel.recovered,   topic: 'cartsRecovered' },
  ];
```

Find the line that renders stage labels:
```jsx
              <span style={{ fontSize: 14 }}>{stage.label}</span>
```

Replace with:
```jsx
              <span style={{ fontSize: 14 }}>{stage.label}<InfoTooltip topic={stage.topic} /></span>
```

- [ ] **Step 5: Run tests, verify no regression**

Run: `npm test -- AbandonedCartTile.test.jsx`
Expected: PASS — all existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/analytics/AbandonedCartTile.jsx
git commit -m "feat(admin-analytics): info tooltips on AbandonedCartTile — heading, recoverable, stages"
```

---

## Task 5: Wire info icons into SearchKeywords

**Files:**
- Modify: `src/components/admin/analytics/SearchKeywords.jsx`

Add `<InfoTooltip topic="..." />` next to:
- The h2 heading (`Search Keywords (Google)`)
- Each Stat label (Clicks, Impressions, CTR, Avg. Position)

- [ ] **Step 1: Add the import**

```javascript
import InfoTooltip from './InfoTooltip';
```

- [ ] **Step 2: Add icon next to heading**

Find:
```jsx
<h2 style={{ margin: 0, fontSize: 18 }}>Search Keywords (Google)</h2>
```

Replace with:
```jsx
<h2 style={{ margin: 0, fontSize: 18 }}>Search Keywords (Google)<InfoTooltip topic="searchKeywords" /></h2>
```

- [ ] **Step 3: Extend the Stat component**

Find the local `Stat` component:
```jsx
function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
```

Replace with:
```jsx
function Stat({ label, value, topic }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}{topic && <InfoTooltip topic={topic} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
```

- [ ] **Step 4: Add `topic` props to Stat call sites**

Find:
```jsx
<Stat label="Clicks" value={fmtNum(stats.clicks)} />
<Stat label="Impressions" value={fmtNum(stats.impressions)} />
<Stat label="CTR" value={fmtPct(stats.ctr)} />
<Stat label="Avg. Position" value={fmtPos(stats.avgPosition)} />
```

Replace with:
```jsx
<Stat label="Clicks" value={fmtNum(stats.clicks)} topic="gscClicks" />
<Stat label="Impressions" value={fmtNum(stats.impressions)} topic="gscImpressions" />
<Stat label="CTR" value={fmtPct(stats.ctr)} topic="gscCtr" />
<Stat label="Avg. Position" value={fmtPos(stats.avgPosition)} topic="gscAvgPosition" />
```

- [ ] **Step 5: Run tests, verify no regression**

Run: `npm test -- SearchKeywords.test.jsx`
Expected: PASS — all existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/analytics/SearchKeywords.jsx
git commit -m "feat(admin-analytics): info tooltips on SearchKeywords — heading + stats"
```

---

## Task 6: Wire info icons into AdminAnalytics tiles

**Files:**
- Modify: `src/pages/admin/AdminAnalytics.jsx`

Add `<InfoTooltip topic="..." />` next to:
- Each `<MetricCard label="...">` (5 instances: Page Views, Unique Sessions, Bounce Rate, Avg. Time on Page, Avg. Scroll Depth)
- Each `<CardTitle>` (12 instances)

The InfoTooltip is rendered as a `<span>` so it composes into existing label content cleanly.

- [ ] **Step 1: Add the import**

In `src/pages/admin/AdminAnalytics.jsx`, near the other component imports at the top:

```javascript
import InfoTooltip from '../../components/admin/analytics/InfoTooltip';
```

- [ ] **Step 2: Extend `MetricCard` to accept a `topic` prop**

Find the `MetricCard` component definition (search `function MetricCard` or `const MetricCard`). Locate where the `label` is rendered. Wherever the existing code does something like:

```jsx
<div className="...">{label}</div>
```

Add a `topic` prop and append the InfoTooltip:

```jsx
<div className="...">{label}{topic && <InfoTooltip topic={topic} />}</div>
```

If MetricCard's signature is currently `function MetricCard({ label, value, sub, subColor, sparkData, sparkColor, change }) { ... }`, change it to:

```jsx
function MetricCard({ label, value, sub, subColor, sparkData, sparkColor, change, topic }) { ... }
```

If the layout is different (e.g. label is a top-level prop on a styled component), pick the smallest insertion point that puts the icon next to the label text without disturbing layout.

- [ ] **Step 3: Add `topic` to each MetricCard call**

Find:
```jsx
<MetricCard label="Page Views" value={pageviews.length.toLocaleString()} sparkData={pvSpark} sparkColor={C.blue} change={pctChange(pageviews.length, prevPageviews.length)} />
<MetricCard label="Unique Sessions" value={uniqueSessions.toLocaleString()} sparkData={sessSpark} sparkColor={C.purple} change={pctChange(uniqueSessions, prevUniqueSessions)} />
```

Add `topic="pageViews"` and `topic="uniqueSessions"` respectively.

For the next three:
```jsx
<MetricCard label="Bounce Rate" value={`${bounce}%`} sub={...} subColor={...} />
<MetricCard label="Avg. Time on Page" value={formatDuration(avgTime)} sub="across all pages" />
<MetricCard label="Avg. Scroll Depth" value={`${avgScroll}%`} sub={...} subColor={...} />
```

Add `topic="bounceRate"`, `topic="avgTimeOnPage"`, `topic="avgScrollDepth"` respectively.

- [ ] **Step 4: Add icons next to each CardTitle**

For each of these CardTitle lines, append `<InfoTooltip topic="..." />` after the title text. The mapping:

| Line | Original | Replacement |
|------|----------|-------------|
| `<CardTitle>Time on Page by URL</CardTitle>` | unchanged | `<CardTitle>Time on Page by URL<InfoTooltip topic="timeOnPageByUrl" /></CardTitle>` |
| `<CardTitle>Booking Journey</CardTitle>` | unchanged | `<CardTitle>Booking Journey<InfoTooltip topic="bookingJourney" /></CardTitle>` |
| `<CardTitle>Top Pages</CardTitle>` | unchanged | `<CardTitle>Top Pages<InfoTooltip topic="topPages" /></CardTitle>` |
| `<CardTitle>Traffic Sources</CardTitle>` | unchanged | `<CardTitle>Traffic Sources<InfoTooltip topic="trafficSources" /></CardTitle>` |
| `<CardTitle>Top Referrers</CardTitle>` | unchanged | `<CardTitle>Top Referrers<InfoTooltip topic="topReferrers" /></CardTitle>` |
| `<CardTitle>Devices &amp; Browsers</CardTitle>` | unchanged | `<CardTitle>Devices &amp; Browsers<InfoTooltip topic="devicesAndBrowsers" /></CardTitle>` |
| `<CardTitle>Top Countries</CardTitle>` | unchanged | `<CardTitle>Top Countries<InfoTooltip topic="topCountries" /></CardTitle>` |
| `<CardTitle>Scroll Depth by Page</CardTitle>` | unchanged | `<CardTitle>Scroll Depth by Page<InfoTooltip topic="scrollDepthByPage" /></CardTitle>` |
| `<CardTitle>Top User Journeys</CardTitle>` | unchanged | `<CardTitle>Top User Journeys<InfoTooltip topic="topUserJourneys" /></CardTitle>` |
| `<CardTitle>Top UTM Campaigns</CardTitle>` | unchanged | `<CardTitle>Top UTM Campaigns<InfoTooltip topic="topUtmCampaigns" /></CardTitle>` |
| `<CardTitle>Top UTM Sources</CardTitle>` | unchanged | `<CardTitle>Top UTM Sources<InfoTooltip topic="topUtmSources" /></CardTitle>` |
| `<CardTitle>Top CTA Clicks</CardTitle>` | unchanged | `<CardTitle>Top CTA Clicks<InfoTooltip topic="topCtaClicks" /></CardTitle>` |
| `<CardTitle>Top Form Submit Pages</CardTitle>` | unchanged | `<CardTitle>Top Form Submit Pages<InfoTooltip topic="topFormSubmits" /></CardTitle>` |

For the "Page Views & Sessions — Last N Days" header (which is a `<span>` inside a Card, not a CardTitle), find:

```jsx
<span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>Page Views &amp; Sessions — Last {days} Days</span>
```

Replace with:
```jsx
<span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
  Page Views &amp; Sessions — Last {days} Days<InfoTooltip topic="pageViewsAndSessions" />
</span>
```

For the "Sessions by Hour (UTC)" header (which is a `<div>`, not a CardTitle), find:

```jsx
<div style={{ fontSize: '0.7rem', color: C.dim, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessions by Hour (UTC)</div>
```

Replace with:
```jsx
<div style={{ fontSize: '0.7rem', color: C.dim, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
  Sessions by Hour (UTC)<InfoTooltip topic="sessionsByHour" />
</div>
```

- [ ] **Step 5: Run tests, expect no regression**

Run: `npm test`
Expected: 224+ tests pass (221 existing + 6 new InfoTooltip tests).

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/AdminAnalytics.jsx
git commit -m "feat(admin-analytics): info tooltips on every CardTitle + MetricCard"
```

---

## Task 7: Final visual smoke test (manual)

- [ ] **Step 1: Restart dev server**

```bash
npm run dev
```

- [ ] **Step 2: Walk through every tile**

Open `http://localhost:5173/admin/analytics` (sign in as admin first). Verify:
1. Each top metric card (Page Views, Unique Sessions, Bounce Rate, Avg. Time on Page, Avg. Scroll Depth) has a small `(i)` icon to the right of its label.
2. Click any `(i)` — a popover appears with a clear title and 30-100 word explanation.
3. Click the `×` button or anywhere outside the popover — it closes.
4. Press Esc while a popover is open — it closes.
5. Press Tab — the icon button is focusable and shows the system focus ring.
6. Repeat for the Purchase Funnel tile (heading, stages, AOV/Revenue/Median, Source filter).
7. Repeat for the Abandoned Carts tile (heading, recoverable headline, all five stages).
8. Repeat for the Search Keywords tile (heading, all four stats).
9. Repeat for every existing tile heading (Top Pages, Traffic Sources, etc.).

- [ ] **Step 3: Mobile sanity check**

In DevTools' mobile emulation mode (or a real phone):
- Tap an `(i)` icon — popover should open.
- Tap outside — popover should close.
- Popover should not overflow off-screen (CSS `maxWidth: '90vw'` in InfoTooltip handles this).

- [ ] **Step 4: Final commit (if any docs/lint touch-ups)**

```bash
git status
# If anything outstanding, commit it. Otherwise nothing to do.
```

---

## Acceptance criteria

- All 7 tasks complete with green tests where applicable.
- Every tile heading on `/admin/analytics` has an `(i)` icon next to the title.
- Every metric label / Stat / funnel stage / MetricCard has an `(i)` icon next to its label.
- Clicking any icon opens a popover with a plain-English explanation (~30-100 words).
- Popover closes on `×` click, click-outside, and Esc.
- Mobile (touch) works.
- All ~37 explanations are written and accessible from `analyticsGlossary.js`.
- All existing tests still pass (221 from prior phases + 6 new = 227 total).

## Out of scope

- Hover-to-preview (separate from click). The current click-to-open handles touch + keyboard cleanly without the hover/touch ambiguity that breaks tooltips on mobile.
- Multi-language glossary. English only for v1.
- Linking from the popover to a deeper help-doc page. The body text is the doc.
