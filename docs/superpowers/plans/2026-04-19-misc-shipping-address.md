# Misc Marketplace — Shipping Address Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow fixed-price misc items to require a delivery address at checkout, stored in the order and displayed in the admin marketplace tab.

**Architecture:** A `requiresShipping` boolean is added to `misc_items` (admin form). The detail page appends `&requiresShipping=1` to the Buy Now URL. `MiscCheckoutForm` shows address fields when that param is present and sends the address to `/api/create-misc-payment-intent`. `createMiscPaymentIntent` validates the address server-side (reading `requiresShipping` from the Firestore item), stores it in PI metadata, and the webhook writes it to the `misc_marketplace` order doc. `AdminMiscMarketplace` shows it in the expanded order view.

**Tech Stack:** React, React Router v6 searchParams, Express, Firebase Admin SDK, Stripe PaymentIntents metadata.

**Spec:** `docs/superpowers/specs/2026-04-19-misc-shipping-address-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/admin/AdminMiscItemEdit.jsx` | Modify | Add `requiresShipping` to EMPTY, checkbox in fixed-price section, POA cleanup |
| `src/pages/MiscItemDetail.jsx` | Modify | Append `&requiresShipping=1` to Buy Now URL |
| `src/pages/Checkout.jsx` | Modify | Read `requiresShipping` param; pass to `MiscCheckoutForm`; show address fields; send in body |
| `api/stripe.js` | Modify | Validate address in `createMiscPaymentIntent`; store in PI metadata; write to `misc_marketplace` in webhook |
| `server.js` | Modify | Extract `shippingAddress` from body; pass to `createMiscPaymentIntent` |
| `src/pages/admin/AdminMiscMarketplace.jsx` | Modify | Show delivery address block in expanded order view |

---

## Task 1: Update `AdminMiscItemEdit.jsx` — `requiresShipping` field

**Files:**
- Modify: `src/pages/admin/AdminMiscItemEdit.jsx`

- [ ] **Step 1: Add `requiresShipping` to EMPTY constant**

Find (line 9–20):
```js
const EMPTY = {
  name: '',
  category: '',
  priceType: 'poa',
  price: 0,
  priceDisplay: 'POA',
  hasQuantity: false,
  stock: 1,
  condition: 'new',
  description: '',
  images: [],
};
```

Replace with:
```js
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
};
```

- [ ] **Step 2: Zero out `requiresShipping` in the POA cleanup inside `handleSubmit`**

Find (line 100):
```js
        ...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1 } : {}),
```

Replace with:
```js
        ...(form.priceType === 'poa' ? { price: 0, hasQuantity: false, stock: 1, requiresShipping: false } : {}),
```

- [ ] **Step 3: Add `requiresShipping` checkbox inside the fixed-price conditional block**

Find the closing `</div>` of the Quantity section (the one inside `{form.priceType === 'fixed' && (`). The block currently ends:

```jsx
          {form.priceType === 'fixed' && (
            <div>
              <label style={labelStyle}>Quantity</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.hasQuantity}
                  onChange={(e) => set('hasQuantity', e.target.checked)}
                />
                Allow quantity selection on product page
              </label>
              {form.hasQuantity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label style={{ ...labelStyle, margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>Stock available:</label>
                  <input
                    style={{ ...fieldStyle, width: '80px' }}
                    type="number"
                    min="1"
                    step="1"
                    value={form.stock}
                    onChange={(e) => set('stock', Math.max(1, parseInt(e.target.value || 1, 10)))}
                  />
                </div>
              )}
            </div>
          )}
```

Replace with:
```jsx
          {form.priceType === 'fixed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Quantity</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={form.hasQuantity}
                    onChange={(e) => set('hasQuantity', e.target.checked)}
                  />
                  Allow quantity selection on product page
                </label>
                {form.hasQuantity && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ ...labelStyle, margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>Stock available:</label>
                    <input
                      style={{ ...fieldStyle, width: '80px' }}
                      type="number"
                      min="1"
                      step="1"
                      value={form.stock}
                      onChange={(e) => set('stock', Math.max(1, parseInt(e.target.value || 1, 10)))}
                    />
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Shipping</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={form.requiresShipping}
                    onChange={(e) => set('requiresShipping', e.target.checked)}
                  />
                  Requires delivery address at checkout
                </label>
              </div>
            </div>
          )}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminMiscItemEdit.jsx
git commit -m "feat(misc): add requiresShipping checkbox to admin misc item form"
```

---

## Task 2: Update `MiscItemDetail.jsx` — append `requiresShipping` to Buy Now URL

**Files:**
- Modify: `src/pages/MiscItemDetail.jsx`

