/**
 * HQ AVIATION - AIRCRAFT SALES PAGE
 *
 * Brand: Luxury Minimal Aviation
 * Typography: Space Grotesk + Share Tech Mono
 * Colors: #faf9f6 (warm white), #1a1a1a (charcoal)
 * Aesthetic: Editorial, Luxury Automotive, Aviation Instrumentation
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePageImages } from '../hooks/usePageImages';
import { useCmsHighlight } from '../hooks/useCmsHighlight';
import { usePageText } from '../hooks/usePageText';
import { useFaqs } from '../hooks/useFaqs';

// Import styles
import '../assets/css/main.css';
import '../assets/css/components.css';

// Import footer
import FooterMinimal from '../components/FooterMinimal';

/**
 * SALES PAGE HEADER
 */
function SalesHeader() {
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
      <div className={`hq-menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="hq-menu-grid">
          <div className="hq-menu-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/about-us/team" onClick={closeMenu}>Meet The Team</Link></li>
              <li><Link to="/about-us/captain-q" onClick={closeMenu}>Quentin Smith</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Aircraft Sales</h3>
            <ul>
              <li><Link to="/sales" onClick={closeMenu}>New Aircraft</Link></li>
              <li><Link to="/aircraft-sales/new/r88" onClick={closeMenu}>R88</Link></li>
              <li><Link to="/aircraft-sales/new/r66" onClick={closeMenu}>R66</Link></li>
              <li><Link to="/aircraft-sales/new/r44" onClick={closeMenu}>R44</Link></li>
              <li><Link to="/aircraft-sales/new/r22" onClick={closeMenu}>R22</Link></li>
            </ul>
          </div>
          <div className="hq-menu-section">
            <h3>Flight Training</h3>
            <ul>
              <li><Link to="/training" onClick={closeMenu}>Training Overview</Link></li>
              <li><Link to="/training/ppl" onClick={closeMenu}>Private Pilot License</Link></li>
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
            <h3>Contact</h3>
            <ul>
              <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
              <li><Link to="/contact/pricing" onClick={closeMenu}>Pricing</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <button
        className={`hq-menu-btn ${colorDark ? 'color-dark' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
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
              />
            </Link>
            <nav className="Header-nav Header-nav--secondary" data-nc-element="secondary-nav">
              <div className="Header-nav-inner">
                <Link to="/flying" className="Header-nav-item">Flying</Link>
                <Link to="/training" className="Header-nav-item">Training</Link>
                <Link to="/sales" className="Header-nav-item">Aircraft</Link>
              </div>
            </nav>
          </div>
          <div data-nc-container="top-right"></div>
        </div>
      </header>
    </>
  );
}

// Animated reveal wrapper
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
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

// Aircraft models data
const aircraftModels = [
  {
    id: 'r88',
    name: 'R88',
    tagline: 'The Future of Rotorcraft',
    description: 'Revolutionary 8-seat turbine helicopter with unmatched capability.',
    seats: 8,
    speed: '140',
    range: '400',
    engine: 'Safran Arriel',
    price: 'POA',
    image: '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg',
    cutout: '/assets/images/new-aircraft/r88/r88-jellybean-left.png',
    featured: true,
    subtypes: [
      { id: 'standard', name: 'Standard', description: 'Base configuration with premium features.' },
    ],
  },
  {
    id: 'r66',
    name: 'R66',
    tagline: 'Turbine Performance',
    description: 'Five-seat turbine helicopter with Robinson reliability.',
    seats: 5,
    speed: '120',
    range: '350',
    engine: 'RR300',
    price: '$1,290,000',
    image: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg',
    cutout: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',
    featured: false,
    badge: null,
    subtypes: [
      { id: 'standard', name: 'Standard', description: 'Five-seat turbine helicopter with Robinson reliability.' },
      { id: 'turbine-marine', name: 'Turbine Marine', description: 'Equipped with pop-out floats for overwater operations.' },
      { id: 'southwood', name: 'Southwood', description: 'Premium leather interior with bespoke finishing by Southwood Aviation.' },
    ],
  },
  {
    id: 'r44',
    name: 'R44',
    tagline: 'World\'s Best-Selling',
    description: 'Four-seat piston helicopter. The industry benchmark.',
    seats: 4,
    speed: '113',
    range: '300',
    engine: 'Lycoming IO-540',
    price: '$535,000',
    image: '/assets/images/new-aircraft/r44/r44blueprint.jpg',
    cutout: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',
    featured: false,
    badge: null,
    subtypes: [
      { id: 'raven-i', name: 'Raven I', description: 'Carbureted engine. Ideal for lower altitude operations.' },
      { id: 'raven-ii', name: 'Raven II', description: 'Fuel-injected engine. Enhanced high-altitude performance.' },
      { id: 'cadet', name: 'Cadet', description: 'Two-seat training variant with extended range.' },
    ],
  },
  {
    id: 'r22',
    name: 'R22',
    tagline: 'Training Excellence',
    description: 'Two-seat trainer. Where pilots are made.',
    seats: 2,
    speed: '96',
    range: '200',
    engine: 'Lycoming O-360',
    price: '$345,000',
    image: '/assets/images/new-aircraft/r22/r22blueprint.jpg',
    cutout: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',
    featured: false,
    badge: null,
    subtypes: [
      { id: 'beta-ii', name: 'Beta II', description: 'Standard two-seat trainer with proven reliability.' },
      { id: 'mariner', name: 'Mariner', description: 'Float-equipped variant for water operations.' },
    ],
  },
];

// Used aircraft data
const usedAircraft = [
  {
    id: 1,
    model: 'R66 Turbine',
    year: 2018,
    hours: 1245,
    price: '£895,000',
    image: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg',
    status: 'Available',
  },
  {
    id: 2,
    model: 'R44 Raven II',
    year: 2019,
    hours: 890,
    price: '£385,000',
    image: '/assets/images/new-aircraft/r44/r44blueprint.jpg',
    status: 'Available',
  },
  {
    id: 3,
    model: 'R66 Turbine',
    year: 2020,
    hours: 650,
    price: '£995,000',
    image: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg',
    status: 'Under Offer',
  },
];

// Buying process steps
const buyingSteps = [
  { num: '01', title: 'Consultation', desc: 'Discuss your requirements with our specialists' },
  { num: '02', title: 'Configuration', desc: 'Choose your model, options, and livery' },
  { num: '03', title: 'Factory Order', desc: 'We place your order with Robinson' },
  { num: '04', title: 'Production', desc: 'Your aircraft is built in Torrance, California' },
  { num: '05', title: 'Delivery', desc: 'Factory-direct or assembled at HQ Aviation' },
  { num: '06', title: 'Handover', desc: 'Aircraft handover and ongoing support' },
];

// R88 features
const r88Features = [
  { icon: '⬡', title: '8 Seats', desc: 'Largest cabin in its class' },
  { icon: '◈', title: 'Safran Arriel', desc: 'Proven turbine reliability' },
  { icon: '◉', title: '400 NM Range', desc: 'Extended mission capability' },
  { icon: '◎', title: 'Glass Cockpit', desc: 'State-of-the-art avionics' },
  { icon: '⬢', title: 'Air Conditioning', desc: 'Passenger comfort standard' },
  { icon: '◇', title: 'Cargo Bay', desc: 'Rear access storage' },
];

// Financing options
const financingOptions = [
  {
    type: 'Cash Purchase',
    icon: '●',
    benefits: ['Best price', 'No interest', 'Full ownership immediately'],
    note: 'Most straightforward option',
  },
  {
    type: 'Aviation Finance',
    icon: '◐',
    benefits: ['Low deposit from 10%', 'Flexible terms 3-10 years', 'Fixed rates available'],
    note: 'Most popular choice',
    featured: true,
  },
  {
    type: 'Lease Purchase',
    icon: '○',
    benefits: ['Lower monthly payments', 'Balloon payment option', 'Tax efficient'],
    note: 'Great for business use',
  },
  {
    type: 'Operating Lease',
    icon: '◔',
    benefits: ['Off balance sheet', 'Return at end of term', 'Maintenance included'],
    note: 'Corporate flexibility',
  },
];

// Comparison specs
const comparisonSpecs = [
  { spec: 'Seats', r88: '8', r66: '5', r44: '4', r22: '2' },
  { spec: 'Max Speed (kts)', r88: '140', r66: '120', r44: '113', r22: '96' },
  { spec: 'Range (NM)', r88: '400', r66: '350', r44: '300', r22: '200' },
  { spec: 'Engine Type', r88: 'Turbine', r66: 'Turbine', r44: 'Piston', r22: 'Piston' },
  { spec: 'Useful Load (lb)', r88: '2,100', r66: '1,270', r44: '1,025', r22: '407' },
  { spec: 'Hover Ceiling IGE (ft)', r88: '10,000', r66: '10,000', r44: '8,950', r22: '6,400' },
  { spec: 'Fuel Capacity (gal)', r88: '120', r66: '73.3', r44: '50.5', r22: '19.2' },
  { spec: 'Price From', r88: 'POA', r66: '$1.29M', r44: '$535K', r22: '$345K' },
];

// Aircraft specs for comparison tool
const aircraftSpecsForCompare = [
  {
    model: 'R66 Turbine',
    seats: 5,
    engine: 'RR300 Turbine',
    maxSpeed: '140 kts',
    cruiseSpeed: '120 kts',
    range: '350 nm',
    endurance: '3.0 hrs',
    usefulLoad: '1,270 lbs',
    fuelCapacity: '73.3 gal',
    hasAuxTank: true,
    auxTankSpecs: {
      range: '400 nm',
      endurance: '3.5 hrs',
      fuelCapacity: '91.5 gal'
    }
  },
  {
    model: 'R44 Raven II',
    seats: 4,
    engine: 'IO-540 Piston',
    maxSpeed: '130 kts',
    cruiseSpeed: '113 kts',
    range: '300 nm',
    endurance: '3.0 hrs',
    usefulLoad: '1,025 lbs',
    fuelCapacity: '50.5 gal'
  },
  {
    model: 'R44 Cadet',
    seats: 2,
    engine: 'IO-540 Piston',
    maxSpeed: '130 kts',
    cruiseSpeed: '113 kts',
    range: '350 nm',
    endurance: '3.5 hrs',
    usefulLoad: '838 lbs',
    fuelCapacity: '50.5 gal'
  },
  {
    model: 'R22 Beta II',
    seats: 2,
    engine: 'O-360 Piston',
    maxSpeed: '102 kts',
    cruiseSpeed: '96 kts',
    range: '200 nm',
    endurance: '2.5 hrs',
    usefulLoad: '407 lbs',
    fuelCapacity: '19.2 gal'
  },
];

// Owner testimonials
const testimonials = [
  {
    quote: "The team at HQ made the entire buying process seamless. From configuration to delivery, they were with us every step of the way.",
    author: "James Richardson",
    role: "R66 Owner since 2022",
    image: '/assets/images/team/team-member-1.jpg',
  },
  {
    quote: "Third helicopter I've purchased from HQ. Their after-sales support is unmatched in the UK. Wouldn't go anywhere else.",
    author: "Sarah Mitchell",
    role: "R44 & R66 Owner",
    image: '/assets/images/team/team-member-2.jpg',
  },
  {
    quote: "As a first-time buyer, I was nervous about the process. HQ's expertise and patience made it a pleasure. Now I can't imagine life without my R22.",
    author: "Michael Chen",
    role: "R22 Owner since 2023",
    image: '/assets/images/team/team-member-3.jpg',
  },
];

// Configuration options
const configOptions = [
  { category: 'Exterior', options: ['Custom Paint Schemes', 'Blade Tape Colors', 'Chrome Package', 'LED Landing Lights'] },
  { category: 'Interior', options: ['Leather Seats', 'Alcantara Headliner', 'Custom Carpet', 'Sound Dampening'] },
  { category: 'Avionics', options: ['Garmin G500H', 'Dual Transponders', 'ADS-B Out', 'Autopilot Systems'] },
  { category: 'Safety', options: ['Pop-out Floats', 'ELT Upgrade', 'Enhanced Vision', 'Wire Strike Protection'] },
];

// Safety features
const safetyFeatures = [
  { title: 'Rotor Brake', desc: 'Prevents blade sailing in wind', icon: '◎' },
  { title: 'Crashworthy Seats', desc: 'Energy-absorbing design', icon: '◈' },
  { title: 'Inertia Reel Belts', desc: '4-point harness system', icon: '⬡' },
  { title: 'Bladder Fuel Tanks', desc: 'Crash-resistant fuel cells', icon: '◇' },
  { title: 'Full Authority FADEC', desc: 'Engine protection (R66)', icon: '⬢' },
  { title: 'Main Rotor Design', desc: 'High-inertia system', icon: '◉' },
];

// Accessories
const accessories = [
  { name: 'Ground Handling Wheels', price: '£2,850', category: 'Ground Equipment' },
  { name: 'Air Covers Set', price: '£1,950', category: 'Protection' },
  { name: 'Blade Tie-Down Kit', price: '£495', category: 'Ground Equipment' },
  { name: 'Sunshade Set', price: '£685', category: 'Protection' },
  { name: 'Leather Headset Bag', price: '£285', category: 'Accessories' },
  { name: 'Robinson Floor Mats', price: '£395', category: 'Interior' },
  { name: 'GPU Receptacle', price: '£1,450', category: 'Electrical' },
  { name: 'Cargo Pod (R44)', price: '£8,500', category: 'Utility' },
];

// Training packages
const trainingPackages = [
  {
    name: 'Basic Transition',
    hours: '5',
    includes: ['Type conversion', 'Aircraft familiarization', 'Emergency procedures'],
    price: 'Included',
  },
  {
    name: 'Comprehensive Package',
    hours: '10',
    includes: ['Type conversion', 'Navigation training', 'Night qualification', 'Cross-country'],
    price: '+£3,500',
  },
  {
    name: 'Owner Pilot Program',
    hours: '20',
    includes: ['Full PPL training', 'R22/R44 type rating', 'Robinson safety course', 'Solo cross-country'],
    price: '+£15,000',
  },
];

// Maintenance packages
const maintenancePackages = [
  {
    name: 'Essential',
    coverage: '100-hour inspections',
    price: '£295/hr',
    features: ['Scheduled inspections', 'Basic consumables', 'Flight logs'],
  },
  {
    name: 'Premium',
    coverage: 'Full maintenance care',
    price: '£485/hr',
    features: ['All inspections', 'All consumables', 'Component exchanges', '24/7 AOG support'],
    featured: true,
  },
  {
    name: 'Complete',
    coverage: 'All-inclusive program',
    price: '£695/hr',
    features: ['Everything in Premium', 'Major overhauls', 'Hangarage included', 'Insurance discount'],
  },
];

// Example deliveries
const exampleDeliveries = [
  { model: 'R66 NXG', image: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg', spec: '5-seat turbine' },
  { model: 'R44 Raven II', image: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', spec: '4-seat piston' },
  { model: 'R66 Turbine', image: '/assets/images/used-aircraft/r66/chris-r66-alps.jpg', spec: 'Turbine reliability' },
  { model: 'R22 Beta II', image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', spec: '2-seat trainer' },
  { model: 'R44 Cadet', image: '/assets/images/new-aircraft/r44/r44blueprint.jpg', spec: 'Training variant' },
  { model: 'R88', image: '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg', spec: '8-seat flagship' },
];

// FAQ items are now managed via Firestore — see useFaqs('sales')

// Insurance partners
const insurancePartners = [
  { name: 'Hayward Aviation', logo: '/assets/images/logos/partners/hayward-fleet-insurance-copy.png', specialty: 'Fleet & Training' },
  { name: 'Global Aerospace', logo: '/assets/images/logos/partners/global-aerospace.png', specialty: 'Private & Commercial' },
  { name: 'Willis Towers Watson', logo: '/assets/images/logos/partners/willis.png', specialty: 'Corporate Solutions' },
];

// Demo events
const upcomingEvents = [
  { date: '15', month: 'Mar', title: 'R88 Preview Day', location: 'Denham Aerodrome', type: 'Product Launch' },
  { date: '22', month: 'Mar', title: 'Spring Open House', location: 'HQ Aviation', type: 'Open Day' },
  { date: '05', month: 'Apr', title: 'Finance Workshop', location: 'Online Webinar', type: 'Workshop' },
  { date: '18', month: 'Apr', title: 'Demo Day - R66', location: 'Denham Aerodrome', type: 'Demo Flight' },
];

// Heritage timeline
const heritageTimeline = [
  { year: '2010', event: 'HQ Aviation founded at Denham Aerodrome' },
  { year: '1995', event: 'Appointed Robinson Authorized Dealer' },
  { year: '2000', event: '100th helicopter delivered' },
  { year: '2005', event: 'Part 145 maintenance approval granted' },
  { year: '2010', event: 'R66 Turbine added to lineup' },
  { year: '2015', event: 'New state-of-the-art hangar complex' },
  { year: '2020', event: '500th helicopter delivered' },
  { year: '2024', event: 'R88 launch — A new era begins' },
];

// Paint scheme options
const paintSchemes = [
  { name: 'Classic White', type: 'Standard', image: '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-view-13611.jpg' },
  { name: 'Palo Verde', type: 'NXG Edition', image: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png' },
  { name: 'Riviera Blue', type: 'NXG Edition', image: '/assets/images/new-aircraft/r66/copy-of-r66-riviera-front-v2.png' },
  { name: 'Corporate Black', type: 'Custom', image: '/assets/images/new-aircraft/r88/rhc-r88-right-side-view-dark-21823_2.jpg' },
  { name: 'Racing Red', type: 'Custom', image: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
  { name: 'Bespoke Design', type: 'Full Custom', image: '/assets/images/facility/hq-aviation-robinsons.jpg' },
];

// Interior options
const interiorOptions = [
  { name: 'Standard Cloth', desc: 'Durable aviation-grade fabric', tier: 'Standard' },
  { name: 'Premium Leather', desc: 'Full grain automotive leather', tier: 'Premium' },
  { name: 'Alcantara Suede', desc: 'Italian luxury microfiber', tier: 'Luxury' },
  { name: 'Custom Stitching', desc: 'Contrast thread options', tier: 'Add-on' },
  { name: 'Carbon Fiber Trim', desc: 'Lightweight accent panels', tier: 'Add-on' },
  { name: 'Ambient Lighting', desc: 'LED interior lighting', tier: 'Add-on' },
];

// Mission profiles
const missionProfiles = [
  {
    id: 'private',
    title: 'Private Ownership',
    icon: '◈',
    desc: 'Personal transport, weekend flying, and adventure',
    benefits: ['Ultimate freedom', 'No scheduling hassles', 'Family adventures', 'Business travel'],
    recommended: 'R44 or R66',
  },
  {
    id: 'training',
    title: 'Flight Training',
    icon: '◎',
    desc: 'Schools and academies building the next generation',
    benefits: ['Low operating costs', 'Excellent safety record', 'Robinson certification', 'High utilization'],
    recommended: 'R22 or R44 Cadet',
  },
  {
    id: 'charter',
    title: 'Charter Operations',
    icon: '⬡',
    desc: 'Commercial passenger transport services',
    benefits: ['Revenue generation', 'Fleet scalability', 'Customer comfort', 'Reliability'],
    recommended: 'R66 or R88',
  },
  {
    id: 'utility',
    title: 'Utility & Work',
    icon: '⬢',
    desc: 'Agricultural, survey, and industrial applications',
    benefits: ['Payload capacity', 'Operational efficiency', 'Low maintenance', 'Versatility'],
    recommended: 'R44 or R66',
  },
];

// Ownership costs breakdown
const ownershipCosts = [
  { category: 'Fixed Costs', items: [
    { name: 'Insurance', r22: '£8,000', r44: '£12,000', r66: '£18,000' },
    { name: 'Hangarage', r22: '£4,800', r44: '£6,000', r66: '£7,200' },
    { name: 'Annual Inspection', r22: '£3,500', r44: '£5,000', r66: '£7,500' },
  ]},
  { category: 'Variable Costs (per hour)', items: [
    { name: 'Fuel', r22: '£45', r44: '£85', r66: '£120' },
    { name: 'Maintenance Reserve', r22: '£120', r44: '£180', r66: '£250' },
    { name: 'Engine Reserve', r22: '£80', r44: '£95', r66: '£150' },
  ]},
];

// Resale data
const resaleData = [
  { model: 'R22 Beta II', age: '5 years', retention: '72%' },
  { model: 'R44 Raven II', age: '5 years', retention: '75%' },
  { model: 'R66 Turbine', age: '5 years', retention: '78%' },
];

// Awards
const awards = [
  { year: '2023', title: 'European Dealer of the Year', org: 'Robinson Helicopter Company' },
  { year: '2022', title: 'Excellence in Training', org: 'CAA' },
  { year: '2021', title: 'Best Maintenance Facility', org: 'Helicopter Association International' },
  { year: '2020', title: 'Customer Service Award', org: 'Aviation Consumer Magazine' },
];

// Pilot requirements
const pilotRequirements = [
  { model: 'R22', license: 'PPL(H)', rating: 'R22 Type Rating', minHours: '45', medical: 'Class 2' },
  { model: 'R44', license: 'PPL(H)', rating: 'R44 Type Rating', minHours: '45', medical: 'Class 2' },
  { model: 'R66', license: 'PPL(H)', rating: 'R66 Turbine Rating', minHours: '45', medical: 'Class 2' },
  { model: 'R88', license: 'PPL(H)', rating: 'R88 Type Rating', minHours: '100*', medical: 'Class 2' },
];

// Comparison vs competition
const competitorComparison = [
  { feature: 'Purchase Price', robinson: '$$', competitor: '$$$$', advantage: 'robinson' },
  { feature: 'Operating Cost/Hour', robinson: '$150-350', competitor: '$400-800', advantage: 'robinson' },
  { feature: 'Parts Availability', robinson: 'Excellent', competitor: 'Good', advantage: 'robinson' },
  { feature: 'Resale Value', robinson: '75%+ at 5yrs', competitor: '60-70%', advantage: 'robinson' },
  { feature: 'Training Network', robinson: 'Worldwide', competitor: 'Limited', advantage: 'robinson' },
  { feature: 'Maintenance Simplicity', robinson: 'Owner-friendly', competitor: 'Complex', advantage: 'robinson' },
];

// Environmental data
const environmentalData = [
  { metric: 'Fuel Efficiency', value: 'Best in Class', desc: 'Lowest fuel burn per passenger mile' },
  { metric: 'Noise Footprint', value: '-3dB', desc: 'Quieter than industry average' },
  { metric: 'Carbon Offset', value: 'Available', desc: 'Optional carbon neutral program' },
  { metric: 'Recyclability', value: '85%', desc: 'Aircraft materials recyclable' },
];

// Partner locations
const partnerLocations = [
  { region: 'Europe', count: 45, countries: ['UK', 'France', 'Germany', 'Spain', 'Italy'] },
  { region: 'Americas', count: 120, countries: ['USA', 'Canada', 'Brazil', 'Mexico'] },
  { region: 'Asia Pacific', count: 35, countries: ['Australia', 'Japan', 'Singapore', 'NZ'] },
  { region: 'Middle East', count: 15, countries: ['UAE', 'Saudi Arabia', 'Qatar'] },
];

// Hangarage tiers
const hangarageOptions = [
  { tier: 'Basic', price: '£400/mo', features: ['Covered storage', 'Security', 'Ground handling'] },
  { tier: 'Premium', price: '£600/mo', features: ['Climate controlled', 'Wash service', 'Battery tender', 'Priority access'] },
  { tier: 'Full Service', price: '£900/mo', features: ['All Premium features', 'Weekly inspection', 'Fuel top-up', 'Concierge service'] },
];

// Pre-purchase inspection
const inspectionPackages = [
  { name: 'Basic Inspection', duration: '1 day', price: '£1,500', includes: ['Visual inspection', 'Logbook review', 'AD compliance check'] },
  { name: 'Comprehensive', duration: '2-3 days', price: '£3,500', includes: ['Full inspection', 'Engine borescope', 'Compression test', 'Component history', 'Market valuation'] },
  { name: 'Pre-Purchase Plus', duration: '3-5 days', price: '£5,500', includes: ['Everything above', 'Test flight', 'Avionics check', 'Paint evaluation', 'Negotiation support'] },
];

// Video content
const videoContent = [
  { id: 1, title: 'R88', duration: '12:30', thumbnail: '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg' },
  { id: 2, title: 'R66 Turbine', duration: '8:45', thumbnail: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg' },
  { id: 3, title: 'R44 Raven II', duration: '7:30', thumbnail: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png' },
  { id: 4, title: 'R22 Beta II', duration: '6:15', thumbnail: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png' },
];

// Social proof stats
const socialProofStats = [
  { value: '15', suffix: '+', label: 'Years in Business' },
  { value: '500', suffix: '+', label: 'Aircraft Delivered' },
  { value: '98', suffix: '%', label: 'Customer Satisfaction' },
  { value: '24', suffix: '/7', label: 'Support Available' },
];

// Specification details
const specificationDetails = {
  r66: {
    dimensions: { length: '33.2 ft', height: '11.7 ft', width: '6.4 ft' },
    weights: { empty: '1,280 lb', maxGross: '2,700 lb', useful: '1,420 lb' },
    performance: { cruise: '110 kts', maxSpeed: '140 kts', range: '350 nm', endurance: '3.5 hrs' },
    engine: { type: 'Rolls-Royce RR300', power: '270 shp', fuel: 'Jet-A' },
  },
};

// Customer locations map data
const customerLocations = [
  { city: 'London', lat: 51.5, customers: 45 },
  { city: 'Manchester', lat: 53.5, customers: 22 },
  { city: 'Edinburgh', lat: 55.9, customers: 15 },
  { city: 'Dublin', lat: 53.3, customers: 12 },
  { city: 'Paris', lat: 48.8, customers: 18 },
];

// Avionics packages
const avionicsPackages = [
  {
    name: 'Standard',
    includes: ['Dual G500H TXi', 'GTN 650Xi', 'GTX 345', 'GMA 350H'],
    price: 'Included',
  },
  {
    name: 'Enhanced',
    includes: ['Dual G500H TXi', 'GTN 750Xi', 'GTX 345', 'GMA 350H', 'GFC 600H Autopilot', 'Radar Altimeter'],
    price: '+$45,000',
    featured: true,
  },
  {
    name: 'Premium IFR',
    includes: ['All Enhanced', 'Second GTN 750Xi', 'GWX 75 Weather Radar', 'Flight Director', 'HTAWS'],
    price: '+$95,000',
  },
];

// Warranty options
const warrantyOptions = [
  { type: 'Standard', duration: '2 Years', coverage: 'Factory defects', price: 'Included' },
  { type: 'Extended', duration: '5 Years', coverage: 'Comprehensive coverage', price: '+£12,500' },
  { type: 'Ultimate', duration: '7 Years', coverage: 'All-inclusive + wear items', price: '+£24,000' },
];

// Delivery options
const deliveryOptions = [
  { method: 'Factory Pickup', location: 'Torrance, CA', time: 'Immediate', price: 'Included', desc: 'Fly your new helicopter home with support' },
  { method: 'Sea Freight', location: 'Felixstowe', time: '8-10 weeks', price: '+£15,000', desc: 'Container shipping with HQ reassembly' },
  { method: 'Ferry Flight', location: 'Denham', time: '2-3 weeks', price: '+£35,000', desc: 'Professional pilots deliver door-to-door' },
];

// Flight planning tools
const flightTools = [
  { name: 'SkyDemon', type: 'Navigation', desc: 'UK\'s favorite flight planning app', logo: '◈' },
  { name: 'ForeFlight', type: 'Navigation', desc: 'Comprehensive aviation platform', logo: '◎' },
  { name: 'Helipaddy', type: 'Landing Sites', desc: 'Helicopter landing locations', logo: '⬡' },
  { name: 'Met Office', type: 'Weather', desc: 'Official UK aviation weather', logo: '◉' },
];

// Membership benefits
const membershipBenefits = [
  { title: 'Owner Events', desc: 'Exclusive fly-ins, dinners, and expeditions', icon: '✈' },
  { title: 'Community Access', desc: 'Private owner WhatsApp group', icon: '💬' },
  { title: 'Expedition Invites', desc: 'First access to group flying adventures', icon: '◈' },
  { title: 'Owner Newsletter', desc: 'Monthly updates and industry insights', icon: '◎' },
];

// Technical support
const techSupport = [
  { channel: 'Phone', availability: '24/7', response: 'Immediate', number: '+44 1234 567 890' },
  { channel: 'WhatsApp', availability: '7am-10pm', response: '< 1 hour', number: '+44 7XXX XXX XXX' },
  { channel: 'Email', availability: '24/7', response: '< 24 hours', number: 'support@hqaviation.co.uk' },
  { channel: 'AOG Line', availability: '24/7', response: 'Immediate', number: '+44 800 XXX XXXX' },
];

// Component exchange program
const componentExchange = [
  { component: 'Main Rotor Blades', exchange: '£18,500', new: '£32,000', savings: '42%' },
  { component: 'Tail Rotor Blades', exchange: '£4,200', new: '£7,800', savings: '46%' },
  { component: 'Swashplate Assembly', exchange: '£8,900', new: '£15,500', savings: '43%' },
  { component: 'Transmission', exchange: '£45,000', new: '£85,000', savings: '47%' },
];

// Flight school partnerships
const flightSchools = [
  { name: 'HQ Aviation Academy', location: 'Denham', specialty: 'Robinson PPL/CPL', partner: true },
  { name: 'Helicopter Services', location: 'Wycombe', specialty: 'Type Ratings', partner: true },
  { name: 'Bournemouth Helicopters', location: 'Bournemouth', specialty: 'ATPL Theory', partner: true },
  { name: 'Helicentre Aviation', location: 'Leicester', specialty: 'Instrument Ratings', partner: true },
];

// Upgrade paths
const upgradePaths = [
  { from: 'R22', to: 'R44', benefit: 'Double the seats, greater range', tradein: 'Up to 80%' },
  { from: 'R44', to: 'R66', benefit: 'Turbine reliability, 5th seat', tradein: 'Up to 85%' },
  { from: 'R66', to: 'R88', benefit: '8 seats, ultimate capability', tradein: 'Up to 90%' },
];

// Regulatory info
const regulatoryBodies = [
  { name: 'CAA', region: 'UK', role: 'Primary certification authority', link: 'caa.co.uk' },
  { name: 'EASA', region: 'Europe', role: 'European aviation safety', link: 'easa.europa.eu' },
  { name: 'FAA', region: 'USA', role: 'US certification (factory)', link: 'faa.gov' },
];

// Owner stories detailed
const ownerStories = [
  {
    name: 'Dr. Sarah Mitchell',
    aircraft: 'R66 Turbine',
    purchased: '2022',
    hours: '450+',
    story: 'As a surgeon, time is critical. My R66 lets me be in three hospitals across the South in a single day.',
    useCase: 'Business Commute',
  },
  {
    name: 'The Harrison Family',
    aircraft: 'R44 Raven II',
    purchased: '2020',
    hours: '380+',
    story: 'Weekend adventures with the kids have never been better. We\'ve explored every corner of the UK.',
    useCase: 'Family Adventures',
  },
  {
    name: 'James & Partners LLP',
    aircraft: '3x R66',
    purchased: '2021',
    hours: '2,400+',
    story: 'Our charter operation started with one R66. HQ\'s support helped us scale to three aircraft.',
    useCase: 'Charter Business',
  },
];

// Consignment sales
const consignmentBenefits = [
  'Professional photography and video',
  'Listing on HQ website and partners',
  'Pre-sale inspection and certification',
  'Handling all viewings and test flights',
  'Secure transaction management',
  'Worldwide buyer network access',
];

// Special editions
const specialEditions = [
  { name: 'NXG Riviera', base: 'R66', features: ['Alcantara interior', 'Custom paint', 'Enhanced avionics'], limited: 50 },
  { name: 'NXG Palo Verde', base: 'R66', features: ['Two-tone exterior', 'Leather seats', 'A/C upgrade'], limited: 50 },
  { name: 'Anniversary Edition', base: 'R44', features: ['Gold accents', 'Special livery', 'Commemorative plaque'], limited: 35 },
];

// Operating bases
const operatingBases = [
  { name: 'Denham Aerodrome', code: 'EGLD', runway: '06/24', fuel: 'Avgas, Jet-A1', facilities: 'Full maintenance, hangarage, clubhouse' },
  { name: 'Battersea Heliport', code: 'EGLW', runway: 'Helipad', fuel: 'Jet-A1', facilities: 'VIP lounge, car service' },
  { name: 'Biggin Hill', code: 'EGKB', runway: '03/21', fuel: 'Avgas, Jet-A1', facilities: 'Customs, FBO services' },
];

// Carbon offset program
const carbonProgram = {
  providers: ['Gold Standard', 'Verified Carbon Standard'],
  cost: '£8 per flight hour',
  projects: ['UK Woodland restoration', 'African cookstove initiative', 'South American reforestation'],
  certificates: 'Annual carbon neutral certification available',
};

// Aircraft management services
const managementServices = [
  { service: 'Scheduling', desc: 'Online booking system for your aircraft', price: 'Included' },
  { service: 'Crew Sourcing', desc: 'Vetted pilots on demand', price: '£450/day' },
  { service: 'Trip Planning', desc: 'Route, permits, handling arranged', price: '£150/trip' },
  { service: 'Expense Tracking', desc: 'Monthly reports and analysis', price: 'Included' },
  { service: 'Regulatory Filing', desc: 'AOC support and compliance', price: '£2,500/year' },
];

// Quick contact methods
const quickContacts = [
  { dept: 'New Sales', name: 'Michael Thompson', email: 'michael@hqaviation.co.uk', phone: '+44 1234 567 001' },
  { dept: 'Used Aircraft', name: 'Sarah Williams', email: 'sarah@hqaviation.co.uk', phone: '+44 1234 567 002' },
  { dept: 'Finance', name: 'David Chen', email: 'david@hqaviation.co.uk', phone: '+44 1234 567 003' },
  { dept: 'After Sales', name: 'Emma Roberts', email: 'emma@hqaviation.co.uk', phone: '+44 1234 567 004' },
];

// Aircraft comparison quick view
const quickComparison = [
  { model: 'R22', ideal: 'Training, Budget flying', notIdeal: 'Family trips, Long range' },
  { model: 'R44', ideal: 'Private ownership, Training', notIdeal: 'Heavy utility, IFR' },
  { model: 'R66', ideal: 'Charter, Business, Family', notIdeal: 'Budget-conscious buyers' },
  { model: 'R88', ideal: 'Commercial ops, Large groups', notIdeal: 'First-time owners' },
];

// Maps model id → textSections section id
const salesModelSectionId = {
  r88: 'sales-model-r88',
  r66: 'sales-model-r66',
  r44: 'sales-model-r44',
  r22: 'sales-model-r22',
};

function Sales() {
  const pageImages = usePageImages('sales');
  useCmsHighlight();
  const { t } = usePageText('sales');
  const [openFaq, setOpenFaq] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const { faqs } = useFaqs('sales', { visibleOnly: true });

  // Per-model CMS image helpers (keyed by index matching aircraftModels order)
  const getModelHero   = (model) => pageImages['sales-aircraft-hero']?.[aircraftModels.findIndex(m => m.id === model.id)]?.url   ?? model.image;
  const getModelCutout = (model) => pageImages['sales-aircraft-cutout']?.[aircraftModels.findIndex(m => m.id === model.id)]?.url ?? model.cutout;

  const usedAircraftWithCms = usedAircraft.map((a, i) => ({
    ...a,
    image: pageImages['sales-used']?.[i]?.url ?? a.image,
  }));

  const paintSchemesWithCms = paintSchemes.map((s, i) => ({
    ...s,
    image: pageImages['sales-paint']?.[i]?.url ?? s.image,
  }));

  const [activeModel, setActiveModel] = useState(aircraftModels[0]);
  const [activeSubtype, setActiveSubtype] = useState(aircraftModels[0].subtypes[0]);
  const [hoveredModel, setHoveredModel] = useState(null);
  const [slideDirection, setSlideDirection] = useState(0); // -1 = left, 1 = right
  const [compareSelected, setCompareSelected] = useState([]);
  const [auxTankEnabled, setAuxTankEnabled] = useState(false);
  const heroRef = useRef(null);
  const galleryRef = useRef(null);

  // Comparison tool functions
  const toggleCompareSelect = (model) => {
    if (compareSelected.includes(model)) {
      setCompareSelected(compareSelected.filter(s => s !== model));
      if (model === 'R66 Turbine') setAuxTankEnabled(false);
    } else if (compareSelected.length < 3) {
      setCompareSelected([...compareSelected, model]);
    }
  };

  const getCompareValue = (aircraft, field) => {
    if (auxTankEnabled && aircraft.model === 'R66 Turbine' && aircraft.auxTankSpecs?.[field]) {
      return aircraft.auxTankSpecs[field];
    }
    return aircraft[field];
  };

  const selectedCompareSpecs = aircraftSpecsForCompare.filter(a => compareSelected.includes(a.model));
  const r66CompareSelected = compareSelected.includes('R66 Turbine');

  const scrollGallery = useCallback((direction) => {
    if (galleryRef.current) {
      const scrollAmount = 400;
      galleryRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle model change with direction tracking
  const handleModelChange = useCallback((newModel) => {
    const currentIndex = aircraftModels.findIndex(m => m.id === activeModel.id);
    const newIndex = aircraftModels.findIndex(m => m.id === newModel.id);
    setSlideDirection(newIndex > currentIndex ? 1 : -1);
    setActiveModel(newModel);
    setActiveSubtype(newModel.subtypes[0]); // Reset to first subtype
  }, [activeModel.id]);

  const handlePrevModel = useCallback(() => {
    const currentIndex = aircraftModels.findIndex(m => m.id === activeModel.id);
    const prevIndex = currentIndex === 0 ? aircraftModels.length - 1 : currentIndex - 1;
    const newModel = aircraftModels[prevIndex];
    setSlideDirection(-1);
    setActiveModel(newModel);
    setActiveSubtype(newModel.subtypes[0]);
  }, [activeModel.id]);

  const handleNextModel = useCallback(() => {
    const currentIndex = aircraftModels.findIndex(m => m.id === activeModel.id);
    const nextIndex = currentIndex === aircraftModels.length - 1 ? 0 : currentIndex + 1;
    const newModel = aircraftModels[nextIndex];
    setSlideDirection(1);
    setActiveModel(newModel);
    setActiveSubtype(newModel.subtypes[0]);
  }, [activeModel.id]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="sales-page">
      <SalesHeader />

      {/* ========== HERO: Flagship R88 ========== */}
      <section ref={heroRef} className="sales-hero" data-cms-section="sales-aircraft-hero">
        <motion.div
          className="sales-hero__bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={getModelHero(activeModel)} alt="" />
        </motion.div>
        <div className="sales-hero__overlay" />

        <motion.div
          className="sales-hero__content"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="sales-hero__left">
            <motion.span
              className="sales-hero__label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              AIRCRAFT SALES
            </motion.span>

            <div className="sales-hero__headline">
              <motion.span
                className="sales-hero__word sales-hero__word--1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                ROBINSON
              </motion.span>
              <motion.span
                className="sales-hero__word sales-hero__word--2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                SPECIALISTS
              </motion.span>
            </div>

            <motion.div
              className="sales-hero__divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="sales-hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              The UK's leading Robinson dealer since 2010. New and pre-owned helicopters, factory support, and lifetime partnership.
            </motion.p>

            <motion.div
              className="sales-hero__stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="sales-hero__stat">
                <span className="sales-hero__stat-num">500+</span>
                <span className="sales-hero__stat-label">Aircraft Delivered</span>
              </div>
              <div className="sales-hero__stat-divider" />
              <div className="sales-hero__stat">
                <span className="sales-hero__stat-num">15</span>
                <span className="sales-hero__stat-label">Years Experience</span>
              </div>
              <div className="sales-hero__stat-divider" />
              <div className="sales-hero__stat">
                <span className="sales-hero__stat-num">UK</span>
                <span className="sales-hero__stat-label">#1 Dealer</span>
              </div>
            </motion.div>

            <motion.div
              className="sales-hero__cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <a href="#models" className="sales-btn sales-btn--primary">Explore Models</a>
              <a href="/contact" className="sales-btn sales-btn--outline">Contact Sales</a>
            </motion.div>
          </div>
        </motion.div>

        <div className="sales-hero__scroll">
          <span>Scroll</span>
          <div className="sales-hero__scroll-line">
            <div className="sales-hero__scroll-progress" />
          </div>
        </div>
      </section>

      {/* ========== INTRO TEXT ========== */}
      <section className="sales-intro">
        <div className="sales-intro__container">
          <Reveal>
            <p className="sales-intro__text">
              Robinson helicopters offer exceptional value compared to other light helicopter
              manufacturers. With significantly lower purchase prices and operating costs than
              competitors, Robinson provides better economics without compromising on quality.
              Parts availability is excellent globally, and maintenance is designed to be owner-friendly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ========== NEW AIRCRAFT LINEUP ========== */}
      <section id="models" className="sales-lineup" data-cms-section="sales-aircraft-cutout">
        <div className="sales-lineup__container">
          <Reveal>
            <div className="sales-lineup__header">
              <span className="sales-pre-text">New Aircraft</span>
              <h2>
                <span className="sales-text--dark">The</span>{' '}
                <span className="sales-text--mid">Robinson</span>{' '}
                <span className="sales-text--light">Lineup</span>
              </h2>
              <p>
                Four exceptional models. One legendary manufacturer.
                Every Robinson delivers unmatched value, reliability, and performance.
              </p>
            </div>
          </Reveal>

          {/* Model Selector */}
          <div className="sales-lineup__selector">
            {aircraftModels.map((model, i) => (
              <Reveal key={model.id} delay={i * 0.1}>
                <button
                  className={`sales-lineup__tab ${activeModel.id === model.id ? 'sales-lineup__tab--active' : ''}`}
                  onClick={() => handleModelChange(model)}
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                >
                  {model.badge && <span className="sales-lineup__tab-badge">{model.badge}</span>}
                  <span className="sales-lineup__tab-name">{t(salesModelSectionId[model.id], 'name') || model.name}</span>
                  <span className="sales-lineup__tab-tagline">{t(salesModelSectionId[model.id], 'tagline') || model.tagline}</span>
                </button>
              </Reveal>
            ))}
          </div>

          {/* Active Model Display */}
          <div key={activeModel.id} className="sales-lineup__display">
            <div className="sales-lineup__image-wrapper">
              <div className="sales-lineup__image-row">
                <button className="sales-lineup__chevron sales-lineup__chevron--prev" onClick={handlePrevModel} aria-label="Previous model">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="sales-lineup__image">
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.img
                      key={activeModel.id}
                      src={getModelCutout(activeModel)}
                      alt={activeModel.name}
                      custom={slideDirection}
                      initial={{ x: slideDirection * 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: slideDirection * -100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </AnimatePresence>
                </div>

                <button className="sales-lineup__chevron sales-lineup__chevron--next" onClick={handleNextModel} aria-label="Next model">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="sales-lineup__divider" />

              <div className="sales-lineup__actions">
                <Link to={`/aircraft-sales/new/${activeModel.id}`} className="sales-btn sales-btn--primary">
                  View Details
                </Link>
              </div>
            </div>

            <div className="sales-lineup__divider-vertical"></div>

            <div className="sales-lineup__info">
                <div className="sales-lineup__model-header">
                  <h3>{t(salesModelSectionId[activeModel.id], 'name') || activeModel.name}</h3>
                  <span className="sales-lineup__tagline">{t(salesModelSectionId[activeModel.id], 'tagline') || activeModel.tagline}</span>
                  <div className="sales-lineup__header-divider" />
                  {activeModel.subtypes.length > 1 && (
                    <div className="sales-lineup__subtypes">
                      {activeModel.subtypes.map((subtype) => (
                        <button
                          key={subtype.id}
                          className={`sales-lineup__subtype ${activeSubtype.id === subtype.id ? 'sales-lineup__subtype--active' : ''}`}
                          onClick={() => setActiveSubtype(subtype)}
                        >
                          {subtype.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sales-lineup__middle">
                  <p className="sales-lineup__desc">{t(salesModelSectionId[activeModel.id], 'description') || activeSubtype.description}</p>

                  <div className="sales-lineup__specs">
                    <div className="sales-lineup__spec">
                      <span className="sales-lineup__spec-value">{t(salesModelSectionId[activeModel.id], 'seats') || activeModel.seats}</span>
                      <span className="sales-lineup__spec-label">Seats</span>
                    </div>
                    <div className="sales-lineup__spec">
                      <span className="sales-lineup__spec-value">{t(salesModelSectionId[activeModel.id], 'speed') || activeModel.speed}</span>
                      <span className="sales-lineup__spec-label">Knots</span>
                    </div>
                    <div className="sales-lineup__spec">
                      <span className="sales-lineup__spec-value">{t(salesModelSectionId[activeModel.id], 'range') || activeModel.range}</span>
                      <span className="sales-lineup__spec-label">NM Range</span>
                    </div>
                    <div className="sales-lineup__spec">
                      <span className="sales-lineup__spec-value">{t(salesModelSectionId[activeModel.id], 'engine') || activeModel.engine}</span>
                      <span className="sales-lineup__spec-label">Engine</span>
                    </div>
                  </div>
                </div>

                <div className="sales-lineup__price">
                  <span className="sales-lineup__price-label">From</span>
                  <span className="sales-lineup__price-value">{t(salesModelSectionId[activeModel.id], 'price') || activeModel.price}</span>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* ========== COMPARE AIRCRAFT ========== */}
      <section className="sales-compare">
        <div className="sales-compare__container">
          <Reveal>
            <div className="sales-section-header">
              <span className="sales-pre-text">Decision Tool</span>
              <h2><span className="sales-text--dark">Compare </span><span className="sales-text--mid">Aircraft</span></h2>
              <p>Select up to 3 aircraft models to compare specifications</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="sales-compare__selector">
              {aircraftSpecsForCompare.map(aircraft => (
                <div key={aircraft.model} className="sales-compare__chip-wrapper">
                  <button
                    className={`sales-compare__chip ${compareSelected.includes(aircraft.model) ? 'selected' : ''}`}
                    onClick={() => toggleCompareSelect(aircraft.model)}
                    disabled={!compareSelected.includes(aircraft.model) && compareSelected.length >= 3}
                  >
                    {aircraft.model}
                    {compareSelected.includes(aircraft.model) && <span className="sales-compare__check">✓</span>}
                  </button>
                  {aircraft.model === 'R66 Turbine' && r66CompareSelected && (
                    <motion.div
                      className="sales-compare__aux-dropdown"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="sales-compare__aux-label">
                        <input
                          type="checkbox"
                          checked={auxTankEnabled}
                          onChange={(e) => setAuxTankEnabled(e.target.checked)}
                          className="sales-compare__aux-checkbox"
                        />
                        <span className="sales-compare__aux-check">
                          {auxTankEnabled && <span>✓</span>}
                        </span>
                        <span className="sales-compare__aux-text">+ Auxiliary Tank</span>
                      </label>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
          {selectedCompareSpecs.length > 0 && (
            <motion.div className="sales-compare__table" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="sales-compare__row sales-compare__row--header">
                <div className="sales-compare__cell">Specification</div>
                {selectedCompareSpecs.map(a => (
                  <div key={a.model} className="sales-compare__cell">
                    {a.model}
                    {a.model === 'R66 Turbine' && auxTankEnabled && <span className="sales-compare__aux-badge">+ AUX</span>}
                  </div>
                ))}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Seats</div>
                {selectedCompareSpecs.map(a => <div key={a.model} className="sales-compare__cell">{a.seats}</div>)}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Engine</div>
                {selectedCompareSpecs.map(a => <div key={a.model} className="sales-compare__cell">{a.engine}</div>)}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Max Speed</div>
                {selectedCompareSpecs.map(a => <div key={a.model} className="sales-compare__cell">{a.maxSpeed}</div>)}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Cruise Speed</div>
                {selectedCompareSpecs.map(a => <div key={a.model} className="sales-compare__cell">{a.cruiseSpeed}</div>)}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Range</div>
                {selectedCompareSpecs.map(a => (
                  <div key={a.model} className={`sales-compare__cell ${a.model === 'R66 Turbine' && auxTankEnabled ? 'sales-compare__cell--highlighted' : ''}`}>
                    {getCompareValue(a, 'range')}
                  </div>
                ))}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Endurance</div>
                {selectedCompareSpecs.map(a => (
                  <div key={a.model} className={`sales-compare__cell ${a.model === 'R66 Turbine' && auxTankEnabled ? 'sales-compare__cell--highlighted' : ''}`}>
                    {getCompareValue(a, 'endurance')}
                  </div>
                ))}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Useful Load</div>
                {selectedCompareSpecs.map(a => <div key={a.model} className="sales-compare__cell">{a.usefulLoad}</div>)}
              </div>
              <div className="sales-compare__row">
                <div className="sales-compare__cell sales-compare__cell--label">Fuel Capacity</div>
                {selectedCompareSpecs.map(a => (
                  <div key={a.model} className={`sales-compare__cell ${a.model === 'R66 Turbine' && auxTankEnabled ? 'sales-compare__cell--highlighted' : ''}`}>
                    {getCompareValue(a, 'fuelCapacity')}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ========== VIDEO WALKTHROUGHS ========== */}
      <section className="sales-video sales-video--compact">
        <div className="sales-video__container">
          <div className="sales-video__divider" />
          <h3 className="sales-video__label">See our Aircraft Walkthroughs</h3>
          <div className="sales-video__grid">
            {videoContent.map((video, i) => (
              <motion.div
                key={i}
                className="sales-video__card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="sales-video__thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="sales-video__play">
                    <span>▶</span>
                  </div>
                  <span className="sales-video__duration">{video.duration}</span>
                </div>
                <h4>{video.title}</h4>
              </motion.div>
            ))}
          </div>
          <div className="sales-video__divider" />
        </div>
      </section>

      {/* ========== AUTHORIZED DEALER SECTION ========== */}
      <section className="sales-dealer">
        <div className="sales-dealer__container">
          <Reveal>
            <div className="sales-dealer__content">
              <div className="sales-dealer__logos">
                <img
                  src="/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-white-type.svg"
                  alt="Robinson Authorized Dealer"
                />
                <span className="sales-dealer__dot">•</span>
                <img
                  src="/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-white-type.svg"
                  alt="Robinson Authorized Service Center"
                />
              </div>
              <div className="sales-dealer__text">
                <h2>Official Robinson Partner</h2>
                <p>
                  As an Authorized Robinson Dealer and Service Centre, we provide factory-direct sales,
                  certified maintenance, and three decades of exclusive Robinson expertise.
                </p>
              </div>
              <div className="sales-dealer__features">
                <div className="sales-dealer__feature">
                  <span className="sales-dealer__feature-icon">✓</span>
                  <span>Factory-Direct Pricing</span>
                </div>
                <div className="sales-dealer__feature">
                  <span className="sales-dealer__feature-icon">✓</span>
                  <span>Full Warranty Support</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== BUYING PROCESS ========== */}
      <section className="sales-process">
        <div className="sales-process__container">
          <Reveal>
            <div className="sales-section-header">
              <span className="sales-pre-text">{t('sales-process', 'pre_label') || 'Your Journey'}</span>
              <h2>
                <span className="sales-text--dark">The</span>{' '}
                <span className="sales-text--mid">Buying</span>{' '}
                <span className="sales-text--light">Process</span>
              </h2>
            </div>
          </Reveal>

          <div className="sales-process__timeline">
            <div className="sales-process__line" />
            {buyingSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="sales-process__item">
                  <div className="sales-process__marker">
                    <span className="sales-process__num">{step.num}</span>
                  </div>
                  <div className="sales-process__content">
                    <h4>{t('sales-process', `step_${i + 1}_title`) || step.title}</h4>
                    <p>{t('sales-process', `step_${i + 1}_desc`) || step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TRADE-IN & LEASEBACK ========== */}
      <section className="sales-tradein">
        <div className="sales-tradein__inner">
          <div className="sales-tradein__grid">
            <Reveal>
              <div className="sales-tradein__card">
                <span className="sales-pre-text">Free Aircraft Valuation</span>
                <h3>Trade In Your Aircraft</h3>
                <p>
                  Ready for an upgrade? Get a complimentary market valuation and apply it directly to your new purchase.
                </p>
                <div className="sales-tradein__features">
                  <div className="sales-tradein__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>No obligation valuation</span>
                  </div>
                  <div className="sales-tradein__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Fair market pricing</span>
                  </div>
                </div>
                <a href="/contact?subject=valuation" className="sales-btn sales-btn--white">
                  Get Free Valuation
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="sales-tradein__card">
                <span className="sales-pre-text">Earn While You Own</span>
                <h3>Leaseback Program</h3>
                <p>
                  Put your aircraft to work when you're not flying. Earn revenue through charter and training operations.
                </p>
                <div className="sales-tradein__features">
                  <div className="sales-tradein__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Offset ownership costs</span>
                  </div>
                  <div className="sales-tradein__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Professional management</span>
                  </div>
                </div>
                <Link to="/leaseback" className="sales-btn sales-btn--white">
                  Learn More
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== WHY HQ AVIATION ========== */}
      <section className="sales-why">
        <div className="sales-why__container">
          <Reveal>
            <div className="sales-section-header">
              <span className="sales-pre-text">The HQ Difference</span>
              <h2>
                <span className="sales-text--dark">Why</span>{' '}
                <span className="sales-text--mid">Buy From</span>{' '}
                <span className="sales-text--light">HQ Aviation</span>
              </h2>
            </div>
          </Reveal>

          <div className="sales-why__grid">
            <Reveal delay={0.1}>
              <div className="sales-why__card">
                <span className="sales-why__num">01</span>
                <h4>Lifetime Partnership</h4>
                <p>
                  Your purchase is just the beginning. We provide maintenance
                  and support throughout your ownership journey.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="sales-why__card">
                <span className="sales-why__num">02</span>
                <h4>Expert Knowledge</h4>
                <p>
                  15 years of exclusive Robinson focus. Our team knows these aircraft
                  better than anyone in the UK.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="sales-why__card">
                <span className="sales-why__num">03</span>
                <h4>Complete Service</h4>
                <p>
                  Sales, maintenance, training, hangarage, and expeditions—
                  everything under one roof at Denham Aerodrome.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="sales-why__card">
                <span className="sales-why__num">04</span>
                <h4>Community</h4>
                <p>
                  Join a thriving community of helicopter owners and enthusiasts.
                  Group trips, events, and shared adventures await.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5}>
            <div className="sales-insurance__compact">
              <img
                alt="Hayward Aviation"
                className="sales-insurance__logo"
                src="/assets/images/logos/partners/hayward-fleet-insurance-copy.png"
              />
              <div className="sales-insurance__content">
                <h4>Aviation Insurance</h4>
                <p>
                  Due to our fleet size and existing relationship with Hayward Aviation,
                  we secure competitive insurance pricing for our customers. Hayward specialises
                  in helicopter insurance and understands the unique needs of Robinson owners.
                </p>
              </div>
              <a href="/contact?subject=insurance" className="sales-btn sales-btn--primary">
                Get a Quote
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== SECTION 14: GALLERY ========== */}
      <section className="sales-gallery">
        <div className="sales-gallery__container">
          <Reveal>
            <div className="sales-section-header">
              <span className="sales-pre-text">Visual Excellence</span>
              <h2>
                <span className="sales-text--white">Recent</span>{' '}
                <span className="sales-text--light">Deliveries</span>
              </h2>
            </div>
          </Reveal>

          <div className="sales-gallery__wrapper">
            <button className="sales-gallery__chevron sales-gallery__chevron--prev" onClick={() => scrollGallery(-1)} aria-label="Previous images">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="sales-gallery__scroll" ref={galleryRef} data-cms-section="sales-gallery">
              <motion.div className="sales-gallery__item sales-gallery__item--tall" whileHover={{ scale: 1.02 }}>
                <img src={pageImages['sales-gallery']?.[0]?.url || '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg'} alt="R88" />
                <span className="sales-gallery__label">R88 — The Future</span>
              </motion.div>
              <div className="sales-gallery__stack">
                <motion.div className="sales-gallery__item sales-gallery__item--small" whileHover={{ scale: 1.02 }}>
                  <img src={pageImages['sales-gallery']?.[1]?.url || '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-view-13611.jpg'} alt="R66" />
                  <span className="sales-gallery__label">R66 Palo Verde</span>
                </motion.div>
                <motion.div className="sales-gallery__item sales-gallery__item--small" whileHover={{ scale: 1.02 }}>
                  <img src={pageImages['sales-gallery']?.[2]?.url || '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-dramatic-overhead-13365.jpg'} alt="R66 Interior" />
                  <span className="sales-gallery__label">R66 Overhead</span>
                </motion.div>
              </div>
              <motion.div className="sales-gallery__item sales-gallery__item--wide" whileHover={{ scale: 1.02 }}>
                <img src={pageImages['sales-gallery']?.[3]?.url || '/assets/images/new-aircraft/r88/rhc-r88-left-pilot-seat-full-frame-13570.jpg'} alt="R88 Cockpit" />
                <span className="sales-gallery__label">R88 Cockpit</span>
              </motion.div>
              <div className="sales-gallery__stack">
                <motion.div className="sales-gallery__item sales-gallery__item--small" whileHover={{ scale: 1.02 }}>
                  <img src={pageImages['sales-gallery']?.[4]?.url || '/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg'} alt="Avionics" />
                  <span className="sales-gallery__label">Glass Cockpit</span>
                </motion.div>
                <motion.div className="sales-gallery__item sales-gallery__item--small" whileHover={{ scale: 1.02 }}>
                  <img src={pageImages['sales-gallery']?.[5]?.url || '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg'} alt="R66 Riviera" />
                  <span className="sales-gallery__label">R66 Riviera</span>
                </motion.div>
              </div>
              <motion.div className="sales-gallery__item sales-gallery__item--tall" whileHover={{ scale: 1.02 }}>
                <img src={pageImages['sales-gallery']?.[6]?.url || '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png'} alt="R44 Raven II" />
                <span className="sales-gallery__label">R44 Raven II</span>
              </motion.div>
              <div className="sales-gallery__stack">
                <motion.div className="sales-gallery__item sales-gallery__item--small" whileHover={{ scale: 1.02 }}>
                  <img src={pageImages['sales-gallery']?.[7]?.url || '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png'} alt="R22 Beta II" />
                  <span className="sales-gallery__label">R22 Beta II</span>
                </motion.div>
                <motion.div className="sales-gallery__item sales-gallery__item--small" whileHover={{ scale: 1.02 }}>
                  <img src={pageImages['sales-gallery']?.[8]?.url || '/assets/images/new-aircraft/r88/r88-jellybean-left.png'} alt="R88 Profile" />
                  <span className="sales-gallery__label">R88 Profile</span>
                </motion.div>
              </div>
            </div>

            <button className="sales-gallery__chevron sales-gallery__chevron--next" onClick={() => scrollGallery(1)} aria-label="Next images">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      {faqs.length > 0 && (
        <section className="sales-faq" data-cms-section="faqs-sales">
          <div className="sales-faq__container">
            <Reveal>
              <div className="sales-faq__header">
                <span className="sales-pre-text">Common Questions</span>
                <h2>Frequently Asked</h2>
              </div>
            </Reveal>
            <div className="sales-faq__list">
              {(showAllFaqs ? faqs : faqs.slice(0, 6)).map((faq, i) => (
                <Reveal key={faq.id} delay={i * 0.05}>
                  <div
                    className={`sales-faq__item ${openFaq === i ? 'sales-faq__item--open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ cursor: 'pointer', borderBottom: '1px solid #e8e6e2', padding: '1.25rem 0', display: 'flex', gap: '1.5rem' }}
                  >
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: '#ccc', flexShrink: 0, paddingTop: '0.1rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        {faq.question}
                        <span style={{ fontSize: '1.25rem', fontWeight: 300, color: '#999', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                      </h4>
                      <motion.div
                        initial={false}
                        animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ margin: '0.75rem 0 0', color: '#666', lineHeight: 1.7, fontSize: '0.95rem' }}>{faq.answer}</p>
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            {!showAllFaqs && faqs.length > 6 && (
              <button className="sales-faq__load-more" onClick={() => setShowAllFaqs(true)}>Load More</button>
            )}
          </div>
        </section>
      )}

      {/* ========== CONTACT CTA ========== */}
      <section className="sales-contact">
        <div className="sales-contact__inner">
          <Reveal>
            <div className="sales-contact__content">
              <span className="sales-pre-text">{t('sales-cta', 'pre_label') || 'Ready to Begin?'}</span>
              <h2>
                <span className="sales-text--light">Let's Talk</span>{' '}
                <span className="sales-text--white">About Your</span>{' '}
                <span className="sales-text--white">Next Aircraft</span>
              </h2>
              <p>
                {t('sales-cta', 'description') || "Whether you're a first-time buyer or expanding your fleet, our team is ready to guide you to the perfect helicopter."}
              </p>
              <div className="sales-contact__actions">
                <a href="tel:+441234567890" className="sales-btn sales-btn--white">
                  {t('sales-cta', 'cta_phone') || 'Call +44 1234 567 890'}
                </a>
                <Link to="/contact?subject=aircraft-sales" className="sales-btn sales-btn--outline-white">
                  {t('sales-cta', 'cta_email') || 'Send Enquiry'}
                </Link>
              </div>
              <div className="sales-contact__location">
                <span>{t('sales-cta', 'location') || 'HQ Aviation · Denham Aerodrome · UB9 5DF'}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <FooterMinimal />

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== BASE ===== */
        .sales-page {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        .sales-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888;
          margin-bottom: 1rem;
        }

        .sales-text--dark { color: #1a1a1a; }
        .sales-text--mid { color: #4a4a4a; }
        .sales-text--light { color: #7a7a7a; }
        .sales-text--white { color: #fff; }

        .sales-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .sales-section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-section-header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        /* Buttons */
        .sales-btn {
          display: inline-block;
          padding: 1rem 2rem;
          font-size: 0.75rem;
          font-weight: 400;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .sales-btn--primary {
          background: #1a1a1a;
          color: #fff;
        }

        .sales-btn--primary:hover {
          background: #333;
          color: #fff;
        }

        .sales-btn--outline {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }

        .sales-btn--outline:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .sales-btn--white {
          background: #fff;
          color: #1a1a1a;
        }

        .sales-btn--white:hover {
          background: #f0f0f0;
        }

        .sales-btn--outline-white {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }

        .sales-btn--outline-white:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        .sales-btn--small {
          padding: 0.6rem 1.25rem;
          font-size: 0.65rem;
        }

        /* ===== HERO ===== */
        .sales-hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #1a1a1a;
        }

        .sales-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .sales-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
        }

        .sales-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.7) 50%, rgba(26,26,26,0.3) 100%);
        }

        .sales-hero__content {
          position: relative;
          z-index: 3;
          padding: 2rem 4rem;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .sales-hero__left {
          max-width: 600px;
        }

        .sales-hero__badge {
          margin-bottom: 2rem;
        }

        .sales-hero__dealer-logo {
          height: 80px;
          width: auto;
        }

        .sales-hero__label {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 1.5rem;
        }

        .sales-hero__headline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .sales-hero__word {
          font-weight: 700;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .sales-hero__word--1 {
          color: #fff;
        }

        .sales-hero__word--2 {
          color: rgba(255,255,255,0.6);
        }

        .sales-hero__divider {
          width: 80px;
          height: 2px;
          background: #fff;
          margin-bottom: 1.5rem;
          transform-origin: left;
        }

        .sales-hero__sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-hero__stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2.5rem;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255,255,255,0.15);
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .sales-hero__stat {
          text-align: center;
        }

        .sales-hero__stat-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .sales-hero__stat-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
        }

        .sales-hero__stat-divider {
          width: 1px;
          height: 35px;
          background: rgba(255,255,255,0.2);
        }

        .sales-hero__cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .sales-hero__cta .sales-btn--primary {
          background: #fff;
          color: #1a1a1a;
        }

        .sales-hero__cta .sales-btn--primary:hover {
          background: #f0f0f0;
        }

        .sales-hero__cta .sales-btn--outline {
          color: #fff;
          border-color: rgba(255,255,255,0.5);
        }

        .sales-hero__cta .sales-btn--outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        .sales-hero__scroll {
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

        .sales-hero__scroll span {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
        }

        .sales-hero__scroll-line {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
        }

        .sales-hero__scroll-progress {
          position: absolute;
          top: -30%;
          left: 0;
          width: 100%;
          height: 30%;
          background: #fff;
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% { top: -30%; }
          100% { top: 100%; }
        }

        /* ===== INTRO ===== */
        .sales-intro {
          padding: 4rem 2rem;
          background: #faf9f6;
        }

        .sales-intro__container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .sales-intro__text {
          font-size: 1.15rem;
          line-height: 1.9;
          color: #444;
          margin: 0;
        }

        /* ===== LINEUP ===== */
        .sales-lineup {
          padding: 6rem 2rem 10px;
          background: #fff;
        }

        .sales-lineup__container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .sales-lineup__header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .sales-lineup__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-lineup__header p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .sales-lineup__selector {
          display: inline-flex;
          justify-content: center;
          gap: 0;
          margin: 0 auto 1.5rem;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          overflow: hidden;
        }

        .sales-lineup__tab {
          padding: 0.75rem 1.25rem;
          background: #faf9f6;
          border: none;
          border-right: 1px solid #e8e6e2;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
        }

        .sales-lineup__tab:last-child {
          border-right: none;
        }

        .sales-lineup__tab:hover {
          background: #f0efe8;
        }

        .sales-lineup__tab--active {
          background: #1a1a1a;
        }

        .sales-lineup__tab--active .sales-lineup__tab-name {
          color: #fff;
        }

        .sales-lineup__tab--active .sales-lineup__tab-tagline {
          color: rgba(255,255,255,0.6);
        }

        .sales-lineup__tab-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #e04a2f;
          color: #fff;
          font-size: 0.5rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          letter-spacing: 0.1em;
          border-radius: 2px;
        }

        .sales-lineup__tab-name {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.15rem;
        }

        .sales-lineup__tab-tagline {
          font-size: 0.55rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sales-lineup__display {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          align-items: start;
          padding: 2rem 2rem 2.5rem;
          background: linear-gradient(135deg, #faf9f6 0%, #f0efe8 100%);
          border-radius: 12px;
          height: 520px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.06);
        }

        .sales-lineup__image-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          height: 100%;
        }

        .sales-lineup__image-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .sales-lineup__chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1.5px solid #1a1a1a;
          border-radius: 50%;
          background: transparent;
          color: #1a1a1a;
          cursor: pointer;
          transition: background 0.3s cubic-bezier(0.33, 1, 0.68, 1),
                      color 0.3s cubic-bezier(0.33, 1, 0.68, 1),
                      border-color 0.3s cubic-bezier(0.33, 1, 0.68, 1);
          flex-shrink: 0;
        }

        .sales-lineup__chevron:hover {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .sales-lineup__chevron:active {
          background: #E04A2F;
          border-color: #E04A2F;
          color: #fff;
        }

        .sales-lineup__image {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .sales-lineup__image img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
        }

        .sales-lineup__info {
          max-width: 450px;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .sales-lineup__model-header {
          margin-bottom: 0;
          text-align: center;
        }

        .sales-lineup__header-divider {
          width: 60px;
          height: 1px;
          background: rgba(0,0,0,0.15);
          margin: 0.75rem auto 0;
        }

        .sales-lineup__middle {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .sales-lineup__model-header h3 {
          font-size: 2.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0;
          line-height: 1;
        }

        .sales-lineup__tagline {
          font-size: 0.9rem;
          color: #666;
        }

        .sales-lineup__subtypes {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .sales-lineup__subtype {
          padding: 0.5rem 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: transparent;
          border: 1px solid #ddd;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sales-lineup__subtype:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        .sales-lineup__subtype--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        .sales-lineup__desc {
          color: #666;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .sales-lineup__specs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-lineup__spec {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .sales-lineup__spec-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .sales-lineup__spec-label {
          font-size: 0.6rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sales-lineup__price {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: auto;
          text-align: right;
        }

        .sales-lineup__price-label {
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
        }

        .sales-lineup__price-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-lineup__price-note {
          font-size: 0.7rem;
          color: #888;
        }

        .sales-lineup__divider {
          width: 100%;
          max-width: 300px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent);
          margin: 1rem auto;
        }

        .sales-lineup__divider-vertical {
          width: 1px;
          align-self: stretch;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.1), transparent);
        }

        .sales-lineup__actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* ===== COMPARE ===== */
        .sales-compare {
          padding: 3rem 1.5rem;
          background: #f5f4f0;
        }

        .sales-compare__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-compare__selector {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .sales-compare__chip-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sales-compare__chip {
          padding: 0.6rem 1.25rem;
          background: #fff;
          border: 1px solid #e0deda;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sales-compare__chip:hover:not(:disabled) {
          border-color: #1a1a1a;
        }

        .sales-compare__chip.selected {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .sales-compare__chip:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sales-compare__check {
          font-size: 0.7rem;
        }

        .sales-compare__aux-dropdown {
          overflow: hidden;
        }

        .sales-compare__aux-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: #fff;
          border: 1px solid #e0deda;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .sales-compare__aux-label:hover {
          border-color: #1a1a1a;
        }

        .sales-compare__aux-checkbox {
          display: none;
        }

        .sales-compare__aux-check {
          width: 14px;
          height: 14px;
          border: 1px solid #ccc;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          transition: all 0.2s ease;
        }

        .sales-compare__aux-checkbox:checked + .sales-compare__aux-check {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        .sales-compare__aux-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #666;
        }

        .sales-compare__table {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0deda;
        }

        .sales-compare__row {
          display: grid;
          grid-template-columns: 1fr repeat(3, 1fr);
          border-bottom: 1px solid #f0efec;
        }

        .sales-compare__row:last-child {
          border-bottom: none;
        }

        .sales-compare__row--header {
          background: #1a1a1a;
          color: #fff;
        }

        .sales-compare__row--header .sales-compare__cell {
          font-weight: 600;
          font-size: 0.8rem;
        }

        .sales-compare__cell {
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .sales-compare__cell--label {
          font-weight: 500;
          color: #666;
          font-size: 0.8rem;
        }

        .sales-compare__row:nth-child(even) .sales-compare__cell:not(.sales-compare__cell--label) {
          background: #faf9f6;
        }

        .sales-compare__aux-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          background: rgba(255,255,255,0.2);
          padding: 0.15rem 0.35rem;
          border-radius: 3px;
          margin-left: 0.25rem;
        }

        .sales-compare__cell--highlighted {
          position: relative;
          font-weight: 600;
          color: #1a1a1a;
        }

        .sales-compare__cell--highlighted::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #1a1a1a;
        }

        @media (max-width: 700px) {
          .sales-compare__row {
            grid-template-columns: 1fr repeat(2, 1fr);
          }

          .sales-compare__cell {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        /* ===== DEALER ===== */
        .sales-dealer {
          padding: 2.5rem 2rem;
          background: #1a1a1a;
          color: #fff;
        }

        .sales-dealer__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-dealer__content {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .sales-dealer__logos {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .sales-dealer__logos img {
          height: 80px;
          width: auto;
        }

        .sales-dealer__dot {
          color: rgba(255,255,255,0.3);
          font-size: 1rem;
        }

        .sales-dealer__text {
          flex: 1;
        }

        .sales-dealer__content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
          color: rgba(255,255,255,0.6);
        }

        .sales-dealer__content p {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        .sales-dealer__features {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .sales-dealer__feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
        }

        .sales-dealer__feature-icon {
          color: #4ade80;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .sales-dealer__content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .sales-dealer__logos {
            justify-content: center;
          }

          .sales-dealer__logos img {
            height: 65px;
          }

          .sales-dealer__features {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
        }

        /* ===== PROCESS ===== */
        .sales-process {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-process__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-process__timeline {
          position: relative;
          display: flex;
          justify-content: space-between;
          padding-top: 3rem;
        }

        .sales-process__line {
          position: absolute;
          top: 3rem;
          left: 5%;
          right: 5%;
          height: 2px;
          background: linear-gradient(90deg, #e8e6e2 0%, #1a1a1a 20%, #1a1a1a 80%, #e8e6e2 100%);
          transform: translateY(20px);
        }

        .sales-process__item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .sales-process__marker {
          margin-bottom: 1rem;
        }

        .sales-process__num {
          width: 44px;
          height: 44px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          border-radius: 50%;
          border: 3px solid #faf9f6;
        }

        .sales-process__content {
          max-width: 140px;
        }

        .sales-process__content h4 {
          margin: 0 0 0.35rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .sales-process__content p {
          margin: 0;
          font-size: 0.75rem;
          color: #888;
          line-height: 1.4;
        }

        /* ===== USED AIRCRAFT ===== */
        .sales-used {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-used__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-used__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .sales-used__card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .sales-used__card:hover {
          border-color: #ccc;
        }

        .sales-used__image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .sales-used__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .sales-used__card:hover .sales-used__image img {
          transform: scale(1.05);
        }

        .sales-used__status {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 0.65rem;
          border-radius: 2px;
        }

        .sales-used__status--available {
          background: rgba(74, 222, 128, 0.9);
          color: #fff;
        }

        .sales-used__status--under-offer {
          background: rgba(251, 191, 36, 0.9);
          color: #1a1a1a;
        }

        .sales-used__info {
          padding: 1.25rem;
        }

        .sales-used__header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .sales-used__header h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .sales-used__year {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #888;
        }

        .sales-used__details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-used__hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #888;
        }

        .sales-used__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-used__cta {
          text-align: center;
          margin-top: 2.5rem;
        }

        /* ===== WHY HQ ===== */
        .sales-why {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-why__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-why__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          align-items: stretch;
        }

        .sales-why__grid > * {
          height: 100%;
        }

        .sales-why__card {
          background: #fff;
          padding: 2rem;
          border-left: 3px solid #1a1a1a;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .sales-why__num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #ccc;
          margin-bottom: 1rem;
        }

        .sales-why__card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
          text-transform: uppercase;
        }

        .sales-why__card p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ===== CONTACT CTA ===== */
        .sales-contact {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          padding: 6rem 2rem;
        }

        .sales-contact__inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-contact__content {
          text-align: center;
          color: #fff;
        }

        .sales-contact__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-contact__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-contact__content p {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .sales-contact__actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .sales-contact__location {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.4);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .sales-lineup__display {
            grid-template-columns: 1fr;
            gap: 2rem;
            height: auto;
          }

          .sales-lineup__image-wrapper {
            order: -1;
          }

          .sales-lineup__divider {
            display: none;
          }

          .sales-lineup__chevron {
            width: 40px;
            height: 40px;
          }

          .sales-lineup__info {
            max-width: 100%;
            text-align: center;
          }

          .sales-lineup__actions {
            justify-content: center;
          }

          .sales-why__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-used__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-process__timeline {
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
          }

          .sales-process__item {
            flex: 0 0 30%;
          }

          .sales-process__line {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .sales-hero__content {
            padding: 6rem 2rem 2rem;
          }

          .sales-hero__stats {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .sales-hero__stat-divider {
            display: none;
          }

          .sales-lineup__selector {
            flex-direction: column;
          }

          .sales-lineup__tab {
            border-right: none;
            border-bottom: 1px solid #e8e6e2;
          }

          .sales-lineup__tab:last-child {
            border-bottom: none;
          }

          .sales-lineup__specs {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-why__grid {
            grid-template-columns: 1fr;
          }

          .sales-used__grid {
            grid-template-columns: 1fr;
          }

          .sales-process__item {
            flex: 0 0 45%;
          }

          .sales-dealer__logos {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .sales-dealer__logos img {
            height: 60px;
          }

          .sales-dealer__dot {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .sales-hero__headline .sales-hero__word {
            font-size: 2rem;
          }

          .sales-lineup__model-header h3 {
            font-size: 2rem;
          }

          .sales-lineup__price-value {
            font-size: 1.5rem;
          }

          .sales-contact__actions {
            flex-direction: column;
          }

          .sales-contact__actions .sales-btn {
            width: 100%;
            text-align: center;
          }
        }

        /* ===== SECTION 8: R88 SPOTLIGHT ===== */
        .sales-r88 {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #f8f7f4 0%, #faf9f6 100%);
        }

        .sales-r88__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .sales-r88__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-r88__title {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          line-height: 1.1;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-text--accent {
          color: #e04a2f;
        }

        .sales-r88__intro {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-r88__features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sales-r88__feature {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #fff;
          border-left: 2px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .sales-r88__feature:hover {
          border-color: #1a1a1a;
        }

        .sales-r88__feature-icon {
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .sales-r88__feature-title {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .sales-r88__feature-desc {
          font-size: 0.75rem;
          color: #888;
        }

        .sales-r88__cta {
          display: flex;
          gap: 1rem;
        }

        .sales-r88__visual {
          position: relative;
        }

        .sales-r88__image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .sales-r88__image img {
          width: 100%;
          height: auto;
        }

        .sales-r88__badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #e04a2f;
          color: #fff;
          padding: 0.5rem 1rem;
          text-align: center;
        }

        .sales-r88__badge span {
          display: block;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .sales-r88__badge span:first-child {
          font-size: 1.25rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0;
        }

        /* ===== SECTION 9: FINANCING ===== */
        .sales-finance {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-finance__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-finance__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .sales-finance__card {
          background: #faf9f6;
          padding: 2rem 1.5rem;
          border: 1px solid #e8e6e2;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .sales-finance__card--featured {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }

        .sales-finance__ribbon {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #e04a2f;
          color: #fff;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 0.75rem;
        }

        .sales-finance__icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .sales-finance__card h4 {
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .sales-finance__card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
        }

        .sales-finance__card li {
          font-size: 0.8rem;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .sales-finance__card--featured li {
          border-color: rgba(255,255,255,0.1);
        }

        .sales-finance__note {
          font-size: 0.7rem;
          color: #888;
          font-style: italic;
        }

        .sales-finance__card--featured .sales-finance__note {
          color: rgba(255,255,255,0.5);
        }

        .sales-finance__cta {
          text-align: center;
        }

        .sales-finance__cta p {
          color: #888;
          margin-bottom: 1rem;
        }

        /* ===== SECTION 10: TRADE-IN & LEASEBACK ===== */
        .sales-tradein {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 4rem 2rem;
        }

        .sales-tradein__inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-tradein__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .sales-tradein__card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 2rem;
          color: #fff;
        }

        .sales-tradein__card .sales-pre-text {
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 0.5rem;
        }

        .sales-tradein__card h3 {
          font-size: 1.5rem;
          margin: 0 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #fff;
        }

        .sales-tradein__card p {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0 0 1.5rem;
        }

        .sales-tradein__features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .sales-tradein__feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.9);
          font-size: 0.85rem;
        }

        .sales-tradein__feature svg {
          color: #4ade80;
          flex-shrink: 0;
        }

        .sales-tradein__actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .sales-btn--outline-white {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #fff;
        }

        .sales-btn--outline-white:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.6);
        }

        @media (max-width: 768px) {
          .sales-tradein__grid {
            grid-template-columns: 1fr;
          }

          .sales-tradein__card {
            padding: 1.5rem;
          }
        }

        /* ===== SECTION 11: COMPARISON ===== */
        .sales-compare {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-compare__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-compare__table-wrapper {
          overflow-x: auto;
        }

        .sales-compare__table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          font-size: 0.85rem;
        }

        .sales-compare__table th,
        .sales-compare__table td {
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-compare__table th {
          background: #faf9f6;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .sales-compare__table th:first-child,
        .sales-compare__table td:first-child {
          text-align: left;
          font-weight: 500;
        }

        .sales-compare__featured {
          background: rgba(224, 74, 47, 0.05) !important;
        }

        .sales-compare__featured span {
          display: inline-block;
          background: #e04a2f;
          color: #fff;
          font-size: 0.5rem;
          padding: 0.15rem 0.35rem;
          margin-left: 0.5rem;
          vertical-align: middle;
        }

        .sales-compare__note {
          text-align: center;
          font-size: 0.75rem;
          color: #888;
          margin-top: 1rem;
        }

        .sales-compare__note span {
          color: #e04a2f;
        }

        /* ===== SECTION 12: TESTIMONIALS ===== */
        .sales-testimonials {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-testimonials__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-testimonials__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .sales-testimonials__card {
          background: #faf9f6;
          padding: 2rem;
          border: 1px solid #e8e6e2;
        }

        .sales-testimonials__quote {
          margin-bottom: 1.5rem;
        }

        .sales-testimonials__mark {
          font-size: 3rem;
          font-family: Georgia, serif;
          line-height: 0;
          color: #ddd;
          display: block;
          margin-bottom: 0.5rem;
        }

        .sales-testimonials__quote p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #444;
          font-style: italic;
        }

        .sales-testimonials__author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sales-testimonials__avatar {
          width: 44px;
          height: 44px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .sales-testimonials__name {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .sales-testimonials__role {
          font-size: 0.75rem;
          color: #888;
        }

        /* ===== SECTION 13: CONFIGURATION ===== */
        .sales-config {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-config__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-config__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .sales-config__category {
          background: #fff;
          padding: 2rem;
          border-top: 3px solid #1a1a1a;
        }

        .sales-config__category h4 {
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-config__category ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sales-config__category li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          padding: 0.5rem 0;
          color: #555;
        }

        .sales-config__check {
          color: #4ade80;
          font-size: 0.75rem;
        }

        .sales-config__image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .sales-config__image img {
          width: 100%;
          height: auto;
        }

        .sales-config__caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: #fff;
          padding: 2rem 1.5rem 1.5rem;
          font-size: 0.85rem;
        }

        /* ===== SECTION 14: GALLERY ===== */
        .sales-gallery {
          padding: 6rem 2rem;
          background: #1a1a1a;
        }

        .sales-gallery__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .sales-gallery__wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sales-gallery__chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          background: transparent;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .sales-gallery__chevron:hover {
          background: #fff;
          color: #1a1a1a;
          border-color: #fff;
        }

        .sales-gallery__scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.5rem 0;
          align-items: stretch;
          height: 420px;
        }

        .sales-gallery__scroll::-webkit-scrollbar {
          display: none;
        }

        .sales-gallery__stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        .sales-gallery__item {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .sales-gallery__item--tall {
          width: 280px;
          height: 100%;
          scroll-snap-align: start;
        }

        .sales-gallery__item--wide {
          width: 400px;
          height: 100%;
          scroll-snap-align: start;
        }

        .sales-gallery__item--small {
          width: 240px;
          height: calc(50% - 0.5rem);
        }

        .sales-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .sales-gallery__item:hover img {
          transform: scale(1.05);
        }

        .sales-gallery__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: #fff;
          padding: 2rem 1rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ===== SECTION 15: SAFETY ===== */
        .sales-safety {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-safety__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-safety__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e8e6e2;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .sales-safety__item {
          background: #faf9f6;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          cursor: default;
        }

        .sales-safety__icon {
          font-size: 1.5rem;
          opacity: 0.5;
        }

        .sales-safety__text h4 {
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sales-safety__text p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        .sales-safety__cta {
          text-align: center;
        }

        .sales-safety__cta p {
          color: #888;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        /* ===== SECTION 16: ACCESSORIES ===== */
        .sales-accessories {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-accessories__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-accessories__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sales-accessories__item {
          background: #fff;
          padding: 1.25rem;
          border: 1px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .sales-accessories__category {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .sales-accessories__item h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .sales-accessories__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-accessories__cta {
          text-align: center;
        }

        /* ===== SECTION 17: TRAINING PACKAGES ===== */
        .sales-training {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-training__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-training__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-training__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-training__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-training__packages {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sales-training__package {
          background: #faf9f6;
          padding: 1.25rem 1.5rem;
          border-left: 3px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .sales-training__package:hover {
          border-color: #1a1a1a;
        }

        .sales-training__package-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .sales-training__package h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .sales-training__hours {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: #888;
        }

        .sales-training__package ul {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .sales-training__package li {
          font-size: 0.75rem;
          color: #666;
          background: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }

        .sales-training__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-training__visual img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        /* ===== SECTION 18: MAINTENANCE ===== */
        .sales-maintenance {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-maintenance__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-maintenance__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-maintenance__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          text-align: center;
          position: relative;
        }

        .sales-maintenance__card--featured {
          border-color: #1a1a1a;
          border-width: 2px;
        }

        .sales-maintenance__badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          color: #fff;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 0.75rem;
        }

        .sales-maintenance__card h4 {
          font-size: 1.25rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.5rem;
        }

        .sales-maintenance__coverage {
          display: block;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 1.5rem;
        }

        .sales-maintenance__price {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-maintenance__amount {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-maintenance__card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
          text-align: left;
        }

        .sales-maintenance__card li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .sales-maintenance__check {
          color: #4ade80;
          font-size: 0.75rem;
        }

        .sales-btn--full {
          width: 100%;
        }

        /* ===== SECTION 19: DELIVERIES ===== */
        .sales-deliveries {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-deliveries__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-deliveries__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-deliveries__card {
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          overflow: hidden;
        }

        .sales-deliveries__image {
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .sales-deliveries__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .sales-deliveries__card:hover .sales-deliveries__image img {
          transform: scale(1.05);
        }

        .sales-deliveries__info {
          padding: 1rem;
        }

        .sales-deliveries__info h4 {
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sales-deliveries__owner {
          display: block;
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .sales-deliveries__meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #aaa;
          font-family: 'Share Tech Mono', monospace;
        }

        /* ===== SECTION 20: INTERNATIONAL ===== */
        .sales-international {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .sales-international__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-international__content {
          color: #fff;
        }

        .sales-international__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-international__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-international__content p {
          color: rgba(255,255,255,0.7);
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-international__stats {
          display: flex;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .sales-international__stat {
          text-align: center;
        }

        .sales-international__num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .sales-international__stat span:last-child {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
        }

        .sales-international__map {
          position: relative;
        }

        .sales-international__globe {
          width: 100%;
          height: auto;
        }

        /* ===== SECTION 21: INSURANCE ===== */
        .sales-insurance {
          padding: 3rem 2rem;
          background: #faf9f6;
        }

        .sales-insurance__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-insurance__compact {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: #fff;
          padding: 1.5rem 2rem;
          border: 1px solid #e8e6e2;
          margin-top: 2rem;
        }

        .sales-insurance__logo {
          width: 120px;
          height: auto;
          flex-shrink: 0;
        }

        .sales-insurance__content {
          flex: 1;
        }

        .sales-insurance__content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }

        .sales-insurance__content p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .sales-insurance__compact {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .sales-insurance__logo {
            width: 100px;
          }
        }

        /* ===== SECTION 22: FINANCING & TAX ===== */
        .sales-financetax {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-financetax__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-financetax__grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-financetax__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 2rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-financetax__content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: #1a1a1a;
        }

        .sales-financetax__content h3:first-of-type {
          margin-top: 0;
        }

        .sales-financetax__content p {
          color: #444;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .sales-financetax__highlights {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sales-financetax__highlight {
          background: #faf9f6;
          padding: 1.5rem 2rem;
          border-left: 4px solid #1a1a1a;
        }

        .sales-financetax__highlight-num {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .sales-financetax__highlight-label {
          font-size: 0.8rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .sales-financetax__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sales-financetax__highlights {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .sales-financetax__highlight {
            flex: 1;
            min-width: 140px;
          }
        }

        /* ===== SECTION 22: FAQ (legacy) ===== */
        .sales-faq {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-faq__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-faq__grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
        }

        .sales-faq__header h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-faq__header > p {
          color: #666;
          margin-bottom: 2rem;
        }

        .sales-faq__contact {
          background: #faf9f6;
          padding: 1.5rem;
        }

        .sales-faq__contact p {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 1rem;
        }

        .sales-faq__list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .sales-faq__load-more { margin-top: 1.5rem; display: block; width: 100%; padding: 0.9rem 1.5rem; background: transparent; border: 1px solid #1a1a1a; color: #1a1a1a; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
        .sales-faq__load-more:hover { background: #1a1a1a; color: #fff; }

        .sales-faq__item {
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-faq__question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .sales-faq__question::-webkit-details-marker {
          display: none;
        }

        .sales-faq__toggle {
          font-size: 1.25rem;
          color: #888;
          transition: transform 0.3s ease;
        }

        .sales-faq__item[open] .sales-faq__toggle {
          transform: rotate(45deg);
        }

        .sales-faq__answer {
          padding: 0 0 1.25rem;
        }

        .sales-faq__answer p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.8;
          margin: 0;
        }

        /* ===== SECTION 23: FLEET MANAGEMENT ===== */
        .sales-fleet {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-fleet__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-fleet__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-fleet__visual img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .sales-fleet__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-fleet__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-fleet__benefits {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .sales-fleet__benefits li {
          font-size: 0.85rem;
          color: #555;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sales-fleet__benefits li::before {
          content: '✓';
          color: #4ade80;
          font-size: 0.75rem;
        }

        /* ===== SECTION 24: TIMELINE ===== */
        .sales-timeline {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-timeline__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sales-timeline__visual {
          position: relative;
          padding-left: 3rem;
        }

        .sales-timeline__line {
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e8e6e2;
        }

        .sales-timeline__point {
          position: relative;
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .sales-timeline__marker {
          position: absolute;
          left: -3rem;
          width: 16px;
          height: 16px;
          background: #fff;
          border: 2px solid #1a1a1a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.5rem;
        }

        .sales-timeline__point--final .sales-timeline__marker {
          background: #1a1a1a;
          color: #fff;
          font-size: 0.6rem;
        }

        .sales-timeline__content {
          background: #faf9f6;
          padding: 1.25rem 1.5rem;
          flex: 1;
        }

        .sales-timeline__month {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .sales-timeline__content h4 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .sales-timeline__content p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }

        .sales-timeline__note {
          text-align: center;
          font-size: 0.85rem;
          color: #888;
          margin-top: 2rem;
        }

        /* ===== SECTION 25: VALUATION ===== */
        .sales-valuation {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #f8f7f4 0%, #faf9f6 100%);
        }

        .sales-valuation__container {
          max-width: 700px;
          margin: 0 auto;
        }

        .sales-valuation__card {
          background: #fff;
          padding: 3rem;
          text-align: center;
          border: 1px solid #e8e6e2;
        }

        .sales-valuation__icon {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .sales-valuation__card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .sales-valuation__card > p {
          color: #666;
          line-height: 1.8;
          max-width: 500px;
          margin: 0 auto 2rem;
        }

        .sales-valuation__form {
          margin-bottom: 1rem;
        }

        .sales-valuation__inputs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .sales-valuation__inputs input {
          padding: 1rem;
          font-size: 0.85rem;
          border: 1px solid #e8e6e2;
          font-family: inherit;
          background: #faf9f6;
        }

        .sales-valuation__inputs input:focus {
          outline: none;
          border-color: #1a1a1a;
        }

        .sales-valuation__note {
          font-size: 0.75rem;
          color: #888;
        }

        /* ===== SECTION 26: EVENTS ===== */
        .sales-events {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-events__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-events__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-events__card {
          background: #faf9f6;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .sales-events__date {
          text-align: center;
          padding: 1rem;
          background: #1a1a1a;
          color: #fff;
        }

        .sales-events__day {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .sales-events__month {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .sales-events__info {
          flex: 1;
        }

        .sales-events__type {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .sales-events__info h4 {
          margin: 0 0 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sales-events__location {
          font-size: 0.8rem;
          color: #666;
        }

        .sales-events__link {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sales-events__link:hover {
          text-decoration: underline;
        }

        /* ===== SECTION 27: LEASEBACK ===== */
        .sales-leaseback {
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
          padding: 6rem 2rem;
        }

        .sales-leaseback__inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-leaseback__content {
          text-align: center;
          color: #fff;
        }

        .sales-leaseback__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-leaseback__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-leaseback__content > p {
          color: rgba(255,255,255,0.7);
          font-size: 1.05rem;
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto 2.5rem;
        }

        .sales-leaseback__benefits {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .sales-leaseback__benefit {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .sales-leaseback__benefit-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .sales-leaseback__benefit h5 {
          margin: 0 0 0.25rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .sales-leaseback__benefit span {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }

        /* ===== SECTION 28: HERITAGE ===== */
        .sales-heritage {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-heritage__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-heritage__timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }

        .sales-heritage__timeline::before {
          content: '';
          position: absolute;
          left: 60px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e8e6e2;
        }

        .sales-heritage__item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .sales-heritage__year {
          width: 50px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
          text-align: right;
        }

        .sales-heritage__dot {
          width: 12px;
          height: 12px;
          background: #1a1a1a;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .sales-heritage__event {
          flex: 1;
          font-size: 0.95rem;
          color: #555;
        }

        /* ===== SECTION 29: PAINT ===== */
        .sales-paint {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-paint__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .sales-paint__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .sales-paint__card {
          background: #fff;
          border: 1px solid #e8e6e2;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .sales-paint__image {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .sales-paint__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .sales-paint__card:hover .sales-paint__image img {
          transform: scale(1.05);
        }

        .sales-paint__info {
          padding: 1rem;
        }

        .sales-paint__type {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .sales-paint__info h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .sales-paint__cta {
          text-align: center;
        }

        .sales-paint__cta p {
          color: #888;
          margin-bottom: 1rem;
        }

        /* ===== SECTION 30: INTERIOR ===== */
        .sales-interior {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-interior__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-interior__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-interior__visual img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .sales-interior__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-interior__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-interior__options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .sales-interior__option {
          background: #faf9f6;
          padding: 1rem;
          border-left: 3px solid #e8e6e2;
        }

        .sales-interior__tier {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .sales-interior__option h4 {
          margin: 0 0 0.25rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .sales-interior__option p {
          margin: 0;
          font-size: 0.75rem;
          color: #666;
        }

        /* ===== SECTION 31: MISSIONS ===== */
        .sales-missions {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-missions__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-missions__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-missions__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .sales-missions__icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .sales-missions__card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .sales-missions__desc {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .sales-missions__card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
        }

        .sales-missions__card li {
          font-size: 0.75rem;
          color: #888;
          padding: 0.25rem 0;
          padding-left: 1rem;
          position: relative;
        }

        .sales-missions__card li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #ccc;
        }

        .sales-missions__recommend {
          padding-top: 1rem;
          border-top: 1px solid #e8e6e2;
          font-size: 0.75rem;
        }

        .sales-missions__recommend span {
          color: #888;
        }

        .sales-missions__recommend strong {
          display: block;
          font-size: 0.85rem;
          color: #1a1a1a;
          margin-top: 0.25rem;
        }

        /* ===== SECTION 32: CALCULATOR ===== */
        .sales-calculator {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-calculator__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-calculator__section {
          margin-bottom: 2rem;
        }

        .sales-calculator__section h4 {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #1a1a1a;
        }

        .sales-calculator__section table {
          width: 100%;
          border-collapse: collapse;
        }

        .sales-calculator__section th,
        .sales-calculator__section td {
          padding: 0.75rem;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
          font-size: 0.85rem;
        }

        .sales-calculator__section th {
          font-weight: 600;
          background: #faf9f6;
        }

        .sales-calculator__section td:first-child {
          text-align: left;
          font-weight: 500;
        }

        .sales-calculator__note {
          text-align: center;
          font-size: 0.8rem;
          color: #888;
        }

        /* ===== SECTION 33: RESALE ===== */
        .sales-resale {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 6rem 2rem;
        }

        .sales-resale__inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-resale__content {
          text-align: center;
          color: #fff;
        }

        .sales-resale__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-resale__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-resale__content > p {
          color: rgba(255,255,255,0.7);
          font-size: 1.05rem;
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto 2.5rem;
        }

        .sales-resale__stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-bottom: 2rem;
        }

        .sales-resale__stat {
          text-align: center;
        }

        .sales-resale__retention {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .sales-resale__model {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .sales-resale__age {
          display: block;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
        }

        .sales-resale__sub {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
        }

        /* ===== SECTION 34: AWARDS ===== */
        .sales-awards {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-awards__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-awards__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-awards__card {
          background: #fff;
          padding: 2rem;
          text-align: center;
          border: 1px solid #e8e6e2;
        }

        .sales-awards__year {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 1rem;
        }

        .sales-awards__trophy {
          font-size: 2rem;
          color: #fbbf24;
          margin-bottom: 1rem;
        }

        .sales-awards__card h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .sales-awards__org {
          font-size: 0.7rem;
          color: #888;
        }

        /* ===== SECTION 35: REQUIREMENTS ===== */
        .sales-requirements {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-requirements__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-requirements__table-wrapper {
          overflow-x: auto;
        }

        .sales-requirements__table {
          width: 100%;
          border-collapse: collapse;
          background: #faf9f6;
        }

        .sales-requirements__table th,
        .sales-requirements__table td {
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
          font-size: 0.85rem;
        }

        .sales-requirements__table th {
          background: #1a1a1a;
          color: #fff;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
        }

        .sales-requirements__table td:first-child {
          background: #fff;
        }

        .sales-requirements__note {
          text-align: center;
          font-size: 0.8rem;
          color: #888;
          margin: 1rem 0;
        }

        .sales-requirements__cta {
          text-align: center;
        }

        /* ===== SECTION 36: VS COMPETITION ===== */
        .sales-vs {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-vs__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sales-vs__table-wrapper {
          overflow-x: auto;
        }

        .sales-vs__table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
        }

        .sales-vs__table th,
        .sales-vs__table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e8e6e2;
          font-size: 0.85rem;
        }

        .sales-vs__table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          background: #faf9f6;
        }

        .sales-vs__robinson {
          background: rgba(74, 222, 128, 0.1) !important;
        }

        .sales-vs__check {
          color: #4ade80;
          margin-right: 0.5rem;
        }

        /* ===== SECTION 37: ENVIRONMENTAL ===== */
        .sales-environmental {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-environmental__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-environmental__grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-environmental__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-environmental__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-environmental__metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .sales-environmental__metric {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #faf9f6;
        }

        .sales-environmental__value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #4ade80;
          white-space: nowrap;
        }

        .sales-environmental__metric h4 {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .sales-environmental__metric p {
          margin: 0;
          font-size: 0.75rem;
          color: #888;
        }

        .sales-environmental__icon-large {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sales-environmental__leaf {
          width: 150px;
          height: 150px;
          color: #4ade80;
        }

        /* ===== SECTION 38: VIDEO ===== */
        .sales-video {
          padding: 6rem 2rem;
          background: #1a1a1a;
        }

        .sales-video--compact {
          padding: 0.75rem 1.5rem;
          background: #fff;
        }

        .sales-video--compact .sales-video__container {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .sales-video--compact .sales-video__label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
          margin: 0;
          font-weight: 600;
        }

        .sales-video--compact .sales-video__grid {
          display: flex;
          gap: 0.75rem;
        }

        .sales-video--compact .sales-video__card {
          width: 100px;
        }

        .sales-video--compact .sales-video__thumbnail {
          aspect-ratio: 16/10;
          margin-bottom: 0;
          border-radius: 3px;
        }

        .sales-video--compact .sales-video__card h4 {
          font-size: 0.55rem;
          color: #666;
          margin-top: 0.25rem;
          text-align: center;
          white-space: nowrap;
        }

        .sales-video--compact .sales-video__play {
          width: 20px;
          height: 20px;
          font-size: 0.5rem;
        }

        .sales-video--compact .sales-video__duration {
          font-size: 0.5rem;
          padding: 0.15rem 0.3rem;
        }

        .sales-video--compact .sales-video__divider {
          width: 100%;
          max-width: 200px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
        }

        .sales-video__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-video__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-video__card {
          cursor: pointer;
        }

        .sales-video__thumbnail {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }

        .sales-video__thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .sales-video__card:hover .sales-video__thumbnail img {
          transform: scale(1.05);
        }

        .sales-video__play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #1a1a1a;
          transition: all 0.3s ease;
        }

        .sales-video__card:hover .sales-video__play {
          transform: translate(-50%, -50%) scale(1.1);
        }

        .sales-video__duration {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          background: rgba(0,0,0,0.7);
          color: #fff;
          font-size: 0.65rem;
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
          font-family: 'Share Tech Mono', monospace;
        }

        .sales-video__card h4 {
          color: #fff;
          font-size: 0.85rem;
          font-weight: 500;
          margin: 0;
        }

        /* ===== SECTION 39: SOCIAL PROOF STATS ===== */
        .sales-proof {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #faf9f6 0%, #f0efe8 100%);
        }

        .sales-proof__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-proof__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .sales-proof__stat {
          text-align: center;
          padding: 2rem;
          background: #fff;
          border: 1px solid #e8e6e2;
        }

        .sales-proof__value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 3rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .sales-proof__suffix {
          font-size: 1.5rem;
          color: #888;
        }

        .sales-proof__label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
        }

        /* ===== SECTION 40: SPECS ===== */
        .sales-specs {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-specs__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-specs__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-specs__category {
          background: #faf9f6;
          padding: 1.5rem;
          border-top: 3px solid #1a1a1a;
        }

        .sales-specs__category h4 {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-specs__category dl {
          margin: 0;
        }

        .sales-specs__category dt {
          font-size: 0.75rem;
          color: #888;
          margin-top: 0.75rem;
        }

        .sales-specs__category dd {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          margin: 0.25rem 0 0;
        }

        /* ===== SECTION 41: NETWORK ===== */
        .sales-network {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-network__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-network__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .sales-network__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          text-align: center;
        }

        .sales-network__count {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .sales-network__card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .sales-network__card p {
          font-size: 0.75rem;
          color: #888;
          margin: 0;
        }

        .sales-network__total {
          text-align: center;
        }

        .sales-network__total-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 4rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
        }

        .sales-network__total-label {
          font-size: 0.85rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ===== SECTION 42: HANGARAGE ===== */
        .sales-hangarage {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-hangarage__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-hangarage__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-hangarage__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-hangarage__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-hangarage__tiers {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sales-hangarage__tier {
          background: #faf9f6;
          padding: 1.25rem;
          border-left: 3px solid #e8e6e2;
        }

        .sales-hangarage__tier:hover {
          border-color: #1a1a1a;
        }

        .sales-hangarage__tier-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .sales-hangarage__tier h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .sales-hangarage__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-hangarage__tier ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .sales-hangarage__tier li {
          font-size: 0.75rem;
          color: #666;
          background: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }

        .sales-hangarage__visual img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        /* ===== SECTION 43: INSPECTION ===== */
        .sales-inspection {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-inspection__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-inspection__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-inspection__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
        }

        .sales-inspection__card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem;
        }

        .sales-inspection__meta {
          display: flex;
          justify-content: space-between;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-inspection__meta span {
          font-size: 0.8rem;
          color: #888;
        }

        .sales-inspection__price {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
          color: #1a1a1a !important;
        }

        .sales-inspection__card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }

        .sales-inspection__card li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          padding: 0.4rem 0;
        }

        .sales-inspection__check {
          color: #4ade80;
          font-size: 0.75rem;
        }

        /* ===== SECTION 44: DEMO ===== */
        .sales-demo {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 6rem 2rem;
        }

        .sales-demo__inner {
          max-width: 600px;
          margin: 0 auto;
        }

        .sales-demo__content {
          text-align: center;
          color: #fff;
        }

        .sales-demo__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-demo__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-demo__content > p {
          color: rgba(255,255,255,0.7);
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-demo__form {
          display: grid;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .sales-demo__select,
        .sales-demo__input {
          padding: 1rem;
          font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-family: inherit;
        }

        .sales-demo__select option {
          background: #1a1a1a;
        }

        .sales-demo__select:focus,
        .sales-demo__input:focus {
          outline: none;
          border-color: #fff;
        }

        .sales-demo__input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .sales-demo__note {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        /* ===== SECTION 45: CUSTOMER MAP ===== */
        .sales-customermap {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-customermap__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-customermap__visual {
          margin-bottom: 3rem;
        }

        .sales-customermap__map {
          background: #faf9f6;
          padding: 2rem;
          border-radius: 8px;
        }

        .sales-customermap__svg {
          width: 100%;
          height: auto;
          max-height: 400px;
        }

        .sales-customermap__stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
        }

        .sales-customermap__stat {
          text-align: center;
        }

        .sales-customermap__num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .sales-customermap__stat span:last-child {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ===== SECTION 46: FACTORY ===== */
        .sales-factory {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-factory__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-factory__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-factory__image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .sales-factory__image img {
          width: 100%;
          height: auto;
        }

        .sales-factory__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .sales-factory__overlay:hover {
          background: rgba(0,0,0,0.6);
        }

        .sales-factory__play {
          width: 60px;
          height: 60px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .sales-factory__text {
          color: #fff;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .sales-factory__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-factory__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-factory__features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
        }

        .sales-factory__features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          padding: 0.5rem 0;
        }

        .sales-factory__features li::before {
          content: '✓';
          color: #4ade80;
        }

        /* ===== SECTION 47: NEWSLETTER ===== */
        .sales-newsletter {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #f8f7f4 0%, #faf9f6 100%);
        }

        .sales-newsletter__container {
          max-width: 600px;
          margin: 0 auto;
        }

        .sales-newsletter__content {
          text-align: center;
        }

        .sales-newsletter__content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 0.75rem;
        }

        .sales-newsletter__content > p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .sales-newsletter__form {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .sales-newsletter__form input {
          flex: 1;
          padding: 1rem;
          font-size: 0.9rem;
          border: 1px solid #e8e6e2;
          background: #fff;
          font-family: inherit;
        }

        .sales-newsletter__form input:focus {
          outline: none;
          border-color: #1a1a1a;
        }

        .sales-newsletter__privacy {
          font-size: 0.75rem;
          color: #888;
        }

        /* ===== SECTION 48: AVIONICS ===== */
        .sales-avionics {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-avionics__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-avionics__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-avionics__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          position: relative;
        }

        .sales-avionics__card--featured {
          border-color: #1a1a1a;
          border-width: 2px;
        }

        .sales-avionics__badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          color: #fff;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 0.75rem;
          white-space: nowrap;
        }

        .sales-avionics__card h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }

        .sales-avionics__card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }

        .sales-avionics__card li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .sales-avionics__check {
          color: #4ade80;
          font-size: 0.75rem;
        }

        .sales-avionics__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        /* ===== SECTION 49: WARRANTY ===== */
        .sales-warranty {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-warranty__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-warranty__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-warranty__card {
          background: #faf9f6;
          padding: 2rem;
          text-align: center;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .sales-warranty__duration {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .sales-warranty__card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
          text-transform: uppercase;
        }

        .sales-warranty__card p {
          font-size: 0.8rem;
          color: #666;
          margin: 0 0 1rem;
        }

        .sales-warranty__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        /* ===== SECTION 50: DELIVERY ===== */
        .sales-delivery {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-delivery__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-delivery__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-delivery__card {
          background: #fff;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
        }

        .sales-delivery__header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .sales-delivery__header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .sales-delivery__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sales-delivery__desc {
          font-size: 0.85rem;
          color: #666;
          margin: 0 0 1rem;
        }

        .sales-delivery__meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #888;
        }

        /* ===== SECTION 51: TOOLS ===== */
        .sales-tools {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 6rem 2rem;
        }

        .sales-tools__inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-tools__content {
          color: #fff;
          text-align: center;
        }

        .sales-tools__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-tools__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-tools__content > p {
          color: rgba(255,255,255,0.7);
          margin-bottom: 2.5rem;
        }

        .sales-tools__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          text-align: left;
        }

        .sales-tools__item {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }

        .sales-tools__logo {
          font-size: 1.5rem;
          opacity: 0.7;
        }

        .sales-tools__item h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sales-tools__type {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.25rem;
        }

        .sales-tools__item p {
          margin: 0;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
        }

        /* ===== SECTION 52: MEMBERSHIP ===== */
        .sales-membership {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-membership__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-membership__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .sales-membership__card {
          background: #faf9f6;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid #e8e6e2;
          transition: all 0.3s ease;
        }

        .sales-membership__icon {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .sales-membership__card h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .sales-membership__card p {
          font-size: 0.75rem;
          color: #666;
          margin: 0;
        }

        /* ===== SECTION 53: TECH SUPPORT ===== */
        .sales-techsupport {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-techsupport__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-techsupport__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-techsupport__card {
          background: #fff;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          text-align: center;
        }

        .sales-techsupport__card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }

        .sales-techsupport__details {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .sales-techsupport__label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
        }

        .sales-techsupport__value {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .sales-techsupport__contact {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #1a1a1a;
          word-break: break-all;
        }

        /* ===== SECTION 54: EXCHANGE ===== */
        .sales-exchange {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-exchange__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-exchange__table-wrapper {
          overflow-x: auto;
        }

        .sales-exchange__table {
          width: 100%;
          border-collapse: collapse;
        }

        .sales-exchange__table th,
        .sales-exchange__table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e8e6e2;
          font-size: 0.85rem;
        }

        .sales-exchange__table th {
          background: #faf9f6;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
        }

        .sales-exchange__highlight {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
          color: #4ade80;
        }

        .sales-exchange__savings {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
          color: #1a1a1a;
          background: rgba(74, 222, 128, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }

        /* ===== SECTION 55: SCHOOLS ===== */
        .sales-schools {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-schools__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-schools__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-schools__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-schools__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-schools__list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sales-schools__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #fff;
          border-left: 3px solid #1a1a1a;
        }

        .sales-schools__info h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .sales-schools__info span {
          font-size: 0.75rem;
          color: #888;
        }

        .sales-schools__specialty {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          background: #faf9f6;
          padding: 0.35rem 0.75rem;
        }

        .sales-schools__visual img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        /* ===== SECTION 56: UPGRADE ===== */
        .sales-upgrade {
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
          padding: 6rem 2rem;
        }

        .sales-upgrade__inner {
          max-width: 700px;
          margin: 0 auto;
        }

        .sales-upgrade__content {
          color: #fff;
          text-align: center;
        }

        .sales-upgrade__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-upgrade__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-upgrade__content > p {
          color: rgba(255,255,255,0.7);
          margin-bottom: 2.5rem;
        }

        .sales-upgrade__paths {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sales-upgrade__path {
          background: rgba(255,255,255,0.05);
          padding: 1.5rem;
          text-align: left;
          border-radius: 4px;
        }

        .sales-upgrade__models {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .sales-upgrade__from,
        .sales-upgrade__to {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .sales-upgrade__from {
          color: rgba(255,255,255,0.5);
        }

        .sales-upgrade__to {
          color: #fff;
        }

        .sales-upgrade__arrow {
          font-size: 1.25rem;
          color: #4ade80;
        }

        .sales-upgrade__path p {
          margin: 0 0 0.5rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
        }

        .sales-upgrade__tradein {
          font-size: 0.75rem;
          color: #4ade80;
        }

        /* ===== SECTION 57: REGULATORY ===== */
        .sales-regulatory {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-regulatory__container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sales-regulatory__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-regulatory__card {
          background: #faf9f6;
          padding: 2rem;
          text-align: center;
          border-top: 3px solid #1a1a1a;
        }

        .sales-regulatory__name {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .sales-regulatory__region {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          margin-bottom: 1rem;
        }

        .sales-regulatory__card p {
          font-size: 0.85rem;
          color: #666;
          margin: 0;
        }

        /* ===== SECTION 58: STORIES ===== */
        .sales-stories {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-stories__container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sales-stories__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-stories__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
        }

        .sales-stories__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .sales-stories__usecase {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          background: #faf9f6;
          padding: 0.25rem 0.5rem;
        }

        .sales-stories__aircraft {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .sales-stories__card blockquote {
          font-size: 0.9rem;
          color: #444;
          line-height: 1.7;
          font-style: italic;
          margin: 0 0 1.5rem;
          padding-left: 1rem;
          border-left: 2px solid #e8e6e2;
        }

        .sales-stories__footer {
          border-top: 1px solid #e8e6e2;
          padding-top: 1rem;
        }

        .sales-stories__name {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .sales-stories__meta {
          font-size: 0.7rem;
          color: #888;
        }

        /* ===== SECTION 59: CONSIGNMENT ===== */
        .sales-consignment {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-consignment__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-consignment__grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sales-consignment__content h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-consignment__content > p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .sales-consignment__benefits {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
        }

        .sales-consignment__benefits li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          padding: 0.5rem 0;
        }

        .sales-consignment__check {
          color: #4ade80;
        }

        .sales-consignment__stat-box {
          background: #1a1a1a;
          color: #fff;
          padding: 3rem;
          text-align: center;
        }

        .sales-consignment__stat-num {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 4rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .sales-consignment__stat-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
        }

        /* ===== SECTION 60: EDITIONS ===== */
        .sales-editions {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-editions__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-editions__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-editions__card {
          background: #fff;
          padding: 2rem;
          border: 1px solid #e8e6e2;
          text-align: center;
          position: relative;
        }

        .sales-editions__limited {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #e04a2f;
        }

        .sales-editions__card h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .sales-editions__base {
          display: block;
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 1rem;
        }

        .sales-editions__card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }

        .sales-editions__card li {
          font-size: 0.8rem;
          color: #666;
          padding: 0.35rem 0;
          border-bottom: 1px solid #f5f5f5;
        }

        /* ===== SECTION 61: BASES ===== */
        .sales-bases {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-bases__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-bases__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sales-bases__card {
          background: #faf9f6;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
        }

        .sales-bases__header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 1rem;
        }

        .sales-bases__header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .sales-bases__code {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: #888;
        }

        .sales-bases__details {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .sales-bases__label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
        }

        .sales-bases__details span:last-child {
          font-size: 0.8rem;
        }

        .sales-bases__facilities {
          font-size: 0.8rem;
          color: #666;
          margin: 0;
          padding-top: 1rem;
          border-top: 1px solid #e8e6e2;
        }

        /* ===== SECTION 62: CARBON ===== */
        .sales-carbon {
          background: linear-gradient(135deg, #1a5c38 0%, #0f3d26 100%);
          padding: 6rem 2rem;
        }

        .sales-carbon__inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .sales-carbon__content {
          color: #fff;
          text-align: center;
        }

        .sales-carbon__content .sales-pre-text {
          color: rgba(255,255,255,0.6);
        }

        .sales-carbon__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-carbon__content > p {
          color: rgba(255,255,255,0.8);
          margin-bottom: 2.5rem;
        }

        .sales-carbon__details {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-bottom: 2rem;
        }

        .sales-carbon__price {
          text-align: center;
        }

        .sales-carbon__amount {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .sales-carbon__price span:last-child {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
        }

        .sales-carbon__projects {
          text-align: left;
        }

        .sales-carbon__label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.5rem;
        }

        .sales-carbon__projects ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sales-carbon__projects li {
          font-size: 0.85rem;
          padding: 0.25rem 0;
        }

        .sales-carbon__providers {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }

        /* ===== SECTION 63: MANAGEMENT ===== */
        .sales-management {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-management__container {
          max-width: 800px;
          margin: 0 auto;
        }

        .sales-management__grid {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .sales-management__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: #fff;
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-management__item:first-child {
          border-top: 1px solid #e8e6e2;
        }

        .sales-management__info h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sales-management__info p {
          margin: 0;
          font-size: 0.8rem;
          color: #888;
        }

        .sales-management__price {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        /* ===== SECTION 64: CONTACTS ===== */
        .sales-contacts {
          padding: 6rem 2rem;
          background: #fff;
        }

        .sales-contacts__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-contacts__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-contacts__card {
          background: #faf9f6;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
          text-align: center;
          transition: all 0.3s ease;
        }

        .sales-contacts__dept {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .sales-contacts__card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
        }

        .sales-contacts__email,
        .sales-contacts__phone {
          display: block;
          font-size: 0.75rem;
          color: #666;
          text-decoration: none;
          margin-bottom: 0.25rem;
        }

        .sales-contacts__email:hover,
        .sales-contacts__phone:hover {
          color: #1a1a1a;
        }

        /* ===== SECTION 65: QUICK COMPARE ===== */
        .sales-quickcompare {
          padding: 6rem 2rem;
          background: #faf9f6;
        }

        .sales-quickcompare__container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .sales-quickcompare__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sales-quickcompare__card {
          background: #fff;
          padding: 1.5rem;
          border: 1px solid #e8e6e2;
        }

        .sales-quickcompare__card h4 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem;
          text-align: center;
        }

        .sales-quickcompare__ideal,
        .sales-quickcompare__notideal {
          padding: 0.75rem 0;
        }

        .sales-quickcompare__ideal {
          border-bottom: 1px solid #e8e6e2;
        }

        .sales-quickcompare__label {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }

        .sales-quickcompare__ideal .sales-quickcompare__label {
          color: #4ade80;
        }

        .sales-quickcompare__notideal .sales-quickcompare__label {
          color: #888;
        }

        .sales-quickcompare__ideal p,
        .sales-quickcompare__notideal p {
          margin: 0;
          font-size: 0.8rem;
          color: #666;
        }

        /* ===== SECTION 66: CHAT ===== */
        .sales-chat {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #f8f7f4 0%, #faf9f6 100%);
        }

        .sales-chat__container {
          max-width: 500px;
          margin: 0 auto;
        }

        .sales-chat__content {
          text-align: center;
        }

        .sales-chat__icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .sales-chat__content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .sales-chat__content > p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .sales-chat__status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #666;
          margin-top: 1rem;
        }

        .sales-chat__dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: chatPulse 2s infinite;
        }

        @keyframes chatPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* ===== SECTION 67: APP ===== */
        .sales-app {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 6rem 2rem;
        }

        .sales-app__inner {
          max-width: 600px;
          margin: 0 auto;
        }

        .sales-app__content {
          color: #fff;
          text-align: center;
        }

        .sales-app__content .sales-pre-text {
          color: rgba(255,255,255,0.5);
        }

        .sales-app__content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin: 0.5rem 0 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sales-app__content > p {
          color: rgba(255,255,255,0.7);
          margin-bottom: 2rem;
        }

        .sales-app__features {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sales-app__features span {
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }

        .sales-app__notify {
          display: flex;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .sales-app__notify input {
          flex: 1;
          padding: 1rem;
          font-size: 0.85rem;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-family: inherit;
        }

        .sales-app__notify input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .sales-app__notify input:focus {
          outline: none;
          border-color: #fff;
        }

        /* ===== SECTIONS 48-67 RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .sales-avionics__grid,
          .sales-warranty__grid,
          .sales-delivery__grid,
          .sales-regulatory__grid,
          .sales-editions__grid,
          .sales-bases__grid {
            grid-template-columns: 1fr;
          }

          .sales-membership__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-techsupport__grid,
          .sales-contacts__grid,
          .sales-quickcompare__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-tools__grid {
            grid-template-columns: 1fr;
          }

          .sales-schools__grid,
          .sales-consignment__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sales-stories__grid {
            grid-template-columns: 1fr;
          }

          .sales-carbon__details {
            flex-direction: column;
            gap: 2rem;
          }

          .sales-carbon__projects {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .sales-membership__grid {
            grid-template-columns: 1fr;
          }

          .sales-techsupport__grid,
          .sales-contacts__grid,
          .sales-quickcompare__grid {
            grid-template-columns: 1fr;
          }

          .sales-app__notify {
            flex-direction: column;
          }
        }

        /* ===== SECTIONS 28-47 RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .sales-paint__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-interior__grid,
          .sales-environmental__grid,
          .sales-hangarage__grid,
          .sales-factory__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sales-missions__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-awards__grid,
          .sales-specs__grid,
          .sales-network__grid,
          .sales-proof__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-video__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-inspection__grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sales-heritage__timeline::before {
            left: 50px;
          }

          .sales-heritage__year {
            width: 40px;
            font-size: 0.8rem;
          }

          .sales-paint__grid {
            grid-template-columns: 1fr;
          }

          .sales-interior__options {
            grid-template-columns: 1fr;
          }

          .sales-missions__grid {
            grid-template-columns: 1fr;
          }

          .sales-resale__stats {
            flex-direction: column;
            gap: 2rem;
          }

          .sales-awards__grid,
          .sales-specs__grid,
          .sales-network__grid,
          .sales-proof__grid {
            grid-template-columns: 1fr;
          }

          .sales-environmental__metrics {
            grid-template-columns: 1fr;
          }

          .sales-video__grid {
            grid-template-columns: 1fr;
          }

          .sales-customermap__stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .sales-newsletter__form {
            flex-direction: column;
          }
        }

        /* ===== NEW SECTION RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .sales-r88__grid,
          .sales-training__grid,
          .sales-fleet__grid,
          .sales-international__inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sales-r88__visual {
            order: -1;
          }

          .sales-finance__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-config__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-testimonials__grid {
            grid-template-columns: 1fr;
          }

          .sales-gallery__scroll {
            height: 350px;
          }

          .sales-gallery__item--tall {
            width: 220px;
          }

          .sales-gallery__item--wide {
            width: 320px;
          }

          .sales-gallery__item--small {
            width: 200px;
          }

          .sales-gallery__chevron {
            width: 40px;
            height: 40px;
          }

          .sales-safety__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-accessories__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-maintenance__grid {
            grid-template-columns: 1fr;
          }

          .sales-deliveries__grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-insurance__grid {
            grid-template-columns: 1fr;
          }

          .sales-faq__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sales-events__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sales-r88__features {
            grid-template-columns: 1fr;
          }

          .sales-finance__grid {
            grid-template-columns: 1fr;
          }

          .sales-tradein__steps {
            flex-direction: column;
          }

          .sales-tradein__step-arrow {
            transform: rotate(90deg);
          }

          .sales-compare__table {
            font-size: 0.75rem;
          }

          .sales-compare__table th,
          .sales-compare__table td {
            padding: 0.75rem 0.5rem;
          }

          .sales-config__grid {
            grid-template-columns: 1fr;
          }

          .sales-gallery__scroll {
            height: 300px;
          }

          .sales-gallery__item--tall {
            width: 180px;
          }

          .sales-gallery__item--wide {
            width: 260px;
          }

          .sales-gallery__item--small {
            width: 160px;
          }

          .sales-gallery__chevron {
            display: none;
          }

          .sales-safety__grid {
            grid-template-columns: 1fr;
          }

          .sales-accessories__grid {
            grid-template-columns: 1fr;
          }

          .sales-deliveries__grid {
            grid-template-columns: 1fr;
          }

          .sales-international__stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .sales-fleet__benefits {
            grid-template-columns: 1fr;
          }

          .sales-valuation__inputs {
            grid-template-columns: 1fr;
          }

          .sales-events__grid {
            grid-template-columns: 1fr;
          }

          .sales-leaseback__benefits {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Sales;
