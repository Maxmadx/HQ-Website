// Default factory specs for aircraft marketing pages. Used as fallback when
// the Firestore-backed admin data is unavailable, and as the seed when the
// admin first writes to a model. Shape:
//   { [modelId]: { variants: [{ key, name, rows: [{label,value,icon?}],
//                               dimensions?: {length,height,maxWeight},
//                               diagram?: string }] } }
// Single-variant models (R66, R88) use a single variant keyed `default`.

export const AIRCRAFT_SPECS_MODELS = ['r22', 'r44', 'r66', 'r88'];

export const AIRCRAFT_SPECS_LABELS = {
  r22: 'Robinson R22',
  r44: 'Robinson R44',
  r66: 'Robinson R66',
  r88: 'Robinson R88',
};

export const AIRCRAFT_SPECS_DEFAULTS = {
  r66: {
    variants: [
      {
        key: 'default',
        name: 'R66',
        rows: [
          { label: 'Engine',         value: 'Rolls-Royce RR300', icon: 'fa-cog' },
          { label: 'Power',          value: '270 SHP',           icon: 'fa-bolt' },
          { label: 'Max Speed',      value: '140 kts',           icon: 'fa-tachometer-alt' },
          { label: 'Cruise Speed',   value: '110 kts',           icon: 'fa-plane' },
          { label: 'Range',          value: '350 nm',            icon: 'fa-route' },
          { label: 'Useful Load',    value: '1,200 lbs',         icon: 'fa-weight-hanging' },
          { label: 'Seats',          value: '5',                 icon: 'fa-users' },
          { label: 'Rotor Diameter', value: '33 ft',             icon: 'fa-circle-notch' },
          { label: 'Fuel Capacity',  value: '73.3 gal',          icon: 'fa-gas-pump' },
          { label: 'Endurance',      value: '3+ hrs',            icon: 'fa-clock' },
        ],
      },
    ],
  },

  r88: {
    variants: [
      {
        key: 'default',
        name: 'R88',
        rows: [
          { label: 'Engine',           value: 'Safran Arriel 2W', icon: 'fa-cog' },
          { label: 'Power Class',      value: '950 SHP',          icon: 'fa-bolt' },
          { label: 'Seating',          value: '10 Total',         icon: 'fa-users' },
          { label: 'Range',            value: '350+ nm',          icon: 'fa-route' },
          { label: 'Endurance',        value: '3.5+ hrs',         icon: 'fa-clock' },
          { label: 'Cabin Volume',     value: '~275 cu ft',       icon: 'fa-cube' },
          { label: 'Internal Payload', value: '2,800 lbs',        icon: 'fa-weight-hanging' },
          { label: 'Starting Price',   value: '$3.3M',            icon: 'fa-tag' },
        ],
      },
    ],
  },

  r44: {
    variants: [
      {
        key: 'ravenI',
        name: 'Raven I',
        diagram: '/assets/images/new-aircraft/r44/r44-raven-i-specification-diagram.png',
        dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,400 lbs' },
        rows: [
          { label: 'Engine',         value: 'Lycoming O-540 (carbureted)' },
          { label: 'Power',          value: '205 HP continuous / 225 HP takeoff' },
          { label: 'Max Speed',      value: '130 kts (VNE)' },
          { label: 'Cruise Speed',   value: '110 kts' },
          { label: 'Range',          value: '400 nm' },
          { label: 'Useful Load',    value: '780 lbs' },
          { label: 'Seats',          value: '4' },
          { label: 'Rotor Diameter', value: '33 ft' },
          { label: 'Fuel Capacity',  value: '47 gal (main + aux)' },
          { label: 'Endurance',      value: '3.5 hrs' },
        ],
      },
      {
        key: 'ravenII',
        name: 'Raven II',
        diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
        dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
        rows: [
          { label: 'Engine',         value: 'Lycoming IO-540 (fuel-injected)' },
          { label: 'Power',          value: '245 HP continuous / 260 HP takeoff' },
          { label: 'Max Speed',      value: '130 kts (VNE)' },
          { label: 'Cruise Speed',   value: '117 kts' },
          { label: 'Range',          value: '400 nm' },
          { label: 'Useful Load',    value: '900 lbs' },
          { label: 'Seats',          value: '4' },
          { label: 'Rotor Diameter', value: '33 ft' },
          { label: 'Fuel Capacity',  value: '50 gal (main + aux)' },
          { label: 'Endurance',      value: '3.5 hrs' },
        ],
      },
      {
        key: 'cadet',
        name: 'Cadet',
        diagram: '/assets/images/new-aircraft/r44/r44-cadet-specification-diagram.png',
        dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,200 lbs' },
        rows: [
          { label: 'Engine',         value: 'Lycoming IO-540 (derated)' },
          { label: 'Power',          value: '185 HP continuous / 210 HP takeoff' },
          { label: 'Max Speed',      value: '130 kts (VNE)' },
          { label: 'Cruise Speed',   value: '110 kts' },
          { label: 'Range',          value: '300 nm' },
          { label: 'Useful Load',    value: '800 lbs' },
          { label: 'Seats',          value: '2 + cargo area' },
          { label: 'Rotor Diameter', value: '33 ft' },
          { label: 'Fuel Capacity',  value: '29.5 gal' },
          { label: 'Endurance',      value: '2.5 hrs' },
        ],
      },
      {
        key: 'clipperPopOut',
        name: 'Clipper II Pop-Out',
        diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
        dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
        rows: [
          { label: 'Engine',         value: 'Lycoming IO-540 (fuel-injected)' },
          { label: 'Power',          value: '245 HP continuous / 260 HP takeoff' },
          { label: 'Max Speed',      value: '130 kts (VNE)' },
          { label: 'Cruise Speed',   value: '115 kts' },
          { label: 'Range',          value: '395 nm' },
          { label: 'Useful Load',    value: '830 lbs' },
          { label: 'Seats',          value: '4' },
          { label: 'Rotor Diameter', value: '33 ft' },
          { label: 'Fuel Capacity',  value: '50 gal (main + aux)' },
          { label: 'Floats',         value: 'Pop-out emergency' },
        ],
      },
      {
        key: 'clipperFixed',
        name: 'Clipper II Fixed',
        diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
        dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
        rows: [
          { label: 'Engine',         value: 'Lycoming IO-540 (fuel-injected)' },
          { label: 'Power',          value: '245 HP continuous / 260 HP takeoff' },
          { label: 'Max Speed',      value: '110 kts (VNE with floats)' },
          { label: 'Cruise Speed',   value: '100 kts' },
          { label: 'Range',          value: '370 nm' },
          { label: 'Useful Load',    value: '800 lbs' },
          { label: 'Seats',          value: '4' },
          { label: 'Rotor Diameter', value: '33 ft' },
          { label: 'Fuel Capacity',  value: '50 gal (main + aux)' },
          { label: 'Floats',         value: 'Fixed utility (water-ops capable)' },
        ],
      },
      {
        key: 'utility',
        name: 'Utility',
        diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
        dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
        rows: [
          { label: 'Engine',         value: 'Raven I or Raven II base' },
          { label: 'Power',          value: 'Varies by base airframe' },
          { label: 'Max Speed',      value: '130 kts (VNE)' },
          { label: 'Cruise Speed',   value: '110–117 kts' },
          { label: 'Range',          value: '300–400 nm' },
          { label: 'Useful Load',    value: '780–900 lbs' },
          { label: 'Seats',          value: '4 (heavy-duty utility interior)' },
          { label: 'Rotor Diameter', value: '33 ft' },
          { label: 'Fuel Capacity',  value: '29.5–50 gal' },
          { label: 'Interior',       value: 'TitanPlate headliner, rubberised floor' },
        ],
      },
    ],
  },

  // R22 typed-field schema (engine, power, vne, cruise, range, mtow, ...) is
  // not yet migrated to the rows shape — admin will list it as coming soon.
  r22: { variants: [] },
};
