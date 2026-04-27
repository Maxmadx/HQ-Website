// Single source of truth for HQ Aviation contact details.
// Update here, not in components.

export const SALES_EMAIL = 'sales@hqaviation.com';
export const OPERATIONS_EMAIL = 'operations@hqaviation.com';
export const MAINTENANCE_EMAIL = 'maintenance@hqaviation.com';

export const SALES_PHONE = '+44 1895 833373';
export const OPERATIONS_PHONE = '+44 1895 833373';
export const MAINTENANCE_PHONE = '+44 1895 832833';

export const SALES_PHONE_TEL = '+441895833373';
export const OPERATIONS_PHONE_TEL = '+441895833373';
export const MAINTENANCE_PHONE_TEL = '+441895832833';

export const ADDRESS_LINE = 'Denham Aerodrome, Uxbridge, London, UB9 5DF';
export const ADDRESS_PARTS = {
  street: 'Denham Aerodrome',
  locality: 'Uxbridge',
  region: 'London',
  postalCode: 'UB9 5DF',
  country: 'United Kingdom',
};

export const CONTACTS = {
  sales: { email: SALES_EMAIL, phone: SALES_PHONE, tel: SALES_PHONE_TEL },
  operations: { email: OPERATIONS_EMAIL, phone: OPERATIONS_PHONE, tel: OPERATIONS_PHONE_TEL },
  maintenance: { email: MAINTENANCE_EMAIL, phone: MAINTENANCE_PHONE, tel: MAINTENANCE_PHONE_TEL },
};
