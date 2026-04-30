/**
 * HeroHeader — the header that "forms" from the diagonal overlay.
 *
 * Starts completely invisible (opacity 0, pointerEvents none).
 * Fades in at the exact scroll position where the hero logo finishes its handoff
 * and the diagonal has fully collapsed into a white bar.
 *
 * The fade timing is derived from config so each variant can have its own handoff point.
 * Spotlight expands from zero starting at the handoff point (not from page load).
 *
 * This is the correct architecture: the polygon IS the header visually during the
 * animation, then the real header element fades in to take over.
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export function HeroHeader({ config }) {
  const headerRef  = useRef(null);
  const rafRef     = useRef(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;

      // Derive the scroll-Y pixel at which the handoff happens.
      // config.scrollHeight is e.g. "280vh" — parse the number.
      const scrollHeightVh = parseFloat(config.scrollHeight);
      const maxScroll      = (scrollHeightVh - 100) / 100 * vh; // total px scroll range
      const handoffPx      = (config.phases.handoff / config.progressScale) * maxScroll;

      // Header fades in over a very short scroll window around the handoff.
      const fadeStart = handoffPx;
      const fadeEnd   = fadeStart + vh * 0.008;
      const opacity   = Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart)));

      el.style.opacity      = opacity;
      el.style.pointerEvents = opacity > 0 ? 'auto' : 'none';

      // Spotlight expands starting from the handoff point (not from page top).
      // This keeps the spotlight at minimum size during the hero animation, then
      // expands naturally once the header takes over.
      const scrollBeyondHandoff = Math.max(0, scrollY - handoffPx);
      const isMobile  = window.innerWidth < 768;
      const baseH     = isMobile ? 70  : 95;
      const baseW     = isMobile ? 140 : 214;
      const vProgress = Math.min(scrollBeyondHandoff / 75,  1);
      const hProgress = Math.min(scrollBeyondHandoff / 150, 1);
      const spotH     = baseH + Math.round(vProgress * (500  - baseH));
      const spotW     = baseW + Math.round(hProgress * (2000 - baseW));

      el.style.setProperty('--spotlight-width',  `${spotW}px`);
      el.style.setProperty('--spotlight-height', `${spotH}px`);

      // Scrolled state: compact logo once spotlight has expanded.
      const isScrolled = scrollBeyondHandoff > 150;
      el.classList.toggle('Header--scrolled', isScrolled);

      // Menu button colour: dark once scrolled.
      const btn = el.querySelector('.hq-menu-btn');
      if (btn) {
        btn.classList.toggle('color-dark', isScrolled);
        btn.classList.toggle('scrolled',   isScrolled);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll,  { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(rafRef.current);
    };
  }, [config]);

  return (
    <>
      {/* Menu panel — same as FinalDraftHeader */}
      <MenuPanel />

      <header
        ref={headerRef}
        className="Header Header--top"
        style={{ opacity: 0, pointerEvents: 'none' }}
      >
        {/* Burger sits inside the header on this variant (not fixed independently) */}
        <button
          className="hq-menu-btn"
          style={{ position: 'absolute', top: 10, right: 24 }}
          aria-label="Toggle menu"
          onClick={() => document.querySelector('.hq-menu-panel')?.classList.toggle('open')}
        >
          <span /><span /><span />
        </button>

        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left" />
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                className="Header-branding-logo"
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying"      className="Header-nav-item">Flying</Link>
                <Link to="/training"    className="Header-nav-item">Training</Link>
                <span className="Header-nav-item Header-nav-item--folder">
                  <Link to="/expeditions" className="Header-nav-folder-title">Exploration</Link>
                  <span className="Header-nav-folder">
                    <Link to="/expeditions"          className="Header-nav-folder-item">Worldwide Expeditions</Link>
                    <Link to="/expeditions/calendar" className="Header-nav-folder-item">HQ Trips</Link>
                    <Link to="/services"             className="Header-nav-folder-item">Ferry Flights</Link>
                  </span>
                </span>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right" />
        </div>
      </header>
    </>
  );
}

// ─── Menu panel ───────────────────────────────────────────────────────────────
function MenuPanel() {
  return (
    <div className="hq-menu-panel">
      <div className="hq-menu-grid">
        {MENU_SECTIONS.map(section => (
          <div key={section.title} className="hq-menu-section">
            <h3>{section.title}</h3>
            <ul>
              {section.links.map(link => (
                <li key={link.to}>
                  <Link to={link.to} onClick={() => document.querySelector('.hq-menu-panel')?.classList.remove('open')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const MENU_SECTIONS = [
  {
    title: 'About',
    links: [
      { to: '/',                  label: 'Home' },
      { to: '/about-us',          label: 'About Us' },
      { to: '/about-us/captain-q',label: 'Quentin Smith' },
    ],
  },
  {
    title: 'Aircraft Sales',
    links: [
      { to: '/sales/new',              label: 'New Aircraft' },
      { to: '/aircraft-sales/new/r66', label: 'R66' },
      { to: '/aircraft-sales/new/r44', label: 'R44' },
      { to: '/aircraft-sales/new/r22', label: 'R22' },
    ],
  },
  {
    title: 'Flight Training',
    links: [
      { to: '/training',               label: 'Training Overview' },
      { to: '/training/trial-lessons', label: 'Trial Lessons' },
      { to: '/training/ppl',           label: 'Private Pilot License' },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/services',             label: 'Services Overview' },
      { to: '/services/maintenance', label: 'Maintenance' },
    ],
  },
  {
    title: 'Experiences',
    links: [
      { to: '/expeditions',          label: 'Expeditions' },
      { to: '/expeditions/calendar', label: 'Calendar' },
    ],
  },
];
