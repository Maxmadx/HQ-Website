# Plan A — Apparel + Sizes for Misc Store

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable admins to flag a misc item as "apparel" with a list of available sizes (S/M/L/etc); the public store renders a size selector for apparel items; the chosen size flows through checkout, Stripe metadata, the booking record, and the order confirmation email.

**Architecture:** Two boolean+array fields on `misc_items` (`apparel`, `sizes`). UI in admin (chip-style sizes editor + checkbox) and store (segmented control above Buy Now). Size travels via URL → checkout form → POST body → server validation → PI metadata → webhook → Firestore booking + `misc_marketplace` order. No DB migrations; new fields default sensibly.

**Tech Stack:** React 19, Vite 8, Firestore (admin SDK server-side, client SDK in admin pages), Stripe Node SDK, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-05-08-post-checkout-offers-design.md` § 4.1, § 5.8, § 5.9, § 6.3.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `src/pages/admin/AdminMiscItemEdit.jsx` | Apparel checkbox, chip-style sizes editor, validation. |
| Create | `src/pages/admin/AdminMiscItemEdit.test.jsx` | Form roundtrip + apparel-without-sizes block. |
| Modify | `src/pages/MiscItemDetail.jsx` | Size selector above Buy Now for apparel items; encode `size` in checkout URL. |
| Create | `src/pages/MiscItemDetail.test.jsx` | Size required to enable Buy Now for apparel; non-apparel unchanged. |
| Modify | `src/pages/Checkout.jsx` | Read `size` from URL in `MiscCheckoutForm`; forward to API. |
| Modify | `api/stripe.js` | `createMiscPaymentIntent` accepts + validates `size`; metadata stores `apparelSize`; webhook surfaces it on booking + order; email shows it. |
| Modify | `api/stripe.test.js` | Validation tests for the new size requirement. |

---

### Task 1: Add `apparel` and `sizes` to admin form initial state

**Files:**
- Modify: `src/pages/admin/AdminMiscItemEdit.jsx:9-23`

- [ ] **Step 1: Update the `EMPTY` object**

Open `src/pages/admin/AdminMiscItemEdit.jsx`. Replace lines 9-23 (the `EMPTY` constant) with:

```jsx
const EMPTY = {
  name: '',
  category: '',
  priceType: 'poa',
  price: 0,
  priceDisplay: 'POA',
  hasQuantity: false,
  stock: 1,
  requiresShipping: false,
  condition: 'new',
  description: '',
  images: [],
  discoveryAddon: false,
  discoveryAddonDiscountPct: 0,
  apparel: false,
  sizes: [],
};
```

- [ ] **Step 2: Verify dev server compiles**

```bash
npm run dev
```

Expected: Vite starts cleanly. No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat(admin/misc): seed apparel + sizes in form initial state"
```

---

### Task 2: Add the Apparel + Sizes UI section to the admin form

**Files:**
- Modify: `src/pages/admin/AdminMiscItemEdit.jsx` (insert below the existing "Discovery Flight Add-on" block at ~line 287)

- [ ] **Step 1: Add a chip-input handler near the top of the component**

In `src/pages/admin/AdminMiscItemEdit.jsx`, just below the `function set(field, value) { … }` helper, add:

```jsx
function addSize(raw) {
  const v = String(raw || '').trim().toUpperCase();
  if (!v) return;
  setForm((f) => (f.sizes.includes(v) ? f : { ...f, sizes: [...f.sizes, v] }));
}

function removeSize(idx) {
  setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== idx) }));
}
```

- [ ] **Step 2: Render the new section**

Find the closing `)}` of the Discovery Flight Add-on block (immediately after line 287, just before the `<div>` with `<label>Description</label>`). Insert:

