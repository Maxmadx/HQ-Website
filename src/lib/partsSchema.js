import { z } from 'zod';

export const CONDITIONS = ['new', 'overhauled', 'exchange', 'repaired'];
export const CATEGORIES = ['rotor', 'engine', 'avionics', 'consumables', 'airframe', 'hardware'];
export const AIRCRAFT = ['r22', 'r44', 'r66'];
// 'sold' is added vs misc_items so a unique used unit can be auto-archived
// when stock hits 0 without losing its detail page (handy for SEO continuity).
export const STATUSES = ['active', 'sold', 'archived', 'discontinued'];

// Image shape mirrors the misc_items convention: { url, alt, isPrimary }.
export const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(200).default(''),
  isPrimary: z.boolean().default(false),
});

export const partSchema = z.object({
  // partNumber and mfgPartNumber are queryable fields, NOT the doc id.
  // Multiple docs can share the same partNumber (e.g. one new + one used).
  partNumber: z.string().min(1).max(100),
  mfgPartNumber: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  category: z.enum(CATEGORIES),
  aircraftCompat: z.array(z.enum(AIRCRAFT)).min(1),
  images: z.array(imageSchema).default([]),
  status: z.enum(STATUSES).default('active'),

  // Single condition + price per listing. If you sell A102 in three
  // conditions, that's three separate listings with three separate URLs.
  condition: z.enum(CONDITIONS),
  priceGbp: z.number().int().min(0).nullable(), // pence; null = POA
  coreChargeGbp: z.number().int().min(0).nullable().optional(), // only meaningful when condition === 'exchange'
  priceDisplay: z.string().max(50).default('POA'), // denormalised render — set on save
  leadTimeDays: z.number().int().min(0).default(0), // 0 = in stock

  // Stock follows the misc_items pattern.
  hasQuantity: z.boolean().default(true),
  stock: z.number().int().min(1).default(1),
  requiresShipping: z.boolean().default(true),

  airworthinessLifeLimited: z.boolean().default(false),
  exportControlled: z.boolean().default(false),
  notes: z.string().max(5000).default(''),
});

// Pounds-with-decimals → integer pence. Used by the admin form on save.
// Returns null for empty input ("Price on application").
export function poundsToPence(input) {
  if (input === '' || input == null) return null;
  const n = Number(input);
  if (!Number.isFinite(n) || n < 0) throw new Error('poundsToPence: invalid amount ' + JSON.stringify(input));
  return Math.round(n * 100);
}

// Inverse for displaying stored pence in a pounds-with-decimals form input.
export function penceToPounds(pence) {
  if (pence == null) return '';
  return (pence / 100).toFixed(2);
}

// Render pence as a customer-facing GBP string. POA when null.
export function formatPriceDisplay(pence) {
  if (pence == null) return 'POA';
  return `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
