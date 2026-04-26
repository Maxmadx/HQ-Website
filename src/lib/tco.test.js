import { describe, it, expect } from 'vitest';
import {
  fuelCostPerHour,
  docPerHour,
  annualFixed,
  totalCostPerYear,
  multiYearTCO,
} from './tco';

const DEFAULTS = {
  fuelPrice: { avgas100llGbpPerGal: 8.5, jetA1GbpPerGal: 7.8 },
  defaults: { hoursPerYear: 100, yearsOfOwnership: 5 },
};

const R66 = {
  fuelType: 'jet-a1',
  costsPerHour: { fuelBurnGph: 22, mxScheduled: 95, engineReserve: 80, airframeReserve: 35 },
  costsAnnual: { insurance: 18000, annualInspection: 4500, hangarage: 8000 },
  acquisition: { priceNewGbp: 1290000 },
};

describe('fuelCostPerHour', () => {
  it('multiplies burn by Jet A-1 price for jet-a1 fuel', () => {
    expect(fuelCostPerHour(R66, DEFAULTS)).toBeCloseTo(22 * 7.8);
  });

  it('uses Avgas price for avgas-100ll fuel', () => {
    const r22 = { ...R66, fuelType: 'avgas-100ll', costsPerHour: { ...R66.costsPerHour, fuelBurnGph: 8.5 } };
    expect(fuelCostPerHour(r22, DEFAULTS)).toBeCloseTo(8.5 * 8.5);
  });

  it('returns 0 if fuelBurnGph is missing', () => {
    expect(fuelCostPerHour({ fuelType: 'jet-a1', costsPerHour: {} }, DEFAULTS)).toBe(0);
  });
});

describe('docPerHour', () => {
  it('sums fuel + scheduled MX + engine reserve + airframe reserve', () => {
    expect(docPerHour(R66, DEFAULTS)).toBeCloseTo(22 * 7.8 + 95 + 80 + 35);
  });

  it('treats missing cost fields as 0', () => {
    const partial = { fuelType: 'jet-a1', costsPerHour: { fuelBurnGph: 22 }, costsAnnual: {} };
    expect(docPerHour(partial, DEFAULTS)).toBeCloseTo(22 * 7.8);
  });
});

describe('annualFixed', () => {
  it('sums insurance + annual inspection + hangarage', () => {
    expect(annualFixed(R66)).toBe(18000 + 4500 + 8000);
  });

  it('treats missing fields as 0', () => {
    expect(annualFixed({ costsAnnual: { insurance: 5000 } })).toBe(5000);
  });
});

describe('totalCostPerYear', () => {
  it('combines annual fixed + variable * hours', () => {
    const expectedDoc = 22 * 7.8 + 95 + 80 + 35;
    expect(totalCostPerYear(R66, 100, DEFAULTS)).toBeCloseTo(30500 + 100 * expectedDoc);
  });

  it('coerces non-numeric hours to defaults.hoursPerYear', () => {
    const expectedDoc = 22 * 7.8 + 95 + 80 + 35;
    expect(totalCostPerYear(R66, 'abc', DEFAULTS)).toBeCloseTo(30500 + 100 * expectedDoc);
  });
});

describe('multiYearTCO', () => {
  it('returns acquisition + (years * annual operating)', () => {
    const annualOp = 30500 + 100 * (22 * 7.8 + 95 + 80 + 35);
    expect(multiYearTCO(R66, 100, 5, DEFAULTS)).toBeCloseTo(1290000 + 5 * annualOp);
  });

  it('returns null if priceNewGbp is missing (used-only aircraft)', () => {
    const usedOnly = { ...R66, acquisition: { priceNewGbp: null } };
    expect(multiYearTCO(usedOnly, 100, 5, DEFAULTS)).toBeNull();
  });

  it('returns NaN-free numbers when inputs are garbage', () => {
    const result = multiYearTCO(R66, 'abc', null, DEFAULTS);
    expect(Number.isFinite(result)).toBe(true);
  });
});
