function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function fuelPriceFor(aircraft, defaults) {
  const fuelType = aircraft?.fuelType;
  if (fuelType === 'avgas-100ll') return num(defaults?.fuelPrice?.avgas100llGbpPerGal, 0);
  if (fuelType === 'jet-a1') return num(defaults?.fuelPrice?.jetA1GbpPerGal, 0);
  return 0;
}

export function fuelCostPerHour(aircraft, defaults) {
  const burn = num(aircraft?.costsPerHour?.fuelBurnGph, 0);
  return burn * fuelPriceFor(aircraft, defaults);
}

export function docPerHour(aircraft, defaults) {
  return (
    fuelCostPerHour(aircraft, defaults) +
    num(aircraft?.costsPerHour?.mxScheduled, 0) +
    num(aircraft?.costsPerHour?.engineReserve, 0) +
    num(aircraft?.costsPerHour?.airframeReserve, 0)
  );
}

export function annualFixed(aircraft) {
  return (
    num(aircraft?.costsAnnual?.insurance, 0) +
    num(aircraft?.costsAnnual?.annualInspection, 0) +
    num(aircraft?.costsAnnual?.hangarage, 0)
  );
}

export function totalCostPerYear(aircraft, hoursPerYear, defaults) {
  const hrs = num(hoursPerYear, num(defaults?.defaults?.hoursPerYear, 100));
  return annualFixed(aircraft) + hrs * docPerHour(aircraft, defaults);
}

export function multiYearTCO(aircraft, hoursPerYear, years, defaults) {
  const acquisition = aircraft?.acquisition?.priceNewGbp;
  if (acquisition == null) return null;
  const yrs = num(years, num(defaults?.defaults?.yearsOfOwnership, 5));
  return num(acquisition, 0) + yrs * totalCostPerYear(aircraft, hoursPerYear, defaults);
}
