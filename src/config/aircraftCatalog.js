/**
 * aircraftCatalog — single source of truth for the new-aircraft lineup
 * (subtypes + factory MSRP in USD). Used by /aircraft-sales, the individual
 * Aircraft pages, and the admin pricing seeder.
 *
 * Prices verified against Robinson Helicopter Company's published price lists
 * effective 1 January 2026 (R88 is pre-production — figure provided by HQ).
 * Admins can override any of these values at /admin/pricing — overrides live
 * in Firestore under the `pricing` collection with `category: 'aircraft'`.
 */
export const AIRCRAFT_CATALOG = [
  {
    id: 'r88',
    name: 'R88',
    tagline: 'The Future of Rotorcraft',
    subtypes: [
      { id: 'standard', name: 'Standard', priceUsd: 3300000,
        description: 'Pre-production estimate. Eight-seat turbine helicopter.' },
    ],
  },
  {
    id: 'r66',
    name: 'R66',
    tagline: 'Turbine Performance',
    subtypes: [
      { id: 'southwood',  name: 'Southwood',  priceUsd: 1456000,
        cutout: '/assets/images/new-aircraft/r66/variants/r66-southwood-front.png',
        description: 'NxG with Stone & Graphite leather. The R66 entry into the NxG lineup.' },
      { id: 'palo-verde', name: 'Palo Verde', priceUsd: 1563500,
        cutout: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',
        description: 'NxG with full Garmin G500H suite, autopilot and three-tone leather.' },
      { id: 'riviera',    name: 'Riviera',    priceUsd: 1777500,
        cutout: '/assets/images/new-aircraft/r66/variants/r66-riviera-front.png',
        description: 'Limited-edition NxG in Monarch Orange, Sky Blue and Pacific Blue with ceramic coating.' },
    ],
  },
  {
    id: 'r44',
    name: 'R44',
    tagline: "World's Best-Selling",
    subtypes: [
      { id: 'cadet',    name: 'Cadet',    priceUsd: 520000,
        cutout: '/assets/images/new-aircraft/r44/r44-cadet-front.png',
        description: 'Two-seat training variant with extended range.' },
      { id: 'raven-i',  name: 'Raven I',  priceUsd: 553500,
        cutout: '/assets/images/new-aircraft/r44/r44-raven-i-front-alpha.png',
        description: 'Carbureted engine. Ideal for lower altitude operations.' },
      { id: 'raven-ii', name: 'Raven II', priceUsd: 646000,
        cutout: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
        description: 'Fuel-injected engine. Enhanced high-altitude performance.' },
    ],
  },
  {
    id: 'r22',
    name: 'R22',
    tagline: 'Training Excellence',
    subtypes: [
      { id: 'beta-ii', name: 'Beta II', priceUsd: 375000,
        description: 'Standard two-seat trainer with proven reliability.' },
    ],
  },
];

export function getModel(modelId) {
  return AIRCRAFT_CATALOG.find((m) => m.id === modelId);
}

export function getSubtypes(modelId) {
  return getModel(modelId)?.subtypes ?? [];
}