```jsx
{form.priceType === 'fixed' && (
  <div>
    <label style={labelStyle}>Apparel</label>
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
      <input
        type="checkbox"
        checked={form.apparel}
        onChange={(e) => set('apparel', e.target.checked)}
      />
      Apparel item (size selection on store)
    </label>
    {form.apparel && (
      <div style={{ marginTop: '0.5rem' }}>
        <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>Sizes</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
          {form.sizes.map((s, i) => (
            <span key={`${s}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
              {s}
              <button
                type="button"
                onClick={() => removeSize(i)}
                aria-label={`Remove size ${s}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1, color: '#6b7280', padding: 0 }}
              >×</button>
            </span>
          ))}
          {form.sizes.length === 0 && (
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>No sizes added yet.</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <input
            style={{ ...fieldStyle, width: '100px' }}
            type="text"
            placeholder="e.g. M"
            data-testid="size-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSize(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              const input = e.currentTarget.previousSibling;
              addSize(input.value);
              input.value = '';
            }}
            style={{ background: '#e5e7eb', border: 'none', padding: '0 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >Add</button>
        </div>
      </div>
    )}
  </div>
)}
```

- [ ] **Step 3: Block submit when `apparel=true && sizes.length === 0`**

In the same file, replace the existing `handleSubmit` `try` block (top portion, around lines 92-107) with one that adds the validation guard. Find:

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  setSaving(true);
  setError('');
  try {
    const priceDisplay = form.priceType === 'fixed' && form.price > 0
```

Insert before `const priceDisplay = …`:

```jsx
    if (form.apparel && (!Array.isArray(form.sizes) || form.sizes.length === 0)) {
      setError('Apparel items need at least one size. Add a size or untick "Apparel item".');
      setSaving(false);
      return;
    }
```

- [ ] **Step 4: Persist the new fields in the payload**

In the same `handleSubmit`, find the `payload` object (around line 101). Add `apparel` and `sizes` to it:

```jsx
const payload = {
  ...form,
  priceDisplay,
  ...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1, requiresShipping: false, apparel: false, sizes: [] } : {}),
  discoveryAddon: isAddon,
  discoveryAddonDiscountPct: isAddon ? Math.max(0, Math.min(100, parseInt(form.discoveryAddonDiscountPct, 10) || 0)) : 0,
  apparel: form.priceType === 'fixed' ? !!form.apparel : false,
  sizes: (form.priceType === 'fixed' && form.apparel && Array.isArray(form.sizes)) ? form.sizes : [],
};
```

(Note: when `priceType` becomes `poa`, apparel/sizes get cleared, mirroring the existing pattern for hasQuantity/stock.)

- [ ] **Step 5: Manual smoke check in dev**

Run the dev server (`npm run dev`), log into admin, edit a misc item:
- Set priceType=fixed, set price > 0.
- Tick "Apparel item". Verify the sizes editor appears.
- Add S, M, L. Click ×, verify removal.
- Try save with apparel ticked and no sizes — see the inline error.
- Add a size, save successfully. Reload the page — verify chip list re-renders.

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat(admin/misc): apparel + sizes editor with required-size validation"
```

---

### Task 3: Tests for the admin apparel UI

**Files:**
- Create: `src/pages/admin/AdminMiscItemEdit.test.jsx`

- [ ] **Step 1: Write the failing test file**

