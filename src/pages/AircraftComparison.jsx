import { useState, useMemo, useEffect } from 'react';
import { useCollection, useDocument } from '../hooks/useFirestore';
import { useComparisonState } from '../hooks/useComparisonState';
import ComparisonSelector from '../components/AircraftComparison/ComparisonSelector';
import SpecsTable from '../components/AircraftComparison/SpecsTable';
import CostBreakdownTable from '../components/AircraftComparison/CostBreakdownTable';
import TCOSummary from '../components/AircraftComparison/TCOSummary';
import ComparisonCTA from '../components/AircraftComparison/ComparisonCTA';
import ReportMistakeModal from '../components/AircraftComparison/ReportMistakeModal';
import FooterMinimal from '../components/FooterMinimal';
import '../assets/css/main.css';
import '../assets/css/components.css';

export default function AircraftComparison() {
  useEffect(() => {
    document.title = 'Aircraft Comparison · HQ Aviation';
  }, []);

  const { docs: comparables, loading, error } = useCollection('comparables');
  const { data: defaults } = useDocument('comparison_defaults', 'global');
  const { selectedIds, hours, years, addModel, removeModel, setHours, setYears } = useComparisonState();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportAircraftId, setReportAircraftId] = useState(null);

  const selectedAircraft = useMemo(
    () => selectedIds.map((id) => comparables.find((c) => c.id === id)).filter(Boolean),
    [comparables, selectedIds],
  );

  function openReport(id) {
    setReportAircraftId(id || selectedAircraft[0]?.id || '');
    setReportOpen(true);
  }

  return (
    <>
      <main className="aircraft-comparison">
        <header className="aircraft-comparison__hero">
          <div className="aircraft-comparison__eyebrow">Decision Tool</div>
          <h1>Compare <span className="aircraft-comparison__hero-em">Aircraft</span></h1>
          <p className="aircraft-comparison__intro">
            Honest spec, cost, and ownership data. Robinson figures from HQ's own MX records;
            other manufacturers from publicly sourced industry data, clearly labelled.
          </p>
        </header>

        {loading ? (
          <div className="aircraft-comparison__loading">Loading aircraft data…</div>
        ) : error ? (
          <div className="aircraft-comparison__error">
            Couldn't load aircraft data — please refresh, or call our team.
          </div>
        ) : comparables.length === 0 ? (
          <div className="aircraft-comparison__placeholder">
            Aircraft data is being added. Check back soon.
          </div>
        ) : (
          <>
            <ComparisonSelector
              comparables={comparables}
              selectedIds={selectedIds}
              onAdd={addModel}
              onRemove={removeModel}
            />

            {selectedAircraft.length === 0 ? (
              <div className="aircraft-comparison__placeholder">
                Select two or more aircraft above to start comparing.
              </div>
            ) : selectedAircraft.length === 1 ? (
              <>
                <SpecsTable aircraft={selectedAircraft} />
                <p className="aircraft-comparison__placeholder">
                  Add another aircraft to see cost and TCO comparison.
                </p>
              </>
            ) : (
              <>
                <SpecsTable aircraft={selectedAircraft} />
                <CostBreakdownTable
                  aircraft={selectedAircraft}
                  defaults={defaults}
                  onReportMistake={() => openReport()}
                />
                <TCOSummary
                  aircraft={selectedAircraft}
                  hours={hours}
                  years={years}
                  defaults={defaults}
                  onChangeHours={setHours}
                  onChangeYears={setYears}
                  onReportMistake={() => openReport()}
                />
                <ComparisonCTA selectedAircraft={selectedAircraft} />
              </>
            )}

            <details className="aircraft-comparison__methodology" open={selectedAircraft.length === 0}>
              <summary>Sources &amp; methodology</summary>
              <div className="aircraft-comparison__methodology-body">
                <p>
                  Robinson cost figures are sourced from HQ Aviation's internal MX records.
                  Other manufacturers' figures are estimates compiled from publicly available
                  sources (POH, factory operating-cost documents, broker listings, industry
                  surveys) and clearly badged "estimate."
                </p>
                <p>
                  TCO is calculated as: <em>acquisition price + (years × (annual fixed costs + hours/yr × direct operating cost/hr))</em>.
                  Resale value is not subtracted. Hangarage figures vary widely; many home-based
                  owners pay £0.
                </p>
                <p className="aircraft-comparison__fuel-assumption">
                  Fuel-price assumption: Avgas 100LL £{defaults?.fuelPrice?.avgas100llGbpPerGal ?? '—'}/gal,
                  Jet A-1 £{defaults?.fuelPrice?.jetA1GbpPerGal ?? '—'}/gal.
                </p>
                <ul>
                  {comparables.map((c) => (
                    <li key={c.id}>
                      <strong>{c.model}:</strong> {c.costsSource} ({c.costsConfidence})
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </>
        )}

        <ReportMistakeModal
          open={reportOpen}
          aircraft={selectedAircraft.length ? selectedAircraft : comparables}
          defaultAircraftId={reportAircraftId}
          onClose={() => setReportOpen(false)}
        />
      </main>

      <FooterMinimal />
    </>
  );
}