- [ ] **Step 1: Update `handleBuyNow`**

Find (lines 252–260):
```js
  function handleBuyNow() {
    navigate(
      `/checkout?type=misc` +
      `&itemId=${id}` +
      `&itemName=${encodeURIComponent(item.name)}` +
      `&price=${(item.price / 100).toFixed(2)}` +
      `&qty=${qty}`
    );
  }
```

Replace with:
```js
  function handleBuyNow() {
    navigate(
      `/checkout?type=misc` +
      `&itemId=${id}` +
      `&itemName=${encodeURIComponent(item.name)}` +
      `&price=${(item.price / 100).toFixed(2)}` +
      `&qty=${qty}` +
      (item.requiresShipping ? `&requiresShipping=1` : '')
    );
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/MiscItemDetail.jsx
git commit -m "feat(misc): append requiresShipping param to Buy Now URL"
```

---

## Task 3: Update `Checkout.jsx` — address fields in `MiscCheckoutForm`

**Files:**
- Modify: `src/pages/Checkout.jsx`

- [ ] **Step 1: Read `requiresShipping` param in the `Checkout` function and pass it to `MiscCheckoutForm`**

Find (line 333):
```js
  const qty = searchParams.get('qty') || '1';
```

Add immediately after:
```js
  const requiresShipping = searchParams.get('requiresShipping') === '1';
```

Find (line 466):
```jsx
                <MiscCheckoutForm itemId={itemId} itemName={itemName} qty={qty} price={price} />
```

Replace with:
```jsx
                <MiscCheckoutForm itemId={itemId} itemName={itemName} qty={qty} price={price} requiresShipping={requiresShipping} />
```

- [ ] **Step 2: Add `requiresShipping` prop + address state to `MiscCheckoutForm`**

Find the `MiscCheckoutForm` function signature (line 220):
```js
function MiscCheckoutForm({ itemId, itemName, qty, price }) {
```

Replace with:
```js
function MiscCheckoutForm({ itemId, itemName, qty, price, requiresShipping }) {
```

Find the existing state declarations (after `const [error, setError] = useState('');`):
```js
  const [error, setError] = useState('');
```

Add immediately after:
```js
  const [shippingAddress, setShippingAddress] = useState({ line1: '', line2: '', city: '', postcode: '' });
```

- [ ] **Step 3: Include `shippingAddress` in the API call body**

Find the `body: JSON.stringify(...)` block (lines 244–251):
```js
        body: JSON.stringify({
          itemId,
          qty: Number(qty),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
```

Replace with:
```js
        body: JSON.stringify({
          itemId,
          qty: Number(qty),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          ...(requiresShipping ? { shippingAddress } : {}),
        }),
```

- [ ] **Step 4: Add address fields to the form JSX**

Find the Phone field in `MiscCheckoutForm` return JSX:
```jsx
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input style={styles.input} type="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Number</label>
```

Replace with:
```jsx
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Phone Number</label>
        <input style={styles.input} type="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      {requiresShipping && (
        <>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address Line 1</label>
            <input style={styles.input} type="text" placeholder="12 Example Street" value={shippingAddress.line1} onChange={(e) => setShippingAddress((a) => ({ ...a, line1: e.target.value }))} required />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address Line 2 <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
            <input style={styles.input} type="text" placeholder="Flat 2" value={shippingAddress.line2} onChange={(e) => setShippingAddress((a) => ({ ...a, line2: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>City</label>
              <input style={styles.input} type="text" placeholder="London" value={shippingAddress.city} onChange={(e) => setShippingAddress((a) => ({ ...a, city: e.target.value }))} required />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Postcode</label>
              <input style={styles.input} type="text" placeholder="SW1A 1AA" value={shippingAddress.postcode} onChange={(e) => setShippingAddress((a) => ({ ...a, postcode: e.target.value }))} required />
            </div>
          </div>
        </>
      )}

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Card Number</label>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Checkout.jsx
git commit -m "feat(misc): add shipping address fields to MiscCheckoutForm"
```

---

## Task 4: Update `api/stripe.js` — validate, metadata, webhook

**Files:**
- Modify: `api/stripe.js`

- [ ] **Step 1: Accept `shippingAddress` in `createMiscPaymentIntent` and validate**

Find the function signature (line 656):
```js
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone }) {
```

Replace with:
```js
async function createMiscPaymentIntent({ itemId, qty, customerName, customerEmail, customerPhone, shippingAddress }) {
```

Find the quantity validation block — after the `else if (qtyNum !== 1)` throw, before `const amount = ...`:
```js
  const amount = item.price * qtyNum;
```

