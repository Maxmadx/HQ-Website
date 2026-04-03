import React from 'react';

/**
 * Hangarage Features - comp-038
 * EXACT conversion from inspiration-2.html lines 2107-2159
 * Status: needs-work
 * Feedback: "Yes hangarage is a good one to have like this. Make the full list of benefits, including proximity to Central London"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-038
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const HangarageFeatures = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="hq-overline hq-overline--accent">Aircraft Storage</span>
              <h2 className="hq-section-title" style={{ marginBottom: '1.5rem' }}>Hangarage at Denham</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--hq-body)', lineHeight: 1.8, marginBottom: '2rem' }}>Your helicopter deserves the best care. Our purpose-built hangars offer premium storage just 20 minutes from Central London.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(224,74,47,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🏠</div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Heated Hangars</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Climate-controlled storage</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(224,74,47,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🔒</div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>24/7 Security</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>CCTV & access control</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(224,74,47,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>⛽</div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>On-Site Fuel</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Avgas & Jet A1</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(224,74,47,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🛠</div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Maintenance</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Part-145 approved</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', borderRadius: '12px', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '4rem', opacity: 0.3 }}>🚁</span>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Yes hangarage is a good one to have like this. Make the full list of benefits, including proximity to Central London"
        />
      )}
    </>
  );
};

export default HangarageFeatures;
