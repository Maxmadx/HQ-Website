import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '../config/routes';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const location = useLocation();

  // Check if home page
  const isHomePage = location.pathname === '/';

  // Scroll handler for menu button states and header gradient
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Vertical completes FIRST (0 to 1 over first 150px)
      const vProgress = isHomePage ? Math.min(scrollY / 150, 1) : 1;
      setVerticalProgress(vProgress);

      // Horizontal completes SECOND (0 to 1 over full 300px)
      const hProgress = isHomePage ? Math.min(scrollY / 300, 1) : 1;
      setHorizontalProgress(hProgress);

      // Color changes at 300px (only on home page)
      setColorDark(!isHomePage || scrollY > 300);
      // Position/size changes at 300px (when fully scrolled)
      setScrolled(!isHomePage || scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Spotlight dimensions - vertical grows FASTER than horizontal
  // Vertical: 95px to 500px (completes at 150px scroll)
  // Horizontal: 214px to 2000px (completes at 300px scroll)
  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
      {/* Menu Panel */}
      <div className={`hq-menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="hq-menu-grid">
          <div className="hq-menu-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/about-us/team" onClick={closeMenu}>Meet The Team</Link></li>
              <li><Link to="/about-us/captain-q" onClick={closeMenu}>Quentin Smith</Link></li>
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Aircraft Sales</h3>
            <ul>
              <li><Link to="/aircraft-sales" onClick={closeMenu}>New Aircraft</Link></li>
              <li><Link to="/aircraft-sales/new/r88" onClick={closeMenu}>R88</Link></li>
              <li><Link to="/aircraft-sales/new/r66" onClick={closeMenu}>R66</Link></li>
              <li><Link to="/aircraft-sales/new/r44" onClick={closeMenu}>R44</Link></li>
              <li><Link to="/aircraft-sales/new/r22" onClick={closeMenu}>R22</Link></li>
              <li><Link to="/aircraft-sales/compare" onClick={closeMenu}>Compare Aircraft</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Flight Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/trial-lessons" onClick={closeMenu}>Trial Lessons</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
              <li><Link to="/training/faq" onClick={closeMenu}>Training FAQ</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services" onClick={closeMenu}>Services Overview</Link></li>
              <li><Link to="/services/maintenance" onClick={closeMenu}>Maintenance</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Experiences</h3>
            <ul>
              <li><Link to="/expeditions" onClick={closeMenu}>Expeditions</Link></li>
              <li><Link to="/expeditions/calendar" onClick={closeMenu}>Calendar</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/store" onClick={closeMenu}>Store</Link></li>
              <li><Link to="/store/gifts" onClick={closeMenu}>Gifts</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Media</h3>
            <ul>
              <li><Link to="/media" onClick={closeMenu}>Gallery & Media</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Contact</h3>
            <ul>
              <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
              <li><Link to="/contact/careers" onClick={closeMenu}>Careers</Link></li>
              <li><Link to="/contact/pricing" onClick={closeMenu}>Pricing</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Menu Button - hq-menu-btn with 3 spans */}
      <button
        className={`hq-menu-btn ${colorDark ? 'color-dark' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Header - Exact Squarespace structure */}
      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`
        }}
      >
        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left">
            {/* Breadcrumb - aligned left */}
            {!isHomePage && (
              <nav className="Header-breadcrumb" aria-label="Breadcrumb">
                <ol className="Header-breadcrumb__list">
                  {getBreadcrumbs(location.pathname).map((crumb, index, arr) => {
                    const isLast = index === arr.length - 1;
                    return (
                      <li key={crumb.path} className="Header-breadcrumb__item">
                        {!isLast ? (
                          <>
                            <Link to={crumb.path} className="Header-breadcrumb__link">
                              {index === 0 ? (
                                <i className="fas fa-home" aria-hidden="true"></i>
                              ) : (
                                crumb.title
                              )}
                            </Link>
                            <span className="Header-breadcrumb__separator" aria-hidden="true">
                              <i className="fas fa-chevron-right"></i>
                            </span>
                          </>
                        ) : (
                          <span className="Header-breadcrumb__current" aria-current="page">
                            {crumb.title}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}
          </div>
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding" data-content-field="site-title">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                sizes="320px"
                className="Header-branding-logo"
                loading="lazy"
                decoding="async"
                data-loader="sqs"
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav" data-content-field="navigation">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item" data-test="template-nav">Flying</Link>
                <Link to="/training" className="Header-nav-item" data-test="template-nav">Training</Link>
                <span className="Header-nav-item Header-nav-item--folder">
                  <Link to="/expeditions" className="Header-nav-folder-title" data-controller="HeaderNavFolderTouch">Exploration</Link>
                  <span className="Header-nav-folder">
                    <Link to="/expeditions" className="Header-nav-folder-item" data-test="template-nav">Worldwide Expeditions</Link>
                    <Link to="/expeditions/calendar" className="Header-nav-folder-item" data-test="template-nav">HQ Trips</Link>
                    <Link to="/services" className="Header-nav-folder-item" data-test="template-nav">Ferry Flights</Link>
                  </span>
                </span>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right">
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
