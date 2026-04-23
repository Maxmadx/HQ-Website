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
  AREA_SERVED,
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
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name })),
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

export function buildProduct({ name, description, image, brand = 'Robinson Helicopters', url, offers }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: absoluteUrl(image),
    brand: { '@type': 'Brand', name: brand },
    url: absoluteUrl(url),
    offers: offers || {
      '@type': 'Offer',
      url: absoluteUrl(url),
      availability: 'https://schema.org/InStock',
      priceCurrency: 'GBP',
      priceSpecification: { '@type': 'PriceSpecification', price: 'POA' },
    },
  };
}

export function buildArticle({ headline, description, image, datePublished, dateModified, authorName, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image ? absoluteUrl(image) : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Person', name: authorName || ORG_NAME },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(url) },
  };
}

export function buildFAQPage(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
