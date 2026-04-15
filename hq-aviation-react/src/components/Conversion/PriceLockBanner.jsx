import React from 'react';

const ComponentNote = ({ status, feedback, variants }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-072
      </div>
      <p className="component-note__text">{feedback}</p>
      {variants && (
        <p className="component-note__text" style={{ marginTop: '0.5rem' }}>
          Variants: {variants.join(', ')}
        </p>
      )}
    </div>
  );
};

const PriceLockBanner = ({ showNote = true, type = 'training' }) => {
  const content = {
    training: {
      icon: 'fa-graduation-cap',
      title: 'Lock In Today\'s Training Rates',
      description: 'Protect yourself from future price increases. Secure your PPL journey at current rates with a deposit.',
      cta: 'Learn About Price Lock'
    },
    maintenance: {
      icon: 'fa-tools',
      title: 'Lock In Maintenance Rates',
      description: 'Secure today\'s hourly rates for your annual and overhaul services with a maintenance deposit.',
      cta: 'Enquire About Deposits'
    }
  };

  const current = content[type];

  return (
    <>
      <section style={{
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8b 100%)',
        color: '#fff'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <i className={`fas ${current.icon}`} style={{ fontSize: '2rem' }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>{current.title}</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>{current.description}</p>
          </div>
          <a href="#" className="hq-btn" style={{
            background: '#fff',
            color: '#1e3a5f'
          }}>{current.cta}</a>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="Good idea to take deposits from people at a set price, softens the blow of price increases. I wonder if the same thing could be done for maintenance"
          variants={['training deposits', 'maintenance deposits']}
        />
      )}
    </>
  );
};

export default PriceLockBanner;
