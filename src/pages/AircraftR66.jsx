/**
 * HQ AVIATION - ROBINSON R66 AIRCRAFT PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 * Aesthetic: Editorial Design, Luxury Aviation
 *
 * Sections:
 * 1. Hero - Full viewport with animated title
 * 2. Introduction - Robinson's first turbine helicopter
 * 3. History Timeline - First flight 2007, certified 2010
 * 4. Technical Specifications - Interactive specs card
 * 5. Flight Characteristics - Turbine smoothness, performance
 * 6. NXG Glass Cockpit - Garmin avionics, touchscreen navigators
 * 7. Autopilot & Technology - GFC 600H features, safety benefits
 * 8. Captain Quentin Smith Achievement - North Pole expedition
 * 9. Variants Section - R66 Standard, Marine, Newscopter
 * 10. Why Turbine Section - Benefits over piston
 * 11. Gallery - Grid of R66 images
 * 12. CTA - Link to expeditions and sales
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence, LayoutGroup } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useAircraftSpecRows } from '../hooks/useAircraftSpecs';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { SECTION_MAP } from '../lib/imageSections';
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import Image from '../components/Image';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import Footer
import FooterMinimal from '../components/FooterMinimal';
import AircraftPriceBlock from '../components/AircraftPriceBlock';
import { getSubtypes } from '../config/aircraftCatalog';
import HqMenuPanel from '../components/HqMenuPanel';
import R66Case from '../components/R66/R66Case';

// ============================================================================
// COMPONENT: R66Header
// ============================================================================
function R66Header() {
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
                width={405}
                height={245}
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/fleet" className="Header-nav-item">Fleet</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/expeditions" className="Header-nav-item">Expeditions</Link>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// ============================================================================
// COMPONENT: Reveal Animation Wrapper
// ============================================================================
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// COMPONENT: AnimatedNumber
// ============================================================================
function AnimatedNumber({ value, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value.toString().replace(/[^0-9]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = num / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ============================================================================
// DATA
// ============================================================================

// Static R66 specs (engine, dimensions, etc.) that don't change with aux fuel.
const r66SpecsStatic = [
  { label: 'Engine', value: 'Rolls-Royce RR300', icon: 'fa-cog' },
  { label: 'Power', value: '270 SHP', icon: 'fa-bolt' },
  { label: 'Max Speed', value: '140 kts', icon: 'fa-tachometer-alt' },
  { label: 'Cruise Speed', value: '110 kts', icon: 'fa-plane' },
  { label: 'Useful Load', value: '1,200 lbs', icon: 'fa-weight-hanging' },
  { label: 'Seats', value: '5', icon: 'fa-users' },
  { label: 'Rotor Diameter', value: '33 ft', icon: 'fa-circle-notch' },
];

// Aux-fuel-dependent specs. Per RHC: 23-gal aux = +100 nm / +1 hr; 43-gal aux = +200 nm / +2 hr.
// The two tanks are mutually exclusive (only one can be installed at a time).
const r66AuxConfigs = {
  none:  { range: '350 nm',  fuelCapacity: '73.3 gal',  endurance: '3+ hrs' },
  aux23: { range: '450 nm',  fuelCapacity: '96.3 gal',  endurance: '4+ hrs' },
  aux43: { range: '550 nm',  fuelCapacity: '116.3 gal', endurance: '5+ hrs' },
};

function buildR66Specs(auxKey, baseRows) {
  const aux = r66AuxConfigs[auxKey] ?? r66AuxConfigs.none;
  // Override the three aux-affected labels (Range, Fuel Capacity, Endurance)
  // on whatever base rows came in (admin-managed if available, static otherwise).
  // Any row whose label doesn't match an aux field is passed through unchanged.
  const overrides = {
    'Range':         { value: aux.range,         icon: 'fa-route' },
    'Fuel Capacity': { value: aux.fuelCapacity,  icon: 'fa-gas-pump' },
    'Endurance':     { value: aux.endurance,     icon: 'fa-clock' },
  };
  return baseRows.map((row) => {
    const o = overrides[row.label];
    return o ? { ...row, ...o } : row;
  });
}

const historyTimeline = [
  { year: '2007', title: 'First Flight', description: 'The R66 prototype took to the skies, marking Robinson\'s entry into the turbine helicopter market.', status: 'completed' },
  { year: '2010', title: 'FAA Certification', description: 'Received FAA Type Certificate, becoming Robinson\'s first turbine-powered helicopter.', status: 'completed' },
  { year: '2011', title: 'Production Begins', description: 'Full-scale production commenced at the Torrance, California factory.', status: 'completed' },
  { year: '2012', title: 'EASA Certification', description: 'European Aviation Safety Agency certification opened global markets.', status: 'completed' },
  { year: '2019', title: '1,000th Delivery', description: 'Robinson delivered the 1,000th R66, cementing its position in the turbine market.', status: 'completed' },
  { year: '2024', title: 'NXG Avionics', description: 'The R66 received the new NXG glass cockpit avionics suite as standard.', status: 'completed' },
];

const flightCharacteristics = [
  {
    title: 'Turbine Smoothness',
    description: 'The Rolls-Royce RR300 turbine engine delivers exceptionally smooth power delivery with minimal vibration, creating a refined flying experience that passengers and pilots alike appreciate.',
    icon: 'fa-wind',
  },
  {
    title: 'Hot & High Performance',
    description: 'Superior performance in challenging conditions. The turbine engine maintains power at high altitudes and temperatures where piston engines struggle, making it ideal for mountain operations.',
    icon: 'fa-mountain',
  },
  {
    title: '5-Seat Capability',
    description: 'The largest cabin in the Robinson lineup offers five-seat capacity with comfortable spacing. Rear passengers enjoy excellent visibility through large windows.',
    icon: 'fa-users',
  },
];

const nxgCockpitFeatures = [
  {
    title: 'Full Garmin Glass Cockpit',
    description: 'The NXG package delivers a complete Garmin avionics suite, replacing traditional analog gauges with modern digital displays for enhanced situational awareness.',
    icon: 'fa-desktop',
  },
  {
    title: 'GTN 650Xi Touchscreen Navigator',
    description: 'Garmin GTN 650Xi touchscreen navigator provides intuitive flight planning, moving map displays, and seamless integration with the autopilot system.',
    icon: 'fa-hand-pointer',
  },
  {
    title: 'G500H TXi Flight Display',
    description: 'Primary flight display showing attitude, airspeed, altitude and vertical speed, with optional synthetic vision for enhanced terrain awareness.',
    icon: 'fa-tachometer-alt',
  },
  {
    title: 'Impact-Resistant Windshield',
    description: 'Advanced laminated windshield provides superior protection against bird strikes and debris while maintaining excellent optical clarity.',
    icon: 'fa-shield-alt',
  },
];

const autopilotModes = [
  {
    mode: 'ALT',
    name: 'Altitude Hold',
    description: 'Automatically maintains selected altitude, reducing pilot workload during cruise flight.',
  },
  {
    mode: 'HDG',
    name: 'Heading Select',
    description: 'Holds or intercepts selected headings, simplifying navigation and traffic pattern work.',
  },
  {
    mode: 'NAV',
    name: 'Navigation Mode',
    description: 'Tracks GPS flight plans and VOR courses for hands-off enroute navigation.',
  },
  {
    mode: 'APR',
    name: 'Approach Mode',
    description: 'Provides precise lateral and vertical guidance during instrument approaches.',
  },
];

// Shared R66 family downloads (Robinson publishes per NxG trim; we use Riviera's publicly-hosted PDFs as the family defaults)
const R66_FAMILY_BROCHURE = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RH_R66_Nx_G_US_Digital_Corporate_Brochure_Feb_2026_9632b53472.pdf';
// Robinson publishes a dedicated EOC sheet for each of the three NxG civilian
// trims. R66 Police and Military Trainer do not have a public EOC or brochure
// published on robinsonheli.com — their `eoc` field is omitted so the button
// isn't rendered.
const R66_PALO_VERDE_EOC = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r66_nxg_palo_verde_2026_256ac8c7ca.pdf';
const R66_SOUTHWOOD_EOC  = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r66_nxg_southwood_2026_d1df6e9083.pdf';
const R66_RIVIERA_EOC    = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r66_nxg_riviera_2026_108204ceda.pdf';

const R66_CONFIGURATOR_BASE = 'https://configurator.robinsonheli.com/';

// Robinson's live configurator only ships ids for Palo Verde, Southwood, and
// Riviera. Police & Military Trainer fall back to Palo Verde (the base R66
// platform those packages are built on); we surface a note in those cases.
function r66ConfiguratorUrl(variantIndex) {
  const idMap = [
    'r66-nx-g-palo-verde',
    'r66-nx-g-southwood',
    'r66-nx-g-riviera',
    'r66-nx-g-palo-verde',
    'r66-nx-g-palo-verde',
  ];
  const id = idMap[variantIndex] || 'r66-nx-g-palo-verde';
  return `${R66_CONFIGURATOR_BASE}?helicopter=${id}&splash=false`;
}
const R66_CONFIGURATOR_FALLBACK_INDEXES = new Set([3, 4]);

const r66Variants = [
  {
    name: 'NxG Palo Verde',
    subtitle: 'Rugged but Refined',
    tagline: 'Rugged but refined.',
    description: 'The R66 is known for its reliability, value, ease of maintenance and low operating costs. The five-seat Palo Verde builds on that foundation with modern technology, upgraded interior finishes and refined styling, delivering turbine performance and everyday usability in a package designed for the long haul.',
    image: '/assets/images/new-aircraft/r66/variants/r66-turbine.png',
    icon: 'fa-helicopter',
    useCases: ['Stylish, reliable, and safe'],
    features: [
      { icon: 'fa-desktop',        text: 'Full Garmin glass cockpit' },
      { icon: 'fa-couch',          text: 'Hand-stitched leather seating' },
      { icon: 'fa-robot',          text: "Industry's first two-axis autopilot" },
      { icon: 'fa-shield-alt',     text: 'Impact-resistant windshield' },
      { icon: 'fa-paint-roller',   text: 'All-new, contemporary exterior paint scheme' },
    ],
    pdfs: { brochure: R66_FAMILY_BROCHURE, eoc: R66_PALO_VERDE_EOC },
  },
  {
    name: 'NxG Southwood',
    subtitle: 'Mission Ready',
    tagline: 'Feature-filled and mission ready.',
    description: 'The Southwood comes with a host of standard features to accomplish any mission. Standard equipment includes the Garmin G500H 700P/700P TXi glass cockpit, Garmin GTN 635Xi GPS/COM, a Garmin 2-axis autopilot, a polycarbonate impact-resistant windshield, leather seats, tinted windows, air conditioning, and more.',
    image: '/assets/images/new-aircraft/r66/variants/r66-southwood.png',
    icon: 'fa-star',
    useCases: ['Built to accomplish any mission'],
    features: [
      { icon: 'fa-desktop',    text: 'Garmin G500H 700P/700P TXi glass cockpit' },
      { icon: 'fa-satellite',  text: 'Garmin GTN 635Xi GPS/COM' },
      { icon: 'fa-robot',      text: '2-Axis Garmin Autopilot' },
      { icon: 'fa-shield-alt', text: 'Polycarbonate Impact-Resistant Windshield Standard' },
      { icon: 'fa-snowflake',  text: 'Air Conditioning' },
    ],
    pdfs: { brochure: R66_FAMILY_BROCHURE, eoc: R66_SOUTHWOOD_EOC },
  },
  {
    name: 'NxG Riviera',
    subtitle: 'Limited Edition',
    tagline: 'Limited edition, upscale interior.',
    description: "The Riviera is Robinson's top-of-the line R66, only available for order through Spring 2026. This fully loaded helicopter features unique interior finishes, impact-resistant windshield, all-glass Garmin avionics, and a 3-axis autopilot. Only available on the Riviera trim, a Midnight + Umber interior, with contemporary wood flooring, an Alcantara headliner, and midnight leather seats accented with laser-etched suede inserts.",
    image: '/assets/images/new-aircraft/r66/variants/r66-riviera.png',
    icon: 'fa-gem',
    useCases: ["Robinson's top-of-the-line R66"],
    features: [
      { icon: 'fa-desktop',    text: 'All-glass Garmin avionics' },
      { icon: 'fa-robot',      text: '3-axis autopilot' },
      { icon: 'fa-shield-alt', text: 'Impact-resistant windshield' },
      { icon: 'fa-couch',      text: 'Midnight + Umber interior with Alcantara headliner' },
      { icon: 'fa-tree',       text: 'Contemporary wood flooring' },
    ],
    pdfs: { brochure: R66_FAMILY_BROCHURE, eoc: R66_RIVIERA_EOC },
  },
  {
    name: 'NxG Police',
    subtitle: 'Built to Protect & Serve',
    tagline: 'Built to protect & serve.',
    description: 'Fully outfitted and ready for service on delivery, the four-seat R66 NxG Police gives law enforcement every advantage at roughly one-third the acquisition cost and half the operating cost of comparable helicopters. A Rolls-Royce RR300 turbine, state-of-the-art imaging, advanced navigation and up to three hours of flight time mean more proactive patrolling and faster reaction times, backed by Robinson\'s vertically integrated parts supply.',
    image: '/assets/images/new-aircraft/r66/variants/r66-police.png',
    icon: 'fa-shield-alt',
    useCases: ['Patrol', 'Tracking suspects', 'Supporting tactical teams'],
    features: [
      { icon: 'fa-dollar-sign', text: 'Cost-Effective' },
      { icon: 'fa-route',       text: 'Proactive Patrol' },
      { icon: 'fa-clock',       text: 'Maximized Airtime' },
      { icon: 'fa-microchip',   text: 'Advanced Technology' },
      { icon: 'fa-cogs',        text: 'Reliable Parts' },
    ],
    pdfs: { brochure: R66_FAMILY_BROCHURE },
  },
  {
    name: 'Military Trainer',
    subtitle: 'Training Platform',
    tagline: 'The future of military flight training.',
    description: "Built on Robinson's proven R66 platform, the Military Trainer delivers an ideal balance of safety, performance, and affordability to train the next generation of military aviators. Designed, engineered, and manufactured in Torrance, California, means maximum availability with dependable parts support.",
    image: '/assets/images/new-aircraft/r66/variants/r66-military-trainer.png',
    icon: 'fa-user-graduate',
    useCases: ['Preparing aviators for a wide array of operational environments'],
    features: [
      { icon: 'fa-graduation-cap',  text: 'Building Core Aviator Skills' },
      { icon: 'fa-dollar-sign',     text: 'Maximum Availability at the Lowest Cost' },
      { icon: 'fa-desktop',         text: 'All-glass cockpit with Garmin G500H TXi and GTN750 avionics' },
      { icon: 'fa-robot',           text: 'Advanced 3-axis autopilot' },
      { icon: 'fa-moon',            text: 'NVG compatibility' },
    ],
    pdfs: { brochure: R66_FAMILY_BROCHURE },
  },
];

const turbineBenefits = [
  {
    title: 'Fleet Flight Hours',
    description: 'The global R66 fleet has accumulated over 1.5 million flight hours, demonstrating proven reliability in operations worldwide.',
    stat: '1.5M+',
    statLabel: 'Flight Hours',
  },
  {
    title: 'Engine Reliability',
    description: 'The Rolls-Royce RR300 turbine has achieved an unprecedented safety record with zero in-flight engine failures across the entire fleet.',
    stat: '0',
    statLabel: 'In-Flight Failures',
  },
  {
    title: 'Time Between Overhaul',
    description: 'The RR300 engine boasts an impressive 2,000-hour TBO, minimizing maintenance downtime and maximizing aircraft availability.',
    stat: '2,000',
    statLabel: 'Hour TBO',
  },
  {
    title: 'Fleet Size',
    description: 'Over 1,500 R66 turbines delivered worldwide since 2010, making it the fastest-growing turbine helicopter in its class.',
    stat: '1,500+',
    statLabel: 'Aircraft Delivered',
  },
];

const expeditionSlides = [
  {
    image: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',
    alt: 'Five R66 Helicopters at the North Pole',
    paragraphs: [
      "Expedition of five R66 helicopters to the Magnetic North Pole, Geographic North Pole and Pole of Inaccessibility, proving the R66's capability in extreme cold.",
    ],
  },
  {
    image: '/assets/images/expeditions/antartica.jpg',
    alt: 'R66 expedition through Iceland and Greenland',
    paragraphs: [
      "Iceland and Greenland: glacial terrain tested without issue.",
    ],
  },
  {
    image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    alt: 'R66 expedition traversing Africa',
    paragraphs: [
      'Across Africa: high heat, high altitude, the R66 performing flawlessly.',
    ],
  },
];

const galleryImages = [
  { src: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png', alt: 'R66 in Blue Livery' },
  { src: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg', alt: 'R66 Spotlight View' },
  { src: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-all-glass-cockpit-13338.jpg', alt: 'R66 Glass Cockpit' },
  { src: '/assets/images/new-aircraft/r66/r66bluprint.jpg', alt: 'R66 Blueprint' },
  { src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'R66 Fleet at North Pole' },
  { src: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp', alt: 'R66 Expedition' },
];

// ============================================================================
// SECTION 1: Hero
// ============================================================================
function R66Hero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const pageImages = usePageImages('r66');
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try { v.playbackRate = 2; } catch { /* no-op */ }
    const onPlaying = () => setVideoReady(true);
    v.addEventListener('playing', onPlaying);
    if (!v.paused && v.readyState >= 3) setVideoReady(true);
    return () => v.removeEventListener('playing', onPlaying);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 0.7]);

  return (
    <section ref={heroRef} className="r66-hero" data-cms-section="r66-hero">
      <motion.div
        className="r66-hero__bg"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src={pageImages['r66-hero']?.[0]?.url || '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg'}
          alt="Robinson R66 Turbine Helicopter"
          width={2500}
          height={3750}
          priority
          sizes="100vw"
        />
        <video
          ref={videoRef}
          className={`r66-hero__video${videoReady ? ' r66-hero__video--ready' : ''}`}
          src="/assets/videos/r66-hero.mp4"
          poster={pageImages['r66-hero']?.[0]?.url || '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg'}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
          tabIndex={-1}
        />
      </motion.div>

      <motion.div
        className="r66-hero__overlay"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="r66-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="r66-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ROBINSON HELICOPTER COMPANY
        </motion.span>

        <div className="r66-hero__headline">
          {['R', '6', '6'].map((letter, i) => (
            <motion.span
              key={i}
              className="r66-hero__letter"
              initial={{ opacity: 0, y: 60, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4 + i * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.span
          className="r66-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          TURBINE
        </motion.span>

        <motion.div
          className="r66-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />

        <motion.p
          className="r66-hero__tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          Robinson's first turbine-powered helicopter. Five seats.
          Rolls-Royce power. Proven reliability.
        </motion.p>

        <motion.div
          className="r66-hero__badges"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="r66-hero__badge">
            <span className="r66-hero__badge-value">270</span>
            <span className="r66-hero__badge-label">SHP</span>
          </div>
          <div className="r66-hero__badge-divider" />
          <div className="r66-hero__badge">
            <span className="r66-hero__badge-value">140</span>
            <span className="r66-hero__badge-label">KTS</span>
          </div>
          <div className="r66-hero__badge-divider" />
          <div className="r66-hero__badge">
            <span className="r66-hero__badge-value">5</span>
            <span className="r66-hero__badge-label">SEATS</span>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}

// ============================================================================
// SECTION 1B: Highlights
// ============================================================================
function R66Highlights() {
  const ref = useRef(null);
  const [blurPx, setBlurPx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const next = el.nextElementSibling;
      if (!next) return;
      const rect = el.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const height = rect.height;
      if (height <= 0) return;
      // Blur grows as intro rises over highlights (0 → 16px)
      const progress = Math.max(0, Math.min(1, (height - nextRect.top) / height));
      setBlurPx(progress * 16);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="r66-highlights"
      style={{ filter: `blur(${blurPx}px)`, WebkitFilter: `blur(${blurPx}px)` }}
    >
      <div className="r66-highlights__container">
        <Reveal>
          <div className="r66-highlights__header">
            <span className="r66-pre-text">AT A GLANCE</span>
            <h2 className="r66-highlights__headline">
              <span className="r66-text--dark">Taking a look</span>{' '}
              <span className="r66-text--mid">at the R66</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1} direction="right">
          <div className="r66-highlights__image">
            <img
              src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png"
              alt="Robinson R66 front-quarter view in Palo Verde blue livery"
              loading="lazy"
              width={2500}
              height={1406}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 2: Introduction
// ============================================================================
function R66Introduction() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Compute a negative "top" so intro only pins when its bottom reaches the
    // viewport bottom — intro scrolls normally first (internal sticky left
    // column works), then specs rises up over the pinned intro.
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const introH = el.offsetHeight;

      // Default: pin when intro's bottom reaches viewport bottom (R44 fallback).
      let stickTop = Math.min(0, vh - introH);

      // Preferred: pin later so at pin, the expedition container's top lines
      // up with the pre-text (held at catch-top by the sticky left column).
      //   stickTop = catchTop - expeditionOffsetFromIntro
      const expedition = el.querySelector('.r66-expedition__container');
      const preText = el.querySelector('.r66-pre-text');
      if (expedition && preText) {
        const introRect = el.getBoundingClientRect();
        const expOffsetFromIntro = expedition.getBoundingClientRect().top - introRect.top;
        // Match CSS: top: max(10vh, var(--catch-top, 90px)) on .r66-intro__content
        const catchTopVar = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
        );
        const catchTop = Math.max(vh * 0.1, Number.isFinite(catchTopVar) ? catchTopVar : 90);
        const alignedStickTop = Math.min(0, catchTop - expOffsetFromIntro);
        // Use whichever pins LATER (more negative) so the user can actually
        // scroll the expedition all the way up to the pre-text line.
        stickTop = Math.min(stickTop, alignedStickTop);
      }

      document.documentElement.style.setProperty('--r66-intro-stick-top', `${stickTop}px`);
    };
    update();

    // Progressively blur + lighten intro as variants rises, but ONLY after the
    // expedition container has reached its sticky pin at catch-top. Before
    // that, we're still scrolling through the intro content naturally and
    // no blur should apply. We gate directly on expedition's live position
    // so the start point is accurate regardless of stickTop fallback math.
    const MAX_BLUR = 10;
    const nextSection = document.querySelector('.r66-variants');

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !nextSection) return;
      const rect = nextSection.getBoundingClientRect();
      const vh = window.innerHeight;

      const expedition = el.querySelector('.r66-expedition__container');
      const catchTopVar = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
      );
      const catchTop = Math.max(vh * 0.1, Number.isFinite(catchTopVar) ? catchTopVar : 90);

      // Hard gate: if expedition hasn't reached catch-top yet, stay clear.
      if (expedition) {
        const expTop = expedition.getBoundingClientRect().top;
        if (expTop > catchTop) {
          el.style.setProperty('--r66-intro-blur', '0px');
          el.style.setProperty('--r66-intro-lighten', '0');
          return;
        }
      }

      // After expedition has pinned, progress ramps 0→1 as variants rises
      // from its pin-moment position to the viewport top.
      // At pin: next.top = catchTop + (introH - expOffsetFromIntro).
      const introRect = el.getBoundingClientRect();
      const introH = el.offsetHeight;
      const expOffset = expedition
        ? expedition.getBoundingClientRect().top - introRect.top
        : 0;
      const nextTopAtPin = Math.max(1, catchTop + introH - expOffset);
      const progress = Math.min(1, Math.max(0, 1 - rect.top / nextTopAtPin));
      el.style.setProperty('--r66-intro-blur', `${progress * MAX_BLUR}px`);
      // Ease-in for the fade: stays nearly clear for most of the scroll,
      // then ramps up quickly toward the end. Remap so full opacity is
      // reached before progress=1 (tail stays pinned at fully covered).
      const FADE_COMPLETE = 0.95;
      const adjusted = Math.min(1, progress / FADE_COMPLETE);
      const lighten = Math.pow(adjusted, 8);
      el.style.setProperty('--r66-intro-lighten', `${lighten}`);
    };
    onScroll();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="r66-intro">
      <div className="r66-intro__container">
        <div className="r66-intro__content">
          <Reveal>
            <span className="r66-pre-text">THE FIRST TURBINE</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="r66-intro__headline">
              <span className="r66-text--dark">Robinson's</span>{' '}
              <span className="r66-text--mid">Turbine</span>{' '}
              <span className="r66-text--light">Revolution</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="r66-intro__text">
              The R66 represents Robinson Helicopter Company's bold entry into the turbine market.
              Combining the company's legendary reliability and value with the power and performance
              of a Rolls-Royce turbine engine, the R66 delivers an unmatched combination of
              capability, efficiency, and Robinson simplicity.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="r66-intro__text">
              With five-seat capacity, smooth turbine power, and operating costs
              significantly lower than other turbine helicopters, the R66 has redefined
              what's possible in light turbine aviation.
            </p>
          </Reveal>
        </div>
        <div className="r66-intro__right">
          <Reveal delay={0.4} direction="right">
            <div className="r66-intro__image">
              <img
                src="/assets/images/facility/r66-lineup.png"
                alt="HQ Aviation R66 fleet lineup"
                width={1920}
                height={1080}
                loading="lazy"
              />
            </div>
          </Reveal>
          <div className="r66-intro__divider" />
          <R66Expedition />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: History Timeline
// ============================================================================
function R66History() {
  return (
    <section className="r66-timeline">
        <Reveal>
          <div className="r66-section-header">
            <h2>
              <span className="r66-text--dark">History</span>{' '}
              <span className="r66-text--mid">of the</span>{' '}
              <span className="r66-text--light">R66</span>
            </h2>
          </div>
        </Reveal>

        <div className="r66-timeline__track">
          <div className="r66-timeline__line">
            <div className="r66-timeline__line-progress" />
          </div>

          {historyTimeline.map((event, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className={`r66-timeline__item r66-timeline__item--${event.status || 'completed'}`}>
                <div className="r66-timeline__marker">
                  {event.status === 'active' && <div className="r66-timeline__pulse" />}
                  {event.status === 'upcoming' && <div className="r66-timeline__dot" />}
                  {(!event.status || event.status === 'completed') && <i className="fas fa-check"></i>}
                </div>
                <div className="r66-timeline__content">
                  <span className="r66-timeline__year">{event.year}</span>
                  <div className="r66-timeline__text">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
    </section>
  );
}

// ============================================================================
// SECTION 4: Technical Specifications
// ============================================================================
function R66Specifications() {
  const [activeSpec, setActiveSpec] = useState(null);
  // Aux tank selection — mutually exclusive: 'none' | 'aux23' | 'aux43'
  const [auxKey, setAuxKey] = useState('none');
  const aux23Enabled = auxKey === 'aux23';
  const aux43Enabled = auxKey === 'aux43';
  const isExtendedRange = auxKey !== 'none';
  const setAux23Enabled = (on) => setAuxKey(on ? 'aux23' : 'none');
  const setAux43Enabled = (on) => setAuxKey(on ? 'aux43' : 'none');
  const baseRows = useAircraftSpecRows('r66');
  const r66Specs = buildR66Specs(auxKey, baseRows.length ? baseRows : r66SpecsStatic);

  return (
    <section className="r66-specs">
      <div className="r66-specs__container">
        <div className="r66-specs__split">
          <div className="r66-specs__split-left">
            <Reveal>
              <div className="r66-section-header">
                <span className="r66-pre-text">PERFORMANCE DATA</span>
                <h2>
                  <span className="r66-text--dark">Technical</span>{' '}
                  <span className="r66-text--mid">Specifications</span>
                </h2>
              </div>
            </Reveal>

            <div className="r66-specs__columns">
              <div className="r66-specs__right">
                <div className="r66-specs__blueprint-card">
                  <img
                    src="/assets/images/new-aircraft/r66/r66bluprint.jpg"
                    alt="R66 Blueprint"
                    className="r66-specs__blueprint"
                    width={1024}
                    height={595}
                    loading="lazy"
                  />
                </div>
                <div className="r66-specs__overlay-data">
                  <div className="r66-specs__overlay-item">
                    <span>LENGTH</span>
                    <span>29.5 ft</span>
                  </div>
                  <div className="r66-specs__overlay-item">
                    <span>HEIGHT</span>
                    <span>11.7 ft</span>
                  </div>
                  <div className="r66-specs__overlay-item">
                    <span>MAX WEIGHT</span>
                    <span>2,700 lbs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="r66-specs__split-right">
            <div className="r66-specs__table">
              <div className="r66-specs__row r66-specs__row--header">
                <div className="r66-specs__cell">Specification</div>
                <div className="r66-specs__cell r66-specs__aux-cell">
                  <label className="r66-specs__aux-label">
                    <input
                      type="checkbox"
                      checked={aux23Enabled}
                      onChange={(e) => setAux23Enabled(e.target.checked)}
                      className="r66-specs__aux-checkbox"
                    />
                    <span className="r66-specs__aux-check">
                      {aux23Enabled && <span>✓</span>}
                    </span>
                    <span className="r66-specs__aux-text">+ 23-gal Aux</span>
                  </label>
                  <label className="r66-specs__aux-label">
                    <input
                      type="checkbox"
                      checked={aux43Enabled}
                      onChange={(e) => setAux43Enabled(e.target.checked)}
                      className="r66-specs__aux-checkbox"
                    />
                    <span className="r66-specs__aux-check">
                      {aux43Enabled && <span>✓</span>}
                    </span>
                    <span className="r66-specs__aux-text">+ 43-gal Aux</span>
                  </label>
                </div>
              </div>
              {r66Specs.map((spec, i) => {
                const isHighlighted = isExtendedRange && ['Range', 'Fuel Capacity', 'Endurance'].includes(spec.label);
                return (
                  <div key={i} className="r66-specs__row">
                    <div className="r66-specs__cell r66-specs__cell--label">{spec.label}</div>
                    <div className={`r66-specs__cell${isHighlighted ? ' r66-specs__cell--highlighted' : ''}`}>{spec.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="r66-specs__split-divider" />

            <Reveal>
              <div className="r66-proven__stats-bar">
                {turbineBenefits
                  .filter((b) => b.statLabel !== 'Hour TBO')
                  .map((b, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="r66-proven__stat-divider" />}
                      <div className="r66-proven__stat">
                        <span className="r66-proven__stat-value">{b.stat}</span>
                        <span className="r66-proven__stat-label">{b.statLabel}</span>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </Reveal>

            <div className="r66-specs__split-divider" />

            <div className="r66-proven__grid">
              {flightCharacteristics.map((item, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="r66-proven__card">
                    {item.icon && (
                      <div className="r66-proven__card-icon">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6: NXG Glass Cockpit
// ============================================================================
function R66NXGCockpit() {
  return (
    <section className="r66-nxg">
      <div className="r66-nxg__container">
        <div className="r66-nxg__content">
          <div className="r66-nxg__left">
            <Reveal>
              <div className="r66-section-header">
                <span className="r66-pre-text">STANDARD ON NEW NxG R66s</span>
                <h2>
                  <span className="r66-text--dark">NXG</span>{' '}
                  <span className="r66-text--mid">Glass</span>{' '}
                  <span className="r66-text--light">Cockpit</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="r66-nxg__intro">
                The NxG avionics package transforms the R66 cockpit with a full Garmin glass
                suite, hand-stitched leather seating and a factory-integrated two-axis autopilot
                option, now the standard spec on new-production R66s.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="r66-nxg__image">
                <img
                  src="/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-all-glass-cockpit-13338.jpg"
                  alt="R66 NXG Glass Cockpit"
                  width={2500}
                  height={1667}
                  loading="lazy"
                />
                <div className="r66-nxg__image-badge">
                  <span className="r66-nxg__image-badge-label">GARMIN</span>
                  <span className="r66-nxg__image-badge-text">Integrated Avionics</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="r66-nxg__features">
            {nxgCockpitFeatures.map((feature, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <motion.div
                  className="r66-nxg__feature"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="r66-nxg__feature-icon">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <div className="r66-nxg__feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// SECTION: R66 Fleet Lineup
// ============================================================================
function R66Fleet() {
  return (
    <section className="r66-fleet">
      <div className="r66-fleet__container">
        <Reveal>
          <div className="r66-fleet__image-wrap">
            <img
              src="/assets/images/facility/r66-lineup.png"
              alt="HQ Aviation R66 fleet lineup"
              width={1920}
              height={1080}
              loading="lazy"
            />
            <div className="r66-fleet__caption">
              <span className="r66-fleet__caption-label">HQ Aviation</span>
              <span className="r66-fleet__caption-text">Some of Our R66s</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 7: Autopilot & Technology
// ============================================================================
function R66Autopilot() {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <section className="r66-autopilot">
      <div className="r66-autopilot__container">
        <Reveal>
          <div className="r66-section-header r66-section-header--center">
            <span className="r66-pre-text">GARMIN GFC 600H</span>
            <h2>
              <span className="r66-text--dark">Two-Axis</span>{' '}
              <span className="r66-text--mid">Autopilot</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="r66-autopilot__intro">
            The Garmin GFC 600H represents a breakthrough in helicopter automation. As the industry's
            first two-axis autopilot standard in a light turbine helicopter, it delivers altitude hold,
            heading select, navigation, and approach modes for unprecedented capability.
          </p>
        </Reveal>

        <div className="r66-autopilot__modes-section">
          <Reveal delay={0.2}>
            <div className="r66-autopilot__modes-header">
              <h3>Autopilot Modes</h3>
            </div>
          </Reveal>

          <div className="r66-autopilot__modes-content">
            <Reveal delay={0.3} direction="left">
              <div className="r66-autopilot__modes-selector">
                {autopilotModes.map((mode, i) => (
                  <motion.button
                    key={i}
                    className={`r66-autopilot__mode-btn ${activeMode === i ? 'active' : ''}`}
                    onClick={() => setActiveMode(i)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="r66-autopilot__mode-code">{mode.mode}</span>
                    <span className="r66-autopilot__mode-name">{mode.name}</span>
                  </motion.button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.4} direction="right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  className="r66-autopilot__mode-detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="r66-autopilot__mode-display">
                    <span className="r66-autopilot__mode-display-code">
                      {autopilotModes[activeMode].mode}
                    </span>
                  </div>
                  <h4>{autopilotModes[activeMode].name}</h4>
                  <p>{autopilotModes[activeMode].description}</p>
                </motion.div>
              </AnimatePresence>
            </Reveal>
          </div>
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// SECTION 8: Captain Quentin Smith Achievement Section
// ============================================================================
function R66Expedition() {
  const [index, setIndex] = useState(0);
  const total = expeditionSlides.length;
  const slide = expeditionSlides[index];
  const go = (dir) => setIndex((i) => (i + dir + total) % total);

  return (
    <section className="r66-expedition">
      <div className="r66-expedition__container">
        <div className="r66-expedition__content">
          <h2 className="r66-expedition__title">Proven in the Field</h2>

          <div className="r66-expedition__carousel">
            <button
              type="button"
              className="r66-expedition__chevron r66-expedition__chevron--prev"
              onClick={() => go(-1)}
              aria-label="Previous expedition"
            >
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
                <path d="M12 2L2 11l10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="r66-expedition__image" key={slide.image}>
              <img src={slide.image} alt={slide.alt} width={1500} height={1000} loading="lazy" />
            </div>

            <button
              type="button"
              className="r66-expedition__chevron r66-expedition__chevron--next"
              onClick={() => go(1)}
              aria-label="Next expedition"
            >
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
                <path d="M2 2l10 9-10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="r66-expedition__dots" role="tablist" aria-label="Expedition slides">
            {expeditionSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to expedition ${i + 1}`}
                className={`r66-expedition__dot${i === index ? ' r66-expedition__dot--active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <div className="r66-expedition__rule" />

          <div className="r66-expedition__copy" key={index}>
            {slide.paragraphs.map((p, i) => (
              <p key={i} className="r66-expedition__lead">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 7: Variants
// ============================================================================
function R66Variants() {
  const [activeVariant, setActiveVariant] = useState(0);
  const [configuratorActive, setConfiguratorActive] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Sticky-at-end pattern so .r66-specs rises up over the pinned variants
    // section (same shape as R66Introduction's handoff to its next section).
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const variantsH = el.offsetHeight;
      const stickTop = Math.min(0, vh - variantsH);
      document.documentElement.style.setProperty('--r66-variants-stick-top', `${stickTop}px`);
    };
    update();

    // Progressively blur + darken variants as specs rises. Same pacing as
    // the intro->variants transition: ease-in with FADE_COMPLETE=0.95, pow 8.
    const MAX_BLUR = 10;
    const nextSection = document.querySelector('.r66-specs');

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !nextSection) return;
      const rect = nextSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      el.style.setProperty('--r66-variants-blur', `${progress * MAX_BLUR}px`);
      const FADE_COMPLETE = 0.95;
      const adjusted = Math.min(1, progress / FADE_COMPLETE);
      const eased = Math.pow(adjusted, 8);
      el.style.setProperty('--r66-variants-darken', `${eased}`);
      el.style.pointerEvents = eased >= 0.98 ? 'none' : '';
    };
    onScroll();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="r66-variants">
      <div className="r66-variants__container">
        <Reveal>
          <div className="r66-section-header r66-section-header--center">
            <span className="r66-pre-text">CONFIGURATIONS</span>
            <h2>
              <span className="r66-text--dark">R66</span>{' '}
              <span className="r66-text--mid">Variants</span>
            </h2>
          </div>
        </Reveal>

        {configuratorActive ? (
          <div className="r66-variants__configurator">
            <div className="r66-variants__configurator-meta">
              <button
                type="button"
                className="r66-variants__configurator-back"
                onClick={() => setConfiguratorActive(false)}
                aria-label="Return to variant selector"
              >
                <i className="fas fa-arrow-left" aria-hidden="true" />
                <span>Back to Variants</span>
              </button>
              <span className="r66-variants__configurator-active">
                Configuring <strong>R66 {r66Variants[activeVariant].name}</strong>
                {R66_CONFIGURATOR_FALLBACK_INDEXES.has(activeVariant) && (
                  <span className="r66-variants__configurator-note">
                    Showing base R66 — {r66Variants[activeVariant].name} package added at order
                  </span>
                )}
              </span>
            </div>
            <iframe
              key={`r66-cfg-${activeVariant}`}
              className="r66-variants__configurator-frame"
              src={r66ConfiguratorUrl(activeVariant)}
              title={`Robinson R66 ${r66Variants[activeVariant].name} Configurator`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="fullscreen"
            />
          </div>
        ) : (
        <LayoutGroup id="r66-variants">
          <div className="r66-variants__card">
            <div className="r66-variants__tabs">
              {r66Variants.map((variant, i) => (
                <button
                  key={i}
                  className={`r66-variants__tab ${activeVariant === i ? 'active' : ''}`}
                  onClick={() => setActiveVariant(i)}
                >
                  {/* Thumbnail only when not active — shares layoutId with the hero image so it flies to/from the hero slot */}
                  {activeVariant !== i && (
                    <motion.span
                      className="r66-variants__tab-thumb"
                      aria-hidden="true"
                      layoutId={`r66-variant-img-${i}`}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img src={variant.image} alt="" loading="lazy" width={1920} height={1080} />
                    </motion.span>
                  )}
                  <motion.span
                    className="r66-variants__tab-label"
                    layout
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="r66-variants__tab-sub">{variant.subtitle}</span>
                    <span className="r66-variants__tab-name">{variant.name}</span>
                  </motion.span>
                </button>
              ))}
            </div>

            <div className="r66-variants__content">
              {/* Hero image stays outside AnimatePresence so the shared layoutId can connect to the active tab's thumbnail */}
              <div className="r66-variants__image">
                <div className="r66-variants__image-headline">
                  <div className="r66-variants__image-headline-inner">
                    <span className="r66-variants__eyebrow">{r66Variants[activeVariant].subtitle}</span>
                    <h3>R66 {r66Variants[activeVariant].name}</h3>
                    <p className="r66-variants__tagline">{r66Variants[activeVariant].tagline}</p>
                    <div className="r66-variants__divider" />
                  </div>
                </div>
                <motion.span
                  key={activeVariant}
                  className="r66-variants__image-inner"
                  layoutId={`r66-variant-img-${activeVariant}`}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={r66Variants[activeVariant].image}
                    alt={`${r66Variants[activeVariant].name} configuration`}
                    width={1920}
                    height={1080}
                  />
                </motion.span>
                <div className="r66-variants__use-case-tags">
                  {r66Variants[activeVariant].useCases.map((uc, i) => (
                    <span key={i} className="r66-variants__use-case-tag">{uc}</span>
                  ))}
                </div>
              </div>

              <div className="r66-variants__info">
                <div className="r66-variants__info-left">
                  <p className="r66-variants__description">{r66Variants[activeVariant].description}</p>
                  {r66Variants[activeVariant].pdfs && (
                    <div className="r66-variants__pdfs">
                      {r66Variants[activeVariant].pdfs.brochure && (
                        <a
                          href={r66Variants[activeVariant].pdfs.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="r66-variants__pdf-pill"
                        >
                          <i className="fas fa-file-pdf" aria-hidden="true"></i>
                          <span>Brochure</span>
                        </a>
                      )}
                      {r66Variants[activeVariant].pdfs.eoc && (
                        <a
                          href={r66Variants[activeVariant].pdfs.eoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="r66-variants__pdf-pill"
                        >
                          <i className="fas fa-file-pdf" aria-hidden="true"></i>
                          <span>Operating Costs</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="r66-variants__info-right">
                  <ul className="r66-variants__features">
                    {r66Variants[activeVariant].features.map((feature, i) => (
                      <li key={i}>
                        <span className="r66-variants__feature-icon" aria-hidden="true">
                          <i className={`fas ${feature.icon}`}></i>
                        </span>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </LayoutGroup>
        )}

        <div className="r66-variants__cta">
          {!configuratorActive ? (
            <button
              type="button"
              className="r66-variants__cta-button"
              onClick={() => setConfiguratorActive(true)}
              aria-label={`Launch the Robinson configurator for the R66 ${r66Variants[activeVariant].name}`}
            >
              Launch Configurator
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          ) : (
            <a href="#enquire" className="r66-variants__cta-button">
              Register Interest
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// SECTION 8: Why Turbine
// ============================================================================
function R66WhyTurbine() {
  return (
    <section className="r66-turbine">
      <div className="r66-turbine__container">
        <Reveal>
          <div className="r66-section-header r66-section-header--center">
            <span className="r66-pre-text">THE TURBINE ADVANTAGE</span>
            <h2>
              <span className="r66-text--dark">Why</span>{' '}
              <span className="r66-text--mid">Turbine</span>{' '}
              <span className="r66-text--light">Power?</span>
            </h2>
          </div>
        </Reveal>

        <div className="r66-turbine__grid">
          {turbineBenefits.map((benefit, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="r66-turbine__card">
                <div className="r66-turbine__stat">
                  <span className="r66-turbine__stat-value">{benefit.stat}</span>
                  <span className="r66-turbine__stat-label">{benefit.statLabel}</span>
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="r66-turbine__cost">
            <div className="r66-turbine__cost-header">
              <span className="r66-pre-text">Real-World Operating Cost</span>
              <h3>
                Roughly <span className="r66-turbine__cost-accent">£400–£550 per hour</span> direct operating cost
              </h3>
            </div>
            <p className="r66-turbine__cost-lead">
              Turbine economics look different to piston, but with the RR300 they stay
              predictable. Jet-A burn is the dominant line item, reserves are set against
              a 2,000-hour TBO, and the single-engine turbine architecture keeps
              scheduled maintenance simple. For operators stepping up from an R44, the
              R66 typically adds capability and comfort without the running cost jumping
              the way it does on twin-engine turbines.
            </p>
            <ul className="r66-turbine__cost-list">
              <li><i className="fas fa-gas-pump"></i><span>~20–22 US gal/hr Jet-A, dominant line item</span></li>
              <li><i className="fas fa-tools"></i><span>Reserves against a 2,000-hour RR300 TBO</span></li>
              <li><i className="fas fa-infinity"></i><span>Global Robinson &amp; Rolls-Royce parts availability</span></li>
            </ul>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ============================================================================
// SECTION 9: Gallery
// ============================================================================
function R66Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryPage, setGalleryPage] = useState(0);
  const galleryScrollRef = useRef(null);
  const pageImages = usePageImages('r66');
  const cmsGallery = (pageImages['r66-gallery'] ?? SECTION_MAP['r66-gallery'].images).map(img => ({ src: img.url, alt: img.alt }));

  const itemsPerPage = 3;
  const numGalleryPages = Math.max(1, Math.ceil(cmsGallery.length / itemsPerPage));

  const handleGalleryScroll = () => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    setGalleryPage(Math.round((el.scrollLeft / maxScroll) * (numGalleryPages - 1)));
  };

  const scrollGallery = (direction) => {
    const el = galleryScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="r66-gallery" data-cms-section="r66-gallery">
      <div className="r66-gallery__container">
        <Reveal>
          <div className="r66-section-header r66-section-header--center">
            <h2>
              <span className="r66-text--dark">R66</span>{' '}
              <span className="r66-text--mid">Gallery</span>
            </h2>
          </div>
        </Reveal>

        <div className="r66-gallery__scroll-wrapper">
          <button
            type="button"
            className="r66-gallery__chevron r66-gallery__chevron--prev"
            aria-label="Previous gallery images"
            onClick={() => scrollGallery(-1)}
            disabled={galleryPage === 0}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="r66-gallery__scroll" ref={galleryScrollRef} onScroll={handleGalleryScroll}>
            <div className="r66-gallery__grid">
              {cmsGallery.map((image, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <motion.div
                    className="r66-gallery__item"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image.src} alt={image.alt} width={1500} height={1000} loading="lazy" />
                    <div className="r66-gallery__overlay">
                      <i className="fas fa-expand"></i>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="r66-gallery__chevron r66-gallery__chevron--next"
            aria-label="Next gallery images"
            onClick={() => scrollGallery(1)}
            disabled={galleryPage >= numGalleryPages - 1}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {numGalleryPages > 1 && (
          <div className="r66-gallery__dots">
            {Array.from({ length: numGalleryPages }).map((_, i) => (
              <button
                key={i}
                className={`r66-gallery__dot${i === galleryPage ? ' r66-gallery__dot--active' : ''}`}
                aria-label={`Go to gallery page ${i + 1}`}
                onClick={() => {
                  const el = galleryScrollRef.current;
                  if (!el) return;
                  const maxScroll = el.scrollWidth - el.clientWidth;
                  el.scrollTo({ left: (i / (numGalleryPages - 1)) * maxScroll, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="r66-gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="r66-gallery__lightbox-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <img src={selectedImage.src} alt={selectedImage.alt} width={1920} height={1280} />
              <button
                className="r66-gallery__lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================================
// SECTION 10: CTA
// ============================================================================
function R66Select({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="r66-select" ref={ref}>
      <button type="button" className="r66-select__trigger" onClick={() => setOpen(o => !o)}>
        <span>{selected.label}</span>
        <svg className={`r66-select__chevron${open ? ' r66-select__chevron--open' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ul className="r66-select__menu">
          {options.map(o => (
            <li
              key={o.value}
              className={`r66-select__option${o.value === value ? ' r66-select__option--active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const r66CtaContent = {
  purchase: {
    preText: 'OWN THE TURBINE',
    preTextShort: 'OWNERSHIP',
    headingDark: 'Ready to',
    headingLight: 'Experience the R66?',
    lead: "Robinson's first turbine delivers 5-seat capability, proven reliability across 1.5M+ fleet flight hours, and the industry's lowest turbine operating cost. Speak with our sales team about configurations, delivery positions, and ownership packages.",
    benefits: [
      { icon: 'fa-helicopter',      text: 'Configure Your Ideal R66 Variant' },
      { icon: 'fa-handshake',       text: 'Direct Consultation With Sales Team' },
      { icon: 'fa-shield-alt',      text: 'Factory Warranty & Denham Support' },
      { icon: 'fa-plane-departure', text: 'Demo Flight at Denham Aerodrome' },
    ],
    formTitle: 'Enquire About Aircraft',
    selectOptions: [
      { value: 'purchase',    label: 'Interested in Purchasing' },
      { value: 'demo',        label: 'Request a Demo Flight' },
      { value: 'information', label: 'Requesting Information' },
      { value: 'other',       label: 'Other Inquiry' },
    ],
    selectDefault: 'purchase',
  },
  training: {
    preText: 'BECOME TURBINE-RATED',
    preTextShort: 'LEARN TO FLY',
    headingDark: 'Fly a',
    headingLight: 'Turbine Helicopter',
    lead: "Transition onto the R66 with HQ Aviation's experienced instructors. Type rating, PPL conversions, and self-fly hire from Denham Aerodrome, all on our own R66 fleet.",
    benefits: [
      { icon: 'fa-user-graduate',       text: 'R66 Type Rating Courses' },
      { icon: 'fa-plane-departure',     text: 'Self-Fly Hire From Our Fleet' },
      { icon: 'fa-chalkboard-teacher',  text: 'Experienced Turbine Instructors' },
    ],
    formTitle: 'Start Your Training',
    selectOptions: [
      { value: 'type-rating', label: 'R66 Type Rating' },
      { value: 'ppl',         label: 'PPL Training' },
      { value: 'self-fly',    label: 'Self-Fly Hire' },
      { value: 'other',       label: 'Other Inquiry' },
    ],
    selectDefault: 'type-rating',
  },
};

function R66CTA() {
  const [useType, setUseType] = useState('purchase');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'purchase',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('idle');

  const content = r66CtaContent[useType];

  const handleToggle = (type) => {
    setUseType(type);
    setFormData(prev => ({ ...prev, interest: r66CtaContent[type].selectDefault }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const interestLabel = content.selectOptions.find(o => o.value === formData.interest)?.label || formData.interest;
    const messageParts = [];
    if (interestLabel) messageParts.push(`Interest: ${interestLabel}`);
    if (formData.message) messageParts.push(formData.message);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `R66 Enquiry: ${useType === 'purchase' ? 'Purchase' : 'Training'}`,
          message: messageParts.join('\n'),
          source: 'R66 Enquiry',
        }),
      });
      setFormStatus(res.ok ? 'success' : 'error');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <section id="enquire" className="r66-cta">
      <div className="r66-cta__container">
        <div className="r66-cta__content">
          <Reveal>
            <div className="r66-section-header">
              <span className="r66-pre-text r66-pre-text--light">
                <span className="r66-pre-text__full">{content.preText}</span>
                <span className="r66-pre-text__short">{content.preTextShort}</span>
              </span>
              <h2>
                <span style={{ color: '#fff' }}>{content.headingDark}</span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{content.headingLight}</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="r66-cta__lead">{content.lead}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="r66-cta__benefits-card">
              <div className="r66-cta__benefits">
                {content.benefits.map((b, i) => (
                  <div key={i} className="r66-cta__benefit">
                    <i className={`fas ${b.icon}`}></i>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4} direction="right">
          {formStatus === 'success' ? (
            <div className="r66-cta__form r66-cta__success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>Thank you for your enquiry! Our team will contact you shortly.</p>
            </div>
          ) : (
            <form className="r66-cta__form" onSubmit={handleSubmit}>
              <h3>{content.formTitle}</h3>
              <div className="r66-cta__form-group">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="r66-cta__form-group">
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="r66-cta__form-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="r66-cta__form-group">
                <R66Select
                  value={formData.interest}
                  onChange={(val) => setFormData({ ...formData, interest: val })}
                  options={content.selectOptions}
                />
              </div>
              <div className="r66-cta__form-group">
                <textarea
                  placeholder="Additional Comments"
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              {formStatus === 'error' && (
                <p className="r66-cta__error">
                  Something went wrong. Please try again or email{' '}
                  <a href="mailto:sales@hqaviation.com">sales@hqaviation.com</a>
                </p>
              )}
              <button
                type="submit"
                className="r66-btn r66-btn--submit"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? 'Sending…' : 'Submit Enquiry'}
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          )}
        </Reveal>
      </div>

      <Reveal delay={0.6}>
        <div className="r66-cta__contact">
          <div className="r66-cta__contact-inner">
            <div className="r66-cta__contact-item">
              <i className="fas fa-phone"></i>
              <span>+44 1895 833 373</span>
            </div>
            <div className="r66-cta__contact-item">
              <i className="fas fa-envelope"></i>
              <span>sales@hqaviation.com</span>
            </div>
            <div className="r66-cta__contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Denham Aerodrome, UK</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ============================================================================
// STYLES (Inline for page-specific styles)
// ============================================================================
const R66Styles = () => (
  <style>{`
    /* ====================================================================
       R66 PAGE STYLES
       ==================================================================== */

    /* Typography Variables */
    .r66-pre-text {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 1rem;
    }

    .r66-pre-text--light {
      color: rgba(255, 255, 255, 0.6);
    }

    .r66-text--dark { color: #1a1a1a; }
    .r66-text--mid { color: #4a4a4a; }
    .r66-text--light { color: #7a7a7a; }

    .r66-section-header {
      margin-bottom: 3rem;
    }

    .r66-section-header--center {
      text-align: center;
    }

    .r66-section-header--light .r66-pre-text {
      color: rgba(255, 255, 255, 0.6);
    }

    .r66-section-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 500;
      line-height: 1.1;
      margin: 0;
    }

    /* Buttons */
    .r66-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .r66-btn--primary {
      background: #1a1a1a;
      color: #fff;
    }

    .r66-btn--primary:hover {
      background: #333;
      color: #fff;
      transform: translateY(-2px);
    }

    .r66-btn--secondary {
      background: #4a4a4a;
      color: #fff;
    }

    .r66-btn--secondary:hover {
      background: #5a5a5a;
      transform: translateY(-2px);
    }

    .r66-btn--outline {
      background: transparent;
      color: #1a1a1a;
      border: 1px solid #1a1a1a;
    }

    .r66-btn--outline:hover {
      background: #1a1a1a;
      color: #fff;
    }

    .r66-btn--light {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .r66-btn--light:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* ====================================================================
       HERO SECTION
       ==================================================================== */
    .r66-hero {
      position: relative;
      height: 100vh;
      min-height: 700px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .r66-hero__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .r66-hero__bg img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .r66-hero__video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
      border: 0;
      z-index: 1;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.6s ease;
      /* Belt-and-braces: keep iOS Safari from showing PiP / AirPlay icons */
      -webkit-user-select: none;
      user-select: none;
    }
    .r66-hero__video::-webkit-media-controls,
    .r66-hero__video::-webkit-media-controls-panel,
    .r66-hero__video::-webkit-media-controls-play-button,
    .r66-hero__video::-webkit-media-controls-start-playback-button {
      display: none !important;
      -webkit-appearance: none;
    }

    .r66-hero__video--ready {
      opacity: 1;
      visibility: visible;
    }

    .r66-hero__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.5) 100%
      );
      z-index: 1;
    }

    .r66-hero__content {
      position: relative;
      z-index: 2;
      text-align: center;
      color: #fff;
      max-width: 900px;
      padding: 0 2rem;
    }

    .r66-hero__label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.5rem;
    }

    .r66-hero__headline {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .r66-hero__letter {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(5rem, 15vw, 12rem);
      font-weight: 500;
      line-height: 1;
      color: #fff;
    }

    .r66-hero__subtitle {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      letter-spacing: 0.5em;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
    }

    .r66-hero__divider {
      width: 100px;
      height: 1px;
      background: rgba(255, 255, 255, 0.4);
      margin: 0 auto 2rem;
      transform-origin: center;
    }

    .r66-hero__tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.125rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .r66-hero__badges {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
    }

    .r66-hero__badge {
      text-align: center;
    }

    .r66-hero__badge-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 500;
      color: #fff;
    }

    .r66-hero__badge-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.6);
    }

    .r66-hero__badge-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
    }

    .r66-hero__scroll {
      position: absolute;
      bottom: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      text-align: center;
    }

    @media (max-height: 780px) {
      .r66-hero__scroll { display: none; }
    }

    .r66-hero__scroll span {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.5rem;
    }

    .r66-hero__scroll-line {
      width: 1px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }

    .r66-hero__scroll-dot {
      width: 3px;
      height: 10px;
      background: #fff;
      border-radius: 2px;
      position: absolute;
      left: -1px;
      animation: scrollDot 2s infinite;
    }

    @keyframes scrollDot {
      0% { top: 0; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }

    /* ====================================================================
       HIGHLIGHTS SECTION
       ==================================================================== */
    .r66-highlights {
      position: sticky;
      top: 0;
      padding: 2.5rem 2rem;
      background: linear-gradient(to right, #faf9f6 50%, #ececec 50%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }

    .r66-highlights::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 40px;
      transform: translateX(-39px);
      background: linear-gradient(to left,
        rgba(0, 0, 0, 0.05) 0%,
        rgba(0, 0, 0, 0.02) 40%,
        rgba(0, 0, 0, 0) 100%);
      pointer-events: none;
      z-index: 0;
    }

    .r66-highlights__container {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(260px, 1fr) 2fr;
      gap: 3rem;
      align-items: center;
    }

    .r66-highlights__header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .r66-highlights__headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
    }

    .r66-highlights__image {
      display: flex;
      justify-content: flex-end;
    }

    .r66-highlights__image img {
      width: 100%;
      max-width: 640px;
      max-height: 320px;
      height: auto;
      object-fit: contain;
      display: block;
    }

    @media (max-width: 900px) {
      .r66-highlights {
        background: #faf9f6;
      }
      .r66-highlights::before {
        display: none;
      }
      .r66-highlights__container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .r66-highlights__image {
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .r66-highlights {
        padding: 2rem 1.5rem;
      }
      .r66-highlights__image img {
        max-height: 220px;
      }
    }

    /* ====================================================================
       STICKY STACK WRAPPER (bounds the sticky highlights + intro so they
       un-pin at the bottom of specs instead of persisting over the rest
       of the page)
       ==================================================================== */
    .r66-sticky-stack {
      position: relative;
    }

    /* ====================================================================
       INTRODUCTION SECTION
       ==================================================================== */
    .r66-intro {
      /* Sticky-at-end pattern (mirrors /aircraft/r44): intro scrolls normally
         so the internal sticky left column works, then pins only when its
         bottom reaches the viewport bottom so variants can rise up over it.
         --r66-intro-stick-top is set in JS to min(0, viewportH - introH). */
      position: sticky;
      top: var(--r66-intro-stick-top, 0);
      padding: 3rem 2rem 5rem;
      background: linear-gradient(to right, rgba(236, 236, 236, 0.82) 50%, rgba(250, 249, 246, 0.82) 50%);
      backdrop-filter: blur(24px) saturate(1.05);
      -webkit-backdrop-filter: blur(24px) saturate(1.05);
      /* Scroll-linked blur; the palette fade is applied via ::after overlay
         so it lands on a solid frame at progress=1 (instead of fading out
         alongside a whole-element opacity fade). */
      filter: blur(var(--r66-intro-blur, 0px));
    }

    .r66-intro::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 40px;
      transform: translateX(-1px);
      background: linear-gradient(to right,
        rgba(0, 0, 0, 0.05) 0%,
        rgba(0, 0, 0, 0.02) 40%,
        rgba(0, 0, 0, 0) 100%);
      pointer-events: none;
      z-index: 0;
    }

    /* Light overlay that fades in as variants rises, so intro visually turns
       into the variants' pale palette before variants physically covers it. */
    .r66-intro::after {
      content: '';
      position: absolute;
      inset: 0;
      background: #faf9f6;
      opacity: var(--r66-intro-lighten, 0);
      pointer-events: none;
      z-index: 2;
    }

    .r66-intro__container {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    .r66-intro__content { order: 2; }
    .r66-intro__right { order: 1; margin-top: 4rem; }

    @media (min-width: 901px) {
      .r66-intro__content {
        position: sticky;
        top: max(10vh, var(--catch-top, 90px));
      }
    }

    .r66-intro__divider {
      width: 60px;
      height: 1px;
      background: rgba(0, 0, 0, 0.15);
      margin: 2.5rem auto;
    }

    .r66-intro__headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 2rem;
    }

    .r66-intro__text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 1.5rem;
    }

    .r66-intro__image {
      position: relative;
    }

    .r66-intro__image img {
      width: 100%;
      max-width: 600px;
    }

    /* ====================================================================
       HISTORY TIMELINE SECTION
       ==================================================================== */
    .r66-timeline {
      padding: 0;
      background: transparent;
    }

    .r66-timeline__container {
      max-width: 100%;
      margin: 0 auto;
    }

    .r66-timeline__track {
      position: relative;
      margin-top: 2rem;
    }

    .r66-timeline__line {
      position: absolute;
      left: 24px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ddd;
    }

    .r66-timeline__line-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #1a1a1a;
    }

    .r66-timeline__item {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      position: relative;
    }

    .r66-timeline__marker {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 2px solid #ddd;
      border-radius: 50%;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .r66-timeline__item--completed .r66-timeline__marker {
      background: #1a1a1a;
      border-color: #1a1a1a;
      color: #fff;
    }

    .r66-timeline__item--active .r66-timeline__marker {
      background: #fff;
      border-color: #1a1a1a;
      border-width: 3px;
    }

    .r66-timeline__pulse {
      width: 12px;
      height: 12px;
      background: #1a1a1a;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }

    .r66-timeline__dot {
      width: 8px;
      height: 8px;
      background: #ddd;
      border-radius: 50%;
    }

    .r66-timeline__content {
      padding-top: 0.5rem;
    }

    .r66-timeline__year {
      display: inline-block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      background: #1a1a1a;
      color: #fff;
      padding: 0.25rem 0.75rem;
      margin-bottom: 0;
    }

    .r66-timeline__text {
      margin-top: 0;
      padding-top: 12px;
    }

    .r66-timeline__item--upcoming .r66-timeline__year {
      background: #ddd;
      color: #666;
    }

    .r66-timeline__content h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.5rem;
    }

    .r66-timeline__content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    /* ====================================================================
       SPECIFICATIONS SECTION
       ==================================================================== */
    .r66-specs {
      /* Rises above every pinned/sticky earlier section (highlights, intro,
         variants). Relative + z-index 50 creates a stacking context that
         sits above the rest. */
      position: relative;
      z-index: 50;
      padding: 5rem 2rem;
      background: linear-gradient(to right, #000 50%, #1c1c1c 50%);
      color: #fff;
    }

    @media (min-width: 901px) {
      .r66-specs::before {
        content: '';
        position: absolute;
        right: 50%;
        top: 0;
        bottom: 0;
        width: 40px;
        transform: translateX(1px);
        background: linear-gradient(to left,
          rgba(0, 0, 0, 0.08) 0%,
          rgba(0, 0, 0, 0.03) 40%,
          rgba(0, 0, 0, 0) 100%);
        pointer-events: none;
        z-index: 0;
      }
    }

    .r66-specs__container {
      position: relative;
      z-index: 1;
    }

    .r66-specs__split {
      display: block;
    }

    @media (min-width: 901px) {
      .r66-specs__split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
      }

      /* Prevent grid items from overflowing their column when inner content has intrinsic min-widths */
      .r66-specs__split-left,
      .r66-specs__split-right {
        min-width: 0;
      }

      .r66-specs__split-left {
        position: sticky;
        top: max(10vh, var(--catch-top, 90px));
      }

      /* In the split, stack blueprint and table vertically since each side is narrower */
      .r66-specs__split-left .r66-specs__columns {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      /* Stack proven cards vertically in the single right column */
      .r66-specs__split-right .r66-proven__grid {
        grid-template-columns: 1fr;
      }

      /* Shrink the stats-bar to fit the narrower right column so it doesn't overflow */
      .r66-specs__split-right .r66-proven__stats-bar {
        flex-wrap: wrap;
        gap: 1.25rem 1.5rem;
        padding: 1.75rem 1.25rem;
        margin-top: 0;
        margin-bottom: 0;
      }

      .r66-specs__split-right .r66-proven__stat {
        flex: 1 1 auto;
        min-width: 0;
      }

      .r66-specs__split-right .r66-proven__stat-value {
        font-size: 1.5rem;
      }

      .r66-specs__split-right .r66-proven__stat-label {
        white-space: normal;
      }

      .r66-specs__split-right .r66-proven__stat-divider {
        display: none;
      }

      /* Keep table cells within the column */
      .r66-specs__split-right .r66-specs__cell {
        min-width: 0;
        word-break: break-word;
      }
    }

    .r66-specs__split-divider {
      width: 60px;
      height: 1px;
      background: rgba(255,255,255,0.15);
      margin: 2.5rem auto;
    }
    .r66-specs .r66-pre-text { color: rgba(255,255,255,0.5); }
    .r66-specs .r66-text--dark { color: #fff; }
    .r66-specs .r66-text--mid { color: rgba(255,255,255,0.5); }

    .r66-specs__container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .r66-specs__columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: stretch;
      margin-top: 2rem;
    }

    @media (max-width: 900px) {
      .r66-specs__columns {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .r66-specs__right { order: 2; }
      .r66-specs__table { order: 1; }
    }

    .r66-specs__aux-cell {
      display: flex !important;
      flex-direction: column;
      align-items: stretch;
      gap: 0.4rem;
    }

    .r66-specs__aux-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.3rem 0.6rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      cursor: pointer;
      margin-right: auto;
      font-size: 0.75rem;
      transition: all 0.2s ease;
      width: fit-content;
    }

    .r66-specs__aux-label:hover {
      border-color: rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.15);
    }

    .r66-specs__aux-checkbox {
      display: none;
    }

    .r66-specs__aux-check {
      width: 14px;
      height: 14px;
      border: 1px solid rgba(255,255,255,0.4);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      transition: all 0.2s ease;
    }

    .r66-specs__aux-checkbox:checked + .r66-specs__aux-check {
      background: #fff;
      border-color: #fff;
      color: #1a1a1a;
    }

    .r66-specs__aux-text {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      color: rgba(255,255,255,0.7);
      white-space: nowrap;
    }

    .r66-specs__aux-badge {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.55rem;
      background: rgba(255,255,255,0.2);
      padding: 0.15rem 0.35rem;
      border-radius: 3px;
      margin-left: 0.25rem;
    }

    .r66-specs__table {
      background: rgba(255,255,255,0.04);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      margin-top: 0;
      display: flex;
      flex-direction: column;
    }

    .r66-specs__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .r66-specs__row:last-child {
      border-bottom: none;
    }

    .r66-specs__row--header {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }

    .r66-specs__row--header .r66-specs__cell {
      font-weight: 600;
      font-size: 0.8rem;
    }

    .r66-specs__cell {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .r66-specs__row:not(.r66-specs__row--header) .r66-specs__cell:first-child {
      border-right: 1px solid rgba(255,255,255,0.18);
    }

    .r66-specs__cell--label {
      font-weight: 500;
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
    }

    .r66-specs__row:nth-child(even) .r66-specs__cell:not(.r66-specs__cell--label) {
      background: rgba(255,255,255,0.03);
    }

    .r66-specs__cell--highlighted {
      position: relative;
      font-weight: 600;
      color: #fff;
    }

    .r66-specs__cell--highlighted::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #fff;
    }

    .r66-specs__right {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .r66-specs__blueprint-card {
      flex: 1;
      display: flex;
      align-items: center;
      border: 1px solid #fff;
      border-radius: 8px;
      padding: 1px;
    }

    .r66-specs__blueprint {
      width: 100%;
      display: block;
      border-radius: 6px;
      filter: invert(1);
    }

    .r66-specs__overlay-data {
      display: flex;
      justify-content: space-around;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 1.5rem;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .r66-specs__overlay-item {
      text-align: center;
    }

    .r66-specs__overlay-item span:first-child {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.25rem;
    }

    .r66-specs__overlay-item span:last-child {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #fff;
    }

    /* ====================================================================
       PROVEN PERFORMANCE SECTION
       ==================================================================== */
    .r66-proven {
      padding: 4rem 2rem;
      background: #1a1a1a;
      color: #fff;
    }

    .r66-proven__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r66-proven__stats-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      padding: 2.5rem 2rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      margin-top: 3rem;
      margin-bottom: 3rem;
    }

    .r66-proven__stat {
      text-align: center;
    }

    .r66-proven__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 600;
      color: #fff;
    }

    .r66-proven__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      margin-top: 0.25rem;
      white-space: nowrap;
    }

    .r66-proven__stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.15);
    }

    .r66-proven__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-top: 3rem;
    }

    .r66-proven__grid > * {
      display: flex;
      height: 100%;
    }

    .r66-proven__card {
      padding: 1.75rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      transition: border-color 0.2s, background 0.2s;
      width: 100%;
    }

    .r66-proven__card:hover {
      border-color: rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.07);
    }

    .r66-proven__card-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.08);
      border-radius: 6px;
      margin-bottom: 1.25rem;
      font-size: 1rem;
      color: rgba(255,255,255,0.7);
    }

    .r66-proven__card-stat {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.75rem;
    }

    .r66-proven__card h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      margin: 0 0 0.75rem;
    }

    .r66-proven__card p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      line-height: 1.7;
      color: rgba(255,255,255,0.55);
      margin: 0;
    }

    @media (max-width: 768px) {
      .r66-proven__stats-bar {
        flex-wrap: wrap;
        gap: 2rem;
      }
      .r66-proven__stat-divider {
        display: none;
      }
    }

    /* ====================================================================
       EXPEDITION SECTION
       ==================================================================== */
    /* ====================================================================
       FLEET LINEUP SECTION
       ==================================================================== */
    .r66-fleet {
      padding: 3rem 2rem;
      background: #faf9f6;
    }

    .r66-fleet__container {
      max-width: 480px;
      margin: 0 auto;
    }

    .r66-fleet__image-wrap {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e8e6e2;
      box-shadow: 0 18px 45px -20px rgba(26, 26, 26, 0.25),
                  0 4px 14px rgba(0, 0, 0, 0.06);
    }

    .r66-fleet__image-wrap img {
      width: 100%;
      display: block;
      object-fit: cover;
      border-radius: 6px;
    }

    .r66-fleet__caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem 2rem;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }

    .r66-fleet__caption-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: rgba(255, 255, 255, 0.7);
    }

    .r66-fleet__caption-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.01em;
    }

    .r66-expedition {
      padding: 4rem 0 0;
      background: transparent;
    }

    @media (min-width: 901px) {
      .r66-expedition {
        padding-top: 0;
      }
    }

    .r66-expedition__container {
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      border-radius: 10px;
      border: 1px solid #e8e6e2;
      padding: 2rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }

    .r66-expedition__carousel {
      position: relative;
      margin: 1rem 0 0.75rem;
    }

    .r66-expedition__image {
      border-radius: 6px;
      overflow: hidden;
      aspect-ratio: 5 / 2;
      animation: r66-expedition-fade 0.45s ease;
    }
    .r66-expedition__image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 6px;
    }

    @keyframes r66-expedition-fade {
      from { opacity: 0; transform: scale(1.015); }
      to { opacity: 1; transform: scale(1); }
    }

    .r66-expedition__chevron {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.55);
      background: rgba(10, 10, 10, 0.45);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      color: #fff;
      cursor: pointer;
      z-index: 2;
      transition: background 0.25s ease, border-color 0.25s ease,
                  transform 0.25s ease, box-shadow 0.25s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
    }
    .r66-expedition__chevron:hover,
    .r66-expedition__chevron:focus-visible {
      background: rgba(10, 10, 10, 0.7);
      border-color: #fff;
      transform: translateY(-50%) scale(1.06);
      outline: none;
    }
    .r66-expedition__chevron:active {
      transform: translateY(-50%) scale(0.96);
    }
    .r66-expedition__chevron svg {
      display: block;
      width: 12px;
      height: 18px;
    }
    .r66-expedition__chevron--prev { left: 0.75rem; }
    .r66-expedition__chevron--next { right: 0.75rem; }

    .r66-expedition__dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin: 0 0 1rem;
    }
    .r66-expedition__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 0;
      padding: 0;
      background: #d8d4cc;
      cursor: pointer;
      transition: background 0.25s ease, transform 0.25s ease;
    }
    .r66-expedition__dot:hover { background: #b8b2a7; }
    .r66-expedition__dot--active {
      background: #1a1a1a;
      transform: scale(1.15);
    }

    .r66-expedition__copy {
      animation: r66-expedition-fade 0.45s ease;
    }

    .r66-expedition__content {
      display: flex;
      flex-direction: column;
    }

    .r66-expedition__pre {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: #999;
      margin-bottom: 0.75rem;
    }

    .r66-expedition__title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      font-weight: 700;
      text-transform: uppercase;
      color: #1a1a1a;
      margin: 0 0 1rem;
      letter-spacing: -0.01em;
      text-align: center;
    }

    .r66-expedition__rule {
      width: 100%;
      height: 1px;
      background: #e8e6e2;
      margin-bottom: 1.25rem;
    }

    .r66-expedition__lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      line-height: 1.7;
      color: #555;
      margin: 0 0 2rem;
    }

    .r66-expedition__stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .r66-expedition__stat {
      text-align: center;
      padding: 1.25rem 1rem;
      background: #faf9f6;
      border: 1px solid #e8e6e2;
      border-radius: 4px;
    }

    .r66-expedition__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .r66-expedition__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #999;
      margin-top: 0.35rem;
    }

    .r66-expedition__cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      text-decoration: none;
      background: #1a1a1a;
      color: #faf9f6;
      border-radius: 4px;
      transition: background 0.3s ease;
    }
    .r66-expedition__cta-btn:hover {
      background: #333;
    }

    /* ====================================================================
       VARIANTS SECTION
       ==================================================================== */
    .r66-variants {
      /* Sticky-at-end (same pattern as intro) so specs can rise over it once
         we've finished scrolling through the variants content. */
      position: sticky;
      top: var(--r66-variants-stick-top, 0);
      padding: 5rem 2rem;
      background: #faf9f6;
      filter: blur(var(--r66-variants-blur, 0px));
    }

    /* Dark overlay that fades in as specs rises, so variants visually turns
       into the dark specs palette before specs physically covers it. */
    .r66-variants::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, #282828 50%, #1c1c1c 50%);
      opacity: var(--r66-variants-darken, 0);
      pointer-events: none;
      z-index: 2;
    }

    .r66-variants__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
    }

    .r66-variants__card {
      position: relative;
      margin-top: 3rem;
      padding: 0;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.07);
      border-radius: 16px 16px 0 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    .r66-variants__card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #1a1a1a;
    }

    .r66-variants__tabs {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0;
      margin: 0;
      padding: 0;
      background: #fbfaf7;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .r66-variants__tab {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.85rem;
      padding: 1.25rem 1.25rem 1.1rem;
      min-height: 160px;
      font-family: 'Space Grotesk', sans-serif;
      text-align: left;
      color: #6b6b6b;
      background: transparent;
      border: none;
      border-right: 1px solid rgba(0,0,0,0.06);
      cursor: pointer;
      transition: color 0.25s ease, background 0.25s ease;
    }

    .r66-variants__tab:last-child { border-right: none; }

    .r66-variants__tab::after {
      content: '';
      position: absolute;
      left: 1.25rem;
      right: 1.25rem;
      bottom: 0;
      height: 2px;
      background: #1a1a1a;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.3s ease;
    }

    .r66-variants__tab:hover {
      background: #f6f3ed;
      color: #1a1a1a;
    }

    .r66-variants__tab:hover .r66-variants__tab-thumb img {
      filter: grayscale(0%);
      opacity: 1;
    }

    .r66-variants__tab.active {
      background: #ffffff;
      color: #1a1a1a;
      justify-content: center;
    }

    .r66-variants__tab.active::after {
      transform: scaleX(1);
    }

    .r66-variants__tab-thumb {
      display: block;
      width: 100%;
      height: 72px;
      overflow: hidden;
      pointer-events: none;
    }

    .r66-variants__tab-thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      filter: grayscale(60%);
      opacity: 0.65;
      transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
    }

    .r66-variants__tab.active .r66-variants__tab-thumb img {
      filter: grayscale(0%);
      opacity: 1;
    }

    .r66-variants__tab-label {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      line-height: 1.2;
      min-width: 0;
      width: 100%;
    }

    .r66-variants__tab-sub {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #9a9a9a;
    }

    .r66-variants__tab.active .r66-variants__tab-sub {
      color: #1a1a1a;
    }

    .r66-variants__tab-name {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: inherit;
    }

    .r66-variants__content {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-top: 0;
    }

    .r66-variants__image {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0.5rem 3rem;
      min-height: 300px;
      background:
        radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%),
        linear-gradient(135deg, #ececea 0%, #ffffff 70%);
      overflow: visible;
    }

    .r66-variants__image::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.6;
      pointer-events: none;
    }

    .r66-variants__image-inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 55%;
      max-width: 560px;
      height: 300px;
      z-index: 1;
    }

    .r66-variants__image-inner img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
    }

    .r66-variants__image-headline {
      position: absolute;
      top: 50%;
      left: 3rem;
      transform: translateY(-50%);
      z-index: 3;
      pointer-events: none;
      width: 40%;
      max-width: 420px;
    }

    .r66-variants__image-headline-inner {
      display: block;
    }

    .r66-variants__image-headline .r66-variants__eyebrow {
      display: inline-block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #a67b3f;
      margin-bottom: 1rem;
    }

    .r66-variants__image-headline h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.01em;
      color: #111111;
      margin: 0 0 0.75rem;
    }

    .r66-variants__image-headline .r66-variants__tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-style: italic;
      color: #8a8a8a;
      margin: 0 0 1.25rem;
    }

    .r66-variants__image-headline .r66-variants__divider {
      width: 64px;
      height: 2px;
      background: #a67b3f;
    }

    .r66-variants__image-index {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(0,0,0,0.4);
      z-index: 2;
    }

    .r66-variants__info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: stretch;
      padding: 2.75rem 3rem 3rem;
      background: #ffffff;
      border-top: 1px solid rgba(0,0,0,0.06);
    }

    .r66-variants__info-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .r66-variants__info-right {
      display: flex;
      flex-direction: column;
    }

    .r66-variants__eyebrow {
      display: inline-block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #1a1a1a;
      margin-bottom: 0.75rem;
    }

    .r66-variants__info h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 500;
      line-height: 1.1;
      color: #1a1a1a;
      margin: 0 0 0.75rem;
      letter-spacing: -0.01em;
    }

    .r66-variants__tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-style: italic;
      color: #7a7a7a;
      margin: 0 0 1.25rem;
      letter-spacing: 0.01em;
    }

    .r66-variants__divider {
      width: 50px;
      height: 2px;
      background: #1a1a1a;
      margin: 0 0 1.5rem;
      border-radius: 2px;
    }

    .r66-variants__description {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: #555;
      margin: 0;
    }

    .r66-variants__pdfs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    .r66-variants__pdf-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.95rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.78rem;
      font-weight: 500;
      color: #1a1a1a;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.12);
      border-radius: 100px;
      text-decoration: none;
      letter-spacing: 0.01em;
      transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
    }

    .r66-variants__pdf-pill i {
      font-size: 0.85rem;
      color: #c8102e;
      transition: color 0.2s;
    }

    .r66-variants__pdf-pill:hover {
      background: #1a1a1a;
      color: #fff;
      border-color: #1a1a1a;
      transform: translateY(-1px);
    }

    .r66-variants__pdf-pill:hover i {
      color: #fff;
    }

    .r66-variants__use-cases {
      margin: 0 0 1.75rem;
    }

    .r66-variants__use-cases-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 0.6rem;
    }

    .r66-variants__use-case-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .r66-variants__image .r66-variants__use-case-tags {
      position: absolute;
      right: 3rem;
      bottom: 1.25rem;
      justify-content: flex-end;
      z-index: 2;
    }

    .r66-variants__use-case-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.75rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.78rem;
      color: #4a4a4a;
      background: #fbfaf7;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 100px;
      letter-spacing: 0.01em;
    }

    .r66-variants__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      gap: 0.6rem;
    }

    .r66-variants__features li {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: #4a4a4a;
      padding: 0;
    }

    .r66-variants__feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      min-width: 26px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.05);
      color: #1a1a1a;
      font-size: 0.7rem;
      flex-shrink: 0;
    }

    .r66-variants__cta {
      display: flex;
      margin-top: 0;
    }

    .r66-variants__cta-button {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      padding: 1.1rem 2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #fff;
      background: #1a1a1a;
      border: 1px solid rgba(0,0,0,0.07);
      border-top: none;
      border-radius: 0 0 4px 4px;
      text-decoration: none;
      transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }

    .r66-variants__cta-button:hover {
      background: #fff;
      color: #1a1a1a;
    }

    .r66-variants__cta-button i {
      font-size: 0.75rem;
      transition: transform 0.2s ease;
    }

    .r66-variants__cta-button:hover i {
      transform: translateX(3px);
    }

    .r66-variants__cta-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .r66-variants__cta-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      color: #1a1a1a;
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: color 0.2s ease, gap 0.2s ease;
    }

    .r66-variants__cta-link:hover {
      color: #4a4a4a;
      gap: 0.75rem;
    }

    .r66-variants__cta-link svg {
      transition: transform 0.2s ease;
    }

    .r66-variants__options {
      margin-top: 4rem;
    }

    .r66-variants__options-header {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 2.5rem;
    }

    .r66-variants__options-header h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      font-weight: 500;
      color: #1a1a1a;
      margin: 0.5rem 0 1rem;
      letter-spacing: -0.01em;
    }

    .r66-variants__options-header p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: #666;
      margin: 0;
    }

    .r66-variants__options-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .r66-variants__option {
      display: flex;
      align-items: flex-start;
      gap: 0.9rem;
      padding: 1.1rem 1.15rem;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.07);
      border-radius: 10px;
      transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .r66-variants__option:hover {
      border-color: #1a1a1a;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    }

    .r66-variants__option-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 8px;
      background: rgba(0,0,0,0.05);
      color: #1a1a1a;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .r66-variants__option-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }

    .r66-variants__option-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.25;
    }

    .r66-variants__option-detail {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.78rem;
      line-height: 1.35;
      color: #7a7a7a;
    }

    @media (max-width: 1100px) {
      .r66-variants__options-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 900px) {
      .r66-variants__image {
        min-height: 260px;
        padding: 2rem 1.5rem;
      }
      .r66-variants__info {
        grid-template-columns: 1fr;
        gap: 1.75rem;
        padding: 2.25rem 1.75rem;
      }
    }

    @media (max-width: 1000px) {
      .r66-variants__tabs {
        grid-template-columns: repeat(3, 1fr);
      }
      .r66-variants__tab:nth-child(3n) { border-right: none; }
      .r66-variants__tab:nth-child(n+4) {
        border-top: 1px solid rgba(0,0,0,0.06);
      }
    }

    @media (max-width: 700px) {
      .r66-variants__tabs {
        grid-template-columns: 1fr;
      }
      .r66-variants__tab {
        flex-direction: row;
        align-items: center;
        min-height: 0;
        padding: 1rem 1.25rem;
        border-right: none;
        border-bottom: 1px solid rgba(0,0,0,0.06);
        border-top: none;
      }
      .r66-variants__tab:last-child { border-bottom: none; }
      .r66-variants__tab-thumb {
        width: 84px;
        height: 48px;
        flex-shrink: 0;
      }
      .r66-variants__tab::after {
        left: 0;
        right: auto;
        top: 0;
        bottom: 0;
        width: 3px;
        height: auto;
        transform: scaleY(0);
        transform-origin: top center;
      }
      .r66-variants__tab.active::after {
        transform: scaleY(1);
      }
      .r66-variants__features {
        justify-content: flex-start;
        flex: 0 0 auto;
      }
      .r66-variants__options-grid {
        grid-template-columns: 1fr;
      }
    }

    /* ====================================================================
       WHY TURBINE SECTION
       ==================================================================== */
    .r66-turbine {
      padding: 5rem 2rem;
      background: #fff;
    }

    .r66-turbine__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r66-turbine__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin: 4rem 0;
    }

    .r66-turbine__card {
      padding: 2rem;
      background: #faf9f6;
      border-radius: 4px;
      text-align: center;
    }

    .r66-turbine__stat {
      margin-bottom: 1.5rem;
    }

    .r66-turbine__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 500;
      color: #1a1a1a;
    }

    .r66-turbine__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
    }

    .r66-turbine__card h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.75rem;
    }

    .r66-turbine__card p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    .r66-turbine__comparison {
      background: #faf9f6;
      padding: 3rem;
      border-radius: 8px;
    }

    .r66-turbine__comparison h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 2rem;
      text-align: center;
    }

    .r66-turbine__comparison-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .r66-turbine__comparison-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .r66-turbine__comparison-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
    }

    .r66-turbine__comparison-bars {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .r66-turbine__cost {
      margin: 3rem auto 0;
      max-width: 960px;
      padding: 2rem 2.25rem;
      background: #faf9f6;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .r66-turbine__cost-header { margin-bottom: 1.25rem; }

    .r66-turbine__cost-header .r66-pre-text {
      display: block;
      margin-bottom: 0.5rem;
    }

    .r66-turbine__cost-header h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.35rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.3;
    }

    .r66-turbine__cost-accent { color: #c8102e; }

    .r66-turbine__cost-lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      line-height: 1.7;
      color: #4a4a4a;
      margin: 0 0 1.25rem;
    }

    .r66-turbine__cost-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .r66-turbine__cost-list li {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      line-height: 1.5;
      color: #4a4a4a;
    }

    .r66-turbine__cost-list i {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #fff;
      border-radius: 50%;
      font-size: 0.75rem;
    }

    .r66-turbine__bar {
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      border-radius: 4px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
    }

    .r66-turbine__bar--r66 {
      background: #1a1a1a;
      color: #fff;
      width: 100%;
    }

    .r66-turbine__bar--piston {
      background: #ddd;
      color: #666;
      width: 70%;
    }

    /* ====================================================================
       NXG GLASS COCKPIT SECTION
       ==================================================================== */
    .r66-nxg {
      /* Rises above earlier sticky/pinned sections. See .r66-variants. */
      position: relative;
      z-index: 50;
      padding: 5rem 2rem;
      background: #1a1a1a;
      color: #fff;
    }

    .r66-nxg__container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .r66-nxg .r66-section-header h2 {
      color: #fff;
    }

    .r66-nxg .r66-text--dark { color: #fff; }
    .r66-nxg .r66-text--mid { color: rgba(255, 255, 255, 0.8); }
    .r66-nxg .r66-text--light { color: rgba(255, 255, 255, 0.6); }

    .r66-nxg__intro {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.75);
      margin-top: 1.5rem;
    }

    .r66-nxg__content {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: end;
      margin-bottom: 4rem;
    }

    .r66-nxg__image {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
    }

    .r66-nxg__image img {
      width: 100%;
      display: block;
    }

    .r66-nxg__image-badge {
      position: absolute;
      bottom: 1.5rem;
      left: 1.5rem;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      padding: 1rem 1.5rem;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .r66-nxg__image-badge-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.25rem;
    }

    .r66-nxg__image-badge-text {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
    }

    .r66-nxg__features {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .r66-nxg__feature {
      display: flex;
      gap: 1.25rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .r66-nxg__feature:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .r66-nxg__feature-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .r66-nxg__feature-content h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 0.5rem;
    }

    .r66-nxg__feature-content p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .r66-nxg__standard {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 3rem;
    }

    .r66-nxg__standard h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
      text-align: center;
    }

    .r66-nxg__standard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .r66-nxg__standard-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
    }

    .r66-nxg__standard-item i {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8rem;
    }

    .r66-nxg__standard-item span {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    /* ====================================================================
       AUTOPILOT & TECHNOLOGY SECTION
       ==================================================================== */
    .r66-autopilot {
      padding: 5rem 2rem;
      background: #faf9f6;
    }

    .r66-autopilot__container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .r66-autopilot__intro {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: #4a4a4a;
      text-align: center;
      max-width: 800px;
      margin: 0 auto 4rem;
    }

    .r66-autopilot__modes-section {
      margin-bottom: 4rem;
    }

    .r66-autopilot__modes-header h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      text-align: center;
      margin: 0 0 2rem;
    }

    .r66-autopilot__modes-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .r66-autopilot__modes-selector {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .r66-autopilot__mode-btn {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
    }

    .r66-autopilot__mode-btn:hover {
      border-color: #1a1a1a;
    }

    .r66-autopilot__mode-btn.active {
      background: #1a1a1a;
      border-color: #1a1a1a;
    }

    .r66-autopilot__mode-code {
      font-family: 'Share Tech Mono', monospace;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      width: 50px;
      text-align: center;
      padding: 0.5rem;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .r66-autopilot__mode-btn.active .r66-autopilot__mode-code {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .r66-autopilot__mode-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
    }

    .r66-autopilot__mode-btn.active .r66-autopilot__mode-name {
      color: #fff;
    }

    .r66-autopilot__mode-detail {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 3rem;
      text-align: center;
    }

    .r66-autopilot__mode-display {
      margin-bottom: 1.5rem;
    }

    .r66-autopilot__mode-display-code {
      display: inline-block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 3rem;
      font-weight: 600;
      color: #1a1a1a;
      padding: 1rem 2rem;
      background: #f5f5f5;
      border-radius: 8px;
      letter-spacing: 0.1em;
    }

    .r66-autopilot__mode-detail h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 1rem;
    }

    .r66-autopilot__mode-detail p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: #666;
      margin: 0;
    }

    .r66-autopilot__benefits h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      text-align: center;
      margin: 0 0 2rem;
    }

    .r66-autopilot__benefits-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    .r66-autopilot__benefit {
      padding: 2rem;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .r66-autopilot__benefit-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #fff;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      font-size: 1.25rem;
    }

    .r66-autopilot__benefit h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.75rem;
    }

    .r66-autopilot__benefit p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }

    .r66-autopilot__stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      padding: 3rem;
      background: #1a1a1a;
      border-radius: 8px;
    }

    .r66-autopilot__stat {
      text-align: center;
    }

    .r66-autopilot__stat-value {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 500;
      color: #fff;
    }

    .r66-autopilot__stat-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 0.5rem;
    }

    .r66-autopilot__stat-divider {
      width: 1px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
    }

    /* ====================================================================
       GALLERY SECTION
       ==================================================================== */
    /* ====================================================================
       FINAL STACK — wraps R66Case sections + R66Gallery + R66CTA so each
       becomes a sticky-at-end step and the next one rises over it. Each
       step blurs + fades to the next section's palette via JS-set
       --r66-stack-blur and --r66-stack-darken.
       ==================================================================== */
    .r66-final-stack {
      position: relative;
    }

    /* Each participating section (except the last, which rises and then
       flows into the footer) is sticky-at-end. --r66-stack-stick-top is
       set per-element in JS to min(0, vh - sectionH) so tall sections
       scroll naturally until their bottom reaches the viewport bottom,
       then pin there while the next rises up over them. */
    .r66-final-stack > .r66b-exp,
    .r66-final-stack > .r66b-seamP,
    .r66-final-stack > .r66b-range,
    .r66-final-stack > .r66-gallery {
      position: sticky;
      top: var(--r66-stack-stick-top, 0);
      filter: blur(var(--r66-stack-blur, 0px));
    }
    /* The last section (CTA) stays relative — it rises over the previous
       sticky section and then scrolls into the footer naturally instead of
       creating a pinned "dead zone" at the page bottom. */
    .r66-final-stack > .r66-cta {
      position: relative;
    }

    /* Overlay that fades the underlying section into the next section's
       palette (dark for rising dark sections, light for rising light).
       z-index: 10 so it sits above internal content but below the next
       section that will eventually cover this one. */
    .r66-final-stack > .r66b-exp::after,
    .r66-final-stack > .r66b-seamP::after,
    .r66-final-stack > .r66b-range::after,
    .r66-final-stack > .r66-gallery::after,
    .r66-final-stack > .r66-cta::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: var(--r66-stack-darken, 0);
      z-index: 10;
    }
    .r66-final-stack > .r66-next-dark::after  { background: #0a0a0a; }
    .r66-final-stack > .r66-next-light::after { background: #faf9f6; }

    .r66-gallery {
      background: #faf9f6;
      padding: 5rem 2rem;
    }

    .r66-gallery__container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .r66-gallery__scroll-wrapper {
      position: relative;
      margin-top: 3rem;
    }

    .r66-gallery__scroll {
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }

    .r66-gallery__chevron {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      color: #1a1a1a;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
    }

    .r66-gallery__chevron:hover:not(:disabled) {
      background: #1a1a1a;
      color: #fff;
    }

    .r66-gallery__chevron:disabled {
      opacity: 0.3;
      cursor: default;
      pointer-events: none;
    }

    .r66-gallery__chevron--prev { left: -22px; }
    .r66-gallery__chevron--next { right: -22px; }

    .r66-gallery__scroll::-webkit-scrollbar {
      display: none;
    }

    .r66-gallery__grid {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 420px;
      gap: 1.5rem;
      width: max-content;
    }

    .r66-gallery__grid > * {
      scroll-snap-align: start;
      min-width: 0;
    }

    .r66-gallery__item {
      position: relative;
      aspect-ratio: 4/3;
      width: 100%;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
    }

    .r66-gallery__dots {
      display: flex;
      justify-content: center;
      gap: 6px;
      padding: 1.5rem 0 0;
    }

    .r66-gallery__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ccc;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: background 0.2s;
    }

    .r66-gallery__dot--active {
      background: #1a1a1a;
    }

    .r66-gallery__item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .r66-gallery__item:hover img {
      transform: scale(1.05);
    }

    .r66-gallery__overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .r66-gallery__item:hover .r66-gallery__overlay {
      opacity: 1;
    }

    .r66-gallery__overlay i {
      color: #fff;
      font-size: 1.5rem;
    }

    .r66-gallery__lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .r66-gallery__lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    .r66-gallery__lightbox-content img {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
    }

    .r66-gallery__lightbox-close {
      position: absolute;
      top: -3rem;
      right: 0;
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .r66-gallery__lightbox-close:hover {
      background: #fff;
      color: #1a1a1a;
    }

    /* ====================================================================
       CTA SECTION
       ==================================================================== */
    .r66-cta {
      /* Rises above earlier sticky/pinned sections. See .r66-variants. */
      position: relative;
      z-index: 50;
      padding: 5rem 2rem;
      background: #1a1a1a;
    }

    .r66-cta__toggle {
      display: flex;
      justify-content: center;
      gap: 0;
      max-width: 1200px;
      margin: 0 auto 3rem;
    }

    .r66-cta__toggle-btn {
      flex: 0 0 auto;
      padding: 0.65rem 2rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: transparent;
      color: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .r66-cta__toggle-btn:first-child {
      border-radius: 4px 0 0 4px;
      border-right: none;
    }

    .r66-cta__toggle-btn:last-child {
      border-radius: 0 4px 4px 0;
    }

    .r66-cta__toggle-btn--active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.35);
    }

    .r66-cta__toggle-btn:not(.r66-cta__toggle-btn--active):hover {
      color: rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .r66-cta__container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: stretch;
    }

    @media (min-width: 1025px) {
      .r66-cta__content {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      /* The benefits card's Reveal wrapper is the last child of .r66-cta__content — grow it to match the form's height */
      .r66-cta__content > div:last-child {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
      }

      .r66-cta__content > div:last-child > .r66-cta__benefits-card {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 0;
      }

      /* Form side — make the Reveal wrapper and the form itself fill the full row height */
      .r66-cta__container > div:last-child:not(.r66-cta__content) {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .r66-cta__container > div:last-child:not(.r66-cta__content) > .r66-cta__form,
      .r66-cta__container > div:last-child:not(.r66-cta__content) > form.r66-cta__form {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
      }

      /* Push the submit button to the bottom of the form */
      .r66-cta__form .r66-btn--submit {
        margin-top: auto;
      }
    }

    .r66-cta .r66-pre-text--light {
      color: rgba(255, 255, 255, 0.6);
    }

    .r66-cta .r66-pre-text__short { display: none; }

    .r66-cta__content h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
      color: #fff;
    }

    .r66-cta__lead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.05rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.7);
      margin: 2rem 0;
    }

    .r66-cta__benefits-card {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
    }

    .r66-cta__benefits {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .r66-cta__benefit {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.85);
    }

    .r66-cta__benefit i {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #fff;
      font-size: 0.9rem;
    }

    .r66-cta__form {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 2.5rem;
    }

    .r66-cta__success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      padding: 3rem 2rem;
      text-align: center;
    }

    .r66-cta__success p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
      margin: 0;
    }

    .r66-cta__error {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: #fca5a5;
      margin: 0 0 1rem;
    }

    .r66-cta__error a {
      color: #fca5a5;
      text-decoration: underline;
    }

    .r66-cta__form h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #fff;
      margin: 0 0 2rem;
      text-align: center;
    }

    .r66-cta__form-group {
      margin-bottom: 1rem;
    }

    .r66-cta__form input,
    .r66-cta__form textarea {
      width: 100%;
      padding: 1rem 1.25rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      transition: all 0.3s ease;
    }

    .r66-cta__form input::placeholder,
    .r66-cta__form textarea::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .r66-cta__form input:focus,
    .r66-cta__form textarea:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }

    .r66-cta__form textarea {
      resize: vertical;
      min-height: 80px;
    }

    .r66-select {
      position: relative;
      width: 100%;
    }

    .r66-select__trigger {
      width: 100%;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      transition: border-color 0.2s, background 0.2s;
    }

    .r66-select__trigger:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }

    .r66-select__chevron {
      flex-shrink: 0;
      margin-left: 0.75rem;
      transition: transform 0.2s ease;
    }

    .r66-select__chevron--open { transform: rotate(180deg); }

    .r66-select__menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #1e1e1e;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      list-style: none;
      margin: 0;
      padding: 0.35rem 0;
      z-index: 100;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }

    .r66-select__option {
      padding: 0.75rem 1.25rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.75);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .r66-select__option:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #fff;
    }

    .r66-select__option--active {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }

    .r66-btn--submit {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      background: #fff;
      color: #1a1a1a;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .r66-btn--submit:hover {
      background: #f5f5f5;
      transform: translateY(-1px);
    }

    .r66-btn--submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .r66-cta__contact {
      max-width: 1200px;
      margin: 3rem auto 0;
      padding-top: 3rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .r66-cta__contact-inner {
      display: flex;
      justify-content: center;
      gap: 4rem;
      flex-wrap: wrap;
    }

    .r66-cta__contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .r66-cta__contact-item i {
      color: rgba(255, 255, 255, 0.4);
    }

    @media (max-width: 1024px) {
      .r66-cta__container {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .r66-cta { padding: 4rem 1.25rem; }
      .r66-cta__form { padding: 1.75rem; }
      .r66-cta__contact-inner { gap: 1.5rem; flex-direction: column; align-items: center; }
    }

    /* ====================================================================
       RESPONSIVE STYLES
       ==================================================================== */
    @media (max-width: 1024px) {
      .r66-intro__container,
      .r66-specs__container,
      .r66-variants__content {
        grid-template-columns: 1fr;
      }

      .r66-flight__grid,
      .r66-turbine__grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .r66-expedition__container {
        grid-template-columns: 1fr;
      }

      .r66-gallery__grid {
        grid-auto-columns: 340px;
      }

      .r66-nxg__content {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .r66-nxg__standard-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .r66-autopilot__modes-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .r66-autopilot__benefits-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .r66-autopilot__stats {
        flex-wrap: wrap;
        gap: 2rem;
      }

      .r66-autopilot__stat-divider {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .r66-hero__headline {
        gap: 0.25rem;
      }

      .r66-hero__badges {
        flex-direction: column;
        gap: 1.5rem;
      }

      .r66-hero__badge-divider {
        width: 40px;
        height: 1px;
      }

      .r66-flight__grid,
      .r66-turbine__grid {
        grid-template-columns: 1fr;
      }

      .r66-specs__grid {
        grid-template-columns: 1fr;
      }

      .r66-expedition__stats {
        grid-template-columns: 1fr;
      }

      .r66-variants__tabs {
        flex-direction: column;
      }

      .r66-gallery__grid {
        grid-auto-columns: 80vw;
        gap: 1rem;
      }

      .r66-gallery__chevron {
        display: none;
      }

      .r66-cta__actions {
        flex-direction: column;
        align-items: center;
      }

      .r66-cta__contact {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }

      .r66-nxg__standard-grid {
        grid-template-columns: 1fr;
      }

      .r66-nxg__feature {
        flex-direction: column;
        text-align: center;
      }

      .r66-nxg__feature-icon {
        margin: 0 auto;
      }

      .r66-autopilot__benefits-grid {
        grid-template-columns: 1fr;
      }

      .r66-autopilot__modes-selector {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }

      .r66-autopilot__mode-btn {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        flex: 1;
        min-width: 100px;
      }

      .r66-autopilot__mode-code {
        width: auto;
        padding: 0.5rem 0.75rem;
      }

      .r66-autopilot__mode-name {
        font-size: 0.8rem;
        text-align: center;
      }

      .r66-autopilot__stats {
        flex-direction: column;
        gap: 1.5rem;
        padding: 2rem;
      }
    }

    @media (max-width: 480px) {
      .r66-hero__letter {
        font-size: 4rem;
      }

      .r66-hero__subtitle {
        font-size: 1.25rem;
        letter-spacing: 0.3em;
      }

      .r66-intro,
      .r66-specs,
      .r66-flight,
      .r66-nxg,
      .r66-autopilot,
      .r66-fleet,
      .r66-variants,
      .r66-turbine,
      .r66-gallery,
      .r66-cta {
        padding: 5rem 1.5rem;
      }

      .r66-expedition {
        padding: 6rem 1.5rem;
      }

      .r66-fleet__caption {
        padding: 1rem 1.25rem;
      }

      .r66-fleet__caption-text {
        font-size: 0.9rem;
      }

      .r66-nxg__standard {
        padding: 2rem 1.5rem;
      }

      .r66-autopilot__mode-detail {
        padding: 2rem 1.5rem;
      }

      .r66-autopilot__mode-display-code {
        font-size: 2rem;
        padding: 0.75rem 1.5rem;
      }
    }

    /* ====================================================================
       SECTION: R66 VARIANTS — Inline Configurator
       Replaces the .r66-variants__card when "Launch Configurator" is clicked.
       ==================================================================== */
    .r66-variants__configurator {
      border: 1px solid #e5e4df;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 24px 60px -32px rgba(0,0,0,0.25);
    }
    .r66-variants__configurator-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #e5e4df;
      background: #faf9f6;
      flex-wrap: wrap;
    }
    .r66-variants__configurator-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1rem;
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #1a1a1a;
      background: #ffffff;
      border: 1px solid #d6d4cc;
      border-radius: 999px;
      cursor: pointer;
      transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
    }
    .r66-variants__configurator-back:hover {
      background: #1a1a1a;
      border-color: #1a1a1a;
      color: #faf9f6;
      transform: translateY(-1px);
    }
    .r66-variants__configurator-active {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.15rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #7a7a7a;
      text-align: right;
    }
    .r66-variants__configurator-active strong {
      color: #1a1a1a;
      font-weight: 600;
    }
    .r66-variants__configurator-note {
      font-size: 0.65rem;
      color: #a8a39a;
      letter-spacing: 0.08em;
    }
    .r66-variants__configurator-frame {
      display: block;
      width: 100%;
      height: min(82vh, 820px);
      min-height: 520px;
      border: 0;
      background: #ffffff;
    }
    @media (max-width: 768px) {
      .r66-variants__configurator-meta {
        flex-direction: column;
        align-items: stretch;
        gap: 0.6rem;
      }
      .r66-variants__configurator-active {
        align-items: flex-start;
        text-align: left;
      }
      .r66-variants__configurator-frame {
        height: 70vh;
        min-height: 460px;
      }
    }
  `}</style>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
// Background palette per participating section class. Used to choose the
// overlay color (which blurs to match the RISING section's palette), so a
// light section fading into a dark rising one gets a black overlay, and
// vice-versa.
const R66_STACK_SECTIONS = [
  { selector: '.r66b-exp',     palette: 'light' },
  { selector: '.r66b-seamP',   palette: 'light' },
  { selector: '.r66b-range',   palette: 'light' },
  { selector: '.r66-gallery',  palette: 'light' },
  { selector: '.r66-cta',      palette: 'dark'  },
];
const R66_STACK_MEMBER_SELECTOR = R66_STACK_SECTIONS.map(s => s.selector).join(',');

function useR66FinalStack() {
  useEffect(() => {
    const stack = document.querySelector('.r66-final-stack');
    if (!stack) return undefined;

    // Collect participating sections in DOM order. Each entry carries its
    // own palette + the palette of the NEXT section — that determines the
    // overlay color (dark when the next section is dark, light otherwise).
    const collect = () => {
      const all = Array.from(stack.children)
        .filter(el => el.matches(R66_STACK_MEMBER_SELECTOR));
      const paletteFor = (el) => {
        const match = R66_STACK_SECTIONS.find(s => el.matches(s.selector));
        return match ? match.palette : 'light';
      };
      return all.map((el, i) => {
        const next = all[i + 1] || null;
        return {
          el,
          palette: paletteFor(el),
          nextPalette: next ? paletteFor(next) : null,
          next,
          index: i,
        };
      });
    };

    let steps = collect();

    // Apply one-time setup: overlay-color class + z-index so later sections
    // always paint over earlier ones (they visually rise).
    const applySetup = () => {
      steps.forEach(({ el, nextPalette, index }) => {
        el.classList.remove('r66-next-dark', 'r66-next-light');
        if (nextPalette === 'dark')  el.classList.add('r66-next-dark');
        if (nextPalette === 'light') el.classList.add('r66-next-light');
        el.style.zIndex = String(index + 1);
      });
    };

    // Recompute per-section sticky-top (at-end pattern: pin only when the
    // section's bottom hits the viewport bottom, so tall sections scroll
    // through naturally first).
    const updateStickyTops = () => {
      const vh = window.innerHeight;
      steps.forEach(({ el }) => {
        const stickTop = Math.min(0, vh - el.offsetHeight);
        el.style.setProperty('--r66-stack-stick-top', `${stickTop}px`);
      });
    };

    // Scroll handler: for each step, compute progress of the NEXT section
    // rising into view and apply blur + overlay opacity to the current one.
    const MAX_BLUR = 10;
    let rafId = null;
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const vh = window.innerHeight;
        const catchTopVar = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
        );
        const catchTop = Number.isFinite(catchTopVar) ? catchTopVar : 90;
        const span = Math.max(1, vh - catchTop);
        steps.forEach(({ el, next }) => {
          if (!next) {
            el.style.setProperty('--r66-stack-blur', '0px');
            el.style.setProperty('--r66-stack-darken', '0');
            return;
          }
          const rect = next.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, 1 - (rect.top - catchTop) / span));
          // Blur is fully off until the rising section is almost at the
          // top of the viewport (progress > BLUR_START), then ramps to
          // MAX_BLUR over the final sliver of scroll. Keeps content
          // readable for the maximum amount of time — the haze only lands
          // just before the next section covers the view.
          const BLUR_START = 0.85;
          const blurProgress = progress <= BLUR_START
            ? 0
            : (progress - BLUR_START) / (1 - BLUR_START);
          el.style.setProperty('--r66-stack-blur', `${blurProgress * MAX_BLUR}px`);
          // Darken ramps in a bit earlier than the blur so the palette
          // tint is visible while the underlying content is still sharp.
          const TINT_COMPLETE = 0.9;
          const adjusted = Math.min(1, progress / TINT_COMPLETE);
          el.style.setProperty('--r66-stack-darken', `${Math.pow(adjusted, 3)}`);
        });
      });
    };

    applySetup();
    updateStickyTops();
    onScroll();

    const onResize = () => { updateStickyTops(); onScroll(); };
    // Children can be added/removed by React (e.g., CMS gallery re-renders)
    // — re-collect on mutations so new sections get wired up.
    const mo = new MutationObserver(() => {
      steps = collect();
      applySetup();
      updateStickyTops();
      onScroll();
    });
    mo.observe(stack, { childList: true });

    const ro = new ResizeObserver(updateStickyTops);
    steps.forEach(({ el }) => ro.observe(el));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      mo.disconnect();
      ro.disconnect();
    };
  }, []);
}

function AircraftR66() {
  useCmsHighlight();
  useR66FinalStack();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="r66-page">
      <Seo
        title="Robinson R66 · UK Dealer & RR300 Service"
        description="Buy a new Robinson R66 Turbine — five-seat single-engine Rolls-Royce RR300 — from HQ Aviation at Denham, a Robinson authorised dealer and RR300 service center."
        ogImage="/assets/images/r66helis.jpg"
        jsonLd={[
          buildProduct({
            name: 'Robinson R66 Turbine',
            description: 'New Robinson R66 Turbine — five-seat single-engine Rolls-Royce RR300 turboshaft helicopter.',
            image: '/og-default.jpg',
            brand: 'Robinson Helicopter Company',
            url: '/aircraft/r66',
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'New Aircraft Sales', path: '/sales/new' },
            { name: 'Robinson R66', path: '/aircraft/r66' },
          ]),
        ]}
      />
      <h1 style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Robinson R66 Turbine — UK Authorised Dealer, Service Center & RR300 Service Centre
      </h1>
      <R66Styles />
      <R66Header />
      <main>
        <R66Hero />
        <div className="r66-sticky-stack">
          <R66Highlights />
          <R66Introduction />
          <R66Variants />
          <R66Specifications />
        </div>
        <R66NXGCockpit />
        <div className="r66-final-stack">
          <R66Case />
          <R66Gallery />
          <R66CTA />
        </div>
      </main>
      <FooterMinimal />
    </div>
  );
}

export default AircraftR66;
