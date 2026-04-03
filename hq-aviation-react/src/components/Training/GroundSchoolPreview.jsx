import React from 'react';

/**
 * Ground School Preview - comp-048
 * EXACT conversion from inspiration-2.html
 * Status: approved
 * Feedback: "Explanatory page - how getting your PPL works. Very good component"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-048
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const GroundSchoolPreview = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '900px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">Theory Training</span>
            <h2 className="hq-section-title">9 Ground School Subjects</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>01</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Air Law</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Regulations &amp; procedures</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>02</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Navigation</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Charts &amp; flight planning</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>03</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Meteorology</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Weather understanding</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>04</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Human Performance</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Physiology &amp; psychology</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>05</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Principles of Flight</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Aerodynamics</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>06</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Operations</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Flight procedures</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>07</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Performance</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Weight &amp; balance</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>08</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Communications</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Radio procedures</p>
              </div>
            </div>
            <div style={{ background: 'var(--hq-background)', padding: '1.25rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--hq-primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexShrink: 0 }}>09</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Aircraft Knowledge</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--hq-muted)', margin: 0 }}>Systems &amp; engines</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="Explanatory page - how getting your PPL works. Very good component"
        />
      )}
    </>
  );
};

export default GroundSchoolPreview;
