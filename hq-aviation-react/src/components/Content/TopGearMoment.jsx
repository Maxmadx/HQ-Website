import React from 'react';

/**
 * Top Gear Moment - comp-065
 * EXACT conversion from inspiration-2.html lines 3327-3358
 * Status: approved
 * Feedback: "I don't know in which section this would fit but it's a good component"
 * Note: placement TBD
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-065
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const TopGearMoment = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <div className="hq-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                  <div style={{ width: 0, height: 0, borderLeft: '24px solid #fff', borderTop: '14px solid transparent', borderBottom: '14px solid transparent', marginLeft: '8px' }}></div>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--hq-accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '4px' }}>TOP GEAR</div>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--hq-accent)', display: 'block', marginBottom: '1rem' }}>ICONIC MOMENT</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>Landing on a Moving Car</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '1.5rem' }}>Captain Q's legendary stunt for Top Gear—landing a helicopter on a moving car—showcased precision flying at its absolute best.</p>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                <span>📺 BBC Two</span>
                <span>👀 10M+ views</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="I don't know in which section this would fit but it's a good component"
        />
      )}
    </>
  );
};

export default TopGearMoment;
