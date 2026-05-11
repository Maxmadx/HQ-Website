import { describe, it, expect } from 'vitest';
import {
  buildOrganization,
  buildWebSite,
  buildLocalBusiness,
  buildBreadcrumbList,
  buildProduct,
  buildArticle,
  buildFAQPage,
  buildCourse,
  buildService,
  buildItemList,
  buildTouristTrip,
} from './jsonLd';

describe('buildOrganization', () => {
  it('returns Organization with required fields', () => {
    const org = buildOrganization();
    expect(org['@context']).toBe('https://schema.org');
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('HQ Aviation');
    expect(org.url).toBe('https://hqaviation.com');
    expect(org.logo).toMatch(/^https:\/\/hqaviation.com/);
  });
});

describe('buildWebSite', () => {
  it('returns WebSite with SearchAction', () => {
    const site = buildWebSite();
    expect(site['@type']).toBe('WebSite');
    expect(site.url).toBe('https://hqaviation.com');
    expect(site.potentialAction['@type']).toBe('SearchAction');
    expect(site.potentialAction.target).toContain('{search_term_string}');
  });

  it('publisher @id references the Organization @id', () => {
    expect(buildWebSite().publisher['@id']).toBe(buildOrganization()['@id']);
  });
});

describe('buildLocalBusiness', () => {
  it('returns LocalBusiness with address and geo', () => {
    const lb = buildLocalBusiness();
    expect(lb['@type']).toBe('LocalBusiness');
    expect(lb.address['@type']).toBe('PostalAddress');
    expect(lb.address.addressLocality).toBe('Denham');
    expect(lb.geo.latitude).toBeCloseTo(51.59181);
    expect(
      Array.isArray(lb.openingHoursSpecification) ||
      typeof lb.openingHours === 'string' ||
      Array.isArray(lb.openingHours)
    ).toBe(true);
  });

  it('declares areaServed including London and surrounding counties', () => {
    const lb = buildLocalBusiness();
    expect(Array.isArray(lb.areaServed)).toBe(true);
    const names = lb.areaServed.map((a) => a.name);
    expect(names).toContain('London');
    expect(names).toContain('Buckinghamshire');
    expect(names).toContain('Hertfordshire');
    expect(names).not.toContain('Greater London');
  });
});

describe('buildBreadcrumbList', () => {
  it('returns ordered list of BreadcrumbItems', () => {
    const bc = buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Aircraft', path: '/aircraft' },
      { name: 'R66', path: '/aircraft/r66' },
    ]);
    expect(bc['@type']).toBe('BreadcrumbList');
    expect(bc.itemListElement).toHaveLength(3);
    expect(bc.itemListElement[0].position).toBe(1);
    expect(bc.itemListElement[2].item).toBe('https://hqaviation.com/aircraft/r66');
  });
});

describe('buildProduct', () => {
  it('returns Product schema with no offers when none provided', () => {
    const p = buildProduct({
      name: 'Robinson R66',
      description: 'Five-seat turbine',
      image: '/img/r66.jpg',
      brand: 'Robinson Helicopters',
      url: '/aircraft/r66',
    });
    expect(p['@type']).toBe('Product');
    expect(p.name).toBe('Robinson R66');
    expect(p.image).toBe('https://hqaviation.com/img/r66.jpg');
    expect(p.brand['@type']).toBe('Brand');
    expect(p.brand.name).toBe('Robinson Helicopters');
    expect(p.offers).toBeUndefined();
  });

  it('includes offers when provided', () => {
    const p = buildProduct({
      name: 'Robinson R66',
      description: 'Five-seat turbine',
      image: '/img/r66.jpg',
      url: '/aircraft/r66',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: 1456000,
        highPrice: 1563500,
        priceCurrency: 'GBP',
      },
    });
    expect(p.offers['@type']).toBe('AggregateOffer');
    expect(p.offers.priceCurrency).toBe('GBP');
  });
});

describe('buildArticle', () => {
  it('returns Article schema with required fields', () => {
    const a = buildArticle({
      headline: 'My post',
      description: 'About flying',
      image: '/img/post.jpg',
      datePublished: '2026-04-01',
      dateModified: '2026-04-10',
      authorName: 'Jane Pilot',
      url: '/blog/my-post',
    });
    expect(a['@type']).toBe('Article');
    expect(a.headline).toBe('My post');
    expect(a.author.name).toBe('Jane Pilot');
    expect(a.datePublished).toBe('2026-04-01');
    expect(a.publisher['@id']).toBe('https://hqaviation.com/#organization');
  });
});

