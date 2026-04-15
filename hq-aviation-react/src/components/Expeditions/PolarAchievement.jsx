import React from 'react';

/**
 * Polar Achievement - comp-052
 * EXACT conversion from inspiration-2.html lines 2796-2827
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-052
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const PolarAchievement = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D2F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: "url('data:image/svg+xml,...') center/cover", opacity: 0.1 }}></div>
        <div className="hq-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#87CEEB', display: 'block', marginBottom: '1rem' }}>WORLD FIRST</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>First to Both Poles by Helicopter</h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>Captain Quentin Smith made history as the first person to land a helicopter at both the Geographic North and South Poles—a feat once thought impossible.</p>
              <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#87CEEB', marginBottom: '0.25rem' }}>NORTH POLE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>90°N</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>2005</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#87CEEB', marginBottom: '0.25rem' }}>SOUTH POLE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>90°S</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>2013</div>
                </div>
              </div>
              <a href="#" className="hq-btn hq-btn--accent">Read the Full Story</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '300px', height: '300px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '20px', background: '#E04A2F', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '20px', background: '#87CEEB', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '4rem' }}>🌍</span>
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

export default PolarAchievement;
