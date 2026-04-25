/**
 * imageSections.js — single source of truth for every managed image on the site.
 *
 * Section types:
 *   'single'   — one image; large preview in admin, replace button
 *   'gallery'  — variable count; free add / remove / reorder
 *   'carousel' — fixed named slots (one image per slide); replace only
 *   'cards'    — fixed named slots (one image per card); replace only
 *
 * All sections are stored in Firestore collection: site_images
 * Document ID = section id.
 */

export const SECTIONS = [
  // ─── HOME PAGE ─────────────────────────────────────────────────────────────

  // ─── TRAINING PAGE ─────────────────────────────────────────────────────────
  {
    id: 'training-intro',
    page: 'training',
    name: 'Training Introduction Image',
    hint: 'Photo next to the opening paragraph on the training page',
    type: 'single',
    images: [
      { id: 's4', url: '/assets/images/training/helicopter-training.webp', alt: 'Helicopter flight training at HQ Aviation' },
    ],
  },
  {
    id: 'training-trial-lesson',
    page: 'training',
    name: 'Trial Lesson Image',
    hint: 'Photo in the "What is a Trial Lesson?" section',
    type: 'single',
    images: [
      { id: 's5', url: '/assets/images/training/trial-lesson.webp', alt: 'Trial helicopter lesson' },
    ],
  },

  // ─── MAINTENANCE PAGE ──────────────────────────────────────────────────────
  {
    id: 'maintenance-cert-logo',
    page: 'maintenance',
    name: 'Certification Logos',
    hint: 'Logos in the certifications section — CAA Certified, Robinson Authorized Service Centre',
    type: 'cards',
    slideLabels: ['UK CAA Certified', 'Robinson Authorized Service Centre'],
    images: [
      { id: 's8a', url: '/assets/images/logos/certifications/caa-logo.png', alt: 'UK CAA Certified' },
      { id: 's8b', url: '/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-black-type.svg', alt: 'Robinson Authorized Service Centre' },
    ],
  },
  {
    id: 'maintenance-aircraft',
    page: 'maintenance',
    name: 'Supported Aircraft Models',
    hint: 'One image per aircraft card — R22, R44, R66, Cabri G2',
    type: 'cards',
    slideLabels: ['Robinson R22', 'Robinson R44', 'Robinson R66', 'Guimbal Cabri G2'],
    images: [
      { id: 'a1', url: '/assets/images/new-aircraft/r22-beta.webp',    alt: 'Robinson R22 Beta' },
      { id: 'a2', url: '/assets/images/new-aircraft/r44-raven.webp',   alt: 'Robinson R44 Raven' },
      { id: 'a3', url: '/assets/images/new-aircraft/r66-turbine.webp', alt: 'Robinson R66 Turbine' },
      { id: 'a4', url: '/assets/images/new-aircraft/cabri-g2.webp',    alt: 'Guimbal Cabri G2' },
    ],
  },

  // ─── EXPEDITIONS PAGE ──────────────────────────────────────────────────────

  // ─── HOME PAGE (real homepage — Experimentation.jsx at /) ─────────────────
  // These sections are wired to the actual live homepage, not /home.
  {
    id: 'home-hero-slides',
    page: 'home',
    name: 'Hero — Background Slides',
    hint: 'The 3 background images that cycle behind the hero headline',
    type: 'carousel',
    viewport: 'desktop',
    slideLabels: ['Slide 1', 'Slide 2', 'Slide 3'],
    images: [
      { id: 'hs1', url: '/assets/images/facility/hq-0209.jpg',               alt: 'HQ Aviation facility' },
      { id: 'hs2', url: '/assets/images/facility/hq-0056.jpg',               alt: 'HQ Aviation facility' },
      { id: 'hs3', url: '/assets/images/gallery/carousel/rotating6.jpg',     alt: 'HQ Aviation helicopter' },
    ],
  },
  {
    id: 'home-editorial-strip-1',
    page: 'home',
    name: 'Photo Strip — Row 1',
    hint: 'Horizontal scrolling photo strip (top row) below the hero section',
    type: 'gallery',
    viewport: 'both',
    images: [
      { id: 'ep1',  url: '/assets/images/expeditions/antartica.jpg',                                        alt: 'Antarctica expedition' },
      { id: 'ep2',  url: '/assets/images/gallery/flying/flying-.jpg',                                       alt: 'Helicopter flying' },
      { id: 'ep3',  url: '/assets/images/expeditions/channel.jpg',                                          alt: 'Channel crossing' },
      { id: 'ep4',  url: '/assets/images/facility/hq-aviation-robinsons.jpg',                               alt: 'HQ Aviation fleet' },
      { id: 'ep5',  url: '/assets/images/expeditions/north-pole.jpg',                                       alt: 'North Pole expedition' },
      { id: 'ep6',  url: '/assets/images/gallery/flying/foggy-evening-flying.jpg',                         alt: 'Evening flight' },
      { id: 'ep7',  url: '/assets/images/facility/main-sales-pic.jpg',                                      alt: 'HQ Aviation showroom' },
      { id: 'ep8',  url: '/assets/images/facility/busy-hangar.jpg',                                         alt: 'Busy hangar' },
      { id: 'ep9',  url: '/assets/images/new-aircraft/r88/rhc-r88-left-side-three-quarter-front-view-21797.jpg', alt: 'R88 helicopter' },
      { id: 'ep10', url: '/assets/images/facility/hq-0696.jpg',                                             alt: 'HQ Aviation facility' },
      { id: 'ep11', url: '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg', alt: 'R88 atmospheric' },
      { id: 'ep12', url: '/assets/images/facility/hq-0345.jpg',                                             alt: 'HQ Aviation facility' },
      { id: 'ep13', url: '/assets/images/facility/hq-0153.jpg',                                             alt: 'HQ Aviation facility' },
      { id: 'ep14', url: '/assets/images/facility/hq-0254.jpg',                                             alt: 'HQ Aviation facility' },
      { id: 'ep15', url: '/assets/images/gallery/flying/flying--1.jpg',                                    alt: 'Helicopter in flight' },
      { id: 'ep16', url: '/assets/images/facility/hq-0391.jpg',                                             alt: 'Engineering workshop' },
      { id: 'ep17', url: '/assets/images/facility/hq-0502.jpg',                                             alt: 'HQ Aviation facility' },
      { id: 'ep18', url: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',                         alt: 'Six helicopters at North Pole' },
      { id: 'ep19', url: '/assets/images/facility/hq-0209.jpg',                                             alt: 'HQ Aviation facility' },
      { id: 'ep20', url: '/assets/images/facility/okey-paint-quality.jpg',                                  alt: 'Paint quality' },
    ],
  },
  {
    id: 'home-editorial-strip-2',
    page: 'home',
    name: 'Photo Strip — Row 2',
    hint: 'Horizontal scrolling photo strip (bottom row) below the hero section',
    type: 'gallery',
    viewport: 'both',
    images: [
      { id: 'eq1',  url: '/assets/images/facility/hq-0035.jpg',                               alt: 'Hangar floor' },
      { id: 'eq2',  url: '/assets/images/facility/hq-0294.jpg',                               alt: 'HQ Aviation facility' },
      { id: 'eq3',  url: '/assets/images/gallery/flying/james-shadow-night.jpg',              alt: 'Night flying' },
      { id: 'eq4',  url: '/assets/images/facility/hq-0409.jpg',                               alt: 'HQ Aviation facility' },
      { id: 'eq5',  url: '/assets/images/facility/sales-rebuild.jpg',                         alt: 'Rebuild in progress' },
      { id: 'eq6',  url: '/assets/images/facility/hq-0477.jpg',                               alt: 'Engine work' },
      { id: 'eq7',  url: '/assets/images/gallery/flying/foggy-evening-flying.jpg',            alt: 'Evening flight' },
      { id: 'eq8',  url: '/assets/images/facility/hq-0745.jpg',                               alt: 'Aircraft on apron' },
      { id: 'eq9',  url: '/assets/images/facility/hq-0089.jpg',                               alt: 'Component detail' },
      { id: 'eq10', url: '/assets/images/facility/hq-0354.jpg',                               alt: 'Rotor inspection' },
      { id: 'eq11', url: '/assets/images/facility/hq-0153-1.jpg',                             alt: 'HQ Aviation facility' },
      { id: 'eq12', url: '/assets/images/facility/hq-0300.jpg',                               alt: 'Cockpit instruments' },
      { id: 'eq13', url: '/assets/images/facility/maintenance-.jpg',                          alt: 'Maintenance facility' },
      { id: 'eq14', url: '/assets/images/facility/hq-0075.jpg',                               alt: 'HQ Aviation facility' },
      { id: 'eq15', url: '/assets/images/facility/hq-img_1340.jpg',                           alt: 'HQ Aviation facility' },
      { id: 'eq16', url: '/assets/images/facility/hq-0698.jpg',                               alt: 'HQ Aviation facility' },
      { id: 'eq17', url: '/assets/images/facility/hq-0129.jpg',                               alt: 'HQ Aviation facility' },
      { id: 'eq18', url: '/assets/images/facility/hq-0167.jpg',                               alt: 'Avionics bench' },
      { id: 'eq19', url: '/assets/images/facility/hq-0053.jpg',                               alt: 'Workshop detail' },
      { id: 'eq20', url: '/assets/images/facility/hq-0388.jpg',                               alt: 'HQ Aviation facility' },
    ],
  },
  {
    id: 'home-training-tabs',
    page: 'home',
    name: 'Training Section — Tab Images',
    hint: 'One image per training tab on the homepage (Discovery Flight, PPL, Self-Fly Hire, CPL, Night Rating)',
    type: 'carousel',
    viewport: 'both',
    slideLabels: ['Discovery Flight', 'Private Pilot Licence', 'Self-Fly Hire', 'Commercial Pilot Licence', 'Night Rating', 'Type Rating', 'Tours of London'],
    images: [
      { id: 'ht1', url: '/assets/images/gallery/carousel/rotating1.jpg',              alt: 'Discovery flight experience' },
      { id: 'ht2', url: '/assets/images/gallery/carousel/rotating2.jpg',              alt: 'Private pilot licence training' },
      { id: 'ht3', url: '/assets/images/gallery/carousel/rotating8.jpg',              alt: 'Self-fly hire' },
      { id: 'ht4', url: '/assets/images/gallery/carousel/rotating-3.jpg',             alt: 'Commercial pilot licence' },
      { id: 'ht5', url: '/assets/images/gallery/carousel/rotating6.jpg',              alt: 'Night rating' },
      { id: 'ht6', url: '/assets/images/gallery/carousel/rotating-4.jpg',             alt: 'Type rating training' },
      { id: 'ht7', url: '/assets/images/lifestyle/london-battersea-heliport.jpg',     alt: 'London helicopter tours' },
    ],
  },

  // ─── HOME PAGE — ADDITIONAL SECTIONS ──────────────────────────────────────
  {
    id: 'home-hero-slides-mobile',
    page: 'home',
    name: 'Hero — Mobile Background Slides',
    hint: 'The 2 background images shown on phones behind the hero (different from desktop)',
    type: 'carousel',
    viewport: 'mobile',
    slideLabels: ['Mobile Slide 1', 'Mobile Slide 2'],
    images: [
      { id: 'hm1', url: '/assets/images/gallery/carousel/r22-london-mobile-hq.jpg', alt: 'R22 over London' },
      { id: 'hm2', url: '/assets/images/gallery/carousel/rotating6-mobile.jpg',     alt: 'HQ Aviation helicopter' },
    ],
  },
  {
    id: 'home-sfh-fleet',
    page: 'home',
    name: 'Self-Fly Hire — Fleet Images',
    hint: 'One aircraft image per fleet row in the Self-Fly Hire section (R66, R44, R22)',
    type: 'carousel',
    viewport: 'both',
    slideLabels: ['R66 Turbine', 'R44', 'R22'],
    images: [
      { id: 'sf1', url: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png', alt: 'R66 Turbine' },
      { id: 'sf2', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',          alt: 'R44' },
      { id: 'sf3', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'R22' },
    ],
  },
  {
    id: 'home-sfh-intro-img',
    page: 'home',
    name: 'Self-Fly Hire — Desktop Intro Carousel',
    hint: 'Auto-scrolling photo carousel on the left side of the Self-Fly Hire intro (desktop only). Add as many images as you like — they loop continuously.',
    type: 'gallery',
    viewport: 'desktop',
    images: [
      { id: 'si1', url: '/assets/images/facility/hq-0167.jpg',         alt: 'Helicopter on the pad' },
      { id: 'si2', url: '/assets/images/facility/fleet-lineup.jpg',    alt: 'Fleet lineup' },
      { id: 'si3', url: '/assets/images/facility/hq-0153-3.jpg',       alt: 'Helicopters on the airfield' },
      { id: 'si4', url: '/assets/images/gallery/flying/flying-.jpg',   alt: 'Flying' },
      { id: 'si5', url: '/assets/images/facility/hq-0696.jpg',         alt: 'Captain Q flying' },
      { id: 'si6', url: '/assets/images/facility/hq-0300.jpg',         alt: 'R66 cockpit instruments' },
      { id: 'si7', url: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet at sunset' },
    ],
  },
  {
    id: 'home-sfh-mobile-carousel',
    page: 'home',
    name: 'Self-Fly Hire — Mobile Carousel',
    hint: 'Scrolling photo carousel shown on mobile in the Self-Fly Hire section',
    type: 'gallery',
    viewport: 'mobile',
    images: [
      { id: 'sm1', url: '/assets/images/facility/hq-0167.jpg',                    alt: 'Helicopter on the pad' },
      { id: 'sm2', url: '/assets/images/facility/fleet-lineup.jpg',               alt: 'Fleet lineup' },
      { id: 'sm3', url: '/assets/images/facility/hq-0153-3.jpg',                  alt: 'Helicopters on the airfield' },
      { id: 'sm4', url: '/assets/images/gallery/flying/flying-.jpg',              alt: 'Flying' },
      { id: 'sm5', url: '/assets/images/facility/hq-0696.jpg',                    alt: 'Captain Q flying' },
      { id: 'sm6', url: '/assets/images/facility/hq-0300.jpg',                    alt: 'R66 cockpit instruments' },
      { id: 'sm7', url: '/assets/images/facility/fleet-lineup-sunset.jpg',        alt: 'Fleet at sunset' },
    ],
  },
  {
    id: 'home-maint-scroll-1',
    page: 'home',
    name: 'Maintenance — Scroll Gallery Row 1',
    hint: 'Left column of the vertical-scrolling maintenance photo gallery (scrolls upward)',
    type: 'gallery',
    viewport: 'both',
    images: [
      { id: 'ms1', url: '/assets/images/facility/maintenance-.jpg',   alt: 'Maintenance facility' },
      { id: 'ms2', url: '/assets/images/facility/hq-0391.jpg',        alt: 'Engineering workshop' },
      { id: 'ms3', url: '/assets/images/facility/hq-0477.jpg',        alt: 'Engine work' },
      { id: 'ms4', url: '/assets/images/facility/hq-0354.jpg',        alt: 'Rotor inspection' },
      { id: 'ms5', url: '/assets/images/facility/hq-0035.jpg',        alt: 'Hangar floor' },
      { id: 'ms6', url: '/assets/images/facility/hq-0089.jpg',        alt: 'Component detail' },
      { id: 'ms7', url: '/assets/images/facility/hq-0745.jpg',        alt: 'Aircraft on apron' },
    ],
  },
  {
    id: 'home-maint-scroll-2',
    page: 'home',
    name: 'Maintenance — Scroll Gallery Row 2',
    hint: 'Right column of the vertical-scrolling maintenance photo gallery (scrolls downward)',
    type: 'gallery',
    viewport: 'both',
    images: [
      { id: 'mt1', url: '/assets/images/facility/sales-rebuild.jpg',      alt: 'Rebuild in progress' },
      { id: 'mt2', url: '/assets/images/facility/hq-0167.jpg',            alt: 'Avionics bench' },
      { id: 'mt3', url: '/assets/images/facility/okey-paint-quality.jpg', alt: 'Paint shop' },
      { id: 'mt4', url: '/assets/images/facility/hq-0345.jpg',            alt: 'Rotor blades' },
      { id: 'mt5', url: '/assets/images/facility/hq-0053.jpg',            alt: 'Workshop' },
      { id: 'mt6', url: '/assets/images/facility/hq-0300.jpg',            alt: 'Cockpit instruments' },
      { id: 'mt7', url: '/assets/images/facility/hq-0696.jpg',            alt: 'Aircraft on apron' },
    ],
  },
  {
    id: 'home-about-carousel',
    page: 'home',
    name: 'About — Founder Carousel',
    hint: 'Mobile-only carousel of Captain Q expedition photos in the About section',
    type: 'gallery',
    viewport: 'mobile',
    images: [
      { id: 'ac1', url: '/assets/images/expeditions/antartica.jpg',               alt: 'Antarctica expedition' },
      { id: 'ac2', url: '/assets/images/expeditions/north-pole.jpg',              alt: 'North Pole landing' },
      { id: 'ac3', url: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Six helicopters at the North Pole' },
      { id: 'ac4', url: '/assets/images/expeditions/channel.jpg',                 alt: 'Channel crossing' },
      { id: 'ac5', url: '/assets/images/facility/hq-0696.jpg',                    alt: 'Captain Q flying' },
      { id: 'ac6', url: '/assets/images/gallery/flying/flying-.jpg',              alt: 'Helicopter in flight' },
    ],
  },
  {
    id: 'home-clubhouse-carousel',
    page: 'home',
    name: 'Clubhouse — Mobile Carousel',
    hint: 'Mobile-only carousel of clubhouse interior and detail photos',
    type: 'gallery',
    viewport: 'mobile',
    images: [
      { id: 'cc1', url: '/assets/images/facility/hq-0345.jpg',   alt: 'The clubhouse lounge' },
      { id: 'cc2', url: '/assets/images/facility/hq-0354.jpg',   alt: 'Globe on the clubhouse desk' },
      { id: 'cc3', url: '/assets/images/facility/hq-0053.jpg',   alt: 'Helmet light and framed photos' },
      { id: 'cc4', url: '/assets/images/facility/hq-0391.jpg',   alt: 'Captain Q expedition photo on the wall' },
      { id: 'cc5', url: '/assets/images/facility/hq-0477.jpg',   alt: 'Helicopter compass instrument' },
      { id: 'cc6', url: '/assets/images/facility/hq-0300.jpg',   alt: 'R66 Turbine cockpit instruments' },
      { id: 'cc7', url: '/assets/images/facility/hq-0388.jpg',   alt: "Air Pilot's Manual on vintage trunk" },
      { id: 'cc8', url: '/assets/images/facility/hq-0696.jpg',   alt: 'Captain Q flying' },
      { id: 'cc9', url: '/assets/images/facility/hq-0153-3.jpg', alt: 'Helicopters on the airfield' },
    ],
  },
  {
    id: 'home-sales-intro-gallery',
    page: 'home',
    name: 'Sales — Intro Photo Gallery',
    hint: 'Grid of facility/fleet photos at the top of the Sales section (desktop)',
    type: 'gallery',
    viewport: 'desktop',
    images: [
      { id: 'sg1',  url: '/assets/images/facility/main-sales-pic.jpg',        alt: 'HQ Aviation showroom' },
      { id: 'sg2',  url: '/assets/images/facility/hq-aviation-robinsons.jpg', alt: 'Fleet on the apron' },
      { id: 'sg3',  url: '/assets/images/facility/hq-0477.jpg',               alt: 'Helicopter instruments' },
      { id: 'sg4',  url: '/assets/images/facility/hq-0391.jpg',               alt: 'Engineering workshop' },
      { id: 'sg5',  url: '/assets/images/facility/hq-0745.jpg',               alt: 'Helicopter on apron' },
      { id: 'sg6',  url: '/assets/images/facility/hq-0354.jpg',               alt: 'Pre-flight checks' },
      { id: 'sg7',  url: '/assets/images/facility/hq-0696.jpg',               alt: 'Cockpit detail' },
      { id: 'sg8',  url: '/assets/images/facility/hq-0167.jpg',               alt: 'Hangar interior' },
      { id: 'sg9',  url: '/assets/images/facility/hq-0089.jpg',               alt: 'Rotor detail' },
      { id: 'sg10', url: '/assets/images/facility/hq-0035.jpg',               alt: 'Maintenance inspection' },
    ],
  },
  {
    id: 'home-sales-mobile-carousel',
    page: 'home',
    name: 'Sales — Mobile Carousel',
    hint: 'Mobile-only scrolling photo carousel at the top of the Sales section',
    type: 'gallery',
    viewport: 'mobile',
    images: [
      { id: 'sc1', url: '/assets/images/facility/main-sales-pic.jpg',        alt: 'HQ Aviation showroom' },
      { id: 'sc2', url: '/assets/images/facility/hq-aviation-robinsons.jpg', alt: 'Fleet on the apron' },
      { id: 'sc3', url: '/assets/images/facility/hq-0477.jpg',               alt: 'Helicopter instruments' },
      { id: 'sc4', url: '/assets/images/facility/hq-0391.jpg',               alt: 'Engineering workshop' },
      { id: 'sc5', url: '/assets/images/facility/hq-0745.jpg',               alt: 'Helicopter on apron' },
      { id: 'sc6', url: '/assets/images/facility/hq-0354.jpg',               alt: 'Pre-flight checks' },
      { id: 'sc7', url: '/assets/images/facility/hq-0696.jpg',               alt: 'Cockpit detail' },
      { id: 'sc8', url: '/assets/images/facility/hq-0167.jpg',               alt: 'Hangar interior' },
    ],
  },
  {
    id: 'home-parallax-flying',
    page: 'home',
    name: 'Parallax — Flying Section',
    hint: 'Full-screen background image behind the "Flying" parallax divider',
    type: 'single',
    viewport: 'both',
    images: [
      { id: 'pf1', url: '/assets/images/gallery/flying/flying-.jpg', alt: 'Helicopter flying' },
    ],
  },
  {
    id: 'home-parallax-sales',
    page: 'home',
    name: 'Parallax — Sales Section',
    hint: 'Full-screen background image behind the "Sales" parallax divider',
    type: 'single',
    viewport: 'both',
    images: [
      { id: 'ps1', url: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet at sunset' },
    ],
  },
  {
    id: 'home-parallax-maintenance',
    page: 'home',
    name: 'Parallax — Maintenance Section',
    hint: 'Full-screen background image behind the "Maintenance" parallax divider',
    type: 'single',
    viewport: 'both',
    images: [
      { id: 'pm1', url: '/assets/images/facility/maintenance-.jpg', alt: 'Maintenance facility' },
    ],
  },
  {
    id: 'home-parallax-contact',
    page: 'home',
    name: 'Parallax — Contact Section',
    hint: 'Full-screen background image behind the "Contact & Find Us" parallax divider',
    type: 'single',
    viewport: 'both',
    images: [
      { id: 'pc1', url: '/assets/images/facility/hq-0035.jpg', alt: 'HQ Aviation facility' },
    ],
  },

  {
    id: 'home-training-specialist',
    page: 'home',
    name: 'Training — Specialist Services Cards',
    hint: 'One image per specialist service card at the bottom of the Training section (SuperYacht Ops, Pilot Provisioning, Advanced Training, Aircraft Consulting)',
    type: 'carousel',
    viewport: 'both',
    slideLabels: ['SuperYacht Ops', 'Pilot Provisioning', 'Advanced Training', 'Aircraft Consulting'],
    images: [
      { id: 'ts1', url: '/assets/images/lifestyle/superyacht-ops.jpg',       alt: 'Superyacht operations' },
      { id: 'ts2', url: '/assets/images/gallery/flying/flying--1.jpg',       alt: 'Pilot provisioning' },
      { id: 'ts3', url: '/assets/images/gallery/flying/flying-.jpg',         alt: 'Advanced training' },
      { id: 'ts4', url: '/assets/images/facility/hq-0354.jpg',               alt: 'Aircraft consulting' },
    ],
  },
  {
    id: 'home-clubhouse-gallery',
    page: 'home',
    name: 'Clubhouse — Desktop Photo Grid',
    hint: 'CSS photo grid in the Clubhouse section (desktop). Fixed 9-slot layout: wide, square, square, tall, square, wide, square, square, wide.',
    type: 'gallery',
    viewport: 'desktop',
    images: [
      { id: 'cg1', url: '/assets/images/facility/hq-0345.jpg',   alt: 'The clubhouse lounge' },
      { id: 'cg2', url: '/assets/images/facility/hq-0354.jpg',   alt: 'Globe on the clubhouse desk' },
      { id: 'cg3', url: '/assets/images/facility/hq-0053.jpg',   alt: 'Helmet light and framed photos' },
      { id: 'cg4', url: '/assets/images/facility/hq-0391.jpg',   alt: 'Captain Q expedition photo on the wall' },
      { id: 'cg5', url: '/assets/images/facility/hq-0477.jpg',   alt: 'Helicopter compass instrument' },
      { id: 'cg6', url: '/assets/images/facility/hq-0300.jpg',   alt: 'R66 Turbine cockpit instruments' },
      { id: 'cg7', url: '/assets/images/facility/hq-0388.jpg',   alt: "Air Pilot's Manual on vintage trunk" },
      { id: 'cg8', url: '/assets/images/facility/hq-0696.jpg',   alt: 'Captain Q flying' },
      { id: 'cg9', url: '/assets/images/facility/hq-0153-3.jpg', alt: 'Helicopters on the airfield' },
    ],
  },
  {
    id: 'home-sales-aircraft',
    page: 'home',
    name: 'Sales — New Aircraft Model Images',
    hint: 'Cutout image for each new helicopter model in the Sales section (R88, R66 Turbine, R44 Raven II, R22 Beta II)',
    type: 'carousel',
    viewport: 'both',
    slideLabels: ['R88', 'R66 Turbine', 'R44 Raven II', 'R22 Beta II'],
    images: [
      { id: 'na1', url: '/assets/images/new-aircraft/r88/r88-jellybean-left.png',              alt: 'Robinson R88' },
      { id: 'na2', url: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',    alt: 'Robinson R66 Turbine' },
      { id: 'na3', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',            alt: 'Robinson R44 Raven II' },
      { id: 'na4', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'Robinson R22 Beta II' },
    ],
  },

  // ─── ABOUT US PAGE ─────────────────────────────────────────────────────────
  {
    id: 'about-hero',
    page: 'about',
    name: 'Hero Background',
    hint: 'Full-bleed background image behind the About Us hero heading',
    type: 'single',
    images: [
      { id: 'aho1', url: '/assets/images/facility/busy-hangar.jpg', alt: 'HQ Aviation Hangar' },
    ],
  },
  {
    id: 'about-story-gallery',
    page: 'about',
    name: 'Our Story Gallery',
    hint: 'Six-photo mosaic grid in the "Built On Passion For Flight" section',
    type: 'gallery',
    images: [
      { id: 'asg1', url: '/assets/images/facility/hq-aviation-helicopter-hangar.webp', alt: 'HQ Aviation Hangar' },
      { id: 'asg2', url: '/assets/images/facility/hq-0345.jpg',                        alt: 'The clubhouse' },
      { id: 'asg3', url: '/assets/images/facility/hq-0053.jpg',                        alt: 'Aviation memorabilia' },
      { id: 'asg4', url: '/assets/images/facility/hq-0391.jpg',                        alt: 'Expedition photos' },
      { id: 'asg5', url: '/assets/images/facility/hq-0354.jpg',                        alt: 'Globe on desk' },
      { id: 'asg6', url: '/assets/images/facility/hq-0300.jpg',                        alt: 'R66 cockpit' },
    ],
  },
  {
    id: 'about-captain-q',
    page: 'about',
    name: 'Captain Q Parallax',
    hint: 'Parallax background image in the "Captain Q" banner section',
    type: 'single',
    images: [
      { id: 'acq1', url: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp', alt: 'Captain Q — South Pole Expedition' },
    ],
  },
  {
    id: 'about-founder',
    page: 'about',
    name: 'Founder Portrait',
    hint: 'Captain Quentin Smith portrait in the "Captain Q" section',
    type: 'single',
    images: [
      { id: 's11', url: '/assets/images/team/world-helicopter-champion-quentin-smith.webp', alt: 'Captain Quentin Smith' },
    ],
  },
  {
    id: 'about-clubhouse-parallax',
    page: 'about',
    name: 'Clubhouse Parallax',
    hint: 'Parallax background image in the "The Clubhouse" banner section',
    type: 'single',
    images: [
      { id: 'aclp1', url: '/assets/images/facility/hq-0345.jpg', alt: 'The HQ Aviation Clubhouse' },
    ],
  },
  {
    id: 'about-clubhouse-gallery',
    page: 'about',
    name: 'Clubhouse Gallery',
    hint: 'Four-photo grid in the "Not a Flight School — A Clubhouse" section',
    type: 'gallery',
    images: [
      { id: 'acg1', url: '/assets/images/facility/hq-0391.jpg',                          alt: 'HQ Aviation interior' },
      { id: 'acg2', url: '/assets/images/gallery/events/img_2131.jpg',                   alt: 'HQ social events' },
      { id: 'acg3', url: '/assets/images/gallery/events/img_1358-copy-281-29.jpg',       alt: 'Community gathering' },
      { id: 'acg4', url: '/assets/images/facility/hq-0300.jpg',                          alt: 'R66 cockpit detail' },
    ],
  },
  {
    id: 'about-services',
    page: 'about',
    name: 'Services Cards',
    hint: 'One image per service card — Training, Aircraft Sales, Maintenance, Expeditions',
    type: 'cards',
    slideLabels: ['Flight Training', 'Aircraft Sales', 'Maintenance', 'Expeditions'],
    images: [
      { id: 'asv1', url: '/assets/images/facility/hq-0053.jpg',                                       alt: 'Flight Training' },
      { id: 'asv2', url: '/assets/images/facility/main-sales-pic.jpg',                                alt: 'Aircraft Sales' },
      { id: 'asv3', url: '/assets/images/facility/g-ccfc-hq-robinson-overhaul.webp',                  alt: 'Maintenance' },
      { id: 'asv4', url: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',       alt: 'Expeditions' },
    ],
  },
  {
    id: 'about-fleet',
    page: 'about',
    name: 'Fleet Showcase',
    hint: 'One image per aircraft tab — R22, R44, R66 — in the "The Fleet" section',
    type: 'cards',
    slideLabels: ['Robinson R22', 'Robinson R44', 'Robinson R66'],
    images: [
      { id: 'afl1', url: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'Robinson R22' },
      { id: 'afl2', url: '/assets/images/gallery/carousel/rotating2.jpg', alt: 'Robinson R44' },
      { id: 'afl3', url: '/assets/images/gallery/carousel/rotating6.jpg', alt: 'Robinson R66' },
    ],
  },
  {
    id: 'about-explorer-parallax',
    page: 'about',
    name: "Explorer's Club Parallax",
    hint: 'Parallax background image in the "The Explorer\'s Club" banner section',
    type: 'single',
    images: [
      { id: 'aep1', url: '/assets/images/expeditions/antartica.jpg', alt: "Explorer's Club — Antarctica" },
    ],
  },
  {
    id: 'about-explorer',
    page: 'about',
    name: "Explorer's Club Image",
    hint: 'Side image in the "Beyond the Licence" content section',
    type: 'single',
    images: [
      { id: 'ae1', url: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Fleet of helicopters at the North Pole' },
    ],
  },
  {
    id: 'about-certs',
    page: 'about',
    name: 'Certification Logos',
    hint: 'Six accreditation/membership logos — CAA, EASA, FAA, RHC, HCGB, FAI',
    type: 'gallery',
    images: [
      { id: 'act1', url: '/assets/images/logos/certifications/caa.jpg',       alt: 'Civil Aviation Authority' },
      { id: 'act2', url: '/assets/images/logos/certifications/easa1.png',      alt: 'EASA' },
      { id: 'act3', url: '/assets/images/logos/certifications/faa-logo.jpg',   alt: 'Federal Aviation Administration' },
      { id: 'act4', url: '/assets/images/logos/certifications/rhc.png',        alt: 'Robinson Helicopter Company' },
      { id: 'act5', url: '/assets/images/logos/certifications/hcgb-logo.png',  alt: 'Helicopter Club of Great Britain' },
      { id: 'act6', url: '/assets/images/logos/certifications/fai-logo.png',   alt: 'Fédération Aéronautique Internationale' },
    ],
  },
  {
    id: 'about-robinson',
    page: 'about',
    name: 'Robinson Authorized Badge',
    hint: 'Robinson Helicopter Company badge/logo in the authorized dealer section',
    type: 'single',
    images: [
      { id: 'arb1', url: '/assets/images/logos/certifications/robinson.jpg', alt: 'Robinson Helicopter Company' },
    ],
  },
  {
    id: 'about-cta',
    page: 'about',
    name: 'CTA Background',
    hint: 'Background image behind the "Come and See Us" call-to-action section',
    type: 'single',
    images: [
      { id: 'acta1', url: '/assets/images/facility/hq-0089.jpg', alt: 'HQ Aviation' },
    ],
  },

  // ─── DISCOVERY FLIGHT PAGE ────────────────────────────────────────────────
  {
    id: 'discovery-hero',
    page: 'discovery',
    name: 'Hero Background',
    hint: 'Full-screen background image at the very top of the Discovery Flight page',
    type: 'single',
    images: [
      { id: 'dh1', url: '/assets/images/gallery/carousel/rotating8.jpg', alt: 'Helicopter in flight' },
    ],
  },
  {
    id: 'discovery-aircraft',
    page: 'discovery',
    name: 'Aircraft Booking Cards',
    hint: 'One image per aircraft booking card — R22, R44, R66',
    type: 'cards',
    slideLabels: ['Robinson R22', 'Robinson R44', 'Robinson R66'],
    images: [
      { id: 'da1', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'Robinson R22' },
      { id: 'da2', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',            alt: 'Robinson R44' },
      { id: 'da3', url: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',   alt: 'Robinson R66' },
    ],
  },
  {
    id: 'discovery-instructor',
    page: 'discovery',
    name: 'Lead Instructor Portrait',
    hint: 'Portrait photo in the "Your Instructor" section',
    type: 'single',
    images: [
      { id: 'di1', url: '/assets/images/team/quentin-smith-profile-picture.jpg', alt: 'Quentin Smith — Lead Instructor' },
    ],
  },

  // ─── SELF-FLY HIRE PAGE ───────────────────────────────────────────────────
  {
    id: 'sfh-hero',
    page: 'sfh',
    name: 'Hero Background',
    hint: 'Full-screen background image at the top of the Self-Fly Hire page',
    type: 'single',
    images: [
      { id: 'sh1', url: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'Helicopter in flight' },
    ],
  },
  {
    id: 'sfh-fleet',
    page: 'sfh',
    name: 'Fleet Aircraft Images',
    hint: 'One aircraft image per fleet tab — R22, R44 Raven II, R66 Turbine',
    type: 'cards',
    slideLabels: ['Robinson R22', 'Robinson R44 Raven II', 'Robinson R66 Turbine'],
    images: [
      { id: 'sf1', url: '/assets/images/fleet/r22-g-ulze.png',  alt: 'Robinson R22' },
      { id: 'sf2', url: '/assets/images/fleet/r44-g-mxpi.png',  alt: 'Robinson R44 Raven II' },
      { id: 'sf3', url: '/assets/images/fleet/r66-g-tlmi.png',  alt: 'Robinson R66 Turbine' },
    ],
  },
  {
    id: 'sfh-intro',
    page: 'sfh',
    name: 'Intro Section Image',
    hint: 'Fleet photo beside the introduction paragraph',
    type: 'single',
    images: [
      { id: 'si1', url: '/assets/images/facility/fleet-lineup.jpg', alt: 'HQ Aviation helicopter fleet' },
    ],
  },

  // ─── AIRCRAFT SALES PAGE ──────────────────────────────────────────────────
  {
    id: 'sales-aircraft-hero',
    page: 'sales',
    name: 'Aircraft Hero Images',
    hint: 'Large atmospheric photo per model — R88, R66, R44, R22. Shown in the hero when that model is selected.',
    type: 'cards',
    slideLabels: ['R88', 'R66', 'R44', 'R22'],
    images: [
      { id: 'sah1', url: '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg',  alt: 'Robinson R88' },
      { id: 'sah2', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg', alt: 'Robinson R66' },
      { id: 'sah3', url: '/assets/images/new-aircraft/r44/r44blueprint.jpg',                                                   alt: 'Robinson R44' },
      { id: 'sah4', url: '/assets/images/new-aircraft/r22/r22blueprint.jpg',                                                   alt: 'Robinson R22' },
    ],
  },
  {
    id: 'sales-aircraft-cutout',
    page: 'sales',
    name: 'Aircraft Cutout PNGs',
    hint: 'Transparent cutout PNG per model — R88, R66, R44, R22. Shown in the model selector.',
    type: 'cards',
    slideLabels: ['R88 Cutout', 'R66 Cutout', 'R44 Cutout', 'R22 Cutout'],
    images: [
      { id: 'sac1', url: '/assets/images/new-aircraft/r88/r88-jellybean-left.png',              alt: 'R88 transparent cutout' },
      { id: 'sac2', url: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png',    alt: 'R66 transparent cutout' },
      { id: 'sac3', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',            alt: 'R44 transparent cutout' },
      { id: 'sac4', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'R22 transparent cutout' },
    ],
  },
  {
    id: 'sales-gallery',
    page: 'sales',
    name: 'Photo Gallery Scroll',
    hint: 'Horizontal-scroll photo gallery below the model selector — 9 aircraft images',
    type: 'gallery',
    images: [
      { id: 'sg1', url: '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg',              alt: 'R88 — The Future' },
      { id: 'sg2', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-view-13611.jpg',                  alt: 'R66 Palo Verde' },
      { id: 'sg3', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-dramatic-overhead-13365.jpg',               alt: 'R66 Overhead' },
      { id: 'sg4', url: '/assets/images/new-aircraft/r88/rhc-r88-left-pilot-seat-full-frame-13570.jpg',                  alt: 'R88 Cockpit' },
      { id: 'sg5', url: '/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg',     alt: 'Glass Cockpit' },
      { id: 'sg6', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg', alt: 'R66 Riviera' },
      { id: 'sg7', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',                                      alt: 'R44 Raven II' },
      { id: 'sg8', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png',                            alt: 'R22 Beta II' },
      { id: 'sg9', url: '/assets/images/new-aircraft/r88/r88-jellybean-left.png',                                        alt: 'R88 Profile' },
    ],
  },


  // ─── PPL TRAINING PAGE (/training/ppl) ────────────────────────────────────
  {
    id: 'ppl-hero',
    page: 'ppl',
    name: 'Hero Background',
    hint: 'Full-screen background image at the top of the PPL Training page',
    type: 'single',
    images: [
      { id: 'ph1', url: '/assets/images/gallery/carousel/rotating6.jpg', alt: 'Helicopter in flight' },
    ],
  },
  {
    id: 'ppl-instructors',
    page: 'ppl',
    name: 'Instructor Portraits',
    hint: 'One photo per instructor card — Chief Instructor, Flight Instructor',
    type: 'cards',
    slideLabels: ['Quentin Smith — Chief Instructor', 'Mackie Alcantara — Flight Instructor'],
    images: [
      { id: 'pi1', url: '/assets/images/team/quentin-smith-profile-picture.jpg', alt: 'Quentin Smith — Chief Instructor' },
      { id: 'pi2', url: '/assets/images/team/mackie-alcantara-profile-picture.jpg', alt: 'Mackie Alcantara — Flight Instructor' },
    ],
  },
  {
    id: 'ppl-cta',
    page: 'ppl',
    name: 'CTA Section Background',
    hint: 'Background image in the "Start Your Journey" call-to-action section',
    type: 'single',
    images: [
      { id: 'pc1', url: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'Helicopter in flight' },
    ],
  },

  // ─── TYPE RATING PAGE (/training/type-rating) ──────────────────────────────
  {
    id: 'type-rating-hero',
    page: 'type-rating',
    name: 'Hero Background',
    hint: 'Full-screen background image at the top of the Type Rating page',
    type: 'single',
    images: [
      { id: 'trh1', url: '/assets/images/gallery/carousel/rotating8.jpg', alt: 'Helicopter cockpit' },
    ],
  },
  {
    id: 'type-rating-intro',
    page: 'type-rating',
    name: 'Intro Section Image',
    hint: 'Photo beside the introductory paragraph on the Type Rating page',
    type: 'single',
    images: [
      { id: 'tri1', url: '/assets/images/gallery/carousel/rotating6.jpg', alt: 'Helicopter in flight' },
    ],
  },
  {
    id: 'type-rating-fleet',
    page: 'type-rating',
    name: 'Fleet Aircraft Images',
    hint: 'One image per aircraft available for type rating — R22, R44, R66, Hughes 500, AS350, Bell 407',
    type: 'cards',
    slideLabels: ['Robinson R22', 'Robinson R44', 'Robinson R66', 'Hughes 500', 'AS350 Squirrel', 'Bell 407'],
    images: [
      { id: 'trf1', url: '/assets/images/fleet/r22-g-ulze.png',      alt: 'Robinson R22' },
      { id: 'trf2', url: '/assets/images/fleet/r44-g-mxpi.png',      alt: 'Robinson R44' },
      { id: 'trf3', url: '/assets/images/fleet/r66-g-tlmi.png',      alt: 'Robinson R66' },
      { id: 'trf4', url: '/assets/images/fleet/hughes-500.jpg',       alt: 'Hughes 500' },
      { id: 'trf5', url: '/assets/images/fleet/as350-squirrel.jpg',  alt: 'AS350 Squirrel' },
      { id: 'trf6', url: '/assets/images/fleet/bell-407.jpg',         alt: 'Bell 407' },
    ],
  },

  // ─── REBUILDS PAGE (/sales/rebuilds) ──────────────────────────────────────
  {
    id: 'rebuilds-hero',
    page: 'rebuilds',
    name: 'Hero Image',
    hint: 'Large image at the top of the Rebuilds page',
    type: 'single',
    images: [
      { id: 'rbh1', url: '/assets/images/facility/main-sales-pic.jpg', alt: 'Helicopter rebuild facility' },
    ],
  },
  {
    id: 'rebuilds-models',
    page: 'rebuilds',
    name: 'Rebuild Model Images',
    hint: 'One aircraft image per rebuild model available — R22, R44, R66',
    type: 'cards',
    slideLabels: ['Robinson R22 Beta II', 'Robinson R44 Raven II', 'Robinson R66 Turbine'],
    images: [
      { id: 'rbm1', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'Robinson R22 Beta II' },
      { id: 'rbm2', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png',            alt: 'Robinson R44 Raven II' },
      { id: 'rbm3', url: '/assets/images/used-aircraft/r66/r66-turbine-ghkcc.jpg',              alt: 'Robinson R66 Turbine' },
    ],
  },
  {
    id: 'rebuilds-steps-r22',
    page: 'rebuilds',
    name: 'R22 Rebuild — Before & After Photos',
    hint: 'Before and after photos for each R22 rebuild stage: Airframe, Engine, Avionics, Wiring, Interior, Paint',
    type: 'gallery',
    images: [
      { id: 'r22b1', url: '/assets/images/rebuilds/r22/airframe-before.jpg', alt: 'R22 Airframe — Before' },
      { id: 'r22a1', url: '/assets/images/rebuilds/r22/airframe-after.jpg',  alt: 'R22 Airframe — After' },
      { id: 'r22b2', url: '/assets/images/rebuilds/r22/engine-before.jpg',   alt: 'R22 Engine — Before' },
      { id: 'r22a2', url: '/assets/images/rebuilds/r22/engine-after.jpg',    alt: 'R22 Engine — After' },
      { id: 'r22b3', url: '/assets/images/rebuilds/r22/avionics-before.jpg', alt: 'R22 Avionics — Before' },
      { id: 'r22a3', url: '/assets/images/rebuilds/r22/avionics-after.jpg',  alt: 'R22 Avionics — After' },
      { id: 'r22b4', url: '/assets/images/rebuilds/r22/wiring-before.jpg',   alt: 'R22 Wiring — Before' },
      { id: 'r22a4', url: '/assets/images/rebuilds/r22/wiring-after.jpg',    alt: 'R22 Wiring — After' },
      { id: 'r22b5', url: '/assets/images/rebuilds/r22/interior-before.jpg', alt: 'R22 Interior — Before' },
      { id: 'r22a5', url: '/assets/images/rebuilds/r22/interior-after.jpg',  alt: 'R22 Interior — After' },
      { id: 'r22b6', url: '/assets/images/rebuilds/r22/paint-before.jpg',    alt: 'R22 Paint — Before' },
      { id: 'r22a6', url: '/assets/images/rebuilds/r22/paint-after.jpg',     alt: 'R22 Paint — After' },
    ],
  },
  {
    id: 'rebuilds-steps-r44',
    page: 'rebuilds',
    name: 'R44 Rebuild — Before & After Photos',
    hint: 'Before and after photos for each R44 rebuild stage: Airframe, Engine, Avionics, Wiring, Interior, Paint',
    type: 'gallery',
    images: [
      { id: 'r44b1', url: '/assets/images/rebuilds/r44/airframe-before.jpg', alt: 'R44 Airframe — Before' },
      { id: 'r44a1', url: '/assets/images/rebuilds/r44/airframe-after.jpg',  alt: 'R44 Airframe — After' },
      { id: 'r44b2', url: '/assets/images/rebuilds/r44/engine-before.jpg',   alt: 'R44 Engine — Before' },
      { id: 'r44a2', url: '/assets/images/rebuilds/r44/engine-after.jpg',    alt: 'R44 Engine — After' },
      { id: 'r44b3', url: '/assets/images/rebuilds/r44/avionics-before.jpg', alt: 'R44 Avionics — Before' },
      { id: 'r44a3', url: '/assets/images/rebuilds/r44/avionics-after.jpg',  alt: 'R44 Avionics — After' },
      { id: 'r44b4', url: '/assets/images/rebuilds/r44/wiring-before.jpg',   alt: 'R44 Wiring — Before' },
      { id: 'r44a4', url: '/assets/images/rebuilds/r44/wiring-after.jpg',    alt: 'R44 Wiring — After' },
      { id: 'r44b5', url: '/assets/images/rebuilds/r44/interior-before.jpg', alt: 'R44 Interior — Before' },
      { id: 'r44a5', url: '/assets/images/rebuilds/r44/interior-after.jpg',  alt: 'R44 Interior — After' },
      { id: 'r44b6', url: '/assets/images/rebuilds/r44/paint-before.jpg',    alt: 'R44 Paint — Before' },
      { id: 'r44a6', url: '/assets/images/rebuilds/r44/paint-after.jpg',     alt: 'R44 Paint — After' },
    ],
  },
  {
    id: 'rebuilds-steps-r66',
    page: 'rebuilds',
    name: 'R66 Rebuild — Before & After Photos',
    hint: 'Before and after photos for each R66 rebuild stage: Airframe, Engine, Avionics, Wiring, Interior, Paint',
    type: 'gallery',
    images: [
      { id: 'r66b1', url: '/assets/images/rebuilds/r66/airframe-before.jpg', alt: 'R66 Airframe — Before' },
      { id: 'r66a1', url: '/assets/images/rebuilds/r66/airframe-after.jpg',  alt: 'R66 Airframe — After' },
      { id: 'r66b2', url: '/assets/images/rebuilds/r66/engine-before.jpg',   alt: 'R66 Engine — Before' },
      { id: 'r66a2', url: '/assets/images/rebuilds/r66/engine-after.jpg',    alt: 'R66 Engine — After' },
      { id: 'r66b3', url: '/assets/images/rebuilds/r66/avionics-before.jpg', alt: 'R66 Avionics — Before' },
      { id: 'r66a3', url: '/assets/images/rebuilds/r66/avionics-after.jpg',  alt: 'R66 Avionics — After' },
      { id: 'r66b4', url: '/assets/images/rebuilds/r66/wiring-before.jpg',   alt: 'R66 Wiring — Before' },
      { id: 'r66a4', url: '/assets/images/rebuilds/r66/wiring-after.jpg',    alt: 'R66 Wiring — After' },
      { id: 'r66b5', url: '/assets/images/rebuilds/r66/interior-before.jpg', alt: 'R66 Interior — Before' },
      { id: 'r66a5', url: '/assets/images/rebuilds/r66/interior-after.jpg',  alt: 'R66 Interior — After' },
      { id: 'r66b6', url: '/assets/images/rebuilds/r66/paint-before.jpg',    alt: 'R66 Paint — Before' },
      { id: 'r66a6', url: '/assets/images/rebuilds/r66/paint-after.jpg',     alt: 'R66 Paint — After' },
    ],
  },

  // ─── HELICOPTER TOUR OF LONDON PAGE (/helicopter-tour-of-london) ───────────
  {
    id: 'helicopter-tour-hero',
    page: 'helicopter-tour',
    name: 'Hero Background',
    hint: 'Full-screen background image at the top of the Helicopter Tour page',
    type: 'single',
    images: [
      { id: 'hth1', url: '/assets/images/gallery/flying/flying-.jpg', alt: 'London aerial view' },
    ],
  },
  {
    id: 'helicopter-tour-gallery',
    page: 'helicopter-tour',
    name: 'Photo Gallery',
    hint: 'Gallery of London landmark photos shown in the tour page gallery section',
    type: 'gallery',
    images: [
      { id: 'htg1', url: '/assets/images/gallery/carousel/rotating1.jpg',               alt: 'Tower Bridge' },
      { id: 'htg2', url: '/assets/images/gallery/carousel/rotating2.jpg',               alt: 'The Shard' },
      { id: 'htg3', url: '/assets/images/gallery/flying/foggy-evening-flying.jpg',      alt: 'Thames at Sunset' },
      { id: 'htg4', url: '/assets/images/gallery/carousel/rotating8.jpg',               alt: 'City Skyline' },
    ],
  },

  // ─── EXPEDITIONS PAGE (/expeditions — FinalExpeditions.jsx) ───────────────
  {
    id: 'expeditions-hero',
    page: 'expeditions',
    name: 'Hero Background',
    hint: 'Full-screen background image at the top of the Expeditions page',
    type: 'single',
    images: [
      { id: 'exh1', url: '/assets/images/expeditions/south-pole-by-helicopter-quentin-smith.webp', alt: 'Expedition helicopter' },
    ],
  },

  // ─── MAINTENANCE PAGE (/maintenance — FinalMaintenance.jsx) ───────────────
  {
    id: 'maintenance-hero',
    page: 'maintenance',
    name: 'Hero Background',
    hint: 'Full-screen background image at the top of the Maintenance page',
    type: 'single',
    images: [
      { id: 'mnh1', url: '/assets/images/facility/hq-0056.jpg', alt: 'HQ Aviation maintenance facility' },
    ],
  },
  {
    id: 'maintenance-facility-gallery',
    page: 'maintenance',
    name: 'Facility Photo Gallery',
    hint: 'Photos in the facility gallery section — main hangar, workshop, engine bay, avionics lab, paint booth, parts storage',
    type: 'gallery',
    images: [
      { id: 'mnf1', url: '/assets/images/facility/hangar-main.jpg',     alt: 'Main hangar' },
      { id: 'mnf2', url: '/assets/images/facility/workshop.jpg',         alt: 'Workshop' },
      { id: 'mnf3', url: '/assets/images/facility/engine-bay.jpg',       alt: 'Engine bay' },
      { id: 'mnf4', url: '/assets/images/facility/avionics-lab.jpg',     alt: 'Avionics lab' },
      { id: 'mnf5', url: '/assets/images/facility/paint-booth.jpg',      alt: 'Paint booth' },
      { id: 'mnf6', url: '/assets/images/facility/parts-storage.jpg',    alt: 'Parts storage' },
    ],
  },

  // ─── EXPEDITIONS PAGE — ADDITIONAL SECTIONS ───────────────────────────────
  {
    id: 'expeditions-highlight',
    page: 'expeditions',
    name: 'Highlight Reel Thumbnail',
    hint: 'Thumbnail shown before the highlight reel video starts playing',
    type: 'single',
    images: [
      { id: 'exh1', url: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp', alt: 'Expedition Highlights' },
    ],
  },

  // ─── FLEET PAGE (/fleet) ──────────────────────────────────────────────────
  {
    id: 'fleet-hero',
    page: 'fleet',
    name: 'Fleet Hero Image',
    hint: 'Full-screen hero background at the top of the fleet page',
    type: 'single',
    images: [
      { id: 'flh1', url: '/assets/images/facility/busy-hangar.jpg', alt: 'HQ Aviation Fleet' },
    ],
  },
  {
    id: 'fleet-highlight',
    page: 'fleet',
    name: 'Fleet Highlight Background',
    hint: 'Background image for the Fleet Highlight section',
    type: 'single',
    images: [
      { id: 'flh2', url: '/assets/images/gallery/carousel/rotating6.jpg', alt: 'MD 500 Helicopter' },
    ],
  },

  // ─── AIRCRAFT SALES PAGE (/aircraft-sales) ────────────────────────────────
  {
    id: 'aircraft-sales-cards',
    page: 'aircraft-sales',
    name: 'Aircraft Model Cards',
    hint: 'One image per aircraft model card — R22, R44, R66, R88',
    type: 'cards',
    slideLabels: ['R22 Beta II', 'R44 Series', 'R66 Turbine', 'R88'],
    images: [
      { id: 'asc1', url: '/assets/images/r22.jpg', alt: 'R22 Beta II' },
      { id: 'asc2', url: '/assets/images/r44.jpg', alt: 'R44 Series' },
      { id: 'asc3', url: '/assets/images/r66.jpg', alt: 'R66 Turbine' },
      { id: 'asc4', url: '/assets/images/r88.jpg', alt: 'R88' },
    ],
  },

  // ─── R22 PAGE (/aircraft/r22) ─────────────────────────────────────────────
  {
    id: 'r22-gallery',
    page: 'r22',
    name: 'R22 Photo Gallery',
    hint: 'Photo gallery grid on the R22 aircraft page',
    type: 'gallery',
    images: [
      { id: 'r22g1', url: '/assets/images/new-aircraft/r22/r22-cutout.png',                    alt: 'R22 Cutout View' },
      { id: 'r22g2', url: '/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png', alt: 'R22 Front View' },
      { id: 'r22g3', url: '/assets/images/new-aircraft/r22/r22blueprint.jpg',                   alt: 'R22 Blueprint' },
      { id: 'r22g4', url: '/assets/images/used-aircraft/r22/british-team-r22.webp',             alt: 'British Team R22' },
      { id: 'r22g5', url: '/assets/images/used-aircraft/r22/hq-r22-lineup.jpg',                 alt: 'HQ R22 Fleet' },
    ],
  },

  {
    id: 'r22-hero',
    page: 'r22',
    name: 'R22 Hero Image',
    hint: 'Hero section on the R22 aircraft page',
    type: 'single',
    images: [
      { id: 'r22h1', url: '/assets/images/new-aircraft/r22/r22-cutout.png', alt: 'R22 hero image' },
    ],
  },
  {
    id: 'r22-specifications',
    page: 'r22',
    name: 'R22 Specifications Blueprint',
    hint: 'Blueprint image in the specifications section',
    type: 'single',
    images: [
      { id: 'r22s1', url: '/assets/images/new-aircraft/r22/r22blueprint.jpg', alt: 'R22 blueprint' },
    ],
  },
  {
    id: 'r22-champion',
    page: 'r22',
    name: 'R22 Captain Q',
    hint: 'Portrait in the Captain Q champion section',
    type: 'single',
    images: [
      { id: 'r22c1', url: '/assets/images/used-aircraft/r22/british-team-r22.webp', alt: 'Captain Quentin Smith with R22' },
    ],
  },
  {
    id: 'r22-fleet',
    page: 'r22',
    name: 'R22 Fleet Lineup',
    hint: 'Full-bleed fleet photo in the fleet section',
    type: 'single',
    images: [
      { id: 'r22f1', url: '/assets/images/used-aircraft/r22/hq-r22-lineup.jpg', alt: 'HQ Aviation R22 fleet lineup' },
    ],
  },

  // ─── R44 PAGE (/aircraft/r44) ─────────────────────────────────────────────
  {
    id: 'r44-hero',
    page: 'r44',
    name: 'R44 Hero Image',
    hint: 'Full-screen hero background at the top of the R44 page',
    type: 'single',
    images: [
      { id: 'r44h1', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', alt: 'Robinson R44 Raven II' },
    ],
  },
  {
    id: 'r44-expeditions-map',
    page: 'r44',
    name: 'R44 Expeditions Map Images',
    hint: 'Three photos in the Expedition Routes section — globe image, North Pole, South Pole',
    type: 'cards',
    slideLabels: ['Globe Image', 'North Pole', 'South Pole'],
    images: [
      { id: 'r44e1', url: '/assets/images/expeditions/antartica.jpg',                alt: 'Antarctic Expedition' },
      { id: 'r44e2', url: '/assets/images/expeditions/north-pole.jpg',               alt: 'North Pole' },
      { id: 'r44e3', url: '/assets/images/used-aircraft/r44/r44-south-pole.jpg',     alt: 'South Pole' },
    ],
  },
  {
    id: 'r44-gallery',
    page: 'r44',
    name: 'R44 Photo Gallery',
    hint: 'Photo gallery grid on the R44 aircraft page',
    type: 'gallery',
    images: [
      { id: 'r44g1', url: '/assets/images/new-aircraft/r44/r44-cutout.png',          alt: 'R44 Cutout View' },
      { id: 'r44g2', url: '/assets/images/new-aircraft/r44/raven-ii-front-alpha.png', alt: 'R44 Raven II' },
      { id: 'r44g3', url: '/assets/images/new-aircraft/r44/r44blueprint.jpg',         alt: 'R44 Blueprint' },
      { id: 'r44g4', url: '/assets/images/used-aircraft/r44/r44-south-pole.jpg',      alt: 'R44 at South Pole' },
      { id: 'r44g5', url: '/assets/images/expeditions/antartica.jpg',                 alt: 'Antarctica' },
      { id: 'r44g6', url: '/assets/images/expeditions/north-pole.jpg',                alt: 'North Pole' },
    ],
  },

  // ─── R66 PAGE (/aircraft/r66) ─────────────────────────────────────────────
  {
    id: 'r66-hero',
    page: 'r66',
    name: 'R66 Hero Image',
    hint: 'Full-screen hero background at the top of the R66 page',
    type: 'single',
    images: [
      { id: 'r66h1', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg', alt: 'Robinson R66 Turbine Helicopter' },
    ],
  },
  {
    id: 'r66-gallery',
    page: 'r66',
    name: 'R66 Photo Gallery',
    hint: 'Photo gallery grid on the R66 aircraft page',
    type: 'gallery',
    images: [
      { id: 'r66g1', url: '/assets/images/new-aircraft/r66/blue-r66-palo-verde-left-v4.png',                                    alt: 'R66 in Blue Livery' },
      { id: 'r66g2', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-center-spotlight-vertical-format-14184-2.jpg',   alt: 'R66 Spotlight View' },
      { id: 'r66g3', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-riviera-all-glass-cockpit-13338.jpg',                    alt: 'R66 Glass Cockpit' },
      { id: 'r66g4', url: '/assets/images/new-aircraft/r66/r66bluprint.jpg',                                                     alt: 'R66 Blueprint' },
      { id: 'r66g5', url: '/assets/images/expeditions/six-helis-in-North-Pole.jpg',                                              alt: 'R66 Fleet at North Pole' },
      { id: 'r66g6', url: '/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp',                                alt: 'R66 Expedition' },
    ],
  },

  // ─── R88 PAGE (/aircraft/r88) ─────────────────────────────────────────────
  {
    id: 'r88-gallery',
    page: 'r88',
    name: 'R88 Photo Gallery',
    hint: 'Photo gallery grid on the R88 aircraft page',
    type: 'gallery',
    images: [
      { id: 'r88g1', url: '/assets/images/new-aircraft/r88/rhc-r88-3-spotlights-left-side-atmospheric-effect-21794_2.jpg',  alt: 'R88 dramatic side view with spotlights' },
      { id: 'r88g2', url: '/assets/images/new-aircraft/r88/rhc-r88-glass-flight-displays-right-side-cyclic-13216.jpg',      alt: 'R88 Garmin glass cockpit displays' },
      { id: 'r88g3', url: '/assets/images/new-aircraft/r88/rhc-r88-seat-logo-emboss-angle-shot-13559.jpg',                  alt: 'R88 embossed seat logo detail' },
      { id: 'r88g4', url: '/assets/images/new-aircraft/r88/rhc-r88-2-plus-eight-seats.jpg',                                 alt: 'R88 full cabin with 2+8 seating' },
      { id: 'r88g5', url: '/assets/images/new-aircraft/r88/rhc-r88-left-side-three-quarter-front-view-21797.jpg',           alt: 'R88 three-quarter front view' },
      { id: 'r88g6', url: '/assets/images/new-aircraft/r88/rhc-r88-rear-cargo-door-open-acute-view-13595.jpg',              alt: 'R88 rear cargo door open' },
      { id: 'r88g7', url: '/assets/images/new-aircraft/r88/rhc-r88-left-and-right-pilot-seats-13528.jpg',                   alt: 'R88 pilot seats' },
      { id: 'r88g8', url: '/assets/images/new-aircraft/r88/rhc-r88-atmospheric-effect-front-view-218022.jpg',               alt: 'R88 dramatic front view' },
    ],
  },

  // ─── LEASEBACK PAGE ────────────────────────────────────────────────────────
  {
    id: 'lb-hero',
    page: 'leaseback',
    name: 'Leaseback Hero — Background Image',
    hint: 'Wide editorial aircraft shot behind the hero headline on /leaseback',
    type: 'single',
    images: [
      { id: 'lbh1', url: '/assets/images/new-aircraft/r66/rhc-r66-nxg-pv-left-side-wide-shot-from-rear-13751.jpg', alt: 'Robinson R66 wide rear view' },
    ],
  },
  {
    id: 'lb-aircraft',
    page: 'leaseback',
    name: 'Leaseback — Eligible Aircraft Cards',
    hint: 'Three cards in the Eligible Aircraft strip — R44, R66, Hughes 500',
    type: 'cards',
    slideLabels: ['Robinson R44', 'Robinson R66', 'Hughes 500'],
    images: [
      { id: 'lba1', url: '/assets/images/used-aircraft/r44/r44-raven-ii-grrob.jpg', alt: 'Robinson R44 Raven II' },
      { id: 'lba2', url: '/assets/images/new-aircraft/r66/r66-turbine.png', alt: 'Robinson R66 Turbine' },
      { id: 'lba3', url: '/assets/images/used-aircraft/other/hughes-369e-gumby.jpg', alt: 'Hughes 500 in flight' },
    ],
  },

];

// Convenient lookups
export const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

export const SECTIONS_BY_PAGE = SECTIONS.reduce((acc, s) => {
  (acc[s.page] = acc[s.page] || []).push(s);
  return acc;
}, {});

export const PAGE_LABELS = {
  home:              'Home Page',
  training:          'Training Page',
  maintenance:       'Maintenance Page',
  expeditions:       'Expeditions Page',
  about:             'About Us Page',
  discovery:         'Discovery Flight Page',
  sfh:               'Self-Fly Hire Page',
  sales:             'Aircraft Sales Page',
  ppl:               'PPL Training Page',
  'type-rating':     'Type Rating Page',
  rebuilds:          'Rebuilds Page',
  'helicopter-tour': 'Helicopter Tour Page',
  fleet:             'Fleet Page',
  'aircraft-sales':  'Aircraft Sales Overview',
  r22:               'R22 Aircraft Page',
  r44:               'R44 Aircraft Page',
  r66:               'R66 Aircraft Page',
  r88:               'R88 Aircraft Page',
  h500:              'H500 Aircraft Page',
  leaseback:         'Leaseback Page',
};
