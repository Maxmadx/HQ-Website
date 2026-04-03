import React from 'react';

/**
 * Regulatory Compliance Display - comp-086
 * EXACT conversion from inspiration-2.html lines 4136-4169
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-086
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const RegulatoryCompliance = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container">
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">Credentials</span>
            <h2 className="hq-section-title">Fully Certified</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hq-primary)', marginBottom: '0.5rem' }}>CAA</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>UK Civil Aviation Authority</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)', margin: 0 }}>Approved Training Organisation</p>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--hq-accent)', display: 'inline-block', marginTop: '0.5rem' }}>Verify →</a>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem' }}>EASA</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>European Aviation Safety</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)', margin: 0 }}>Part-145 Maintenance</p>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--hq-accent)', display: 'inline-block', marginTop: '0.5rem' }}>Verify →</a>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem' }}>RHC</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Robinson Helicopter</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)', margin: 0 }}>Authorized Dealer &amp; Service</p>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--hq-accent)', display: 'inline-block', marginTop: '0.5rem' }}>Verify →</a>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hq-primary)', marginBottom: '0.5rem' }}>FAA</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>US Federal Aviation</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)', margin: 0 }}>License Conversions</p>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--hq-accent)', display: 'inline-block', marginTop: '0.5rem' }}>Learn more →</a>
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

export default RegulatoryCompliance;
