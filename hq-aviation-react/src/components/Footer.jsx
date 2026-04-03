import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="hq-footer">
      <div className="hq-container">
        {/* Main Footer Content */}
        <div className="hq-footer__main">
          {/* Brand Section */}
          <div className="hq-footer__brand">
            <Link to="/">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                className="hq-footer__logo"
                loading="lazy"
              />
            </Link>
            <p className="hq-footer__tagline">
              Robinson helicopter specialists since 1990. Experience the world from above.
            </p>
            <div className="hq-footer__contact">
              <a href="tel:+441895833373" className="hq-footer__contact-item">
                <svg className="hq-footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +44 1895 833373
              </a>
              <a href="mailto:info@hqaviation.com" className="hq-footer__contact-item">
                <svg className="hq-footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                info@hqaviation.com
              </a>
              <a href="https://maps.google.com/?q=Denham+Aerodrome" className="hq-footer__contact-item" target="_blank" rel="noopener noreferrer">
                <svg className="hq-footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Denham Aerodrome, UB9 5DF
              </a>
            </div>
            {/* Certifications */}
            <div className="hq-footer__certs">
              <div className="hq-footer__cert">
                <img src="/assets/images/logos/certifications/caa.jpg" alt="UK CAA" className="hq-footer__cert-img" loading="lazy" />
              </div>
              <div className="hq-footer__cert">
                <img src="/assets/images/logos/certifications/robinson.jpg" alt="Robinson Approved" className="hq-footer__cert-img" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Aircraft Links */}
          <nav className="hq-footer__nav">
            <h4 className="hq-footer__nav-title">Aircraft</h4>
            <ul className="hq-footer__nav-list">
              <li><Link to="/aircraft-sales/new/r66" className="hq-footer__nav-link">R66 Turbine</Link></li>
              <li><Link to="/aircraft-sales/new/r44" className="hq-footer__nav-link">R44 Series</Link></li>
              <li><Link to="/aircraft-sales/new/r22" className="hq-footer__nav-link">R22 Beta II</Link></li>
              <li><Link to="/aircraft-sales/new/r88" className="hq-footer__nav-link">R88</Link></li>
              <li><Link to="/aircraft-sales/used" className="hq-footer__nav-link">Used Aircraft</Link></li>
            </ul>
          </nav>

          {/* Training Links */}
          <nav className="hq-footer__nav">
            <h4 className="hq-footer__nav-title">Training</h4>
            <ul className="hq-footer__nav-list">
              <li><Link to="/training/trial-lessons" className="hq-footer__nav-link">Trial Lessons</Link></li>
              <li><Link to="/training/ppl" className="hq-footer__nav-link">PPL(H) Course</Link></li>
              <li><Link to="/training/type-ratings" className="hq-footer__nav-link">Type Ratings</Link></li>
              <li><Link to="/training/faq" className="hq-footer__nav-link">Training FAQ</Link></li>
            </ul>
          </nav>

          {/* Company Links */}
          <nav className="hq-footer__nav">
            <h4 className="hq-footer__nav-title">Company</h4>
            <ul className="hq-footer__nav-list">
              <li><Link to="/about-us" className="hq-footer__nav-link">About Us</Link></li>
              <li><Link to="/about-us/captain-q" className="hq-footer__nav-link">Captain Q</Link></li>
              <li><Link to="/services/maintenance" className="hq-footer__nav-link">Maintenance</Link></li>
              <li><Link to="/expeditions" className="hq-footer__nav-link">Expeditions</Link></li>
              <li><Link to="/contact" className="hq-footer__nav-link">Contact</Link></li>
            </ul>
          </nav>
        </div>

        {/* Footer Bottom */}
        <div className="hq-footer__bottom">
          <p className="hq-footer__copyright">
            &copy; {new Date().getFullYear()} HQ Aviation Ltd. All rights reserved.
          </p>

          <div className="hq-footer__social">
            <a
              href="https://facebook.com/hqaviationltd"
              className="hq-footer__social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="hq-footer__social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="https://instagram.com/hqaviation"
              className="hq-footer__social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="hq-footer__social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://youtube.com/@hqaviation"
              className="hq-footer__social-link"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="hq-footer__social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"></polygon>
              </svg>
            </a>
          </div>

          <div className="hq-footer__legal">
            <Link to="/legal/privacy" className="hq-footer__legal-link">Privacy Policy</Link>
            <Link to="/legal/terms" className="hq-footer__legal-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
