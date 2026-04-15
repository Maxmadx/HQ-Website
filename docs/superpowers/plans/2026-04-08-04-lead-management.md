# Lead Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture every CTA click and form submission into Firestore leads, build a lead dashboard with status management, and wire discovery flight bookings directly to Stripe checkout.

**Architecture:** A thin Express API route (`/api/leads`) writes to Firestore server-side (avoids exposing Firebase Admin keys client-side). The existing Stripe integration on the Express server gains a new `/api/stripe/discovery-checkout` endpoint. The React admin page subscribes live to the `leads` collection via `useCollection`. All existing contact forms and CTA buttons POST to the new endpoint rather than directly writing to Firestore.

**Tech Stack:** React 19, Express 4, Firebase Admin SDK (server-side), Firestore, Stripe, `useFirestore` hook (from Plan 03)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `api/leads.js` | Create | Express route: POST /api/leads, GET /api/leads (admin) |
| `api/stripe-discovery.js` | Create | POST /api/stripe/discovery-checkout — create Stripe session |
| `src/pages/admin/AdminLeads.jsx` | Create | Lead dashboard table with status/notes editing |
| `src/App.jsx` | Modify | Add `/admin/leads` route |
| `src/components/admin/AdminLayout.jsx` | Modify | Add Leads nav item (if not present) |
| `server.js` (or `index.js`) | Modify | Mount `api/leads.js` and `api/stripe-discovery.js` routes |
| Existing CTA pages | Modify | POST to `/api/leads` on form submit |

> **Before starting:** Run `grep -r "onSubmit\|handleSubmit\|contact\|CTA" src/pages --include="*.jsx" -l` to identify which pages have forms to update.

---

### Task 1: Lead capture API route

**Files:**
- Create: `api/leads.js`

- [ ] **Step 1: Create `api/leads.js`**

```js
// api/leads.js
// Express router for lead capture and retrieval.
// Uses Firebase Admin SDK — requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
// FIREBASE_PRIVATE_KEY env vars.

import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

function getDb() {
  return admin.firestore();
}

// POST /api/leads — public endpoint, creates a new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, source } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const db = getDb();
    const ref = await db.collection('leads').add({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || '').slice(0, 50),
      subject: String(subject || '').slice(0, 300),
      message: String(message || '').slice(0, 5000),
      source: String(source || '').slice(0, 300),
      status: 'new',
      notes: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.json({ id: ref.id });
  } catch (err) {
    console.error('Lead capture error:', err);
    return res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// PATCH /api/leads/:id — admin only, update status or notes
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ['new', 'contacted', 'qualified', 'closed'];
    const update = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (status !== undefined) {
      if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
      update.status = status;
    }
    if (notes !== undefined) update.notes = String(notes).slice(0, 5000);
    await getDb().collection('leads').doc(req.params.id).update(update);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Lead update error:', err);
    return res.status(500).json({ error: 'Failed to update lead' });
  }
});

export default router;
```

- [ ] **Step 2: Mount in server**

In your Express entry file (check for `server.js`, `index.js`, or `api/index.js`):

```js
import leadsRouter from './api/leads.js';
// ...
app.use('/api/leads', leadsRouter);
```

- [ ] **Step 3: Test with curl**

```bash
curl -s -X POST http://localhost:7500/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","source":"/contact","subject":"Test","message":"Hello"}' \
  | jq .
```

Expected: `{"id":"<some-firestore-id>"}`

- [ ] **Step 4: Commit**

```bash
git add api/leads.js server.js
git commit -m "feat: add lead capture POST /api/leads endpoint"
```

---

### Task 2: Stripe discovery flight checkout endpoint

**Files:**
- Create: `api/stripe-discovery.js`

The existing server already has Stripe set up. This adds a dedicated checkout session for discovery flights that reads pricing from Firestore (so price changes in the admin panel take effect immediately).

- [ ] **Step 1: Create `api/stripe-discovery.js`**

```js
// api/stripe-discovery.js
// Creates a Stripe Checkout session for discovery flights.
// Reads price from Firestore `pricing` collection so admin can update without code changes.

import express from 'express';
import Stripe from 'stripe';
import admin from 'firebase-admin';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/discovery-checkout
// Body: { priceId: string, successUrl: string, cancelUrl: string }
// priceId maps to a document id in the `pricing` Firestore collection.
router.post('/', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId required' });

    const db = admin.firestore();
    const snap = await db.collection('pricing').doc(priceId).get();
    if (!snap.exists) return res.status(404).json({ error: 'Price not found' });

    const item = snap.data();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: { name: item.label, description: item.description || '' },
            unit_amount: item.price, // already in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: successUrl || `${process.env.SITE_URL || 'http://localhost:5173'}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.SITE_URL || 'http://localhost:5173'}/discovery-flights`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router;
```

- [ ] **Step 2: Mount in server**

```js
import stripeDiscoveryRouter from './api/stripe-discovery.js';
// ...
app.use('/api/stripe/discovery-checkout', stripeDiscoveryRouter);
```

- [ ] **Step 3: Add `SITE_URL` to `.env.example`**

```
SITE_URL=https://hqaviation.co.uk
```

- [ ] **Step 4: Commit**

