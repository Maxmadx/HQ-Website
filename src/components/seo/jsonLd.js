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
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: absoluteUrl(image),
    brand: { '@type': 'Brand', name: brand },
    url: absoluteUrl(url),
  };
  if (offers) {
    product.offers = offers;
  }
  return product;
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

export function buildCourse({ name, description, provider = ORG_NAME, url, courseInstance, offers }) {
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: SITE_URL,
    },
    url: absoluteUrl(url),
  };
  if (courseInstance) {
    course.hasCourseInstance = courseInstance;
  }
  if (offers) {
    course.offers = offers;
  }
  return course;
}

export function buildService({ name, serviceType, description, url, areaServed = 'United Kingdom', provider = ORG_NAME }) {
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: SITE_URL,
    },
    url: absoluteUrl(url),
    areaServed,
  };
  if (serviceType) {
    service.serviceType = serviceType;
  }
  return service;
}

export function buildItemList({ name, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

export function buildTouristTrip({ name, description, image, url, offers }) {
  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    image: absoluteUrl(image),
    url,
  };
  if (offers) {
    trip.offers = {
      '@type': 'Offer',
      ...offers,
    };
  }
  return trip;
}
