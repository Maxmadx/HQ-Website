import React from 'react';

const ComponentNote = ({ status, feedback, exampleText }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-071
      </div>
      <p className="component-note__text">{feedback}</p>
      {exampleText && (
        <p className="component-note__text" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
          Example: "{exampleText}"
        </p>
      )}
    </div>
  );
};

const LimitedSlotsCounter = ({ showNote = true, slots = 6, cohort = "HQ Academy September Alumni" }) => {
  return (
    <>
      <section style={{
        background: 'linear-gradient(90deg, var(--hq-accent) 0%, #c93e25 100%)',
        padding: '1.5rem 2rem',
        color: '#fff'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                opacity: 0.8,
                display: 'block'
              }}>LIMITED AVAILABILITY</span>
              <span style={{
                fontSize: '1.1rem',
                fontWeight: 700
              }}>{slots} spots remaining for {cohort}</span>
            </div>
          </div>
          <a href="#" className="hq-btn" style={{
            background: '#fff',
            color: 'var(--hq-accent)'
          }}>Reserve Your Spot</a>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="Awesome idea"
          exampleText="6 spots remaining for HQ Academy September Alumni"
        />
      )}
    </>
  );
};

export default LimitedSlotsCounter;