Add immediately before it:
```js
  if (item.requiresShipping) {
    if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postcode) {
      const err = new Error('Delivery address is required for this item');
      err.statusCode = 400;
      throw err;
    }
  }

```

- [ ] **Step 2: Store shipping fields in PaymentIntent metadata**

Find the `metadata` object inside `getStripe().paymentIntents.create(...)` (lines 693–701):
```js
    metadata: {
      productType: 'misc',
      itemId,
      itemName: String(item.name || '').slice(0, 500),
      qty: String(qtyNum),
      customerName,
      customerEmail,
      customerPhone,
    },
```

Replace with:
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
    },
```

- [ ] **Step 3: Write shipping fields to `misc_marketplace` in the webhook**

Find the `misc_marketplace` write block in the webhook handler (lines 533–548):
```js
      if (productType === 'misc') {
        const { itemId, itemName, qty } = pi.metadata;
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
        });
      }
```

Replace with:
```js
      if (productType === 'misc') {
        const { itemId, itemName, qty, shippingLine1, shippingLine2, shippingCity, shippingPostcode } = pi.metadata;
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
          ...(shippingLine1 ? { shippingLine1, shippingLine2: shippingLine2 || '', shippingCity, shippingPostcode } : {}),
        });
      }
```

- [ ] **Step 4: Commit**

```bash
git add api/stripe.js
git commit -m "feat(misc): validate and store shipping address in createMiscPaymentIntent and webhook"
```

---

## Task 5: Update `server.js` — pass `shippingAddress` to `createMiscPaymentIntent`

**Files:**
- Modify: `server.js`

- [ ] **Step 1: Extract `shippingAddress` from the request body**

Find (line 214):
```js
  const { itemId, qty, customerName, customerEmail, customerPhone } = req.body || {};
```

Replace with:
```js
  const { itemId, qty, customerName, customerEmail, customerPhone, shippingAddress } = req.body || {};
```

- [ ] **Step 2: Pass `shippingAddress` to `createMiscPaymentIntent`**

Find (lines 230–236):
```js
    const paymentIntent = await createMiscPaymentIntent({
      itemId,
      qty: qtyNum,
      customerName,
      customerEmail,
      customerPhone: sanitisedPhone,
    });
```

Replace with:
```js
    const paymentIntent = await createMiscPaymentIntent({
      itemId,
      qty: qtyNum,
      customerName,
      customerEmail,
      customerPhone: sanitisedPhone,
      shippingAddress,
    });
```

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "feat(misc): pass shippingAddress through to createMiscPaymentIntent"
```

---

## Task 6: Update `AdminMiscMarketplace.jsx` — show delivery address

**Files:**
- Modify: `src/pages/admin/AdminMiscMarketplace.jsx`

- [ ] **Step 1: Add delivery address block after the order detail row**

Find the order detail row and its closing `</div>` (lines 136–141):
```jsx
                    {isOrder ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Detail label="Qty" value={String(entry.qty || 1)} />
                        <Detail label="Amount" value={displayAmount(entry.amount)} />
                        <Detail label="Stripe Ref" value={entry.ref} />
                      </div>
                    ) : (
```

Replace with:
```jsx
                    {isOrder ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <Detail label="Qty" value={String(entry.qty || 1)} />
                          <Detail label="Amount" value={displayAmount(entry.amount)} />
                          <Detail label="Stripe Ref" value={entry.ref} />
                        </div>
                        {entry.shippingLine1 && (
                          <div style={{ marginTop: '0.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.75rem' }}>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Delivery Address</div>
                            <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>
                              {entry.shippingLine1}<br />
                              {entry.shippingLine2 && <>{entry.shippingLine2}<br /></>}
                              {entry.shippingCity}<br />
                              {entry.shippingPostcode}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminMiscMarketplace.jsx
git commit -m "feat(misc): show delivery address in admin marketplace order view"
```

---

## Self-Review

**Spec coverage check:**
- Part 1 (data model `requiresShipping`): Task 1 ✅
- Part 2 (admin checkbox + POA cleanup): Task 1 ✅
- Part 3 (detail page URL param): Task 2 ✅
- Part 4 (checkout address fields + API body): Task 3 ✅
- Part 5 (server validation + metadata): Tasks 4 + 5 ✅
- Part 6 (admin delivery address display): Task 6 ✅

**No placeholders found.**

**Type consistency:**
- `shippingAddress` object with `{ line1, line2, city, postcode }` used consistently in Task 3 (client state), Task 4 (stripe.js param), Task 5 (server.js pass-through)
- PI metadata keys `shippingLine1/2/City/Postcode` used consistently in Task 4 metadata write and Task 4 webhook destructure
- `entry.shippingLine1` used in Task 6 matches what Task 4 webhook writes ✅
