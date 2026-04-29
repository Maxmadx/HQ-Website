# Aircraft Consulting Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition `/aircraft-consulting` from a pre-purchase-flavoured page with extras to a full helicopter-consulting menu with Robinson depth — 8 services in 3 groups, rewritten Why-It-Matters cards, generalised process flow, and a service-typed enquiry form.

**Architecture:** Single-page edit. Keep the existing `ac-*` CSS namespace, animation config, and 9-section visual grammar. Extract one new helper module (`aircraftConsultingForm.js`) for the form's service-typed conditional-field logic; everything else is in-place data-array swaps and copy edits in `src/pages/AircraftConsulting.jsx`.

**Tech Stack:** React 19 · Vite · Framer Motion · Vitest + @testing-library/react · jsdom

**Spec:** [`docs/superpowers/specs/2026-04-28-aircraft-consulting-page-redesign.md`](../specs/2026-04-28-aircraft-consulting-page-redesign.md)

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/pages/AircraftConsulting.jsx` | Modify | Page component — copy, data arrays, render structure, form wiring, one CSS rule |
| `src/pages/aircraftConsultingForm.js` | **Create** | Pure helper for the enquiry form: service-type list, conditional-field map, state shape, clear-stale-fields helper |
| `src/pages/aircraftConsultingForm.test.js` | **Create** | Vitest unit tests for the helper (TDD) |

No new components, no design-token edits, no animation changes, no hero photo swap, no per-service routes.

---

## Task 1: Form helper module — service-type list and field map (TDD)

**Files:**
- Create: `src/pages/aircraftConsultingForm.js`
- Test: `src/pages/aircraftConsultingForm.test.js`

The helper exports the canonical service-type list, the conditional-field map per service, the form's initial state shape, and a function that clears stale service-specific fields when the user switches service type. Tests lock the contract.

- [ ] **Step 1.1: Write the failing tests**

Create `src/pages/aircraftConsultingForm.test.js`:

```js
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  SERVICE_TYPES,
  SERVICE_FIELD_MAP,
  ALWAYS_VISIBLE_FIELDS,
  ALL_CONDITIONAL_FIELDS,
  INITIAL_FORM_STATE,
  getServiceFields,
  clearConditionalFields,
} from './aircraftConsultingForm';

describe('SERVICE_TYPES', () => {
  it('lists the 8 services from the spec with stable slug + label', () => {
    expect(SERVICE_TYPES).toHaveLength(8);
    expect(SERVICE_TYPES.map(s => s.slug)).toEqual([
      'pre-purchase-inspection',
      'acquisition-advisory',
      'valuation',
      'aircraft-management',
      'tco-modelling',
      'insurance-advisory',
      'import-export',
      'expert-witness',
    ]);
    SERVICE_TYPES.forEach(s => {
      expect(typeof s.label).toBe('string');
      expect(s.label.length).toBeGreaterThan(0);
    });
  });
});

describe('SERVICE_FIELD_MAP', () => {
  it('maps every service slug to a list of conditional field names', () => {
    SERVICE_TYPES.forEach(s => {
      expect(Array.isArray(SERVICE_FIELD_MAP[s.slug])).toBe(true);
    });
  });

  it('matches the spec field-set per service', () => {
    expect(SERVICE_FIELD_MAP['pre-purchase-inspection']).toEqual(
      ['registration', 'askingPrice', 'targetInspectionDate']
    );
    expect(SERVICE_FIELD_MAP['acquisition-advisory']).toEqual(
      ['budgetRange', 'intendedUse', 'timeline']
    );
    expect(SERVICE_FIELD_MAP['valuation']).toEqual(
      ['registration', 'valuationPurpose']
    );
    expect(SERVICE_FIELD_MAP['aircraft-management']).toEqual(
      ['aircraftType', 'ownershipStatus']
    );
    expect(SERVICE_FIELD_MAP['tco-modelling']).toEqual(
      ['aircraftType', 'expectedAnnualHours']
    );
    expect(SERVICE_FIELD_MAP['insurance-advisory']).toEqual(
      ['aircraftType', 'currentRenewalDate']
    );
    expect(SERVICE_FIELD_MAP['import-export']).toEqual(
      ['aircraftType', 'fromRegistry', 'toRegistry']
    );
    expect(SERVICE_FIELD_MAP['expert-witness']).toEqual(
      ['matterType', 'party']
    );
  });
});

describe('ALWAYS_VISIBLE_FIELDS', () => {
  it('has the four base fields shared by every service', () => {
    expect(ALWAYS_VISIBLE_FIELDS).toEqual(['name', 'email', 'phone', 'message']);
  });
});

describe('ALL_CONDITIONAL_FIELDS', () => {
  it('is the union of every conditional field across services', () => {
    expect(new Set(ALL_CONDITIONAL_FIELDS)).toEqual(new Set([
      'registration',
      'askingPrice',
      'targetInspectionDate',
      'budgetRange',
      'intendedUse',
      'timeline',
      'valuationPurpose',
      'aircraftType',
      'ownershipStatus',
      'expectedAnnualHours',
      'currentRenewalDate',
      'fromRegistry',
      'toRegistry',
      'matterType',
      'party',
    ]));
  });
});

describe('INITIAL_FORM_STATE', () => {
  it('zeroes every field as an empty string and includes serviceType', () => {
    expect(INITIAL_FORM_STATE).toEqual({
      name: '',
      email: '',
      phone: '',
      message: '',
      serviceType: '',
      registration: '',
      askingPrice: '',
      targetInspectionDate: '',
      budgetRange: '',
      intendedUse: '',
      timeline: '',
      valuationPurpose: '',
      aircraftType: '',
      ownershipStatus: '',
      expectedAnnualHours: '',
      currentRenewalDate: '',
      fromRegistry: '',
      toRegistry: '',
      matterType: '',
      party: '',
    });
  });
});

describe('getServiceFields', () => {
  it('returns the conditional field list for a known slug', () => {
    expect(getServiceFields('valuation')).toEqual(['registration', 'valuationPurpose']);
  });

  it('returns an empty list for an unknown or empty slug', () => {
    expect(getServiceFields('')).toEqual([]);
    expect(getServiceFields('not-a-service')).toEqual([]);
    expect(getServiceFields(undefined)).toEqual([]);
  });
});

