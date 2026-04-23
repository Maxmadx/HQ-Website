// src/lib/seoDefaults.js

export const SITE_URL = 'https://hqaviation.com';
export const ORG_NAME = 'HQ Aviation';
export const ORG_LEGAL_NAME = 'HQ Aviation Ltd';
export const ORG_DESCRIPTION =
  "UK's premier Robinson Helicopter dealer offering flight training, aircraft sales, maintenance services and worldwide expeditions. Based at Denham Aerodrome, London.";
export const ORG_LOGO_PATH = '/assets/images/logos/hq/hq-aviation-logo-black.png';
export const DEFAULT_OG_IMAGE = '/og-default.png';
export const TWITTER_HANDLE = ''; // none yet
export const DEFAULT_LANG = 'en-GB';
export const DEFAULT_LOCALE = 'en_GB';

// Primary contact (Operations). Use these for org-level PHONE/EMAIL fields.
export const PHONE = '+44-1895-833373';
export const EMAIL = 'Operations@HQAviation.com';

// Full set of contact channels — used by the richer LocalBusiness schema on /contact (Task 19).
export const CONTACT_POINTS = [
  {
    contactType: 'customer service',
    telephone: '+44-1895-833373',
    email: 'Operations@HQAviation.com',
    areaServed: 'GB',
    availableLanguage: ['English'],
  },
  {
    contactType: 'technical support',
    telephone: '+44-1895-832833',
    email: 'Maintenance@HQAviation.com',
    areaServed: 'GB',
    availableLanguage: ['English'],
  },
];

export const ADDRESS = {
  streetAddress: 'Denham Aerodrome',
  addressLocality: 'Denham',
  addressRegion: 'Buckinghamshire',
  postalCode: 'UB9 5DF',
  addressCountry: 'GB',
};

export const GEO = {
  latitude: 51.59181,
  longitude: -0.51181,
};

// Schema.org openingHours format: 'Mo-Su' = Mon through Sun.
export const OPENING_HOURS = ['Mo-Su 08:30-17:00'];

export const SAME_AS = [
  'https://www.instagram.com/hqaviation',
  'https://www.youtube.com/@HQAviationLtd',
  'https://www.facebook.com/HQAviationLtd/',
];

export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}
