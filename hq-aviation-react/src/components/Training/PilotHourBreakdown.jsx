import React from 'react';

/**
 * Pilot Hour Breakdown - comp-087
 * EXACT conversion from inspiration-2.html lines 4180-4228
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-087
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const PilotHourBreakdown = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '700px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">PPL(H) Requirements</span>
            <h2 className="hq-section-title">Hour Breakdown</h2>
          </div>
          <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Dual Instruction</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>25 hours minimum</span>
                </div>
                <div style={{ height: '8px', background: 'var(--hq-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '55%', background: 'var(--hq-accent)', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Solo Flight</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>10 hours minimum</span>
                </div>
                <div style={{ height: '8px', background: 'var(--hq-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '22%', background: 'var(--hq-primary)', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cross-Country</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>5 hours minimum</span>
                </div>
                <div style={{ height: '8px', background: 'var(--hq-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '11%', background: '#22c55e', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Solo Cross-Country</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>5 hours minimum</span>
                </div>
                <div style={{ height: '8px', background: 'var(--hq-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '11%', background: '#6366f1', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--hq-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total Minimum</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hq-primary)' }}>45 hours</span>
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

export default PilotHourBreakdown;
