/**
 * SELF-FLY HIRE PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #2563eb (accent)
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { useFaqs } from '../hooks/useFaqs';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';
import WallOfCoolGr11 from '../components/WallOfCoolGr11';

/**
 * SELF-FLY HIRE PAGE HEADER COMPONENT
 */
function SelfFlyHireHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorDark, setColorDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verticalProgress, setVerticalProgress] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vProgress = Math.min(scrollY / 150, 1);
      setVerticalProgress(vProgress);
      const hProgress = Math.min(scrollY / 300, 1);
      setHorizontalProgress(hProgress);
      setColorDark(scrollY > 300);
      setScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const spotlightHeight = 95 + Math.round(verticalProgress * 405);
  const spotlightWidth = 214 + Math.round(horizontalProgress * 1786);

  return (
    <>
      <HqMenuPanel open={menuOpen} onClose={closeMenu} />

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

      <header
        className={`Header Header--top ${scrolled ? 'Header--scrolled' : ''}`}
        style={{
          '--spotlight-width': `${spotlightWidth}px`,
          '--spotlight-height': `${spotlightHeight}px`
        }}
      >
        <div className="Header-inner Header-inner--top" data-nc-group="top">
          <div data-nc-container="top-left"></div>
          <div data-nc-container="top-center">
            <Link to="/" className="Header-branding" data-nc-element="branding">
              <img
                src="/assets/images/logos/hq/hq-aviation-logo-black.png"
                alt="HQ Aviation"
                className="Header-branding-logo"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <span className="Header-nav-item Header-nav-item--folder">
                  <Link to="/expeditions" className="Header-nav-folder-title">Exploration</Link>
                  <span className="Header-nav-folder">
                    <Link to="/expeditions" className="Header-nav-folder-item">Worldwide Expeditions</Link>
                    <Link to="/expeditions/calendar" className="Header-nav-folder-item">HQ Trips</Link>
                  </span>
                </span>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FLEET = [
  {
    id: 'r22',
    model: 'Robinson R22',
    label: '01',
    tagline: 'The Perfect Solo Machine',
    seats: '2',
    cruise: '96 kts',
    range: '190 nm',
    rate: '£375 / hr',
    description: "Ideal for pilots looking to stay current or explore solo. The R22 is the world's most popular training helicopter — nimble, economical, and endlessly rewarding to fly.",
    image: '/assets/images/gallery/carousel/rotating1.jpg',
    features: ['2 seats', 'Lycoming O-320 engine', 'Ideal for currency flying', 'Up to 3hrs endurance'],
  },
  {
    id: 'r44',
    model: 'Robinson R44',
    label: '02',
    tagline: 'The Versatile Workhorse',
    seats: '4',
    cruise: '109 kts',
    range: '300 nm',
    rate: '£495 / hr',
    description: "Four seats, strong cruise performance, and enough range to reach France. The R44 is the choice for pilot currency, leisure trips, and cross-country adventures.",
    image: '/assets/images/facility/hq-0153.jpg',
    features: ['4 seats', 'Lycoming IO-540 engine', 'UK & Europe capable', 'Up to 3hrs endurance'],
  },
  {
    id: 'r66',
    model: 'Robinson R66',
    label: '03',
    tagline: 'Turbine Performance Unleashed',
    seats: '5',
    cruise: '120 kts',
    range: '350 nm',
    rate: '£595 / hr',
    description: "Turbine reliability meets Robinson simplicity. The R66 is the pinnacle of piston-to-turbine transition — exceptional range, five seats, and a Garmin G500H avionics suite.",
    image: '/assets/images/expeditions/north-pole.jpg',
    features: ['5 seats', 'Rolls-Royce RR300 turbine', 'Garmin G500H avionics', 'Up to 5hrs endurance'],
  },
];

const DESTINATIONS = [
  { name: 'Goodwood',        time: '25 min',   region: 'South England'   },
  { name: 'Oxford',          time: '25 min',   region: 'South England'   },
  { name: 'Cambridge',       time: '30 min',   region: 'East England'    },
  { name: 'Brighton',        time: '30 min',   region: 'South England'   },
  { name: 'Cotswolds',       time: '35 min',   region: 'South England'   },
  { name: 'Silverstone',     time: '35 min',   region: 'Midlands'        },
  { name: 'Channel Islands', time: '1h 15m',   region: 'Channel Islands' },
  { name: 'Le Touquet',      time: '45 min',   region: 'France'          },
  { name: 'Lake District',   time: '1h 50m',   region: 'North England'   },
  { name: 'Paris',           time: '1h 30m',   region: 'France'          },
  { name: 'Amsterdam',       time: '1h 45m',   region: 'Europe'          },
  { name: 'Edinburgh',       time: '3h',        region: 'Scotland'        },
];

const PARTNERS = [
  { category: 'Shooting Ground', name: 'Holland & Holland', location: 'Northwood' },
  { category: 'Restaurant',      name: 'The Hut',           location: 'Isle of Wight' },
  { category: 'Shooting Ground', name: 'E.J. Churchill',    location: 'West Wycombe' },
];

const EVENTS = [
  { region: 'Berkshire',       name: 'Royal Ascot',                month: 'June' },
  { region: 'Oxfordshire',     name: 'Henley Royal Regatta',       month: 'July' },
  { region: 'West Sussex',     name: 'Goodwood Festival of Speed', month: 'July' },
  { region: 'West Sussex',     name: 'Glorious Goodwood',          month: 'August' },
  { region: 'Gloucestershire', name: 'Cheltenham Festival',        month: 'March' },
  { region: 'Merseyside',      name: 'Grand National (Aintree)',   month: 'April' },
  { region: 'Surrey',          name: 'Epsom Derby',                month: 'June' },
  { region: 'Suffolk',         name: 'Newmarket Racing',           month: 'May–Oct' },
  { region: 'Yorkshire',       name: 'York Racecourse',            month: 'May–Oct' },
  { region: 'Surrey',          name: 'Sandown Park',               month: 'Year-round' },
  { region: 'Berkshire',       name: 'Newbury Racecourse',         month: 'Year-round' },
];

const REQUIREMENTS = [
  { num: '01', title: 'Valid PPL(H)',       body: 'A current Private Pilot Licence (Helicopters) with a valid Class 2 medical certificate.' },
  { num: '02', title: 'Current Type Rating', body: 'A current type rating for the aircraft you wish to fly — R22, R44 or R66.' },
  { num: '03', title: 'Recent Currency',    body: "Minimum recent experience requirements met. If you're not current, we offer a checkout flight with one of our instructors." },
  { num: '04', title: 'Insurance Included', body: 'Third-party liability insurance is included in your hire rate. No additional policy required.' },
];


// ─── Main Component ───────────────────────────────────────────────────────────

export default function SelfFlyHire() {
  const pageImages = usePageImages('sfh');
  useCmsHighlight();
  const heroUrl  = pageImages['sfh-hero']?.[0]?.url  ?? '/assets/images/gallery/carousel/rotating1.jpg';
  const introUrl = pageImages['sfh-intro']?.[0]?.url ?? '/assets/images/facility/hq-0153.jpg';

  const [activeFleet, setActiveFleet] = useState(0);
  const [aircraftDropdownOpen, setAircraftDropdownOpen] = useState(false);
  const aircraftDropdownRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [destPage, setDestPage] = useState(0);
  const destGridRef = useRef(null);
  const [pricingNotesPage, setPricingNotesPage] = useState(0);
  const pricingNotesGridRef = useRef(null);
  const fleetImgRef = useRef(null);
  const fleetTopBodyRef = useRef(null);
  const fleetSpecsRef = useRef(null);
  const DEST_PAGES = Math.ceil(DESTINATIONS.length / 4); // 2 rows × 2 cols per view = 4 cards per page
  const [eventsPage, setEventsPage] = useState(0);
  const eventsGridRef = useRef(null);
  const EVENTS_PAGES = Math.ceil(EVENTS.length / 4); // 4 cards per mobile page (2 rows × 2 cols)
  const { faqs } = useFaqs('sfh', { visibleOnly: true });
  const [form, setForm] = useState({ name: '', email: '', phone: '', aircraft: '', dates: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);
  const [sfhPrices, setSfhPrices] = useState({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aircraftDropdownRef.current && !aircraftDropdownRef.current.contains(e.target)) {
        setAircraftDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pricing'), (snap) => {
      const map = {};
      snap.docs.forEach((d) => { map[d.id] = d.data(); });
      setSfhPrices(map);
    });
    return unsub;
  }, []);

  const updateSpecsPadding = useCallback(() => {
    const img = fleetImgRef.current;
    const topBody = fleetTopBodyRef.current;
    const specsEl = fleetSpecsRef.current;
    if (!img || !topBody || !specsEl) return;
    // Reset first so we measure natural content height without prior padding
    specsEl.style.paddingBottom = '0px';
    const imgH = img.offsetHeight;
    if (!imgH) return; // image not yet loaded
    const topBodyH = topBody.offsetHeight;
    const specsNaturalH = specsEl.offsetHeight;
    const raw = imgH - topBodyH - specsNaturalH;
    const padding = window.innerWidth > 1024
      ? Math.max(24, raw)
      : Math.min(14, Math.max(0, raw));
    specsEl.style.paddingBottom = padding + 'px';
  }, []);

  useEffect(() => {
    updateSpecsPadding();
    window.addEventListener('resize', updateSpecsPadding);
    return () => window.removeEventListener('resize', updateSpecsPadding);
  }, [activeFleet, updateSpecsPadding]);

  function getRate(aircraftId) {
    const doc = sfhPrices[`sfh_${aircraftId}_wet`];
    if (!doc?.price) return null;
    return `£${Math.round(doc.price / 100).toLocaleString('en-GB')} / hr`;
  }

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormStatus('sending');
    const messageParts = [];
    if (form.aircraft) messageParts.push(`Aircraft: ${form.aircraft}`);
    if (form.dates) messageParts.push(`Preferred dates: ${form.dates}`);
    if (form.message) messageParts.push(form.message);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: 'Self-Fly Hire Enquiry',
          message: messageParts.join('\n'),
          source: 'Self-Fly Hire',
        }),
      });
      setFormStatus(res.ok ? 'success' : 'error');
    } catch {
      setFormStatus('error');
    }
  }

  const activeAircraft = FLEET[activeFleet];

  return (
    <div className="sfh2-page">
      <SelfFlyHireHeader />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="sfh2-hero" data-cms-section="sfh-hero">
        <div className="sfh2-hero__bg">
          <img src={heroUrl} alt="HQ Aviation self-fly hire" />
        </div>
        <div className="sfh2-hero__overlay" />
        <div className="sfh2-hero__content">
          <motion.div
            className="sfh2-hero__inner"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-hero__pre">Self-Fly Hire</span>
            <h1 className="sfh2-hero__headline">
              Your Sky.<br />Your Rules.
            </h1>
            <p className="sfh2-hero__sub">
              Fly from Denham Aerodrome. One of Europe's largest Robinson fleets,
              available to licensed pilots, on your schedule.
            </p>
            <div className="sfh2-hero__ctas">
              <a href="#enquire" className="sfh2-btn sfh2-btn--primary">Enquire About Hire</a>
              <a href="#fleet"   className="sfh2-btn sfh2-btn--outline">View Fleet</a>
            </div>
          </motion.div>
        </div>
        <div className="sfh2-hero__stats">
          <div className="sfh2-hero__stat">7 Days a Week</div>
          <div className="sfh2-hero__stat-divider" />
          <div className="sfh2-hero__stat">2,000+ Destinations</div>
        </div>
      </section>

      {/* ── Intro ──────────────────────────────────────────────── */}
      <section className="sfh2-intro" data-cms-section="sfh-intro">
        <div className="sfh2-intro__inner">
          <motion.div
            className="sfh2-intro__image-wrap"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={introUrl} alt="HQ Aviation fleet at Denham" className="sfh2-intro__image" />
          </motion.div>
          <motion.div
            className="sfh2-intro__text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">What Is Self-Fly Hire</span>
            <h2 className="sfh2-section-heading">Fly on Your Terms</h2>
            <p className="sfh2-body-text">
              Self fly hire puts you in complete command. If you hold a valid PPL(H) and a
              current type rating, you can take one of our immaculately maintained Robinson
              helicopters and go wherever you choose: no instructor, no itinerary, no compromise.
            </p>
            <p className="sfh2-body-text">
              Based at Denham Aerodrome in Buckinghamshire, our fleet gives you direct access
              to hundreds of destinations across the UK and Europe. Weekend escapes, day trips,
              or simply keeping your licence current. The aircraft is yours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Fleet ──────────────────────────────────────────────── */}
      <section className="sfh2-fleet" id="fleet" data-cms-section="sfh-fleet">
        <div className="sfh2-fleet__inner">
          <motion.div
            className="sfh2-fleet__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">Our Aircraft</span>
            <h2 className="sfh2-section-heading">Choose Your Helicopter</h2>
          </motion.div>

          <div className="sfh2-fleet__tabs">
            {FLEET.map((aircraft, i) => (
              <button
                key={aircraft.id}
                className={`sfh2-fleet__tab ${activeFleet === i ? 'active' : ''}`}
                onClick={() => setActiveFleet(i)}
              >
                <span className="sfh2-fleet__tab-num">{aircraft.label}</span>
                <span className="sfh2-fleet__tab-name">{aircraft.model}</span>
              </button>
            ))}
          </div>

          <div className="sfh2-fleet__tab-nav sfh2-fleet__tab-nav--desktop">
            <button
              className="sfh2-fleet__tab-chevron"
              onClick={() => setActiveFleet((activeFleet - 1 + FLEET.length) % FLEET.length)}
              aria-label="Previous aircraft"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="sfh2-fleet__tab-current">
              <span className="sfh2-fleet__tab-nav-num">{FLEET[activeFleet].label}</span>
              {FLEET[activeFleet].model}
            </span>
            <button
              className="sfh2-fleet__tab-chevron"
              onClick={() => setActiveFleet((activeFleet + 1) % FLEET.length)}
              aria-label="Next aircraft"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="sfh2-fleet__card">
          <motion.div
            key={activeAircraft.id}
            className="sfh2-fleet__panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="sfh2-fleet__panel-image">
              <img ref={fleetImgRef} src={pageImages['sfh-fleet']?.[activeFleet]?.url || activeAircraft.image} alt={activeAircraft.model} onLoad={updateSpecsPadding} />
            </div>
            <div ref={fleetTopBodyRef} className="sfh2-fleet__panel-top-body">
              <div className="sfh2-fleet__panel-top">
                <span className="sfh2-fleet__panel-label">{activeAircraft.label}</span>
                <h3 className="sfh2-fleet__panel-model">{activeAircraft.model}</h3>
                <div className="sfh2-fleet__tab-nav sfh2-fleet__tab-nav--mobile">
                  <button
                    className="sfh2-fleet__tab-chevron"
                    onClick={() => setActiveFleet((activeFleet - 1 + FLEET.length) % FLEET.length)}
                    aria-label="Previous aircraft"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="sfh2-fleet__tab-current">
                    <span className="sfh2-fleet__tab-nav-num">{FLEET[activeFleet].label}</span>
                    {FLEET[activeFleet].model}
                  </span>
                  <button
                    className="sfh2-fleet__tab-chevron"
                    onClick={() => setActiveFleet((activeFleet + 1) % FLEET.length)}
                    aria-label="Next aircraft"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                <p className="sfh2-fleet__panel-tagline">{activeAircraft.tagline}</p>
                <span className="sfh2-fleet__panel-rate">
                  {getRate(activeAircraft.id) ?? activeAircraft.rate}
                  <span className="sfh2-fleet__panel-rate-vat"> exc. VAT</span>
                </span>
              </div>
              <ul className="sfh2-fleet__features">
                {activeAircraft.features.map((f) => (
                  <li key={f} className="sfh2-fleet__feature">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div ref={fleetSpecsRef} className="sfh2-fleet__panel-specs-area">
              <div className="sfh2-fleet__specs">
                <div className="sfh2-fleet__spec">
                  <span className="sfh2-fleet__spec-label">Seats</span>
                  <span className="sfh2-fleet__spec-value">{activeAircraft.seats}</span>
                </div>
                <div className="sfh2-fleet__spec">
                  <span className="sfh2-fleet__spec-label">Cruise</span>
                  <span className="sfh2-fleet__spec-value">{activeAircraft.cruise}</span>
                </div>
                <div className="sfh2-fleet__spec">
                  <span className="sfh2-fleet__spec-label">Range</span>
                  <span className="sfh2-fleet__spec-value">{activeAircraft.range}</span>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="sfh2-fleet__panel-sub">
            <p className="sfh2-fleet__panel-desc">{activeAircraft.description}</p>
            <a
              href="#enquire"
              className="sfh2-btn sfh2-btn--fleet-cta"
              onClick={() => setForm(f => ({ ...f, aircraft: activeAircraft.id.toUpperCase() }))}
            >Enquire About This Aircraft</a>
          </div>
          </div>
          <p className="sfh2-fleet__footnote">* Other aircraft available upon request</p>
        </div>
      </section>

      {/* ── Pricing Notes ──────────────────────────────────────── */}
      <section className="sfh2-pricing-notes">
        <div className="sfh2-pricing-notes__inner">
          <div
            className="sfh2-pricing-notes__grid"
            ref={pricingNotesGridRef}
            onScroll={() => {
              const el = pricingNotesGridRef.current;
              if (!el) return;
              setPricingNotesPage(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            <div className="sfh2-pricing-notes__card">
              <p><strong>Happy Hour Flying:</strong> Off-peak rates for flexible pilots who can fly at shorter notice.</p>
            </div>
            <div className="sfh2-pricing-notes__card">
              <p><strong>Mission Rate Flying:</strong> When fleet aircraft need repositioning or ferrying, qualified pilots can join at mission rates.</p>
            </div>
            <div className="sfh2-pricing-notes__card">
              <p><strong>Bulk Hour Discounts:</strong> Discounted training rates are available when hours are purchased in larger blocks.</p>
            </div>
          </div>
          <div className="sfh2-pricing-notes__dots">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`sfh2-pricing-notes__dot${pricingNotesPage === i ? ' sfh2-pricing-notes__dot--active' : ''}`}
                onClick={() => {
                  pricingNotesGridRef.current?.scrollTo({ left: i * pricingNotesGridRef.current.clientWidth, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
          <p className="sfh2-pricing-notes__footnote">* Other aircraft available upon request</p>
        </div>
      </section>

      {/* ── Destinations ───────────────────────────────────────── */}
      <section className="sfh2-destinations">
        <div className="sfh2-destinations__inner">
          <motion.div
            className="sfh2-destinations__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">Where You Can Go</span>
            <h2 className="sfh2-section-heading">Where Will You Go?</h2>
            <p className="sfh2-destinations__intro">
              The UK and beyond are on your doorstep. Below is just a sample of where our
              pilots fly. If it has a landing site, you can get there.
            </p>
          </motion.div>

          <div
            className="sfh2-destinations__grid"
            ref={destGridRef}
            onScroll={() => {
              const el = destGridRef.current;
              if (!el) return;
              setDestPage(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.name}
                className="sfh2-destinations__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.3, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="sfh2-destinations__card-region">{dest.region}</div>
                <div className="sfh2-destinations__card-name">{dest.name}</div>
                <div className="sfh2-destinations__card-time">{dest.time}</div>
              </motion.div>
            ))}
          </div>
          <div className="sfh2-destinations__dots">
            {Array.from({ length: DEST_PAGES }).map((_, i) => (
              <span
                key={i}
                className={`sfh2-destinations__dot${destPage === i ? ' sfh2-destinations__dot--active' : ''}`}
                onClick={() => {
                  destGridRef.current?.scrollTo({ left: i * destGridRef.current.clientWidth, behavior: 'smooth' });
                }}
              />
            ))}
          </div>

          <p className="sfh2-destinations__footer">
            Plus thousands more — you pick the destination.
          </p>
        </div>
      </section>

      {/* ── Our Partners ────────────────────────────────────────── */}
      <section className="sfh2-partners" data-cms-section="sfh-partners">
        <div className="sfh2-partners__inner">
          <motion.div
            className="sfh2-partners__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">Trusted By</span>
            <h2 className="sfh2-section-heading">Our Partners</h2>
            <p className="sfh2-partners__intro">
              We work with country estates, sporting grounds and destinations who welcome arrivals by helicopter.
            </p>
          </motion.div>

          <div className="sfh2-partners__grid">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                className="sfh2-partners__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="sfh2-partners__card-region">{partner.category}</div>
                <div className="sfh2-partners__card-name">{partner.name}</div>
                <div className="sfh2-partners__card-time">{partner.location}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry Form ───────────────────────────────────────── */}
      <section className="sfh2-enquiry" id="enquire">
        <div className="sfh2-enquiry__inner">
          <motion.div
            className="sfh2-enquiry__heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="sfh2-pre-label">Get in Touch</span>
            <h2 className="sfh2-section-heading">Enquire About Hire</h2>
            <p className="sfh2-enquiry__sub">
              Tell us what you have in mind and we'll come back to you within one business day.
            </p>
          </motion.div>

          <motion.div
            className="sfh2-enquiry__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sfh2-enquiry__card-header">
              <span className="sfh2-enquiry__card-label">Hire Enquiry</span>
              <span className="sfh2-enquiry__card-note sfh2-enquiry__card-note--desktop">We respond within one business day</span>
              <span className="sfh2-enquiry__card-note sfh2-enquiry__card-note--mobile">Within one business day</span>
            </div>
            <div className="sfh2-enquiry__card-body">
            {formStatus === 'success' ? (
              <div className="sfh2-enquiry__success">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>Enquiry received — we'll be back in touch within one business day.</p>
              </div>
            ) : (
              <form className="sfh2-enquiry__form" onSubmit={handleSubmit} noValidate>
                <div className="sfh2-enquiry__row">
                  <div className="sfh2-enquiry__field">
                    <label htmlFor="sfh-name">Full Name</label>
                    <input
                      id="sfh-name"
                      type="text"
                      value={form.name}
                      onChange={setField('name')}
                      required
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </div>
                  <div className="sfh2-enquiry__field">
                    <label htmlFor="sfh-email">Email Address</label>
                    <input
                      id="sfh-email"
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      required
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="sfh2-enquiry__row">
                  <div className="sfh2-enquiry__field">
                    <label htmlFor="sfh-phone">
                      Phone <span className="sfh2-enquiry__optional">(optional)</span>
                    </label>
                    <input
                      id="sfh-phone"
                      type="tel"
                      value={form.phone}
                      onChange={setField('phone')}
                      placeholder="+44 7700 000 000"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="sfh2-enquiry__field" ref={aircraftDropdownRef}>
                    <label>Aircraft Preference</label>
                    <div className={`sfh2-dropdown${aircraftDropdownOpen ? ' sfh2-dropdown--open' : ''}`}>
                      <button
                        type="button"
                        className="sfh2-dropdown__trigger"
                        onClick={() => setAircraftDropdownOpen(o => !o)}
                      >
                        <span>{form.aircraft ? { R22: 'Robinson R22', R44: 'Robinson R44', R66: 'Robinson R66' }[form.aircraft] : 'No preference'}</span>
                        <svg className="sfh2-dropdown__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {aircraftDropdownOpen && (
                        <ul className="sfh2-dropdown__menu">
                          {[
                            { value: '', label: 'No preference' },
                            { value: 'R22', label: 'Robinson R22' },
                            { value: 'R44', label: 'Robinson R44' },
                            { value: 'R66', label: 'Robinson R66' },
                          ].map(opt => (
                            <li
                              key={opt.value}
                              className={`sfh2-dropdown__option${form.aircraft === opt.value ? ' sfh2-dropdown__option--active' : ''}`}
                              onClick={() => { setField('aircraft')({ target: { value: opt.value } }); setAircraftDropdownOpen(false); }}
                            >
                              {opt.label}
                              {form.aircraft === opt.value && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sfh2-enquiry__field">
                  <label htmlFor="sfh-dates">
                    Preferred Dates <span className="sfh2-enquiry__optional">(optional)</span>
                  </label>
                  <input
                    id="sfh-dates"
                    type="text"
                    value={form.dates}
                    onChange={setField('dates')}
                    placeholder="e.g. 3–5 May, flexible, ASAP"
                  />
                </div>
                <div className="sfh2-enquiry__field">
                  <label htmlFor="sfh-message">Message</label>
                  <textarea
                    id="sfh-message"
                    value={form.message}
                    onChange={setField('message')}
                    rows={5}
                    placeholder="Where are you hoping to fly? Anything else we should know…"
                  />
                </div>
                {formStatus === 'error' && (
                  <p className="sfh2-enquiry__error">
                    Something went wrong — please try again or email{' '}
                    <a href="mailto:operations@hqaviation.com">operations@hqaviation.com</a>
                  </p>
                )}
                <button
                  type="submit"
                  className="sfh2-btn sfh2-btn--submit"
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="sfh2-faq" data-cms-section="faqs-sfh">
        <div className="sfh2-faq__inner">
          <motion.div
            className="sfh2-faq__header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <span className="sfh2-faq__pre-label">Common Questions</span>
            <h2>Frequently Asked</h2>
          </motion.div>

          <div className="sfh2-faq__list">
            {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <div
                  className={`sfh2-faq__item ${openFaq === i ? 'sfh2-faq__item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="sfh2-faq__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="sfh2-faq__content">
                    <h4>
                      {faq.question}
                      <span className="sfh2-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h4>
                    <motion.div
                      className="sfh2-faq__answer"
                      initial={false}
                      animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {!showAllFaqs && faqs.length > 6 && (
            <button className="sfh2-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
          )}
        </div>
      </section>

      <FooterMinimal />

      <style>{`
        /* ── Reset / Base ──────────────────────────────────────── */
        .sfh2-page {
          font-family: 'Space Grotesk', sans-serif;
          color: #1a1a1a;
          background: #faf9f6;
        }

        /* ── Reusable primitives ───────────────────────────────── */
        .sfh2-pre-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.75rem;
        }
        .sfh2-pre-label--light {
          color: #9ca3af;
        }
        .sfh2-section-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          line-height: 1.1;
        }
        .sfh2-section-heading--light {
          color: #fff;
        }
        .sfh2-body-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 0 1rem;
        }

        /* ── Buttons ───────────────────────────────────────────── */
        .sfh2-btn {
          display: inline-block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.85rem 2rem;
          border-radius: 2px;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, opacity 0.2s;
          border: none;
        }
        .sfh2-btn--primary {
          background: #fff;
          color: #1a1a1a;
        }
        .sfh2-btn--primary:hover {
          background: #e8e6e2;
        }
        .sfh2-btn--outline {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.5);
        }
        .sfh2-btn--outline:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.08);
        }
        .sfh2-btn--fleet-cta {
          background: #fff;
          color: #1a1a1a;
          margin-top: 0;
          border-radius: 0;
        }
        .sfh2-btn--fleet-cta:hover {
          background: #1a1a1a;
          color: #fff;
        }
        .sfh2-btn--submit {
          background: #1a1a1a;
          color: #fff;
          align-self: flex-start;
          font-size: 0.75rem;
        }
        .sfh2-btn--submit:hover:not(:disabled) {
          background: #333;
        }
        .sfh2-btn--submit:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        /* ── Hero ──────────────────────────────────────────────── */
        .sfh2-hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .sfh2-hero__bg {
          position: absolute;
          inset: 0;
        }
        .sfh2-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .sfh2-hero__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
        }
        .sfh2-hero__content {
          position: relative;
          z-index: 2;
          padding: 0 2rem 7rem;
          display: flex;
          align-items: flex-end;
          flex: 1;
        }
        .sfh2-hero__inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .sfh2-hero__pre {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.65);
          margin-bottom: 1rem;
        }
        .sfh2-hero__headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 1.25rem;
          line-height: 1;
        }
        .sfh2-hero__sub {
          font-size: 1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.8);
          max-width: 540px;
          margin: 0 0 2rem;
        }
        .sfh2-hero__ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .sfh2-hero__stats {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1.1rem 2rem;
        }
        .sfh2-hero__stat {
          flex: 1;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.8);
        }
        .sfh2-hero__stat-divider {
          width: 1px;
          height: 1.2rem;
          background: rgba(255,255,255,0.2);
        }

        /* ── Intro ─────────────────────────────────────────────── */
        .sfh2-intro {
          padding: 5rem 2rem;
          background: #faf9f6;
        }
        .sfh2-intro__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .sfh2-intro__image-wrap {
          overflow: hidden;
          border-radius: 12px;
        }
        .sfh2-intro__image {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          object-position: center 72%;
          display: block;
        }
        .sfh2-intro__text {
          padding: 1rem 0;
        }
        .sfh2-intro__facts {
          list-style: none;
          margin: 2rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid #e8e6e2;
        }
        .sfh2-intro__facts li {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid #e8e6e2;
        }
        .sfh2-intro__fact-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
          min-width: 70px;
          flex-shrink: 0;
        }
        .sfh2-intro__fact-value {
          font-size: 0.9rem;
          color: #1a1a1a;
          font-weight: 500;
        }

        /* ── Fleet ─────────────────────────────────────────────── */
        .sfh2-fleet {
          background: #fff;
          padding: 5rem 2rem;
        }
        .sfh2-fleet__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-fleet__header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .sfh2-fleet__tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 3rem;
          justify-content: center;
        }
        .sfh2-fleet__tab {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.75rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s, opacity 0.2s;
          margin-bottom: -1px;
          color: rgba(0,0,0,0.4);
          font-family: 'Space Grotesk', sans-serif;
        }
        .sfh2-fleet__tab:hover {
          color: rgba(0,0,0,0.7);
        }
        .sfh2-fleet__tab.active {
          border-bottom-color: #1a1a1a;
          color: #1a1a1a;
        }
        .sfh2-fleet__tab-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
        }
        .sfh2-fleet__tab-name {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .sfh2-fleet__tab-nav {
          display: none;
          align-items: stretch;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 3rem;
        }
        .sfh2-fleet__tab-nav--desktop {
          display: none;
        }
        .sfh2-fleet__tab-nav--mobile {
          display: none;
        }
        .sfh2-fleet__tab-chevron {
          all: unset;
          cursor: pointer;
          padding: 0 1.25rem 0.75rem;
          color: #bbb;
          font-size: 0.65rem;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .sfh2-fleet__tab-chevron:hover { color: #1a1a1a; }
        .sfh2-fleet__tab-current {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1a1a1a;
          flex: 1;
          text-align: center;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #1a1a1a;
          margin-bottom: -1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .sfh2-fleet__tab-nav-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: #9ca3af;
          letter-spacing: 0.1em;
        }
        .sfh2-fleet__panel {
          display: grid;
          grid-template-columns: 60% 1fr;
          grid-template-areas: "image top-body" "image specs";
          gap: 0;
        }
        .sfh2-fleet__panel-image {
          grid-area: image;
          background: #f5f4f0;
          border-right: 1px solid #1a1a1a;
          overflow: hidden;
        }
        .sfh2-fleet__panel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .sfh2-fleet__card {
          border: 1.5px solid #1a1a1a;
        }
        .sfh2-fleet__footnote {
          display: none;
        }
        .sfh2-pricing-notes__footnote {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #9ca3af;
          margin: 0.75rem 0 0;
        }
        .sfh2-fleet__panel-sub {
          display: grid;
          grid-template-columns: 60% 1fr;
          background: #faf9f6;
          border-top: 1px solid #1a1a1a;
        }
        .sfh2-fleet__panel-sub .sfh2-fleet__panel-desc {
          padding: 1.5rem 2.5rem;
          margin: 0;
          border-right: 1px solid #1a1a1a;
        }
        .sfh2-fleet__panel-sub .sfh2-btn--fleet-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 1.5rem 2rem;
          border-top: none;
        }
        .sfh2-fleet__panel-specs-area {
          grid-area: specs;
          background: #faf9f6;
          padding: 0 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: stretch;
        }
        .sfh2-fleet__panel-specs-area .sfh2-fleet__specs {
          width: 100%;
          margin-bottom: 0;
        }
        .sfh2-fleet__panel-top-body {
          grid-area: top-body;
          padding: 1.5rem 2rem 0.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #faf9f6;
        }
        .sfh2-fleet__panel-top {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .sfh2-fleet__panel-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #9ca3af;
          display: block;
          margin-bottom: 0.5rem;
        }
        .sfh2-fleet__panel-model {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #1a1a1a;
          margin: 0 0 0.25rem;
        }
        .sfh2-fleet__panel-tagline {
          font-size: 0.85rem;
          color: #666;
          margin: 0 0 0.75rem;
          font-style: italic;
        }
        .sfh2-fleet__panel-rate {
          display: inline-flex;
          align-items: baseline;
          gap: 0.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          color: #1a1a1a;
          background: #f3f4f6;
          border: 1px solid #e8e6e2;
          padding: 0.35rem 0.85rem;
          letter-spacing: 0.05em;
        }
        .sfh2-fleet__panel-rate-vat {
          font-size: 0.6rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
        }
        .sfh2-fleet__panel-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #666;
          margin: 0.75rem 0;
          flex: 1;
        }
        .sfh2-fleet__specs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid #e8e6e2;
          margin-bottom: 1rem;
        }
        .sfh2-fleet__spec {
          padding: 0.75rem 1rem;
          border-right: 1px solid #e8e6e2;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sfh2-fleet__spec:last-child {
          border-right: none;
        }
        .sfh2-fleet__spec-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #666;
        }
        .sfh2-fleet__spec-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.95rem;
          color: #1a1a1a;
          white-space: nowrap;
        }
        .sfh2-fleet__features {
          list-style: none;
          margin: 1.5rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }
        .sfh2-fleet__feature {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.82rem;
          color: #666;
        }
        .sfh2-fleet__feature svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* ── Pricing Notes ─────────────────────────────────────── */
        .sfh2-pricing-notes {
          background: #fff;
          padding: 0 2rem 3rem;
          border-top: none;
        }
        .sfh2-pricing-notes__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-pricing-notes__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .sfh2-pricing-notes__card {
          border: 1px solid #e8e6e2;
          padding: 1.25rem 1.5rem;
          background: #faf9f6;
        }
        .sfh2-pricing-notes__card p {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #333;
          margin: 0;
        }
        .sfh2-pricing-notes__card strong {
          font-family: 'Space Grotesk', sans-serif;
          color: #1a1a1a;
        }
        .sfh2-pricing-notes__dots {
          display: none;
        }
        .sfh2-pricing-notes__footnotes {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sfh2-pricing-notes__footnotes p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #9ca3af;
          margin: 0;
          letter-spacing: 0.03em;
        }

        /* ── Destinations ──────────────────────────────────────── */
        .sfh2-destinations {
          background: #faf9f6;
          padding: 5rem 2rem;
        }
        .sfh2-destinations__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-destinations__header {
          max-width: 600px;
          margin-bottom: 3rem;
        }
        .sfh2-destinations__intro {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 0 0.5rem;
        }
        .sfh2-destinations__base-note {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin: 0;
        }
        .sfh2-destinations__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .sfh2-destinations__card {
          background: #fff;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: background 0.2s;
        }
        .sfh2-destinations__card:hover {
          background: #faf9f6;
        }
        .sfh2-destinations__card-region {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }
        .sfh2-destinations__card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        .sfh2-destinations__card-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #666;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .sfh2-destinations__dots {
          display: none;
        }
        .sfh2-destinations__footer {
          text-align: center;
          margin: 2.5rem 0 0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }

        /* ── Process ───────────────────────────────────────────── */
        .sfh2-process {
          background: #fff;
          padding: 5rem 2rem;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }
        .sfh2-process__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-process__header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .sfh2-process__steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid #e8e6e2;
        }
        .sfh2-process__step {
          padding: 3rem 2.5rem;
          border-right: 1px solid #e8e6e2;
        }
        .sfh2-process__step:last-child {
          border-right: none;
        }
        .sfh2-process__num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          color: #e8e6e2;
          line-height: 1;
          margin-bottom: 1.25rem;
        }
        .sfh2-process__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
        }
        .sfh2-process__body {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #666;
          margin: 0;
        }

        /* ── Requirements ──────────────────────────────────────── */
        .sfh2-requirements {
          background: #faf9f6;
          padding: 5rem 2rem;
        }
        .sfh2-requirements__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .sfh2-requirements__header {
          margin-bottom: 3rem;
        }
        .sfh2-requirements__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e8e6e2;
          border: 1px solid #e8e6e2;
        }
        .sfh2-requirements__card {
          background: #fff;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sfh2-requirements__num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          color: #e8e6e2;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .sfh2-requirements__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #1a1a1a;
          margin: 0;
        }
        .sfh2-requirements__body {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #666;
          margin: 0;
        }
        .sfh2-requirements__note {
          margin: 2rem 0 0;
          font-size: 0.85rem;
          color: #9ca3af;
          text-align: center;
        }

        /* ── FAQ ───────────────────────────────────────────────── */
        .sfh2-faq {
          padding: 6rem 2rem;
          background: #faf9f6;
        }
        .sfh2-faq__inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .sfh2-faq__pre-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          margin-bottom: 0.5rem;
        }
        .sfh2-faq__header {
          margin-bottom: 3rem;
        }
        .sfh2-faq__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          text-transform: uppercase;
        }
        .sfh2-faq__list {
          display: flex;
          flex-direction: column;
        }
        .sfh2-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .sfh2-faq__load-more:hover { background: #1a1a1a; color: #fff; }
        .sfh2-faq__item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding: 1.5rem 0;
          border-bottom: 1px solid #e8e6e2;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .sfh2-faq__item:hover {
          opacity: 0.75;
        }
        .sfh2-faq__number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
          letter-spacing: 0.05em;
          padding-top: 0.2rem;
          flex-shrink: 0;
          width: 2rem;
        }
        .sfh2-faq__item--open .sfh2-faq__number {
          color: #1a1a1a;
        }
        .sfh2-faq__content {
          flex: 1;
        }
        .sfh2-faq__content h4 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.4;
        }
        .sfh2-faq__toggle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #999;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }
        .sfh2-faq__item--open .sfh2-faq__toggle {
          color: #1a1a1a;
        }
        .sfh2-faq__answer {
          overflow: hidden;
        }
        .sfh2-faq__answer p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.75;
          margin: 0.75rem 0 0;
        }

        /* ── Enquiry ───────────────────────────────────────────── */
        .sfh2-enquiry {
          background: #fff;
          padding: 5rem 2rem;
        }
        .sfh2-enquiry__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 5rem;
          align-items: start;
        }
        .sfh2-enquiry__heading {
          padding-top: 0.5rem;
        }
        .sfh2-enquiry__sub {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #666;
          margin: 0;
        }
        .sfh2-enquiry__card {
          background: #faf9f6;
          border: 1.5px solid #1a1a1a;
        }
        .sfh2-enquiry__card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 2.5rem;
          border-bottom: 1px solid #1a1a1a;
          background: #1a1a1a;
        }
        .sfh2-enquiry__card-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #fff;
        }
        .sfh2-enquiry__card-note--mobile {
          display: none;
        }
        .sfh2-enquiry__card-note {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
        }
        .sfh2-enquiry__card-body {
          padding: 0;
        }
        .sfh2-enquiry__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2rem 2rem 14px;
        }
        .sfh2-enquiry__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .sfh2-enquiry__field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .sfh2-enquiry__field label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #555;
        }
        .sfh2-enquiry__optional {
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: #999;
        }
        .sfh2-enquiry__field input,
        .sfh2-enquiry__field select,
        .sfh2-enquiry__field textarea {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #1a1a1a;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 0;
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
          width: 100%;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }
        .sfh2-dropdown {
          position: relative;
          width: 100%;
        }
        .sfh2-dropdown__trigger {
          all: unset;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1a1a1a;
          background: #fff;
          border: 1px solid #e8e6e2;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .sfh2-dropdown__chevron {
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .sfh2-dropdown--open .sfh2-dropdown__chevron {
          transform: rotate(180deg);
        }
        .sfh2-dropdown__menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-top: none;
          list-style: none;
          margin: 0;
          padding: 0;
          z-index: 100;
        }
        .sfh2-dropdown__option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: #1a1a1a;
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid #e8e6e2;
          transition: background 0.15s;
        }
        .sfh2-dropdown__option:last-child {
          border-bottom: none;
        }
        .sfh2-dropdown__option:hover {
          background: #faf9f6;
        }
        .sfh2-dropdown__option--active {
          font-weight: 600;
          background: #faf9f6;
        }
        .sfh2-enquiry__field input:focus,
        .sfh2-enquiry__field select:focus,
        .sfh2-enquiry__field textarea:focus {
          border-color: #1a1a1a;
          background: #fff;
        }
        .sfh2-enquiry__error {
          font-size: 0.82rem;
          color: #991b1b;
          margin: 0;
        }
        .sfh2-enquiry__error a {
          color: #991b1b;
        }
        .sfh2-enquiry__success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          padding: 3rem 2rem;
          text-align: center;
        }
        .sfh2-enquiry__success p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .sfh2-enquiry__inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .sfh2-fleet__panel {
            grid-template-columns: 1fr;
            grid-template-areas: "image" "top-body" "specs";
          }
          .sfh2-fleet__panel-image img {
            width: 100%;
            height: auto;
          }
          .sfh2-destinations__grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sfh2-enquiry__form {
            padding: 1.25rem 1.25rem 14px;
          }
          .sfh2-enquiry__card-header {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .sfh2-enquiry__card-note--desktop { display: none; }
          .sfh2-enquiry__card-note--mobile { display: inline; }
          .sfh2-hero__headline {
            font-size: clamp(2.5rem, 10vw, 4rem);
          }
          .sfh2-hero__stats {
            padding: 0.9rem 1.5rem;
          }
          .sfh2-hero__stat {
            font-size: 0.6rem;
          }
          .sfh2-hero__content {
            padding: 0 1.5rem 6rem;
          }
          .sfh2-intro__inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .sfh2-intro__image {
            aspect-ratio: 16/9;
          }
          .sfh2-fleet__tabs {
            display: none;
          }
          .sfh2-fleet__tab-nav--desktop {
            display: none;
          }
          .sfh2-fleet__tab-nav--mobile {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          .sfh2-fleet__tab-nav--mobile .sfh2-fleet__tab-chevron {
            font-size: 1rem;
            padding: 0.75rem 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .sfh2-fleet__tab-nav--mobile .sfh2-fleet__tab-current {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: none;
            padding-bottom: 0;
          }
          .sfh2-fleet__panel-model,
          .sfh2-fleet__panel-label {
            display: none;
          }
          .sfh2-fleet__panel-tagline {
            text-align: center;
          }
          .sfh2-fleet__spec:first-child {
            display: none;
          }
          .sfh2-fleet__panel-top-body {
            padding: 0 1.75rem 0.5rem;
          }
          .sfh2-fleet__panel-sub {
            grid-template-columns: 1fr;
            border-top: none;
          }
          .sfh2-fleet__panel-sub .sfh2-fleet__panel-desc {
            border-right: none;
            border-bottom: none;
            padding: 0.75rem 1.75rem 1rem;
          }
          .sfh2-fleet__panel-sub .sfh2-btn--fleet-cta {
            padding: 1.25rem 1.75rem;
            border-top: 1px solid #1a1a1a;
          }
          .sfh2-process__steps {
            grid-template-columns: 1fr;
          }
          .sfh2-process__step {
            border-right: none;
            border-bottom: 1px solid #e8e6e2;
          }
          .sfh2-process__step:last-child {
            border-bottom: none;
          }
          .sfh2-requirements__grid {
            grid-template-columns: 1fr;
          }
          .sfh2-pricing-notes {
            padding-bottom: 14px;
          }
          .sfh2-fleet__footnote {
            display: block;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7rem;
            color: #9ca3af;
            margin: 0.75rem 0 0;
          }
          .sfh2-pricing-notes__footnote {
            display: none;
          }
          .sfh2-pricing-notes__grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            gap: 0;
            margin-bottom: 0;
          }
          .sfh2-pricing-notes__grid::-webkit-scrollbar {
            display: none;
          }
          .sfh2-pricing-notes__card {
            flex: 0 0 100%;
            margin-right: 1rem;
            scroll-snap-align: start;
          }
          .sfh2-pricing-notes__card:last-child {
            margin-right: 0;
          }
          .sfh2-pricing-notes__dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            padding-top: 14px;
          }
          .sfh2-pricing-notes__dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ccc8c1;
            transition: background 0.2s;
            cursor: pointer;
          }
          .sfh2-pricing-notes__dot--active {
            background: #1a1a1a;
          }
          .sfh2-destinations__grid {
            grid-template-columns: unset;
            grid-template-rows: repeat(2, auto);
            grid-auto-flow: column;
            grid-auto-columns: 50%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
          }
          .sfh2-destinations__grid::-webkit-scrollbar {
            display: none;
          }
          .sfh2-destinations__card {
            scroll-snap-align: start;
          }
          .sfh2-destinations__dots {
            display: flex;
            justify-content: center;
            gap: 6px;
            padding-top: 14px;
          }
          .sfh2-destinations__dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ccc8c1;
            transition: background 0.2s;
            cursor: pointer;
          }
          .sfh2-destinations__dot--active {
            background: #1a1a1a;
          }
          .sfh2-destinations__dots {
            display: flex;
          }
          .sfh2-enquiry__row {
            grid-template-columns: 1fr;
          }
          .sfh2-btn--submit {
            width: 100%;
            text-align: center;
          }
          .sfh2-section-heading {
            font-size: clamp(1.75rem, 6vw, 2.5rem);
            text-align: center;
          }
          .sfh2-faq h2 {
            text-align: center;
          }
          .sfh2-intro,
          .sfh2-fleet,
          .sfh2-destinations,
          .sfh2-process,
          .sfh2-enquiry {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .sfh2-enquiry {
            padding-bottom: 0;
          }
          .sfh2-intro {
            padding-bottom: 0;
          }
          .sfh2-fleet {
            padding-top: 36px;
            padding-bottom: 14px;
          }
          .sfh2-faq {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .sfh2-pre-label,
          .sfh2-faq__pre-label {
            display: flex;
            align-items: center;
            gap: 1rem;
            white-space: nowrap;
          }
          .sfh2-pre-label::before,
          .sfh2-pre-label::after,
          .sfh2-faq__pre-label::before,
          .sfh2-faq__pre-label::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #bbb;
            min-width: 20px;
          }
        }

        @media (max-width: 335px) {
          .sfh2-fleet {
            padding-left: clamp(0px, calc(2rem - (335px - 100vw) / 2), 2rem);
            padding-right: clamp(0px, calc(2rem - (335px - 100vw) / 2), 2rem);
          }
        }
        @media (max-width: 360px) {
          .sfh2-enquiry {
            padding-left: clamp(2px, calc(2rem - (360px - 100vw) / 2), 2rem);
            padding-right: clamp(2px, calc(2rem - (360px - 100vw) / 2), 2rem);
          }
        }

        @media (max-width: 480px) {
          .sfh2-hero__ctas {
            flex-direction: column;
          }
          .sfh2-btn {
            text-align: center;
          }
          .sfh2-hero__stat-divider {
            display: none;
          }
          .sfh2-hero__stats {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
