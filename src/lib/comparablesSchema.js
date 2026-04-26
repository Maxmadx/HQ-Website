export const CLASSES = [
  { id: 'trainer', label: 'Trainer' },
  { id: 'light-piston', label: 'Light Piston' },
  { id: 'light-turbine', label: 'Light Turbine' },
  { id: 'medium-turbine', label: 'Medium Turbine' },
  { id: 'twin-turbine', label: 'Twin Turbine' },
];

export const FUEL_TYPES = ['avgas-100ll', 'jet-a1'];
export const CONFIDENCE = ['verified', 'estimate'];
export const MARKET_STATUS = ['in-production', 'used-only'];

const CLASS_IDS = CLASSES.map((c) => c.id);

export function isUsedOnly(doc) {
  return doc?.marketStatus === 'used-only';
}

// Note: `isRobinson` is also required but is validated separately for boolean type precision.
const REQUIRED_TOP = ['id', 'manufacturer', 'model', 'displayName', 'class', 'marketStatus', 'fuelType', 'costsConfidence'];
const NUMERIC_PATHS = [
  'specs.seats', 'specs.cruiseSpeedKts', 'specs.rangeNm', 'specs.usefulLoadLbs', 'specs.fuelCapacityGal',
  'costsPerHour.fuelBurnGph', 'costsPerHour.mxScheduled', 'costsPerHour.engineReserve', 'costsPerHour.airframeReserve',
  'costsAnnual.insurance', 'costsAnnual.annualInspection', 'costsAnnual.hangarage',
];

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function validateComparable(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') return ['document must be an object'];

  for (const key of REQUIRED_TOP) {
    if (doc[key] === undefined || doc[key] === null || doc[key] === '') {
      errors.push(`${key} is required`);
    }
  }

  // isRobinson is required AND must be a boolean — combined check.
  if (typeof doc.isRobinson !== 'boolean') {
    errors.push('isRobinson must be a boolean');
  }

  if (doc.class && !CLASS_IDS.includes(doc.class)) {
    errors.push(`class must be one of: ${CLASS_IDS.join(', ')}`);
  }

  if (doc.fuelType && !FUEL_TYPES.includes(doc.fuelType)) {
    errors.push(`fuelType must be one of: ${FUEL_TYPES.join(', ')}`);
  }

  if (doc.costsConfidence && !CONFIDENCE.includes(doc.costsConfidence)) {
    errors.push(`costsConfidence must be one of: ${CONFIDENCE.join(', ')}`);
  }

  if (doc.marketStatus && !MARKET_STATUS.includes(doc.marketStatus)) {
    errors.push(`marketStatus must be one of: ${MARKET_STATUS.join(', ')}`);
  }

  for (const path of NUMERIC_PATHS) {
    const v = getPath(doc, path);
    if (v !== undefined && (typeof v !== 'number' || Number.isNaN(v) || v < 0)) {
      errors.push(`${path} must be >= 0`);
    }
  }

  if (doc.marketStatus && !isUsedOnly(doc)) {
    const priceNew = getPath(doc, 'acquisition.priceNewGbp');
    if (priceNew == null) {
      errors.push('acquisition.priceNewGbp is required unless marketStatus is used-only');
    }
  }

  return errors;
}
