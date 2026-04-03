import React from 'react';

/**
 * Aircraft Management - comp-059
 * EXACT conversion from inspiration-2.html lines 3099-3137
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-059
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const AircraftManagement = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '900px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">For Owners</span>
            <h2 className="hq-section-title">Aircraft Management</h2>
          </div>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--hq-body)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Let us handle the complexity of ownership while you enjoy the freedom of flight.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--hq-accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>🔧</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Maintenance Scheduling</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', margin: 0 }}>We track all inspections and keep you compliant</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--hq-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>📋</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Regulatory Compliance</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', margin: 0 }}>AD tracking, SB compliance, documentation</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', background: '#22c55e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>💰</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Charter Revenue</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', margin: 0 }}>Generate income when you're not flying</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', background: '#6366f1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>🏠</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Secure Storage</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', margin: 0 }}>Heated hangar with 24/7 security</p>
              </div>
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

export default AircraftManagement;