Create `src/pages/admin/AdminMiscItemEdit.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminMiscItemEdit from './AdminMiscItemEdit';

// Mock Firestore + storage
vi.mock('../../lib/firebase', () => ({
  db: {},
  storage: {},
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
}));
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

const createDocSpy = vi.fn(() => Promise.resolve('new-id'));
const updateDocByIdSpy = vi.fn(() => Promise.resolve());
vi.mock('../../hooks/useFirestore', () => ({
  createDoc: (...args) => createDocSpy(...args),
  updateDocById: (...args) => updateDocByIdSpy(...args),
}));

vi.mock('../../components/admin/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

function renderEditNew() {
  return render(
    <MemoryRouter initialEntries={['/admin/misc/new']}>
      <Routes>
        <Route path="/admin/misc/:id" element={<AdminMiscItemEdit />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  createDocSpy.mockClear();
  updateDocByIdSpy.mockClear();
});

describe('AdminMiscItemEdit — apparel + sizes', () => {
  it('hides apparel section when priceType is poa', () => {
    renderEditNew();
    // Default priceType=poa
    expect(screen.queryByText(/Apparel item/i)).toBeNull();
  });

  it('shows sizes editor only when apparel is ticked', () => {
    renderEditNew();
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    expect(screen.queryByText(/^Sizes$/i)).toBeNull();
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    expect(screen.getByText(/^Sizes$/i)).toBeInTheDocument();
  });

  it('adds a size on Enter and removes on ×', () => {
    renderEditNew();
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    const input = screen.getByTestId('size-input');
    fireEvent.change(input, { target: { value: 'm' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('M')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Remove size M/i));
    expect(screen.queryByText('M')).toBeNull();
  });

  it('blocks save when apparel=true and sizes is empty', async () => {
    renderEditNew();
    fireEvent.change(screen.getByPlaceholderText(/R22 Helicopter Cover/i), { target: { value: 'Test Cap' } });
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), { target: { value: '20.00' } });
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    fireEvent.click(screen.getByRole('button', { name: /Create Item/i }));
    await waitFor(() => {
      expect(screen.getByText(/Apparel items need at least one size/i)).toBeInTheDocument();
    });
    expect(createDocSpy).not.toHaveBeenCalled();
  });

  it('persists apparel + sizes in createDoc payload', async () => {
    renderEditNew();
    fireEvent.change(screen.getByPlaceholderText(/R22 Helicopter Cover/i), { target: { value: 'Test Cap' } });
    fireEvent.click(screen.getByLabelText(/Fixed Price/i));
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), { target: { value: '20.00' } });
    fireEvent.click(screen.getByLabelText(/Apparel item/i));
    const input = screen.getByTestId('size-input');
    fireEvent.change(input, { target: { value: 'S' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'M' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: /Create Item/i }));
    await waitFor(() => {
      expect(createDocSpy).toHaveBeenCalledTimes(1);
    });
    const [, payload] = createDocSpy.mock.calls[0];
    expect(payload.apparel).toBe(true);
    expect(payload.sizes).toEqual(['S', 'M']);
  });
});
```

- [ ] **Step 2: Run the tests — verify they pass**

```bash
npx vitest run src/pages/admin/AdminMiscItemEdit.test.jsx
```

