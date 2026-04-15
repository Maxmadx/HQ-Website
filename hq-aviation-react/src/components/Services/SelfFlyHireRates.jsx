import React from 'react';

/**
 * Self-Fly Hire Rates - comp-053
 * EXACT conversion from inspiration-2.html lines 2838-2868
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-053
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const SelfFlyHireRates = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '800px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">Qualified Pilots</span>
            <h2 className="hq-section-title">Self-Fly Hire Rates</h2>
          </div>
          <div style={{ background: 'var(--hq-background)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1rem 1.5rem', background: 'var(--hq-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div>Aircraft</div>
              <div style={{ textAlign: 'center' }}>Wet Rate</div>
              <div style={{ textAlign: 'center' }}>Block (10hr)</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--hq-border)', alignItems: 'center' }}>
              <div><strong>Robinson R22 Beta II</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>2-seat piston</span></div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>£300/hr</div>
              <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#22c55e' }}>£285/hr</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--hq-border)', alignItems: 'center' }}>
              <div><strong>Robinson R44 Raven II</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>4-seat piston</span></div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>£450/hr</div>
              <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#22c55e' }}>£425/hr</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', alignItems: 'center' }}>
              <div><strong>Robinson R66 Turbine</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>5-seat turbine</span></div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>£750/hr</div>
              <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#22c55e' }}>£710/hr</div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)', textAlign: 'center', marginTop: '1rem' }}>Rates include fuel. Subject to currency and checkout requirements.</p>
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

export default SelfFlyHireRates;
