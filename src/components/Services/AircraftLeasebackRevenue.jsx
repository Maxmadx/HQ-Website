import React from 'react';

/**
 * Aircraft Leaseback Revenue - comp-075
 * EXACT conversion from inspiration-2.html lines 3739-3769
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-075
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const AircraftLeasebackRevenue = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container" style={{ maxWidth: '800px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">For Owners</span>
            <h2 className="hq-section-title">Leaseback Program</h2>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--hq-body)', textAlign: 'center', marginBottom: '2rem' }}>Put your helicopter to work when you're not flying. Our leaseback program generates income while covering fixed costs.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--hq-muted)', marginBottom: '0.5rem' }}>R22 Estimated</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>£8-12k</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>per year</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--hq-muted)', marginBottom: '0.5rem' }}>R44 Estimated</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>£15-25k</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>per year</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--hq-muted)', marginBottom: '0.5rem' }}>R66 Estimated</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>£30-50k</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>per year</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <a href="#" className="hq-btn hq-btn--primary">Discuss Leaseback</a>
            </div>
          </div>
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

export default AircraftLeasebackRevenue;
