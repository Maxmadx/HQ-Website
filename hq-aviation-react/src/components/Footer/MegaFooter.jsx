import React from 'react';

/**
 * Mega Footer - footer-mega
 * EXACT conversion from inspiration-2.html lines 1581-1641
 * Status: needs-work (HIGH PRIORITY)
 * Feedback: "Yes we need a cool footer. We need a good footer"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - footer-mega (HIGH PRIORITY)
      </div>
      <p className="component-note__text">{feedback}</p>
    </div>
  );
};

const MegaFooter = ({ showNote = true }) => {
  return (
    <>
      <footer style={{ background: '#0a0a0a', padding: '4rem 2rem 2rem', color: '#fff' }}>
        <div className="hq-container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>HQ Aviation</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>UK's Premier Robinson Helicopter Dealer</p>
              <a href="tel:+441895833373" style={{ display: 'block', color: 'var(--hq-accent)', fontSize: '1.25rem', marginBottom: '0.5rem', textDecoration: 'none' }}>01895 833 373</a>
              <a href="mailto:info@hqaviation.com" style={{ color: '#888', textDecoration: 'none' }}>info@hqaviation.com</a>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Aircraft</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Robinson R22</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Robinson R44</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Robinson R66</a></li>
                <li><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Pre-Owned</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Training</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>PPL(H) Course</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Type Ratings</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Trial Lessons</a></li>
                <li><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Night Ratings</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Services</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Maintenance</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Parts</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Inspections</a></li>
                <li><a href="#" style={{ color: '#888', textDecoration: 'none' }}>Management</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Opening Hours</h4>
              <p style={{ color: '#888', lineHeight: 1.6, fontSize: '0.9rem' }}>Monday - Friday: 8am - 6pm<br/>Saturday: 9am - 4pm<br/>Sunday: By appointment</p>
              <address style={{ color: '#888', fontStyle: 'normal', marginTop: '1rem', fontSize: '0.9rem' }}>Denham Aerodrome<br/>Buckinghamshire UB9 5DF</address>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#555', fontSize: '0.85rem' }}>© 2025 HQ Aviation Ltd. All rights reserved.</p>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem' }}>Terms</a>
              <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem' }}>Cookies</a>
            </nav>
          </div>
        </div>
      </footer>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Yes we need a cool footer. We need a good footer"
        />
      )}
    </>
  );
};

export default MegaFooter;
