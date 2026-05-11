# /booking-confirmed Loading Window + Hero R44 Upgrade Pitch — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Processing…" stall on `/checkout` after Stripe success with a 4-second "Confirming Booking" loading phase on `/booking-confirmed` that displays a hero R44 upgrade pitch card.

**Architecture:** Two-phase state machine on `BookingConfirmed.jsx`. Phase 1 (`confirming`): spinner + "Confirming Booking" title + hero `<BigUpgradeCard>` (R22 bookers only). Phase 2 (`confirmed`): checkmark + "Booking Confirmed" + thank-you subtitle + Booking Summary card (with the existing compact green upgrade row inside). `record-booking` is moved from `CheckoutForm.handleSubmit` to `BookingConfirmed.jsx` mount; failure navigates back to `/checkout?error=…`. Misc bookings short-circuit the phases.

**Tech Stack:** React 19, Vite 8, Express 4 (unchanged backend), Vitest + RTL, jsdom.

**Spec:** `docs/superpowers/specs/2026-05-11-booking-confirmed-loading-upgrade-pitch-design.md`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/components/booking/BigUpgradeCard.jsx` | Hero R44 pitch card shown during Phase 1. Reuses the existing `<UpgradeOfferCard>`'s modal via a click→open trigger. |
| Create | `src/components/booking/BigUpgradeCard.test.jsx` | Renders for R22 + eligible; null otherwise; opens modal on CTA click. |
| Modify | `src/components/booking/UpgradeOfferCard.jsx` | Export an additional `<UpgradeModalOnly>` component that wraps just the modal (no compact row), reusable from `BigUpgradeCard`. |
| Modify | `src/pages/BookingConfirmed.jsx` | Two-phase state machine + `record-booking` fire on mount + spinner/title swap + conditional render. |
| Modify | `src/pages/BookingConfirmed.test.jsx` | Phase 1/2 transitions, failure navigation, misc short-circuit. |
| Modify | `src/pages/Checkout.jsx` | `CheckoutForm.handleSubmit` navigates immediately (no record-booking wait). Page-level effect reads `?error=` and surfaces it. |

---

### Task 1: Export a modal-only wrapper from `UpgradeOfferCard.jsx`

**Why:** `BigUpgradeCard` will trigger the same upgrade modal as the compact row. To avoid duplicating the Stripe Elements + form code, we expose a self-contained modal component that consumers can mount alongside their own trigger button.

**Files:**
- Modify: `src/components/booking/UpgradeOfferCard.jsx`

- [ ] **Step 1: Read current `UpgradeOfferCard.jsx` to find the existing `UpgradeModal` definition**

```bash
grep -n "function UpgradeModal\|export.*UpgradeModal" src/components/booking/UpgradeOfferCard.jsx
```

Expected: `function UpgradeModal({ booking, open, onClose, onSuccess })` is defined but NOT exported.

- [ ] **Step 2: Add named export for `UpgradeModal`**

Find the line `function UpgradeModal({ booking, open, onClose, onSuccess }) {` and change to `export function UpgradeModal({ booking, open, onClose, onSuccess }) {`.

- [ ] **Step 3: Verify build still passes**

```bash
npx vite build 2>&1 | grep -E "built|error" | tail -3
```

Expected: `✓ built in …` with no errors.

- [ ] **Step 4: Verify existing tests still pass**

```bash
npx vitest run src/components/booking/ 2>&1 | tail -5
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/booking/UpgradeOfferCard.jsx
git commit -m "feat(upgrade): export UpgradeModal for reuse by BigUpgradeCard"
```

---

### Task 2: Create `<BigUpgradeCard>` component

**Files:**
- Create: `src/components/booking/BigUpgradeCard.jsx`

- [ ] **Step 1: Create the file**

Create `src/components/booking/BigUpgradeCard.jsx` with:

```jsx
import { useState } from 'react';
import { UpgradeModal } from './UpgradeOfferCard';

const R44_PRICE_FALLBACK = { 30: 30500, 60: 60500 };

const fmtGbpNoZeros = (pence) => {
  const n = Number(pence) / 100;
  return Number.isInteger(n)
    ? `£${n.toLocaleString('en-GB')}`
    : `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Hero R44 upgrade pitch shown during the /booking-confirmed loading phase.
 * Visible only when the booker is R22 + not yet upgraded + has a positive
 * upgrade diff. Click "Upgrade now" opens the same modal as the compact
 * green row inside the Booking Summary card.
 */
export default function BigUpgradeCard({ booking, onUpgraded }) {
  const [modalOpen, setModalOpen] = useState(false);
  if (!booking) return null;
  if (booking.aircraft !== 'r22') return null;
  if (booking.upgrade) return null;

  const flightPaid = Number(booking.flightAmountPence) || 0;
  const defaultDur = booking.duration === 60 ? 60 : 30;
  const diffPence = (typeof booking.upgradeDiffPence === 'number' && booking.upgradeDiffPence > 0)
    ? booking.upgradeDiffPence
    : (R44_PRICE_FALLBACK[defaultDur] - flightPaid);
  if (diffPence <= 0) return null;

  return (
    <>
      <div style={S.card}>
        <div style={S.photoFrame}>
          <img
            src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png"
            alt="Robinson R44"
            style={S.photo}
          />
        </div>
        <div style={S.body}>
          <h2 style={S.title}>UPGRADE TO THE R44</h2>
          <p style={S.pitch}>You at the controls.</p>
          <p style={S.pitch}>Two mates in the back.</p>
          <p style={S.price}>{fmtGbpNoZeros(diffPence)} to upgrade</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={S.cta}
            aria-label="Upgrade now"
          >
            Upgrade now →
          </button>
        </div>
      </div>
      <UpgradeModal
        booking={booking}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onUpgraded}
      />
    </>
  );
}

const S = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    overflow: 'hidden',
    marginBottom: '28px',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
  },
  photoFrame: {
    width: '100%',
    height: '240px',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  body: {
    padding: '24px 28px',
    textAlign: 'left',
  },
  title: {
    fontSize: '0.9rem',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#1a1a1a',
    margin: '0 0 14px',
    fontWeight: 700,
  },
  pitch: {
    fontSize: '1.15rem',
    color: '#1a1a1a',
    margin: '0 0 4px',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  price: {
    fontSize: '1.25rem',
    color: '#1a1a1a',
    margin: '16px 0 20px',
    fontWeight: 700,
  },
  cta: {
    width: '100%',
    padding: '14px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
```

- [ ] **Step 2: Verify build**

```bash
npx vite build 2>&1 | grep -E "built|error" | tail -3
```

Expected: `✓ built`.

- [ ] **Step 3: Commit**

```bash
git add src/components/booking/BigUpgradeCard.jsx
git commit -m "feat(components): BigUpgradeCard — hero R44 pitch for /booking-confirmed loading"
```

---

### Task 3: Tests for `<BigUpgradeCard>`

**Files:**
- Create: `src/components/booking/BigUpgradeCard.test.jsx`

- [ ] **Step 1: Write the test file**

Create `src/components/booking/BigUpgradeCard.test.jsx`:

```jsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BigUpgradeCard from './BigUpgradeCard';

vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid="elements">{children}</div>,
  CardNumberElement: () => <div data-testid="card-number" />,
  CardExpiryElement: () => <div data-testid="card-expiry" />,
  CardCvcElement: () => <div data-testid="card-cvc" />,
  useStripe: () => null,
  useElements: () => null,
}));

describe('BigUpgradeCard', () => {
  it('returns null for non-R22 bookings', () => {
    const { container } = render(<BigUpgradeCard booking={{ aircraft: 'r44', duration: 30, flightAmountPence: 30500 }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when already upgraded', () => {
    const { container } = render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000, upgrade: {} }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when diff is non-positive', () => {
    // R22 60 already paid 36000; R44 30 fallback 30500 → diff -5500 → null
    const { container } = render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 60, flightAmountPence: 60500 }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders hero card for R22 booker with positive diff', () => {
    render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} />);
    expect(screen.getByText(/UPGRADE TO THE R44/i)).toBeInTheDocument();
    expect(screen.getByText(/You at the controls\./i)).toBeInTheDocument();
    expect(screen.getByText(/Two mates in the back\./i)).toBeInTheDocument();
    expect(screen.getByText(/£125 to upgrade/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Robinson R44/i })).toBeInTheDocument();
    // Modal not yet open
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('uses server-computed upgradeDiffPence when provided', () => {
    // Admin override: £100 fixed (10000 pence). Should display this instead of the auto-calc.
    render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000, upgradeDiffPence: 10000 }} />);
    expect(screen.getByText(/£100 to upgrade/)).toBeInTheDocument();
    expect(screen.queryByText(/£125 to upgrade/)).toBeNull();
  });

  it('opens the upgrade modal when the CTA is clicked', () => {
    render(<BigUpgradeCard booking={{ aircraft: 'r22', duration: 30, flightAmountPence: 18000 }} />);
    fireEvent.click(screen.getByRole('button', { name: /Upgrade now/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
npx vitest run src/components/booking/BigUpgradeCard.test.jsx 2>&1 | tail -8
```

Expected: 6 passing tests.

- [ ] **Step 3: Commit**

```bash
git add src/components/booking/BigUpgradeCard.test.jsx
git commit -m "test(components): BigUpgradeCard rendering + diff override + modal trigger"
```

---

### Task 4: Move `record-booking` out of `CheckoutForm` and navigate immediately

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Find the existing `record-booking` block in `CheckoutForm`**

```bash
grep -n "record-booking" src/pages/Checkout.jsx | head -5
```

Expected: at least one call inside `CheckoutForm.handleSubmit`.

- [ ] **Step 2: Remove the `Promise.race` await + fetch from `CheckoutForm`'s success branch**

In `src/pages/Checkout.jsx`, find this block inside `CheckoutForm.handleSubmit` (around the success branch):

```jsx
} else if (result.paymentIntent.status === 'succeeded') {
  // Wait for the booking record to be written before navigating, so the
  // success page can render the offers cards immediately. Caps at ~5s; if
  // record-booking is still pending after that we navigate anyway and the
  // success page's own retry logic takes over.
  try {
    await Promise.race([
      fetch('/api/record-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }),
      }),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  } catch {}
  navigate(
    `/booking-confirmed?ref=${result.paymentIntent.id}` +
    `&aircraft=${aircraft}&duration=${duration}&price=${price}` +
    `&name=${encodeURIComponent(name)}`
  );
}
```

Replace with:

```jsx
} else if (result.paymentIntent.status === 'succeeded') {
  // Navigate immediately. /booking-confirmed handles record-booking on mount.
  navigate(
    `/booking-confirmed?ref=${result.paymentIntent.id}` +
    `&aircraft=${aircraft}&duration=${duration}&price=${price}` +
    `&name=${encodeURIComponent(name)}`
  );
}
```

- [ ] **Step 3: Leave `MiscCheckoutForm` unchanged**

Misc bookings short-circuit the new state machine on `/booking-confirmed`. Their `record-booking` fire-and-forget stays where it is — verify by inspection.

```bash
grep -nE "record-booking" src/pages/Checkout.jsx
```

Expected: one remaining match inside `MiscCheckoutForm.handleSubmit`. (And no other matches.)

- [ ] **Step 4: Verify build**

```bash
npx vite build 2>&1 | grep -E "built|error" | tail -3
```

Expected: `✓ built`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "refactor(checkout): CheckoutForm navigates immediately on Stripe success; record-booking moves to /booking-confirmed mount"
```

---

### Task 5: Add `?error=` banner support to `Checkout` page

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Add error-from-URL state in the page-level `Checkout` component**

Find the page-level `function Checkout()` definition. Inside, after the existing `useSearchParams()` destructure, add:

```jsx
const [recordBookingError, setRecordBookingError] = useState(() => searchParams.get('error') || '');

// Strip the error param from the URL once we've captured it so a refresh
// doesn't re-show the banner.
useEffect(() => {
  if (searchParams.get('error')) {
    const next = new URLSearchParams(searchParams);
    next.delete('error');
    setSearchParams(next, { replace: true });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

(`useSearchParams` from `react-router-dom` returns `[searchParams, setSearchParams]`. Update the destructure if needed.)

- [ ] **Step 2: Render the banner at the top of the checkout layout**

Find the main return JSX of the `Checkout` component (the layout wrapper around `CheckoutForm` / `MiscCheckoutForm`). At the top of the rendered content (e.g. just inside the outermost `<div>`), add:

```jsx
{recordBookingError && (
  <div role="alert" style={{
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '14px 18px',
    marginBottom: '20px',
    fontSize: '0.95rem',
    fontFamily: "'Space Grotesk', Arial, sans-serif",
  }}>
    We couldn't confirm your booking: {recordBookingError}. Please try again or contact HQ Aviation.
  </div>
)}
```

- [ ] **Step 3: Verify build**

```bash
npx vite build 2>&1 | grep -E "built|error" | tail -3
```

Expected: `✓ built`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(checkout): show error banner when redirected back with ?error="
```

---

### Task 6: Add Phase 1/2 state machine to `BookingConfirmed.jsx`

**Files:**
- Modify: `src/pages/BookingConfirmed.jsx`

- [ ] **Step 1: Add `BigUpgradeCard` import**

At the top of `src/pages/BookingConfirmed.jsx`, alongside existing imports:

```jsx
import BigUpgradeCard from '../components/booking/BigUpgradeCard';
import { useNavigate } from 'react-router-dom';
```

(`useNavigate` may already be imported via `react-router-dom` somewhere — merge if so.)

- [ ] **Step 2: Add phase state + record-booking effect**

Inside `function BookingConfirmed()`, after the existing state declarations (the `[booking, setBooking]`, `[freeReferralItem, …]` etc.), add:

```jsx
const navigate = useNavigate();
const [phase, setPhase] = useState(isMisc ? 'confirmed' : 'confirming');

useEffect(() => {
  if (isMisc) return;          // misc skips the phase machine
  if (!ref) return;            // no PI to record
  let cancelled = false;

  const FOUR_SECONDS = 4000;
  const NETWORK_TIMEOUT = 15000;

  const recordPromise = (async () => {
    try {
      const res = await Promise.race([
        fetch('/api/record-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: ref }),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Network error — please try again')), NETWORK_TIMEOUT)),
      ]);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `record-booking failed (${res.status})`);
      }
      return true;
    } catch (err) {
      if (cancelled) return false;
      const errMsg = err.message || 'Unknown error';
      const params = new URLSearchParams();
      params.set('aircraft', aircraft || '');
      params.set('duration', duration || '');
      params.set('price', price || '');
      params.set('error', errMsg);
      navigate(`/checkout?${params.toString()}`, { replace: true });
      return false;
    }
  })();

  const timerPromise = new Promise((resolve) => setTimeout(resolve, FOUR_SECONDS));

  Promise.all([recordPromise, timerPromise]).then(([recordOk]) => {
    if (!cancelled && recordOk) setPhase('confirmed');
  });

  return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [ref, isMisc]);
```

- [ ] **Step 3: Verify build**

```bash
npx vite build 2>&1 | grep -E "built|error" | tail -3
```

Expected: `✓ built`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BookingConfirmed.jsx
git commit -m "feat(booking-confirmed): phase state + record-booking on mount + 4s loading floor"
```

---

### Task 7: Update `BookingConfirmed.jsx` JSX to render Phase 1 vs Phase 2

**Files:**
- Modify: `src/pages/BookingConfirmed.jsx`

- [ ] **Step 1: Replace the checkmark + heading + subtitle with phase-aware rendering**

Find the existing JSX:

```jsx
{/* Success mark */}
<div style={styles.checkmark}>✓</div>

<h1 style={styles.heading}>{isMisc ? 'Purchase Confirmed' : 'Booking Confirmed'}</h1>
<p style={styles.subheading}>
  {name ? `Thank you, ${name}.` : 'Thank you.'}{' '}
  {isMisc
    ? 'Your order has been placed. The HQ team will be in touch shortly.'
    : 'Your Discovery Flight has been booked.'}
</p>
```

Replace with:

```jsx
{phase === 'confirmed' ? (
  <div style={styles.checkmark}>✓</div>
) : (
  <div style={styles.spinner} aria-label="Confirming booking" />
)}

<h1 style={styles.heading}>
  {phase === 'confirming'
    ? 'Confirming Booking'
    : (isMisc ? 'Purchase Confirmed' : 'Booking Confirmed')}
</h1>

{phase === 'confirmed' && (
  <p style={styles.subheading}>
    {name ? `Thank you, ${name}.` : 'Thank you.'}{' '}
    {isMisc
      ? 'Your order has been placed. The HQ team will be in touch shortly.'
      : 'Your Discovery Flight has been booked.'}
  </p>
)}
```

- [ ] **Step 2: Render `<BigUpgradeCard>` during Phase 1**

Find where the `<div style={styles.card}>` (Booking Summary) is rendered. Wrap it (and the offers below, and the Return link) in a `phase === 'confirmed'` conditional, and add `<BigUpgradeCard>` for Phase 1:

```jsx
{phase === 'confirming' ? (
  <BigUpgradeCard booking={booking} onUpgraded={refetchBooking} />
) : (
  <>
    {/* Existing summary card block goes here */}
    <div style={styles.card}>
      {/* ...summary card contents unchanged... */}
    </div>

    {!isMisc && (
      <PostCheckoutOffers booking={booking} freeReferralItem={freeReferralItem} />
    )}

    <p style={styles.nextStep}>
      {isMisc
        ? 'The HQ Aviation team will be in touch about your order.'
        : 'A member of the HQ Aviation team will be in touch shortly to arrange a date and time for your flight.'}
    </p>

    <p style={styles.emailNote}>
      A confirmation email will be sent to your inbox shortly.
    </p>

    <Link to="/" style={styles.homeLink}>Return to HQ Aviation</Link>
  </>
)}
```

(Adapt to your actual JSX structure — the goal is: nothing summary/CTA/offers below renders during `confirming`; only the `<BigUpgradeCard>` does.)

- [ ] **Step 3: Add spinner CSS to the existing styles object**

Find the `const styles = { … };` block at the bottom of `BookingConfirmed.jsx`. Add:

```jsx
spinner: {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  border: '4px solid #e5e7eb',
  borderTopColor: '#1a1a1a',
  margin: '0 auto 24px',
  animation: 'bc-spin 0.9s linear infinite',
},
```

Then add the keyframes via an inline `<style>` block once at the top of the component's return JSX (just inside the outermost element):

```jsx
<style>{`@keyframes bc-spin { to { transform: rotate(360deg); } }`}</style>
```

- [ ] **Step 4: Verify build**

```bash
npx vite build 2>&1 | grep -E "built|error" | tail -3
```

Expected: `✓ built`.

- [ ] **Step 5: Visual smoke check in Playwright (optional but recommended)**

If a dev server is convenient: navigate to `/booking-confirmed?ref=pi_3TVJDW9Pcbq93zOm0C912Rnz&aircraft=r22&duration=30&price=189&name=Test` and confirm the spinner + "Confirming Booking" + `<BigUpgradeCard>` show for ~4s, then transition to checkmark + "Booking Confirmed" + Summary card. If dev server not running, skip — Task 8 tests cover the behaviour.

- [ ] **Step 6: Commit**

```bash
git add src/pages/BookingConfirmed.jsx
git commit -m "feat(booking-confirmed): Phase 1/2 rendering — spinner+pitch then checkmark+summary"
```

---

### Task 8: Update existing `BookingConfirmed.test.jsx` for the new phases

**Files:**
- Modify: `src/pages/BookingConfirmed.test.jsx`

- [ ] **Step 1: Read the current test file**

```bash
cat src/pages/BookingConfirmed.test.jsx
```

- [ ] **Step 2: Update the test file to use fake timers + assert phase transitions**

Replace the file contents with:

```jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingConfirmed from './BookingConfirmed';

vi.mock('../lib/firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));
vi.mock('../lib/analytics', () => ({ trackEvent: vi.fn() }));

vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <>{children}</>,
  CardNumberElement: () => null,
  CardExpiryElement: () => null,
  CardCvcElement: () => null,
  useStripe: () => null,
  useElements: () => null,
}));

const fetchSpy = vi.spyOn(global, 'fetch');

beforeEach(() => {
  fetchSpy.mockReset();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

function renderAt(search) {
  return render(
    <MemoryRouter initialEntries={[`/booking-confirmed${search}`]}>
      <BookingConfirmed />
    </MemoryRouter>
  );
}

describe('BookingConfirmed', () => {
  it('shows "Confirming Booking" + spinner during Phase 1 for R22 bookings', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
      }
      if (typeof url === 'string' && url.includes('/api/record-booking')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Test');
    await waitFor(() => screen.getByText(/Confirming Booking/i));
    expect(screen.queryByText(/Booking Confirmed/i)).toBeNull();
    expect(screen.getByLabelText(/Confirming booking/i)).toBeInTheDocument();
  });

  it('flips to Phase 2 after the 4s floor + record-booking success', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
      }
      if (typeof url === 'string' && url.includes('/api/record-booking')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Test');
    await waitFor(() => screen.getByText(/Confirming Booking/i));

    // Advance the timer past the 4-second floor
    await act(async () => {
      vi.advanceTimersByTime(4500);
    });

    await waitFor(() => screen.getByText(/^Booking Confirmed$/i));
    expect(screen.queryByText(/Confirming Booking/i)).toBeNull();
  });

  it('renders BigUpgradeCard during Phase 1 for an R22 booker', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'discovery-flight', aircraft: 'r22', duration: 30, flightAmountPence: 18000, paymentIntentId: 'pi_x' }) });
      }
      if (typeof url === 'string' && url.includes('/api/record-booking')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_x&aircraft=r22&duration=30&price=180&name=Test');
    await waitFor(() => screen.getByText(/UPGRADE TO THE R44/i));
    expect(screen.getByText(/You at the controls\./i)).toBeInTheDocument();
  });

  it('misc bookings skip the phases entirely and render Booking Summary immediately', async () => {
    fetchSpy.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/booking/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ productType: 'misc' }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    renderAt('?ref=pi_misc&type=misc&itemName=Cap');
    await waitFor(() => screen.getByText(/Purchase Confirmed/i));
    expect(screen.queryByText(/Confirming Booking/i)).toBeNull();
    expect(screen.queryByText(/UPGRADE TO THE R44/i)).toBeNull();
  });
});
```

- [ ] **Step 3: Run the tests**

```bash
npx vitest run src/pages/BookingConfirmed.test.jsx 2>&1 | tail -10
```

Expected: 4 passing tests.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BookingConfirmed.test.jsx
git commit -m "test(booking-confirmed): phase 1/2 transitions + BigUpgradeCard + misc short-circuit"
```

---

### Task 9: End-to-end manual smoke test

- [ ] **Step 1: Start the dev server**

```bash
lsof -ti :5173 | xargs kill -9 2>/dev/null
lsof -ti :7500 | xargs kill -9 2>/dev/null
sleep 1
npm run dev
```

Wait for `[vite] Local: http://localhost:5173/` and `[api] 🚀 HQ Aviation Server` in the log.

- [ ] **Step 2: Make a fresh R22 booking with Stripe test card**

In the browser:
- Visit `http://localhost:5173/training/trial-lessons`
- Pick Robinson R22, 30 minutes → Continue to checkout
- Email-first step: enter any test email → Continue
- Fill Name, Phone, Card: `4242 4242 4242 4242`, any future MM/YY, any CVC, any postcode
- Click Pay

**Expected behaviour:**
- Page navigates to `/booking-confirmed?ref=pi_…` **immediately** (no "Processing…" stall on the button).
- The success page shows: **spinner** + heading **"Confirming Booking"** + hero **BigUpgradeCard** with R44 photo, "UPGRADE TO THE R44", "You at the controls.", "Two mates in the back.", price, "Upgrade now →" button.
- After ~4 seconds: the spinner becomes a ✓ checkmark; the heading flips to **"Booking Confirmed"**; the thank-you subtitle appears; the Booking Summary card fades in with the compact green upgrade row inside; the BigUpgradeCard disappears.

- [ ] **Step 3: Test the upgrade modal during Phase 1**

Make another R22 booking. During the ~4s Phase 1 window, click **"Upgrade now →"** on the BigUpgradeCard. The existing upgrade modal should open with the locked-duration upgrade summary + Stripe Elements card form.

- [ ] **Step 4: Test the failure path**

Manually trigger a record-booking failure to verify the error banner navigation. The simplest way:
- Stop the API server (`Ctrl+C` in the dev terminal, kill node)
- Restart only Vite (`npm run dev:client` if available, else `npx vite`)
- Make a fresh booking — the Stripe call will succeed (via the live Stripe API directly), but record-booking will network-fail
- After ~15 seconds (network timeout), `/booking-confirmed` should navigate back to `/checkout?error=Network%20error…`
- Checkout page should display the error banner at the top: "We couldn't confirm your booking: Network error — please try again. Please try again or contact HQ Aviation."

(If reproducing this exact failure is too time-consuming, just verify visually that hitting `/checkout?error=Test%20error` directly shows the banner.)

- [ ] **Step 5: Test the misc short-circuit**

Make a misc-item purchase (`/store/<id>` → buy). After Stripe success, `/booking-confirmed?type=misc&…` should render **immediately** (no spinner, no Phase 1) — confirming the misc short-circuit works.

- [ ] **Step 6: Stop the dev server**

```bash
lsof -ti :5173 | xargs kill -9 2>/dev/null
lsof -ti :7500 | xargs kill -9 2>/dev/null
```

---

## Done criteria

- Fresh R22 Discovery Flight booking lands on `/booking-confirmed` immediately, shows spinner + "Confirming Booking" + BigUpgradeCard for ≥4s, then transitions to ✓ + "Booking Confirmed" + Summary card.
- BigUpgradeCard's "Upgrade now →" CTA opens the existing upgrade modal.
- record-booking failure navigates back to `/checkout?error=…` and the checkout page shows a banner.
- Misc bookings render their confirmation immediately (no phase machine).
- All new and existing tests pass.

## Out of scope (per spec)

- Analytics events for upgrade-card-shown / upgrade-cta-clicked.
- Variant/A-B testing of upgrade copy or imagery.
- Animating the price.
- Showing the BigUpgradeCard on revisits to `/booking-confirmed`.
