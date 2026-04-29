// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  SERVICE_TYPES,
  SERVICE_FIELD_MAP,
  ALWAYS_VISIBLE_FIELDS,
  ALL_CONDITIONAL_FIELDS,
  INITIAL_FORM_STATE,
  getServiceFields,
  clearConditionalFields,
} from './aircraftConsultingForm';

describe('SERVICE_TYPES', () => {
  it('lists the 8 services from the spec with stable slug + label', () => {
    expect(SERVICE_TYPES).toHaveLength(8);
    expect(SERVICE_TYPES.map(s => s.slug)).toEqual([
      'pre-purchase-inspection',
      'acquisition-advisory',
      'valuation',
      'aircraft-management',
      'tco-modelling',
      'insurance-advisory',
      'import-export',
      'expert-witness',
    ]);
    SERVICE_TYPES.forEach(s => {
      expect(typeof s.label).toBe('string');
      expect(s.label.length).toBeGreaterThan(0);
    });
  });
});

describe('SERVICE_FIELD_MAP', () => {
  it('maps every service slug to a list of conditional field names', () => {
    SERVICE_TYPES.forEach(s => {
      expect(Array.isArray(SERVICE_FIELD_MAP[s.slug])).toBe(true);
    });
  });

  it('matches the spec field-set per service', () => {
    expect(SERVICE_FIELD_MAP['pre-purchase-inspection']).toEqual(
      ['registration', 'askingPrice', 'targetInspectionDate']
    );
    expect(SERVICE_FIELD_MAP['acquisition-advisory']).toEqual(
      ['budgetRange', 'intendedUse', 'timeline']
    );
    expect(SERVICE_FIELD_MAP['valuation']).toEqual(
      ['registration', 'valuationPurpose']
    );
    expect(SERVICE_FIELD_MAP['aircraft-management']).toEqual(
      ['aircraftType', 'ownershipStatus']
    );
    expect(SERVICE_FIELD_MAP['tco-modelling']).toEqual(
      ['aircraftType', 'expectedAnnualHours']
    );
    expect(SERVICE_FIELD_MAP['insurance-advisory']).toEqual(
      ['aircraftType', 'currentRenewalDate']
    );
    expect(SERVICE_FIELD_MAP['import-export']).toEqual(
      ['aircraftType', 'fromRegistry', 'toRegistry']
    );
    expect(SERVICE_FIELD_MAP['expert-witness']).toEqual(
      ['matterType', 'party']
    );
  });
});

describe('ALWAYS_VISIBLE_FIELDS', () => {
  it('has the four base fields shared by every service', () => {
    expect(ALWAYS_VISIBLE_FIELDS).toEqual(['name', 'email', 'phone', 'message']);
  });
});

describe('ALL_CONDITIONAL_FIELDS', () => {
  it('is the union of every conditional field across services', () => {
    expect(new Set(ALL_CONDITIONAL_FIELDS)).toEqual(new Set([
      'registration',
      'askingPrice',
      'targetInspectionDate',
      'budgetRange',
      'intendedUse',
      'timeline',
      'valuationPurpose',
      'aircraftType',
      'ownershipStatus',
      'expectedAnnualHours',
      'currentRenewalDate',
      'fromRegistry',
      'toRegistry',
      'matterType',
      'party',
    ]));
  });
});

describe('INITIAL_FORM_STATE', () => {
  it('zeroes every field as an empty string and includes serviceType', () => {
    expect(INITIAL_FORM_STATE).toEqual({
      name: '',
      email: '',
      phone: '',
      message: '',
      serviceType: '',
      registration: '',
      askingPrice: '',
      targetInspectionDate: '',
      budgetRange: '',
      intendedUse: '',
      timeline: '',
      valuationPurpose: '',
      aircraftType: '',
      ownershipStatus: '',
      expectedAnnualHours: '',
      currentRenewalDate: '',
      fromRegistry: '',
      toRegistry: '',
      matterType: '',
      party: '',
    });
  });
});

describe('getServiceFields', () => {
  it('returns the conditional field list for a known slug', () => {
    expect(getServiceFields('valuation')).toEqual(['registration', 'valuationPurpose']);
  });

  it('returns an empty list for an unknown or empty slug', () => {
    expect(getServiceFields('')).toEqual([]);
    expect(getServiceFields('not-a-service')).toEqual([]);
    expect(getServiceFields(undefined)).toEqual([]);
  });
});

describe('clearConditionalFields', () => {
  it('zeroes every conditional field while preserving always-visible + serviceType', () => {
    const dirty = {
      name: 'Pat',
      email: 'p@x.com',
      phone: '123',
      message: 'hi',
      serviceType: 'valuation',
      registration: 'G-ABCD',
      askingPrice: '500000',
      targetInspectionDate: '',
      budgetRange: '',
      intendedUse: '',
      timeline: '',
      valuationPurpose: 'finance',
      aircraftType: '',
      ownershipStatus: '',
      expectedAnnualHours: '',
      currentRenewalDate: '',
      fromRegistry: '',
      toRegistry: '',
      matterType: '',
      party: '',
    };
    const cleared = clearConditionalFields(dirty);
    expect(cleared.name).toBe('Pat');
    expect(cleared.email).toBe('p@x.com');
    expect(cleared.phone).toBe('123');
    expect(cleared.message).toBe('hi');
    expect(cleared.serviceType).toBe('valuation');
    expect(cleared.registration).toBe('');
    expect(cleared.askingPrice).toBe('');
    expect(cleared.valuationPurpose).toBe('');
  });

  it('does not mutate the input', () => {
    const input = { ...INITIAL_FORM_STATE, registration: 'G-ABCD' };
    const before = JSON.stringify(input);
    clearConditionalFields(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
