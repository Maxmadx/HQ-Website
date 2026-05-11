/**
 * HQ AVIATION - ROBINSON R44 AIRCRAFT PAGE
 *
 * A comprehensive showcase of the Robinson R44 helicopter featuring:
 * - Full viewport hero with animated title
 * - History timeline (First flight 1990, certified 1992, 6,500+ built)
 * - Technical specifications interactive card
 * - Captain Quentin Smith achievement section (CRITICAL)
 * - Variants showcase (Raven I, Raven II, Cadet, Clipper)
 * - Expeditions map showing Captain Q's routes
 * - Image gallery
 * - CTA sections
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk (headlines) + Share Tech Mono (technical data)
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal), #4a4a4a (mid), #7a7a7a (light)
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence, LayoutGroup } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { useAircraftSpecs } from '../hooks/useAircraftSpecs';
import { SECTION_MAP } from '../lib/imageSections';
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import Image from '../components/Image';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import Footer
import FooterMinimal from '../components/FooterMinimal';
import HqMenuPanel from '../components/HqMenuPanel';

// ============================================================================
// COMPONENT 1: R44Header - Page Header with Spotlight Animation
// ============================================================================
function R44Header() {
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
// COMPONENT 2: Reveal Animation Wrapper
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
// COMPONENT 3: AnimatedNumber
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
// R44 DATA
// ============================================================================
// R44 per-variant technical specs, diagrams, and dimensions
// Figures sourced from Robinson Helicopter published data, with auxiliary fuel included where applicable
const r44ModelSpecs = [
  {
    key: 'ravenI',
    name: 'Raven I',
    diagram: '/assets/images/new-aircraft/r44/r44-raven-i-specification-diagram.png',
    dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,400 lbs' },
    specs: [
      { label: 'Engine', value: 'Lycoming O-540 (carbureted)' },
      { label: 'Power', value: '205 HP continuous / 225 HP takeoff' },
      { label: 'Max Speed', value: '130 kts (VNE)' },
      { label: 'Cruise Speed', value: '110 kts' },
      { label: 'Range', value: '400 nm' },
      { label: 'Useful Load', value: '780 lbs' },
      { label: 'Seats', value: '4' },
      { label: 'Rotor Diameter', value: '33 ft' },
      { label: 'Fuel Capacity', value: '47 gal (main + aux)' },
      { label: 'Endurance', value: '3.5 hrs' },
    ],
  },
  {
    key: 'ravenII',
    name: 'Raven II',
    diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
    dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
    specs: [
      { label: 'Engine', value: 'Lycoming IO-540 (fuel-injected)' },
      { label: 'Power', value: '245 HP continuous / 260 HP takeoff' },
      { label: 'Max Speed', value: '130 kts (VNE)' },
      { label: 'Cruise Speed', value: '117 kts' },
      { label: 'Range', value: '400 nm' },
      { label: 'Useful Load', value: '900 lbs' },
      { label: 'Seats', value: '4' },
      { label: 'Rotor Diameter', value: '33 ft' },
      { label: 'Fuel Capacity', value: '50 gal (main + aux)' },
      { label: 'Endurance', value: '3.5 hrs' },
    ],
  },
  {
    key: 'cadet',
    name: 'Cadet',
    diagram: '/assets/images/new-aircraft/r44/r44-cadet-specification-diagram.png',
    dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,200 lbs' },
    specs: [
      { label: 'Engine', value: 'Lycoming IO-540 (derated)' },
      { label: 'Power', value: '185 HP continuous / 210 HP takeoff' },
      { label: 'Max Speed', value: '130 kts (VNE)' },
      { label: 'Cruise Speed', value: '110 kts' },
      { label: 'Range', value: '300 nm' },
      { label: 'Useful Load', value: '800 lbs' },
      { label: 'Seats', value: '2 + cargo area' },
      { label: 'Rotor Diameter', value: '33 ft' },
      { label: 'Fuel Capacity', value: '29.5 gal' },
      { label: 'Endurance', value: '2.5 hrs' },
    ],
  },
  {
    key: 'clipperPopOut',
    name: 'Clipper II Pop-Out',
    diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
    dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
    specs: [
      { label: 'Engine', value: 'Lycoming IO-540 (fuel-injected)' },
      { label: 'Power', value: '245 HP continuous / 260 HP takeoff' },
      { label: 'Max Speed', value: '130 kts (VNE)' },
      { label: 'Cruise Speed', value: '115 kts' },
      { label: 'Range', value: '395 nm' },
      { label: 'Useful Load', value: '830 lbs' },
      { label: 'Seats', value: '4' },
      { label: 'Rotor Diameter', value: '33 ft' },
      { label: 'Fuel Capacity', value: '50 gal (main + aux)' },
      { label: 'Floats', value: 'Pop-out emergency' },
    ],
  },
  {
    key: 'clipperFixed',
    name: 'Clipper II Fixed',
    diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
    dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
    specs: [
      { label: 'Engine', value: 'Lycoming IO-540 (fuel-injected)' },
      { label: 'Power', value: '245 HP continuous / 260 HP takeoff' },
      { label: 'Max Speed', value: '110 kts (VNE with floats)' },
      { label: 'Cruise Speed', value: '100 kts' },
      { label: 'Range', value: '370 nm' },
      { label: 'Useful Load', value: '800 lbs' },
      { label: 'Seats', value: '4' },
      { label: 'Rotor Diameter', value: '33 ft' },
      { label: 'Fuel Capacity', value: '50 gal (main + aux)' },
      { label: 'Floats', value: 'Fixed utility (water-ops capable)' },
    ],
  },
  {
    key: 'utility',
    name: 'Utility',
    diagram: '/assets/images/new-aircraft/r44/r44-raven-ii-specification-diagram.png',
    dimensions: { length: '29.9 ft', height: '10.75 ft', maxWeight: '2,500 lbs' },
    specs: [
      { label: 'Engine', value: 'Raven I or Raven II base' },
      { label: 'Power', value: 'Varies by base airframe' },
      { label: 'Max Speed', value: '130 kts (VNE)' },
      { label: 'Cruise Speed', value: '110–117 kts' },
      { label: 'Range', value: '300–400 nm' },
      { label: 'Useful Load', value: '780–900 lbs' },
      { label: 'Seats', value: '4 (heavy-duty utility interior)' },
      { label: 'Rotor Diameter', value: '33 ft' },
      { label: 'Fuel Capacity', value: '29.5–50 gal' },
      { label: 'Interior', value: 'TitanPlate headliner, rubberised floor' },
    ],
  },
];

// Stats bar inside the R44 specs section
const r44ProvenStats = [
  { stat: '6,500+', label: 'Aircraft Delivered' },
  { stat: '2,200 hr', label: 'Engine TBO' },
  { stat: 'Since 1992', label: 'In Production' },
];

// Proven-performance cards inside the R44 specs section
const r44ProvenCards = [
  {
    title: 'Lowest Operating Cost',
    description: 'The R44 is the most budget-friendly route into four-seat helicopter ownership. Fuel dominates direct operating cost, reserves are predictable, and parts are available from any Robinson service centre worldwide.',
    icon: 'fa-pound-sign',
  },
  {
    title: 'Four-Seat Utility',
    description: 'A genuine four-seat cabin with removable dual controls, full dual-pilot training capability, and enough useful load for two adults plus luggage or three passengers on shorter trips.',
    icon: 'fa-users',
  },
  {
    title: 'Proven Worldwide',
    description: 'Over 6,500 delivered and in active service on every continent. The most-produced civilian helicopter of its era, with the deepest global support network in piston rotorcraft.',
    icon: 'fa-globe',
  },
];

// Lycoming engine partnership feature cards (R44Engine section)
const lycomingFeatures = [
  {
    title: 'Proven Powerplant',
    description: "The Lycoming IO-540 is one of general aviation's most trusted engines: a fuel-injected, air-cooled flat-six with decades of service across fixed-wing and rotary aircraft worldwide.",
    stat: 'IO-540',
    statLabel: 'Engine Family',
  },
  {
    title: 'Derated For Reliability',
    description: "The AE1A5 can produce up to 300 hp at full throttle, but Robinson derates it to 245 hp continuous. Running well below its capability is exactly why the R44 has such a long, reliable service life.",
    stat: '245',
    statLabel: 'HP Continuous',
  },
  {
    title: 'Torque-Rich Design',
    description: "Spinning a 33-foot main rotor plus tail rotor demands torque, not just horsepower. The IO-540 delivers nearly 800 ft·lbs, the muscle that makes the R44 smooth in every flight regime.",
    stat: '~800',
    statLabel: 'FT·LBS Torque',
  },
  {
    title: '2,200-Hour TBO',
    description: "Factory time-between-overhaul is 2,200 hours or 12 years, a direct reflection of how gently the airframe treats the engine, keeping ownership costs predictable year after year.",
    stat: '2,200',
    statLabel: 'Hours TBO',
  },
];

// Detailed variant comparison data
const variantComparison = {
  ravenI: {
    name: 'Raven I',
    introduced: '1993',
    engine: 'Lycoming O-540',
    engineType: 'Carbureted',
    power: '225 HP continuous',
    maxGrossWeight: '2,400 lbs',
    blades: 'Standard width',
    fuelSystem: 'Carbureted (with carb-heat assist)',
    altitudePerformance: 'Standard',
    bestFor: 'Training, personal use, cost-conscious operators',
  },
  ravenII: {
    name: 'Raven II',
    introduced: '2002',
    engine: 'Lycoming IO-540-AE1A5',
    engineType: 'Fuel-injected',
    power: '245 HP continuous / 260 HP takeoff',
    maxGrossWeight: '2,500 lbs',
    blades: 'Wider blades',
    fuelSystem: 'Fuel-injected',
    altitudePerformance: 'Superior hot & high',
    bestFor: 'Touring, commercial ops, high altitude',
  },
  cadet: {
    name: 'Cadet',
    introduced: 'Nov 2015',
    engine: 'Lycoming IO-540-AE1A5',
    engineType: 'Fuel-injected (derated)',
    power: '210 HP takeoff / 185 HP continuous',
    maxGrossWeight: '2,200 lbs',
    blades: 'Wider blades',
    fuelSystem: 'Fuel-injected',
    altitudePerformance: 'Good',
    configuration: 'Cargo area instead of back seats',
    bestFor: 'Flight training, two-person operations',
  },
  clipper: {
    name: 'Clipper',
    introduced: '1996 / 2013',
    engine: 'Raven I or Raven II base',
    engineType: 'Carbureted or fuel-injected',
    power: '225–245 HP (base-dependent)',
    maxGrossWeight: '2,400–2,500 lbs',
    blades: 'Varies by base',
    fuelSystem: 'Varies by base',
    altitudePerformance: 'Varies by base',
    configuration: 'Fixed utility floats (Clipper I) or pop-out emergency floats (Clipper II)',
    bestFor: 'Coastal, island, over-water and amphibious missions',
  },
  utility: {
    name: 'Utility',
    introduced: 'Mar 2026',
    engine: 'Raven I or Raven II base',
    engineType: 'Varies by base',
    power: 'Varies by base',
    maxGrossWeight: 'Varies by base',
    blades: 'Varies by base',
    fuelSystem: 'Varies by base',
    altitudePerformance: 'Varies by base',
    configuration: 'Heavy-duty Utility interior package',
    bestFor: 'Agricultural, utility, doors-off, rugged missions',
  },
};

const r44Timeline = [
  { year: '1990', title: 'First Flight', description: 'R44 prototype takes to the skies on 31 March.', status: 'completed' },
  { year: '1992', title: 'FAA Certification', description: 'R44 Astro receives its FAA Type Certificate; first delivery follows in February 1993.', status: 'completed' },
  { year: '1997', title: 'First Woman Around The World', highlight: 'Around The World', description: 'Jennifer Murray and co-pilot Quentin Smith complete the first female circumnavigation of the globe by helicopter in an R44. 97 days, 28 countries.', status: 'completed' },
  { year: '1999', title: 'Best-Selling Helicopter', description: 'R44 becomes the world\'s best-selling general aviation helicopter, a title it still holds.', status: 'completed' },
  { year: '2000', title: 'Solo World Circumnavigation', highlight: 'World Circumnavigation', description: 'At age 60, Jennifer Murray flies an R44 solo around the world: 99 days, 36,000 miles, 30 countries. A Guinness World Record.', status: 'completed' },
  { year: '2002', title: 'Raven II Launch', description: 'Fuel-injected IO-540 variant introduced, unlocking hot-and-high performance.', status: 'completed' },
  { year: '2002', title: 'First Piston Helicopter To The North Pole', highlight: 'North Pole', description: 'Captain Quentin Smith and Steve Brooks land an R44 at the Geographic North Pole, the first piston-engined helicopter ever to do so.', status: 'completed' },
  { year: '2005', title: 'First Piston Helicopter To The South Pole', highlight: 'South Pole', description: 'On 18 January, Smith and Brooks land an R44 Raven II at the Geographic South Pole, making the R44 the first piston helicopter to reach both poles.', status: 'completed' },
  { year: '2015', title: 'Cadet Introduced', description: 'Two-seat trainer variant launched, aimed squarely at flight schools.', status: 'completed' },
  { year: '2026', title: 'R44 Utility', description: 'New heavy-duty Utility interior unveiled at Verticon for rugged mission work.', status: 'upcoming' },
];

// Expedition slides for the "Proven in the Field" R44 carousel
const r44ExpeditionSlides = [
  {
    image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    alt: 'Jennifer Murray and Quentin Smith with their R44 during the 1997 circumnavigation',
    paragraphs: [
      "In 1997, Jennifer Murray and Captain Quentin Smith become the first female-led crew to circumnavigate the globe by helicopter, flying a piston-engined R44 across 28 countries in just 97 days.",
      "Europe, the Middle East, India, South-East Asia, Siberia, the Bering Strait, Alaska, Canada, Greenland and Iceland, all in one small Robinson.",
    ],
  },
  {
    image: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',
    alt: 'Jennifer Murray solo R44 circumnavigation',
    paragraphs: [
      "In 2000, Jennifer Murray sets a Guinness World Record as the first woman to circumnavigate the world solo by helicopter, and the first person ever to do so without autopilot.",
      "99 days. 36,000 miles. 30 countries. One R44, one pilot, age 60. A benchmark the airframe has quietly carried ever since.",
    ],
  },
  {
    image: '/assets/images/expeditions/north-pole.jpg',
    alt: 'R44 at the Geographic North Pole with Captain Quentin Smith and Steve Brooks',
    paragraphs: [
      "In October 2002, Captain Quentin Smith and Steve Brooks land an R44 at the Geographic North Pole, the first piston-engined helicopter in history to do it.",
      "Sub-arctic cold, deep-field fuel caches, and a two-blade rotor system that simply refused to quit.",
    ],
  },
  {
    image: '/assets/images/expeditions/antartica.jpg',
    alt: 'R44 Raven II at the Geographic South Pole with Captain Quentin Smith and Steve Brooks',
    paragraphs: [
      "On 18 January 2005, Captain Quentin Smith and Steve Brooks land an R44 Raven II at the Geographic South Pole, making the R44 the first piston-engined helicopter in history to reach both poles.",
      "From Patagonia across the Drake Passage and down the Antarctic Peninsula. One small Robinson, two pilots, and the harshest continent on Earth.",
    ],
  },
];

// Shared R44 family downloads (used where a variant-specific PDF is not published)
const R44_FAMILY_BROCHURE = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RH_R44_US_Digital_Corporate_Brochure_Feb_2026_ccbba8103c.pdf';
// Robinson publishes three separate R44 Estimated Operating Cost sheets. Cadet
// has its own, Raven I (& Clipper I on Raven-I base) share one, Raven II
// (& any Clipper II variant on Raven-II base) share another.
const R44_RAVEN_I_EOC  = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r44_raven_1_eoc_2026_901cf38587.pdf';
const R44_RAVEN_II_EOC = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r44_raven_2_eoc_2026_3a2b4f3c1c.pdf';
const R44_CADET_EOC    = 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/r44_cadet_eoc_2026_08a1dbe300.pdf';

const R44_CONFIGURATOR_BASE = 'https://configurator.robinsonheli.com/';
function r44ConfiguratorUrl(variantIndex) {
  const idMap = [
    'r44-raven-i',
    'r44-raven-ii',
    'r44-cadet',
    'r44-clipper-ii-popout',
    'r44-clipper-ii-fixed',
  ];
  const id = idMap[variantIndex] || 'r44-raven-ii';
  return `${R44_CONFIGURATOR_BASE}?helicopter=${id}&splash=false`;
}

const r44Variants = [
  {
    name: 'Raven I',
    subtitle: 'The Original',
    tagline: 'The affordable four-seat classic.',
    description: "The original R44: a carbureted Lycoming O-540 driving hydraulic controls and a proven two-blade rotor system. The Raven I remains the most affordable route into genuine four-seat helicopter ownership, and HQ Aviation places new orders direct with Robinson in Torrance.",
    image: 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RAVEN_I_LEFT_new1_57d295b1fd.png',
    useCases: ['Personal ownership', 'Low-hour training', 'Cost-conscious operators'],
    features: [
      { icon: 'fa-cog',          text: 'Lycoming O-540 carbureted engine' },
      { icon: 'fa-sliders-h',    text: 'Hydraulically-assisted controls' },
      { icon: 'fa-tag',          text: 'Lowest acquisition cost in the range' },
      { icon: 'fa-weight-hanging', text: '2,400 lb maximum gross weight' },
      { icon: 'fa-fire',         text: 'Carb-heat assist system standard' },
    ],
    pdfs: { brochure: R44_FAMILY_BROCHURE, eoc: R44_RAVEN_I_EOC },
  },
  {
    name: 'Raven II',
    subtitle: 'The Best-Seller',
    tagline: 'Fuel-injected, faster, higher.',
    description: "Fuel-injected Lycoming IO-540 with wider rotor blades and an extra 100 lb of gross weight. This is the R44 that transformed the platform into a genuine hot-and-high performer. Far and away the most-ordered R44 and the variant most HQ Aviation customers end up choosing new from Robinson.",
    image: 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RAVEN_II_LEFT_v2_new1_06c267b7a0.png',
    useCases: ['Touring', 'Commercial charter', 'Hot-and-high operations'],
    features: [
      { icon: 'fa-cog',          text: 'Fuel-injected Lycoming IO-540-AE1A5' },
      { icon: 'fa-bolt',         text: '245 HP continuous / 260 HP takeoff' },
      { icon: 'fa-mountain',     text: 'Superior hot-and-high performance' },
      { icon: 'fa-fan',          text: 'Wider-chord main rotor blades' },
      { icon: 'fa-weight-hanging', text: '2,500 lb maximum gross weight' },
    ],
    pdfs: { brochure: R44_FAMILY_BROCHURE, eoc: R44_RAVEN_II_EOC },
  },
  {
    name: 'Cadet',
    subtitle: 'Purpose-Built Trainer',
    tagline: 'Built to train the next generation.',
    description: "A Raven I airframe with the rear seats removed for cargo, the engine derated, and engine TBO pushed to 2,400 hours. Robinson's factory-built answer to flight-school economics. Cheaper to buy, cheaper to run, and engineered around the hour-building mission.",
    image: 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/CADET_LEFT_V3_new1_dad7a93887.png',
    useCases: ['Ab-initio PPL training', 'Hour building', 'Two-up charter'],
    features: [
      { icon: 'fa-graduation-cap', text: 'Two-seat trainer with rear cargo area' },
      { icon: 'fa-clock',          text: '2,400-hour engine TBO' },
      { icon: 'fa-dollar-sign',    text: 'Lowest direct operating cost in the range' },
      { icon: 'fa-weight-hanging', text: '2,200 lb maximum gross weight' },
      { icon: 'fa-bolt',           text: '210 HP takeoff / 185 HP continuous' },
    ],
    pdfs: { brochure: R44_FAMILY_BROCHURE, eoc: R44_CADET_EOC },
  },
  {
    name: 'Clipper II Pop-Out',
    subtitle: 'Emergency Floats',
    tagline: 'Land R44 with over-water protection.',
    description: "A standard Raven II airframe fitted with pop-out emergency floats that inflate in 2–3 seconds when needed, so the helicopter flies like a regular R44 day-to-day but gives pilots a survivable option if an over-water forced landing is required. The right spec for coastal touring, offshore transit and any route that spends meaningful time over water.",
    image: 'https://configurator.robinsonheli.com/assets/images/helicopters/r44-clipper-ii-popout/CLIPPER-POPOUT-LEFT-V2.png',
    useCases: ['Coastal touring', 'Offshore transit', 'Over-water routes'],
    features: [
      { icon: 'fa-life-ring',     text: 'Pop-out emergency floats, inflate in 2–3 seconds' },
      { icon: 'fa-wind',          text: 'Minimal cruise speed penalty vs. standard R44' },
      { icon: 'fa-couch',         text: 'Same four-seat cabin as standard Raven II' },
      { icon: 'fa-cog',           text: 'Raven II base (fuel-injected IO-540)' },
      { icon: 'fa-shield-alt',    text: 'Flies dry, deploys only when needed' },
    ],
    pdfs: { brochure: R44_FAMILY_BROCHURE, eoc: R44_RAVEN_II_EOC },
  },
  {
    name: 'Clipper II Fixed',
    subtitle: 'Fixed Utility Floats',
    tagline: 'Built to operate from water.',
    description: "Raven II airframe with permanently-fitted utility floats, designed to operate off water as a primary mission rather than purely for emergencies. The right choice for superyacht ops, island hopping and shoreline landings where water-borne operation is a day-to-day requirement.",
    image: 'https://configurator.robinsonheli.com/assets/images/helicopters/r44-clipper-ii-fixed/CLIPPER-II-FIXED-LEFT-V3.png',
    useCases: ['Superyacht ops', 'Island hopping', 'Shoreline landings'],
    features: [
      { icon: 'fa-water',         text: 'Fixed utility floats for routine water ops' },
      { icon: 'fa-anchor',        text: 'Designed to land on water as standard' },
      { icon: 'fa-ship',          text: 'Yacht and beach landing capable' },
      { icon: 'fa-cog',           text: 'Raven II base (fuel-injected IO-540)' },
      { icon: 'fa-couch',         text: 'Same four-seat cabin as standard Raven II' },
    ],
    pdfs: { brochure: R44_FAMILY_BROCHURE, eoc: R44_RAVEN_II_EOC },
  },
];

const expeditionRoutes = [
  { name: 'North Pole Flight', year: '2019', coords: '90.0000°N', distance: '3,500 nm' },
  { name: 'South Pole Expedition', year: '2021', coords: '90.0000°S', distance: '4,200 nm' },
  { name: 'First Circumnavigation', year: '2016', coords: 'Global', distance: '26,000 nm' },
  { name: 'Second Circumnavigation', year: '2022', coords: 'Both Poles', distance: '31,000 nm' },
];

const galleryImages = [
  '/assets/images/new-aircraft/r44/r44-cutout.png',
  '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
  '/assets/images/new-aircraft/r44/r44blueprint.jpg',
  '/assets/images/used-aircraft/r44/r44-south-pole.jpg',
  '/assets/images/expeditions/antartica.jpg',
  '/assets/images/expeditions/north-pole.jpg',
];

// ============================================================================
// COMPONENT 4: R44Hero - Full Viewport Hero
// ============================================================================
function R44Hero() {
  const heroRef = useRef(null);
  const pageImages = usePageImages('r44');
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={heroRef} className="r44-hero" data-cms-section="r44-hero">
      <motion.div
        className="r44-hero__bg"
        style={{ y: imageY }}
      >
        <Image src={pageImages['r44-hero']?.[0]?.url || '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png'} alt="Robinson R44 Raven II" width={1920} height={1080} priority sizes="100vw" />
      </motion.div>

      <div className="r44-hero__overlay" />

      <motion.div
        className="r44-hero__content"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.span
          className="r44-hero__label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          #1 GA HELICOPTER EVERY YEAR SINCE 1999
        </motion.span>

        <div className="r44-hero__headline">
          <motion.span
            className="r44-hero__word r44-hero__word--1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            ROBINSON
          </motion.span>
          <motion.span
            className="r44-hero__word r44-hero__word--2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            R44
          </motion.span>
        </div>

        <motion.div
          className="r44-hero__divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        <motion.p
          className="r44-hero__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Frank Robinson's four-seat masterpiece, the most-built civilian
          helicopter in history, and still the most sensible way into ownership.
        </motion.p>

        <motion.div
          className="r44-hero__badges"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="r44-hero__badge">
            <span className="r44-hero__badge-value">6,500+</span>
            <span className="r44-hero__badge-label">Built</span>
          </div>
          <div className="r44-hero__badge-divider" />
          <div className="r44-hero__badge">
            <span className="r44-hero__badge-value">1992</span>
            <span className="r44-hero__badge-label">Certified</span>
          </div>
          <div className="r44-hero__badge-divider" />
          <div className="r44-hero__badge">
            <span className="r44-hero__badge-value">4</span>
            <span className="r44-hero__badge-label">Seats</span>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}

// ============================================================================
// COMPONENT 5: R44Intro - Introduction Section
// ============================================================================
function R44Intro() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Compute a negative "top" for the intro so it only pins at the end of its
    // own scroll — i.e. the moment its bottom edge aligns with the viewport
    // bottom. That way, scrolling feels natural until we reach the bottom of
    // the intro, at which point the next section can rise up over it.
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const introH = el.offsetHeight;

      // Default: pin when intro's bottom reaches viewport bottom.
      let stickTop = Math.min(0, vh - introH);

      // Preferred: pin later so at pin, the expedition container's top lines
      // up with the pre-text (held at catch-top by the sticky left column).
      //   stickTop = catchTop - expeditionOffsetFromIntro
      const expedition = el.querySelector('.r44-expedition__container');
      const preText = el.querySelector('.r44-pre-text');
      if (expedition && preText) {
        const introRect = el.getBoundingClientRect();
        const expOffsetFromIntro = expedition.getBoundingClientRect().top - introRect.top;
        // Match CSS: top: max(10vh, var(--catch-top, 90px)) on .r44-intro__content
        const catchTopVar = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
        );
        const catchTop = Math.max(vh * 0.1, Number.isFinite(catchTopVar) ? catchTopVar : 90);
        const alignedStickTop = Math.min(0, catchTop - expOffsetFromIntro);
        // Use whichever pins LATER (more negative) so the user can actually
        // scroll the expedition all the way up to the pre-text line.
        stickTop = Math.min(stickTop, alignedStickTop);
      }

      document.documentElement.style.setProperty('--r44-intro-stick-top', `${stickTop}px`);
    };
    update();

    // Progressively blur + darken the intro as the next section rises over it.
    // progress 0 = next section's top just touches the viewport bottom
    // progress 1 = next section's top reaches the top of the viewport.
    // This mirrors the successful R66 pattern exactly.
    const MAX_BLUR = 10; // px
    const nextSection = document.querySelector('.r44-variants');

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !nextSection) return;
      const rect = nextSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      const blur = progress * MAX_BLUR;
      el.style.setProperty('--r44-intro-blur', `${blur}px`);
      // Ease-in for darken: stays relatively light for most of the scroll,
      // then ramps up quickly toward the end. Remap so full dark lands just
      // before progress=1 (tail of progress stays pinned at black).
      const DARK_COMPLETE = 0.95;
      const adjusted = Math.min(1, progress / DARK_COMPLETE);
      const darken = Math.pow(adjusted, 8);
      el.style.setProperty('--r44-intro-darken', `${darken}`);
      // When the intro has faded out, it's still sticky-pinned at viewport
      // bottom and would block clicks on the sections on top. Disable
      // pointer events once it's effectively invisible so later sections
      // are fully interactive.
      el.style.pointerEvents = progress >= 0.98 ? 'none' : '';
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
    <section className="r44-intro" ref={sectionRef}>
      <div className="r44-intro__container">
        <div className="r44-intro__content">
          <Reveal>
            <span className="r44-pre-text">Frank Robinson's Masterpiece</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="r44-intro__headline">
              <span className="r44-text--dark">Simple.</span>{' '}
              <span className="r44-text--mid">Dependable.</span>{' '}
              <span className="r44-text--light">Proven.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="r44-intro__text">
              Frank Robinson founded Robinson Helicopter Company in his Palos Verdes living
              room in 1973 with a single obsession: a civilian helicopter normal people could
              actually afford to own and fly. The R44, first flown in 1990 and certified in 1992,
              is the fullest expression of that idea, and the world's best-selling general
              aviation helicopter every year since 1999.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="r44-intro__text">
              More than 6,500 have been built. Parts are available globally, mechanics
              everywhere are trained on it, and direct operating cost sits below £230/hr.
              which is why it remains the smartest first helicopter most private buyers and
              schools will ever purchase. In March 2026 Robinson added the new R44 Utility
              interior package, bringing factory-built agricultural and doors-off capability
              to the same proven airframe.
            </p>
          </Reveal>
        </div>

        <div className="r44-intro__right">
          <Reveal delay={0.4} direction="right">
            <div className="r44-intro__image">
              <img
                src="/assets/images/fleet/r44-g-mxpi.png"
                alt="HQ Aviation R44 fleet"
                width={2197}
                height={1350}
                loading="lazy"
              />
            </div>
          </Reveal>
          <div className="r44-intro__divider" />
          <R44History />
          <div className="r44-intro__divider" />
          <R44Expedition />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 7: R44History - Timeline Section
// ============================================================================
function R44History() {
  return (
    <section className="r44-timeline">
      <div className="r44-timeline__container">
        <Reveal>
          <div className="r44-section-header">
            <h2>
              <span className="r44-text--dark">History</span>{' '}
              <span className="r44-text--mid">of the</span>{' '}
              <span className="r44-text--light">R44</span>
            </h2>
          </div>
        </Reveal>

        <div className="r44-timeline__track">
          <div className="r44-timeline__line">
            <div className="r44-timeline__line-progress" />
          </div>

          {r44Timeline.map((event, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className={`r44-timeline__item r44-timeline__item--${event.status || 'completed'}`}>
                <div className="r44-timeline__marker">
                  {event.status === 'active' && <div className="r44-timeline__pulse" />}
                  {event.status === 'upcoming' && <div className="r44-timeline__dot" />}
                  {(!event.status || event.status === 'completed') && <i className="fas fa-check"></i>}
                </div>
                <div className="r44-timeline__content">
                  <span className="r44-timeline__year">{event.year}</span>
                  <div className="r44-timeline__text">
                    <h4>
                      {event.highlight && event.title.includes(event.highlight) ? (() => {
                        const [before, after] = event.title.split(event.highlight);
                        return (
                          <>
                            {before}
                            <span className="r44-timeline__highlight">{event.highlight}</span>
                            {after}
                          </>
                        );
                      })() : event.title}
                    </h4>
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 8: R44Specs - Interactive Technical Specifications
// ============================================================================
function R44Specs() {
  const [modelIdx, setModelIdx] = useState(1); // default Raven II
  const { variants: adminVariants } = useAircraftSpecs('r44');
  // Merge admin-managed rows + dimensions into the static r44ModelSpecs by key.
  // Variants in admin override the static defaults; static is the fallback if
  // a key isn't in admin yet (e.g., a freshly added variant the admin hasn't
  // touched, or before first save).
  const variants = r44ModelSpecs.map((staticVariant) => {
    const adminMatch = adminVariants.find((v) => v.key === staticVariant.key);
    if (!adminMatch) return staticVariant;
    return {
      ...staticVariant,
      name: adminMatch.name || staticVariant.name,
      diagram: adminMatch.diagram || staticVariant.diagram,
      dimensions: adminMatch.dimensions || staticVariant.dimensions,
      specs: adminMatch.rows?.length ? adminMatch.rows : staticVariant.specs,
    };
  });
  const model = variants[modelIdx] ?? variants[0];
  const prevModel = () => setModelIdx((i) => (i - 1 + variants.length) % variants.length);
  const nextModel = () => setModelIdx((i) => (i + 1) % variants.length);

  return (
    <section className="r44-specs">
      <div className="r44-specs__container">
        <div className="r44-specs__split">
          <div className="r44-specs__split-left">
            <Reveal>
              <div className="r44-section-header">
                <span className="r44-pre-text">PERFORMANCE DATA</span>
                <h2>
                  <span className="r44-text--dark">Technical</span>{' '}
                  <span className="r44-text--mid">Specifications</span>
                </h2>
              </div>
            </Reveal>

            <div className="r44-specs__columns">
              <div className="r44-specs__right">
                <div className="r44-specs__blueprint-card">
                  <img
                    src={model.diagram}
                    alt={`R44 ${model.name} specification diagram with dimensions`}
                    className="r44-specs__blueprint"
                    width={2982}
                    height={1663}
                    loading="lazy"
                  />
                </div>
                <div className="r44-specs__overlay-data">
                  <div className="r44-specs__overlay-item">
                    <span>LENGTH</span>
                    <span>{model.dimensions.length}</span>
                  </div>
                  <div className="r44-specs__overlay-item">
                    <span>HEIGHT</span>
                    <span>{model.dimensions.height}</span>
                  </div>
                  <div className="r44-specs__overlay-item">
                    <span>MAX WEIGHT</span>
                    <span>{model.dimensions.maxWeight}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="r44-specs__split-right">
            <div className="r44-specs__model-switcher">
              <button
                type="button"
                className="r44-specs__model-chevron"
                onClick={prevModel}
                aria-label="Previous model"
              >
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
              </button>
              <div className="r44-specs__model-title">
                <span className="r44-specs__model-eyebrow">Currently Viewing</span>
                <span className="r44-specs__model-name">R44 {model.name}</span>
              </div>
              <button
                type="button"
                className="r44-specs__model-chevron"
                onClick={nextModel}
                aria-label="Next model"
              >
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
              </button>
            </div>

            <div className="r44-specs__table">
              <div className="r44-specs__row r44-specs__row--header">
                <div className="r44-specs__cell">Specification</div>
                <div className="r44-specs__cell">Value</div>
              </div>
              {model.specs.map((spec, i) => (
                <div key={`${model.key}-${i}`} className="r44-specs__row">
                  <div className="r44-specs__cell r44-specs__cell--label">{spec.label}</div>
                  <div className="r44-specs__cell">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="r44-specs__split-divider" />

            <Reveal>
              <div className="r44-proven__stats-bar">
                {r44ProvenStats.map((b, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="r44-proven__stat-divider" />}
                    <div className="r44-proven__stat">
                      <span className="r44-proven__stat-value">{b.stat}</span>
                      <span className="r44-proven__stat-label">{b.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </Reveal>

            <div className="r44-specs__split-divider" />

            <div className="r44-proven__grid">
              {r44ProvenCards.map((item, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="r44-proven__card">
                    {item.icon && (
                      <div className="r44-proven__card-icon">
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
// COMPONENT 8B: R44Engine - Lycoming IO-540 Partnership
// ============================================================================
function R44Engine() {
  const [enginePage, setEnginePage] = useState(0);
  const engineGridRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Same "stick at end + rise-over" pattern as R44Intro: pin the engine
    // section when its bottom reaches the viewport bottom so the next section
    // (R44VariantComparison) can rise up over it.
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionH = el.offsetHeight;
      const vh = window.innerHeight;
      const stickTop = Math.min(0, vh - sectionH);
      document.documentElement.style.setProperty('--r44-engine-stick-top', `${stickTop}px`);
    };
    update();

    // Match the R44Intro pacing exactly: progress spans the full viewport
    // travel of the next section rising, and the fade uses an ease-in curve
    // so the engine stays visible for most of the scroll and only ramps
    // sharply at the end (DARK_COMPLETE=0.95, exponent 8).
    const MAX_BLUR = 10;
    const nextSection = document.querySelector('.r44-comparison');

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !nextSection) return;
      const rect = nextSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      const blur = progress * MAX_BLUR;
      el.style.setProperty('--r44-engine-blur', `${blur}px`);
      const DARK_COMPLETE = 0.95;
      const adjusted = Math.min(1, progress / DARK_COMPLETE);
      const eased = Math.pow(adjusted, 8);
      el.style.setProperty('--r44-engine-opacity', `${1 - eased}`);
      // Disable pointer events once faded out so later sections aren't
      // blocked by the still-pinned engine section.
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
    <section className="r44-engine" ref={sectionRef}>
      <div className="r44-engine__container">
        <div className="r44-engine__layout">
          <div className="r44-engine__left">
            <Reveal>
              <div className="r44-section-header r44-section-header--left">
                <span className="r44-pre-text">Powertrain</span>
                <h2>
                  <span className="r44-text--dark">Lycoming</span>{' '}
                  <span className="r44-text--mid">Reliability</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="r44-engine__lead">
                Every R44 flying today is powered by a derated version of the Lycoming
                IO-540, one of general aviation's most respected piston engines. This
                partnership is the single biggest reason R44 ownership costs are as
                predictable as they are.
              </p>
              <div className="r44-engine__logo">LYCOMING</div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="r44-engine__body">
                Lycoming has built horizontally-opposed aircraft engines since the 1930s,
                and the O-540/IO-540 family is the workhorse that flies everything from
                Cessna 206s and Piper Senecas to the R44. Frank Robinson specified it for
                exactly the reasons he specified every component on the airframe: proven,
                serviceable by any competent mechanic anywhere in the world, and affordable
                to overhaul when the time comes.
              </p>
            </Reveal>
          </div>

          <div className="r44-engine__right">
            <div className="r44-engine__carousel">
              <button
                type="button"
                className="r44-engine__nav r44-engine__nav--prev"
                aria-label="Previous"
                onClick={() => {
                  const el = engineGridRef.current;
                  if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div
                className="r44-engine__grid"
                ref={engineGridRef}
                onScroll={() => {
                  const el = engineGridRef.current;
                  if (el) setEnginePage(Math.round(el.scrollLeft / el.clientWidth));
                }}
              >
                {lycomingFeatures.map((feature, i) => (
                  <div key={i} className="r44-engine__card">
                    <div className="r44-engine__stat">
                      <span className="r44-engine__stat-value">{feature.stat}</span>
                      <span className="r44-engine__stat-label">{feature.statLabel}</span>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="r44-engine__nav r44-engine__nav--next"
                aria-label="Next"
                onClick={() => {
                  const el = engineGridRef.current;
                  if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="r44-engine__dots">
              {lycomingFeatures.map((_, i) => (
                <span
                  key={i}
                  className={`r44-engine__dot${enginePage === i ? ' r44-engine__dot--active' : ''}`}
                  onClick={() => engineGridRef.current?.scrollTo({ left: i * engineGridRef.current.clientWidth, behavior: 'smooth' })}
                />
              ))}
            </div>

            <div className="r44-engine__cost-slot">
              <Reveal delay={0.3}>
                <div className="r44-engine__cost">
                  <div className="r44-engine__cost-header">
                    <span className="r44-pre-text">Real-World Operating Cost</span>
                    <h3>Roughly <span className="r44-engine__cost-accent">£170–£230 per hour</span> direct operating cost</h3>
                  </div>
                  <p className="r44-engine__cost-lead">
                    Robinson publishes an Estimated Operating Cost sheet for every R44
                    variant each year, and the figures line up with what owners actually
                    see on the invoice. Fuel is the single largest line, overhaul reserves
                    are fixed and published, and parts availability through the global
                    dealer network keeps AOG time short. All of which is why the R44 is
                    the most straightforward piston helicopter on the market to budget,
                    finance and run.
                  </p>
                  <ul className="r44-engine__cost-list">
                    <li><i className="fas fa-gas-pump"></i><span>~15 US gal/hr fuel burn, the dominant line item</span></li>
                    <li><i className="fas fa-tools"></i><span>Predictable reserves for overhaul &amp; maintenance</span></li>
                    <li><i className="fas fa-infinity"></i><span>Global parts availability, any field, any country</span></li>
                  </ul>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 10: R44VariantComparison - Detailed Comparison Table
// ============================================================================
function R44VariantComparison() {
  const comparisonColumns = [
    { key: 'ravenI',  name: 'Raven I',  tag: 'Original',     image: 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RAVEN_I_LEFT_new1_57d295b1fd.png' },
    { key: 'ravenII', name: 'Raven II', tag: 'Standard',     image: 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/RAVEN_II_LEFT_v2_new1_06c267b7a0.png' },
    { key: 'cadet',   name: 'Cadet',    tag: 'Trainer',      image: 'https://robinsonstrapistorprod.blob.core.windows.net/uploads/assets/CADET_LEFT_V3_new1_dad7a93887.png' },
    { key: 'clipper', name: 'Clipper',  tag: 'Amphibious',   image: 'https://configurator.robinsonheli.com/assets/images/helicopters/r44-clipper-ii-popout/CLIPPER-POPOUT-LEFT-V2.png' },
  ];

  const [selectedKeys, setSelectedKeys] = useState([]);
  const toggleKey = (key) => {
    setSelectedKeys((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };
  const selectedColumns = comparisonColumns.filter((c) => selectedKeys.includes(c.key));
  const hasSelection = selectedColumns.length > 0;

  const comparisonRows = [
    { label: 'Introduced', key: 'introduced' },
    { label: 'Engine', key: 'engine' },
    { label: 'Fuel System', key: 'fuelSystem' },
    { label: 'Power', key: 'power' },
    { label: 'Max Gross Weight', key: 'maxGrossWeight' },
    { label: 'Rotor Blades', key: 'blades' },
    { label: 'Hot/High Performance', key: 'altitudePerformance' },
    { label: 'Configuration', key: 'configuration', fallback: '4-seat standard' },
    { label: 'Best For', key: 'bestFor' },
  ];

  return (
    <section className="r44-comparison">
      <div className="r44-comparison__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Technical Comparison</span>
            <h2>
              <span className="r44-text--dark">Every R44,</span>{' '}
              <span className="r44-text--mid">Side By Side</span>
            </h2>
            <p>
              Five variants, one airframe. Use this comparison to land on the R44
              that fits your mission. Then talk to HQ Aviation about ordering one
              direct from Robinson.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="r44-comparison__picker">
            <div className="r44-comparison__picker-label">
              <span>Select variants to compare</span>
              {hasSelection && (
                <button
                  type="button"
                  className="r44-comparison__picker-clear"
                  onClick={() => setSelectedKeys([])}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="r44-comparison__picker-grid">
              {comparisonColumns.map((col) => {
                const active = selectedKeys.includes(col.key);
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => toggleKey(col.key)}
                    className={`r44-comparison__picker-card${active ? ' r44-comparison__picker-card--active' : ''}`}
                    aria-pressed={active}
                  >
                    <span className="r44-comparison__picker-check" aria-hidden="true">
                      {active && <i className="fas fa-check"></i>}
                    </span>
                    <span className="r44-comparison__picker-thumb">
                      <img src={col.image} alt="" loading="lazy" width={1920} height={1080} />
                    </span>
                    <span className="r44-comparison__picker-text">
                      <span className="r44-comparison__picker-name">{col.name}</span>
                      <span className="r44-comparison__picker-tag">{col.tag}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {hasSelection && (
          <Reveal delay={0.2}>
            <div className="r44-comparison__table-wrapper">
              <table className="r44-comparison__table">
                <thead>
                  <tr>
                    <th className="r44-comparison__header-label">Specification</th>
                    {selectedColumns.map((col) => (
                      <th
                        key={col.key}
                        className="r44-comparison__header-variant"
                      >
                        <span className="r44-comparison__variant-name">{col.name}</span>
                        <span className="r44-comparison__variant-tag">{col.tag}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i}>
                      <td className="r44-comparison__row-label">{row.label}</td>
                      {selectedColumns.map((col) => {
                        const value = variantComparison[col.key][row.key] || row.fallback || '—';
                        return (
                          <td
                            key={col.key}
                            className="r44-comparison__cell"
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
}


// ============================================================================
// COMPONENT 11: R44Variants - Model Variants Section
// ============================================================================
function R44Variants() {
  const [activeVariant, setActiveVariant] = useState(0);
  const [configuratorActive, setConfiguratorActive] = useState(false);

  return (
    <section className="r44-variants">
      <div className="r44-variants__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Configurations</span>
            <h2>
              <span className="r44-text--dark">R44</span>{' '}
              <span className="r44-text--mid">Variants</span>
            </h2>
          </div>
        </Reveal>

        {configuratorActive ? (
          <div className="r44-variants__configurator">
            <div className="r44-variants__configurator-meta">
              <button
                type="button"
                className="r44-variants__configurator-back"
                onClick={() => setConfiguratorActive(false)}
                aria-label="Return to variant selector"
              >
                <i className="fas fa-arrow-left" aria-hidden="true" />
                <span>Back to Variants</span>
              </button>
              <span className="r44-variants__configurator-active">
                Configuring <strong>R44 {r44Variants[activeVariant].name}</strong>
              </span>
            </div>
            <iframe
              key={`r44-cfg-${activeVariant}`}
              className="r44-variants__configurator-frame"
              src={r44ConfiguratorUrl(activeVariant)}
              title={`Robinson R44 ${r44Variants[activeVariant].name} Configurator`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="fullscreen"
            />
          </div>
        ) : (
        <LayoutGroup id="r44-variants">
          <div className="r44-variants__card">
            <div className="r44-variants__tabs">
              {r44Variants.map((variant, i) => (
                <button
                  key={i}
                  className={`r44-variants__tab ${activeVariant === i ? 'active' : ''}`}
                  onClick={() => setActiveVariant(i)}
                >
                  {activeVariant !== i && (
                    <motion.span
                      className="r44-variants__tab-thumb"
                      aria-hidden="true"
                      layoutId={`r44-variant-img-${i}`}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img src={variant.image} alt="" loading="lazy" width={1920} height={1080} />
                    </motion.span>
                  )}
                  <motion.span
                    className="r44-variants__tab-label"
                    layout
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="r44-variants__tab-sub">{variant.subtitle}</span>
                    <span className="r44-variants__tab-name">{variant.name}</span>
                  </motion.span>
                </button>
              ))}
            </div>

            <div className="r44-variants__content">
              <div className="r44-variants__image">
                <div className="r44-variants__image-headline">
                  <div className="r44-variants__image-headline-inner">
                    <span className="r44-variants__eyebrow">{r44Variants[activeVariant].subtitle}</span>
                    <h3>R44 {r44Variants[activeVariant].name}</h3>
                    <p className="r44-variants__tagline">{r44Variants[activeVariant].tagline}</p>
                    <div className="r44-variants__divider" />
                  </div>
                </div>
                <motion.span
                  key={activeVariant}
                  className="r44-variants__image-inner"
                  layoutId={`r44-variant-img-${activeVariant}`}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={r44Variants[activeVariant].image}
                    alt={`${r44Variants[activeVariant].name} configuration`}
                    width={1920}
                    height={1080}
                  />
                </motion.span>
                <div className="r44-variants__use-case-tags">
                  {r44Variants[activeVariant].useCases.map((uc, i) => (
                    <span key={i} className="r44-variants__use-case-tag">{uc}</span>
                  ))}
                </div>
              </div>

              <div className="r44-variants__info">
                <div className="r44-variants__info-left">
                  <p className="r44-variants__description">{r44Variants[activeVariant].description}</p>
                  {r44Variants[activeVariant].pdfs && (
                    <div className="r44-variants__pdfs">
                      {r44Variants[activeVariant].pdfs.brochure && (
                        <a
                          href={r44Variants[activeVariant].pdfs.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="r44-variants__pdf-pill"
                        >
                          <i className="fas fa-file-pdf" aria-hidden="true"></i>
                          <span>Brochure</span>
                        </a>
                      )}
                      {r44Variants[activeVariant].pdfs.eoc && (
                        <a
                          href={r44Variants[activeVariant].pdfs.eoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="r44-variants__pdf-pill"
                        >
                          <i className="fas fa-file-pdf" aria-hidden="true"></i>
                          <span>Operating Costs</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="r44-variants__info-right">
                  <ul className="r44-variants__features">
                    {r44Variants[activeVariant].features.map((feature, i) => (
                      <li key={i}>
                        <span className="r44-variants__feature-icon" aria-hidden="true">
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

        <div className="r44-variants__cta">
          {!configuratorActive ? (
            <button
              type="button"
              className="r44-variants__cta-button"
              onClick={() => setConfiguratorActive(true)}
              aria-label={`Launch the Robinson configurator for the R44 ${r44Variants[activeVariant].name}`}
            >
              Launch Configurator
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          ) : (
            <a href="#enquire" className="r44-variants__cta-button">
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
// COMPONENT 11B: R44Expedition - "Proven in the Field" Carousel
// ============================================================================
function R44Expedition() {
  const [index, setIndex] = useState(0);
  const total = r44ExpeditionSlides.length;
  const slide = r44ExpeditionSlides[index];
  const go = (dir) => setIndex((i) => (i + dir + total) % total);

  return (
    <section className="r44-expedition">
      <div className="r44-expedition__container">
        <div className="r44-expedition__content">
          <h2 className="r44-expedition__title">Proven in the Field</h2>

          <div className="r44-expedition__carousel">
            <button
              type="button"
              className="r44-expedition__chevron r44-expedition__chevron--prev"
              onClick={() => go(-1)}
              aria-label="Previous expedition"
            >
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
                <path d="M12 2L2 11l10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="r44-expedition__image" key={slide.image + index}>
              <img src={slide.image} alt={slide.alt} width={1500} height={1000} loading="lazy" />
            </div>

            <button
              type="button"
              className="r44-expedition__chevron r44-expedition__chevron--next"
              onClick={() => go(1)}
              aria-label="Next expedition"
            >
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
                <path d="M2 2l10 9-10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="r44-expedition__dots" role="tablist" aria-label="Expedition slides">
            {r44ExpeditionSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to expedition ${i + 1}`}
                className={`r44-expedition__dot${i === index ? ' r44-expedition__dot--active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <div className="r44-expedition__rule" />

          <div className="r44-expedition__copy" key={index}>
            {slide.paragraphs.map((p, i) => (
              <p key={i} className="r44-expedition__lead">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 12: R44ExpeditionsMap - Visual Route Display
// ============================================================================
function R44ExpeditionsMap() {
  const pageImages = usePageImages('r44');
  const cmsMapImgs = pageImages['r44-expeditions-map'] ?? SECTION_MAP['r44-expeditions-map'].images;

  return (
    <section className="r44-expeditions-map" data-cms-section="r44-expeditions-map">
      <div className="r44-expeditions-map__container">
        <Reveal>
          <div className="r44-section-header">
            <span className="r44-pre-text">Where R44 Has Flown</span>
            <h2>
              <span className="r44-text--dark">Expedition</span>{' '}
              <span className="r44-text--mid">Routes</span>
            </h2>
            <p>
              Captain Q has taken the R44 to every corner of the globe, proving
              its capability in the most demanding environments on Earth.
            </p>
          </div>
        </Reveal>

        <div className="r44-expeditions-map__visual">
          <Reveal delay={0.2}>
            <div className="r44-expeditions-map__globe">
              <img
                src={cmsMapImgs[0]?.url || '/assets/images/expeditions/antartica.jpg'}
                alt="Antarctic Expedition"
                className="r44-expeditions-map__image"
                width={2500}
                height={1657}
                loading="lazy"
              />
              <div className="r44-expeditions-map__routes">
                {expeditionRoutes.map((route, i) => (
                  <motion.div
                    key={i}
                    className="r44-expeditions-map__route"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="r44-expeditions-map__route-marker" />
                    <div className="r44-expeditions-map__route-info">
                      <h4>{route.name}</h4>
                      <span className="r44-expeditions-map__route-year">{route.year}</span>
                      <span className="r44-expeditions-map__route-coords">{route.coords}</span>
                      <span className="r44-expeditions-map__route-distance">{route.distance}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="r44-expeditions-map__images">
          <Reveal delay={0.3}>
            <div className="r44-expeditions-map__image-grid">
              <motion.div
                className="r44-expeditions-map__image-item"
                whileHover={{ scale: 1.03 }}
              >
                <img src={cmsMapImgs[1]?.url || '/assets/images/expeditions/north-pole.jpg'} alt="North Pole" width={1840} height={1232} loading="lazy" />
                <span>North Pole - 90.0000°N</span>
              </motion.div>
              <motion.div
                className="r44-expeditions-map__image-item"
                whileHover={{ scale: 1.03 }}
              >
                <img src={cmsMapImgs[2]?.url || '/assets/images/used-aircraft/r44/r44-south-pole.jpg'} alt="South Pole" width={2500} height={1657} loading="lazy" />
                <span>South Pole - 90.0000°S</span>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 13: R44Gallery - Image Gallery
// ============================================================================
function R44Gallery() {
  const pageImages = usePageImages('r44');
  const cmsGallery = (pageImages['r44-gallery'] ?? SECTION_MAP['r44-gallery'].images).map(img => img.url);

  return (
    <section className="r44-gallery" data-cms-section="r44-gallery">
      <Reveal>
        <div className="r44-section-header r44-section-header--centered">
          <span className="r44-pre-text">Gallery</span>
          <h2>
            <span className="r44-text--dark">The</span>{' '}
            <span className="r44-text--mid">R44</span>{' '}
            <span className="r44-text--light">In Action</span>
          </h2>
        </div>
      </Reveal>

      <div className="r44-gallery__grid">
        {cmsGallery.map((img, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <motion.div
              className={`r44-gallery__item r44-gallery__item--${i + 1}`}
              whileHover={{ scale: 1.02 }}
            >
              <img src={img} alt={`R44 Gallery ${i + 1}`} width={800} height={600} loading="lazy" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT 14: R44CTA - Call to Action
// ============================================================================
function R44Select({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="r44-select" ref={ref}>
      <button type="button" className="r44-select__trigger" onClick={() => setOpen((o) => !o)}>
        <span>{selected.label}</span>
        <svg className={`r44-select__chevron${open ? ' r44-select__chevron--open' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="r44-select__menu">
          {options.map((o) => (
            <li
              key={o.value}
              className={`r44-select__option${o.value === value ? ' r44-select__option--active' : ''}`}
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

const r44CtaContent = {
  preText: 'OWN THE WORLD\u2019S BEST-SELLER',
  preTextShort: 'OWNERSHIP',
  headingDark: 'Ready to',
  headingLight: 'Experience the R44?',
  lead: "The world's best-selling general aviation helicopter every year since 1999, with direct operating cost below \u00a3230/hr, global parts availability and Robinson's proven Lycoming IO-540 powertrain. Speak with our sales team about new orders, trade-ins, finance and ownership packages.",
  benefits: [
    { icon: 'fa-helicopter',      text: 'Configure Your Ideal R44 Variant' },
    { icon: 'fa-handshake',       text: 'Direct Consultation With Sales Team' },
    { icon: 'fa-shield-alt',      text: 'Factory Warranty & Denham Support' },
    { icon: 'fa-plane-departure', text: 'Demo Flight at Denham Aerodrome' },
  ],
  formTitle: 'Enquire About Aircraft',
  selectOptions: [
    { value: 'purchase',    label: 'Interested in Purchasing' },
    { value: 'demo',        label: 'Request a Demo Flight' },
    { value: 'information', label: 'Requesting Information' },
    { value: 'trade-in',    label: 'Trade-In Against Used Stock' },
    { value: 'other',       label: 'Other Inquiry' },
  ],
  selectDefault: 'purchase',
};

function R44CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: r44CtaContent.selectDefault,
    message: '',
  });
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const interestLabel = r44CtaContent.selectOptions.find((o) => o.value === formData.interest)?.label || formData.interest;
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
          subject: 'R44 Enquiry',
          message: messageParts.join('\n'),
          source: 'R44 Enquiry',
        }),
      });
      setFormStatus(res.ok ? 'success' : 'error');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <section id="enquire" className="r44-cta">
      <div className="r44-cta__container">
        <div className="r44-cta__content">
          <Reveal>
            <div className="r44-section-header">
              <span className="r44-pre-text r44-pre-text--light">
                <span className="r44-pre-text__full">{r44CtaContent.preText}</span>
                <span className="r44-pre-text__short">{r44CtaContent.preTextShort}</span>
              </span>
              <h2>
                <span style={{ color: '#fff' }}>{r44CtaContent.headingDark}</span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{r44CtaContent.headingLight}</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="r44-cta__lead">{r44CtaContent.lead}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="r44-cta__benefits-card">
              <div className="r44-cta__benefits">
                {r44CtaContent.benefits.map((b, i) => (
                  <div key={i} className="r44-cta__benefit">
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
            <div className="r44-cta__form r44-cta__success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p>Thank you for your enquiry! Our team will contact you shortly.</p>
            </div>
          ) : (
            <form className="r44-cta__form" onSubmit={handleSubmit}>
              <h3>{r44CtaContent.formTitle}</h3>
              <div className="r44-cta__form-group">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="r44-cta__form-group">
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="r44-cta__form-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="r44-cta__form-group">
                <R44Select
                  value={formData.interest}
                  onChange={(val) => setFormData({ ...formData, interest: val })}
                  options={r44CtaContent.selectOptions}
                />
              </div>
              <div className="r44-cta__form-group">
                <textarea
                  placeholder="Additional Comments"
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              {formStatus === 'error' && (
                <p className="r44-cta__error">
                  Something went wrong. Please try again or email{' '}
                  <a href="mailto:sales@hqaviation.com">sales@hqaviation.com</a>
                </p>
              )}
              <button
                type="submit"
                className="r44-btn r44-btn--submit"
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
        <div className="r44-cta__contact">
          <div className="r44-cta__contact-inner">
            <div className="r44-cta__contact-item">
              <i className="fas fa-phone"></i>
              <span>+44 1895 833 373</span>
            </div>
            <div className="r44-cta__contact-item">
              <i className="fas fa-envelope"></i>
              <span>sales@hqaviation.com</span>
            </div>
            <div className="r44-cta__contact-item">
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
// MAIN R44 PAGE COMPONENT
// ============================================================================
function AircraftR44() {
  useCmsHighlight();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="r44">
      <Seo
        title="Robinson R44 for Sale · UK Dealer"
        description="Buy a new Robinson R44 Raven I, II or Cadet from HQ Aviation at Denham, 30 min from London — Robinson authorised dealer, service center, CAA Part-145."
        ogImage="/assets/images/used-aircraft/r44/r44-raven-ii-grrob.jpg"
        jsonLd={[
          buildProduct({
            name: 'Robinson R44 Raven II',
            description: 'New Robinson R44 Raven I, Raven II and Cadet — four-seat Lycoming piston helicopters.',
            image: '/og-default.jpg',
            brand: 'Robinson Helicopter Company',
            url: '/aircraft/r44',
          }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'New Aircraft Sales', path: '/sales/new' },
            { name: 'Robinson R44', path: '/aircraft/r44' },
          ]),
        ]}
      />
      <h1 style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Robinson R44 Raven I, II & Cadet — United Kingdom UK Authorised Dealer
      </h1>
      <R44Header />
      <R44Hero />
      <R44Intro />
      <R44Variants />
      <R44Specs />
      <R44Engine />
      <R44VariantComparison />
      <R44ExpeditionsMap />
      <R44Gallery />
      <R44CTA />
      <FooterMinimal />

      {/* ================================================================== */}
      {/* STYLES */}
      {/* ================================================================== */}
      <style>{`
        /* ===== BASE STYLES ===== */
        .r44 {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
        }

        .r44-pre-text {
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }

        .r44-pre-text--light {
          color: rgba(255,255,255,0.6);
        }

        .r44-text--dark { color: #1a1a1a; }
        .r44-text--mid { color: #4a4a4a; }
        .r44-text--light { color: #7a7a7a; }
        .r44-text--white { color: #ffffff; }
        .r44-text--light-inv { color: rgba(255,255,255,0.6); }

        .r44-section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 2.5rem;
        }

        .r44-section-header--left {
          text-align: left;
          margin: 0 0 2rem;
        }

        .r44-section-header--centered {
          text-align: center;
        }

        .r44-section-header h2 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.1;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .r44-section-header p {
          color: #666;
          font-size: 1rem;
          line-height: 1.7;
        }

        /* ===== BUTTONS ===== */
        .r44-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .r44-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .r44-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .r44-btn--light {
          background: #fff;
          color: #1a1a1a;
        }

        .r44-btn--light:hover {
          background: #f0f0f0;
        }

        .r44-btn--outline-light {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }

        .r44-btn--outline-light:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        /* ===== HERO ===== */
        .r44-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%);
        }

        .r44-hero__bg {
          position: absolute;
          right: -5%;
          bottom: 10%;
          width: 65%;
          z-index: 1;
          opacity: 0.9;
        }

        .r44-hero__bg img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .r44-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(250,249,246,1) 0%, rgba(250,249,246,0.9) 40%, rgba(250,249,246,0.3) 70%, transparent 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        }

        .r44-hero__content {
          position: relative;
          z-index: 3;
          padding: 8rem 4rem 4rem;
          max-width: 650px;
        }

        .r44-hero__label {
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: #888;
          display: block;
          margin-bottom: 1rem;
        }

        .r44-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
          margin-bottom: 1.5rem;
        }

        .r44-hero__word {
          font-weight: 700;
          font-size: clamp(3rem, 10vw, 6rem);
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .r44-hero__word--1 { color: #1a1a1a; }
        .r44-hero__word--2 { color: #4a4a4a; }

        .r44-hero__divider {
          width: 80px;
          height: 3px;
          background: #1a1a1a;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .r44-hero__sub {
          font-size: 1rem;
          color: #666;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .r44-hero__badges {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .r44-hero__badge {
          text-align: center;
        }

        .r44-hero__badge-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .r44-hero__badge-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
        }

        .r44-hero__badge-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(26,26,26,0.3), transparent);
        }

        .r44-hero__scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .r44-hero__scroll span {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26,26,26,0.5);
        }

        .r44-hero__scroll-line {
          width: 1px;
          height: 50px;
          background: rgba(26,26,26,0.2);
          position: relative;
          overflow: hidden;
        }

        .r44-hero__scroll-dot {
          position: absolute;
          width: 100%;
          height: 30%;
          background: #1a1a1a;
          animation: scrollDot 2s ease-in-out infinite;
        }

        @keyframes scrollDot {
          0% { top: -30%; }
          100% { top: 100%; }
        }

        /* ===== INTRO ===== */
        .r44-intro {
          /* Sticky at end: pins when its bottom reaches the viewport bottom,
             so the next section rises up over it (stacking card effect).
             --r44-intro-stick-top is set in JS to (viewportH - introH). */
          position: sticky;
          top: var(--r44-intro-stick-top, 0);
          /* No explicit z-index — later siblings paint over the pinned intro
             in source order, giving the "rise up" effect. */
          padding: 3rem 2rem 5rem;
          background: linear-gradient(to right, rgba(236, 236, 236, 0.82) 50%, rgba(250, 249, 246, 0.82) 50%);
          backdrop-filter: blur(24px) saturate(1.05);
          -webkit-backdrop-filter: blur(24px) saturate(1.05);
          /* Scroll-linked blur; darken lands via ::after overlay so we end on
             a solid dark frame (an opacity fade alongside the overlay would
             cancel itself out at progress=1). */
          filter: blur(var(--r44-intro-blur, 0px));
        }

        /* Dark overlay that fades in as specs rises, so intro visually turns
           into a near-black panel before specs physically covers it. */
        .r44-intro::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #0a0a0a 50%, #000 50%);
          opacity: var(--r44-intro-darken, 0);
          pointer-events: none;
          z-index: 2;
        }

        .r44-intro::before {
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

        .r44-intro__container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .r44-intro__content { order: 2; }
        .r44-intro__right  { order: 1; margin-top: 4rem; }

        @media (min-width: 901px) {
          .r44-intro__content {
            position: sticky;
            top: max(10vh, var(--catch-top, 90px));
          }
        }

        .r44-intro__divider {
          width: 60px;
          height: 1px;
          background: rgba(0, 0, 0, 0.15);
          margin: 2.5rem auto;
        }

        .r44-intro__headline {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          text-transform: uppercase;
          margin: 0.5rem 0 1.5rem;
        }

        .r44-intro__text {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .r44-intro__image {
          border-radius: 8px;
          overflow: hidden;
          background: #faf9f6;
        }
        .r44-intro__image img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .r44-intro__cta-line {
          margin-top: 1.75rem !important;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          color: #1a1a1a !important;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .r44-intro__container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .r44-intro__content { order: 1; text-align: center; }
          .r44-intro__right   { order: 2; margin-top: 0; }
          .r44-intro::before  { display: none; }
        }

        /* ===== HISTORY TIMELINE ===== */
        .r44-timeline {
          padding: 0;
          background: transparent;
        }

        .r44-timeline__container {
          max-width: 100%;
          margin: 0 auto;
        }

        .r44-timeline__track {
          position: relative;
          margin-top: 2rem;
        }

        .r44-timeline__line {
          position: absolute;
          left: 24px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #ddd;
        }

        .r44-timeline__line-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #1a1a1a;
        }

        .r44-timeline__item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .r44-timeline__marker {
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

        .r44-timeline__item--completed .r44-timeline__marker {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        .r44-timeline__item--active .r44-timeline__marker {
          background: #fff;
          border-color: #1a1a1a;
          border-width: 3px;
        }

        .r44-timeline__pulse {
          width: 12px;
          height: 12px;
          background: #1a1a1a;
          border-radius: 50%;
          animation: r44-timeline-pulse 2s infinite;
        }

        @keyframes r44-timeline-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        .r44-timeline__dot {
          width: 8px;
          height: 8px;
          background: #ddd;
          border-radius: 50%;
        }

        .r44-timeline__content {
          padding-top: 0.5rem;
        }

        .r44-timeline__year {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          background: #1a1a1a;
          color: #fff;
          padding: 0.25rem 0.75rem;
          margin-bottom: 0;
        }

        .r44-timeline__item--upcoming .r44-timeline__year {
          background: #ddd;
          color: #666;
        }

        .r44-timeline__text {
          margin-top: 0;
          padding-top: 12px;
        }

        .r44-timeline__content h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }

        .r44-timeline__highlight {
          color: #a67b3f;
          font-weight: 600;
        }

        .r44-timeline__content p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }

        /* ===== PROVEN IN THE FIELD (R44 EXPEDITION CAROUSEL) ===== */
        .r44-expedition {
          padding: 4rem 0 0;
          background: transparent;
        }

        @media (min-width: 901px) {
          .r44-expedition {
            padding-top: 0;
          }
        }

        .r44-expedition__container {
          max-width: 100%;
          margin: 0 auto;
          background: #fff;
          border-radius: 10px;
          border: 1px solid #e8e6e2;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        .r44-expedition__content {
          display: flex;
          flex-direction: column;
        }

        .r44-expedition__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 1rem;
          letter-spacing: -0.01em;
          text-align: center;
        }

        .r44-expedition__carousel {
          position: relative;
          margin: 1rem 0 0.75rem;
        }

        .r44-expedition__image {
          border-radius: 6px;
          overflow: hidden;
          aspect-ratio: 5 / 2;
          animation: r44-expedition-fade 0.45s ease;
        }
        .r44-expedition__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 6px;
        }

        @keyframes r44-expedition-fade {
          from { opacity: 0; transform: scale(1.015); }
          to   { opacity: 1; transform: scale(1); }
        }

        .r44-expedition__chevron {
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
        .r44-expedition__chevron:hover,
        .r44-expedition__chevron:focus-visible {
          background: rgba(10, 10, 10, 0.7);
          border-color: #fff;
          transform: translateY(-50%) scale(1.06);
          outline: none;
        }
        .r44-expedition__chevron:active {
          transform: translateY(-50%) scale(0.96);
        }
        .r44-expedition__chevron svg {
          display: block;
          width: 12px;
          height: 18px;
        }
        .r44-expedition__chevron--prev { left: 0.75rem; }
        .r44-expedition__chevron--next { right: 0.75rem; }

        .r44-expedition__dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 0 0 1rem;
        }
        .r44-expedition__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 0;
          padding: 0;
          background: #d8d4cc;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .r44-expedition__dot:hover { background: #b8b2a7; }
        .r44-expedition__dot--active {
          background: #1a1a1a;
          transform: scale(1.15);
        }

        .r44-expedition__rule {
          width: 100%;
          height: 1px;
          background: #e8e6e2;
          margin-bottom: 1.25rem;
        }

        .r44-expedition__copy {
          animation: r44-expedition-fade 0.45s ease;
        }

        .r44-expedition__lead {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 0 1.25rem;
        }
        .r44-expedition__lead:last-child { margin-bottom: 0; }

        /* ===== SPECS ===== */
        .r44-specs {
          position: relative;
          padding: 8rem 2rem 5rem;
          background: linear-gradient(to right, #000 50%, #1c1c1c 50%);
          color: #fff;
        }

        @media (min-width: 901px) {
          .r44-specs::before {
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

        .r44-specs__container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }

        .r44-specs__split {
          display: block;
        }

        @media (min-width: 901px) {
          .r44-specs__split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
          }

          .r44-specs__split-left,
          .r44-specs__split-right {
            min-width: 0;
          }

          .r44-specs__split-left {
            position: sticky;
            /* Sit below the sticky counter (height published at runtime). */
            top: calc(max(10vh, var(--catch-top, 90px)) + var(--r44-counter-h, 80px));
          }

          .r44-specs__split-left .r44-specs__columns {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .r44-specs__split-right .r44-proven__grid {
            grid-template-columns: 1fr;
          }

          .r44-specs__split-right .r44-proven__stats-bar {
            flex-wrap: wrap;
            gap: 1.25rem 1.5rem;
            padding: 1.75rem 1.25rem;
            margin-top: 0;
            margin-bottom: 0;
          }

          .r44-specs__split-right .r44-proven__stat {
            flex: 1 1 auto;
            min-width: 0;
          }

          .r44-specs__split-right .r44-proven__stat-value {
            font-size: 1.5rem;
          }

          .r44-specs__split-right .r44-proven__stat-label {
            white-space: normal;
          }

          .r44-specs__split-right .r44-proven__stat-divider {
            display: none;
          }

          .r44-specs__split-right .r44-specs__cell {
            min-width: 0;
            word-break: break-word;
          }
        }

        .r44-specs__split-divider {
          width: 60px;
          height: 1px;
          background: rgba(255,255,255,0.15);
          margin: 2.5rem auto;
        }

        .r44-specs .r44-pre-text { color: rgba(255,255,255,0.5); }
        .r44-specs .r44-text--dark { color: #fff; }
        .r44-specs .r44-text--mid { color: rgba(255,255,255,0.5); }

        .r44-specs__columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: stretch;
          margin-top: 2rem;
        }

        @media (max-width: 900px) {
          .r44-specs__columns {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .r44-specs__right { order: 2; }
          .r44-specs__table { order: 1; }
        }

        .r44-specs__model-switcher {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0 0.5rem 0.6rem;
        }

        .r44-specs__model-chevron {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .r44-specs__model-chevron:hover {
          background: #fff;
          color: #1a1a1a;
          border-color: #fff;
        }

        .r44-specs__model-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 0;
        }

        .r44-specs__model-eyebrow {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.25rem;
        }

        .r44-specs__model-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.35rem;
          font-weight: 500;
          color: #fff;
          line-height: 1.1;
        }

        .r44-specs__table {
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          margin-top: 0;
          display: flex;
          flex-direction: column;
        }

        .r44-specs__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .r44-specs__row:last-child {
          border-bottom: none;
        }

        .r44-specs__row--header {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .r44-specs__row--header .r44-specs__cell {
          font-weight: 600;
          font-size: 0.8rem;
        }

        .r44-specs__cell {
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .r44-specs__row:not(.r44-specs__row--header) .r44-specs__cell:first-child {
          border-right: 1px solid rgba(255,255,255,0.18);
        }

        .r44-specs__cell--label {
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
        }

        .r44-specs__row:nth-child(even) .r44-specs__cell:not(.r44-specs__cell--label) {
          background: rgba(255,255,255,0.03);
        }

        .r44-specs__cell--highlighted {
          position: relative;
          font-weight: 600;
          color: #fff;
        }

        .r44-specs__cell--highlighted::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #fff;
        }

        .r44-specs__right {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .r44-specs__blueprint-card {
          flex: 1;
          display: flex;
          align-items: center;
          border: 1px solid #fff;
          border-radius: 8px;
          padding: 1px;
        }

        .r44-specs__blueprint {
          width: 100%;
          display: block;
          border-radius: 6px;
          filter: invert(1);
        }

        .r44-specs__overlay-data {
          display: flex;
          justify-content: space-around;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.5rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .r44-specs__overlay-item {
          text-align: center;
        }

        .r44-specs__overlay-item span:first-child {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.25rem;
        }

        .r44-specs__overlay-item span:last-child {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #fff;
        }

        /* ===== PROVEN (inside specs section) ===== */
        .r44-proven__stats-bar {
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

        .r44-proven__stat {
          text-align: center;
        }

        .r44-proven__stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 600;
          color: #fff;
        }

        .r44-proven__stat-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-top: 0.25rem;
          white-space: nowrap;
        }

        .r44-proven__stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.15);
        }

        .r44-proven__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 3rem;
        }

        .r44-proven__grid > * {
          display: flex;
          height: 100%;
        }

        .r44-proven__card {
          padding: 1.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }

        .r44-proven__card:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.07);
        }

        .r44-proven__card-icon {
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

        .r44-proven__card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 0.75rem;
        }

        .r44-proven__card p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }

        @media (max-width: 768px) {
          .r44-proven__stats-bar {
            flex-wrap: wrap;
            gap: 2rem;
          }
          .r44-proven__stat-divider {
            display: none;
          }
        }

        /* ===== CAPTAIN Q SECTION ===== */
        .r44-captain-q {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .r44-captain-q__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .r44-captain-q__bg img {
          width: 100%;
          height: 120%;
          object-fit: cover;
          object-position: center;
        }

        .r44-captain-q__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 100%);
        }

        .r44-captain-q__content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 3rem;
        }

        .r44-captain-q__title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
          line-height: 1.1;
        }

        .r44-captain-q__intro {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
          max-width: 700px;
          margin-bottom: 3rem;
        }

        .r44-captain-q__achievements {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .r44-captain-q__achievement {
          padding: 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .r44-captain-q__achievement-stat {
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .r44-captain-q__achievement-title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0 0 0.5rem;
        }

        .r44-captain-q__achievement-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
          margin: 0;
        }

        .r44-captain-q__quote {
          max-width: 800px;
          padding: 2rem 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin: 0 0 2rem;
        }

        .r44-captain-q__quote p {
          font-size: 1.25rem;
          font-style: italic;
          color: rgba(255,255,255,0.9);
          line-height: 1.8;
          margin: 0 0 1rem;
        }

        .r44-captain-q__quote cite {
          font-size: 0.85rem;
          font-style: normal;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .r44-captain-q__cta {
          display: flex;
          gap: 1rem;
        }

        /* ===== VARIANTS ===== */
        .r44-variants {
          /* Must rise above every pinned/sticky section that precedes it
             (especially .r44-counter at z-index:45 which otherwise paints on
             top of static later siblings). A relative position + higher
             z-index creates a stacking context that sits above the rest. */
          position: relative;
          z-index: 50;
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r44-variants__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-variants .r44-section-header {
          margin-bottom: 3rem;
        }

        .r44-variants__card {
          position: relative;
          margin-top: 3rem;
          padding: 0;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .r44-variants__card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #1a1a1a;
        }

        .r44-variants__tabs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          margin: 0;
          padding: 0;
          background: #fbfaf7;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .r44-variants__tab {
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

        .r44-variants__tab:last-child { border-right: none; }

        .r44-variants__tab::after {
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

        .r44-variants__tab:hover {
          background: #f6f3ed;
          color: #1a1a1a;
        }

        .r44-variants__tab:hover .r44-variants__tab-thumb img {
          filter: grayscale(0%);
          opacity: 1;
        }

        .r44-variants__tab.active {
          background: #ffffff;
          color: #1a1a1a;
          justify-content: center;
        }

        .r44-variants__tab.active::after {
          transform: scaleX(1);
        }

        .r44-variants__tab-thumb {
          display: block;
          width: 100%;
          height: 72px;
          overflow: hidden;
          pointer-events: none;
        }

        .r44-variants__tab-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          filter: grayscale(60%);
          opacity: 0.65;
          transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
        }

        .r44-variants__tab.active .r44-variants__tab-thumb img {
          filter: grayscale(0%);
          opacity: 1;
        }

        .r44-variants__tab-label {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          line-height: 1.2;
          min-width: 0;
          width: 100%;
        }

        .r44-variants__tab-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9a9a9a;
        }

        .r44-variants__tab.active .r44-variants__tab-sub {
          color: #1a1a1a;
        }

        .r44-variants__tab-name {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: inherit;
        }

        .r44-variants__content {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 0;
        }

        .r44-variants__image {
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

        .r44-variants__image::before {
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

        .r44-variants__image-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 55%;
          max-width: 560px;
          height: 300px;
          z-index: 1;
        }

        .r44-variants__image-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
        }

        .r44-variants__image-headline {
          position: absolute;
          top: 50%;
          left: 3rem;
          transform: translateY(-50%);
          z-index: 3;
          pointer-events: none;
          width: 40%;
          max-width: 420px;
        }

        .r44-variants__image-headline-inner {
          display: block;
        }

        .r44-variants__image-headline .r44-variants__eyebrow {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #a67b3f;
          margin-bottom: 1rem;
        }

        .r44-variants__image-headline h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #111111;
          margin: 0 0 0.75rem;
        }

        .r44-variants__image-headline .r44-variants__tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-style: italic;
          color: #8a8a8a;
          margin: 0 0 1.25rem;
        }

        .r44-variants__image-headline .r44-variants__divider {
          width: 64px;
          height: 2px;
          background: #a67b3f;
        }

        .r44-variants__info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: stretch;
          padding: 2.75rem 3rem 3rem;
          background: #ffffff;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        .r44-variants__info-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .r44-variants__info-right {
          display: flex;
          flex-direction: column;
        }

        .r44-variants__eyebrow {
          display: inline-block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .r44-variants__info h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 500;
          line-height: 1.1;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
          letter-spacing: -0.01em;
        }

        .r44-variants__tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-style: italic;
          color: #7a7a7a;
          margin: 0 0 1.25rem;
          letter-spacing: 0.01em;
        }

        .r44-variants__divider {
          width: 50px;
          height: 2px;
          background: #1a1a1a;
          margin: 0 0 1.5rem;
          border-radius: 2px;
        }

        .r44-variants__description {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #555;
          margin: 0;
        }

        .r44-variants__pdfs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }

        .r44-variants__pdf-pill {
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

        .r44-variants__pdf-pill i {
          font-size: 0.85rem;
          color: #c8102e;
          transition: color 0.2s;
        }

        .r44-variants__pdf-pill:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
          transform: translateY(-1px);
        }

        .r44-variants__pdf-pill:hover i {
          color: #fff;
        }

        .r44-variants__use-case-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .r44-variants__image .r44-variants__use-case-tags {
          position: absolute;
          right: 3rem;
          bottom: 1.25rem;
          justify-content: flex-end;
          z-index: 2;
        }

        .r44-variants__use-case-tag {
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

        .r44-variants__features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          gap: 0.6rem;
        }

        .r44-variants__features li {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #4a4a4a;
          padding: 0;
        }

        .r44-variants__feature-icon {
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

        @media (max-width: 1000px) {
          .r44-variants__tabs {
            grid-template-columns: repeat(3, 1fr);
          }
          .r44-variants__tab:nth-child(3n) { border-right: none; }
          .r44-variants__tab:nth-child(n+4) {
            border-top: 1px solid rgba(0,0,0,0.06);
          }
        }

        @media (max-width: 900px) {
          .r44-variants__image {
            min-height: 260px;
            padding: 2rem 1.5rem;
          }
          .r44-variants__info {
            grid-template-columns: 1fr;
            gap: 1.75rem;
            padding: 2.25rem 1.75rem;
          }
        }

        @media (max-width: 700px) {
          .r44-variants__tabs {
            grid-template-columns: 1fr;
          }
          .r44-variants__tab {
            flex-direction: row;
            align-items: center;
            min-height: 0;
            padding: 1rem 1.25rem;
            border-right: none;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            border-top: none;
          }
          .r44-variants__tab:last-child { border-bottom: none; }
          .r44-variants__tab-thumb {
            width: 84px;
            height: 48px;
            flex-shrink: 0;
          }
          .r44-variants__tab::after {
            left: 0;
            right: auto;
            top: 0;
            bottom: 0;
            width: 3px;
            height: auto;
            transform: scaleY(0);
            transform-origin: top center;
          }
          .r44-variants__tab.active::after {
            transform: scaleY(1);
          }
          .r44-variants__features {
            justify-content: flex-start;
            flex: 0 0 auto;
          }
        }

        /* ===== EXPEDITIONS MAP ===== */
        .r44-expeditions-map {
          /* Rises above earlier sticky/pinned sections. See .r44-variants. */
          position: relative;
          z-index: 50;
          padding: 5rem 2rem;
          background: #1a1a1a;
          color: #fff;
        }

        .r44-expeditions-map__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .r44-expeditions-map .r44-section-header h2 span {
          color: #fff;
        }

        .r44-expeditions-map .r44-section-header h2 .r44-text--mid {
          color: rgba(255,255,255,0.6);
        }

        .r44-expeditions-map .r44-section-header p {
          color: rgba(255,255,255,0.6);
        }

        .r44-expeditions-map__visual {
          margin-bottom: 3rem;
        }

        .r44-expeditions-map__globe {
          position: relative;
        }

        .r44-expeditions-map__image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 4px;
          opacity: 0.7;
        }

        .r44-expeditions-map__routes {
          position: absolute;
          top: 50%;
          left: 2rem;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .r44-expeditions-map__route {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
        }

        .r44-expeditions-map__route-marker {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .r44-expeditions-map__route-info h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .r44-expeditions-map__route-year,
        .r44-expeditions-map__route-coords,
        .r44-expeditions-map__route-distance {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
        }

        .r44-expeditions-map__image-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .r44-expeditions-map__image-item {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16/10;
        }

        .r44-expeditions-map__image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .r44-expeditions-map__image-item:hover img {
          transform: scale(1.05);
        }

        .r44-expeditions-map__image-item span {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }

        /* ===== GALLERY ===== */
        .r44-gallery {
          /* Rises above earlier sticky/pinned sections. See .r44-variants. */
          position: relative;
          z-index: 50;
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r44-gallery__grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 250px);
          gap: 1rem;
        }

        .r44-gallery__item {
          overflow: hidden;
          background: #e8e6e2;
        }

        .r44-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .r44-gallery__item:hover img {
          transform: scale(1.05);
        }

        .r44-gallery__item--1 {
          grid-column: span 2;
        }

        .r44-gallery__item--4 {
          grid-column: span 2;
        }

        /* ===== CTA ===== */
        .r44-cta {
          /* Rises above earlier sticky/pinned sections. See .r44-variants. */
          position: relative;
          z-index: 50;
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .r44-cta__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: stretch;
        }

        @media (min-width: 1025px) {
          .r44-cta__content {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .r44-cta__content > div:last-child {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
          }

          .r44-cta__content > div:last-child > .r44-cta__benefits-card {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 0;
          }

          .r44-cta__container > div:last-child:not(.r44-cta__content) {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .r44-cta__container > div:last-child:not(.r44-cta__content) > .r44-cta__form,
          .r44-cta__container > div:last-child:not(.r44-cta__content) > form.r44-cta__form {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
          }

          .r44-cta__form .r44-btn--submit { margin-top: auto; }
        }

        .r44-cta .r44-pre-text--light { color: rgba(255, 255, 255, 0.6); }
        .r44-cta .r44-pre-text__short { display: none; }

        .r44-cta__content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 500;
          line-height: 1.2;
          margin: 0;
          color: #fff;
        }

        .r44-cta__lead {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          margin: 2rem 0;
        }

        .r44-cta__benefits-card {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1rem 0;
        }

        .r44-cta__benefits {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .r44-cta__benefit {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.85);
        }

        .r44-cta__benefit i {
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

        .r44-cta__form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 2.5rem;
        }

        .r44-cta__success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          padding: 3rem 2rem;
          text-align: center;
        }

        .r44-cta__success p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        .r44-cta__error {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: #fca5a5;
          margin: 0 0 1rem;
        }

        .r44-cta__error a {
          color: #fca5a5;
          text-decoration: underline;
        }

        .r44-cta__form h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: #fff;
          margin: 0 0 2rem;
          text-align: center;
        }

        .r44-cta__form-group { margin-bottom: 1rem; }

        .r44-cta__form input,
        .r44-cta__form textarea {
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

        .r44-cta__form input::placeholder,
        .r44-cta__form textarea::placeholder { color: rgba(255, 255, 255, 0.4); }

        .r44-cta__form input:focus,
        .r44-cta__form textarea:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .r44-cta__form textarea { resize: vertical; min-height: 80px; }

        .r44-select { position: relative; width: 100%; }

        .r44-select__trigger {
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

        .r44-select__trigger:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .r44-select__chevron {
          flex-shrink: 0;
          margin-left: 0.75rem;
          transition: transform 0.2s ease;
        }

        .r44-select__chevron--open { transform: rotate(180deg); }

        .r44-select__menu {
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

        .r44-select__option {
          padding: 0.75rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .r44-select__option:hover {
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
        }

        .r44-select__option--active {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .r44-btn--submit {
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

        .r44-btn--submit:hover {
          background: #f5f5f5;
          transform: translateY(-1px);
        }

        .r44-btn--submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .r44-cta__contact {
          max-width: 1200px;
          margin: 3rem auto 0;
          padding-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .r44-cta__contact-inner {
          display: flex;
          justify-content: center;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .r44-cta__contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .r44-cta__contact-item i { color: rgba(255, 255, 255, 0.4); }

        @media (max-width: 1024px) {
          .r44-cta__container { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .r44-cta { padding: 4rem 1.25rem; }
          .r44-cta__form { padding: 1.75rem; }
          .r44-cta__contact-inner { gap: 1.5rem; flex-direction: column; align-items: center; }
        }

        /* ===== SAFETY SYSTEMS ===== */
        .r44-safety {
          padding: 5rem 2rem;
          background: #fff;
        }

        .r44-safety__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-safety__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .r44-safety__card {
          padding: 2rem 1.5rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          position: relative;
          transition: all 0.3s ease;
        }

        .r44-safety__card:hover {
          border-color: #1a1a1a;
        }

        .r44-safety__card--critical {
          border-color: #1a1a1a;
          border-width: 2px;
        }

        .r44-safety__critical-badge {
          position: absolute;
          top: -0.65rem;
          left: 1rem;
          background: #1a1a1a;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
        }

        .r44-safety__icon {
          display: flex;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .r44-safety__title {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.75rem;
        }

        .r44-safety__desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .r44-safety__note {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: #faf9f6;
          border-left: 4px solid #1a1a1a;
        }

        .r44-safety__note-icon {
          flex-shrink: 0;
          color: #1a1a1a;
        }

        .r44-safety__note-content h5 {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem;
        }

        .r44-safety__note-content p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== VARIANT COMPARISON ===== */
        .r44-comparison {
          /* Must rise above pinned/sticky earlier sections (counter at
             z-index:45, sticky intro/engine). See .r44-variants note. */
          position: relative;
          z-index: 50;
          padding: 5rem 2rem;
          background: #faf9f6;
        }

        .r44-comparison__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-comparison__picker {
          margin: 2.5rem 0 3rem;
        }

        .r44-comparison__picker-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 1rem;
        }

        .r44-comparison__picker-clear {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a1a;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .r44-comparison__picker-clear:hover {
          color: #c8102e;
        }

        .r44-comparison__picker-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .r44-comparison__picker-card {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.85rem 1rem;
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .r44-comparison__picker-card:hover {
          border-color: #1a1a1a;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }

        .r44-comparison__picker-card--active {
          border-color: #1a1a1a;
          background: #1a1a1a;
          color: #fff;
        }

        .r44-comparison__picker-check {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.25);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #1a1a1a;
          font-size: 0.65rem;
          transition: all 0.2s;
        }

        .r44-comparison__picker-card--active .r44-comparison__picker-check {
          background: #fff;
          border-color: #fff;
        }

        .r44-comparison__picker-thumb {
          width: 52px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #faf9f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .r44-comparison__picker-card--active .r44-comparison__picker-thumb {
          background: rgba(255,255,255,0.08);
        }

        .r44-comparison__picker-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .r44-comparison__picker-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .r44-comparison__picker-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.2;
        }

        .r44-comparison__picker-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          margin-top: 0.25rem;
        }

        .r44-comparison__picker-card--active .r44-comparison__picker-tag {
          color: rgba(255,255,255,0.65);
        }

        .r44-comparison__table-wrapper {
          overflow-x: auto;
          margin-bottom: 3rem;
        }

        .r44-comparison__table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .r44-comparison__table thead {
          background: #1a1a1a;
          color: #fff;
        }

        .r44-comparison__header-label,
        .r44-comparison__header-variant {
          padding: 1.25rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .r44-comparison__header-label {
          width: 18%;
          background: #1a1a1a;
        }

        .r44-comparison__header-variant {
          width: 16.4%;
          text-align: center;
        }

        .r44-comparison__variant-name {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .r44-comparison__variant-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }

        .r44-comparison__row-label {
          padding: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #666;
          background: #faf9f6;
          border-bottom: 1px solid #e8e6e2;
        }

        .r44-comparison__cell {
          padding: 0.85rem 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.5;
          color: #1a1a1a;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
          border-left: 1px solid #e8e6e2;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .r44-hero__bg {
            width: 80%;
            right: -15%;
          }

          .r44-captain-q__achievements {
            grid-template-columns: repeat(2, 1fr);
          }

          .r44-safety__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .r44-hero {
            min-height: auto;
            padding-bottom: 3rem;
          }

          .r44-hero__bg {
            position: relative;
            width: 100%;
            right: 0;
            bottom: 0;
            order: -1;
            margin-top: 5rem;
          }

          .r44-hero__overlay {
            background: rgba(250,249,246,0.95);
          }

          .r44-hero__content {
            padding: 3rem 1.5rem;
          }

          .r44-hero__badges {
            gap: 1rem;
          }

          .r44-counter__container {
            gap: 1.5rem;
          }

          .r44-captain-q__content {
            padding: 4rem 1.5rem;
          }

          .r44-captain-q__achievements {
            grid-template-columns: 1fr;
          }

          .r44-captain-q__quote p {
            font-size: 1rem;
          }

          .r44-captain-q__cta {
            flex-direction: column;
          }

          .r44-gallery__grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }

          .r44-gallery__item--1,
          .r44-gallery__item--4 {
            grid-column: span 1;
          }

          .r44-expeditions-map__routes {
            position: static;
            transform: none;
            margin-bottom: 2rem;
          }

          .r44-expeditions-map__image {
            height: 250px;
          }

          .r44-expeditions-map__image-grid {
            grid-template-columns: 1fr;
          }

          .r44-safety__grid {
            grid-template-columns: 1fr;
          }

          .r44-safety__note {
            flex-direction: column;
            gap: 1rem;
          }

          .r44-comparison__table {
            font-size: 0.7rem;
            min-width: 720px;
          }

          .r44-comparison__header-label,
          .r44-comparison__header-variant {
            padding: 0.75rem 0.5rem;
          }

          .r44-comparison__cell,
          .r44-comparison__row-label {
            padding: 0.65rem 0.5rem;
            font-size: 0.7rem;
          }

          .r44-comparison__variant-name {
            font-size: 0.85rem;
          }

          .r44-comparison__variant-tag {
            font-size: 0.55rem;
          }
        }

        @media (max-width: 480px) {
          .r44-hero__word {
            font-size: 2.5rem;
          }

          .r44-hero__badges {
            flex-wrap: wrap;
            justify-content: center;
          }

          .r44-variants__info h3 {
            font-size: 1.4rem;
          }
        }

        /* ====================================================================
           ENGINE PARTNERSHIP SECTION (Lycoming)
           ==================================================================== */
        .r44-engine {
          /* Stacking card: pin when the section's bottom reaches the viewport
             bottom, so the next section (R44VariantComparison) rises up over it.
             --r44-engine-stick-top is set in JS to (viewportH - sectionH). */
          position: sticky;
          top: var(--r44-engine-stick-top, 0);
          padding: 6rem 2rem;
          background: #fff;
          /* Scroll-linked blur + fade so the section disappears beneath the
             next one rather than showing through its background. */
          filter: blur(var(--r44-engine-blur, 0px));
          opacity: var(--r44-engine-opacity, 1);
        }

        .r44-engine__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .r44-engine__layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 0 4rem;
          align-items: start;
        }

        .r44-engine__left {
          position: sticky;
          top: max(10vh, var(--catch-top, 90px));
          align-self: start;
        }

        .r44-engine__right {
          display: flex;
          flex-direction: column;
        }

        .r44-engine__cost-slot { margin-top: auto; }

        .r44-engine__body {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #4a4a4a;
          margin: 1.5rem 0 0;
        }

        .r44-engine__lead {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a4a4a;
          margin: 1.5rem 0;
        }

        .r44-engine__logo {
          display: inline-block;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 0.3em;
          color: #1a1a1a;
          padding: 0.65rem 1.5rem;
          border: 2px solid #1a1a1a;
          margin: 1.5rem 0 0;
        }

        .r44-engine__cost {
          margin-top: 16px;
          margin-left: calc(44px + 1rem);
          margin-right: calc(44px + 1rem);
          padding: 2rem;
          background: #faf9f6;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        .r44-engine__cost-header { margin-bottom: 1.25rem; }

        .r44-engine__cost-header .r44-pre-text {
          display: block;
          margin-bottom: 0.5rem;
        }

        .r44-engine__cost-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.35rem;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.3;
        }

        .r44-engine__cost-accent { color: #a67b3f; }

        .r44-engine__cost-lead {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin: 0 0 1.25rem;
        }

        .r44-engine__cost-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.75rem;
        }

        .r44-engine__cost-list li {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #4a4a4a;
        }

        .r44-engine__cost-list i {
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

        .r44-engine__carousel {
          display: flex;
          align-items: stretch;
          gap: 1rem;
          min-width: 0;
        }

        .r44-engine__nav {
          flex: 0 0 auto;
          width: 44px;
          height: 44px;
          align-self: center;
          background: transparent;
          border: 1px solid #1a1a1a;
          color: #1a1a1a;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          padding: 0;
        }

        .r44-engine__nav:hover { background: #1a1a1a; color: #fff; }
        .r44-engine__nav:active { transform: scale(0.95); }

        .r44-engine__grid {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          gap: 0;
          flex: 1;
          align-items: stretch;
          width: 100%;
          min-width: 0;
        }

        .r44-engine__grid::-webkit-scrollbar { display: none; }

        .r44-engine__grid > * {
          flex: 0 0 100%;
          min-width: 0;
          scroll-snap-align: start;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .r44-engine__card {
          flex: 0 0 100%;
          width: 100%;
          box-sizing: border-box;
          background: #faf9f6;
          padding: 2rem;
          border-radius: 4px;
          border: 1px solid #eee;
          transition: all 0.3s ease;
          scroll-snap-align: start;
        }

        .r44-engine__card:hover {
          border-color: #1a1a1a;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .r44-engine__stat {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .r44-engine__stat-value {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.25rem;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1;
        }

        .r44-engine__stat-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
          margin-top: 0.5rem;
        }

        .r44-engine__card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
        }

        .r44-engine__card p {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }

        .r44-engine__dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 1rem 0 0;
        }

        .r44-engine__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ccc;
          transition: background 0.2s;
          cursor: pointer;
        }

        .r44-engine__dot--active { background: #1a1a1a; }

        @media (max-width: 1024px) {
          .r44-engine__layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .r44-engine__left {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .r44-engine { padding: 3rem 1rem; }
          .r44-engine__nav { display: none; }
          .r44-engine__carousel { gap: 0; }
          .r44-engine__cost {
            margin-left: 0;
            margin-right: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 1.25rem;
            text-align: center;
          }
          .r44-engine__cost-list li { justify-content: center; }
        }

        /* ====================================================================
           R44 VARIANTS — CTA + Inline Configurator (matches R66 pattern)
           ==================================================================== */
        .r44-variants__cta {
          display: flex;
          margin-top: 0;
        }
        .r44-variants__cta-button {
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
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .r44-variants__cta-button:hover {
          background: #fff;
          color: #1a1a1a;
        }
        .r44-variants__cta-button i {
          font-size: 0.75rem;
          transition: transform 0.2s ease;
        }
        .r44-variants__cta-button:hover i {
          transform: translateX(3px);
        }
        .r44-variants__configurator {
          border: 1px solid #e5e4df;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 24px 60px -32px rgba(0,0,0,0.25);
        }
        .r44-variants__configurator-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid #e5e4df;
          background: #faf9f6;
          flex-wrap: wrap;
        }
        .r44-variants__configurator-back {
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
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
        }
        .r44-variants__configurator-back:hover {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #faf9f6;
          transform: translateY(-1px);
        }
        .r44-variants__configurator-active {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a7a7a;
        }
        .r44-variants__configurator-active strong {
          color: #1a1a1a;
          font-weight: 600;
        }
        .r44-variants__configurator-frame {
          display: block;
          width: 100%;
          height: min(82vh, 820px);
          min-height: 520px;
          border: 0;
          background: #ffffff;
        }
        @media (max-width: 768px) {
          .r44-variants__configurator-meta {
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
          }
          .r44-variants__configurator-frame {
            height: 70vh;
            min-height: 460px;
          }
        }
      `}</style>
    </div>
  );
}

export default AircraftR44;
