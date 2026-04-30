import { multiYearTCO, totalCostPerYear } from '../../lib/tco';
import { isPreProduction } from '../../lib/comparablesSchema';

const GBP_LARGE = (v) => {
  if (v == null) return '—';
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `£${Math.round(v / 1000)}k`;
  return `£${Math.round(v)}`;
};

export default function TCOSummary({ aircraft, hours, years, defaults, onChangeHours, onChangeYears, onReportMistake }) {
  if (!aircraft.length) return null;
  const effectiveHours = hours ?? defaults?.defaults?.hoursPerYear ?? 100;
  const effectiveYears = years ?? defaults?.defaults?.yearsOfOwnership ?? 5;

  return (
    <section className="comparison-section comparison-section--tco">
      <div className="comparison-section__head">
        <div className="comparison-section__label">{effectiveYears}-year total cost of ownership</div>
        <div className="comparison-section__controls">
          <label>
            Hours/yr
            <input
              type="number"
              min={10}
              max={1000}
              step={10}
              value={effectiveHours}
              onChange={(e) => onChangeHours(Number(e.target.value) || null)}
            />
          </label>
          <label>
            Years
            <input
              type="number"
              min={1}
              max={20}
              step={1}
              value={effectiveYears}
              onChange={(e) => onChangeYears(Number(e.target.value) || null)}
            />
          </label>
        </div>
      </div>

      <div className="tco-cards">
        {aircraft.map((a) => {
          const acquisition = a.acquisition?.priceNewGbp;
          const usedRange = a.acquisition?.priceUsedRangeGbp;
          if (isPreProduction(a)) {
            return (
              <div key={a.id} className="tco-card">
                <div className="tco-card__name">{a.model}</div>
                <div className="tco-card__total">—</div>
                <div className="tco-card__caption">
                  pre-production · starting at {GBP_LARGE(acquisition)} · operating costs unavailable until certification
                </div>
              </div>
            );
          }
          const tco = multiYearTCO(a, effectiveHours, effectiveYears, defaults);
          const annualOp = totalCostPerYear(a, effectiveHours, defaults);
          return (
            <div key={a.id} className="tco-card">
              <div className="tco-card__name">{a.model}</div>
              <div className="tco-card__total">{GBP_LARGE(tco)}</div>
              <div className="tco-card__caption">
                {tco == null && usedRange ? (
                  <>used market only · {GBP_LARGE(usedRange.low)}–{GBP_LARGE(usedRange.high)}</>
                ) : (
                  <>before resale · incl. {GBP_LARGE(acquisition)} acquisition · {GBP_LARGE(annualOp)}/yr operating</>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" className="comparison-section__report-link" onClick={() => onReportMistake?.()}>
        Spot a mistake?
      </button>
    </section>
  );
}
