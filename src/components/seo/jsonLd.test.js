import { describe, it, expect } from 'vitest';
import {
  buildOrganization,
  buildWebSite,
  buildLocalBusiness,
  buildBreadcrumbList,
  buildProduct,
  buildArticle,
  buildFAQPage,
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
  it('returns Product schema', () => {
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
    expect(p.offers['@type']).toBe('Offer');
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
