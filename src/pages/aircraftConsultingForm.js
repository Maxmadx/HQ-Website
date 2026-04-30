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
