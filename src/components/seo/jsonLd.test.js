import { describe, it, expect } from 'vitest';
import { buildOrganization, buildWebSite } from './jsonLd';

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

import { buildLocalBusiness, buildBreadcrumbList } from './jsonLd';

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