describe('clearConditionalFields', () => {
  it('zeroes every conditional field while preserving always-visible + serviceType', () => {
    const dirty = {
      name: 'Pat',
      email: 'p@x.com',
      phone: '123',
      message: 'hi',
      serviceType: 'valuation',
      registration: 'G-ABCD',
      askingPrice: '500000',
      targetInspectionDate: '',
      budgetRange: '',
      intendedUse: '',
      timeline: '',
      valuationPurpose: 'finance',
      aircraftType: '',
      ownershipStatus: '',
      expectedAnnualHours: '',
      currentRenewalDate: '',
      fromRegistry: '',
      toRegistry: '',
      matterType: '',
      party: '',
    };
    const cleared = clearConditionalFields(dirty);
    expect(cleared.name).toBe('Pat');
    expect(cleared.email).toBe('p@x.com');
    expect(cleared.phone).toBe('123');
    expect(cleared.message).toBe('hi');
    expect(cleared.serviceType).toBe('valuation');
    expect(cleared.registration).toBe('');
    expect(cleared.askingPrice).toBe('');
    expect(cleared.valuationPurpose).toBe('');
  });

  it('does not mutate the input', () => {
    const input = { ...INITIAL_FORM_STATE, registration: 'G-ABCD' };
    const before = JSON.stringify(input);
    clearConditionalFields(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
```

- [ ] **Step 1.2: Run tests to verify they fail**

```
npm test -- aircraftConsultingForm
```

Expected: FAIL — module not found.

- [ ] **Step 1.3: Write the helper module**

Create `src/pages/aircraftConsultingForm.js`:

```js
/**
 * Enquiry-form helper for /aircraft-consulting.
 *
 * Exports the canonical service-type list, the conditional-field map per
 * service, the initial form state, and a helper for clearing stale
 * service-specific values when the user switches service type.
 */

export const SERVICE_TYPES = [
  { slug: 'pre-purchase-inspection', label: 'Pre-Purchase Inspection' },
  { slug: 'acquisition-advisory',    label: 'Acquisition Advisory' },
  { slug: 'valuation',               label: 'Valuation & Appraisal' },
  { slug: 'aircraft-management',     label: 'Aircraft Management' },
  { slug: 'tco-modelling',           label: 'Operating Cost & TCO' },
  { slug: 'insurance-advisory',      label: 'Insurance Advisory' },
  { slug: 'import-export',           label: 'Import / Export & Register Transfer' },
  { slug: 'expert-witness',          label: 'Expert Witness & Litigation Support' },
];

export const ALWAYS_VISIBLE_FIELDS = ['name', 'email', 'phone', 'message'];

export const SERVICE_FIELD_MAP = {
  'pre-purchase-inspection': ['registration', 'askingPrice', 'targetInspectionDate'],
  'acquisition-advisory':    ['budgetRange', 'intendedUse', 'timeline'],
  'valuation':               ['registration', 'valuationPurpose'],
  'aircraft-management':     ['aircraftType', 'ownershipStatus'],
  'tco-modelling':           ['aircraftType', 'expectedAnnualHours'],
  'insurance-advisory':      ['aircraftType', 'currentRenewalDate'],
  'import-export':           ['aircraftType', 'fromRegistry', 'toRegistry'],
  'expert-witness':          ['matterType', 'party'],
};

export const ALL_CONDITIONAL_FIELDS = Array.from(
  new Set(Object.values(SERVICE_FIELD_MAP).flat())
);

export const INITIAL_FORM_STATE = {
  ...Object.fromEntries(ALWAYS_VISIBLE_FIELDS.map(f => [f, ''])),
  serviceType: '',
  ...Object.fromEntries(ALL_CONDITIONAL_FIELDS.map(f => [f, ''])),
};

export function getServiceFields(slug) {
  return SERVICE_FIELD_MAP[slug] || [];
}

export function clearConditionalFields(state) {
  const next = { ...state };
  ALL_CONDITIONAL_FIELDS.forEach(f => { next[f] = ''; });
  return next;
}
```

- [ ] **Step 1.4: Run tests to verify they pass**

```
npm test -- aircraftConsultingForm
```

Expected: PASS — all helper tests green.

- [ ] **Step 1.5: Commit**

```bash
git add src/pages/aircraftConsultingForm.js src/pages/aircraftConsultingForm.test.js
git commit -m "feat(aircraft-consulting): form helper for service-typed conditional fields"
```

---

## Task 2: Wire form state to use helper + reset on success

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:175-176, 196`

Replace the inline `useState` initial value with `INITIAL_FORM_STATE`, and replace the success-reset with the same constant. UI rendering stays the same in this task — wiring only.

- [ ] **Step 2.1: Add helper import**

In `src/pages/AircraftConsulting.jsx`, add an import near the other page-local imports (after line 23):

```jsx
import { INITIAL_FORM_STATE, SERVICE_TYPES, SERVICE_FIELD_MAP, getServiceFields, clearConditionalFields } from './aircraftConsultingForm';
```

- [ ] **Step 2.2: Replace form state initial value**

Find at line 175:

```jsx
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', registration: '', serviceType: '', message: '' });
```

Replace with:

```jsx
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
```

- [ ] **Step 2.3: Replace success reset value**

Find at line 196:

```jsx
      setFormData({ name: '', email: '', phone: '', registration: '', serviceType: '', message: '' });
```

Replace with:

```jsx
      setFormData(INITIAL_FORM_STATE);
```

- [ ] **Step 2.4: Verify dev server starts and form still renders**

```
npm run dev:vite
```

Open `http://localhost:5173/aircraft-consulting`. Confirm the page renders, the form is visible, and the existing fields (name, email, phone, registration, service type, message) still work as before. Stop the dev server.

- [ ] **Step 2.5: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "refactor(aircraft-consulting): use INITIAL_FORM_STATE for form init + reset"
```

---

## Task 3: Replace serviceType select options with the 8 services

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:625-637`

Replace the existing 5-option `<select>` with the 8 services from `SERVICE_TYPES`. Keep an "Other" trailing option for unstructured enquiries.

- [ ] **Step 3.1: Replace the select options**

Find the block at line 625:

```jsx
                    <select
                      id="ac-service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData(p => ({ ...p, serviceType: e.target.value }))}
                    >
                      <option value="">Select a service...</option>
                      <option value="Pre-Purchase Inspection">Pre-Purchase Inspection</option>
                      <option value="Ownership Advisory">Ownership Advisory</option>
                      <option value="Fleet Planning">Fleet Planning</option>
                      <option value="Acquisition Services">Acquisition Services</option>
                      <option value="Other">Other</option>
                    </select>
```

Replace with (note: change-handler comes in Task 4 — keep the simple inline updater for now, but switch the option `value` to the slug):

```jsx
                    <select
                      id="ac-service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData(p => ({ ...p, serviceType: e.target.value }))}
                    >
                      <option value="">Select a service...</option>
                      {SERVICE_TYPES.map(s => (
                        <option key={s.slug} value={s.slug}>{s.label}</option>
                      ))}
                      <option value="other">Something else</option>
                    </select>
```

- [ ] **Step 3.2: Verify in browser**

```
npm run dev:vite
```

Open `/aircraft-consulting`, scroll to the form, open the Service Type dropdown. Confirm 8 service options + "Something else" appear. Submit a test enquiry and confirm the value posted is the slug (open the Network tab → POST `/api/leads` → check `serviceType` is e.g. `"valuation"`). Stop the dev server.

- [ ] **Step 3.3: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): expand serviceType select to 8 services"
```

---

## Task 4: Add change-handler that clears stale conditional fields

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx` — the `<select>` `onChange` from Task 3

When the user switches service type, any values they've typed into the prior service's conditional fields must be cleared so they don't get submitted with the new service.

- [ ] **Step 4.1: Add a dedicated change-handler**

Inside the `AircraftConsulting` function component, just below the `handleFormSubmit` function (around line 198), add:

```jsx
  function handleServiceTypeChange(e) {
    const nextServiceType = e.target.value;
    setFormData(p => ({
      ...clearConditionalFields(p),
      serviceType: nextServiceType,
    }));
  }
```

- [ ] **Step 4.2: Wire the select to use the new handler**

Find the `<select>` block (modified in Task 3):

```jsx
                      onChange={(e) => setFormData(p => ({ ...p, serviceType: e.target.value }))}
```

Replace with:

```jsx
                      onChange={handleServiceTypeChange}
```

- [ ] **Step 4.3: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Pick "Pre-Purchase Inspection" from the dropdown, type something into the (currently still-visible) registration field. Switch to "Acquisition Advisory". The registration value should be empty when you switch back to PPI. Stop dev server.

- [ ] **Step 4.4: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): clear stale conditional fields on serviceType change"
```

---

## Task 5: Render conditional fields per service

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:610-621` (existing always-visible registration row) and surrounding form layout

The existing form has `registration` always visible alongside `phone`. In the new design, `registration` is conditional (PPI + Valuation only) and 14 other conditional fields exist. This task replaces the always-visible registration field with a service-conditional block that renders only the fields needed for the selected service.

- [ ] **Step 5.1: Compute the visible field set in the component body**

Inside the `AircraftConsulting` function component, just above the `return` statement (around line 251), add:

```jsx
  const visibleConditionalFields = getServiceFields(formData.serviceType);
  const isVisible = (name) => visibleConditionalFields.includes(name);
```

- [ ] **Step 5.2: Replace the always-visible registration row with a phone-only row**

Find the row at lines 598-621 (the row with phone + registration). Replace the entire `<div className="ac-enquiry__row">` block with:

```jsx
                  <div className="ac-enquiry__row">
                    <div className="ac-field">
                      <label htmlFor="ac-phone">Phone</label>
                      <input
                        id="ac-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+44 7700 000000"
                      />
                    </div>
                    {isVisible('registration') && (
                      <div className="ac-field">
                        <label htmlFor="ac-registration">Aircraft Registration</label>
                        <input
                          id="ac-registration"
                          type="text"
                          name="registration"
                          value={formData.registration}
                          onChange={(e) => setFormData(p => ({ ...p, registration: e.target.value }))}
                          placeholder="e.g. G-ABCD"
                        />
                      </div>
                    )}
                  </div>
```

- [ ] **Step 5.3: Add the service-specific conditional block below the serviceType select**

Find the closing `</div>` of the serviceType select field (the line after the closing `</select>`). Below that field's closing `</div>`, before the message field, add the conditional block:

```jsx
                  {formData.serviceType && (
                    <>
                      {isVisible('askingPrice') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-asking-price">Asking Price</label>
                            <input
                              id="ac-asking-price"
                              type="text"
                              name="askingPrice"
                              value={formData.askingPrice}
                              onChange={(e) => setFormData(p => ({ ...p, askingPrice: e.target.value }))}
                              placeholder="e.g. £450,000"
                            />
                          </div>
                          {isVisible('targetInspectionDate') && (
                            <div className="ac-field">
                              <label htmlFor="ac-target-date">Target Inspection Date</label>
                              <input
                                id="ac-target-date"
                                type="text"
                                name="targetInspectionDate"
                                value={formData.targetInspectionDate}
                                onChange={(e) => setFormData(p => ({ ...p, targetInspectionDate: e.target.value }))}
                                placeholder="e.g. within 2 weeks"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {isVisible('budgetRange') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-budget">Budget Range</label>
                            <input
                              id="ac-budget"
                              type="text"
                              name="budgetRange"
                              value={formData.budgetRange}
                              onChange={(e) => setFormData(p => ({ ...p, budgetRange: e.target.value }))}
                              placeholder="e.g. £300k–£500k"
                            />
                          </div>
                          <div className="ac-field">
                            <label htmlFor="ac-timeline">Timeline</label>
                            <input
                              id="ac-timeline"
                              type="text"
                              name="timeline"
                              value={formData.timeline}
                              onChange={(e) => setFormData(p => ({ ...p, timeline: e.target.value }))}
                              placeholder="e.g. ready to buy in 3 months"
                            />
                          </div>
                        </div>
                      )}
                      {isVisible('intendedUse') && (
                        <div className="ac-field">
                          <label htmlFor="ac-intended-use">Intended Use</label>
                          <input
                            id="ac-intended-use"
                            type="text"
                            name="intendedUse"
                            value={formData.intendedUse}
                            onChange={(e) => setFormData(p => ({ ...p, intendedUse: e.target.value }))}
                            placeholder="Private, training, charter, utility…"
                          />
                        </div>
                      )}

                      {isVisible('valuationPurpose') && (
                        <div className="ac-field">
                          <label htmlFor="ac-valuation-purpose">Valuation Purpose</label>
                          <select
                            id="ac-valuation-purpose"
                            name="valuationPurpose"
                            value={formData.valuationPurpose}
                            onChange={(e) => setFormData(p => ({ ...p, valuationPurpose: e.target.value }))}
                          >
                            <option value="">Select a purpose…</option>
                            <option value="purchase">Purchase</option>
                            <option value="finance">Finance / lender</option>
                            <option value="insurance">Insurance</option>
                            <option value="tax">Tax</option>
                            <option value="legal">Legal / dispute</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      )}

                      {isVisible('aircraftType') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-aircraft-type">Aircraft Type</label>
                            <input
                              id="ac-aircraft-type"
                              type="text"
                              name="aircraftType"
                              value={formData.aircraftType}
                              onChange={(e) => setFormData(p => ({ ...p, aircraftType: e.target.value }))}
                              placeholder="e.g. R44 Raven II, AS350"
                            />
                          </div>
                          {isVisible('ownershipStatus') && (
                            <div className="ac-field">
                              <label htmlFor="ac-ownership">Ownership Status</label>
                              <select
                                id="ac-ownership"
                                name="ownershipStatus"
                                value={formData.ownershipStatus}
                                onChange={(e) => setFormData(p => ({ ...p, ownershipStatus: e.target.value }))}
                              >
                                <option value="">Select…</option>
                                <option value="own">Owned outright</option>
                                <option value="spv">Held in SPV / company</option>
                                <option value="lease">Leased</option>
                                <option value="prospective">Prospective</option>
                              </select>
                            </div>
                          )}
                          {isVisible('expectedAnnualHours') && (
                            <div className="ac-field">
                              <label htmlFor="ac-annual-hours">Expected Annual Hours</label>
                              <input
                                id="ac-annual-hours"
                                type="text"
                                name="expectedAnnualHours"
                                value={formData.expectedAnnualHours}
                                onChange={(e) => setFormData(p => ({ ...p, expectedAnnualHours: e.target.value }))}
                                placeholder="e.g. 120"
                              />
                            </div>
                          )}
                          {isVisible('currentRenewalDate') && (
                            <div className="ac-field">
                              <label htmlFor="ac-renewal-date">Current Renewal Date</label>
                              <input
                                id="ac-renewal-date"
                                type="text"
                                name="currentRenewalDate"
                                value={formData.currentRenewalDate}
                                onChange={(e) => setFormData(p => ({ ...p, currentRenewalDate: e.target.value }))}
                                placeholder="e.g. 2026-09-01"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {isVisible('fromRegistry') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-from-registry">From Registry</label>
                            <input
                              id="ac-from-registry"
                              type="text"
                              name="fromRegistry"
                              value={formData.fromRegistry}
                              onChange={(e) => setFormData(p => ({ ...p, fromRegistry: e.target.value }))}
                              placeholder="e.g. G (UK CAA), N (FAA)"
                            />
                          </div>
                          {isVisible('toRegistry') && (
                            <div className="ac-field">
                              <label htmlFor="ac-to-registry">To Registry</label>
                              <input
                                id="ac-to-registry"
                                type="text"
                                name="toRegistry"
                                value={formData.toRegistry}
                                onChange={(e) => setFormData(p => ({ ...p, toRegistry: e.target.value }))}
                                placeholder="e.g. M (IoM), 2 (Guernsey)"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {isVisible('matterType') && (
                        <div className="ac-enquiry__row">
                          <div className="ac-field">
                            <label htmlFor="ac-matter-type">Matter Type</label>
                            <select
                              id="ac-matter-type"
                              name="matterType"
                              value={formData.matterType}
                              onChange={(e) => setFormData(p => ({ ...p, matterType: e.target.value }))}
                            >
                              <option value="">Select…</option>
                              <option value="purchase">Purchase / sale dispute</option>
                              <option value="maintenance">Maintenance dispute</option>
                              <option value="insurance">Insurance / loss</option>
                              <option value="accident">Accident / incident</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="ac-field">
                            <label htmlFor="ac-party">Instructing Party</label>
                            <select
                              id="ac-party"
                              name="party"
                              value={formData.party}
                              onChange={(e) => setFormData(p => ({ ...p, party: e.target.value }))}
                            >
                              <option value="">Select…</option>
                              <option value="claimant">Claimant</option>
                              <option value="defendant">Defendant</option>
                              <option value="single-joint">Single joint expert</option>
                              <option value="insurer">Insurer</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </>
                  )}
```

- [ ] **Step 5.3: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. For each of the 8 services, pick it from the dropdown and confirm the correct conditional fields appear:

| Service | Fields that should appear |
|---|---|
| Pre-Purchase Inspection | Aircraft Registration · Asking Price · Target Inspection Date |
| Acquisition Advisory | Budget Range · Timeline · Intended Use |
| Valuation & Appraisal | Aircraft Registration · Valuation Purpose |
| Aircraft Management | Aircraft Type · Ownership Status |
| Operating Cost & TCO | Aircraft Type · Expected Annual Hours |
| Insurance Advisory | Aircraft Type · Current Renewal Date |
| Import / Export & Register | Aircraft Type · From Registry · To Registry |
| Expert Witness & Litigation | Matter Type · Instructing Party |

Switch from PPI (with values typed in) to Acquisition Advisory — values should clear. Submit a test enquiry and confirm the payload contains only the always-visible fields plus the selected service's fields (open Network tab → POST `/api/leads`). Stop dev server.

- [ ] **Step 5.4: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): conditional form fields per service type"
```

---

## Task 6: Replace independencePoints (4 → 3) and adjust why-grid CSS

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:244-249` (data array)
- Modify: `src/pages/AircraftConsulting.jsx:1209-1213` (CSS — `.ac-why__grid` desktop)

- [ ] **Step 6.1: Replace the `independencePoints` data array**

Find lines 244-249:

```jsx
  const independencePoints = [
    { num: '01', title: 'Paid by You, Not the Seller', desc: "Our fee comes from the buyer, never the seller. No commission, no engineer-to-seller relationship to protect, no reason to close a deal that isn't right for you." },
    { num: '02', title: 'Factory-Trained Eyes', desc: "As an Authorised Robinson Service Centre, we know what a clean airframe looks like at 500, 1,000, and 2,000 hours. Deferred maintenance, botched repairs, and undisclosed damage rarely survive a proper inspection." },
    { num: '03', title: 'Logbook Forensics', desc: "Logbooks tell a story: sometimes the one the seller wants, sometimes the one the aircraft actually lived. Thirty-five years of reading them catches the inconsistencies, gaps, and red flags that inexperienced eyes miss." },
    { num: '04', title: 'A Clear Recommendation', desc: "Every report ends with one of three words: buy, negotiate, or walk. You will know exactly where you stand before you commit, not after the paperwork is signed." },
  ];
```

Replace with:

```jsx
  const independencePoints = [
    {
      num: '01',
      title: "What you can't see, we can",
      desc: "Every aircraft we look at — to buy, to manage, to value, or to defend — is read through a working hangar floor and 500+ transactions of memory. Photos, seller demos, broker write-ups, and OEM brochures don't catch what we catch. For Robinsons specifically, factory authorisation means we know the type at the level the people who built it do.",
    },
    {
      num: '02',
      title: 'What good actually looks like',
      desc: "Thirty-five years across the Robinson fleet means we know what 500-hour wear looks like, what 1,500-hour wear looks like, what's normal for a 2010 R44, and what's drifting. That context is what a first-time buyer or single-aircraft owner doesn't have — and what makes the difference between an opinion and an answer.",
    },
    {
      num: '03',
      title: 'A clear position, not a hedged one',
      desc: "Every engagement ends with something concrete — a number, a verdict, or a position you can act on. We get hired to make calls, not to write neutral surveys you have to interpret yourself. That's true of a pre-purchase report, a TCO model, a cover review, or an expert opinion in a dispute.",
    },
  ];
```

- [ ] **Step 6.2: Update the why-section intro paragraph for the new substance**

Find lines 453-459 (the intro paragraph above the cards):

```jsx
              <p className="ac-why__intro-body">
                Thirty-five years of Robinson experience and 500+ transactions sit behind every
                consultation, because getting a helicopter purchase wrong is a mistake that is
                hard to unwind. Our job is simple: give you an accurate, independent read before
                you commit. What the logbooks really say, what the airframe really needs, and
                what the aircraft is really worth.
              </p>
```

Replace with:

```jsx
              <p className="ac-why__intro-body">
                Thirty-five years of Robinson experience and 500+ transactions sit behind every
                engagement on the menu — buying, owning, valuing, defending. The job is the same
                each time: an accurate, independent read on the aircraft, the cost, the policy,
                or the dispute, written in a way you can act on.
              </p>
```

- [ ] **Step 6.3: Adjust the why-grid desktop layout for three cards**

Find lines 1209-1213:

```jsx
        .ac-why__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-top: 4rem;
        }
```

Replace with:

```jsx
        .ac-why__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 4rem;
        }
```

The existing `@media (max-width: 960px)` and `@media (max-width: 768px)` rules already collapse `.ac-why__grid` to `1fr` (lines 1656 and 1721) — no further change needed.

- [ ] **Step 6.4: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Scroll to the dark "Why It Matters" section. Confirm:
- 3 cards (not 4) — titles match the new copy
- Cards display 3-across on desktop (resize the window to ≥960px)
- Cards collapse to 1-across at narrow widths (resize to <960px)
- Section intro paragraph reflects the broader menu

Stop dev server.

- [ ] **Step 6.5: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): rewrite Why-It-Matters cards (4→3) + 3-col grid"
```

---

## Task 7: Replace processSteps (drop duration field + generalised copy)

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:229-235` (data array)
- Modify: `src/pages/AircraftConsulting.jsx:495-498` (render — remove duration span)

- [ ] **Step 7.1: Replace the `processSteps` data array**

Find lines 229-235:

```jsx
  const processSteps = [
    { num: '01', title: 'Brief', duration: '30 mins', description: "Tell us what you're looking at: aircraft registration, hours, price, and your goals. We'll confirm scope and provide a fixed fee upfront." },
    { num: '02', title: 'Research', duration: '1 day', description: "We review CAA records, check for applicable ADs or known issues on the type, and prepare our inspection checklist tailored to the specific aircraft and its history." },
    { num: '03', title: 'Inspection', duration: 'Half day', description: "Physical inspection at the aircraft's location covering airframe, engine, avionics, documents, and logbooks. Photography throughout." },
    { num: '04', title: 'Report', duration: '48 hours', description: 'Written report detailing every finding, condition assessment, estimated rectification costs for defects found, and our clear recommendation: buy, negotiate, or walk away.' },
    { num: '05', title: 'Support', duration: 'Ongoing', description: "Available to discuss the report and support any negotiation or decision-making that follows. We're on your side throughout." },
  ];
```

Replace with:

```jsx
  const processSteps = [
    {
      num: '01',
      title: 'Brief',
      description: "Tell us what you need. We confirm scope and whether we're the right firm.",
    },
    {
      num: '02',
      title: 'Scope & fee',
      description: "Written, upfront. What's in, what's out, what it costs. Fixed where possible; capped where not.",
    },
    {
      num: '03',
      title: 'Engagement',
      description: 'The work itself: an inspection, a market search, a model build, a documentation sequence, a written opinion.',
    },
    {
      num: '04',
      title: 'Deliverable',
      description: 'In writing. Report, valuation, TCO model, policy recommendation, expert opinion — with a clear position you can act on.',
    },
    {
      num: '05',
      title: 'Continued',
      description: 'Open line afterwards. Available to talk through findings, support negotiations, take the next call. For retainer clients, this is the relationship.',
    },
  ];
```

- [ ] **Step 7.2: Remove the duration render in the step JSX**

Find lines 495-498:

```jsx
                    <div className="ac-process__step-header">
                      <h4 className="ac-process__step-title">{step.title}</h4>
                      <span className="ac-process__step-duration">{step.duration}</span>
                    </div>
```

Replace with:

```jsx
                    <div className="ac-process__step-header">
                      <h4 className="ac-process__step-title">{step.title}</h4>
                    </div>
```

- [ ] **Step 7.3: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Scroll to "The Process" section. Confirm:
- 5 steps with new titles: Brief / Scope & fee / Engagement / Deliverable / Continued
- No duration label (no "30 mins", "48 hours", etc.) on any step
- Step descriptions read as service-agnostic

Stop dev server.

- [ ] **Step 7.4: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): generalise process steps + drop durations"
```

---

## Task 8: Replace services array (8 services in 3 groups + scope badges)

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:202-227` (data array)
- Modify: `src/pages/AircraftConsulting.jsx:407-440` (services section render)

