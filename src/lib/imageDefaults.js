/**
 * imageDefaults.js
 * Single source of truth for all default website images.
 * These are the hardcoded values the site falls back to when no Firestore
 * data has been saved yet. The admin reads these to pre-populate the UI.
 */

// ─── Single Image Slots ───────────────────────────────────────────────────────
export const SLOT_DEFAULTS = {
  'home-hero-background': {
    url: '/assets/images/gallery/flying/flying-.jpg',
    alt: 'HQ Aviation helicopter flying',
    description: 'Flying section parallax background on home page',
    page: 'home',
  },
  'home-maintenance-background': {
    url: '/assets/images/facility/maintenance-.jpg',
    alt: 'HQ Aviation maintenance facility',
    description: 'Maintenance section parallax background on home page',
    page: 'home',
  },
  'home-sales-background': {
    url: '/assets/images/facility/main-sales-pic.jpg',
    alt: 'HQ Aviation aircraft sales',
    description: 'Sales section parallax background on home page',
    page: 'home',
  },
  'maintenance-hero': {
    url: '/assets/images/facility/hq-aviation-helicopter-hangar.webp',
    alt: 'HQ Aviation maintenance hangar',
    description: 'Main facility image on maintenance page',
    page: 'maintenance',
  },
  'maintenance-cert-logo': {
    url: '/assets/images/logos/certifications/robinson-authorized.jpg',
    alt: 'Robinson Authorized Service Centre',
    description: 'Robinson certification logo on maintenance page',
    page: 'maintenance',
  },
  'training-discovery-flight': {
    url: '/assets/images/training/helicopter-training.webp',
    alt: 'Helicopter Flight Training at HQ Aviation',
    description: 'Training intro section image',
    page: 'training',
  },
  'expeditions-hero': {
    url: '/assets/images/expeditions/bespoke-adventure.webp',
    alt: 'Bespoke Helicopter Adventure',
    description: 'Bespoke adventures section image on expeditions page',
    page: 'expeditions',
  },
  'about-founder': {
    url: '/assets/images/team/world-helicopter-champion-quentin-smith.webp',
    alt: 'Captain Quentin Smith',
    description: 'Founder portrait on About Us page',
    page: 'about',
  },
};

// ─── Image Collections ────────────────────────────────────────────────────────
// type: 'gallery'   = variable length, free add/remove/reorder
// type: 'carousel'  = one image slot per slide; titles/descriptions are hardcoded
// type: 'cards'     = one image slot per card; card text is hardcoded

