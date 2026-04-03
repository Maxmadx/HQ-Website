# Sales Attribution System

## Overview

The HQ Aviation admin dashboard includes a comprehensive sales attribution system for tracking who contributed to each aircraft sale. This allows for accurate commission tracking, performance metrics, and weighted sales reporting.

---

## Core Concepts

### Attribution Types

Three preset attribution configurations:

| Type | Description | Default Split |
|------|-------------|---------------|
| **New Client** | Salesperson sourced a brand new buyer | 100% to salesperson |
| **Existing Client** | Repeat business from existing relationship | 30% salesperson / 70% HQ Aviation |
| **Custom Split** | Flexible split between multiple contributors | User-defined percentages |

### Attribution Structure

Each sale can have multiple attribution entries:

```javascript
saleAttribution: [
  { name: "Alex", percentage: 60 },
  { name: "HQ Aviation", percentage: 40 }
]
```

**Rules:**
- Percentages must total exactly 100%
- Each attribution must have a name and percentage > 0
- Zero-percentage entries are filtered out on save
- "HQ Aviation" is a special company-level attribution

---

## Data Model

### Helicopter Document (when sold)

```javascript
{
  status: 'sold',
  soldAt: Timestamp,
  salePrice: number,

  // Attribution data
  attributionType: 'new_client' | 'existing_client' | 'custom',
  saleAttribution: [
    { name: string, percentage: number }
  ],

  // Optional buyer info
  buyerName: string | null,
  buyerContactId: string | null,  // Link to contacts collection
  buyerContact: {                 // Denormalized
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    company: string | null
  },

  saleNotes: string | null
}
```

### Activity Log Entry (for sale)

```javascript
{
  type: 'sale',
  timestamp: ISO string,
  userId: string,
  userName: string,
  details: {
    price: number,
    buyerName: string | null,
    buyerContactId: string | null,
    attributionType: string,
    attributions: [{ name, percentage }],
    notes: string | null
  }
}
```

---

## UI Components

### Mark as Sold Modal

Located in: `src/pages/listings/ListingEdit.jsx`

**Features:**
- Sale price input (defaults to listing price)
- Buyer selection (from contacts or manual entry)
- Attribution type selector (3 visual presets)
- Dynamic attribution entries with:
  - Team member dropdown (from users collection)
  - Percentage input (number field)
  - Percentage slider (range 0-100, step 5)
  - Remove button (for custom splits)
- Add Person button (custom splits only)
- Total percentage indicator with validation
- Auto-balance button (adjusts last entry to reach 100%)
- Sale preview showing each person's attributed value

### Dashboard Attribution Display

Located in: `src/pages/Dashboard.jsx`

**Features:**
- Sales by Team Member card
- Shows weighted "equivalent sales" (fractional counts)
- Displays total deals involved in
- Value shows percentage-weighted amount
- HQ Aviation gets special company styling (dark avatar)
- Horizontal scrollable list with avatars

---

## Commission Settings

Located in: `src/hooks/useCommissionSettings.js`

**Settings:**
```javascript
{
  defaultPercentage: 5,        // Typical for helicopters (2-5%)
  minimumCommission: 0,        // Optional minimum
  currency: 'USD',
  enableBrokerSplit: false,    // Co-brokerage tracking
  defaultSplitPercentage: 50,  // Default co-broker split
  tiers: []                    // Optional tiered commission structure
}
```

**Commission Types:**
- Fixed amount
- Percentage-based
- Tiered (based on sale price ranges)

---

## Calculations

### Weighted Sales Count

```javascript
// Example: 60% of a sale = 0.6 equivalent sales
person.count += percentage / 100;
```

### Attributed Value

```javascript
// Example: 60% of $1,000,000 = $600,000 attributed
attributedValue = salePrice * (percentage / 100);
```

### Dashboard Aggregation

```javascript
soldListings.forEach(listing => {
  listing.saleAttribution.forEach(attr => {
    // Add to person's totals
    byPerson[name].count += attr.percentage / 100;      // Equivalent sales
    byPerson[name].value += salePrice * (attr.percentage / 100);  // Weighted value
    byPerson[name].salesCount += 1;  // Raw deal count
  });
});
```

---

## Validation Rules

1. **Total Percentage Must Equal 100%**
   - Validation: `Math.abs(total - 100) <= 0.1`
   - Error message: "Attribution percentages must total 100%"

2. **All Attributions Must Have Names**
   - Check: `attributions.filter(a => !a.name.trim() && a.percentage > 0)`
   - Error message: "Please assign a name to all attributions"

3. **At Least One Attribution Required**
   - Minimum array length: 1
   - Remove button disabled when only 1 entry remains

---

## Files Involved

| File | Purpose |
|------|---------|
| `src/pages/listings/ListingEdit.jsx` | Mark as Sold modal with attribution UI |
| `src/pages/Dashboard.jsx` | Sales by team member display |
| `src/hooks/useCommissionSettings.js` | Commission calculation utilities |
| `src/hooks/useHelicopterActivity.js` | Activity logging including sale events |
| `src/components/listings/HelicopterActivityLog.jsx` | Activity timeline display |
| `src/styles/globals.css` | Attribution UI styling |

---

## CSS Classes

```css
/* Attribution Section */
.attribution-section
.attribution-header
.attribution-hint
.attribution-type-selector
.attribution-type-btn
.attribution-type-btn.active
.attribution-entries
.attribution-entry
.attribution-entry-main
.attribution-name-select
.attribution-percentage-wrapper
.attribution-percentage-input
.attribution-slider-wrapper
.attribution-slider
.attribution-remove-btn
.attribution-add-btn
.attribution-total
.attribution-total.valid
.attribution-total.invalid
.auto-balance-btn
.attribution-preview
.attribution-preview-item

/* Dashboard Attribution Display */
.attribution-list
.attribution-list-horizontal
.attribution-item
.attribution-avatar
.attribution-avatar.avatar-company
.attribution-info
.attribution-name
.attribution-stats
.attribution-value
```

---

## Future Enhancements

Potential improvements to consider:

1. **Historical Attribution Editing**
   - Allow editing attribution after sale is recorded
   - Audit trail for changes

2. **Commission Payout Tracking**
   - Track when commissions are paid out
   - Link to accounting/invoicing

3. **Team Goals & Targets**
   - Set sales targets per team member
   - Progress visualization

4. **Attribution Templates**
   - Save custom split configurations
   - Quick-apply common patterns

5. **Reporting & Export**
   - Commission reports by period
   - CSV/PDF export for accounting

6. **Multi-Currency Support**
   - Handle international sales
   - Currency conversion

---

## Related Features

- **Contacts CRM**: Buyer linking for relationship tracking
- **Activity Log**: Complete audit trail of sales events
- **Registration History**: Ownership transfer records
- **Helicopter Lifecycle**: Post-sale tracking for owned aircraft
