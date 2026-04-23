import {
  SITE_URL,
  ORG_NAME,
  ORG_LEGAL_NAME,
  ORG_DESCRIPTION,
  ORG_LOGO_PATH,
  PHONE,
  EMAIL,
  ADDRESS,
  GEO,
  OPENING_HOURS,
  SAME_AS,
  absoluteUrl,
} from '../../lib/seoDefaults';

export function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    description: ORG_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl(ORG_LOGO_PATH),
    telephone: PHONE,
    email: EMAIL,
    sameAs: SAME_AS,
  };
}

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-GB',
  };
}

export function buildLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: absoluteUrl(ORG_LOGO_PATH),
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.streetAddress,
      addressLocality: ADDRESS.addressLocality,
      addressRegion: ADDRESS.addressRegion,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    openingHours: OPENING_HOURS,
    priceRange: '£££',
  };
}

export function buildBreadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