- [ ] **Step 8.1: Replace the `services` data array**

Find lines 202-227 and replace with:

```jsx
  const services = [
    // GROUP: Buying a helicopter
    {
      num: '01',
      group: 'buying',
      title: 'Pre-Purchase Inspection',
      scope: 'Robinson only',
      chip: 'Most common',
      description: "A full airframe, engine, avionics, and logbook inspection of any Robinson helicopter under offer. Factory-authorised verdict in writing — buy, renegotiate, or walk — within 48 hours.",
      includes: [
        'Physical airframe inspection',
        'Engine and systems check',
        'Full logbook audit',
        'Written report with photography',
        'Rectification cost estimates',
        'Price-position guidance',
      ],
      enquiry: 'pre-purchase-inspection',
    },
    {
      num: '02',
      group: 'buying',
      title: 'Acquisition Advisory',
      scope: 'All helicopters',
      description: "We find the right aircraft, negotiate the deal, manage independent surveys, and run the paperwork through to delivery. A hands-off route to ownership for buyers who'd rather hire it done.",
      includes: [
        'Aircraft sourcing in the UK and abroad',
        'Seller and broker negotiation',
        'Independent survey management',
        'Import/export documentation',
        'Delivery coordination and handover',
        'First-year operating support',
      ],
      enquiry: 'acquisition-advisory',
    },
    {
      num: '03',
      group: 'buying',
      title: 'Valuation & Appraisal',
      scope: 'All helicopters · Robinson-deep',
      description: "An independent written value opinion for purchase, finance, insurance, tax, lease return, divorce, or estate purposes. Methodology you can hand to a banker, lender, lawyer, or insurer.",
      includes: [
        'Inspection-based or desk-based valuation',
        'Robinson type-specific market context',
        'Methodology and comparables',
        'Litigation-ready report formats',
        'Lender / insurer-acceptable templates',
        'Single-aircraft or fleet portfolio',
      ],
      enquiry: 'valuation',
    },
    // GROUP: Owning & operating
    {
      num: '04',
      group: 'owning',
      title: 'Aircraft Management',
      scope: 'All helicopters',
      chip: 'Retainer',
      description: "An ongoing relationship for owners who'd rather not run the aircraft themselves. We oversee maintenance, engineer relationships, scheduling, and keep the file in order so the aircraft stays serviceable and saleable.",
      includes: [
        'Maintenance scheduling oversight',
        'Engineer and operator coordination',
        'Records and documentation upkeep',
        'Hangarage, insurance, and currency tracking',
        'Quarterly cost reviews',
        'Single point of contact across the lifecycle',
      ],
      enquiry: 'aircraft-management',
    },
    {
      num: '05',
      group: 'owning',
      title: 'Operating Cost & TCO',
      scope: 'All helicopters',
      description: "A defensible total cost of ownership model for a specific aircraft, fleet, or use case. Numbers built from real maintenance bills and live insurance market — not OEM brochures.",
      includes: [
        'Type-specific fixed and variable costs',
        'One, five, and ten-year projections',
        'Maintenance reserves modelling',
        'Hours-flown sensitivity and break-even',
        'Financing scenario comparisons',
        'Cross-type comparison',
      ],
      enquiry: 'tco-modelling',
    },
    {
      num: '06',
      group: 'owning',
      title: 'Insurance Advisory',
      scope: 'All helicopters',
      description: "Independent review of hull and liability cover, broker introductions, and policy comparisons. We read the policy with the aircraft in mind — what's actually flown, where, and by whom — not just what's quoted.",
      includes: [
        'Cover review against operating reality',
        'Broker selection and introduction',
        'Policy and exclusion comparison',
        'Claims advocacy and support',
        'Renewal-cycle reviews',
        'Lessor and financier requirement alignment',
      ],
      enquiry: 'insurance-advisory',
    },
    {
      num: '07',
      group: 'owning',
      title: 'Import / Export & Register Transfer',
      scope: 'All helicopters',
      description: "Cross-border transactions and register transfers handled end-to-end — UK CAA, FAA, IoM, Guernsey — with the documentation, customs, and airworthiness pieces sequenced correctly.",
      includes: [
        'Import and export documentation',
        'Customs and duty handling',
        'De-registration and re-registration',
        'Airworthiness review handover',
        'Transit and ferry coordination',
        'VAT and tax sequencing in partnership',
      ],
      enquiry: 'import-export',
    },
    // GROUP: Independent expert work
    {
      num: '08',
      group: 'expert',
      title: 'Expert Witness & Litigation Support',
      scope: 'All helicopters · Robinson-deep',
      description: "Independent expert opinion for legal, insurance, and dispute matters. Written reports, expert determination, and court-acceptable testimony — drawn from 35 years on the hangar floor.",
      includes: [
        'Pre-action expert opinion',
        'Formal CPR Part 35 expert reports',
        'Insurance loss adjusting support',
        'Maintenance dispute resolution',
        'Sale dispute and warranty claims',
        'Single joint expert appointments',
      ],
      enquiry: 'expert-witness',
    },
  ];

  const SERVICE_GROUPS = [
    { id: 'buying',  label: 'Buying a helicopter' },
    { id: 'owning',  label: 'Owning & operating' },
    { id: 'expert',  label: 'Independent expert work' },
  ];
```

