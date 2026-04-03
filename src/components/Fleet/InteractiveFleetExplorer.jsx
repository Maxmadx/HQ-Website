import React, { useState } from 'react';

/**
 * Interactive Fleet Explorer - fleet-interactive
 * EXACT conversion from inspiration-2.html lines 1391-1433
 * Status: approved
 * Feedback: "This should be the component in Our Fleet"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - fleet-interactive
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const InteractiveFleetExplorer = ({ showNote = true }) => {
  const [activeAircraft, setActiveAircraft] = useState(0);

  // Aircraft data for interactive switching
  const aircraftData = [
    {
      name: 'Robinson R66 Turbine',
      image: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',
      description: 'The pinnacle of personal aviation. 5-seat turbine helicopter with Rolls-Royce power.',
      specs: { shp: 300, seats: 5, knots: 140, range: 350 }
    },
    {
      name: 'Robinson R44 Raven II',
      image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
      description: "The world's best-selling civil helicopter. Perfect for training and personal use.",
      specs: { shp: 245, seats: 4, knots: 113, range: 300 }
    },
    {
      name: 'Robinson R22 Beta II',
      image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
      description: 'The ideal trainer. Affordable, efficient, and the standard for flight schools worldwide.',
      specs: { shp: 131, seats: 2, knots: 96, range: 200 }
    },
    {
      name: 'Hughes 500',
      image: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',
      description: 'Iconic turbine helicopter with proven reliability and versatility.',
      specs: { shp: 420, seats: 5, knots: 130, range: 280 }
    },
    {
      name: 'AS355 Twin Squirrel',
      image: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',
      description: 'Twin-engine safety and performance for demanding operations.',
      specs: { shp: 840, seats: 6, knots: 155, range: 400 }
    }
  ];

  const current = aircraftData[activeAircraft];

  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container">
          <div className="hq-section-header" style={{ marginBottom: '2rem' }}>
            <span className="hq-overline hq-overline--accent">Our Fleet</span>
            <h2 className="hq-section-title">Explore Our Aircraft</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button onClick={() => setActiveAircraft(0)} style={{ padding: '0.75rem 1.5rem', background: activeAircraft === 0 ? 'var(--hq-primary)' : 'transparent', color: activeAircraft === 0 ? '#fff' : 'var(--hq-primary)', border: activeAircraft === 0 ? 'none' : '1px solid var(--hq-border)', borderRadius: '4px', fontFamily: 'var(--font-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>R66 Turbine</button>
            <button onClick={() => setActiveAircraft(1)} style={{ padding: '0.75rem 1.5rem', background: activeAircraft === 1 ? 'var(--hq-primary)' : 'transparent', color: activeAircraft === 1 ? '#fff' : 'var(--hq-primary)', border: activeAircraft === 1 ? 'none' : '1px solid var(--hq-border)', borderRadius: '4px', fontFamily: 'var(--font-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>R44 Raven II</button>
            <button onClick={() => setActiveAircraft(2)} style={{ padding: '0.75rem 1.5rem', background: activeAircraft === 2 ? 'var(--hq-primary)' : 'transparent', color: activeAircraft === 2 ? '#fff' : 'var(--hq-primary)', border: activeAircraft === 2 ? 'none' : '1px solid var(--hq-border)', borderRadius: '4px', fontFamily: 'var(--font-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>R22 Beta II</button>
            <button onClick={() => setActiveAircraft(3)} style={{ padding: '0.75rem 1.5rem', background: activeAircraft === 3 ? 'var(--hq-primary)' : 'transparent', color: activeAircraft === 3 ? '#fff' : 'var(--hq-primary)', border: activeAircraft === 3 ? 'none' : '1px solid var(--hq-border)', borderRadius: '4px', fontFamily: 'var(--font-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Hughes 500</button>
            <button onClick={() => setActiveAircraft(4)} style={{ padding: '0.75rem 1.5rem', background: activeAircraft === 4 ? 'var(--hq-primary)' : 'transparent', color: activeAircraft === 4 ? '#fff' : 'var(--hq-primary)', border: activeAircraft === 4 ? 'none' : '1px solid var(--hq-border)', borderRadius: '4px', fontFamily: 'var(--font-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>AS355 Twin Squirrel</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <img src={current.image} alt={current.name} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{current.name}</h3>
              <p style={{ color: 'var(--hq-body)', marginBottom: '1.5rem' }}>{current.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '8px' }}><span style={{ fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>{current.specs.shp}</span><span style={{ fontSize: '0.7rem', color: 'var(--hq-muted)' }}>SHP</span></div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '8px' }}><span style={{ fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>{current.specs.seats}</span><span style={{ fontSize: '0.7rem', color: 'var(--hq-muted)' }}>SEATS</span></div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '8px' }}><span style={{ fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>{current.specs.knots}</span><span style={{ fontSize: '0.7rem', color: 'var(--hq-muted)' }}>KNOTS</span></div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '8px' }}><span style={{ fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>{current.specs.range}</span><span style={{ fontSize: '0.7rem', color: 'var(--hq-muted)' }}>NM</span></div>
              </div>
              <div className="hq-btn-group">
                <a href="#" className="hq-btn hq-btn--primary">Configure Yours</a>
                <a href="#" className="hq-btn hq-btn--outline">Request Quote</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="This should be the component in Our Fleet"
        />
      )}
    </>
  );
};

export default InteractiveFleetExplorer;
