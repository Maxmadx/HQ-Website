import { describe, it, expect } from 'vitest';
import { parseNumberOrNull, parseModels } from './useComparisonState';

describe('parseNumberOrNull', () => {
  it('returns a positive number for a valid numeric string', () => {
    expect(parseNumberOrNull('100')).toBe(100);
    expect(parseNumberOrNull('1')).toBe(1);
    expect(parseNumberOrNull('3.5')).toBe(3.5);
  });

  it('returns null for empty string', () => {
    expect(parseNumberOrNull('')).toBeNull();
  });

  it('returns null for null', () => {
    expect(parseNumberOrNull(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseNumberOrNull(undefined)).toBeNull();
  });

  it('returns null for zero', () => {
    expect(parseNumberOrNull('0')).toBeNull();
    expect(parseNumberOrNull(0)).toBeNull();
  });

  it('returns null for negative numbers', () => {
    expect(parseNumberOrNull('-1')).toBeNull();
    expect(parseNumberOrNull('-100')).toBeNull();
  });

  it('returns null for non-numeric strings', () => {
    expect(parseNumberOrNull('abc')).toBeNull();
    expect(parseNumberOrNull('NaN')).toBeNull();
    expect(parseNumberOrNull('Infinity')).toBeNull();
  });
});

describe('parseModels', () => {
  it('returns empty array for null or empty input', () => {
    expect(parseModels(null)).toEqual([]);
    expect(parseModels('')).toEqual([]);
    expect(parseModels(undefined)).toEqual([]);
  });

  it('returns single-item array for a single model id', () => {
    expect(parseModels('r44')).toEqual(['r44']);
  });

  it('splits comma-separated ids into an array', () => {
    expect(parseModels('r22,r44,r66')).toEqual(['r22', 'r44', 'r66']);
  });

  it('trims whitespace from each id', () => {
    expect(parseModels(' r22 , r44 , r66 ')).toEqual(['r22', 'r44', 'r66']);
  });

  it('filters out empty segments from trailing/double commas', () => {
    expect(parseModels('r22,,r44,')).toEqual(['r22', 'r44']);
  });
});
