/**
 * textSections.js — single source of truth for every managed text element on the site.
 *
 * Field types:
 *   'heading'   — single line, rendered large in admin (h1–h3 text)
 *   'text'      — single line (labels, button text, short spans)
 *   'paragraph' — multi-line textarea (body copy, descriptions)
 *
 * All sections stored in Firestore collection: site_text
 * Document ID = section id.
 * Document shape: { page, fields: { [fieldId]: value } }
 */

export const TEXT_SECTIONS = [

  // ─── HOME PAGE ──────────────────────────────────────────────────────────────

  {
    id: 'home-editorial-headline',
    page: 'home',
    name: 'Scrolling Headline Strip',
    hint: 'The large words that scroll across the screen below the hero',
    fields: [
      { id: 'word_1',  label: 'Word 1',  type: 'heading', default: 'Your' },
      { id: 'word_2',  label: 'Word 2',  type: 'heading', default: 'Sky.' },
      { id: 'word_3',  label: 'Word 3',  type: 'heading', default: 'Your' },
      { id: 'word_4',  label: 'Word 4',  type: 'heading', default: 'Schedule.' },
      { id: 'word_5',  label: 'Word 5',  type: 'heading', default: 'Your' },
      { id: 'word_6',  label: 'Word 6',  type: 'heading', default: 'Freedom.' },
      { id: 'word_7',  label: 'Word 7',  type: 'heading', default: 'No' },
      { id: 'word_8',  label: 'Word 8',  type: 'heading', default: 'Limits.' },
      { id: 'word_9',  label: 'Word 9',  type: 'heading', default: 'No' },
      { id: 'word_10', label: 'Word 10', type: 'heading', default: 'Queues.' },
      { id: 'word_11', label: 'Word 11', type: 'heading', default: 'Just' },
      { id: 'word_12', label: 'Word 12', type: 'heading', default: 'Fly.' },
    ],
  },

  {
    id: 'home-sfh-section',
    page: 'home',
    name: 'Self-Fly Hire — Section Header',
    hint: 'Heading and intro for the Self-Fly Hire section on the homepage',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',   type: 'text',      default: 'Freedom to Fly Yourself Anywhere' },
      { id: 'heading',     label: 'Heading',      type: 'heading',   default: 'Self-Fly Hire:' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'You\'ve earned your licence. Now use it. Hire from our fleet of R22s, R44s and R66s — fuelled, washed and waiting on the pad for you, ready to go. Fly yourself to lunch in France, a weekend in the Cotswolds, a business meeting across the country, or just flying around for the beauty and fun of it. Available by the hour, day or week. No crew, no waiting, no compromise.' },
    ],
  },

  {
    id: 'home-sfh-fleet-r66',
    page: 'home',
    name: 'Self-Fly Hire — R66 Card',
    hint: 'Aircraft card for the R66 Turbine in the homepage Self-Fly Hire section',
    fields: [
      { id: 'name',  label: 'Model Name', type: 'text', default: 'R66 Turbine' },
      { id: 'seats', label: 'Seats',      type: 'text', default: '5 Seats' },
      { id: 'rate',  label: 'Rate',       type: 'text', default: '£595/hr' },
    ],
  },

  {
    id: 'home-sfh-fleet-r44',
    page: 'home',
    name: 'Self-Fly Hire — R44 Card',
    hint: 'Aircraft card for the R44 in the homepage Self-Fly Hire section',
    fields: [
      { id: 'name',  label: 'Model Name', type: 'text', default: 'R44' },
      { id: 'seats', label: 'Seats',      type: 'text', default: '4 Seats' },
      { id: 'rate',  label: 'Rate',       type: 'text', default: '£395/hr' },
    ],
  },

  {
    id: 'home-sfh-fleet-r22',
    page: 'home',
    name: 'Self-Fly Hire — R22 Card',
    hint: 'Aircraft card for the R22 in the homepage Self-Fly Hire section',
    fields: [
      { id: 'name',  label: 'Model Name', type: 'text', default: 'R22' },
      { id: 'seats', label: 'Seats',      type: 'text', default: '2 Seats' },
      { id: 'rate',  label: 'Rate',       type: 'text', default: '£275/hr' },
    ],
  },

  {
    id: 'home-sfh-destinations',
    page: 'home',
    name: 'Self-Fly Hire — Destination Cards',
    hint: 'The 4 featured destination cards below the SFH section on the homepage',
    fields: [
      { id: 'dest_1_name', label: 'Destination 1 — Name',     type: 'text',      default: 'The Cotswolds' },
      { id: 'dest_1_nm',   label: 'Destination 1 — Distance', type: 'text',      default: '70' },
      { id: 'dest_1_car',  label: 'Destination 1 — Car Time', type: 'text',      default: '1h 45min' },
      { id: 'dest_1_desc', label: 'Destination 1 — Description', type: 'paragraph', default: 'Fly over the rolling hills and honey-stone villages. Lunch at a country pub, back to Denham before dark.' },
      { id: 'dest_2_name', label: 'Destination 2 — Name',     type: 'text',      default: 'Le Touquet' },
      { id: 'dest_2_nm',   label: 'Destination 2 — Distance', type: 'text',      default: '110' },
      { id: 'dest_2_car',  label: 'Destination 2 — Car Time', type: 'text',      default: '3h 30min' },
      { id: 'dest_2_desc', label: 'Destination 2 — Description', type: 'paragraph', default: 'Cross the Channel in under an hour. Fresh seafood on the French coast, no passport queues, no ferry timetables.' },
      { id: 'dest_3_name', label: 'Destination 3 — Name',     type: 'text',      default: 'Scottish Highlands' },
      { id: 'dest_3_nm',   label: 'Destination 3 — Distance', type: 'text',      default: '330' },
      { id: 'dest_3_car',  label: 'Destination 3 — Car Time', type: 'text',      default: '8h+' },
      { id: 'dest_3_desc', label: 'Destination 3 — Description', type: 'paragraph', default: 'Glens, lochs and castles from the air. Two and a half hours to a landscape most people drive a full day to reach.' },
      { id: 'dest_4_name', label: 'Destination 4 — Name',     type: 'text',      default: 'Cornwall' },
      { id: 'dest_4_nm',   label: 'Destination 4 — Distance', type: 'text',      default: '180' },
      { id: 'dest_4_car',  label: 'Destination 4 — Car Time', type: 'text',      default: '4h 30min' },
      { id: 'dest_4_desc', label: 'Destination 4 — Description', type: 'paragraph', default: 'Skip the M5 entirely. Land near the coast for a weekend of surfing, cream teas and dramatic clifftop walks.' },
    ],
  },

  {
    id: 'home-sales-section',
    page: 'home',
    name: 'Aircraft Sales — Section Header',
    hint: 'Heading and Robinson certification text in the Sales section',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',          type: 'text',      default: 'Your Search Starts Here' },
      { id: 'heading_1',  label: 'Heading Part 1',     type: 'heading',   default: 'Find' },
      { id: 'heading_2',  label: 'Heading Part 2',     type: 'heading',   default: 'Your Next' },
      { id: 'heading_3',  label: 'Heading Part 3',     type: 'heading',   default: 'Aircraft' },
      { id: 'cert_label',  label: 'Cert Badge Label',   type: 'text',      default: 'Official' },
      { id: 'cert_title',  label: 'Cert Title',         type: 'text',      default: 'Robinson Authorized Dealer' },
      { id: 'cert_desc',   label: 'Cert Description',   type: 'paragraph', default: 'The UK\'s premier Robinson dealership since 2011. Factory-direct pricing, full warranty support, and expert guidance from purchase to delivery.' },
    ],
  },

  {
    id: 'home-sales-model-r88',
    page: 'home',
    name: 'Sales — R88 Card (Homepage)',
    hint: 'R88 model card in the homepage Sales section',
    fields: [
      { id: 'name',    label: 'Model Name', type: 'heading', default: 'R88' },
      { id: 'tagline', label: 'Tagline',    type: 'text',    default: 'The Future of Rotorcraft' },
      { id: 'price',   label: 'Price',      type: 'text',    default: '$3,300,000' },
      { id: 'seats',   label: 'Seats',      type: 'text',    default: '8' },
      { id: 'speed',   label: 'Speed',      type: 'text',    default: '140' },
    ],
  },

  {
    id: 'home-sales-model-r66',
    page: 'home',
    name: 'Sales — R66 Card (Homepage)',
    hint: 'R66 model card in the homepage Sales section',
    fields: [
      { id: 'name',    label: 'Model Name', type: 'heading', default: 'R66' },
      { id: 'tagline', label: 'Tagline',    type: 'text',    default: 'Turbine Performance' },
      { id: 'price',   label: 'Price',      type: 'text',    default: '$1,290,000' },
      { id: 'seats',   label: 'Seats',      type: 'text',    default: '5' },
      { id: 'speed',   label: 'Speed',      type: 'text',    default: '120' },
    ],
  },

  {
    id: 'home-sales-model-r44',
    page: 'home',
    name: 'Sales — R44 Card (Homepage)',
    hint: 'R44 model card in the homepage Sales section',
    fields: [
      { id: 'name',    label: 'Model Name', type: 'heading', default: 'R44' },
      { id: 'tagline', label: 'Tagline',    type: 'text',    default: 'World\'s Best-Selling' },
      { id: 'price',   label: 'Price',      type: 'text',    default: '$535,000' },
      { id: 'seats',   label: 'Seats',      type: 'text',    default: '4' },
      { id: 'speed',   label: 'Speed',      type: 'text',    default: '113' },
    ],
  },

  {
    id: 'home-sales-model-r22',
    page: 'home',
    name: 'Sales — R22 Card (Homepage)',
    hint: 'R22 model card in the homepage Sales section',
    fields: [
      { id: 'name',    label: 'Model Name', type: 'heading', default: 'R22' },
      { id: 'tagline', label: 'Tagline',    type: 'text',    default: 'Training Excellence' },
      { id: 'price',   label: 'Price',      type: 'text',    default: '$345,000' },
      { id: 'seats',   label: 'Seats',      type: 'text',    default: '2' },
      { id: 'speed',   label: 'Speed',      type: 'text',    default: '96' },
    ],
  },

  {
    id: 'home-exped-section',
    page: 'home',
    name: 'Expeditions — Section Header',
    hint: 'Heading and description text in the Expeditions section',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',   type: 'text',      default: 'Explore the World' },
      { id: 'heading',     label: 'Heading',      type: 'heading',   default: 'Expeditions' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'This isn\'t transport. This is using the helicopter as a gateway to the world—a first-class ticket to the beauty of our planet, seeing places in ways that very few have ever experienced before.' },
    ],
  },

  {
    id: 'home-exped-destinations',
    page: 'home',
    name: 'Expeditions — Destination Cards',
    hint: 'Name and description for each destination in the barcode widget',
    fields: [
      { id: 'arctic_name',      label: 'Arctic — Name',          type: 'text',      default: 'Arctic' },
      { id: 'arctic_desc',      label: 'Arctic — Description',   type: 'paragraph', default: 'Journey to the top of the world, where ice meets sky in an endless expanse of white.' },
      { id: 'arctic_distance',  label: 'Arctic — Distance',      type: 'text',      default: '2,500 nm' },
      { id: 'arctic_year',      label: 'Arctic — Year',          type: 'text',      default: '2022' },
      { id: 'iceland_name',     label: 'Iceland — Name',         type: 'text',      default: 'Iceland' },
      { id: 'iceland_desc',     label: 'Iceland — Description',  type: 'paragraph', default: 'Land of fire and ice — volcanic landscapes, glaciers, and the Northern Lights.' },
      { id: 'iceland_distance', label: 'Iceland — Distance',     type: 'text',      default: '1,200 nm' },
      { id: 'iceland_year',     label: 'Iceland — Year',         type: 'text',      default: '2019' },
      { id: 'morocco_name',     label: 'Morocco — Name',         type: 'text',      default: 'Morocco' },
      { id: 'morocco_desc',     label: 'Morocco — Description',  type: 'paragraph', default: 'From the Atlas Mountains to the Sahara Desert, a journey through ancient landscapes.' },
      { id: 'morocco_distance', label: 'Morocco — Distance',     type: 'text',      default: '1,100 nm' },
      { id: 'morocco_year',     label: 'Morocco — Year',         type: 'text',      default: '2021' },
      { id: 'norway_name',      label: 'Norway — Name',          type: 'text',      default: 'Norway' },
      { id: 'norway_desc',      label: 'Norway — Description',   type: 'paragraph', default: 'Navigate the dramatic fjords and witness the midnight sun over Scandinavia.' },
      { id: 'norway_distance',  label: 'Norway — Distance',      type: 'text',      default: '650 nm' },
      { id: 'norway_year',      label: 'Norway — Year',          type: 'text',      default: '2018' },
      { id: 'alps_name',        label: 'Alps — Name',            type: 'text',      default: 'Alps' },
      { id: 'alps_desc',        label: 'Alps — Description',     type: 'paragraph', default: 'Soar above snow-capped peaks and pristine alpine valleys.' },
      { id: 'alps_distance',    label: 'Alps — Distance',        type: 'text',      default: '500 nm' },
      { id: 'alps_year',        label: 'Alps — Year',            type: 'text',      default: '2020' },
      { id: 'greenland_name',   label: 'Greenland — Name',       type: 'text',      default: 'Greenland' },
      { id: 'greenland_desc',   label: 'Greenland — Description', type: 'paragraph', default: 'Explore the world\'s largest island — icebergs, remote settlements, and untouched wilderness.' },
      { id: 'greenland_distance', label: 'Greenland — Distance', type: 'text',      default: '2,100 nm' },
      { id: 'greenland_year',   label: 'Greenland — Year',       type: 'text',      default: '2023' },
      { id: 'bahamas_name',     label: 'Bahamas — Name',         type: 'text',      default: 'Bahamas' },
      { id: 'bahamas_desc',     label: 'Bahamas — Description',  type: 'paragraph', default: 'Island hop across turquoise waters and pristine white sand beaches.' },
      { id: 'bahamas_distance', label: 'Bahamas — Distance',     type: 'text',      default: '4,200 nm' },
      { id: 'bahamas_year',     label: 'Bahamas — Year',         type: 'text',      default: '2025' },
      { id: 'costarica_name',   label: 'Costa Rica — Name',      type: 'text',      default: 'Costa Rica' },
      { id: 'costarica_desc',   label: 'Costa Rica — Description', type: 'paragraph', default: 'Rainforests, volcanoes, and coastlines — pure tropical adventure.' },
      { id: 'costarica_distance', label: 'Costa Rica — Distance', type: 'text',     default: '5,100 nm' },
      { id: 'costarica_year',   label: 'Costa Rica — Year',      type: 'text',      default: '2026' },
    ],
  },

  // ─── DISCOVERY FLIGHT PAGE ───────────────────────────────────────────────────

  {
    id: 'discovery-hero',
    page: 'discovery',
    name: 'Hero Section',
    hint: 'Full-screen hero at the top of the Discovery Flight page',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',       type: 'text',      default: 'DISCOVERY FLIGHTS' },
      { id: 'headline_1',  label: 'Headline Word 1', type: 'heading',   default: 'YOUR' },
      { id: 'headline_2',  label: 'Headline Word 2', type: 'heading',   default: 'FIRST' },
      { id: 'headline_3',  label: 'Headline Word 3', type: 'heading',   default: 'FLIGHT' },
      { id: 'subtitle',    label: 'Subtitle',        type: 'paragraph', default: 'Take the controls and experience the thrill of helicopter flight over the beautiful Chiltern Hills.' },
      { id: 'cta_primary', label: 'Primary CTA',     type: 'text',      default: 'Choose Your Flight' },
    ],
  },

  {
    id: 'discovery-value-prop',
    page: 'discovery',
    name: 'Value Proposition',
    hint: '"Why HQ Aviation" section below the hero',
    fields: [
      { id: 'pre_label',  label: 'Pre-label',    type: 'text',      default: 'Why HQ Aviation' },
      { id: 'heading_1',  label: 'Heading Part 1', type: 'heading', default: 'Not Just A Flight.' },
      { id: 'heading_2',  label: 'Heading Part 2', type: 'heading', default: 'An Experience.' },
      { id: 'paragraph_1', label: 'Paragraph 1', type: 'paragraph', default: 'Have you ever wondered what it truly feels like to defy gravity? A Discovery Flight at HQ Aviation is more than just a ride—it is your first step into a world few ever experience. Under the guidance of our expert instructors, you will take the controls and discover the unmatched freedom of piloting a helicopter yourself.' },
      { id: 'paragraph_2', label: 'Paragraph 2', type: 'paragraph', default: 'Experience the thrill of controlling a helicopter, even if you don\'t plan on pursuing a full license immediately. Your perspective will shift the moment you take flight.' },
      { id: 'paragraph_3', label: 'Paragraph 3', type: 'paragraph', default: 'If you appreciate mechanical mastery, the helicopter offers total freedom in three dimensions and is unlike anything else you can experience. We enjoyed it so much that our mission is to share this unique sensation with anyone inclined to try.' },
    ],
  },

  {
    id: 'discovery-aircraft-r22',
    page: 'discovery',
    name: 'Aircraft Card — R22',
    hint: 'Booking card for the Robinson R22',
    fields: [
      { id: 'name',        label: 'Aircraft Name', type: 'heading',   default: 'ROBINSON R22' },
      { id: 'tagline',     label: 'Tagline',       type: 'text',      default: 'The 2-Seat Trainer' },
      { id: 'description', label: 'Description',   type: 'paragraph', default: 'Nimble and responsive. The perfect introduction to helicopter flight.' },
      { id: 'seats',       label: 'Seats',         type: 'text',      default: '2 seats' },
      { id: 'label_30min', label: '30 Min Label',  type: 'text',      default: '30 MINS' },
      { id: 'desc_30min',  label: '30 Min Desc',   type: 'text',      default: 'Introduction flight' },
      { id: 'label_60min', label: '60 Min Label',  type: 'text',      default: '60 MINS' },
      { id: 'desc_60min',  label: '60 Min Desc',   type: 'text',      default: 'Extended experience' },
    ],
  },

  {
    id: 'discovery-aircraft-r44',
    page: 'discovery',
    name: 'Aircraft Card — R44',
    hint: 'Booking card for the Robinson R44',
    fields: [
      { id: 'name',        label: 'Aircraft Name', type: 'heading',   default: 'ROBINSON R44' },
      { id: 'tagline',     label: 'Tagline',       type: 'text',      default: 'The 4-Seat Icon' },
      { id: 'description', label: 'Description',   type: 'paragraph', default: 'Bring passengers along. The world\'s most popular helicopter.' },
      { id: 'seats',       label: 'Seats',         type: 'text',      default: '4 seats' },
      { id: 'label_30min', label: '30 Min Label',  type: 'text',      default: '30 MINS' },
      { id: 'desc_30min',  label: '30 Min Desc',   type: 'text',      default: 'Introduction flight' },
      { id: 'label_60min', label: '60 Min Label',  type: 'text',      default: '60 MINS' },
      { id: 'desc_60min',  label: '60 Min Desc',   type: 'text',      default: 'Extended experience' },
    ],
  },

  {
    id: 'discovery-aircraft-r66',
    page: 'discovery',
    name: 'Aircraft Card — R66',
    hint: 'Booking card for the Robinson R66',
    fields: [
      { id: 'name',        label: 'Aircraft Name', type: 'heading',   default: 'ROBINSON R66' },
      { id: 'tagline',     label: 'Tagline',       type: 'text',      default: 'Turbine Power' },
      { id: 'description', label: 'Description',   type: 'paragraph', default: 'Experience the smooth power of a turbine engine.' },
      { id: 'seats',       label: 'Seats',         type: 'text',      default: '5 seats' },
      { id: 'label_30min', label: '30 Min Label',  type: 'text',      default: '30 MINS' },
      { id: 'desc_30min',  label: '30 Min Desc',   type: 'text',      default: 'Introduction flight' },
      { id: 'label_60min', label: '60 Min Label',  type: 'text',      default: '60 MINS' },
      { id: 'desc_60min',  label: '60 Min Desc',   type: 'text',      default: 'Extended experience' },
    ],
  },

  {
    id: 'discovery-gift',
    page: 'discovery',
    name: 'Gift Vouchers Note',
    hint: 'Gift voucher callout below the aircraft cards',
    fields: [
      { id: 'bold_text',   label: 'Bold Text',    type: 'text',      default: 'Gift Vouchers Available' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'Purchase a voucher valid for 12 months. The perfect present for birthdays, anniversaries, or that special someone.' },
      { id: 'link_text',   label: 'Link Text',    type: 'text',      default: 'Get Gift Voucher' },
    ],
  },

  {
    id: 'discovery-instructor',
    page: 'discovery',
    name: 'Instructor Section',
    hint: '"Your Instructor" section featuring the lead instructor',
    fields: [
      { id: 'pre_label',    label: 'Pre-label',         type: 'text',      default: 'Your Instructor' },
      { id: 'heading',      label: 'Section Heading',   type: 'heading',   default: 'Meet Your Team' },
      { id: 'intro',        label: 'Introduction',      type: 'paragraph', default: 'Your discovery flight will be conducted by one of our highly experienced instructors. Our team includes world champions, military veterans, and career pilots with decades of experience.' },
      { id: 'name',         label: 'Lead Instructor Name',  type: 'text', default: 'Quentin Smith' },
      { id: 'title',        label: 'Lead Instructor Title', type: 'text', default: 'Founder & Managing Director' },
      { id: 'hours_label',  label: 'Stat 1 Label',     type: 'text',      default: 'Flight Hours' },
      { id: 'years_label',  label: 'Stat 2 Label',     type: 'text',      default: 'Years Flying' },
      { id: 'bio',          label: 'Bio',               type: 'paragraph', default: 'World Helicopter Champion and the first person to fly a helicopter to the South Pole and back. Under Q\'s guidance, you\'re learning from one of the best in the world.' },
    ],
  },

  {
    id: 'discovery-steps',
    page: 'discovery',
    name: 'What to Expect — Steps',
    hint: 'The 5 journey steps in the "What to Expect" section',
    fields: [
      { id: 'pre_label', label: 'Pre-label',     type: 'text',    default: 'Your Experience' },
      { id: 'heading',   label: 'Heading',        type: 'heading', default: 'What To Expect' },
      { id: 'intro',     label: 'Introduction',   type: 'paragraph', default: 'From the moment you arrive to the moment you leave, every detail is taken care of.' },
      { id: 'step_1_title', label: 'Step 1 — Title',    type: 'text',      default: 'Arrival & Welcome' },
      { id: 'step_1_desc',  label: 'Step 1 — Description', type: 'paragraph', default: 'Arrive at Denham Aerodrome where you\'ll be greeted by your instructor. Enjoy a coffee while we complete the paperwork.' },
      { id: 'step_1_time',  label: 'Step 1 — Duration',  type: 'text',      default: '15 min' },
      { id: 'step_2_title', label: 'Step 2 — Title',    type: 'text',      default: 'Pre-Flight Briefing' },
      { id: 'step_2_desc',  label: 'Step 2 — Description', type: 'paragraph', default: 'Your instructor explains the controls, instruments, and basic flight principles. You\'ll know exactly what to expect.' },
      { id: 'step_2_time',  label: 'Step 2 — Duration',  type: 'text',      default: '15 min' },
      { id: 'step_3_title', label: 'Step 3 — Title',    type: 'text',      default: 'Take Flight' },
      { id: 'step_3_desc',  label: 'Step 3 — Description', type: 'paragraph', default: 'Climb aboard the Robinson helicopter and take off over the stunning Chiltern Hills. You\'ll be at the controls from the start.' },
      { id: 'step_3_time',  label: 'Step 3 — Duration',  type: 'text',      default: '30–60 min' },
      { id: 'step_4_title', label: 'Step 4 — Title',    type: 'text',      default: 'Hands-On Flying' },
      { id: 'step_4_desc',  label: 'Step 4 — Description', type: 'paragraph', default: 'Experience the unique sensation of helicopter flight. Practice turns, climbs, and descents under expert guidance.' },
      { id: 'step_4_time',  label: 'Step 4 — Duration',  type: 'text',      default: 'Included' },
      { id: 'step_5_title', label: 'Step 5 — Title',    type: 'text',      default: 'Debrief & Certificate' },
      { id: 'step_5_desc',  label: 'Step 5 — Description', type: 'paragraph', default: 'After landing, discuss your flight with your instructor. Receive your certificate and talk next steps.' },
      { id: 'step_5_time',  label: 'Step 5 — Duration',  type: 'text',      default: '10 min' },
    ],
  },

  {
    id: 'discovery-faq',
    page: 'discovery',
    name: 'FAQ Section',
    hint: 'Frequently asked questions on the Discovery Flight page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',    default: 'Common Questions' },
      { id: 'heading',   label: 'Heading',   type: 'heading', default: 'FAQ' },
      { id: 'q1', label: 'Q1 — Question', type: 'text',      default: 'Do I need any prior experience?' },
      { id: 'a1', label: 'Q1 — Answer',   type: 'paragraph', default: 'No prior experience is required. Our instructors will guide you through everything from the pre-flight briefing to hands-on flying. Discovery flights are designed for complete beginners.' },
      { id: 'q2', label: 'Q2 — Question', type: 'text',      default: 'Can I bring passengers?' },
      { id: 'a2', label: 'Q2 — Answer',   type: 'paragraph', default: 'Yes! Depending on the helicopter type and weights, you may be able to bring 1–2 passengers. Let us know when booking so we can arrange the appropriate aircraft.' },
      { id: 'q3', label: 'Q3 — Question', type: 'text',      default: 'What happens if the weather is bad?' },
      { id: 'a3', label: 'Q3 — Answer',   type: 'paragraph', default: 'Safety is our priority. If weather conditions are unsuitable, we\'ll reschedule at no extra cost. We monitor conditions closely and give as much notice as possible.' },
      { id: 'q4', label: 'Q4 — Question', type: 'text',      default: 'Does this count towards my pilot\'s licence?' },
      { id: 'a4', label: 'Q4 — Answer',   type: 'paragraph', default: 'Yes! Hours flown during your discovery flight count towards PPL(H) training. We\'ll log everything properly if you decide to continue with us.' },
      { id: 'q5', label: 'Q5 — Question', type: 'text',      default: 'Is this suitable as a gift?' },
      { id: 'a5', label: 'Q5 — Answer',   type: 'paragraph', default: 'Absolutely! Discovery flights make unforgettable gifts. We offer vouchers valid for 12 months, giving flexibility to book at their convenience.' },
    ],
  },

  {
    id: 'discovery-final-cta',
    page: 'discovery',
    name: 'Final CTA Section',
    hint: '"Book Your Discovery Flight" section at the bottom of the page',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',    type: 'text',      default: 'Ready To Fly?' },
      { id: 'heading',     label: 'Heading',       type: 'heading',   default: 'Book Your Discovery Flight' },
      { id: 'description', label: 'Description',   type: 'paragraph', default: 'Take the first step towards the adventure of a lifetime. Whether for yourself or as a gift, a discovery flight is an experience you\'ll never forget.' },
      { id: 'label_30min', label: '30 Min Label',  type: 'text',      default: '30 Min' },
      { id: 'label_60min', label: '60 Min Label',  type: 'text',      default: '60 Min' },
      { id: 'cta_primary', label: 'Primary CTA',   type: 'text',      default: 'Choose Your Flight' },
      { id: 'cta_secondary', label: 'Secondary CTA', type: 'text',    default: 'Contact Us' },
      { id: 'badge_gift',  label: 'Trust Badge 1', type: 'text',      default: 'Gift Vouchers Available' },
      { id: 'badge_valid', label: 'Trust Badge 2', type: 'text',      default: '12-Month Validity' },
      { id: 'badge_ppl',   label: 'Trust Badge 3', type: 'text',      default: 'Counts Towards PPL' },
    ],
  },

  // ─── SELF-FLY HIRE PAGE ──────────────────────────────────────────────────────

  {
    id: 'sfh-hero',
    page: 'sfh',
    name: 'Hero Section',
    hint: 'Full-screen hero at the top of the Self-Fly Hire page',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',       type: 'text',      default: 'HELICOPTER HIRE' },
      { id: 'headline_1',  label: 'Headline Word 1', type: 'heading',   default: 'SELF-FLY' },
      { id: 'headline_2',  label: 'Headline Word 2', type: 'heading',   default: 'HIRE' },
      { id: 'subtitle',    label: 'Subtitle',        type: 'paragraph', default: 'Access Europe\'s largest Robinson fleet. Fly where you want, when you want—with the freedom only helicopter travel provides.' },
      { id: 'stat_1_value', label: 'Stat 1 — Value', type: 'text',     default: '30+' },
      { id: 'stat_1_label', label: 'Stat 1 — Label', type: 'text',     default: 'Aircraft' },
      { id: 'stat_2_value', label: 'Stat 2 — Value', type: 'text',     default: '3' },
      { id: 'stat_2_label', label: 'Stat 2 — Label', type: 'text',     default: 'Models' },
      { id: 'stat_3_value', label: 'Stat 3 — Value', type: 'text',     default: '7' },
      { id: 'stat_3_label', label: 'Stat 3 — Label', type: 'text',     default: 'Days/Week' },
    ],
  },

  {
    id: 'sfh-intro',
    page: 'sfh',
    name: 'Introduction Section',
    hint: '"Freedom to Fly" introduction section',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',   type: 'text',      default: 'Freedom to Fly' },
      { id: 'heading',     label: 'Heading',      type: 'heading',   default: 'Self-Fly Hire: Your Aircraft Awaits' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'With an impressive fleet of over 30 helicopters, HQ Aviation offers unparalleled choice and availability for licensed pilots. Whether you\'re planning a day trip to the coast, a golf weekend in Scotland, or a business meeting across the country, we have the perfect aircraft for your mission.' },
    ],
  },

  {
    id: 'sfh-aircraft-r22',
    page: 'sfh',
    name: 'Fleet Card — R22',
    hint: 'R22 aircraft tab in the fleet section',
    fields: [
      { id: 'name',        label: 'Model Name',   type: 'heading',   default: 'R22' },
      { id: 'seats',       label: 'Seats',        type: 'text',      default: '2' },
      { id: 'speed',       label: 'Speed (kts)',  type: 'text',      default: '96 kts' },
      { id: 'range',       label: 'Range',        type: 'text',      default: '185 nm' },
      { id: 'rate',        label: 'Hourly Rate',  type: 'text',      default: '£275' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'Perfect for solo adventures or training continuation. Light, nimble, and economical.' },
      { id: 'feature_1',  label: 'Feature 1',    type: 'text',      default: 'Garmin GPS' },
      { id: 'feature_2',  label: 'Feature 2',    type: 'text',      default: 'Intercom System' },
      { id: 'feature_3',  label: 'Feature 3',    type: 'text',      default: 'Leather Seats' },
    ],
  },

  {
    id: 'sfh-aircraft-r44',
    page: 'sfh',
    name: 'Fleet Card — R44',
    hint: 'R44 Raven II aircraft tab in the fleet section',
    fields: [
      { id: 'name',        label: 'Model Name',   type: 'heading',   default: 'R44 Raven II' },
      { id: 'seats',       label: 'Seats',        type: 'text',      default: '4' },
      { id: 'speed',       label: 'Speed (kts)',  type: 'text',      default: '113 kts' },
      { id: 'range',       label: 'Range',        type: 'text',      default: '300 nm' },
      { id: 'rate',        label: 'Hourly Rate',  type: 'text',      default: '£395' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'Our most popular hire aircraft. Ideal for day trips, golf outings, and family flights.' },
      { id: 'feature_1',  label: 'Feature 1',    type: 'text',      default: 'Air Conditioning' },
      { id: 'feature_2',  label: 'Feature 2',    type: 'text',      default: 'Garmin G500' },
      { id: 'feature_3',  label: 'Feature 3',    type: 'text',      default: 'Leather Interior' },
      { id: 'feature_4',  label: 'Feature 4',    type: 'text',      default: 'USB Charging' },
    ],
  },

  {
    id: 'sfh-aircraft-r66',
    page: 'sfh',
    name: 'Fleet Card — R66',
    hint: 'R66 Turbine aircraft tab in the fleet section',
    fields: [
      { id: 'name',        label: 'Model Name',   type: 'heading',   default: 'R66 Turbine' },
      { id: 'seats',       label: 'Seats',        type: 'text',      default: '5' },
      { id: 'speed',       label: 'Speed (kts)',  type: 'text',      default: '120 kts' },
      { id: 'range',       label: 'Range',        type: 'text',      default: '350 nm' },
      { id: 'rate',        label: 'Hourly Rate',  type: 'text',      default: '£595' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'Turbine reliability with exceptional performance. Perfect for longer journeys and higher altitudes.' },
      { id: 'feature_1',  label: 'Feature 1',    type: 'text',      default: 'Turbine Engine' },
      { id: 'feature_2',  label: 'Feature 2',    type: 'text',      default: 'Garmin G500H' },
      { id: 'feature_3',  label: 'Feature 3',    type: 'text',      default: 'Premium Interior' },
      { id: 'feature_4',  label: 'Feature 4',    type: 'text',      default: 'Enhanced Safety Features' },
    ],
  },

  {
    id: 'sfh-destinations',
    page: 'sfh',
    name: 'Destinations Section Header',
    hint: 'Heading and intro text for the destinations section',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',   type: 'text',      default: 'Where Will You Go?' },
      { id: 'heading',     label: 'Heading',      type: 'heading',   default: 'See Where You Can Fly To' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'From coastal escapes to countryside retreats, the helicopter opens doors to destinations unreachable by road.' },
    ],
  },

  {
    id: 'sfh-faq',
    page: 'sfh',
    name: 'FAQ Section',
    hint: 'Frequently asked questions on the Self-Fly Hire page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',    default: 'Common Questions' },
      { id: 'heading',   label: 'Heading',   type: 'heading', default: 'FAQ' },
      { id: 'q1', label: 'Q1 — Question', type: 'text',      default: 'What are the minimum requirements to hire?' },
      { id: 'a1', label: 'Q1 — Answer',   type: 'paragraph', default: 'You need a valid PPL(H) with a current medical certificate, the appropriate type rating for your chosen aircraft, and recent flight experience. If you haven\'t flown recently, we can arrange a currency check flight.' },
      { id: 'q2', label: 'Q2 — Question', type: 'text',      default: 'How far in advance should I book?' },
      { id: 'a2', label: 'Q2 — Answer',   type: 'paragraph', default: 'We recommend booking at least 48 hours in advance, especially for weekends and holidays. However, subject to availability, we can accommodate same-day bookings.' },
      { id: 'q3', label: 'Q3 — Question', type: 'text',      default: 'Is insurance included?' },
      { id: 'a3', label: 'Q3 — Answer',   type: 'paragraph', default: 'Yes, comprehensive hull and liability insurance is included in all hire rates. Your excess is £5,000 for the R22, £7,500 for the R44, and £10,000 for the R66.' },
      { id: 'q4', label: 'Q4 — Question', type: 'text',      default: 'Can I fly abroad?' },
      { id: 'a4', label: 'Q4 — Answer',   type: 'paragraph', default: 'Yes, with prior arrangement. We can assist with flight planning, customs requirements, and necessary permissions for international flights.' },
      { id: 'q5', label: 'Q5 — Question', type: 'text',      default: 'What happens if I need to cancel?' },
      { id: 'a5', label: 'Q5 — Answer',   type: 'paragraph', default: 'Cancellations made more than 24 hours before your booking receive a full refund. Cancellations within 24 hours are charged at 50% of the booking value.' },
      { id: 'q6', label: 'Q6 — Question', type: 'text',      default: 'Do you offer block booking discounts?' },
      { id: 'a6', label: 'Q6 — Answer',   type: 'paragraph', default: 'Yes, we offer discounted rates for block bookings of 10 hours or more. Contact us for a personalised quote based on your flying requirements.' },
    ],
  },

  {
    id: 'sfh-cta',
    page: 'sfh',
    name: 'Final CTA Section',
    hint: '"Book Your Aircraft" section at the bottom of the Self-Fly Hire page',
    fields: [
      { id: 'pre_label',     label: 'Pre-label',      type: 'text',      default: 'Ready to Fly?' },
      { id: 'heading',       label: 'Heading',         type: 'heading',   default: 'Book Your Aircraft' },
      { id: 'description',   label: 'Description',     type: 'paragraph', default: 'Contact our team to check availability and make your booking. We\'re here to help make your flight plans a reality.' },
      { id: 'phone_label',   label: 'Phone Label',     type: 'text',      default: 'Call Us' },
      { id: 'phone_value',   label: 'Phone Number',    type: 'text',      default: '+44 1895 833 373' },
      { id: 'email_label',   label: 'Email Label',     type: 'text',      default: 'Email' },
      { id: 'email_value',   label: 'Email Address',   type: 'text',      default: 'hire@hqaviation.com' },
      { id: 'cta_primary',   label: 'Primary CTA',     type: 'text',      default: 'Make a Booking' },
      { id: 'cta_secondary', label: 'Secondary CTA',   type: 'text',      default: 'Get Your Licence' },
    ],
  },

  // ─── AIRCRAFT SALES PAGE ─────────────────────────────────────────────────────

  {
    id: 'sales-model-r88',
    page: 'sales',
    name: 'Aircraft Model — R88',
    hint: 'Name, tagline, description and specs for the R88 model',
    fields: [
      { id: 'name',        label: 'Model Name',    type: 'heading',   default: 'R88' },
      { id: 'tagline',     label: 'Tagline',        type: 'text',      default: 'The Future of Rotorcraft' },
      { id: 'description', label: 'Description',    type: 'paragraph', default: 'Revolutionary 8-seat turbine helicopter with unmatched capability.' },
      { id: 'seats',       label: 'Seats',          type: 'text',      default: '8' },
      { id: 'speed',       label: 'Max Speed',      type: 'text',      default: '140' },
      { id: 'range',       label: 'Range',          type: 'text',      default: '400' },
      { id: 'engine',      label: 'Engine',         type: 'text',      default: 'Safran Arriel' },
      { id: 'price',       label: 'Price',          type: 'text',      default: 'POA' },
    ],
  },

  {
    id: 'sales-model-r66',
    page: 'sales',
    name: 'Aircraft Model — R66',
    hint: 'Name, tagline, description and specs for the R66 model',
    fields: [
      { id: 'name',        label: 'Model Name',    type: 'heading',   default: 'R66' },
      { id: 'tagline',     label: 'Tagline',        type: 'text',      default: 'Turbine Performance' },
      { id: 'description', label: 'Description',    type: 'paragraph', default: 'Five-seat turbine helicopter with Robinson reliability.' },
      { id: 'seats',       label: 'Seats',          type: 'text',      default: '5' },
      { id: 'speed',       label: 'Max Speed',      type: 'text',      default: '120' },
      { id: 'range',       label: 'Range',          type: 'text',      default: '350' },
      { id: 'engine',      label: 'Engine',         type: 'text',      default: 'RR300' },
      { id: 'price',       label: 'Price',          type: 'text',      default: '$1,290,000' },
    ],
  },

  {
    id: 'sales-model-r44',
    page: 'sales',
    name: 'Aircraft Model — R44',
    hint: 'Name, tagline, description and specs for the R44 model',
    fields: [
      { id: 'name',        label: 'Model Name',    type: 'heading',   default: 'R44' },
      { id: 'tagline',     label: 'Tagline',        type: 'text',      default: 'World\'s Best-Selling' },
      { id: 'description', label: 'Description',    type: 'paragraph', default: 'Four-seat piston helicopter. The industry benchmark.' },
      { id: 'seats',       label: 'Seats',          type: 'text',      default: '4' },
      { id: 'speed',       label: 'Max Speed',      type: 'text',      default: '113' },
      { id: 'range',       label: 'Range',          type: 'text',      default: '300' },
      { id: 'engine',      label: 'Engine',         type: 'text',      default: 'Lycoming IO-540' },
      { id: 'price',       label: 'Price',          type: 'text',      default: '$535,000' },
    ],
  },

  {
    id: 'sales-model-r22',
    page: 'sales',
    name: 'Aircraft Model — R22',
    hint: 'Name, tagline, description and specs for the R22 model',
    fields: [
      { id: 'name',        label: 'Model Name',    type: 'heading',   default: 'R22' },
      { id: 'tagline',     label: 'Tagline',        type: 'text',      default: 'Training Excellence' },
      { id: 'description', label: 'Description',    type: 'paragraph', default: 'Two-seat trainer. Where pilots are made.' },
      { id: 'seats',       label: 'Seats',          type: 'text',      default: '2' },
      { id: 'speed',       label: 'Max Speed',      type: 'text',      default: '96' },
      { id: 'range',       label: 'Range',          type: 'text',      default: '200' },
      { id: 'engine',      label: 'Engine',         type: 'text',      default: 'Lycoming O-360' },
      { id: 'price',       label: 'Price',          type: 'text',      default: '$345,000' },
    ],
  },

  {
    id: 'sales-process',
    page: 'sales',
    name: 'Buying Process Steps',
    hint: 'The 6 steps in the "How to Buy" section',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',    default: 'How It Works' },
      { id: 'heading',   label: 'Heading',   type: 'heading', default: 'The Buying Process' },
      { id: 'step_1_title', label: 'Step 1 — Title', type: 'text',      default: 'Consultation' },
      { id: 'step_1_desc',  label: 'Step 1 — Desc',  type: 'paragraph', default: 'Discuss your requirements with our specialists' },
      { id: 'step_2_title', label: 'Step 2 — Title', type: 'text',      default: 'Configuration' },
      { id: 'step_2_desc',  label: 'Step 2 — Desc',  type: 'paragraph', default: 'Choose your model, options, and livery' },
      { id: 'step_3_title', label: 'Step 3 — Title', type: 'text',      default: 'Factory Order' },
      { id: 'step_3_desc',  label: 'Step 3 — Desc',  type: 'paragraph', default: 'We place your order with Robinson' },
      { id: 'step_4_title', label: 'Step 4 — Title', type: 'text',      default: 'Production' },
      { id: 'step_4_desc',  label: 'Step 4 — Desc',  type: 'paragraph', default: 'Your aircraft is built in Torrance, California' },
      { id: 'step_5_title', label: 'Step 5 — Title', type: 'text',      default: 'Delivery' },
      { id: 'step_5_desc',  label: 'Step 5 — Desc',  type: 'paragraph', default: 'Factory-direct or assembled at HQ Aviation' },
      { id: 'step_6_title', label: 'Step 6 — Title', type: 'text',      default: 'Handover' },
      { id: 'step_6_desc',  label: 'Step 6 — Desc',  type: 'paragraph', default: 'Aircraft handover and ongoing support' },
    ],
  },

  {
    id: 'sales-cta',
    page: 'sales',
    name: 'Contact CTA Section',
    hint: '"Let\'s Talk About Your Next Aircraft" section at the bottom',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',    type: 'text',      default: 'Ready to Begin?' },
      { id: 'heading',     label: 'Heading',       type: 'heading',   default: 'Let\'s Talk About Your Next Aircraft' },
      { id: 'description', label: 'Description',   type: 'paragraph', default: 'Whether you\'re a first-time buyer or expanding your fleet, our team is ready to guide you to the perfect helicopter.' },
      { id: 'cta_phone',   label: 'Phone CTA',     type: 'text',      default: 'Call +44 1895 833 373' },
      { id: 'cta_email',   label: 'Email CTA',     type: 'text',      default: 'Send Enquiry' },
      { id: 'location',    label: 'Location Line', type: 'text',      default: 'HQ Aviation · Denham Aerodrome · UB9 5DF' },
    ],
  },

  // ─── TRAINING PAGE ───────────────────────────────────────────────────────────

  {
    id: 'training-hero',
    page: 'training',
    name: 'Hero Section',
    hint: 'Main headline and subtitle on the Training page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',      default: 'HELICOPTER TRAINING' },
      { id: 'heading',   label: 'Heading',   type: 'heading',   default: 'Flight Training' },
      { id: 'subtitle',  label: 'Subtitle',  type: 'paragraph', default: 'CAA Declared Training Organisation - Learn to fly with the best at Denham Aerodrome' },
    ],
  },

  {
    id: 'training-intro',
    page: 'training',
    name: 'Introduction',
    hint: 'Opening paragraph on the Training page',
    fields: [
      { id: 'heading',     label: 'Heading',     type: 'heading',   default: 'Your Journey Starts Here' },
      { id: 'description', label: 'Description', type: 'paragraph', default: 'Whether you\'re dreaming of becoming a pilot or looking to advance your existing qualifications, HQ Aviation offers comprehensive training programs to suit every goal. Our experienced instructors and modern fleet make learning to fly both safe and enjoyable.' },
    ],
  },

  // ─── MAINTENANCE PAGE ────────────────────────────────────────────────────────

  {
    id: 'maintenance-hero',
    page: 'maintenance',
    name: 'Hero Section',
    hint: 'Main headline on the Maintenance page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',      default: 'MAINTENANCE & SUPPORT' },
      { id: 'heading',   label: 'Heading',   type: 'heading',   default: 'Expert Care for Your Aircraft' },
      { id: 'subtitle',  label: 'Subtitle',  type: 'paragraph', default: 'Robinson Authorised Service Centre with over 30 years of engineering excellence at Denham Aerodrome.' },
    ],
  },

  {
    id: 'maintenance-intro',
    page: 'maintenance',
    name: 'Introduction',
    hint: 'Opening section text on the Maintenance page',
    fields: [
      { id: 'heading',     label: 'Heading',     type: 'heading',   default: 'Authorised Robinson Service Centre' },
      { id: 'description', label: 'Description', type: 'paragraph', default: 'As a Robinson Authorised Service Centre, HQ Aviation is approved to carry out all scheduled and unscheduled maintenance on the complete Robinson range. Our engineers are factory-trained and kept up to date with the latest Robinson service bulletins and airworthiness directives.' },
    ],
  },

  // ─── EXPEDITIONS PAGE ────────────────────────────────────────────────────────

  {
    id: 'expeditions-hero',
    page: 'expeditions',
    name: 'Hero Section',
    hint: 'Main headline and subtitle on the Expeditions page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',      default: 'GLOBAL EXPEDITIONS' },
      { id: 'heading',   label: 'Heading',   type: 'heading',   default: 'Beyond the Horizon' },
      { id: 'subtitle',  label: 'Subtitle',  type: 'paragraph', default: 'Join Captain Q on extraordinary helicopter expeditions to the world\'s most remote and spectacular destinations.' },
    ],
  },

  {
    id: 'expeditions-intro',
    page: 'expeditions',
    name: 'Introduction',
    hint: 'Opening paragraph on the Expeditions page',
    fields: [
      { id: 'heading',     label: 'Heading',     type: 'heading',   default: 'The World From Above' },
      { id: 'description', label: 'Description', type: 'paragraph', default: 'This isn\'t transport. This is using the helicopter as a gateway to the world — a first-class ticket to the beauty of our planet, seeing places in ways that very few have ever experienced before.' },
    ],
  },

  {
    id: 'expeditions-bespoke',
    page: 'expeditions',
    name: 'Bespoke Adventures',
    hint: '"Bespoke Adventures" section on the Expeditions page',
    fields: [
      { id: 'pre_label',   label: 'Pre-label',   type: 'text',      default: 'Made for You' },
      { id: 'heading',     label: 'Heading',      type: 'heading',   default: 'Bespoke Adventures' },
      { id: 'description', label: 'Description',  type: 'paragraph', default: 'Every expedition is different. Whether you want to retrace Captain Q\'s historic routes or chart an entirely new course, we\'ll design the trip of a lifetime around your ambitions.' },
      { id: 'cta',         label: 'CTA Button',   type: 'text',      default: 'Plan Your Expedition' },
    ],
  },

  {
    id: 'expeditions-captain',
    page: 'expeditions',
    name: 'Your Guide — Captain Q',
    hint: 'Captain Q "Your Guide" section on the Expeditions page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',      default: 'Your Guide' },
      { id: 'name',      label: 'Name',       type: 'heading',   default: 'Captain Quentin Smith' },
      { id: 'role',      label: 'Role',       type: 'text',      default: 'World Helicopter Champion & Expedition Leader' },
      { id: 'quote',     label: 'Quote',      type: 'paragraph', default: 'I\'ve flown to the South Pole, the North Pole, and dozens of remote corners of the world. Every flight has shown me that the helicopter is the greatest freedom machine ever built.' },
      { id: 'cta',       label: 'CTA',        type: 'text',      default: 'Learn More About Captain Q' },
    ],
  },

  // ─── ABOUT US PAGE ───────────────────────────────────────────────────────────

  {
    id: 'about-hero',
    page: 'about',
    name: 'Hero Section',
    hint: 'Main headline on the About Us page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',      default: 'About HQ Aviation' },
      { id: 'heading_1', label: 'Heading Part 1', type: 'heading', default: 'The Robinson' },
      { id: 'heading_2', label: 'Heading Part 2', type: 'heading', default: 'Specialists' },
      { id: 'heading_3', label: 'Heading Part 3', type: 'heading', default: 'Since 1990' },
    ],
  },

  {
    id: 'about-founder',
    page: 'about',
    name: 'Captain Q — Founder',
    hint: 'Captain Q founder section on the About Us page',
    fields: [
      { id: 'pre_label', label: 'Pre-label', type: 'text',      default: 'The Founder' },
      { id: 'name',      label: 'Name',       type: 'heading',   default: 'Captain Quentin Smith' },
      { id: 'title',     label: 'Title',      type: 'text',      default: 'Founder & Managing Director' },
      { id: 'bio',       label: 'Biography',  type: 'paragraph', default: 'Two-time Helicopter Aerobatics World Champion. Guinness World Record holder. The first person to fly a helicopter to both the North and South Poles. The man Paramount Pictures chose to train Tom Cruise for Mission: Impossible. Over 12,000 hours as pilot-in-command across every continent on earth.' },
    ],
  },

];

// ─── Convenient lookups ───────────────────────────────────────────────────────

export const TEXT_SECTION_MAP = Object.fromEntries(TEXT_SECTIONS.map((s) => [s.id, s]));

export const TEXT_SECTIONS_BY_PAGE = TEXT_SECTIONS.reduce((acc, s) => {
  (acc[s.page] = acc[s.page] || []).push(s);
  return acc;
}, {});

export const TEXT_PAGE_LABELS = {
  home:        'Home Page',
  discovery:   'Discovery Flight',
  sfh:         'Self-Fly Hire',
  sales:       'Aircraft Sales',
  training:    'Training',
  maintenance: 'Maintenance',
  expeditions: 'Expeditions',
  about:       'About Us',
};
