import { describe, it, expect } from 'vitest';
import {
  CLASSES,
  FUEL_TYPES,
  CONFIDENCE,
  MARKET_STATUS,
  validateComparable,
  isUsedOnly,
} from './comparablesSchema';

describe('comparablesSchema constants', () => {
  it('lists all five classes in display order', () => {
    expect(CLASSES).toEqual([
      { id: 'trainer', label: 'Trainer' },
      { id: 'light-piston', label: 'Light Piston' },
      { id: 'light-turbine', label: 'Light Turbine' },
      { id: 'medium-turbine', label: 'Medium Turbine' },
      { id: 'twin-turbine', label: 'Twin Turbine' },
    ]);
  });

  it('lists fuel types', () => {
    expect(FUEL_TYPES).toEqual(['avgas-100ll', 'jet-a1']);
  });

  it('lists confidence levels', () => {
    expect(CONFIDENCE).toEqual(['verified', 'estimate']);
  });

  it('lists market status values', () => {
    expect(MARKET_STATUS).toEqual(['in-production', 'used-only']);
  });
});

describe('isUsedOnly', () => {
  it('returns true when marketStatus is used-only', () => {
    expect(isUsedOnly({ marketStatus: 'used-only' })).toBe(true);
  });

  it('returns false otherwise', () => {
    expect(isUsedOnly({ marketStatus: 'in-production' })).toBe(false);
    expect(isUsedOnly({})).toBe(false);
  });
});

describe('validateComparable', () => {
  const valid = {
    id: 'r66-turbine',
    manufacturer: 'Robinson',
    model: 'R66 Turbine',
    displayName: 'R66',
    class: 'light-turbine',
    marketStatus: 'in-production',
    isRobinson: true,
    fuelType: 'jet-a1',
    specs: {
      seats: 5, cruiseSpeedKts: 120, rangeNm: 350,
      usefulLoadLbs: 1270, fuelCapacityGal: 73.3,
    },
    costsPerHour: { fuelBurnGph: 22, mxScheduled: 95, engineReserve: 80, airframeReserve: 35 },
    costsAnnual: { insurance: 18000, annualInspection: 4500, hangarage: 8000 },
    acquisition: { priceNewGbp: 1290000, priceUsedRangeGbp: { low: 950000, high: 1180000 } },
    costsSource: 'HQ internal MX records',
    costsConfidence: 'verified',
  };

  it('returns no errors for a valid doc', () => {
    expect(validateComparable(valid)).toEqual([]);
  });

  it('flags missing required fields', () => {
    const { manufacturer, ...missing } = valid;
    expect(validateComparable(missing)).toContain('manufacturer is required');
  });

  it('flags invalid class', () => {
    expect(validateComparable({ ...valid, class: 'jet' }))
      .toContain('class must be one of: trainer, light-piston, light-turbine, medium-turbine, twin-turbine');
  });

  it('flags invalid fuelType', () => {
    expect(validateComparable({ ...valid, fuelType: 'diesel' }))
      .toContain('fuelType must be one of: avgas-100ll, jet-a1');
  });

  it('flags negative numeric fields', () => {
    const bad = { ...valid, costsPerHour: { ...valid.costsPerHour, fuelBurnGph: -1 } };
    expect(validateComparable(bad)).toContain('costsPerHour.fuelBurnGph must be >= 0');
  });

  it('requires priceNewGbp unless used-only', () => {
    const bad = { ...valid, acquisition: { priceNewGbp: null, priceUsedRangeGbp: { low: 500000, high: 700000 } } };
    expect(validateComparable(bad)).toContain('acquisition.priceNewGbp is required unless marketStatus is used-only');
  });

  it('does not require priceNewGbp when used-only', () => {
    const ok = {
      ...valid,
      marketStatus: 'used-only',
      acquisition: { priceNewGbp: null, priceUsedRangeGbp: { low: 500000, high: 700000 } },
    };
    expect(validateComparable(ok)).toEqual([]);
  });

  it('does not produce a priceNewGbp error when marketStatus is missing', () => {
    const { marketStatus, ...missing } = valid;
    const errs = validateComparable(missing);
    expect(errs).toContain('marketStatus is required');
    expect(errs).not.toContain('acquisition.priceNewGbp is required unless marketStatus is used-only');
  });

  it('returns the guard-clause error for non-object input', () => {
    expect(validateComparable(null)).toEqual(['document must be an object']);
    expect(validateComparable('string')).toEqual(['document must be an object']);
  });
});
