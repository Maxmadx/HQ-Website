import React, { useState } from 'react';

const rebuildStepsByModel = {
  R22: [
    { label: 'Airframe', before: '/assets/images/rebuilds/r22/airframe-before.jpg', after: '/assets/images/rebuilds/r22/airframe-after.jpg', beforeDesc: 'Corrosion and fatigue across the tubular steel frame after 12,000 hours.', afterDesc: 'Stripped, inspected, repaired and re-protected — ready for another lifetime.' },
    { label: 'Engine', before: '/assets/images/rebuilds/r22/engine-before.jpg', after: '/assets/images/rebuilds/r22/engine-after.jpg', beforeDesc: '2,200 hours on the Lycoming O-360. Worn cam lobes, degraded seals.', afterDesc: 'Zero-time overhaul. Factory-new components throughout, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/r22/avionics-before.jpg', after: '/assets/images/rebuilds/r22/avionics-after.jpg', beforeDesc: 'Original steam gauges. Faded placards, intermittent radios, no GPS.', afterDesc: 'Modern glass panel. Garmin G5, GPS/COM, ADS-B Out, digital engine monitor.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/r22/wiring-before.jpg', after: '/assets/images/rebuilds/r22/wiring-after.jpg', beforeDesc: 'Brittle insulation, spliced repairs, corroded connectors throughout.', afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels.' },
    { label: 'Interior', before: '/assets/images/rebuilds/r22/interior-before.jpg', after: '/assets/images/rebuilds/r22/interior-after.jpg', beforeDesc: 'Worn seat cushions, cracked plastics, sun-bleached trim.', afterDesc: 'New upholstery, replacement plastics, noise-dampening panels.' },
    { label: 'Paint', before: '/assets/images/rebuilds/r22/paint-before.jpg', after: '/assets/images/rebuilds/r22/paint-after.jpg', beforeDesc: 'Oxidised, chipped and faded. Multiple touch-ups visible.', afterDesc: 'Stripped to bare metal and refinished in custom livery. UV-sealed.' },
  ],
  R44: [
    { label: 'Airframe', before: '/assets/images/rebuilds/r44/airframe-before.jpg', after: '/assets/images/rebuilds/r44/airframe-after.jpg', beforeDesc: 'Corrosion, fatigue cracks and fifteen years of wear across the bare airframe.', afterDesc: 'Stripped, inspected, repaired and re-protected — ready for another lifetime.' },
    { label: 'Engine', before: '/assets/images/rebuilds/r44/engine-before.jpg', after: '/assets/images/rebuilds/r44/engine-after.jpg', beforeDesc: '2,200 hours on the IO-540. Worn bearings, degraded seals, metal in the filter.', afterDesc: 'Zero-time overhaul. Factory-new components throughout, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/r44/avionics-before.jpg', after: '/assets/images/rebuilds/r44/avionics-after.jpg', beforeDesc: 'Original analogue panel. Faded placards, intermittent radios, no GPS.', afterDesc: 'Full glass cockpit. Garmin suite, GPS/NAV/COM, ADS-B, four-axis autopilot.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/r44/wiring-before.jpg', after: '/assets/images/rebuilds/r44/wiring-after.jpg', beforeDesc: "Brittle insulation, spliced repairs, corroded connectors. An electrician's nightmare.", afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels throughout.' },
    { label: 'Interior', before: '/assets/images/rebuilds/r44/interior-before.jpg', after: '/assets/images/rebuilds/r44/interior-after.jpg', beforeDesc: 'Cracked leather, worn carpet, sun-bleached trim. Functional but tired.', afterDesc: 'Hand-stitched leather, custom upholstery, noise-dampening panels. Better than new.' },
    { label: 'Paint', before: '/assets/images/rebuilds/r44/paint-before.jpg', after: '/assets/images/rebuilds/r44/paint-after.jpg', beforeDesc: 'Oxidised, chipped and faded. The livery has seen better days.', afterDesc: 'Stripped to bare metal and refinished in custom livery. Mirror finish, UV-sealed.' },
  ],
  R66: [
    { label: 'Airframe', before: '/assets/images/rebuilds/r66/airframe-before.jpg', after: '/assets/images/rebuilds/r66/airframe-after.jpg', beforeDesc: 'Stress fractures and corrosion across the aluminium airframe.', afterDesc: 'Full strip, NDT inspection, repair and re-protection to exceed factory spec.' },
    { label: 'Engine', before: '/assets/images/rebuilds/r66/engine-before.jpg', after: '/assets/images/rebuilds/r66/engine-after.jpg', beforeDesc: 'RR300 turbine at TBO. Hot section wear, compressor erosion, oil leaks.', afterDesc: 'Factory-overhauled RR300. Zero-time, new hot section, test-run and certified.' },
    { label: 'Avionics', before: '/assets/images/rebuilds/r66/avionics-before.jpg', after: '/assets/images/rebuilds/r66/avionics-after.jpg', beforeDesc: 'First-gen panel. Basic GPS, ageing radios, no synthetic vision.', afterDesc: 'Garmin G500H TXi, GTN 750Xi, GFC 600H autopilot, ADS-B In/Out, HTAWS.' },
    { label: 'Wiring', before: '/assets/images/rebuilds/r66/wiring-before.jpg', after: '/assets/images/rebuilds/r66/wiring-after.jpg', beforeDesc: 'Degraded looms, corroded connectors, aftermarket splices throughout.', afterDesc: 'Complete rewire. New looms, mil-spec connectors, laser-etched labels throughout.' },
    { label: 'Interior', before: '/assets/images/rebuilds/r66/interior-before.jpg', after: '/assets/images/rebuilds/r66/interior-after.jpg', beforeDesc: 'Worn leather, faded carpet, scuffed trim. Shows its hours.', afterDesc: 'Premium leather, Alcantara headliner, USB charging, noise-dampening throughout.' },
    { label: 'Paint', before: '/assets/images/rebuilds/r66/paint-before.jpg', after: '/assets/images/rebuilds/r66/paint-after.jpg', beforeDesc: 'Faded metallic finish, stone chips along the belly, oxidised trim.', afterDesc: 'Full respray in custom livery. Metallic or solid, mirror finish, ceramic coated.' },
  ],
};

const MODEL_SECTION = { R22: 'rebuilds-steps-r22', R44: 'rebuilds-steps-r44', R66: 'rebuilds-steps-r66' };

const css = `
  .rb__beforeafter { border: 1px solid #e8e6e2; background: #fff; padding: 1.5rem; margin-top: 3rem; }
  .rb__beforeafter-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7a7a; display: block; margin-bottom: 1.25rem; }
  .rb__beforeafter-item { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.25rem; align-items: center; }
  .rb__beforeafter-before, .rb__beforeafter-after { padding: 0; }
  .rb__beforeafter-before span, .rb__beforeafter-after span { display: block; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; color: #999; margin: 0.75rem 0 0.25rem; }
  .rb__beforeafter-before p, .rb__beforeafter-after p { font-size: 0.8rem; line-height: 1.5; color: #666; margin: 0; }
  .rb__beforeafter-arrow { font-size: 1.25rem; color: #ccc; display: flex; align-items: center; justify-content: center; }
  .rb__beforeafter-img { aspect-ratio: 16/9; background: linear-gradient(135deg, #f5f4f0 0%, #eae8e4 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px; }
  .rb__beforeafter-img img { width: 100%; height: 100%; object-fit: cover; }
  .rb__beforeafter-controls { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #e8e6e2; flex-wrap: wrap; }
  .rb__beforeafter-models { display: flex; gap: 0.4rem; }
  .rb__beforeafter-controls-divider { width: 1px; height: 24px; background: #ddd; }
  .rb__beforeafter-steps { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .rb__beforeafter-step { display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; background: #faf9f6; border: 1px solid #e8e6e2; cursor: pointer; transition: all 0.25s ease; font-family: inherit; border-radius: 3px; }
  .rb__beforeafter-step:hover { border-color: #ccc; background: #f0eeea; }
  .rb__beforeafter-step--active { border-color: #1a1a1a; background: #1a1a1a; color: #fff; }
  .rb__beforeafter-step--active .rb__beforeafter-step-label { color: #fff; }
  .rb__beforeafter-step-label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666; }
  @media (max-width: 640px) {
    .rb__beforeafter-item { grid-template-columns: 1fr; }
    .rb__beforeafter-arrow { transform: rotate(90deg); text-align: center; padding-top: 0; }
    .rb__beforeafter { padding: 1rem; }
  }
`;

export default function BeforeAfter({ pageImages = {} }) {
  const [activeModel, setActiveModel] = useState('R44');
  const [rebuildStep, setRebuildStep] = useState(0);
  const steps = rebuildStepsByModel[activeModel];
  const sectionId = MODEL_SECTION[activeModel];
  const cmsImages = pageImages[sectionId] || [];

  const handleModelChange = (model) => {
    setActiveModel(model);
    setRebuildStep(0);
  };

  const beforeSrc = cmsImages[rebuildStep * 2]?.url || steps[rebuildStep].before;
  const afterSrc  = cmsImages[rebuildStep * 2 + 1]?.url || steps[rebuildStep].after;

  return (
    <>
      <style>{css}</style>
      <div className="rb__beforeafter" data-cms-section={sectionId}>
        <span className="rb__beforeafter-label">The Transformation</span>
        <div className="rb__beforeafter-item">
          <div className="rb__beforeafter-before">
            <div className="rb__beforeafter-img">
              <img src={beforeSrc} alt={`${steps[rebuildStep].label} — before`} />
            </div>
            <span>BEFORE</span>
            <p>{steps[rebuildStep].beforeDesc}</p>
          </div>
          <div className="rb__beforeafter-arrow">&rarr;</div>
          <div className="rb__beforeafter-after">
            <div className="rb__beforeafter-img">
              <img src={afterSrc} alt={`${steps[rebuildStep].label} — after`} />
            </div>
            <span>AFTER</span>
            <p>{steps[rebuildStep].afterDesc}</p>
          </div>
        </div>

        <div className="rb__beforeafter-controls">
          <div className="rb__beforeafter-models">
            {['R22', 'R44', 'R66'].map(model => (
              <button
                key={model}
                className={`rb__beforeafter-step ${activeModel === model ? 'rb__beforeafter-step--active' : ''}`}
                onClick={() => handleModelChange(model)}
              >
                <span className="rb__beforeafter-step-label">{model}</span>
              </button>
            ))}
          </div>
          <div className="rb__beforeafter-controls-divider" />
          <div className="rb__beforeafter-steps">
            {steps.map((step, i) => (
              <button
                key={i}
                className={`rb__beforeafter-step ${rebuildStep === i ? 'rb__beforeafter-step--active' : ''}`}
                onClick={() => setRebuildStep(i)}
              >
                <span className="rb__beforeafter-step-label">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