- [ ] **Step 8.2: Replace the services-section render to group cards by `group`**

Find lines 416-438 (the `<div className="ac-services__grid">` block):

```jsx
          <div className="ac-services__grid">
            {services.map((service, i) => (
              <Reveal key={service.num} delay={i * 0.1}>
                <div className="ac-service-card">
                  <div className="ac-service-card__top">
                    <span className="ac-service-card__tag">{service.tag}</span>
                    <span className="ac-service-card__num">{service.num}</span>
                  </div>
                  <h3 className="ac-service-card__title">{service.title}</h3>
                  <p className="ac-service-card__desc">{service.description}</p>
                  <p className="ac-service-card__includes-label">What's included</p>
                  <ul className="ac-service-card__includes">
                    {service.includes.map((item) => (
                      <li key={item} className="ac-service-card__include-item">
                        <span className="ac-service-card__check">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
```

Replace with:

```jsx
          {SERVICE_GROUPS.map((group) => {
            const groupServices = services.filter(s => s.group === group.id);
            return (
              <div key={group.id} className="ac-services__group">
                <Reveal>
                  <h3 className="ac-services__group-title">{group.label}</h3>
                </Reveal>
                <div className="ac-services__grid">
                  {groupServices.map((service, i) => (
                    <Reveal key={service.num} delay={i * 0.1}>
                      <div className="ac-service-card">
                        <div className="ac-service-card__top">
                          <span className="ac-service-card__tag">{service.scope}</span>
                          <span className="ac-service-card__num">{service.num}</span>
                        </div>
                        {service.chip && (
                          <span className="ac-service-card__chip">{service.chip}</span>
                        )}
                        <h3 className="ac-service-card__title">{service.title}</h3>
                        <p className="ac-service-card__desc">{service.description}</p>
                        <p className="ac-service-card__includes-label">What's included</p>
                        <ul className="ac-service-card__includes">
                          {service.includes.map((item) => (
                            <li key={item} className="ac-service-card__include-item">
                              <span className="ac-service-card__check">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
```