```bash
git add api/stripe-discovery.js server.js .env.example
git commit -m "feat: add Stripe discovery flight checkout endpoint backed by Firestore pricing"
```

---

### Task 3: Update existing contact forms to capture leads

- [ ] **Step 1: Find all contact forms and CTA submit handlers**

```bash
grep -rn "onSubmit\|handleSubmit\|fetch.*contact\|nodemailer\|sendMail" src/pages --include="*.jsx" | head -40
```

Note the file paths and line numbers returned.

- [ ] **Step 2: Add lead capture call alongside existing email send**

For each form that already sends an email via the server, add a fire-and-forget lead capture call **after** the existing logic succeeds. Pattern to add:

```js
// After existing form submit / email send succeeds:
fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone || '',
    subject: formData.subject || formData.service || '',
    message: formData.message || '',
    source: window.location.pathname,
  }),
}).catch(() => {}); // fire and forget — don't block UX on lead capture
```

Apply this pattern to:
- Main contact form (likely in `Contact.jsx` or similar)
- Any discovery flight booking form
- Any "get a quote" / "book a flight" CTAs

- [ ] **Step 3: Commit**

```bash
git add src/pages/
git commit -m "feat: capture leads from contact and CTA forms"
```

---

### Task 4: `AdminLeads` dashboard

**Files:**
- Create: `src/pages/admin/AdminLeads.jsx`

- [ ] **Step 1: Create AdminLeads**

Create `src/pages/admin/AdminLeads.jsx`:

```jsx
import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection } from '../../hooks/useFirestore';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed'];

export default function AdminLeads() {
  const { docs: leads, loading } = useCollection('leads');
  const [expandedId, setExpandedId] = useState(null);
  const [editNotes, setEditNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  async function updateLead(id, payload) {
    setSavingId(id);
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  const filtered = filterStatus === 'all' ? leads : leads.filter((l) => l.status === filterStatus);

  const counts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Leads</h1>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{leads.length} total</span>
        </div>

        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '4px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600,
                background: filterStatus === s ? '#111827' : '#f3f4f6',
                color: filterStatus === s ? '#fff' : '#374151',
              }}
            >
              {s === 'all' ? `All (${leads.length})` : `${s} (${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No leads matching filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((lead) => {
            const isOpen = expandedId === lead.id;
            const notes = editNotes[lead.id] !== undefined ? editNotes[lead.id] : (lead.notes || '');
            return (
              <div
                key={lead.id}
                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}
              >
                {/* Lead row header */}
                <div
                  onClick={() => setExpandedId(isOpen ? null : lead.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ flex: '0 0 180px' }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{lead.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{lead.email}</div>
                  </div>
                  <div style={{ flex: '0 0 140px', color: '#6b7280', fontSize: '0.8rem' }}>{lead.phone || '—'}</div>
                  <div style={{ flex: 1, color: '#374151', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.subject || lead.message?.slice(0, 80) || '—'}
                  </div>
                  <div style={{ flex: '0 0 120px' }}>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div style={{ flex: '0 0 100px', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'right' }}>
                    {formatDate(lead.createdAt)}
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem', background: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Message</div>
                        <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{lead.message || '—'}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Source</div>
                        <p style={{ fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace', margin: 0 }}>{lead.source || '—'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Notes</div>
                        <textarea
                          value={notes}
                          onChange={(e) => setEditNotes((n) => ({ ...n, [lead.id]: e.target.value }))}
                          style={{ width: '100%', minHeight: '72px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '0 0 180px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                            style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <button
                          onClick={() => updateLead(lead.id, { notes })}
                          disabled={savingId === lead.id}
                          style={{ padding: '0.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: savingId === lead.id ? 0.6 : 1 }}
                        >
                          {savingId === lead.id ? 'Saving…' : 'Save Notes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminLeads.jsx
git commit -m "feat: add AdminLeads dashboard with status and notes editing"
```

---

### Task 5: Wire up routes and nav

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Add leads route to App.jsx**

```jsx
import AdminLeads from './pages/admin/AdminLeads';
// ...
<Route path="/admin/leads" element={<AdminLeads />} />
```

- [ ] **Step 2: Add to AdminLayout NAV_ITEMS if not present**

```jsx
{ to: '/admin/leads', icon: '📬', label: 'Leads' },
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat: add /admin/leads route and nav item"
```

---

### Task 6: Manual smoke test

- [ ] **Step 1: Submit a test lead via the contact form**

Navigate to the contact form on the site. Fill in name, email, message. Submit.

Expected: Form succeeds as before. Check Firestore console — new doc in `leads` collection.

- [ ] **Step 2: Verify lead appears in `/admin/leads`**

Expected: New lead card with status "new" and formatted date.

- [ ] **Step 3: Expand the lead, change status to "contacted", add notes**

Click the lead card. Change status dropdown to "contacted". Type a note. Click "Save Notes".

Expected: StatusBadge updates. No errors.

- [ ] **Step 4: Test Stripe checkout (if discovery flight page exists)**

POST to the checkout endpoint with a valid `priceId` from the pricing collection.

```bash
curl -s -X POST http://localhost:7500/api/stripe/discovery-checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"discovery_r22_30min"}' | jq .url
```

Expected: Stripe Checkout URL returned.
