'use strict';

const { z } = require('zod');

const FlightSchema = z.object({
  aircraftId: z.enum(['r22', 'r44', 'r66', 'r88']),
  duration: z.union([z.literal(30), z.literal(60), z.literal(90)]),
}).strict();

const AddonSchema = z.object({
  id: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(10),
}).strict();

const ShippingAddressSchema = z.object({
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional().default(''),
  city: z.string().min(1).max(120),
  postcode: z.string().min(1).max(20),
}).strict();

// One line item in a store cart. priceP is per-unit, in pence.
const ProductLineSchema = z.object({
  itemId: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(50),
  size: z.string().max(20).optional().nullable(),
  priceP: z.number().int().min(0).max(100000000),
  requiresShipping: z.boolean().optional().default(false),
}).strict();

// london_tour booking details. priceP is the total for the booking, in pence
// (unlike ProductLineSchema.priceP, which is per-unit).
const LondonTourSchema = z.object({
  experience: z.enum(['shared', 'private']),
  timeOfDay: z.enum(['day', 'sunset', 'night']),
  quantity: z.number().int().min(1).max(4),
  priceP: z.number().int().min(0).max(100000000),
}).strict();

// POST /api/carts upsert body
const CartUpsertSchema = z.object({
  sessionId: z.string().min(8).max(64),
  email: z.string().email().max(254).optional().nullable(),
  category: z.enum(['discovery_flight', 'product', 'london_tour']).optional().nullable(),
  flight: FlightSchema.optional().nullable(),
  addons: z.array(AddonSchema).max(20).optional().default([]),
  products: z.array(ProductLineSchema).max(50).optional().default([]),
  londonTour: LondonTourSchema.optional().nullable(),
  fulfilment: z.enum(['collect', 'delivery']).optional().nullable(),
  shippingAddress: ShippingAddressSchema.optional().nullable(),
  utm: z.object({
    source: z.string().max(100).optional().nullable(),
    medium: z.string().max(100).optional().nullable(),
    campaign: z.string().max(100).optional().nullable(),
    term: z.string().max(100).optional().nullable(),
    content: z.string().max(100).optional().nullable(),
  }).optional(),
  referrer: z.string().max(300).optional().nullable(),
  // Honeypot — must be empty / undefined; bots fill it
  company: z.string().max(0).optional(),
}).strict();

const CartPatchSchema = CartUpsertSchema.partial().extend({
  sessionId: z.string().min(8).max(64), // still required for ownership check
});

module.exports = {
  CartUpsertSchema,
  CartPatchSchema,
  FlightSchema,
  AddonSchema,
  ProductLineSchema,
  LondonTourSchema,
};