export const COLLECTION_DEFAULTS = {
  'home-gallery': {
    name: 'Home Hero Gallery',
    page: 'home',
    type: 'gallery',
    description: 'Rotating photo slideshow at the top of the home page',
    images: [
      { id: 'g1',  url: '/assets/images/facility/hq-0745.jpg',                          alt: 'HQ Aviation hangar' },
      { id: 'g2',  url: '/assets/images/gallery/events/img_2644.jpeg',                  alt: 'HQ Aviation event' },
      { id: 'g3',  url: '/assets/images/facility/hq-0354.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g4',  url: '/assets/images/facility/hq-0254.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g5',  url: '/assets/images/facility/hq-0035.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g6',  url: '/assets/images/facility/hq-0089.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g7',  url: '/assets/images/facility/hq-0696.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g8',  url: '/assets/images/facility/hq-0409.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g9',  url: '/assets/images/facility/hq-0167.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g10', url: '/assets/images/facility/hq-0698.jpg',                          alt: 'HQ Aviation facility' },
      { id: 'g11', url: '/assets/images/gallery/flying/flying--1.jpg',                  alt: 'Helicopter flying' },
      { id: 'g12', url: '/assets/images/gallery/carousel/rotating1.jpg',                alt: 'HQ Aviation helicopter' },
      { id: 'g13', url: '/assets/images/gallery/carousel/rotating6.jpg',                alt: 'HQ Aviation helicopter' },
      { id: 'g14', url: '/assets/images/training/home-2312.jpg',                        alt: 'HQ Aviation training' },
      { id: 'g15', url: '/assets/images/gallery/carousel/rotating-3.jpg',               alt: 'HQ Aviation helicopter' },
      { id: 'g16', url: '/assets/images/legacy/dated/2015-04-09-16.29.34.jpg',          alt: 'HQ Aviation vintage' },
      { id: 'g17', url: '/assets/images/used-aircraft/r66/gdspz.jpg',                   alt: 'Robinson R66' },
    ],
  },

  'home-training-carousel': {
    name: 'Training Carousel',
    page: 'home',
    type: 'carousel',
    description: 'One image per training slide. Slide titles and descriptions are managed in code.',
    slideLabels: ['Discovery Flight', 'Private Pilot Licence', 'Commercial Pilot Licence', 'Type Rating', 'Night Rating', 'Self-Fly Hire'],
    images: [
      { id: 't1', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Discovery flight' },
      { id: 't2', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Private pilot licence training' },
      { id: 't3', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Commercial pilot licence training' },
      { id: 't4', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Type rating training' },
      { id: 't5', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Night rating training' },
      { id: 't6', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Self-fly hire' },
    ],
  },

  'home-maintenance-carousel': {
    name: 'Maintenance Carousel',
    page: 'home',
    type: 'carousel',
    description: 'One image per maintenance slide.',
    slideLabels: ['Rebuilds', 'Maintenance', 'Part Sales', 'Hangarage', 'Avionics'],
    images: [
      { id: 'm1', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Helicopter rebuilds' },
      { id: 'm2', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Helicopter maintenance' },
      { id: 'm3', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Helicopter parts' },
      { id: 'm4', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Helicopter hangarage' },
      { id: 'm5', url: '/assets/images/gallery/carousel/rotating-4.jpg', alt: 'Helicopter avionics' },
    ],
  },

  'home-sales-carousel': {
    name: 'Sales Carousel',
    page: 'home',
    type: 'carousel',
    description: 'One image per sales slide.',
    slideLabels: ['New Helicopters', 'Used Helicopters', 'Rebuilt Helicopters'],
    images: [
      { id: 's1', url: '/assets/images/legacy/squarespace/image-asset.jpeg',   alt: 'New helicopters for sale' },
      { id: 's2', url: '/assets/images/legacy/squarespace/image-asset-1.jpeg', alt: 'Used helicopters for sale' },
      { id: 's3', url: '/assets/images/facility/sales-rebuild.jpg',             alt: 'Rebuilt helicopters for sale' },
    ],
  },

  'expeditions-cards': {
    name: 'Expedition Cards',
    page: 'expeditions',
    type: 'cards',
    description: 'One image per expedition destination card.',
    slideLabels: ['Scottish Highlands', 'Norwegian Fjords', 'Moroccan Atlas', 'Swiss Alps'],
    images: [
      { id: 'e1', url: '/assets/images/expeditions/scottish-highlands.webp', alt: 'Scottish Highlands helicopter expedition' },
      { id: 'e2', url: '/assets/images/expeditions/norwegian-fjords.webp',   alt: 'Norwegian Fjords helicopter expedition' },
      { id: 'e3', url: '/assets/images/expeditions/moroccan-atlas.webp',     alt: 'Moroccan Atlas helicopter expedition' },
      { id: 'e4', url: '/assets/images/expeditions/swiss-alps.webp',         alt: 'Swiss Alps helicopter expedition' },
    ],
  },

  'maintenance-aircraft': {
    name: 'Aircraft Models',
    page: 'maintenance',
    type: 'cards',
    description: 'One image per supported aircraft model.',
    slideLabels: ['Robinson R22', 'Robinson R44', 'Robinson R66', 'Guimbal Cabri G2'],
    images: [
      { id: 'a1', url: '/assets/images/new-aircraft/r22-beta.webp',    alt: 'Robinson R22 Beta' },
      { id: 'a2', url: '/assets/images/new-aircraft/r44-raven.webp',   alt: 'Robinson R44 Raven' },
      { id: 'a3', url: '/assets/images/new-aircraft/r66-turbine.webp', alt: 'Robinson R66 Turbine' },
      { id: 'a4', url: '/assets/images/new-aircraft/cabri-g2.webp',    alt: 'Guimbal Cabri G2' },
    ],
  },
};