Expected: 5 passing tests.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.test.jsx
git commit -m "test(admin/misc): apparel + sizes UI roundtrip and validation"
```

---

### Task 4: Render size selector on `MiscItemDetail` and gate Buy Now

**Files:**
- Modify: `src/pages/MiscItemDetail.jsx`

- [ ] **Step 1: Add size state + selector**

In `src/pages/MiscItemDetail.jsx`, find the `const [qty, setQty] = useState(1);` line (around line 224). Below it, add:

```jsx
const [selectedSize, setSelectedSize] = useState('');
const isApparel = !!(item?.apparel && Array.isArray(item?.sizes) && item.sizes.length > 0);
const buyDisabled = isApparel && !selectedSize;
```

(Note: `item` is loaded async, so the component must guard against `item` being null. Move these lines below the `if (notFound || !item) { … }` early return so `item` is defined.)

Concretely: find where `images = item?.images || []` lives (~line 243), and *immediately after* the `if (notFound || !item)` block — but the existing structure puts that early return before the JSX. Place the size state at the top with `qty` (it's fine to compute `isApparel`/`buyDisabled` inline in JSX where `item` is defined). Cleanest fix:

```jsx
// At the top with other state:
const [selectedSize, setSelectedSize] = useState('');
```

Then in the JSX where the Buy Now button lives, derive locally:

```jsx
const isApparel = !!(item.apparel && Array.isArray(item.sizes) && item.sizes.length > 0);
const buyDisabled = isApparel && !selectedSize;
```

- [ ] **Step 2: Render the segmented control above the Buy Now**

Find the Buy Now button block in `MiscItemDetail.jsx` (search for `handleBuyNow`). Just above the button (and qty selector if present), add:

```jsx
{isApparel && (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
      Size
    </div>
    <div role="radiogroup" aria-label="Size" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {item.sizes.map((s) => {
        const active = selectedSize === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSelectedSize(s)}
            style={{
              minWidth: '44px',
              padding: '8px 14px',
              border: active ? '2px solid #1a1a1a' : '1px solid #d1d5db',
              background: active ? '#1a1a1a' : '#fff',
              color: active ? '#fff' : '#1a1a1a',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  </div>
)}
```

- [ ] **Step 3: Gate the Buy Now button**

Find the existing Buy Now `<button>` (search for `handleBuyNow` callsite). Add `disabled={buyDisabled}` and a hint:

```jsx
<button
  onClick={handleBuyNow}
  disabled={buyDisabled}
  data-testid="buy-now"
  style={{ /* existing styles, plus: */ opacity: buyDisabled ? 0.6 : 1, cursor: buyDisabled ? 'not-allowed' : 'pointer' }}
>
  Buy Now
</button>
{buyDisabled && (
  <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '6px' }}>Please select a size to continue.</p>
)}
```

(If the existing button has a different style object, merge `opacity` and `cursor` into it; do not delete its existing styles.)

- [ ] **Step 4: Pass size in the checkout URL**

In `handleBuyNow`, append the selected size to the URL when present:

```jsx
function handleBuyNow() {
  navigate(
    `/checkout?type=misc` +
    `&itemId=${id}` +
    `&itemName=${encodeURIComponent(item.name)}` +
    `&price=${(item.price / 100).toFixed(2)}` +
    `&qty=${qty}` +
    (item.requiresShipping ? `&requiresShipping=1` : '') +
    (selectedSize ? `&size=${encodeURIComponent(selectedSize)}` : '')
  );
}
```

- [ ] **Step 5: Build and verify**

```bash
npx vite build 2>&1 | tail -3
```

Expected: `✓ built in …` with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/MiscItemDetail.jsx
git commit -m "feat(store): size selector for apparel items, gates Buy Now"
```

---

### Task 5: Tests for `MiscItemDetail` size selector

**Files:**
- Create: `src/pages/MiscItemDetail.test.jsx`

- [ ] **Step 1: Write the failing test file**

Create `src/pages/MiscItemDetail.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MiscItemDetail from './MiscItemDetail';

const navigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateSpy };
});

vi.mock('../lib/firebase', () => ({ db: {} }));

const mockGetDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args) => mockGetDoc(...args),
}));

vi.mock('../components/FinalDraftHeader', () => ({ default: () => null }));
vi.mock('../components/FooterMinimal', () => ({ default: () => null }));

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/store/test-id']}>
      <Routes>
        <Route path="/store/:id" element={<MiscItemDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  navigateSpy.mockClear();
  mockGetDoc.mockReset();
});

describe('MiscItemDetail — apparel sizes', () => {
  it('renders no size selector for non-apparel items', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'test-id',
      data: () => ({ name: 'Helicopter Cover', priceType: 'fixed', price: 5000, apparel: false, images: [] }),
    });
    renderDetail();
    await waitFor(() => screen.getByText('Helicopter Cover'));
    expect(screen.queryByRole('radiogroup', { name: /Size/i })).toBeNull();
    expect(screen.getByTestId('buy-now')).not.toBeDisabled();
  });

  it('disables Buy Now until a size is selected for apparel items', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'test-id',
      data: () => ({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'], images: [] }),
    });
    renderDetail();
    await waitFor(() => screen.getByText('HQ Tee'));
    expect(screen.getByTestId('buy-now')).toBeDisabled();
    fireEvent.click(screen.getByRole('radio', { name: 'M' }));
    expect(screen.getByTestId('buy-now')).not.toBeDisabled();
  });

  it('encodes the selected size in the checkout URL', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: 'test-id',
      data: () => ({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'], images: [] }),
    });
    renderDetail();
    await waitFor(() => screen.getByText('HQ Tee'));
    fireEvent.click(screen.getByRole('radio', { name: 'M' }));
    fireEvent.click(screen.getByTestId('buy-now'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy.mock.calls[0][0]).toMatch(/&size=M/);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/pages/MiscItemDetail.test.jsx
```

Expected: 3 passing tests.

- [ ] **Step 3: Commit**

```bash
git add src/pages/MiscItemDetail.test.jsx
git commit -m "test(store): apparel size gating + URL encoding"
```

---

### Task 6: Forward `size` from `MiscCheckoutForm` to the API

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Read `size` from URL in the page-level component**

In `src/pages/Checkout.jsx`, find where the misc URL params are read (~line 397, near `requiresShipping = …`). Add:

```jsx
const apparelSize = searchParams.get('size') || '';
```

- [ ] **Step 2: Pass it to `MiscCheckoutForm` as a prop**

Find the JSX where `<MiscCheckoutForm … />` is rendered (~line 720). Add the prop:

```jsx
<MiscCheckoutForm itemId={itemId} itemName={itemName} qty={qty} price={price} requiresShipping={requiresShipping} apparelSize={apparelSize} />
```

- [ ] **Step 3: Accept the prop in `MiscCheckoutForm` and forward it in the API payload**

Find the `function MiscCheckoutForm({ itemId, itemName, qty, price, requiresShipping }) {` line. Add `apparelSize` to the destructure:

```jsx
function MiscCheckoutForm({ itemId, itemName, qty, price, requiresShipping, apparelSize }) {
```

In the same function, find the `body: JSON.stringify({ … })` block (~line 282-289). Add:

```jsx
body: JSON.stringify({
  itemId,
  qty: Number(qty),
  customerName: name,
  customerEmail: email,
  customerPhone: phone,
  ...(requiresShipping ? { shippingAddress } : {}),
  ...(apparelSize ? { size: apparelSize } : {}),
}),
```

- [ ] **Step 4: Build to verify**

```bash
npx vite build 2>&1 | tail -3
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(checkout/misc): forward apparel size to create-misc-payment-intent"
```

---

### Task 7: Server-side validation + metadata for `size`

**Files:**
- Modify: `api/stripe.js` (`createMiscPaymentIntent`, ~line 919)

- [ ] **Step 1: Update the function signature**

In `api/stripe.js`, find:

```js
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone, shippingAddress }) {
```

Replace with:

```js
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone, shippingAddress, size }) {
```

- [ ] **Step 2: Validate `size` against the item's `sizes` array**

Inside that function, find the `if (item.requiresShipping) { … }` block (~line 951). Immediately after that block (just before `const amount = item.price * qtyNum;`), insert:

```js
let resolvedSize = '';
if (item.apparel && Array.isArray(item.sizes) && item.sizes.length > 0) {
  const s = String(size || '').trim().toUpperCase();
  if (!s) {
    const err = new Error('Size is required for this apparel item');
    err.statusCode = 400;
    throw err;
  }
  if (!item.sizes.includes(s)) {
    const err = new Error(`Size ${s} is not available for this item`);
    err.statusCode = 400;
    throw err;
  }
  resolvedSize = s;
}
```

- [ ] **Step 3: Store `apparelSize` in PI metadata**

Find the `metadata: { … }` object inside `paymentIntents.create` (~line 964). Append `apparelSize`:

```js
metadata: {
  productType: 'misc',
  itemId,
  itemName: String(item.name || '').slice(0, 500),
  qty: String(qtyNum),
  customerName,
  customerEmail,
  customerPhone,
  shippingLine1: shippingAddress?.line1 || '',
  shippingLine2: shippingAddress?.line2 || '',
  shippingCity: shippingAddress?.city || '',
  shippingPostcode: shippingAddress?.postcode || '',
  apparelSize: resolvedSize,
},
```

- [ ] **Step 4: Update the request handler that calls `createMiscPaymentIntent` to forward `size`**

Find `app.post('/api/create-misc-payment-intent', …)` in `server.js` (or wherever the route is mounted). Verify the handler destructures `req.body` and passes through to `createMiscPaymentIntent`. If it explicitly lists fields, add `size`:

```bash
grep -n "create-misc-payment-intent" server.js
```

Then, in the handler:

```js
const { itemId, qty, customerName, customerEmail, customerPhone, shippingAddress, size } = req.body;
const pi = await createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone, shippingAddress, size });
```

(If the handler already does `…req.body`, no change needed.)

- [ ] **Step 5: Commit**

```bash
git add api/stripe.js server.js
git commit -m "feat(api/misc): require + validate size for apparel items, store in PI metadata"
```

---

### Task 8: Tests for the server-side validation

**Files:**
- Modify: `api/stripe.test.js`

- [ ] **Step 1: Inspect existing test setup**

```bash
grep -n "createMiscPaymentIntent\|describe\b" api/stripe.test.js | head -20
```

Note the testing pattern in use (likely vitest with mocked `admin.firestore()` and `getStripe()`).

- [ ] **Step 2: Add a `describe` block for the apparel cases**

At the bottom of `api/stripe.test.js`, append:

```js
describe('createMiscPaymentIntent — apparel size validation', () => {
  function mockItem(item) {
    return {
      get: vi.fn(() => Promise.resolve({ exists: true, data: () => item })),
    };
  }

  function mockFirestoreWith(item) {
    const itemRef = mockItem(item);
    admin.firestore = vi.fn(() => ({
      collection: () => ({ doc: () => itemRef }),
    }));
  }

  it('rejects when size is missing for an apparel item', async () => {
    mockFirestoreWith({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'] });
    await expect(createMiscPaymentIntent({
      itemId: 'tee', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44',
    })).rejects.toMatchObject({ message: /Size is required/i, statusCode: 400 });
  });

  it('rejects when size is not in the item sizes array', async () => {
    mockFirestoreWith({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'] });
    await expect(createMiscPaymentIntent({
      itemId: 'tee', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44', size: 'XXXL',
    })).rejects.toMatchObject({ statusCode: 400 });
  });

  it('accepts a valid size and stores it in PI metadata', async () => {
    mockFirestoreWith({ name: 'HQ Tee', priceType: 'fixed', price: 2500, apparel: true, sizes: ['S','M','L'] });
    const created = vi.fn(() => Promise.resolve({ id: 'pi_test', client_secret: 'sec_test' }));
    getStripe = () => ({ paymentIntents: { create: (args) => { created(args); return Promise.resolve({ id: 'pi_test' }); } } });
    await createMiscPaymentIntent({
      itemId: 'tee', qty: 1, customerName: 'A', customerEmail: 'a@b.c', customerPhone: '+44', size: 'm',
    });
    expect(created).toHaveBeenCalledTimes(1);
    expect(created.mock.calls[0][0].metadata.apparelSize).toBe('M');
  });
});
```

(If the existing test file has a different mocking strategy — Stripe mock, admin SDK mock — adapt the above to match. The pattern shown is illustrative; preserve the file's existing patterns.)

- [ ] **Step 3: Run the suite**

```bash
npx vitest run api/stripe.test.js
```

Expected: existing tests still pass + 3 new ones pass.

- [ ] **Step 4: Commit**

```bash
git add api/stripe.test.js
git commit -m "test(api/misc): apparel size required + validated against item sizes"
```

---

### Task 9: Surface `apparelSize` in the webhook → booking record + order

**Files:**
- Modify: `api/stripe.js` (~lines 689-705 and 708-723)

- [ ] **Step 1: Capture `apparelSize` on the booking write**

In `api/stripe.js` near line 689 (the `else if (productType === 'misc') { … bookingData.qty = … }` block), update to read and persist size:

```js
} else if (productType === 'misc') {
  const { itemId, itemName, qty, apparelSize } = pi.metadata;
  bookingData.itemId = itemId || '';
  bookingData.itemName = itemName || '';
  bookingData.qty = Number(qty) || 1;
  if (apparelSize) bookingData.apparelSize = apparelSize;
}
```

- [ ] **Step 2: Capture it on the misc_marketplace order write**

Inside the same handler, find the `if (productType === 'misc') { await admin.firestore().collection('misc_marketplace').doc(pi.id).set({ … }) }` block. Update:

```js
if (productType === 'misc') {
  const { itemId, itemName, qty, apparelSize, shippingLine1, shippingLine2, shippingCity, shippingPostcode } = pi.metadata;
  await admin.firestore().collection('misc_marketplace').doc(pi.id).set({
    type: 'order',
    status: 'new',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ref: pi.id,
    amount: pi.amount,
    itemId: itemId || '',
    itemName: itemName || '',
    qty: Number(qty),
    customerName: customerName || '',
    customerEmail: customerEmail || '',
    customerPhone: customerPhone || '',
    ...(apparelSize ? { apparelSize } : {}),
    ...(shippingLine1 ? { shippingLine1, shippingLine2: shippingLine2 || '', shippingCity, shippingPostcode } : {}),
  });
}
```

- [ ] **Step 3: Add size to the order confirmation email**

Locate the misc-confirmation email logic (search `Misc.*confirmation\|sendMiscConfirmation\|productType === 'misc'.*mail` in `api/stripe.js`):

```bash
grep -n "Misc Order Confirmation\|sendOrderConfirmation\|misc.*Confirmation" api/stripe.js | head -10
```

In the email body that composes the order recap, add a line after `itemName × qty`:

```js
const sizeLine = apparelSize ? `\n  Size: ${escapeHtml(apparelSize)}` : '';
// ... wherever the body is composed:
body += `\n  Item: ${escapeHtml(itemName)} × ${qty}${sizeLine}`;
```

(Adapt to the actual email composer's format. If the email is HTML, use `<div>Size: ${escapeHtml(apparelSize)}</div>`. If misc emails currently aren't sent at all, skip — note this in your commit message.)

- [ ] **Step 4: Commit**

```bash
git add api/stripe.js
git commit -m "feat(webhook/misc): persist apparelSize on booking + order, include in confirmation email"
```

---

### Task 10: End-to-end manual smoke test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: In admin, create or edit a misc item**

- Open `/admin/misc`, click into an item.
- Set `priceType=fixed`, price > 0.
- Tick "Apparel item".
- Add sizes: S, M, L.
- Save → verify success, refresh, sizes still listed.

- [ ] **Step 3: Public store flow**

- Open `/store` (or `/misc`), click into the apparel item.
- Verify the size selector is visible above Buy Now.
- Confirm Buy Now is disabled until a size is chosen.
- Pick "M". Click Buy Now → URL should contain `&size=M`.

- [ ] **Step 4: Checkout to a successful test card**

- Use Stripe test card `4242 4242 4242 4242`.
- Submit; reach the confirmation page.

- [ ] **Step 5: Verify Firestore + Stripe metadata**

- In Stripe dashboard, open the payment → confirm metadata `apparelSize: M`.
- In Firestore `bookings/<pi_id>`, confirm `apparelSize: 'M'`.
- In Firestore `misc_marketplace/<pi_id>`, confirm `apparelSize: 'M'`.

- [ ] **Step 6: Commit (or wrap up)**

If any tweaks were needed during smoke testing, commit them. Otherwise, this task closes Plan A.

```bash
git log --oneline | head -10
```

---

## Plan A — Done Criteria

- Admin can flag any fixed-price misc item as apparel and add ≥1 size.
- Public store renders the size selector and gates Buy Now for apparel items.
- Server rejects misc PI creation without size when item is apparel.
- PI metadata, `bookings/<pi_id>`, and `misc_marketplace/<pi_id>` all carry the chosen size.
- Confirmation email includes size when present.
- All new and existing tests pass.

## Out of Scope (this plan)

- Per-size stock tracking. Stock is whole-item only.
- Image variants per size.
- Drag-reordering of size chips.