describe('buildFAQPage', () => {
  it('returns FAQPage with mainEntity questions', () => {
    const f = buildFAQPage([
      { q: 'Where are you?', a: 'Denham.' },
      { q: 'Cost?', a: 'POA.' },
    ]);
    expect(f['@type']).toBe('FAQPage');
    expect(f.mainEntity).toHaveLength(2);
    expect(f.mainEntity[0]['@type']).toBe('Question');
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('Denham.');
  });
});

describe('buildCourse', () => {
  it('returns Course schema with required fields', () => {
    const c = buildCourse({
      name: 'PPL(H) Helicopter Pilot Training',
      description: 'CAA-approved Part-FCL ATO course at Denham.',
      url: '/training/ppl',
    });
    expect(c['@context']).toBe('https://schema.org');
    expect(c['@type']).toBe('Course');
    expect(c.name).toBe('PPL(H) Helicopter Pilot Training');
    expect(c.provider['@type']).toBe('Organization');
    expect(c.url).toBe('https://hqaviation.com/training/ppl');
    expect(c.hasCourseInstance).toBeUndefined();
  });

  it('includes hasCourseInstance when provided', () => {
    const c = buildCourse({
      name: 'CPL(H)',
      description: 'Commercial training.',
      url: '/training/commercial',
      courseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite' },
    });
    expect(c.hasCourseInstance['@type']).toBe('CourseInstance');
  });

  it('includes offers when provided', () => {
    const c = buildCourse({
      name: 'Trial Lesson',
      description: 'Discovery flight.',
      url: '/training/trial-lessons',
      offers: [
        { '@type': 'Offer', name: 'R22 30 min', price: '180.00', priceCurrency: 'GBP' },
        { '@type': 'Offer', name: 'R22 60 min', price: '360.00', priceCurrency: 'GBP' },
      ],
    });
    expect(Array.isArray(c.offers)).toBe(true);
    expect(c.offers).toHaveLength(2);
    expect(c.offers[0].priceCurrency).toBe('GBP');
  });
});

describe('buildService', () => {
  it('returns Service schema with required fields', () => {
    const s = buildService({
      name: 'Robinson Helicopter Maintenance',
      serviceType: 'Helicopter Maintenance',
      description: 'CAA Part-145 maintenance for R22, R44, R66.',
      url: '/maintenance',
    });
    expect(s['@context']).toBe('https://schema.org');
    expect(s['@type']).toBe('Service');
    expect(s.serviceType).toBe('Helicopter Maintenance');
    expect(s.provider['@type']).toBe('Organization');
    expect(s.url).toBe('https://hqaviation.com/maintenance');
    expect(s.areaServed).toBe('United Kingdom');
  });

  it('overrides areaServed when provided', () => {
    const s = buildService({
      name: 'Test',
      description: 'Test',
      url: '/test',
      areaServed: 'England',
    });
    expect(s.areaServed).toBe('England');
  });
});

describe('buildItemList', () => {
  it('returns ItemList with positioned items', () => {
    const list = buildItemList({
      name: 'New Robinson Helicopters',
      items: [
        { name: 'Robinson R22', url: '/aircraft/r22' },
        { name: 'Robinson R44', url: '/aircraft/r44' },
        { name: 'Robinson R66', url: '/aircraft/r66' },
      ],
    });
    expect(list['@type']).toBe('ItemList');
    expect(list.name).toBe('New Robinson Helicopters');
    expect(list.itemListElement).toHaveLength(3);
    expect(list.itemListElement[0].position).toBe(1);
    expect(list.itemListElement[2].url).toBe('https://hqaviation.com/aircraft/r66');
  });
});

describe('buildTouristTrip', () => {
  it('builds a TouristTrip with name, description, image, and offer', () => {
    const t = buildTouristTrip({
      name: 'Helicopter Tour of London',
      description: 'A 30-minute aerial tour over central London by Robinson R44.',
      image: '/assets/images/london-tour.jpg',
      url: 'https://hqaviation.com/helicopter-tour-of-london',
      offers: { price: '395', priceCurrency: 'GBP', availability: 'https://schema.org/InStock' },
    });
    expect(t['@type']).toBe('TouristTrip');
    expect(t.name).toBe('Helicopter Tour of London');
    expect(t.image).toContain('/assets/images/london-tour.jpg');
    expect(t.offers.price).toBe('395');
    expect(t.offers.priceCurrency).toBe('GBP');
  });

  it('omits offers when not provided', () => {
    const t = buildTouristTrip({
      name: 'Tour',
      description: 'desc',
      image: '/x.jpg',
      url: 'https://hqaviation.com/x',
    });
    expect(t.offers).toBeUndefined();
  });
});
