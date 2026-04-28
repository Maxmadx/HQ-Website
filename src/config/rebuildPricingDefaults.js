/**
 * Source-of-truth defaults for rebuild pricing.
 *
 * Both AdminPricing (for default rows + seeding) and useRebuildPricing
 * (for fallback when no Firestore override exists) read from this list.
 *
 * Values are whole GBP pounds. Conversion to pence happens at the
 * Firestore boundary (×100 on write, ÷100 on read).
 *
 * Doc IDs follow `rebuild_{modelKey}_{field}`. Add a new entry here AND
 * add its id to GBP_WEBSITE_IDS in AdminPricing.jsx if you add a model.
 */
export const REBUILD_PRICING_DEFAULTS = [
  { id: 'rebuild_r22_from',      modelKey: 'r22', field: 'from',     label: 'R22 Beta II — Rebuild From',  defaultGbp:  55000 },
  { id: 'rebuild_r22_donor_min', modelKey: 'r22', field: 'donorMin', label: 'R22 Beta II — Donor Min',     defaultGbp:  80000 },
  { id: 'rebuild_r22_donor_max', modelKey: 'r22', field: 'donorMax', label: 'R22 Beta II — Donor Max',     defaultGbp: 120000 },
  { id: 'rebuild_r44_from',      modelKey: 'r44', field: 'from',     label: 'R44 Raven II — Rebuild From', defaultGbp:  85000 },
  { id: 'rebuild_r44_donor_min', modelKey: 'r44', field: 'donorMin', label: 'R44 Raven II — Donor Min',    defaultGbp: 120000 },
  { id: 'rebuild_r44_donor_max', modelKey: 'r44', field: 'donorMax', label: 'R44 Raven II — Donor Max',    defaultGbp: 200000 },
  { id: 'rebuild_r66_from',      modelKey: 'r66', field: 'from',     label: 'R66 Turbine — Rebuild From',  defaultGbp: 150000 },
  { id: 'rebuild_r66_donor_min', modelKey: 'r66', field: 'donorMin', label: 'R66 Turbine — Donor Min',     defaultGbp: 350000 },
  { id: 'rebuild_r66_donor_max', modelKey: 'r66', field: 'donorMax', label: 'R66 Turbine — Donor Max',     defaultGbp: 550000 },
];
