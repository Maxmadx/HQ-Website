import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
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

      // Position/size changes at 300px (when fully scrolled)
      setScrolled(!isHomePage || scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Spotlight dimensions - vertical grows FASTER than horizontal
  // Vertical: 95px to 500px (completes at 150px scroll)
  // Horizontal: 214px to 2000px (completes at 300px scroll)
  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
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