- [ ] **Step 8.3: Add minimal styles for the new group title and chip**

Find the services-section styles in the `<style>{`...`}</style>` block (locate by searching for `.ac-services__grid {` — around line 980-1070). Just before the existing `.ac-services__grid` rule, add:

```css
        .ac-services__group {
          margin-top: 3.5rem;
        }
        .ac-services__group:first-of-type {
          margin-top: 2.5rem;
        }
        .ac-services__group-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eeecea;
        }
        .ac-service-card__chip {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6b6b6b;
          background: #f1efeb;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          margin-bottom: 0.75rem;
        }
```

- [ ] **Step 8.4: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Scroll to "Consulting Services". Confirm:
- 3 group headings render in order: Buying a helicopter / Owning & operating / Independent expert work
- 8 cards total, distributed 3 / 4 / 1 across groups
- Each card shows the scope badge ("Robinson only" / "All helicopters" / "All helicopters · Robinson-deep") instead of the old tag
- "Most common" chip appears on Pre-Purchase Inspection card; "Retainer" chip on Aircraft Management card; no chip on the others
- Card titles match the spec
- "What's included" bullets render

Stop dev server.

- [ ] **Step 8.5: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): 8 services in 3 groups with scope-badge taxonomy"
```

---

## Task 9: Wire service-card "Enquire" CTA to scroll + pre-fill serviceType

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx` — service-card render (modified in Task 8) and enquiry section

