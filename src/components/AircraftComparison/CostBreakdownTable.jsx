import ProvenanceBadge from './ProvenanceBadge';
import { fuelCostPerHour, docPerHour, annualFixed } from '../../lib/tco';
import { isPreProduction } from '../../lib/comparablesSchema';

const GBP = (v) => (v == null ? '—' : `£${Math.round(v).toLocaleString()}`);
const cell = (a, v) => (isPreProduction(a) ? '—' : GBP(v));

export default function CostBreakdownTable({ aircraft, defaults, onReportMistake }) {
  if (!aircraft.length) return null;
  return (
    <section className="comparison-section">
      <div className="comparison-section__label">Cost breakdown</div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Cost</th>
              {aircraft.map((a) => (
                <th key={a.id} scope="col">
                  <div className="comparison-table__head">
                    <span>{a.model}</span>
                    <ProvenanceBadge confidence={a.costsConfidence} source={a.costsSource} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="comparison-table__group-row">
              <th scope="row" colSpan={aircraft.length + 1}>Per hour</th>
            </tr>
            <tr>
              <th scope="row">Fuel</th>
              {aircraft.map((a) => (
                <td key={a.id}>{cell(a, fuelCostPerHour(a, defaults))}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Scheduled MX</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, a.costsPerHour?.mxScheduled)}</td>)}
            </tr>
            <tr>
              <th scope="row">Engine reserve</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, a.costsPerHour?.engineReserve)}</td>)}
            </tr>
            <tr>
              <th scope="row">Airframe reserve</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, a.costsPerHour?.airframeReserve)}</td>)}
            </tr>
            <tr className="comparison-table__total-row">
              <th scope="row">Total per hour (DOC)</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, docPerHour(a, defaults))}</td>)}
            </tr>

            <tr className="comparison-table__group-row">
              <th scope="row" colSpan={aircraft.length + 1}>Annual fixed</th>
            </tr>
            <tr>
              <th scope="row">Insurance</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, a.costsAnnual?.insurance)}</td>)}
            </tr>
            <tr>
              <th scope="row">Annual inspection</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, a.costsAnnual?.annualInspection)}</td>)}
            </tr>
            <tr>
              <th scope="row">Hangarage</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, a.costsAnnual?.hangarage)}</td>)}
            </tr>
            <tr className="comparison-table__total-row">
              <th scope="row">Total annual fixed</th>
              {aircraft.map((a) => <td key={a.id}>{cell(a, annualFixed(a))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" className="comparison-section__report-link" onClick={() => onReportMistake?.()}>
        Spot a mistake?
      </button>
    </section>
  );
}
