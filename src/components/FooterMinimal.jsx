/**
 * FooterMinimal - Compact aviation-styled footer
 * Used on standalone pages like FinalPPL, FinalDraft, etc.
 */

import React from 'react';

function FooterMinimal() {
  return (
    <footer className="footer-minimal">
      {/* Background compass decorations */}
      <svg className="footer-minimal__compass-bg footer-minimal__compass-bg--left" viewBox="0 0 200 200" fill="currentColor">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M100 10 L105 100 L100 190 L95 100 Z" fill="currentColor"/>
        <path d="M10 100 L100 95 L190 100 L100 105 Z" fill="currentColor"/>
        <text x="100" y="28" textAnchor="middle" fontSize="14" fill="currentColor">N</text>
        <text x="100" y="182" textAnchor="middle" fontSize="14" fill="currentColor">S</text>
        <text x="18" y="104" textAnchor="middle" fontSize="14" fill="currentColor">W</text>
        <text x="182" y="104" textAnchor="middle" fontSize="14" fill="currentColor">E</text>
      </svg>
      <svg className="footer-minimal__compass-bg footer-minimal__compass-bg--right" viewBox="0 0 200 200" fill="currentColor">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <path d="M100 10 L105 100 L100 190 L95 100 Z" fill="currentColor"/>
        <path d="M10 100 L100 95 L190 100 L100 105 Z" fill="currentColor"/>
        <text x="100" y="28" textAnchor="middle" fontSize="14" fill="currentColor">N</text>
        <text x="100" y="182" textAnchor="middle" fontSize="14" fill="currentColor">S</text>
        <text x="18" y="104" textAnchor="middle" fontSize="14" fill="currentColor">W</text>
        <text x="182" y="104" textAnchor="middle" fontSize="14" fill="currentColor">E</text>
      </svg>

      {/* Main Row */}
      <div className="footer-minimal__main">
        <div className="footer-minimal__contact">
          <span className="footer-minimal__contact-label">Contact</span>
          <a href="tel:+441895833373" className="footer-minimal__contact-item">
            <i className="fas fa-phone"></i>
            +44 1895 833 373
          </a>
          <a href="mailto:info@hqaviation.com" className="footer-minimal__contact-item">
            <i className="fas fa-envelope"></i>
            info@hqaviation.com
          </a>
        </div>

        <div className="footer-minimal__brand">
          <span>HQ Aviation</span>
          <span>Denham Aerodrome, UK</span>
          <span className="footer-minimal__copyright">&copy; All rights reserved.</span>
        </div>

        <div className="footer-minimal__hours">
          <span className="footer-minimal__hours-label">Opening Hours</span>
          <span>Mon – Fri: 9:00 – 17:00</span>
          <span>Sat – Sun: 10:00 – 16:00</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="footer-minimal__bottom">
        <div className="footer-minimal__coords">
          <span>51.5751°N</span>
          <img src="/assets/images/icons/Union Jack.svg" alt="UK" className="footer-minimal__flag" />
          <span>0.5059°W</span>
        </div>
        <div className="footer-minimal__year">Est. 2010</div>
      </div>

      <div className="footer-minimal__bottom-line"></div>
    </footer>
  );
}

export default FooterMinimal;