The current service card has no CTA. Add an "Enquire" button that scrolls to the form and pre-fills `serviceType` with the card's `enquiry` slug. The form's existing `serviceType` change-handler (Task 4) automatically clears stale fields.

- [ ] **Step 9.1: Add an `id` to the enquiry section so anchors work**

Find line 536:

```jsx
      <section className="ac-enquiry">
```

Replace with:

```jsx
      <section className="ac-enquiry" id="ac-enquiry">
```

- [ ] **Step 9.2: Add a click-handler in the component body**

Inside the `AircraftConsulting` function component, just below `handleServiceTypeChange` (added in Task 4 around line 198), add:

```jsx
  function handleServiceCtaClick(enquirySlug) {
    setFormData(p => ({
      ...clearConditionalFields(p),
      serviceType: enquirySlug,
    }));
    requestAnimationFrame(() => {
      document.getElementById('ac-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
```

- [ ] **Step 9.3: Add the CTA button inside each service card**

Find the service-card block from Task 8 (the inner `<div className="ac-service-card">`). Just before the closing `</div>` of the card, add:

```jsx
                        <button
                          type="button"
                          className="ac-service-card__cta"
                          onClick={() => handleServiceCtaClick(service.enquiry)}
                        >
                          Enquire about this →
                        </button>
```

