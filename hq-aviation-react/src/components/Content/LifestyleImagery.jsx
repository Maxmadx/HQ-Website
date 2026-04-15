import React from 'react';

/**
 * Lifestyle Imagery - comp-023
 * EXACT conversion from inspiration-2.html lines 233-261
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-023
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const LifestyleImagery = ({ showNote = true }) => {
  return (
    <>
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '250px 250px', gap: '0.5rem' }}>
        <div style={{ gridRow: 'span 2', background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp') center/cover", display: 'flex', alignItems: 'flex-end', padding: '2rem', color: '#fff' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', opacity: 0.8 }}>EXPEDITION</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Alpine Adventure</h3>
          </div>
        </div>
        <div style={{ background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp') center/cover", display: 'flex', alignItems: 'flex-end', padding: '1.5rem', color: '#fff' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>TRAINING</span>
        </div>
        <div style={{ background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png') center/cover no-repeat", backgroundColor: '#f5f5f2', display: 'flex', alignItems: 'flex-end', padding: '1.5rem', color: '#fff' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>OWNERSHIP</span>
        </div>
        <div style={{ background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/assets/images/facility/busy-hangar.jpg') center/cover", display: 'flex', alignItems: 'flex-end', padding: '1.5rem', color: '#fff' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>MAINTENANCE</span>
        </div>
        <div style={{ background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/assets/images/expeditions/north-pole.jpg') center/cover", display: 'flex', alignItems: 'flex-end', padding: '1.5rem', color: '#fff' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>ADVENTURE</span>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback={null}
        />
      )}
    </>
  );
};

export default LifestyleImagery;
