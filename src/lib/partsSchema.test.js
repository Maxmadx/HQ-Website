import { describe, it, expect } from 'vitest';
import { partSchema, poundsToPence, penceToPounds, formatPriceDisplay, CONDITIONS, CATEGORIES, AIRCRAFT, STATUSES } from './partsSchema';

describe('poundsToPence / penceToPounds', () => {
  it('converts whole pounds to pence', () => {
    expect(poundsToPence('14000')).toBe(1400000);
  });
  it('converts pounds-with-decimals to pence', () => {
    expect(poundsToPence('14000.50')).toBe(1400050);
  });
  it('returns null for empty input (price on application)', () => {
    expect(poundsToPence('')).toBeNull();
    expect(poundsToPence(null)).toBeNull();
  });
  it('rejects negative amounts', () => {
    expect(() => poundsToPence('-1')).toThrow();
  });
  it('rejects non-numeric', () => {
    expect(() => poundsToPence('abc')).toThrow();
  });
  it('round-trips via penceToPounds', () => {
    expect(penceToPounds(1400050)).toBe('14000.50');
    expect(penceToPounds(0)).toBe('0.00');
    expect(penceToPounds(null)).toBe('');
  });
});

describe('formatPriceDisplay', () => {
  it('renders POA when priceGbp is null', () => {
    expect(formatPriceDisplay(null)).toBe('POA');
  });
  it('renders pence as £-formatted GBP with thousands separators', () => {
    expect(formatPriceDisplay(1400000)).toBe('£14,000.00');
    expect(formatPriceDisplay(1400050)).toBe('£14,000.50');
  });
});

describe('partSchema', () => {
  const base = {
    partNumber: 'A102',
    mfgPartNumber: 'A102',
    title: 'Tail Rotor Pitch Link',
    description: 'Robinson R44 tail rotor pitch link, in good condition.',
    category: 'rotor',
    aircraftCompat: ['r44'],
    images: [],
    status: 'active',
    condition: 'new',
    priceGbp: 1400000,
    coreChargeGbp: null,
    priceDisplay: '£14,000.00',
    leadTimeDays: 0,
    hasQuantity: true,
    stock: 5,
    requiresShipping: true,
    airworthinessLifeLimited: true,
    exportControlled: false,
    notes: '',
  };

  it('accepts a valid new-stock listing', () => {
    expect(() => partSchema.parse(base)).not.toThrow();
  });
  it('accepts a one-off used listing (stock=1, hasQuantity=false)', () => {
    const used = { ...base, condition: 'overhauled', hasQuantity: false, stock: 1, priceGbp: 920000, priceDisplay: '£9,200.00' };
    expect(() => partSchema.parse(used)).not.toThrow();
  });
  it('accepts an exchange listing with core charge', () => {
    const exch = { ...base, condition: 'exchange', priceGbp: 850000, coreChargeGbp: 500000, priceDisplay: '£8,500.00' };
    expect(() => partSchema.parse(exch)).not.toThrow();
  });
  it('accepts priceGbp=null (POA) with priceDisplay="POA"', () => {
    const poa = { ...base, priceGbp: null, priceDisplay: 'POA' };
    expect(() => partSchema.parse(poa)).not.toThrow();
  });
  it('rejects negative price', () => {
    expect(() => partSchema.parse({ ...base, priceGbp: -100 })).toThrow();
  });
  it('rejects unknown condition', () => {
    expect(() => partSchema.parse({ ...base, condition: 'fake' })).toThrow();
  });
  it('rejects unknown category', () => {
    expect(() => partSchema.parse({ ...base, category: 'fake' })).toThrow();
  });
  it('rejects unknown aircraft', () => {
    expect(() => partSchema.parse({ ...base, aircraftCompat: ['cessna'] })).toThrow();
  });
  it('rejects empty aircraft list', () => {
    expect(() => partSchema.parse({ ...base, aircraftCompat: [] })).toThrow();
  });
  it('rejects stock < 1', () => {
    expect(() => partSchema.parse({ ...base, stock: 0 })).toThrow();
  });
  it('accepts images with {url, alt, isPrimary} shape', () => {
    const withImages = { ...base, images: [{ url: 'https://cdn.example.com/a.jpg', alt: 'rotor blade', isPrimary: true }] };
    expect(() => partSchema.parse(withImages)).not.toThrow();
  });
  it('rejects images without a url', () => {
    expect(() => partSchema.parse({ ...base, images: [{ alt: 'x', isPrimary: true }] })).toThrow();
  });
  it('exports the canonical enums', () => {
    expect(CONDITIONS).toEqual(['new', 'overhauled', 'exchange', 'repaired']);
    expect(CATEGORIES).toEqual(['rotor', 'engine', 'avionics', 'consumables', 'airframe', 'hardware']);
    expect(AIRCRAFT).toEqual(['r22', 'r44', 'r66']);
    expect(STATUSES).toEqual(['active', 'sold', 'archived', 'discontinued']);
  });
});