So the card now ends:

```jsx
                        ...
                        <ul className="ac-service-card__includes">
                          {/* ... */}
                        </ul>
                        <button
                          type="button"
                          className="ac-service-card__cta"
                          onClick={() => handleServiceCtaClick(service.enquiry)}
                        >
                          Enquire about this →
                        </button>
                      </div>
                    </Reveal>
```

- [ ] **Step 9.4: Add minimal styles for the CTA button**

In the same `<style>` block (near where Task 8.3 styles were added — search for `.ac-service-card__chip`), add:

```css
        .ac-service-card__cta {
          margin-top: 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #1a1a1a;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          transition: opacity 0.2s ease;
          align-self: flex-start;
        }
        .ac-service-card__cta:hover {
          opacity: 0.7;
        }
```

- [ ] **Step 9.5: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Click the "Enquire about this →" button on the Valuation & Appraisal card. Confirm:
- Page smooth-scrolls to the enquiry form
- The Service Type dropdown is set to "Valuation & Appraisal"
- The conditional fields for Valuation appear (Aircraft Registration · Valuation Purpose)

Repeat for Pre-Purchase Inspection and Expert Witness — confirm the pre-fill matches.

Stop dev server.

- [ ] **Step 9.6: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): service-card CTA pre-fills form serviceType"
```

---

## Task 10: Update credentials copy

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:237-242` (credentials data array)

- [ ] **Step 10.1: Replace the `credentials` array**

Find lines 237-242 and replace with:

```jsx
  const credentials = [
    {
      title: 'Robinson Authorised Service Centre',
      desc: "Factory-authorised on every Robinson type — the qualification that backs the inspection, the valuation, the expert opinion, and every Robinson recommendation HQ writes.",
    },
    {
      title: 'CAA Part 145 Approved',
      desc: 'Approved Maintenance Organisation. Airworthiness standards in operational detail, not theory.',
    },
    {
      title: '35 Years of Robinson Experience',
      desc: 'More Robinson hours, more Robinson logbooks, and more Robinson problems solved than almost any organisation in Europe.',
    },
    {
      title: '500+ Transactions Supported',
      desc: 'Acquisitions, ownership transitions, valuations, and disputes — a track record across the helicopter ownership lifecycle, not just at the point of sale.',
    },
  ];
```

- [ ] **Step 10.2: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Scroll to "Why Trust HQ". Confirm the four credential bars render with the new copy. Stop dev server.

- [ ] **Step 10.3: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): broaden credentials copy beyond PPI framing"
```

---

## Task 11: Update hero copy (label, headline words, sub)

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:285, 295, 303, 340-342`

- [ ] **Step 11.1: Update the eyebrow label**

Find line 285:

```jsx
              Advisory Services
```

Replace with:

```jsx
              For buyers, owners, and disputes
```

- [ ] **Step 11.2: Update the two animated headline words**

The existing `.ac-hero__word` CSS uses `font-size: clamp(3.2rem, 8vw, 5.5rem)` — sized for short single words. Multi-word phrases would overflow. Keep single-word treatment.

Find at line 295:

```jsx
                AIRCRAFT
```

Replace with:

```jsx
                HELICOPTER
```

Line 303 (`CONSULTING`) is already correct — leave unchanged.

- [ ] **Step 11.3: Update the sub paragraph (carries the full tagline + breadth)**

Find lines 340-342:

```jsx
              Pre-purchase inspections, ownership advice, fleet planning, and bespoke acquisition
              services, grounded in thirty-five years of Robinson expertise and 500+ transactions
              across Europe.
```

Replace with:

```jsx
              Robinson specialists. Independent advice across the helicopter ownership lifecycle —
              from short-list to settlement, and through the disputes and decisions in between.
              Grounded in 35 years and 500+ transactions.
```

- [ ] **Step 11.4: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Confirm:
- Eyebrow reads "For buyers, owners, and disputes"
- Hero headline reveals as "HELICOPTER" then "CONSULTING" (single-word treatment preserved)
- Sub paragraph leads with "Robinson specialists." and reflects the broader menu

Note: there is a `data-cms-section="ac-hero"` on the hero — if any CMS override exists for this section in production, the JSX defaults won't take effect. This is flagged in the spec's "Risks & open questions"; check the admin CMS post-deploy.

Stop dev server.

- [ ] **Step 11.5: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): hero copy reframes from PPI to consulting menu"
```

---

## Task 12: Update intro section copy

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:357-368`

Heading "Independent. Thorough. Honest." stays. Body paragraphs broaden from PPI emphasis to lifecycle emphasis.

- [ ] **Step 12.1: Replace both intro body paragraphs**

Find lines 357-368:

```jsx
              <p className="ac-intro__body">
                Most people buy their first helicopter once. The margin for error (wrong type,
                wrong configuration, undisclosed history) is narrow, and the consequences last
                years. HQ Aviation's consulting service exists to close that margin before you
                commit.
              </p>
              <p className="ac-intro__body">
                From a single pre-purchase inspection to full acquisition management, our work
                draws on the same hangar floor, logbook library, and maintenance experience that
                supports owners across Europe, brought to bear on your aircraft, your budget,
                and your plan.
              </p>
```

Replace with:

```jsx
              <p className="ac-intro__body">
                Buyers shortlisting their first helicopter. Owners running one or several. Lawyers,
                insurers, and lenders who need an independent expert on a matter where opinions
                cost real money. HQ Aviation consults across the helicopter ownership lifecycle —
                with Robinson factory authorisation backing the work where type-specific depth
                changes the answer.
              </p>
              <p className="ac-intro__body">
                The same hangar floor, logbook library, and maintenance experience that informs
                every Robinson service-centre engagement is what backs every consulting opinion
                we write — for any helicopter, not just the ones we are authorised to certify.
                Brought to bear on your aircraft, your budget, your policy, your plan, or your
                dispute.
              </p>
```

