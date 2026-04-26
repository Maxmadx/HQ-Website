import ProvenanceBadge from './ProvenanceBadge';

const ROWS = [
  { label: 'Seats', path: 'specs.seats' },
  { label: 'Engine', path: 'specs.engine' },
  { label: 'Cruise speed', path: 'specs.cruiseSpeedKts', unit: 'kts' },
  { label: 'Max speed', path: 'specs.maxSpeedKts', unit: 'kts' },
  { label: 'Range', path: 'specs.rangeNm', unit: 'nm' },
  { label: 'Endurance', path: 'specs.enduranceHrs', unit: 'hrs' },
  { label: 'Useful load', path: 'specs.usefulLoadLbs', unit: 'lb', format: (v) => v?.toLocaleString() },
  { label: 'Fuel capacity', path: 'specs.fuelCapacityGal', unit: 'gal' },
  { label: 'Hover ceiling (IGE)', path: 'specs.hoverCeilingIgeFt', unit: 'ft', format: (v) => v?.toLocaleString() },
];

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function fmt(value, row) {
  if (value == null) return '—';
  const formatted = row.format ? row.format(value) : value;
  return row.unit ? `${formatted} ${row.unit}` : formatted;
}

export default function SpecsTable({ aircraft }) {
  if (!aircraft.length) return null;
  return (
    <section className="comparison-section">
      <div className="comparison-section__label">Performance &amp; specifications</div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col">Spec</th>
              {aircraft.map((a) => (
                <th key={a.id} scope="col">
                  <div className="comparison-table__head">
                    <span>{a.model}</span>
                    <ProvenanceBadge
                      confidence={a.costsConfidence}
                      source={a.costsSource}
                      lastUpdated={a.costsLastUpdated?.toDate?.()?.toISOString?.().slice(0, 10)}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.path}>
                <th scope="row">{row.label}</th>
                {aircraft.map((a) => (
                  <td key={a.id}>{fmt(getPath(a, row.path), row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