- [ ] **Step 12.2: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Scroll to the intro section. Confirm:
- Heading "Independent. Thorough. Honest." unchanged
- Both paragraphs render the new copy
- Stats strip (500+, 35+, Factory) unchanged

Stop dev server.

- [ ] **Step 12.3: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): intro copy spans the full consulting menu"
```

---

## Task 13: Update CTA copy

**Files:**
- Modify: `src/pages/AircraftConsulting.jsx:732-738`

- [ ] **Step 13.1: Replace eyebrow, heading, and body**

Find lines 732-738:

```jsx
            <span className="ac-pre-text ac-pre-text--light">Thinking of Buying?</span>
            <h2 className="ac-cta__heading">Talk to an Expert First</h2>
            <p className="ac-cta__body">
              An hour with us before you commit is the cheapest insurance on a helicopter
              purchase. No obligation, no sales pitch, just an honest read on whatever you are
              considering.
            </p>
```

Replace with:

```jsx
            <span className="ac-pre-text ac-pre-text--light">No matter what you're working on</span>
            <h2 className="ac-cta__heading">Tell us what you're working on.</h2>
            <p className="ac-cta__body">
              Whether it's a shortlist, a renewal, a model in spreadsheet form, a paper trail, or
              a dispute on the desk — an hour with us is the cheapest read you'll get. No
              obligation, no sales pitch, just an honest opinion you can act on.
            </p>
```

- [ ] **Step 13.2: Manual verification**

```
npm run dev:vite
```

Open `/aircraft-consulting`. Scroll to the CTA at the bottom. Confirm the new eyebrow, heading, and body. Stop dev server.

- [ ] **Step 13.3: Commit**

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "feat(aircraft-consulting): service-agnostic CTA copy"
```

---

## Task 14: Browser smoke test (manual feature verification)

**Files:**
- None (verification only)

End-to-end manual verification across the whole page. This is the final gate — all sections must render correctly together and the form must submit a structured payload.

- [ ] **Step 14.1: Run the dev server and run unit tests**

```
npm test -- aircraftConsultingForm
npm run dev:vite
```

Expected: helper tests PASS, dev server starts on `http://localhost:5173`.

- [ ] **Step 14.2: Walk through every section in order**

Open `http://localhost:5173/aircraft-consulting`. For each section, verify:

| Section | Check |
|---|---|
| Hero | Eyebrow, two animated words, badge stats, sub paragraph all match Task 11 |
| Intro | Heading "Independent. Thorough. Honest." + 2 paragraphs from Task 12 |
| Services | 3 group titles · 8 cards (3/4/1) · scope badges · chips on PPI + Aircraft Management · "Enquire" CTA on every card |
| Why It Matters | 3-card dark grid, new copy from Task 6, intro paragraph reflects broader menu |
| Process | 5 generic steps with no durations |
| Credentials | 4 bars with Task 10 copy |
| Enquiry form | serviceType dropdown has 8 services + "Something else" |
| FAQ | Existing CMS-driven FAQ — content out of scope, just confirm it renders |
| CTA | New eyebrow / heading / body from Task 13 |

- [ ] **Step 14.3: Test the form's conditional-field branching**

Switch through all 8 services in the dropdown. For each, confirm the correct conditional fields appear (per Task 5.3 table). Type values into one service's fields, switch to another service, switch back — values should be cleared.

- [ ] **Step 14.4: Test service-card pre-fill**

Click "Enquire about this →" on three different cards (e.g., Acquisition Advisory, TCO, Expert Witness). For each:
- Page smooth-scrolls to the form
- Service Type dropdown is pre-selected to the right value
- The matching conditional fields are visible

- [ ] **Step 14.5: Test form submission payload**

With a service selected and a couple of conditional fields filled, open the browser DevTools Network panel and submit the form. Inspect the POST to `/api/leads`:
- `serviceType` is the slug (e.g. `"valuation"`)
- The selected service's conditional field values are present
- Other services' conditional fields are present in the payload as empty strings (acceptable — backend already accepts these as optional)
- `subject` is `"Aircraft Consulting Enquiry"`, `source` is `"aircraft-consulting-page"`

- [ ] **Step 14.6: Test responsive breakpoints**

Resize the browser at 1440px / 960px / 768px / 480px:
- Services grid collapses correctly
- Why-It-Matters grid collapses to 1 column at <960px
- Form rows stack at <768px
- All sections remain readable

- [ ] **Step 14.7: Stop dev server and run final test pass**

```
npm test -- aircraftConsultingForm
```

Expected: all helper tests pass.

- [ ] **Step 14.8: Final commit (only if any minor adjustments came up during smoke test)**

If smoke test surfaced issues, fix them and commit:

```bash
git add src/pages/AircraftConsulting.jsx
git commit -m "fix(aircraft-consulting): smoke-test adjustments"
```

If no issues, no commit needed.

---

## Out of scope (do NOT do as part of this plan)

- Authoring FAQ entries — owned by content via the CMS (`data-cms-section="faqs-aircraft-consulting"`)
- Hero photograph swap
- Animation / Framer Motion timing changes
- New components or `ac-*` token system changes
- Per-service deep-link routes (`/aircraft-consulting/<service>`)
- CMS admin updates for `data-cms-section="ac-hero"` or `data-cms-section="ac-intro"` overrides — flagged in the spec as a deploy-time concern

## Self-review notes

**Spec coverage** — every section and requirement from the spec maps to a task:

| Spec section | Implementing task(s) |
|---|---|
| Section 1 — Hero | Task 11 |
| Section 2 — Intro | Task 12 |
| Section 3 — Services (8 cards in 3 groups + scope badges) | Tasks 8, 9 |
| Section 4 — Why It Matters (4 → 3 + grid CSS) | Task 6 |
| Section 5 — Process (drop durations, generalise) | Task 7 |
| Section 6 — Credentials | Task 10 |
| Section 7 — Enquiry form (8 services, conditional fields, clear-on-change) | Tasks 1, 2, 3, 4, 5, 9 |
| Section 8 — FAQ categories | Out of scope (CMS-owned, flagged) |
| Section 9 — CTA | Task 13 |

**Type consistency** — `enquiry` slug on each service card (Task 8) matches `slug` in `SERVICE_TYPES` (Task 1) matches the `value` of each `<option>` in the form select (Task 3) matches the keys of `SERVICE_FIELD_MAP` (Task 1). Pre-fill (Task 9) and conditional-field render (Task 5) both flow off the same slug.
