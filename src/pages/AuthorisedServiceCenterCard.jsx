import { useState, useCallback } from 'react';
import Picker from '../components/Picker';

// ============================================
// PICKER CONFIG
// ============================================

const certSections = {
  layout: [
    { id: 'cert-1', name: 'Horizontal Classic', category: 'Layout', desc: 'Logo left, info right, Guimbal footer strip' },
    { id: 'cert-2', name: 'Vertical Stack', category: 'Layout', desc: 'Logo top-center, info below, stats row, Guimbal strip' },
    { id: 'cert-3', name: 'Split 50/50', category: 'Layout', desc: 'Dark logo half, lighter info half, thin bottom bar' },
    { id: 'cert-4', name: 'Wide Banner', category: 'Layout', desc: 'Full-width single row, minimal height, header-style' },
    { id: 'cert-5', name: 'Card + Sidebar', category: 'Layout', desc: 'Main card with detached sidebar stats column' },
    { id: 'cert-51', name: 'Also Certified — Ribbon', category: 'Layout', desc: 'V2 layout with Guimbal as corner ribbon banner' },
    { id: 'cert-52', name: 'Also Certified — Badge Row', category: 'Layout', desc: 'V2 layout with side-by-side certification badges in footer' },
    { id: 'cert-53', name: 'Also Certified — Pill Tags', category: 'Layout', desc: 'V2 layout with Guimbal + Robinson as pill tags in footer' },
    { id: 'cert-54', name: 'Also Certified — Glow Strip', category: 'Layout', desc: 'V2 layout with animated gradient glow footer strip' },
    { id: 'cert-55', name: 'Also Certified — Split Footer', category: 'Layout', desc: 'V2 layout with two-tone split footer for each certification' },
  ],
  style: [
    { id: 'cert-6', name: 'Glass Morphism', category: 'Style', desc: 'Frosted glass, backdrop-blur, white border glow' },
    { id: 'cert-7', name: 'Gold Accent', category: 'Style', desc: 'Premium gold gradient border, gold glow and accents' },
    { id: 'cert-8', name: 'Light Mode', category: 'Style', desc: 'White/light gray card with dark text, blue accent' },
    { id: 'cert-9', name: 'Outlined / Wireframe', category: 'Style', desc: 'No fill, 1px white border, minimalist' },
    { id: 'cert-10', name: 'Gradient Sweep', category: 'Style', desc: 'Animated gradient background, subtle hover motion' },
  ],
  content: [
    { id: 'cert-11', name: 'Stats Hero', category: 'Content', desc: 'Stats dominate as hero elements, smaller info below' },
    { id: 'cert-12', name: 'Logo Hero', category: 'Content', desc: 'Oversized logo centered, small caption below' },
    { id: 'cert-13', name: 'Testimonial Embed', category: 'Content', desc: 'Card includes testimonial quote before stats' },
    { id: 'cert-14', name: 'Multi-Badge', category: 'Content', desc: 'Robinson service center + smaller Guimbal badge' },
    { id: 'cert-15', name: 'Expandable', category: 'Content', desc: 'Compact card that expands on click to reveal details' },
  ],
  experimental: [
    { id: 'cert-16', name: 'Asymmetric', category: 'Experimental', desc: 'Logo overlapping card edge, organic layout' },
    { id: 'cert-17', name: 'Full Bleed Photo', category: 'Experimental', desc: 'Facility photo background, white content overlay' },
    { id: 'cert-18', name: 'Mono Type', category: 'Experimental', desc: 'All typography, no logo image, pure type treatment' },
    { id: 'cert-19', name: 'Badge / Seal', category: 'Experimental', desc: 'Circular shield shape, certificate/seal aesthetic' },
    { id: 'cert-20', name: 'Dark Terminal', category: 'Experimental', desc: 'Monospace green-on-black hacker/ops aesthetic' },
  ],
  expandable: [
    { id: 'cert-21', name: 'Pill Compact', category: 'Expandable', desc: 'Rounded pill collapsed, logo + title inline, expands to rectangle' },
    { id: 'cert-22', name: 'Icon-Only Compact', category: 'Expandable', desc: 'Only Robinson logo visible collapsed, expands to full card' },
    { id: 'cert-23', name: 'Ticker Compact', category: 'Expandable', desc: 'Single-line ticker text, click expands to card' },
    { id: 'cert-24', name: 'Notification Compact', category: 'Expandable', desc: 'Toast notification style, expands to proper card' },
    { id: 'cert-25', name: 'Split-Reveal', category: 'Expandable', desc: 'Two halves reveal content between them on expand' },
    { id: 'cert-26', name: 'Slide Down', category: 'Expandable', desc: 'Content slides down smoothly from compact bar' },
    { id: 'cert-27', name: 'Fade & Scale', category: 'Expandable', desc: 'Expanded content fades in with scale transition' },
    { id: 'cert-28', name: 'Flip Reveal', category: 'Expandable', desc: 'Card flips 180° on Y-axis to show full content' },
    { id: 'cert-29', name: 'Accordion Stack', category: 'Expandable', desc: '3 stacked bars expand one by one on successive clicks' },
    { id: 'cert-30', name: 'Morph Expand', category: 'Expandable', desc: 'Compact bar morphs dimensions into expanded card' },
    { id: 'cert-31', name: 'Expand → Horizontal', category: 'Expandable', desc: 'Expands to horizontal split layout' },
    { id: 'cert-32', name: 'Expand → Grid', category: 'Expandable', desc: 'Expands to 2x2 grid layout' },
    { id: 'cert-33', name: 'Expand → Timeline', category: 'Expandable', desc: 'Expands to vertical timeline view' },
    { id: 'cert-34', name: 'Expand → Tabs', category: 'Expandable', desc: 'Expands with mini tab navigation inside' },
    { id: 'cert-35', name: 'Expand → Full Bleed', category: 'Expandable', desc: 'Expands to dramatic dark card with glow effects' },
    { id: 'cert-36', name: 'Expand → Services', category: 'Expandable', desc: 'Reveals mini services list on expand' },
    { id: 'cert-37', name: 'Expand → Quote', category: 'Expandable', desc: 'Reveals testimonial quote prominently' },
    { id: 'cert-38', name: 'Expand → Team', category: 'Expandable', desc: 'Reveals team snapshot on expand' },
    { id: 'cert-39', name: 'Expand → Facility', category: 'Expandable', desc: 'Reveals facility stats on expand' },
    { id: 'cert-40', name: 'Expand → Contact CTA', category: 'Expandable', desc: 'Reveals contact info + Get in Touch button' },
    { id: 'cert-41', name: 'Drawer', category: 'Expandable', desc: 'Side-drawer slides in from right on click' },
    { id: 'cert-42', name: 'Staggered Reveal', category: 'Expandable', desc: 'Stats and info animate in one by one with stagger' },
    { id: 'cert-43', name: 'Peek', category: 'Expandable', desc: 'Shows partial content peek, full reveal on click' },
    { id: 'cert-44', name: 'Progress Bar', category: 'Expandable', desc: 'Animated progress bar fills on expand' },
    { id: 'cert-45', name: 'Card Stack', category: 'Expandable', desc: 'Stacked cards fan out to reveal content' },
    { id: 'cert-46', name: 'Spotlight', category: 'Expandable', desc: 'Dark card with spotlight glow following expand' },
    { id: 'cert-47', name: 'Diagonal Split', category: 'Expandable', desc: 'Diagonal divider separates compact and expanded content' },
    { id: 'cert-48', name: 'Meter Dashboard', category: 'Expandable', desc: 'Dashboard-style meters animate on expand' },
    { id: 'cert-49', name: 'Map Pin', category: 'Expandable', desc: 'Location pin style card that unfolds details' },
    { id: 'cert-50', name: 'Badge Carousel', category: 'Expandable', desc: 'Certification badges cycle through on expand' },
    { id: 'cert-56', name: 'Expand → Pill Tags', category: 'Expandable', desc: 'Compact bar expands to reveal pill tag certifications' },
    { id: 'cert-57', name: 'Stacked Center', category: 'Expandable', desc: 'Robinson logo stacked above smaller Guimbal text, both centered' },
    { id: 'cert-58', name: 'Left-Aligned Dual', category: 'Expandable', desc: 'Both logos left-aligned, Robinson large, Guimbal small underneath' },
    { id: 'cert-59', name: 'Inline Bar', category: 'Expandable', desc: 'Single horizontal bar with Robinson logo, ampersand, Guimbal text inline' },
    { id: 'cert-60', name: 'Corner Guimbal', category: 'Expandable', desc: 'Robinson logo centered, Guimbal as small corner badge' },
    { id: 'cert-61', name: 'Two Columns', category: 'Expandable', desc: 'Split card top: Robinson left column, Guimbal right column' },
    { id: 'cert-62', name: 'Robinson Hero + Tag', category: 'Expandable', desc: 'Large Robinson hero, Guimbal as subtle pill tag below' },
    { id: 'cert-63', name: 'Overlapping', category: 'Expandable', desc: 'Robinson logo large with Guimbal text overlapping bottom-right' },
    { id: 'cert-64', name: 'Top Bar + Logo', category: 'Expandable', desc: 'Guimbal in slim top bar, Robinson logo prominent below' },
    { id: 'cert-65', name: 'Side Badge', category: 'Expandable', desc: 'Robinson logo centered, Guimbal as rotated side badge' },
    { id: 'cert-66', name: 'Bracket Layout', category: 'Expandable', desc: 'Robinson & Guimbal separated by decorative brackets' },
    { id: 'cert-67', name: 'Diagonal Badge', category: 'Expandable', desc: 'Robinson logo centered, Guimbal as diagonal rotated badge in corner' },
    { id: 'cert-68', name: 'Underline Accent', category: 'Expandable', desc: 'Robinson logo with gold underline, Guimbal text right of underline' },
    { id: 'cert-69', name: 'Circle Frames', category: 'Expandable', desc: 'Robinson logo in circular frame, Guimbal text in smaller circle' },
    { id: 'cert-70', name: 'Gradient Fade', category: 'Expandable', desc: 'Robinson logo full opacity left, Guimbal fading from right' },
    { id: 'cert-71', name: 'Tab Headers', category: 'Expandable', desc: 'Two tab-like headers: active Robinson tab, inactive Guimbal tab' },
    { id: 'cert-72', name: 'Stamp Mark', category: 'Expandable', desc: 'Robinson logo centered, Guimbal as faded circular stamp watermark' },
    { id: 'cert-73', name: 'Breadcrumb', category: 'Expandable', desc: 'Breadcrumb style: HQ Aviation / Robinson ASC / Guimbal G2' },
    { id: 'cert-74', name: 'Dots Connector', category: 'Expandable', desc: 'Robinson logo left, dotted line connecting to Guimbal right' },
    { id: 'cert-75', name: 'Shield', category: 'Expandable', desc: 'Robinson logo inside shield shape, Guimbal as banner below' },
    { id: 'cert-76', name: 'Minimal Mono', category: 'Expandable', desc: 'Pure typography: ROBINSON large monospace, & guimbal small' },
    { id: 'cert-77', name: 'Glass Card', category: 'Expandable', desc: 'Robinson logo on frosted glass panel, Guimbal etched text bottom' },
    { id: 'cert-78', name: 'Neon Outline', category: 'Expandable', desc: 'Robinson logo with blue glow outline, Guimbal with dimmer glow' },
    { id: 'cert-79', name: 'Split Diagonal', category: 'Expandable', desc: 'Card split by diagonal: Robinson upper-left, Guimbal lower-right' },
    { id: 'cert-80', name: 'Orbit', category: 'Expandable', desc: 'Robinson logo centered, Guimbal text on curved orbit path' },
    { id: 'cert-81', name: 'Layered Cards', category: 'Expandable', desc: 'Robinson on front card, Guimbal peeking from behind' },
    { id: 'cert-82', name: 'Ticker Tape', category: 'Expandable', desc: 'Robinson logo top, scrolling marquee Guimbal bar below' },
    { id: 'cert-83', name: 'Grid Dots', category: 'Expandable', desc: 'Robinson logo with dot grid background, Guimbal in highlighted cell' },
    { id: 'cert-84', name: 'Perspective Tilt', category: 'Expandable', desc: 'Robinson card tilted in perspective, Guimbal flat label below' },
    { id: 'cert-85', name: 'Paper Fold', category: 'Expandable', desc: 'Card appears folded, Robinson on main face, Guimbal on fold crease' },
    { id: 'cert-86', name: 'Waveform', category: 'Expandable', desc: 'Robinson logo above SVG waveform divider, Guimbal text below wave' },
    { id: 'cert-87', name: 'Perspective Float', category: 'Expandable', desc: 'Robinson logo floating with 3D perspective + shadow, Guimbal flat beneath like ground reflection' },
    { id: 'cert-88', name: 'Hero Offset', category: 'Expandable', desc: 'Robinson logo oversized offset left breaking boundary, small Guimbal tag anchored right' },
    { id: 'cert-89', name: 'Angular Slice', category: 'Expandable', desc: 'Sharp angled clip-path cuts across card, Robinson in larger upper section, Guimbal in narrow angled strip' },
    { id: 'cert-90', name: '3D Rotate', category: 'Expandable', desc: 'Robinson logo with subtle continuous CSS rotateY hover animation, Guimbal static below' },
    { id: 'cert-91', name: 'Cinematic Wide', category: 'Expandable', desc: 'Extra wide letterbox aspect ratio, Robinson logo large centered, Guimbal as subtle subtitle' },
    { id: 'cert-92', name: 'Parallax Layers', category: 'Expandable', desc: 'Robinson on foreground layer larger/brighter, Guimbal on background layer smaller/dimmed/offset' },
    { id: 'cert-93', name: 'Diamond Split', category: 'Expandable', desc: 'Diamond/rhombus clip-path on Robinson area, Guimbal text outside diamond in corner' },
    { id: 'cert-94', name: 'Isometric', category: 'Expandable', desc: 'Robinson logo on isometric plane via CSS 3D transforms, Guimbal as flat label' },
    { id: 'cert-95', name: 'Hero Gradient Mask', category: 'Expandable', desc: 'Large Robinson logo with bottom gradient fade-out, Guimbal text emerging from the fade' },
    { id: 'cert-96', name: 'Geometric Frame', category: 'Expandable', desc: 'Robinson logo inside geometric wireframe hexagon border, Guimbal outside as annotation' },
    { id: 'cert-97', name: 'Hero Split Dots', category: 'Expandable', desc: 'Hero logo with diagonal split, dot grid background, and Guimbal tag' },
    { id: 'cert-98', name: 'Dealer Split Dots', category: 'Expandable', desc: 'Authorized Dealer version — diagonal split with dot grid' },
    { id: 'cert-99', name: 'Soft Shadow', category: 'Expandable', desc: 'Dark card with large soft box-shadow to ease into white' },
    { id: 'cert-100', name: 'Light Card', category: 'Expandable', desc: 'Light gray card (#f5f5f5) with dark text — native on white' },
    { id: 'cert-101', name: 'Glass Frost', category: 'Expandable', desc: 'Semi-transparent frosted glass with backdrop blur' },
    { id: 'cert-102', name: 'Gradient Fade', category: 'Expandable', desc: 'Card edges fade to transparent via gradient mask' },
    { id: 'cert-103', name: 'Outline Only', category: 'Expandable', desc: 'White card with thin border outline, no fill' },
    { id: 'cert-104', name: 'Warm Slate', category: 'Expandable', desc: 'Warm dark gray (#2a2d35) with subtle warm shadow' },
    { id: 'cert-105', name: 'Navy Deep', category: 'Expandable', desc: 'Deep navy (#1a1e2e) with blue-tinted shadow' },
    { id: 'cert-106', name: 'Elevated White', category: 'Expandable', desc: 'White card with layered shadows for depth' },
    { id: 'cert-107', name: 'Border Gradient', category: 'Expandable', desc: 'Dark card with gradient border that fades to white' },
    { id: 'cert-108', name: 'Charcoal Soft', category: 'Expandable', desc: 'Medium charcoal (#3a3a3a) with rounded corners and big blur shadow' },
    { id: 'cert-109', name: 'Warm Frost', category: 'Expandable', desc: 'Warm off-white frost rgba(245,243,240,0.75) + border + dots' },
    { id: 'cert-110', name: 'Light Smoke', category: 'Expandable', desc: 'Light gray frost rgba(240,240,240,0.8) + dots + soft shadow' },
    { id: 'cert-111', name: 'Pearl', category: 'Expandable', desc: 'Pearly white rgba(248,248,250,0.7) + thin border + dots' },
    { id: 'cert-112', name: 'Silver Frost', category: 'Expandable', desc: 'Cool silver rgba(235,237,240,0.8) + border + dots' },
    { id: 'cert-113', name: 'Mist', category: 'Expandable', desc: 'Misty rgba(230,230,230,0.7) + heavier blur + dots + border' },
    { id: 'cert-114', name: 'Cloud', category: 'Expandable', desc: 'Cloud white rgba(250,250,252,0.65) + larger shadow + dots' },
    { id: 'cert-115', name: 'Ash Frost', category: 'Expandable', desc: 'Slightly darker ash rgba(220,220,225,0.75) + border + dots' },
    { id: 'cert-116', name: 'Ivory Outline', category: 'Expandable', desc: 'Ivory rgba(252,250,245,0.8) + crisp dark border + dots' },
    { id: 'cert-117', name: 'Slate Frost', category: 'Expandable', desc: 'Light slate rgba(225,228,235,0.8) + blue-tint border + dots' },
    { id: 'cert-118', name: 'Cream Glass', category: 'Expandable', desc: 'Cream rgba(248,245,240,0.85) + warm shadow + thin border + dots' },
  ],
};

const certTabs = [
  { key: 'layout', label: 'Layout', color: 'default' },
  { key: 'style', label: 'Style', color: 'blue' },
  { key: 'content', label: 'Content', color: 'green' },
  { key: 'experimental', label: 'Experimental', color: 'purple' },
  { key: 'expandable', label: 'Expandable', color: 'orange' },
];

// ============================================
// SHARED DATA
// ============================================

const LOGO_SERVICE = '/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-white-type.svg';
const LOGO_SERVICE_BLACK = '/assets/images/robinson-assets/logos/rhc_authorized-service-center-logo-logo-yellow-rotor-black-type.svg';
const LOGO_DEALER = '/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-white-type.svg';
const LOGO_DEALER_BLACK = '/assets/images/robinson-assets/logos/rhc-authorized-dealer-logo-logo-yellow-rotor-black-type.svg';
const LOGO_RHC = '/assets/images/robinson-assets/logos/rhc.png';
const FACILITY_PHOTO = '/assets/images/facility/hq-0089.jpg';

const CERT_LABEL = 'The Robinson Specialists';
const CERT_TITLE = 'Authorized Dealer & Service Center';
const CERT_DESC = 'Factory distributor, authorised dealer, and designated service centre for the full Robinson range: R22, R44, R66.';
const CERT_QUOTE = "Nothing leaves our hangar that we wouldn't fly our own families in.";

const STATS = [
  { value: '85+', label: 'Aircraft' },
  { value: '2,500+', label: 'Services' },
  { value: 'Part 145', label: 'EASA' },
];

// ============================================
// V1 — Horizontal Classic (baseline, maint-16 card)
// ============================================
function CertCardV1() {
  return (
    <div className="cert-v1">
      <div className="fd-cert__card fd-cert__card--service">
        <div className="fd-cert__glow fd-cert__glow--blue"></div>
        <div className="fd-cert__content">
          <div className="fd-cert__logo-wrap">
            <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="fd-cert__logo" />
          </div>
          <div className="fd-cert__info">
            <span className="fd-cert__label">{CERT_LABEL}</span>
            <h3 className="fd-cert__title">{CERT_TITLE}</h3>
            <p className="fd-cert__desc">{CERT_DESC}</p>
            <div className="fd-cert__stats">
              {STATS.map((s, i) => (
                <span key={i}>
                  {i > 0 && <div className="fd-cert__stat-divider"></div>}
                  <div className="fd-cert__stat">
                    <span className="fd-cert__stat-value">{s.value}</span>
                    <span className="fd-cert__stat-label">{s.label}</span>
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="fd-cert__also">
          <span className="fd-cert__also-label">Also certified</span>
          <span className="fd-cert__also-item">Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V2 — Vertical Stack
// ============================================
function CertCardV2() {
  return (
    <div className="cert-v2">
      <div className="cert-v2__card">
        <div className="cert-v2__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v2__logo" />
        </div>
        <div className="cert-v2__body">
          <span className="cert-v2__label">{CERT_LABEL}</span>
          <h3 className="cert-v2__title">{CERT_TITLE}</h3>
          <p className="cert-v2__desc">{CERT_DESC}</p>
          <div className="cert-v2__stats">
            {STATS.map((s, i) => (
              <div className="cert-v2__stat" key={i}>
                <span className="cert-v2__stat-value">{s.value}</span>
                <span className="cert-v2__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v2__footer">
          <span>Also certified</span>
          <strong>Guimbal Cabri G2</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V3 — Split 50/50
// ============================================
function CertCardV3() {
  return (
    <div className="cert-v3">
      <div className="cert-v3__card">
        <div className="cert-v3__left">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v3__logo" />
          <span className="cert-v3__left-label">{CERT_LABEL}</span>
        </div>
        <div className="cert-v3__right">
          <h3 className="cert-v3__title">{CERT_TITLE}</h3>
          <p className="cert-v3__desc">{CERT_DESC}</p>
          <div className="cert-v3__stats">
            {STATS.map((s, i) => (
              <div className="cert-v3__stat" key={i}>
                <span className="cert-v3__stat-value">{s.value}</span>
                <span className="cert-v3__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="cert-v3__bar">
        <span>Also certified, Guimbal Cabri G2</span>
      </div>
    </div>
  );
}

// ============================================
// V4 — Wide Banner
// ============================================
function CertCardV4() {
  return (
    <div className="cert-v4">
      <div className="cert-v4__card">
        <div className="cert-v4__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v4__logo" />
        </div>
        <div className="cert-v4__info">
          <h3 className="cert-v4__title">{CERT_TITLE}</h3>
          <p className="cert-v4__desc">{CERT_DESC}</p>
        </div>
        <div className="cert-v4__stats">
          {STATS.map((s, i) => (
            <div className="cert-v4__stat" key={i}>
              <span className="cert-v4__stat-value">{s.value}</span>
              <span className="cert-v4__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="cert-v4__badge">
          <span className="cert-v4__badge-label">+Guimbal</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V5 — Card + Sidebar
// ============================================
function CertCardV5() {
  return (
    <div className="cert-v5">
      <div className="cert-v5__main">
        <div className="cert-v5__glow"></div>
        <div className="cert-v5__content">
          <div className="cert-v5__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v5__logo" />
          </div>
          <div className="cert-v5__info">
            <span className="cert-v5__label">{CERT_LABEL}</span>
            <h3 className="cert-v5__title">{CERT_TITLE}</h3>
            <p className="cert-v5__desc">{CERT_DESC}</p>
          </div>
        </div>
      </div>
      <div className="cert-v5__sidebar">
        {STATS.map((s, i) => (
          <div className="cert-v5__sidebar-stat" key={i}>
            <span className="cert-v5__sidebar-value">{s.value}</span>
            <span className="cert-v5__sidebar-label">{s.label}</span>
          </div>
        ))}
        <div className="cert-v5__sidebar-badge">
          <span>+Guimbal G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V6 — Glass Morphism
// ============================================
function CertCardV6() {
  return (
    <div className="cert-v6">
      <div className="cert-v6__card">
        <div className="cert-v6__content">
          <div className="cert-v6__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v6__logo" />
          </div>
          <div className="cert-v6__info">
            <span className="cert-v6__label">{CERT_LABEL}</span>
            <h3 className="cert-v6__title">{CERT_TITLE}</h3>
            <p className="cert-v6__desc">{CERT_DESC}</p>
            <div className="cert-v6__stats">
              {STATS.map((s, i) => (
                <div className="cert-v6__stat" key={i}>
                  <span className="cert-v6__stat-value">{s.value}</span>
                  <span className="cert-v6__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cert-v6__footer">
          <span>Also certified, Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V7 — Gold Accent
// ============================================
function CertCardV7() {
  return (
    <div className="cert-v7">
      <div className="cert-v7__card">
        <div className="cert-v7__glow"></div>
        <div className="cert-v7__content">
          <div className="cert-v7__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v7__logo" />
          </div>
          <div className="cert-v7__info">
            <span className="cert-v7__label">{CERT_LABEL}</span>
            <h3 className="cert-v7__title">{CERT_TITLE}</h3>
            <p className="cert-v7__desc">{CERT_DESC}</p>
            <div className="cert-v7__stats">
              {STATS.map((s, i) => (
                <span key={i}>
                  {i > 0 && <div className="cert-v7__divider"></div>}
                  <div className="cert-v7__stat">
                    <span className="cert-v7__stat-value">{s.value}</span>
                    <span className="cert-v7__stat-label">{s.label}</span>
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="cert-v7__footer">
          <span>Also certified, Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V8 — Light Mode
// ============================================
function CertCardV8() {
  return (
    <div className="cert-v8">
      <div className="cert-v8__card">
        <div className="cert-v8__content">
          <div className="cert-v8__logo-wrap">
            <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="cert-v8__logo" />
          </div>
          <div className="cert-v8__info">
            <span className="cert-v8__label">{CERT_LABEL}</span>
            <h3 className="cert-v8__title">{CERT_TITLE}</h3>
            <p className="cert-v8__desc">{CERT_DESC}</p>
            <div className="cert-v8__stats">
              {STATS.map((s, i) => (
                <span key={i}>
                  {i > 0 && <div className="cert-v8__divider"></div>}
                  <div className="cert-v8__stat">
                    <span className="cert-v8__stat-value">{s.value}</span>
                    <span className="cert-v8__stat-label">{s.label}</span>
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="cert-v8__footer">
          <span>Also certified, Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V9 — Outlined / Wireframe
// ============================================
function CertCardV9() {
  return (
    <div className="cert-v9">
      <div className="cert-v9__card">
        <div className="cert-v9__content">
          <div className="cert-v9__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v9__logo" />
          </div>
          <div className="cert-v9__info">
            <span className="cert-v9__label">{CERT_LABEL}</span>
            <h3 className="cert-v9__title">{CERT_TITLE}</h3>
            <p className="cert-v9__desc">{CERT_DESC}</p>
            <div className="cert-v9__stats">
              {STATS.map((s, i) => (
                <div className="cert-v9__stat" key={i}>
                  <span className="cert-v9__stat-value">{s.value}</span>
                  <span className="cert-v9__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cert-v9__badge">Guimbal G2</div>
      </div>
    </div>
  );
}

// ============================================
// V10 — Gradient Sweep
// ============================================
function CertCardV10() {
  return (
    <div className="cert-v10">
      <div className="cert-v10__card">
        <div className="cert-v10__content">
          <div className="cert-v10__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v10__logo" />
          </div>
          <div className="cert-v10__info">
            <span className="cert-v10__label">{CERT_LABEL}</span>
            <h3 className="cert-v10__title">{CERT_TITLE}</h3>
            <p className="cert-v10__desc">{CERT_DESC}</p>
            <div className="cert-v10__stats">
              {STATS.map((s, i) => (
                <span key={i}>
                  {i > 0 && <div className="cert-v10__divider"></div>}
                  <div className="cert-v10__stat">
                    <span className="cert-v10__stat-value">{s.value}</span>
                    <span className="cert-v10__stat-label">{s.label}</span>
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="cert-v10__footer">
          <span>Also certified, Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V11 — Stats Hero
// ============================================
function CertCardV11() {
  return (
    <div className="cert-v11">
      <div className="cert-v11__card">
        <div className="cert-v11__stats-hero">
          {STATS.map((s, i) => (
            <div className="cert-v11__stat-block" key={i}>
              <span className="cert-v11__stat-value">{s.value}</span>
              <span className="cert-v11__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="cert-v11__lower">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v11__logo" />
          <div className="cert-v11__info">
            <h3 className="cert-v11__title">{CERT_TITLE}</h3>
            <p className="cert-v11__desc">{CERT_DESC}</p>
          </div>
        </div>
        <div className="cert-v11__footer">
          <span>Also certified, Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V12 — Logo Hero
// ============================================
function CertCardV12() {
  return (
    <div className="cert-v12">
      <div className="cert-v12__card">
        <div className="cert-v12__logo-hero">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v12__logo" />
        </div>
        <div className="cert-v12__caption">
          <h3 className="cert-v12__title">{CERT_TITLE}</h3>
          <p className="cert-v12__desc">{CERT_DESC}</p>
        </div>
        <div className="cert-v12__stats-footer">
          {STATS.map((s, i) => (
            <div className="cert-v12__stat" key={i}>
              <span className="cert-v12__stat-value">{s.value}</span>
              <span className="cert-v12__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// V13 — Testimonial Embed
// ============================================
function CertCardV13() {
  return (
    <div className="cert-v13">
      <div className="cert-v13__card">
        <div className="cert-v13__content">
          <div className="cert-v13__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v13__logo" />
          </div>
          <div className="cert-v13__info">
            <span className="cert-v13__label">{CERT_LABEL}</span>
            <h3 className="cert-v13__title">{CERT_TITLE}</h3>
            <p className="cert-v13__desc">{CERT_DESC}</p>
            <blockquote className="cert-v13__quote">
              <span className="cert-v13__quote-mark">&ldquo;</span>
              {CERT_QUOTE}
              <span className="cert-v13__quote-mark">&rdquo;</span>
            </blockquote>
            <div className="cert-v13__stats">
              {STATS.map((s, i) => (
                <div className="cert-v13__stat" key={i}>
                  <span className="cert-v13__stat-value">{s.value}</span>
                  <span className="cert-v13__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cert-v13__footer">
          <span>Also certified, Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V14 — Multi-Badge
// ============================================
function CertCardV14() {
  return (
    <div className="cert-v14">
      <div className="cert-v14__card">
        <div className="cert-v14__badges">
          <div className="cert-v14__badge-item">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v14__badge-logo" />
            <span>Service Center</span>
          </div>
          <div className="cert-v14__badge-sep"></div>
          <div className="cert-v14__badge-item cert-v14__badge-item--small cert-v14__badge-item--guimbal">
            <span className="cert-v14__guimbal-text">GUIMBAL</span>
            <span>Cabri G2 Certified</span>
          </div>
        </div>
        <div className="cert-v14__body">
          <h3 className="cert-v14__title">{CERT_TITLE}</h3>
          <p className="cert-v14__desc">{CERT_DESC}</p>
          <div className="cert-v14__stats">
            {STATS.map((s, i) => (
              <div className="cert-v14__stat" key={i}>
                <span className="cert-v14__stat-value">{s.value}</span>
                <span className="cert-v14__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V15 — Expandable
// ============================================
function CertCardV15() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="cert-v15">
      <div
        className={`cert-v15__card ${expanded ? 'cert-v15__card--expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="cert-v15__compact">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v15__logo" />
          <div className="cert-v15__compact-info">
            <h3 className="cert-v15__title">{CERT_TITLE}</h3>
            <span className="cert-v15__expand-hint">
              {expanded ? 'Click to collapse' : 'See details \u2192'}
            </span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v15__details">
            <span className="cert-v15__label">{CERT_LABEL}</span>
            <p className="cert-v15__desc">{CERT_DESC}</p>
            <div className="cert-v15__stats">
              {STATS.map((s, i) => (
                <div className="cert-v15__stat" key={i}>
                  <span className="cert-v15__stat-value">{s.value}</span>
                  <span className="cert-v15__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v15__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V16 — Asymmetric
// ============================================
function CertCardV16() {
  return (
    <div className="cert-v16">
      <div className="cert-v16__card">
        <div className="cert-v16__logo-float">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v16__logo" />
        </div>
        <div className="cert-v16__body">
          <span className="cert-v16__label">{CERT_LABEL}</span>
          <h3 className="cert-v16__title">{CERT_TITLE}</h3>
          <p className="cert-v16__desc">{CERT_DESC}</p>
        </div>
        <div className="cert-v16__scattered-stats">
          <div className="cert-v16__sstat cert-v16__sstat--1">
            <span className="cert-v16__sstat-value">85+</span>
            <span className="cert-v16__sstat-label">Aircraft</span>
          </div>
          <div className="cert-v16__sstat cert-v16__sstat--2">
            <span className="cert-v16__sstat-value">2,500+</span>
            <span className="cert-v16__sstat-label">Services</span>
          </div>
          <div className="cert-v16__sstat cert-v16__sstat--3">
            <span className="cert-v16__sstat-value">Part 145</span>
            <span className="cert-v16__sstat-label">EASA</span>
          </div>
        </div>
        <div className="cert-v16__guimbal">+Guimbal G2</div>
      </div>
    </div>
  );
}

// ============================================
// V17 — Full Bleed Photo
// ============================================
function CertCardV17() {
  return (
    <div className="cert-v17">
      <div className="cert-v17__card" style={{ backgroundImage: `url(${FACILITY_PHOTO})` }}>
        <div className="cert-v17__overlay"></div>
        <div className="cert-v17__content">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v17__logo" />
          <span className="cert-v17__label">{CERT_LABEL}</span>
          <h3 className="cert-v17__title">{CERT_TITLE}</h3>
          <p className="cert-v17__desc">{CERT_DESC}</p>
          <div className="cert-v17__stats">
            {STATS.map((s, i) => (
              <div className="cert-v17__stat" key={i}>
                <span className="cert-v17__stat-value">{s.value}</span>
                <span className="cert-v17__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V18 — Mono Type
// ============================================
function CertCardV18() {
  return (
    <div className="cert-v18">
      <div className="cert-v18__card">
        <div className="cert-v18__hero-text">ROBINSON</div>
        <div className="cert-v18__subtitle">AUTHORIZED SERVICE CENTER</div>
        <div className="cert-v18__divider"></div>
        <p className="cert-v18__desc">{CERT_DESC}</p>
        <div className="cert-v18__stats">
          {STATS.map((s, i) => (
            <div className="cert-v18__stat" key={i}>
              <span className="cert-v18__stat-value">{s.value}</span>
              <span className="cert-v18__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="cert-v18__footer">
          <span>ALSO CERTIFIED, GUIMBAL CABRI G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V19 — Badge / Seal
// ============================================
function CertCardV19() {
  return (
    <div className="cert-v19">
      <div className="cert-v19__seal">
        <div className="cert-v19__ring">
          <span className="cert-v19__ring-text">ROBINSON HELICOPTER COMPANY &bull; AUTHORIZED SERVICE CENTER &bull;</span>
        </div>
        <div className="cert-v19__center">
          <img src={LOGO_RHC} alt="Robinson" className="cert-v19__logo" />
          <div className="cert-v19__center-label">EST. 2010</div>
        </div>
        <div className="cert-v19__details">
          <div className="cert-v19__stats">
            {STATS.map((s, i) => (
              <span className="cert-v19__detail-stat" key={i}>{s.value} {s.label}</span>
            ))}
          </div>
          <span className="cert-v19__guimbal">+Guimbal G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V20 — Dark Terminal
// ============================================
function CertCardV20() {
  return (
    <div className="cert-v20">
      <div className="cert-v20__terminal">
        <div className="cert-v20__header">
          <span className="cert-v20__dot cert-v20__dot--red"></span>
          <span className="cert-v20__dot cert-v20__dot--yellow"></span>
          <span className="cert-v20__dot cert-v20__dot--green"></span>
          <span className="cert-v20__header-text">hq-aviation@denham:~$ cert --info</span>
        </div>
        <div className="cert-v20__body">
          <div className="cert-v20__line"><span className="cert-v20__key">type:</span> Robinson Authorized Service Center</div>
          <div className="cert-v20__line"><span className="cert-v20__key">status:</span> <span className="cert-v20__ok">ACTIVE</span></div>
          <div className="cert-v20__line"><span className="cert-v20__key">designation:</span> Factory Distributor, Dealer &amp; Service Centre</div>
          <div className="cert-v20__line"><span className="cert-v20__key">range:</span> R22, R44, R66</div>
          <div className="cert-v20__line"><span className="cert-v20__key">also_certified:</span> Guimbal Cabri G2</div>
          <div className="cert-v20__divider"></div>
          <div className="cert-v20__line"><span className="cert-v20__key">aircraft_managed:</span> 85+</div>
          <div className="cert-v20__line"><span className="cert-v20__key">services_completed:</span> 2,500+</div>
          <div className="cert-v20__line"><span className="cert-v20__key">easa_approval:</span> Part 145</div>
          <div className="cert-v20__divider"></div>
          <div className="cert-v20__line cert-v20__line--dim"><span className="cert-v20__key">location:</span> Denham Aerodrome, EGLD</div>
          <div className="cert-v20__line cert-v20__line--dim"><span className="cert-v20__key">coords:</span> 51.5783&deg;N 0.5133&deg;W</div>
          <div className="cert-v20__prompt">hq-aviation@denham:~$ <span className="cert-v20__cursor">_</span></div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V21 — Pill Compact
// ============================================
function CertCardV21() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v21">
      <div className={`cert-v21__card ${expanded ? 'cert-v21__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v21__pill">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v21__logo" />
          <span className="cert-v21__pill-title">{CERT_TITLE}</span>
          <span className="cert-v21__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v21__details">
            <p className="cert-v21__desc">{CERT_DESC}</p>
            <div className="cert-v21__stats">
              {STATS.map((s, i) => (
                <div className="cert-v21__stat" key={i}>
                  <span className="cert-v21__stat-value">{s.value}</span>
                  <span className="cert-v21__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v21__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V22 — Icon-Only Compact
// ============================================
function CertCardV22() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v22">
      <div className={`cert-v22__card ${expanded ? 'cert-v22__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v22__icon-bar">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v22__logo" />
          {!expanded && <span className="cert-v22__hint">See details &rarr;</span>}
        </div>
        {expanded && (
          <div className="cert-v22__details">
            <span className="cert-v22__label">{CERT_LABEL}</span>
            <h3 className="cert-v22__title">{CERT_TITLE}</h3>
            <p className="cert-v22__desc">{CERT_DESC}</p>
            <div className="cert-v22__stats">
              {STATS.map((s, i) => (
                <div className="cert-v22__stat" key={i}>
                  <span className="cert-v22__stat-value">{s.value}</span>
                  <span className="cert-v22__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v22__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V23 — Ticker Compact
// ============================================
function CertCardV23() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v23">
      <div className={`cert-v23__card ${expanded ? 'cert-v23__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v23__ticker">
          <span className="cert-v23__ticker-text">Robinson ASC &bull; 85+ Aircraft &bull; Part 145 &bull; EASA Approved</span>
          <span className="cert-v23__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v23__details">
            <div className="cert-v23__header">
              <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v23__logo" />
              <div>
                <h3 className="cert-v23__title">{CERT_TITLE}</h3>
                <span className="cert-v23__label">{CERT_LABEL}</span>
              </div>
            </div>
            <p className="cert-v23__desc">{CERT_DESC}</p>
            <div className="cert-v23__stats">
              {STATS.map((s, i) => (
                <div className="cert-v23__stat" key={i}>
                  <span className="cert-v23__stat-value">{s.value}</span>
                  <span className="cert-v23__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V24 — Notification Compact
// ============================================
function CertCardV24() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v24">
      <div className={`cert-v24__card ${expanded ? 'cert-v24__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v24__toast">
          <div className="cert-v24__toast-icon">&#10003;</div>
          <div className="cert-v24__toast-text">
            <strong>Robinson Authorized Service Center</strong>
            <span>HQ Aviation, Denham Aerodrome</span>
          </div>
          <span className="cert-v24__hint">{expanded ? '\u2715' : 'Details'}</span>
        </div>
        {expanded && (
          <div className="cert-v24__details">
            <p className="cert-v24__desc">{CERT_DESC}</p>
            <div className="cert-v24__stats">
              {STATS.map((s, i) => (
                <div className="cert-v24__stat" key={i}>
                  <span className="cert-v24__stat-value">{s.value}</span>
                  <span className="cert-v24__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v24__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V25 — Split-Reveal Compact
// ============================================
function CertCardV25() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v25">
      <div className={`cert-v25__card ${expanded ? 'cert-v25__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v25__halves">
          <div className="cert-v25__left">
            <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v25__logo" />
          </div>
          <div className="cert-v25__right">
            <h3 className="cert-v25__title">{CERT_TITLE}</h3>
            <span className="cert-v25__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v25__reveal">
            <p className="cert-v25__desc">{CERT_DESC}</p>
            <div className="cert-v25__stats">
              {STATS.map((s, i) => (
                <div className="cert-v25__stat" key={i}>
                  <span className="cert-v25__stat-value">{s.value}</span>
                  <span className="cert-v25__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v25__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V26 — Slide Down
// ============================================
function CertCardV26() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v26">
      <div className={`cert-v26__card ${expanded ? 'cert-v26__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v26__bar">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v26__logo" />
          <h3 className="cert-v26__title">{CERT_TITLE}</h3>
          <span className="cert-v26__hint">{expanded ? '\u25B2' : '\u25BC'}</span>
        </div>
        <div className={`cert-v26__slide ${expanded ? 'cert-v26__slide--open' : ''}`}>
          <div className="cert-v26__content">
            <span className="cert-v26__label">{CERT_LABEL}</span>
            <p className="cert-v26__desc">{CERT_DESC}</p>
            <div className="cert-v26__stats">
              {STATS.map((s, i) => (
                <div className="cert-v26__stat" key={i}>
                  <span className="cert-v26__stat-value">{s.value}</span>
                  <span className="cert-v26__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v26__also">Also certified, Guimbal Cabri G2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V27 — Fade & Scale
// ============================================
function CertCardV27() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v27">
      <div className={`cert-v27__card ${expanded ? 'cert-v27__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v27__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v27__logo" />
          <div className="cert-v27__compact-info">
            <h3 className="cert-v27__title">{CERT_TITLE}</h3>
            <span className="cert-v27__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v27__details">
            <span className="cert-v27__label">{CERT_LABEL}</span>
            <p className="cert-v27__desc">{CERT_DESC}</p>
            <div className="cert-v27__stats">
              {STATS.map((s, i) => (
                <div className="cert-v27__stat" key={i}>
                  <span className="cert-v27__stat-value">{s.value}</span>
                  <span className="cert-v27__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v27__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V28 — Flip Reveal
// ============================================
function CertCardV28() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v28">
      <div className={`cert-v28__card ${expanded ? 'cert-v28__card--flipped' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v28__front">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v28__logo" />
          <h3 className="cert-v28__title">{CERT_TITLE}</h3>
          <span className="cert-v28__hint">Click to flip &rarr;</span>
        </div>
        <div className="cert-v28__back">
          <span className="cert-v28__label">{CERT_LABEL}</span>
          <p className="cert-v28__desc">{CERT_DESC}</p>
          <div className="cert-v28__stats">
            {STATS.map((s, i) => (
              <div className="cert-v28__stat" key={i}>
                <span className="cert-v28__stat-value">{s.value}</span>
                <span className="cert-v28__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="cert-v28__also">Also certified, Guimbal Cabri G2</div>
          <span className="cert-v28__back-hint">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V29 — Accordion Stack
// ============================================
function CertCardV29() {
  const [openIndex, setOpenIndex] = useState(-1);
  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);
  const sections = [
    { title: 'Info', content: (
      <div className="cert-v29__section-body">
        <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v29__logo" />
        <h3 className="cert-v29__title">{CERT_TITLE}</h3>
        <p className="cert-v29__desc">{CERT_DESC}</p>
      </div>
    )},
    { title: 'Stats', content: (
      <div className="cert-v29__section-body">
        <div className="cert-v29__stats">
          {STATS.map((s, i) => (
            <div className="cert-v29__stat" key={i}>
              <span className="cert-v29__stat-value">{s.value}</span>
              <span className="cert-v29__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: 'Certifications', content: (
      <div className="cert-v29__section-body">
        <div className="cert-v29__cert-list">
          <div className="cert-v29__cert-item">Robinson Authorized Service Center</div>
          <div className="cert-v29__cert-item">EASA Part 145 Approved</div>
          <div className="cert-v29__cert-item">Guimbal Cabri G2 Certified</div>
        </div>
      </div>
    )},
  ];
  return (
    <div className="cert-v29">
      <div className="cert-v29__card">
        {sections.map((s, i) => (
          <div key={i} className={`cert-v29__panel ${openIndex === i ? 'cert-v29__panel--open' : ''}`}>
            <div className="cert-v29__panel-bar" onClick={() => toggle(i)}>
              <span>{s.title}</span>
              <span className="cert-v29__arrow">{openIndex === i ? '\u25B2' : '\u25BC'}</span>
            </div>
            {openIndex === i && <div className="cert-v29__panel-content">{s.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// V30 — Morph Expand
// ============================================
function CertCardV30() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v30">
      <div className={`cert-v30__card ${expanded ? 'cert-v30__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v30__bar">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v30__logo" />
          <span className="cert-v30__bar-title">{expanded ? CERT_TITLE : 'Robinson ASC'}</span>
          <span className="cert-v30__hint">{expanded ? '\u2715' : '\u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v30__expanded">
            <p className="cert-v30__desc">{CERT_DESC}</p>
            <div className="cert-v30__stats">
              {STATS.map((s, i) => (
                <div className="cert-v30__stat" key={i}>
                  <span className="cert-v30__stat-value">{s.value}</span>
                  <span className="cert-v30__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v30__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V31 — Expand → Horizontal
// ============================================
function CertCardV31() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v31">
      <div className={`cert-v31__card ${expanded ? 'cert-v31__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v31__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v31__logo" />
          <h3 className="cert-v31__title">{CERT_TITLE}</h3>
          <span className="cert-v31__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v31__horizontal">
            <div className="cert-v31__left">
              <div className="cert-v31__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v31__stat" key={i}>
                    <span className="cert-v31__stat-value">{s.value}</span>
                    <span className="cert-v31__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v31__right">
              <span className="cert-v31__label">{CERT_LABEL}</span>
              <p className="cert-v31__desc">{CERT_DESC}</p>
              <div className="cert-v31__also">Also certified, Guimbal Cabri G2</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V32 — Expand → Grid
// ============================================
function CertCardV32() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v32">
      <div className={`cert-v32__card ${expanded ? 'cert-v32__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v32__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v32__logo" />
          <h3 className="cert-v32__title">{CERT_TITLE}</h3>
          <span className="cert-v32__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v32__grid">
            <div className="cert-v32__cell">
              <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v32__cell-logo" />
            </div>
            <div className="cert-v32__cell">
              <h3 className="cert-v32__cell-title">{CERT_TITLE}</h3>
              <p className="cert-v32__cell-desc">{CERT_DESC}</p>
            </div>
            <div className="cert-v32__cell">
              <div className="cert-v32__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v32__stat" key={i}>
                    <span className="cert-v32__stat-value">{s.value}</span>
                    <span className="cert-v32__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v32__cell cert-v32__cell--guimbal">
              <span className="cert-v32__guimbal-text">GUIMBAL</span>
              <span className="cert-v32__guimbal-sub">Cabri G2 Certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V33 — Expand → Timeline
// ============================================
function CertCardV33() {
  const [expanded, setExpanded] = useState(false);
  const timeline = [
    { year: '2010', event: 'HQ Aviation Founded' },
    { year: '2012', event: 'Robinson ASC Certified' },
    { year: '2018', event: '85+ Aircraft Under Management' },
    { year: 'Now', event: 'EASA Part 145 Approved' },
  ];
  return (
    <div className="cert-v33">
      <div className={`cert-v33__card ${expanded ? 'cert-v33__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v33__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v33__logo" />
          <h3 className="cert-v33__title">{CERT_TITLE}</h3>
          <span className="cert-v33__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v33__timeline">
            {timeline.map((t, i) => (
              <div className="cert-v33__tl-item" key={i}>
                <div className="cert-v33__tl-dot"></div>
                <div className="cert-v33__tl-content">
                  <span className="cert-v33__tl-year">{t.year}</span>
                  <span className="cert-v33__tl-event">{t.event}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V34 — Expand → Tabs
// ============================================
function CertCardV34() {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className="cert-v34">
      <div className={`cert-v34__card ${expanded ? 'cert-v34__card--expanded' : ''}`}>
        <div className="cert-v34__compact" onClick={() => setExpanded(!expanded)}>
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v34__logo" />
          <h3 className="cert-v34__title">{CERT_TITLE}</h3>
          <span className="cert-v34__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v34__tabs-area">
            <div className="cert-v34__tab-bar">
              {['overview', 'stats', 'certs'].map(t => (
                <button key={t} className={`cert-v34__tab ${activeTab === t ? 'cert-v34__tab--active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveTab(t); }}>
                  {t === 'overview' ? 'Overview' : t === 'stats' ? 'Stats' : 'Certifications'}
                </button>
              ))}
            </div>
            <div className="cert-v34__tab-content">
              {activeTab === 'overview' && (
                <div><span className="cert-v34__label">{CERT_LABEL}</span><p className="cert-v34__desc">{CERT_DESC}</p></div>
              )}
              {activeTab === 'stats' && (
                <div className="cert-v34__stats">
                  {STATS.map((s, i) => (
                    <div className="cert-v34__stat" key={i}>
                      <span className="cert-v34__stat-value">{s.value}</span>
                      <span className="cert-v34__stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'certs' && (
                <div className="cert-v34__cert-list">
                  <div>Robinson Authorized Service Center</div>
                  <div>EASA Part 145 Approved</div>
                  <div>Guimbal Cabri G2 Certified</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V35 — Expand → Full Bleed
// ============================================
function CertCardV35() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v35">
      <div className={`cert-v35__card ${expanded ? 'cert-v35__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v35__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v35__logo" />
          <h3 className="cert-v35__title">{CERT_TITLE}</h3>
          <span className="cert-v35__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v35__bleed">
            <div className="cert-v35__glow"></div>
            <div className="cert-v35__bleed-content">
              <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v35__bleed-logo" />
              <span className="cert-v35__label">{CERT_LABEL}</span>
              <h3 className="cert-v35__bleed-title">{CERT_TITLE}</h3>
              <p className="cert-v35__desc">{CERT_DESC}</p>
              <div className="cert-v35__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v35__stat" key={i}>
                    <span className="cert-v35__stat-value">{s.value}</span>
                    <span className="cert-v35__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="cert-v35__also">Also certified, Guimbal Cabri G2</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V36 — Expand → Services List
// ============================================
function CertCardV36() {
  const [expanded, setExpanded] = useState(false);
  const services = ['Annual Inspections', 'Engine Overhauls', 'Avionics Upgrades', 'AOG Support'];
  return (
    <div className="cert-v36">
      <div className={`cert-v36__card ${expanded ? 'cert-v36__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v36__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v36__logo" />
          <div className="cert-v36__compact-info">
            <h3 className="cert-v36__title">{CERT_TITLE}</h3>
            <span className="cert-v36__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v36__details">
            <h4 className="cert-v36__services-title">Our Services</h4>
            <div className="cert-v36__services">
              {services.map((s, i) => (
                <div className="cert-v36__service" key={i}>
                  <span className="cert-v36__service-dot"></span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="cert-v36__stats">
              {STATS.map((s, i) => (
                <div className="cert-v36__stat" key={i}>
                  <span className="cert-v36__stat-value">{s.value}</span>
                  <span className="cert-v36__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V37 — Expand → Quote
// ============================================
function CertCardV37() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v37">
      <div className={`cert-v37__card ${expanded ? 'cert-v37__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v37__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v37__logo" />
          <div className="cert-v37__compact-info">
            <h3 className="cert-v37__title">{CERT_TITLE}</h3>
            <span className="cert-v37__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v37__details">
            <blockquote className="cert-v37__quote">
              <span className="cert-v37__quote-mark">&ldquo;</span>
              {CERT_QUOTE}
              <span className="cert-v37__quote-mark">&rdquo;</span>
            </blockquote>
            <div className="cert-v37__attribution">
              <strong>David Cross</strong>
              <span>Chief Engineer, HQ Aviation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V38 — Expand → Team
// ============================================
function CertCardV38() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v38">
      <div className={`cert-v38__card ${expanded ? 'cert-v38__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v38__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v38__logo" />
          <div className="cert-v38__compact-info">
            <h3 className="cert-v38__title">{CERT_TITLE}</h3>
            <span className="cert-v38__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v38__details">
            <h4 className="cert-v38__team-title">Meet the Team</h4>
            <div className="cert-v38__team-card">
              <div className="cert-v38__avatar">DC</div>
              <div className="cert-v38__team-info">
                <strong>David Cross</strong>
                <span>Chief Engineer</span>
                <div className="cert-v38__team-stats">
                  <span>25+ years experience</span>
                  <span>40+ rebuilds completed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V39 — Expand → Facility
// ============================================
function CertCardV39() {
  const [expanded, setExpanded] = useState(false);
  const facilityStats = [
    { value: '12,000', label: 'Sq Ft Facility' },
    { value: '8', label: 'Heated Bays' },
    { value: '\u00A3500K+', label: 'Parts in Stock' },
  ];
  return (
    <div className="cert-v39">
      <div className={`cert-v39__card ${expanded ? 'cert-v39__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v39__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v39__logo" />
          <div className="cert-v39__compact-info">
            <h3 className="cert-v39__title">{CERT_TITLE}</h3>
            <span className="cert-v39__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v39__details">
            <h4 className="cert-v39__facility-title">Our Facility</h4>
            <div className="cert-v39__facility-stats">
              {facilityStats.map((s, i) => (
                <div className="cert-v39__fstat" key={i}>
                  <span className="cert-v39__fstat-value">{s.value}</span>
                  <span className="cert-v39__fstat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="cert-v39__facility-desc">Purpose-built maintenance facility at Denham Aerodrome, fully equipped for Robinson and Guimbal helicopter servicing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V40 — Expand → Contact CTA
// ============================================
function CertCardV40() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v40">
      <div className={`cert-v40__card ${expanded ? 'cert-v40__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v40__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v40__logo" />
          <div className="cert-v40__compact-info">
            <h3 className="cert-v40__title">{CERT_TITLE}</h3>
            <span className="cert-v40__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v40__details">
            <div className="cert-v40__contact-grid">
              <div className="cert-v40__contact-item">
                <span className="cert-v40__contact-label">Phone</span>
                <span className="cert-v40__contact-value">+44 1895 832 833</span>
              </div>
              <div className="cert-v40__contact-item">
                <span className="cert-v40__contact-label">Email</span>
                <span className="cert-v40__contact-value">maintenance@hqaviation.com</span>
              </div>
              <div className="cert-v40__contact-item">
                <span className="cert-v40__contact-label">Location</span>
                <span className="cert-v40__contact-value">Denham Aerodrome, Uxbridge, London, UB9 5DF</span>
              </div>
            </div>
            <button className="cert-v40__cta" onClick={(e) => e.stopPropagation()}>Get in Touch</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V41 — Drawer
// ============================================
function CertCardV41() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v41">
      <div className={`cert-v41__card ${expanded ? 'cert-v41__card--open' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v41__main">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v41__logo" />
          <div className="cert-v41__info">
            <h3 className="cert-v41__title">{CERT_TITLE}</h3>
            <span className="cert-v41__hint">{expanded ? 'Close drawer' : 'See details \u2192'}</span>
          </div>
        </div>
        <div className="cert-v41__drawer">
          <div className="cert-v41__drawer-inner">
            <span className="cert-v41__label">{CERT_LABEL}</span>
            <p className="cert-v41__desc">{CERT_DESC}</p>
            <div className="cert-v41__stats">
              {STATS.map((s, i) => (
                <div className="cert-v41__stat" key={i}>
                  <span className="cert-v41__stat-value">{s.value}</span>
                  <span className="cert-v41__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v41__also">Also certified, Guimbal Cabri G2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V42 — Staggered Reveal
// ============================================
function CertCardV42() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v42">
      <div className={`cert-v42__card ${expanded ? 'cert-v42__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v42__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v42__logo" />
          <h3 className="cert-v42__title">{CERT_TITLE}</h3>
          <span className="cert-v42__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v42__details">
            <div className="cert-v42__row cert-v42__row--1">
              <span className="cert-v42__label">{CERT_LABEL}</span>
            </div>
            <div className="cert-v42__row cert-v42__row--2">
              <p className="cert-v42__desc">{CERT_DESC}</p>
            </div>
            <div className="cert-v42__row cert-v42__row--3">
              <div className="cert-v42__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v42__stat" key={i}>
                    <span className="cert-v42__stat-value">{s.value}</span>
                    <span className="cert-v42__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v42__row cert-v42__row--4">
              <div className="cert-v42__also">Also certified, Guimbal Cabri G2</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V43 — Peek
// ============================================
function CertCardV43() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v43">
      <div className={`cert-v43__card ${expanded ? 'cert-v43__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v43__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v43__logo" />
          <div className="cert-v43__compact-info">
            <h3 className="cert-v43__title">{CERT_TITLE}</h3>
            <span className="cert-v43__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        <div className={`cert-v43__peek ${expanded ? 'cert-v43__peek--full' : ''}`}>
          <span className="cert-v43__label">{CERT_LABEL}</span>
          <p className="cert-v43__desc">{CERT_DESC}</p>
          <div className="cert-v43__stats">
            {STATS.map((s, i) => (
              <div className="cert-v43__stat" key={i}>
                <span className="cert-v43__stat-value">{s.value}</span>
                <span className="cert-v43__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="cert-v43__also">Also certified, Guimbal Cabri G2</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V44 — Progress Bar
// ============================================
function CertCardV44() {
  const [expanded, setExpanded] = useState(false);
  const metrics = [
    { label: 'Aircraft Managed', value: '85+', pct: 85 },
    { label: 'Services Completed', value: '2,500+', pct: 92 },
    { label: 'EASA Compliance', value: 'Part 145', pct: 100 },
  ];
  return (
    <div className="cert-v44">
      <div className={`cert-v44__card ${expanded ? 'cert-v44__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v44__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v44__logo" />
          <div className="cert-v44__compact-info">
            <h3 className="cert-v44__title">{CERT_TITLE}</h3>
            <span className="cert-v44__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v44__details">
            <div className="cert-v44__meters">
              {metrics.map((m, i) => (
                <div className="cert-v44__meter" key={i}>
                  <div className="cert-v44__meter-header">
                    <span className="cert-v44__meter-label">{m.label}</span>
                    <span className="cert-v44__meter-value">{m.value}</span>
                  </div>
                  <div className="cert-v44__meter-track">
                    <div className="cert-v44__meter-fill" style={{ width: `${m.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cert-v44__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V45 — Card Stack
// ============================================
function CertCardV45() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v45">
      <div className={`cert-v45__stack ${expanded ? 'cert-v45__stack--fanned' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v45__card cert-v45__card--back2">
          <span>Guimbal Cabri G2</span>
        </div>
        <div className="cert-v45__card cert-v45__card--back1">
          <div className="cert-v45__stats">
            {STATS.map((s, i) => (
              <div className="cert-v45__stat" key={i}>
                <span className="cert-v45__stat-value">{s.value}</span>
                <span className="cert-v45__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v45__card cert-v45__card--front">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v45__logo" />
          <h3 className="cert-v45__title">{CERT_TITLE}</h3>
          <span className="cert-v45__hint">{expanded ? 'Click to stack' : 'Click to fan out'}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V46 — Spotlight
// ============================================
function CertCardV46() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v46">
      <div className={`cert-v46__card ${expanded ? 'cert-v46__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v46__spot"></div>
        <div className="cert-v46__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v46__logo" />
          <h3 className="cert-v46__title">{CERT_TITLE}</h3>
          <span className="cert-v46__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v46__details">
            <span className="cert-v46__label">{CERT_LABEL}</span>
            <p className="cert-v46__desc">{CERT_DESC}</p>
            <div className="cert-v46__stats">
              {STATS.map((s, i) => (
                <div className="cert-v46__stat" key={i}>
                  <span className="cert-v46__stat-value">{s.value}</span>
                  <span className="cert-v46__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v46__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V47 — Diagonal Split
// ============================================
function CertCardV47() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v47">
      <div className={`cert-v47__card ${expanded ? 'cert-v47__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v47__top">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v47__logo" />
          <h3 className="cert-v47__title">{CERT_TITLE}</h3>
          <span className="cert-v47__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        <div className="cert-v47__diagonal"></div>
        {expanded && (
          <div className="cert-v47__bottom">
            <p className="cert-v47__desc">{CERT_DESC}</p>
            <div className="cert-v47__stats">
              {STATS.map((s, i) => (
                <div className="cert-v47__stat" key={i}>
                  <span className="cert-v47__stat-value">{s.value}</span>
                  <span className="cert-v47__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cert-v47__also">Also certified, Guimbal Cabri G2</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V48 — Meter Dashboard
// ============================================
function CertCardV48() {
  const [expanded, setExpanded] = useState(false);
  const gauges = [
    { label: 'Aircraft', value: '85+', angle: 153 },
    { label: 'Services', value: '2,500+', angle: 166 },
    { label: 'EASA', value: 'Part 145', angle: 180 },
  ];
  return (
    <div className="cert-v48">
      <div className={`cert-v48__card ${expanded ? 'cert-v48__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v48__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v48__logo" />
          <div className="cert-v48__compact-info">
            <h3 className="cert-v48__title">{CERT_TITLE}</h3>
            <span className="cert-v48__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v48__details">
            <div className="cert-v48__gauges">
              {gauges.map((g, i) => (
                <div className="cert-v48__gauge" key={i}>
                  <div className="cert-v48__gauge-ring">
                    <svg viewBox="0 0 36 36" className="cert-v48__gauge-svg">
                      <path className="cert-v48__gauge-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <path className="cert-v48__gauge-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray={`${g.angle / 1.8}, 100`} />
                    </svg>
                    <span className="cert-v48__gauge-value">{g.value}</span>
                  </div>
                  <span className="cert-v48__gauge-label">{g.label}</span>
                </div>
              ))}
            </div>
            <p className="cert-v48__desc">{CERT_DESC}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V49 — Map Pin
// ============================================
function CertCardV49() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v49">
      <div className={`cert-v49__card ${expanded ? 'cert-v49__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v49__pin-bar">
          <div className="cert-v49__pin-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div className="cert-v49__pin-info">
            <h3 className="cert-v49__title">HQ Aviation, Denham Aerodrome</h3>
            <span className="cert-v49__subtitle">{CERT_TITLE}</span>
          </div>
          <span className="cert-v49__hint">{expanded ? '\u2715' : 'Details'}</span>
        </div>
        {expanded && (
          <div className="cert-v49__details">
            <div className="cert-v49__location">
              <div className="cert-v49__coord"><span>LAT</span><strong>51.5783°N</strong></div>
              <div className="cert-v49__coord"><span>LON</span><strong>0.5133°W</strong></div>
              <div className="cert-v49__coord"><span>ICAO</span><strong>EGLD</strong></div>
            </div>
            <p className="cert-v49__desc">{CERT_DESC}</p>
            <div className="cert-v49__stats">
              {STATS.map((s, i) => (
                <div className="cert-v49__stat" key={i}>
                  <span className="cert-v49__stat-value">{s.value}</span>
                  <span className="cert-v49__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V50 — Badge Carousel
// ============================================
function CertCardV50() {
  const [expanded, setExpanded] = useState(false);
  const badges = [
    { title: 'Robinson ASC', sub: 'Authorized Service Center' },
    { title: 'EASA Part 145', sub: 'Maintenance Organisation' },
    { title: 'Guimbal Cabri G2', sub: 'Certified Maintenance' },
    { title: 'Factory Distributor', sub: 'R22 · R44 · R66' },
  ];
  return (
    <div className="cert-v50">
      <div className={`cert-v50__card ${expanded ? 'cert-v50__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v50__compact">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v50__logo" />
          <div className="cert-v50__compact-info">
            <h3 className="cert-v50__title">{CERT_TITLE}</h3>
            <span className="cert-v50__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && (
          <div className="cert-v50__details">
            <div className="cert-v50__badges">
              {badges.map((b, i) => (
                <div className="cert-v50__badge" key={i}>
                  <div className="cert-v50__badge-icon">&#10003;</div>
                  <div>
                    <strong>{b.title}</strong>
                    <span>{b.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="cert-v50__stats">
              {STATS.map((s, i) => (
                <div className="cert-v50__stat" key={i}>
                  <span className="cert-v50__stat-value">{s.value}</span>
                  <span className="cert-v50__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V51 — Also Certified — Ribbon
// ============================================
function CertCardV51() {
  return (
    <div className="cert-v51">
      <div className="cert-v51__card">
        <div className="cert-v51__ribbon">
          <span>Guimbal G2</span>
        </div>
        <div className="cert-v51__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v51__logo" />
        </div>
        <div className="cert-v51__body">
          <span className="cert-v51__label">{CERT_LABEL}</span>
          <h3 className="cert-v51__title">{CERT_TITLE}</h3>
          <p className="cert-v51__desc">{CERT_DESC}</p>
          <div className="cert-v51__stats">
            {STATS.map((s, i) => (
              <div className="cert-v51__stat" key={i}>
                <span className="cert-v51__stat-value">{s.value}</span>
                <span className="cert-v51__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v51__footer">
          <span>Also certified</span>
          <strong>Guimbal Cabri G2</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V52 — Also Certified — Badge Row
// ============================================
function CertCardV52() {
  return (
    <div className="cert-v52">
      <div className="cert-v52__card">
        <div className="cert-v52__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v52__logo" />
        </div>
        <div className="cert-v52__body">
          <span className="cert-v52__label">{CERT_LABEL}</span>
          <h3 className="cert-v52__title">{CERT_TITLE}</h3>
          <p className="cert-v52__desc">{CERT_DESC}</p>
          <div className="cert-v52__stats">
            {STATS.map((s, i) => (
              <div className="cert-v52__stat" key={i}>
                <span className="cert-v52__stat-value">{s.value}</span>
                <span className="cert-v52__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v52__footer">
          <div className="cert-v52__badge">
            <div className="cert-v52__badge-icon">&#10003;</div>
            <div className="cert-v52__badge-text">
              <strong>Robinson</strong>
              <span>Authorized Service Center</span>
            </div>
          </div>
          <div className="cert-v52__badge-sep"></div>
          <div className="cert-v52__badge">
            <div className="cert-v52__badge-icon">&#10003;</div>
            <div className="cert-v52__badge-text">
              <strong>Guimbal</strong>
              <span>Cabri G2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V53 — Also Certified — Pill Tags
// ============================================
function CertCardV53() {
  return (
    <div className="cert-v53">
      <div className="cert-v53__card">
        <div className="cert-v53__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v53__logo" />
        </div>
        <div className="cert-v53__body">
          <span className="cert-v53__label">{CERT_LABEL}</span>
          <h3 className="cert-v53__title">{CERT_TITLE}</h3>
          <p className="cert-v53__desc">{CERT_DESC}</p>
          <div className="cert-v53__stats">
            {STATS.map((s, i) => (
              <div className="cert-v53__stat" key={i}>
                <span className="cert-v53__stat-value">{s.value}</span>
                <span className="cert-v53__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v53__footer">
          <span className="cert-v53__footer-label">Certified for</span>
          <div className="cert-v53__pills">
            <span className="cert-v53__pill">Robinson R22</span>
            <span className="cert-v53__pill">Robinson R44</span>
            <span className="cert-v53__pill">Robinson R66</span>
            <span className="cert-v53__pill cert-v53__pill--alt">Guimbal Cabri G2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V54 — Also Certified — Glow Strip
// ============================================
function CertCardV54() {
  return (
    <div className="cert-v54">
      <div className="cert-v54__card">
        <div className="cert-v54__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v54__logo" />
        </div>
        <div className="cert-v54__body">
          <span className="cert-v54__label">{CERT_LABEL}</span>
          <h3 className="cert-v54__title">{CERT_TITLE}</h3>
          <p className="cert-v54__desc">{CERT_DESC}</p>
          <div className="cert-v54__stats">
            {STATS.map((s, i) => (
              <div className="cert-v54__stat" key={i}>
                <span className="cert-v54__stat-value">{s.value}</span>
                <span className="cert-v54__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v54__footer">
          <div className="cert-v54__glow-bar"></div>
          <div className="cert-v54__footer-content">
            <span>Also certified</span>
            <strong>Guimbal Cabri G2</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V55 — Also Certified — Split Footer
// ============================================
function CertCardV55() {
  return (
    <div className="cert-v55">
      <div className="cert-v55__card">
        <div className="cert-v55__logo-area">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v55__logo" />
        </div>
        <div className="cert-v55__body">
          <span className="cert-v55__label">{CERT_LABEL}</span>
          <h3 className="cert-v55__title">{CERT_TITLE}</h3>
          <p className="cert-v55__desc">{CERT_DESC}</p>
          <div className="cert-v55__stats">
            {STATS.map((s, i) => (
              <div className="cert-v55__stat" key={i}>
                <span className="cert-v55__stat-value">{s.value}</span>
                <span className="cert-v55__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cert-v55__footer">
          <div className="cert-v55__foot-left">
            <span className="cert-v55__foot-icon">&#9670;</span>
            <div>
              <strong>Robinson</strong>
              <span>R22 &middot; R44 &middot; R66</span>
            </div>
          </div>
          <div className="cert-v55__foot-right">
            <span className="cert-v55__foot-icon">&#9670;</span>
            <div>
              <strong>Guimbal</strong>
              <span>Cabri G2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V56 — Expand → Pill Tags
// ============================================
function CertCardV56() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v56">
      <div className={`cert-v56__card ${expanded ? 'cert-v56__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v56__logos">
          <div className="cert-v56__logo-area">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v56__logo" />
          </div>
          <span className="cert-v56__logos-amp">&amp;</span>
          <div className="cert-v56__guimbal">
            <span className="cert-v56__guimbal-name">GUIMBAL</span>
            <span className="cert-v56__guimbal-sub">Service Center</span>
          </div>
        </div>
        <div className="cert-v56__label-row">
          <span className="cert-v56__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && (
          <div className="cert-v56__expanded">
            <div className="cert-v56__body">
              <h3 className="cert-v56__title">{CERT_TITLE}</h3>
              <p className="cert-v56__desc">{CERT_DESC}</p>
              <span className="cert-v56__label">{CERT_LABEL}</span>
              <div className="cert-v56__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v56__stat" key={i}>
                    <span className="cert-v56__stat-value">{s.value}</span>
                    <span className="cert-v56__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v56__footer">
              <span className="cert-v56__footer-label">Certified for</span>
              <div className="cert-v56__pills">
                <span className="cert-v56__pill">Robinson R22</span>
                <span className="cert-v56__pill">Robinson R44</span>
                <span className="cert-v56__pill">Robinson R66</span>
                <span className="cert-v56__pill">Guimbal Cabri G2</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Shared expanded content for V57–V66
// ============================================
function PillTagsExpanded() {
  return (
    <div className="cert-v56__expanded">
      <div className="cert-v56__body">
        <h3 className="cert-v56__title">{CERT_TITLE}</h3>
        <p className="cert-v56__desc">{CERT_DESC}</p>
        <span className="cert-v56__label">{CERT_LABEL}</span>
        <div className="cert-v56__stats">
          {STATS.map((s, i) => (
            <div className="cert-v56__stat" key={i}>
              <span className="cert-v56__stat-value">{s.value}</span>
              <span className="cert-v56__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="cert-v56__footer">
        <span className="cert-v56__footer-label">Certified for</span>
        <div className="cert-v56__pills">
          <span className="cert-v56__pill">Robinson R22</span>
          <span className="cert-v56__pill">Robinson R44</span>
          <span className="cert-v56__pill">Robinson R66</span>
          <span className="cert-v56__pill">Guimbal Cabri G2</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// V57 — Stacked Center
// ============================================
function CertCardV57() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v57">
      <div className={`cert-v57__card ${expanded ? 'cert-v57__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v57__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v57__logo" />
          <span className="cert-v57__plus">+</span>
          <div className="cert-v57__guimbal">
            <span className="cert-v57__guimbal-name">GUIMBAL</span>
            <span className="cert-v57__guimbal-sub">Cabri G2</span>
          </div>
          <span className="cert-v57__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V58 — Left-Aligned Dual
// ============================================
function CertCardV58() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v58">
      <div className={`cert-v58__card ${expanded ? 'cert-v58__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v58__top">
          <div className="cert-v58__brands">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v58__logo" />
            <div className="cert-v58__guimbal">
              <span className="cert-v58__guimbal-name">Also: GUIMBAL Cabri G2</span>
            </div>
          </div>
          <span className="cert-v58__hint">{expanded ? 'Collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V59 — Inline Bar
// ============================================
function CertCardV59() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v59">
      <div className={`cert-v59__card ${expanded ? 'cert-v59__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v59__bar">
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v59__logo" />
          <span className="cert-v59__amp">&amp;</span>
          <span className="cert-v59__guimbal">GUIMBAL</span>
          <span className="cert-v59__spacer"></span>
          <span className="cert-v59__hint">{expanded ? '\u2715' : 'Details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V60 — Corner Guimbal
// ============================================
function CertCardV60() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v60">
      <div className={`cert-v60__card ${expanded ? 'cert-v60__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v60__corner-badge">GUIMBAL G2</div>
        <div className="cert-v60__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v60__logo" />
          <span className="cert-v60__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V61 — Two Columns
// ============================================
function CertCardV61() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v61">
      <div className={`cert-v61__card ${expanded ? 'cert-v61__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v61__columns">
          <div className="cert-v61__col cert-v61__col--robinson">
            <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v61__logo" />
            <span className="cert-v61__col-label">Authorized Service Center</span>
          </div>
          <div className="cert-v61__col-divider"></div>
          <div className="cert-v61__col cert-v61__col--guimbal">
            <span className="cert-v61__guimbal-name">GUIMBAL</span>
            <span className="cert-v61__col-label">Cabri G2 Certified</span>
          </div>
        </div>
        <div className="cert-v61__hint-row">
          <span className="cert-v61__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V62 — Robinson Hero + Tag
// ============================================
function CertCardV62() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v62">
      <div className={`cert-v62__card ${expanded ? 'cert-v62__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v62__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v62__logo" />
          <div className="cert-v62__below-logo">
            <span className="cert-v62__guimbal-tag">+ Guimbal Cabri G2</span>
            <span className="cert-v62__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V63 — Overlapping
// ============================================
function CertCardV63() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v63">
      <div className={`cert-v63__card ${expanded ? 'cert-v63__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v63__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v63__logo" />
          <div className="cert-v63__overlap">
            <span className="cert-v63__guimbal-name">GUIMBAL</span>
            <span className="cert-v63__guimbal-sub">Service Center</span>
          </div>
        </div>
        <div className="cert-v63__hint-row">
          <span className="cert-v63__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V64 — Top Bar + Logo
// ============================================
function CertCardV64() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v64">
      <div className={`cert-v64__card ${expanded ? 'cert-v64__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v64__top-bar">
          <span className="cert-v64__top-bar-text">Also certified for Guimbal Cabri G2</span>
        </div>
        <div className="cert-v64__main">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v64__logo" />
          <span className="cert-v64__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V65 — Side Badge
// ============================================
function CertCardV65() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v65">
      <div className={`cert-v65__card ${expanded ? 'cert-v65__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v65__side-badge">
          <span>G</span><span>U</span><span>I</span><span>M</span><span>B</span><span>A</span><span>L</span>
        </div>
        <div className="cert-v65__main">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v65__logo" />
          <span className="cert-v65__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V66 — Bracket Layout
// ============================================
function CertCardV66() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v66">
      <div className={`cert-v66__card ${expanded ? 'cert-v66__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v66__top">
          <span className="cert-v66__bracket">[</span>
          <img src={LOGO_SERVICE} alt="Robinson ASC" className="cert-v66__logo" />
          <span className="cert-v66__bracket">]</span>
          <span className="cert-v66__amp">&amp;</span>
          <span className="cert-v66__bracket">[</span>
          <div className="cert-v66__guimbal">
            <span className="cert-v66__guimbal-name">GUIMBAL</span>
            <span className="cert-v66__guimbal-sub">G2</span>
          </div>
          <span className="cert-v66__bracket">]</span>
        </div>
        <div className="cert-v66__hint-row">
          <span className="cert-v66__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V67 — Diagonal Badge
// ============================================
function CertCardV67() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v67">
      <div className={`cert-v67__card ${expanded ? 'cert-v67__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v67__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v67__logo" />
          <div className="cert-v67__badge">
            <span className="cert-v67__badge-name">GUIMBAL</span>
            <span className="cert-v67__badge-sub">G2</span>
          </div>
        </div>
        <span className="cert-v67__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V68 — Underline Accent
// ============================================
function CertCardV68() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v68">
      <div className={`cert-v68__card ${expanded ? 'cert-v68__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v68__top">
          <div className="cert-v68__logo-wrap">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v68__logo" />
            <div className="cert-v68__underline"></div>
          </div>
          <span className="cert-v68__guimbal">&amp; Guimbal G2</span>
        </div>
        <span className="cert-v68__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V69 — Circle Frames
// ============================================
function CertCardV69() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v69">
      <div className={`cert-v69__card ${expanded ? 'cert-v69__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v69__top">
          <div className="cert-v69__circle cert-v69__circle--big">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v69__logo" />
          </div>
          <div className="cert-v69__circle cert-v69__circle--small">
            <span className="cert-v69__guimbal-name">G2</span>
          </div>
        </div>
        <span className="cert-v69__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V70 — Gradient Fade
// ============================================
function CertCardV70() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v70">
      <div className={`cert-v70__card ${expanded ? 'cert-v70__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v70__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v70__logo" />
          <span className="cert-v70__guimbal">GUIMBAL CABRI G2</span>
        </div>
        <span className="cert-v70__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V71 — Tab Headers
// ============================================
function CertCardV71() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v71">
      <div className={`cert-v71__card ${expanded ? 'cert-v71__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v71__tabs">
          <div className="cert-v71__tab cert-v71__tab--active">
            <img src={LOGO_RHC} alt="Robinson" className="cert-v71__tab-logo" />
            <span>Robinson ASC</span>
          </div>
          <div className="cert-v71__tab cert-v71__tab--inactive">
            <span>Guimbal G2</span>
          </div>
        </div>
        <div className="cert-v71__body">
          <span className="cert-v71__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V72 — Stamp Mark
// ============================================
function CertCardV72() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v72">
      <div className={`cert-v72__card ${expanded ? 'cert-v72__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v72__top">
          <div className="cert-v72__stamp">GUIMBAL CERTIFIED</div>
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v72__logo" />
        </div>
        <span className="cert-v72__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V73 — Breadcrumb
// ============================================
function CertCardV73() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v73">
      <div className={`cert-v73__card ${expanded ? 'cert-v73__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v73__breadcrumb">
          <span className="cert-v73__crumb cert-v73__crumb--muted">HQ Aviation</span>
          <span className="cert-v73__chevron">/</span>
          <span className="cert-v73__crumb cert-v73__crumb--primary">Robinson ASC</span>
          <span className="cert-v73__chevron">/</span>
          <span className="cert-v73__crumb cert-v73__crumb--secondary">Guimbal G2</span>
        </div>
        <span className="cert-v73__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V74 — Dots Connector
// ============================================
function CertCardV74() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v74">
      <div className={`cert-v74__card ${expanded ? 'cert-v74__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v74__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v74__logo" />
          <div className="cert-v74__dots">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <div className="cert-v74__guimbal">
            <span className="cert-v74__guimbal-name">GUIMBAL</span>
            <span className="cert-v74__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v74__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V75 — Shield
// ============================================
function CertCardV75() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v75">
      <div className={`cert-v75__card ${expanded ? 'cert-v75__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v75__top">
          <div className="cert-v75__shield">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v75__logo" />
          </div>
          <div className="cert-v75__banner">&amp; Guimbal</div>
        </div>
        <span className="cert-v75__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V76 — Minimal Mono
// ============================================
function CertCardV76() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v76">
      <div className={`cert-v76__card ${expanded ? 'cert-v76__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v76__top">
          <span className="cert-v76__primary">ROBINSON</span>
          <span className="cert-v76__secondary">&amp; guimbal</span>
        </div>
        <span className="cert-v76__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V77 — Glass Card
// ============================================
function CertCardV77() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v77">
      <div className={`cert-v77__card ${expanded ? 'cert-v77__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v77__glass">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v77__logo" />
        </div>
        <span className="cert-v77__etched">Guimbal Cabri G2</span>
        <span className="cert-v77__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V78 — Neon Outline
// ============================================
function CertCardV78() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v78">
      <div className={`cert-v78__card ${expanded ? 'cert-v78__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v78__top">
          <div className="cert-v78__neon cert-v78__neon--bright">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v78__logo" />
          </div>
          <div className="cert-v78__neon cert-v78__neon--dim">
            <span className="cert-v78__guimbal">GUIMBAL G2</span>
          </div>
        </div>
        <span className="cert-v78__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V79 — Split Diagonal
// ============================================
function CertCardV79() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v79">
      <div className={`cert-v79__card ${expanded ? 'cert-v79__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v79__split">
          <div className="cert-v79__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v79__logo" />
          </div>
          <div className="cert-v79__lower">
            <span className="cert-v79__guimbal-name">GUIMBAL</span>
            <span className="cert-v79__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v79__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V80 — Orbit
// ============================================
function CertCardV80() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v80">
      <div className={`cert-v80__card ${expanded ? 'cert-v80__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v80__top">
          <div className="cert-v80__orbit-ring">
            <span className="cert-v80__orbit-text">GUIMBAL CABRI G2</span>
          </div>
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v80__logo" />
        </div>
        <span className="cert-v80__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V81 — Layered Cards
// ============================================
function CertCardV81() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v81">
      <div className={`cert-v81__card ${expanded ? 'cert-v81__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v81__stack">
          <div className="cert-v81__back">
            <span className="cert-v81__back-text">GUIMBAL G2</span>
          </div>
          <div className="cert-v81__front">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v81__logo" />
          </div>
        </div>
        <span className="cert-v81__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V82 — Ticker Tape
// ============================================
function CertCardV82() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v82">
      <div className={`cert-v82__card ${expanded ? 'cert-v82__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v82__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v82__logo" />
        </div>
        <div className="cert-v82__ticker">
          <div className="cert-v82__ticker-track">
            <span>Guimbal Cabri G2 Certified&nbsp;&nbsp;&bull;&nbsp;&nbsp;Guimbal Cabri G2 Certified&nbsp;&nbsp;&bull;&nbsp;&nbsp;Guimbal Cabri G2 Certified&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>
          </div>
        </div>
        <span className="cert-v82__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V83 — Grid Dots
// ============================================
function CertCardV83() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v83">
      <div className={`cert-v83__card ${expanded ? 'cert-v83__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v83__top">
          <div className="cert-v83__dotgrid"></div>
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v83__logo" />
          <div className="cert-v83__guimbal-cell">
            <span className="cert-v83__guimbal-name">GUIMBAL</span>
            <span className="cert-v83__guimbal-sub">G2</span>
          </div>
        </div>
        <span className="cert-v83__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V84 — Perspective Tilt
// ============================================
function CertCardV84() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v84">
      <div className={`cert-v84__card ${expanded ? 'cert-v84__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v84__tilt">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v84__logo" />
        </div>
        <div className="cert-v84__flat">
          <span className="cert-v84__guimbal">Guimbal Cabri G2</span>
        </div>
        <span className="cert-v84__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V85 — Paper Fold
// ============================================
function CertCardV85() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v85">
      <div className={`cert-v85__card ${expanded ? 'cert-v85__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v85__main-face">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v85__logo" />
        </div>
        <div className="cert-v85__fold">
          <span className="cert-v85__fold-text">Guimbal Cabri G2</span>
        </div>
        <span className="cert-v85__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V86 — Waveform
// ============================================
function CertCardV86() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v86">
      <div className={`cert-v86__card ${expanded ? 'cert-v86__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v86__above">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v86__logo" />
        </div>
        <svg className="cert-v86__wave" viewBox="0 0 700 40" preserveAspectRatio="none">
          <path d="M0 20 Q 87.5 0 175 20 T 350 20 T 525 20 T 700 20" fill="none" stroke="rgba(96,165,250,0.25)" strokeWidth="1.5" />
        </svg>
        <div className="cert-v86__below">
          <span className="cert-v86__guimbal-name">GUIMBAL</span>
          <span className="cert-v86__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v86__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V87 — Perspective Float
// ============================================
function CertCardV87() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v87">
      <div className={`cert-v87__card ${expanded ? 'cert-v87__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v87__float-zone">
          <div className="cert-v87__logo-wrapper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v87__logo" />
          </div>
          <div className="cert-v87__shadow" />
        </div>
        <div className="cert-v87__ground">
          <span className="cert-v87__guimbal-name">GUIMBAL</span>
          <span className="cert-v87__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v87__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V88 — Hero Offset
// ============================================
function CertCardV88() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v88">
      <div className={`cert-v88__card ${expanded ? 'cert-v88__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v88__top">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v88__logo" />
          <div className="cert-v88__tag-area">
            <span className="cert-v88__guimbal-tag">+ Guimbal Cabri G2</span>
            <span className="cert-v88__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          </div>
        </div>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V89 — Angular Slice
// ============================================
function CertCardV89() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v89">
      <div className={`cert-v89__card ${expanded ? 'cert-v89__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v89__upper">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v89__logo" />
        </div>
        <div className="cert-v89__lower">
          <span className="cert-v89__guimbal-name">GUIMBAL</span>
          <span className="cert-v89__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v89__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V90 — 3D Rotate
// ============================================
function CertCardV90() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v90">
      <div className={`cert-v90__card ${expanded ? 'cert-v90__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v90__stage">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v90__logo" />
        </div>
        <div className="cert-v90__below">
          <span className="cert-v90__guimbal-name">GUIMBAL</span>
          <span className="cert-v90__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v90__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V91 — Cinematic Wide
// ============================================
function CertCardV91() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v91">
      <div className={`cert-v91__card ${expanded ? 'cert-v91__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v91__letterbox">
          <div className="cert-v91__bar cert-v91__bar--top" />
          <div className="cert-v91__content">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v91__logo" />
            <span className="cert-v91__subtitle">+ Guimbal Cabri G2</span>
          </div>
          <div className="cert-v91__bar cert-v91__bar--bottom" />
        </div>
        <span className="cert-v91__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V92 — Parallax Layers
// ============================================
function CertCardV92() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v92">
      <div className={`cert-v92__card ${expanded ? 'cert-v92__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v92__layers">
          <div className="cert-v92__bg-layer">
            <span className="cert-v92__bg-text">GUIMBAL CABRI G2</span>
          </div>
          <div className="cert-v92__fg-layer">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v92__logo" />
          </div>
        </div>
        <span className="cert-v92__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V93 — Diamond Split
// ============================================
function CertCardV93() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v93">
      <div className={`cert-v93__card ${expanded ? 'cert-v93__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v93__diamond-zone">
          <div className="cert-v93__diamond">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v93__logo" />
          </div>
          <div className="cert-v93__corner-text">
            <span className="cert-v93__guimbal-name">GUIMBAL</span>
            <span className="cert-v93__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v93__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V94 — Isometric
// ============================================
function CertCardV94() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v94">
      <div className={`cert-v94__card ${expanded ? 'cert-v94__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v94__iso-stage">
          <div className="cert-v94__iso-plane">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v94__logo" />
          </div>
        </div>
        <div className="cert-v94__flat-label">
          <span className="cert-v94__guimbal-name">GUIMBAL</span>
          <span className="cert-v94__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v94__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V95 — Hero Gradient Mask
// ============================================
function CertCardV95() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v95">
      <div className={`cert-v95__card ${expanded ? 'cert-v95__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v95__hero">
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v95__logo" />
          <div className="cert-v95__fade-mask" />
        </div>
        <div className="cert-v95__emerge">
          <span className="cert-v95__guimbal-name">GUIMBAL</span>
          <span className="cert-v95__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v95__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V96 — Geometric Frame
// ============================================
function CertCardV96() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v96">
      <div className={`cert-v96__card ${expanded ? 'cert-v96__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v96__frame-zone">
          <svg className="cert-v96__hexagon" viewBox="0 0 200 174" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,0 200,50 200,124 100,174 0,124 0,50" stroke="rgba(96,165,250,0.35)" strokeWidth="1.5" fill="none" />
          </svg>
          <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v96__logo" />
        </div>
        <div className="cert-v96__annotation">
          <span className="cert-v96__guimbal-name">GUIMBAL</span>
          <span className="cert-v96__guimbal-sub">Cabri G2</span>
        </div>
        <span className="cert-v96__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V97 — Hero Tilt Dots (merges cert-62 + cert-79 + cert-84 + cert-83)
// ============================================
function CertCardV97() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v97">
      <div className={`cert-v97__card ${expanded ? 'cert-v97__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v97__dots"></div>
        <div className="cert-v97__split">
          <div className="cert-v97__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v97__guimbal-name">GUIMBAL</span>
            <span className="cert-v97__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V98 — Dealer Split Dots (cert-97 layout for Authorized Dealer)
// ============================================
function CertCardV98() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v98">
      <div className={`cert-v98__card ${expanded ? 'cert-v98__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v98__dots"></div>
        <div className="cert-v98__split">
          <div className="cert-v98__upper">
            <img src={LOGO_DEALER} alt="Robinson Authorized Dealer" className="cert-v98__logo" />
          </div>
        </div>
        <span className="cert-v98__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && (
          <div className="cert-v98__expanded">
            <div className="cert-v98__body">
              <span className="cert-v98__label">Official</span>
              <h3 className="cert-v98__title">Robinson Authorized Dealer</h3>
              <p className="cert-v98__desc">The UK's premier Robinson dealership since 1990. Factory-direct pricing, full warranty support, and expert guidance from purchase to delivery.</p>
              <div className="cert-v98__stats">
                <div className="cert-v98__stat">
                  <span className="cert-v98__stat-value">35+</span>
                  <span className="cert-v98__stat-label">Years</span>
                </div>
                <div className="cert-v98__stat">
                  <span className="cert-v98__stat-value">500+</span>
                  <span className="cert-v98__stat-label">Aircraft Sold</span>
                </div>
                <div className="cert-v98__stat">
                  <span className="cert-v98__stat-value">UK</span>
                  <span className="cert-v98__stat-label">Exclusive</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V99 — Soft Shadow (dark card, big soft shadow)
// ============================================
function CertCardV99() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v99">
      <div className={`cert-v99__card ${expanded ? 'cert-v99__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v99__dots"></div>
        <div className="cert-v97__split">
          <div className="cert-v97__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v97__guimbal-name">GUIMBAL</span>
            <span className="cert-v97__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V100 — Light Card (light bg, dark text)
// ============================================
function CertCardV100() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v100">
      <div className={`cert-v100__card ${expanded ? 'cert-v100__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v100__split">
          <div className="cert-v100__upper">
            <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="cert-v100__logo" />
          </div>
          <div className="cert-v100__lower">
            <span className="cert-v100__guimbal-name">GUIMBAL</span>
            <span className="cert-v100__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v100__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && (
          <div className="cert-v100__expanded">
            <div className="cert-v56__body">
              <h3 className="cert-v100__title">{CERT_TITLE}</h3>
              <p className="cert-v100__desc">{CERT_DESC}</p>
              <span className="cert-v100__label">{CERT_LABEL}</span>
              <div className="cert-v100__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v100__stat" key={i}>
                    <span className="cert-v100__stat-value">{s.value}</span>
                    <span className="cert-v100__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v100__footer">
              <span className="cert-v100__footer-label">Certified for</span>
              <div className="cert-v56__pills">
                <span className="cert-v100__pill">Robinson R22</span>
                <span className="cert-v100__pill">Robinson R44</span>
                <span className="cert-v100__pill">Robinson R66</span>
                <span className="cert-v100__pill">Guimbal Cabri G2</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V101 — Glass Frost
// ============================================
function CertCardV101() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v101">
      <div className={`cert-v101__card ${expanded ? 'cert-v101__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v97__split">
          <div className="cert-v101__upper">
            <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v101__guimbal-name">GUIMBAL</span>
            <span className="cert-v101__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v101__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V102 — Gradient Fade (edges fade out)
// ============================================
function CertCardV102() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v102">
      <div className={`cert-v102__card ${expanded ? 'cert-v102__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v102__dots"></div>
        <div className="cert-v97__split">
          <div className="cert-v97__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v97__guimbal-name">GUIMBAL</span>
            <span className="cert-v97__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V103 — Outline Only (white card, border)
// ============================================
function CertCardV103() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v103">
      <div className={`cert-v103__card ${expanded ? 'cert-v103__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v100__split">
          <div className="cert-v103__upper">
            <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="cert-v100__logo" />
          </div>
          <div className="cert-v100__lower">
            <span className="cert-v100__guimbal-name">GUIMBAL</span>
            <span className="cert-v100__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v103__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && (
          <div className="cert-v100__expanded">
            <div className="cert-v56__body">
              <h3 className="cert-v100__title">{CERT_TITLE}</h3>
              <p className="cert-v100__desc">{CERT_DESC}</p>
              <span className="cert-v100__label">{CERT_LABEL}</span>
              <div className="cert-v100__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v100__stat" key={i}>
                    <span className="cert-v100__stat-value">{s.value}</span>
                    <span className="cert-v100__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v100__footer">
              <span className="cert-v100__footer-label">Certified for</span>
              <div className="cert-v56__pills">
                <span className="cert-v100__pill">Robinson R22</span>
                <span className="cert-v100__pill">Robinson R44</span>
                <span className="cert-v100__pill">Robinson R66</span>
                <span className="cert-v100__pill">Guimbal Cabri G2</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V104 — Warm Slate
// ============================================
function CertCardV104() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v104">
      <div className={`cert-v104__card ${expanded ? 'cert-v104__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v99__dots"></div>
        <div className="cert-v97__split">
          <div className="cert-v97__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v97__guimbal-name">GUIMBAL</span>
            <span className="cert-v97__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V105 — Navy Deep
// ============================================
function CertCardV105() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v105">
      <div className={`cert-v105__card ${expanded ? 'cert-v105__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v99__dots"></div>
        <div className="cert-v97__split">
          <div className="cert-v97__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v97__guimbal-name">GUIMBAL</span>
            <span className="cert-v97__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V106 — Elevated White (white card, layered shadows)
// ============================================
function CertCardV106() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v106">
      <div className={`cert-v106__card ${expanded ? 'cert-v106__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v100__split">
          <div className="cert-v106__upper">
            <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="cert-v100__logo" />
          </div>
          <div className="cert-v100__lower">
            <span className="cert-v100__guimbal-name">GUIMBAL</span>
            <span className="cert-v100__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v106__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && (
          <div className="cert-v100__expanded">
            <div className="cert-v56__body">
              <h3 className="cert-v100__title">{CERT_TITLE}</h3>
              <p className="cert-v100__desc">{CERT_DESC}</p>
              <span className="cert-v100__label">{CERT_LABEL}</span>
              <div className="cert-v100__stats">
                {STATS.map((s, i) => (
                  <div className="cert-v100__stat" key={i}>
                    <span className="cert-v100__stat-value">{s.value}</span>
                    <span className="cert-v100__stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cert-v100__footer">
              <span className="cert-v100__footer-label">Certified for</span>
              <div className="cert-v56__pills">
                <span className="cert-v100__pill">Robinson R22</span>
                <span className="cert-v100__pill">Robinson R44</span>
                <span className="cert-v100__pill">Robinson R66</span>
                <span className="cert-v100__pill">Guimbal Cabri G2</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// V107 — Border Gradient (dark card, gradient border)
// ============================================
function CertCardV107() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v107">
      <div className="cert-v107__border">
        <div className={`cert-v107__card ${expanded ? 'cert-v107__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
          <div className="cert-v99__dots"></div>
          <div className="cert-v97__split">
            <div className="cert-v97__upper">
              <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
            </div>
            <div className="cert-v97__lower">
              <span className="cert-v97__guimbal-name">GUIMBAL</span>
              <span className="cert-v97__guimbal-sub">Cabri G2</span>
            </div>
          </div>
          <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          {expanded && <PillTagsExpanded />}
        </div>
      </div>
    </div>
  );
}

// ============================================
// V108 — Charcoal Soft
// ============================================
function CertCardV108() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="cert-v108">
      <div className={`cert-v108__card ${expanded ? 'cert-v108__card--expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <div className="cert-v99__dots"></div>
        <div className="cert-v97__split">
          <div className="cert-v97__upper">
            <img src={LOGO_SERVICE} alt="Robinson Authorized Service Center" className="cert-v97__logo" />
          </div>
          <div className="cert-v97__lower">
            <span className="cert-v97__guimbal-name">GUIMBAL</span>
            <span className="cert-v97__guimbal-sub">Cabri G2</span>
          </div>
        </div>
        <span className="cert-v97__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
        {expanded && <PillTagsExpanded />}
      </div>
    </div>
  );
}

// ============================================
// V109–V118: Light frost variations (cert-101 slightly darker + cert-103 border + dots)
// ============================================
function LightFrostCard({ className, children }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

function makeLightFrostV(num) {
  return function LightFrostVariation() {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className={`cert-v${num}`}>
        <div className={`cert-v${num}__card ${expanded ? `cert-v${num}__card--expanded` : ''}`} onClick={() => setExpanded(!expanded)}>
          <div className="cert-light__dots"></div>
          <div className="cert-v100__split">
            <div className="cert-light__upper">
              <img src={LOGO_SERVICE_BLACK} alt="Robinson Authorized Service Center" className="cert-v100__logo" />
            </div>
            <div className="cert-v100__lower">
              <span className="cert-v100__guimbal-name">GUIMBAL</span>
              <span className="cert-v100__guimbal-sub">Cabri G2</span>
            </div>
          </div>
          <span className="cert-v100__hint">{expanded ? 'Click to collapse' : 'See details \u2192'}</span>
          {expanded && (
            <div className="cert-v100__expanded">
              <div className="cert-v56__body">
                <h3 className="cert-v100__title">{CERT_TITLE}</h3>
                <p className="cert-v100__desc">{CERT_DESC}</p>
                <span className="cert-v100__label">{CERT_LABEL}</span>
                <div className="cert-v100__stats">
                  {STATS.map((s, i) => (
                    <div className="cert-v100__stat" key={i}>
                      <span className="cert-v100__stat-value">{s.value}</span>
                      <span className="cert-v100__stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cert-v100__footer">
                <span className="cert-v100__footer-label">Certified for</span>
                <div className="cert-v56__pills">
                  <span className="cert-v100__pill">Robinson R22</span>
                  <span className="cert-v100__pill">Robinson R44</span>
                  <span className="cert-v100__pill">Robinson R66</span>
                  <span className="cert-v100__pill">Guimbal Cabri G2</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
}

const CertCardV109 = makeLightFrostV(109);
const CertCardV110 = makeLightFrostV(110);
const CertCardV111 = makeLightFrostV(111);
const CertCardV112 = makeLightFrostV(112);
const CertCardV113 = makeLightFrostV(113);
const CertCardV114 = makeLightFrostV(114);
const CertCardV115 = makeLightFrostV(115);
const CertCardV116 = makeLightFrostV(116);
const CertCardV117 = makeLightFrostV(117);
const CertCardV118 = makeLightFrostV(118);

// ============================================
// VARIATION MAP
// ============================================

const CERT_CARDS = {
  'cert-1': CertCardV1,
  'cert-2': CertCardV2,
  'cert-3': CertCardV3,
  'cert-4': CertCardV4,
  'cert-5': CertCardV5,
  'cert-6': CertCardV6,
  'cert-7': CertCardV7,
  'cert-8': CertCardV8,
  'cert-9': CertCardV9,
  'cert-10': CertCardV10,
  'cert-11': CertCardV11,
  'cert-12': CertCardV12,
  'cert-13': CertCardV13,
  'cert-14': CertCardV14,
  'cert-15': CertCardV15,
  'cert-16': CertCardV16,
  'cert-17': CertCardV17,
  'cert-18': CertCardV18,
  'cert-19': CertCardV19,
  'cert-20': CertCardV20,
  'cert-21': CertCardV21,
  'cert-22': CertCardV22,
  'cert-23': CertCardV23,
  'cert-24': CertCardV24,
  'cert-25': CertCardV25,
  'cert-26': CertCardV26,
  'cert-27': CertCardV27,
  'cert-28': CertCardV28,
  'cert-29': CertCardV29,
  'cert-30': CertCardV30,
  'cert-31': CertCardV31,
  'cert-32': CertCardV32,
  'cert-33': CertCardV33,
  'cert-34': CertCardV34,
  'cert-35': CertCardV35,
  'cert-36': CertCardV36,
  'cert-37': CertCardV37,
  'cert-38': CertCardV38,
  'cert-39': CertCardV39,
  'cert-40': CertCardV40,
  'cert-41': CertCardV41,
  'cert-42': CertCardV42,
  'cert-43': CertCardV43,
  'cert-44': CertCardV44,
  'cert-45': CertCardV45,
  'cert-46': CertCardV46,
  'cert-47': CertCardV47,
  'cert-48': CertCardV48,
  'cert-49': CertCardV49,
  'cert-50': CertCardV50,
  'cert-51': CertCardV51,
  'cert-52': CertCardV52,
  'cert-53': CertCardV53,
  'cert-54': CertCardV54,
  'cert-55': CertCardV55,
  'cert-56': CertCardV56,
  'cert-57': CertCardV57,
  'cert-58': CertCardV58,
  'cert-59': CertCardV59,
  'cert-60': CertCardV60,
  'cert-61': CertCardV61,
  'cert-62': CertCardV62,
  'cert-63': CertCardV63,
  'cert-64': CertCardV64,
  'cert-65': CertCardV65,
  'cert-66': CertCardV66,
  'cert-67': CertCardV67,
  'cert-68': CertCardV68,
  'cert-69': CertCardV69,
  'cert-70': CertCardV70,
  'cert-71': CertCardV71,
  'cert-72': CertCardV72,
  'cert-73': CertCardV73,
  'cert-74': CertCardV74,
  'cert-75': CertCardV75,
  'cert-76': CertCardV76,
  'cert-77': CertCardV77,
  'cert-78': CertCardV78,
  'cert-79': CertCardV79,
  'cert-80': CertCardV80,
  'cert-81': CertCardV81,
  'cert-82': CertCardV82,
  'cert-83': CertCardV83,
  'cert-84': CertCardV84,
  'cert-85': CertCardV85,
  'cert-86': CertCardV86,
  'cert-87': CertCardV87,
  'cert-88': CertCardV88,
  'cert-89': CertCardV89,
  'cert-90': CertCardV90,
  'cert-91': CertCardV91,
  'cert-92': CertCardV92,
  'cert-93': CertCardV93,
  'cert-94': CertCardV94,
  'cert-95': CertCardV95,
  'cert-96': CertCardV96,
  'cert-97': CertCardV97,
  'cert-98': CertCardV98,
  'cert-99': CertCardV99,
  'cert-100': CertCardV100,
  'cert-101': CertCardV101,
  'cert-102': CertCardV102,
  'cert-103': CertCardV103,
  'cert-104': CertCardV104,
  'cert-105': CertCardV105,
  'cert-106': CertCardV106,
  'cert-107': CertCardV107,
  'cert-108': CertCardV108,
  'cert-109': CertCardV109,
  'cert-110': CertCardV110,
  'cert-111': CertCardV111,
  'cert-112': CertCardV112,
  'cert-113': CertCardV113,
  'cert-114': CertCardV114,
  'cert-115': CertCardV115,
  'cert-116': CertCardV116,
  'cert-117': CertCardV117,
  'cert-118': CertCardV118,
};

// ============================================
// PAGE COMPONENT
// ============================================

export default function AuthorisedServiceCenterCard() {
  const [variation, setVariation] = useState('cert-1');
  const handleSelect = useCallback((item) => setVariation(item.id), []);

  const CardComponent = CERT_CARDS[variation];

  return (
    <>
      <style>{certStyles}</style>
      <div className="cert-page">
        <div className="cert-page__preview">
          {CardComponent && <CardComponent />}
        </div>
      </div>
      <Picker
        sections={certSections}
        tabs={certTabs}
        storageKey="cert-card-picker-favorites"
        title="Cert Card Picker"
        onItemSelect={handleSelect}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const certStyles = `
  /* ===== PAGE LAYOUT ===== */
  .cert-page {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .cert-page__preview {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: center;
  }

  /* ===== SHARED / BASE CERT STYLES (from Experimentation maint-16) ===== */
  .fd-cert__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    max-width: 900px;
    width: 100%;
  }

  .fd-cert__glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(201, 162, 39, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }

  .fd-cert__glow--blue {
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.12) 0%, transparent 50%);
  }

  .fd-cert__content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 3rem;
    padding: 2.5rem 3rem;
  }

  .fd-cert__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .fd-cert__logo {
    height: 80px;
    width: auto;
    display: block;
  }

  .fd-cert__info {
    flex: 1;
  }

  .fd-cert__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c9a227;
    background: rgba(201, 162, 39, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .fd-cert__card--service .fd-cert__label {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
  }

  .fd-cert__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .fd-cert__desc {
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 1.5rem;
    max-width: 500px;
  }

  .fd-cert__stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .fd-cert__stat {
    text-align: center;
  }

  .fd-cert__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }

  .fd-cert__stat-label {
    display: block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.25rem;
  }

  .fd-cert__stat-divider {
    width: 1px;
    height: 30px;
    background: rgba(255, 255, 255, 0.2);
  }

  .fd-cert__also {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.5rem;
    background: #2a2a2a;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .fd-cert__also-label {
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.35);
  }

  .fd-cert__also-item {
    font-size: 0.6rem;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.55);
  }

  @media (max-width: 768px) {
    .fd-cert__content {
      flex-direction: column;
      text-align: center;
      padding: 2rem;
      gap: 1.5rem;
    }
    .fd-cert__desc { max-width: none; }
    .fd-cert__stats { justify-content: center; }
  }

  /* ===== V1 — Horizontal Classic ===== */
  .cert-v1 {
    width: 100%;
    max-width: 900px;
    display: flex;
    justify-content: center;
  }

  /* ===== V2 — Vertical Stack ===== */
  .cert-v2 {
    width: 100%;
    max-width: 500px;
  }

  .cert-v2__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v2__logo-area {
    padding: 2.5rem 2rem 1.5rem;
    display: flex;
    justify-content: center;
  }

  .cert-v2__logo {
    height: 90px;
    width: auto;
  }

  .cert-v2__body {
    padding: 0 2.5rem 2rem;
  }

  .cert-v2__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v2__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v2__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 1.5rem;
  }

  .cert-v2__stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v2__stat { text-align: center; }

  .cert-v2__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v2__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 0.2rem;
  }

  .cert-v2__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem;
    background: #2a2a2a;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.05em;
  }

  .cert-v2__footer strong {
    color: rgba(255, 255, 255, 0.6);
  }

  /* ===== V3 — Split 50/50 ===== */
  .cert-v3 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v3__card {
    display: flex;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    min-height: 280px;
  }

  .cert-v3__left {
    flex: 1;
    background: #111;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
  }

  .cert-v3__logo {
    height: 90px;
    width: auto;
  }

  .cert-v3__left-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v3__right {
    flex: 1;
    background: #2d2d2d;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cert-v3__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v3__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 1.5rem;
  }

  .cert-v3__stats {
    display: flex;
    gap: 1.5rem;
  }

  .cert-v3__stat { text-align: center; }

  .cert-v3__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v3__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
  }

  .cert-v3__bar {
    background: #1a1a1a;
    padding: 0.5rem 1.5rem;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.05em;
    text-align: center;
    border-radius: 0 0 12px 12px;
  }

  @media (max-width: 640px) {
    .cert-v3__card { flex-direction: column; }
  }

  /* ===== V4 — Wide Banner ===== */
  .cert-v4 {
    width: 100%;
    max-width: 1200px;
  }

  .cert-v4__card {
    display: flex;
    align-items: center;
    gap: 2rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    padding: 1rem 2rem;
    min-height: 90px;
  }

  .cert-v4__logo-area {
    flex-shrink: 0;
  }

  .cert-v4__logo {
    height: 55px;
    width: auto;
  }

  .cert-v4__info {
    flex: 1;
    min-width: 0;
  }

  .cert-v4__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cert-v4__desc {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cert-v4__stats {
    display: flex;
    gap: 1.5rem;
    flex-shrink: 0;
  }

  .cert-v4__stat { text-align: center; }

  .cert-v4__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v4__stat-label {
    display: block;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
  }

  .cert-v4__badge {
    flex-shrink: 0;
    padding: 0.4rem 0.8rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
  }

  .cert-v4__badge-label {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    .cert-v4__card {
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1.5rem;
    }
    .cert-v4__info { flex-basis: 100%; order: 2; }
    .cert-v4__title, .cert-v4__desc { white-space: normal; }
  }

  /* ===== V5 — Card + Sidebar ===== */
  .cert-v5 {
    display: flex;
    gap: 1rem;
    max-width: 900px;
    width: 100%;
  }

  .cert-v5__main {
    flex: 1;
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
  }

  .cert-v5__glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.12) 0%, transparent 50%);
    pointer-events: none;
  }

  .cert-v5__content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2.5rem;
  }

  .cert-v5__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v5__logo {
    height: 70px;
    width: auto;
  }

  .cert-v5__info { flex: 1; }

  .cert-v5__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v5__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .cert-v5__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
  }

  .cert-v5__sidebar {
    width: 140px;
    flex-shrink: 0;
    background: linear-gradient(180deg, #1a1a1a 0%, #222 100%);
    border-radius: 12px;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .cert-v5__sidebar-stat { text-align: center; }

  .cert-v5__sidebar-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v5__sidebar-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
  }

  .cert-v5__sidebar-badge {
    padding: 0.4rem 0.8rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-top: auto;
  }

  @media (max-width: 640px) {
    .cert-v5 { flex-direction: column; }
    .cert-v5__sidebar {
      width: 100%;
      flex-direction: row;
      justify-content: center;
      padding: 1rem;
    }
    .cert-v5__content { flex-direction: column; text-align: center; }
  }

  /* ===== V6 — Glass Morphism ===== */
  .cert-v6 {
    width: 100%;
    max-width: 900px;
    padding: 3rem;
    background: linear-gradient(135deg, #1a0533 0%, #0a1628 50%, #1a0533 100%);
    border-radius: 20px;
  }

  .cert-v6__card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .cert-v6__content {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    padding: 2.5rem;
  }

  .cert-v6__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v6__logo {
    height: 80px;
    width: auto;
  }

  .cert-v6__info { flex: 1; }

  .cert-v6__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #a78bfa;
    background: rgba(167, 139, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v6__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v6__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.5rem;
  }

  .cert-v6__stats {
    display: flex;
    gap: 2rem;
  }

  .cert-v6__stat { text-align: center; }

  .cert-v6__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v6__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v6__footer {
    padding: 0.6rem;
    text-align: center;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v6 { padding: 1.5rem; }
    .cert-v6__content { flex-direction: column; text-align: center; }
    .cert-v6__stats { justify-content: center; }
  }

  /* ===== V7 — Gold Accent ===== */
  .cert-v7 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v7__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid transparent;
    background-clip: padding-box;
    box-shadow: 0 0 0 2px #c9a227, 0 0 30px rgba(201, 162, 39, 0.15);
  }

  .cert-v7__glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(201, 162, 39, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }

  .cert-v7__content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 2.5rem;
    padding: 2.5rem 3rem;
  }

  .cert-v7__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: rgba(201, 162, 39, 0.08);
    border-radius: 8px;
    border: 1px solid rgba(201, 162, 39, 0.2);
  }

  .cert-v7__logo {
    height: 80px;
    width: auto;
  }

  .cert-v7__info { flex: 1; }

  .cert-v7__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c9a227;
    background: rgba(201, 162, 39, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v7__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v7__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 1.5rem;
  }

  .cert-v7__stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cert-v7__stat { text-align: center; }

  .cert-v7__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #c9a227;
  }

  .cert-v7__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
  }

  .cert-v7__divider {
    width: 1px;
    height: 28px;
    background: rgba(201, 162, 39, 0.3);
  }

  .cert-v7__footer {
    padding: 0.6rem;
    text-align: center;
    font-size: 0.6rem;
    color: rgba(201, 162, 39, 0.5);
    border-top: 1px solid rgba(201, 162, 39, 0.15);
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v7__content { flex-direction: column; text-align: center; padding: 2rem; }
    .cert-v7__stats { justify-content: center; }
  }

  /* ===== V8 — Light Mode ===== */
  .cert-v8 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v8__card {
    background: #f8f8f8;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  }

  .cert-v8__content {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    padding: 2.5rem 3rem;
  }

  .cert-v8__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
  }

  .cert-v8__logo {
    height: 80px;
    width: auto;
  }

  .cert-v8__info { flex: 1; }

  .cert-v8__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #2563eb;
    background: rgba(37, 99, 235, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v8__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.75rem;
  }

  .cert-v8__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: #666;
    margin: 0 0 1.5rem;
  }

  .cert-v8__stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cert-v8__stat { text-align: center; }

  .cert-v8__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .cert-v8__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #999;
  }

  .cert-v8__divider {
    width: 1px;
    height: 28px;
    background: #ddd;
  }

  .cert-v8__footer {
    padding: 0.6rem;
    text-align: center;
    font-size: 0.6rem;
    color: #999;
    border-top: 1px solid #e5e5e5;
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v8__content { flex-direction: column; text-align: center; padding: 2rem; }
    .cert-v8__stats { justify-content: center; }
  }

  /* ===== V9 — Outlined / Wireframe ===== */
  .cert-v9 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v9__card {
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    overflow: hidden;
    background: transparent;
  }

  .cert-v9__content {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    padding: 2.5rem 3rem;
  }

  .cert-v9__logo-wrap {
    flex-shrink: 0;
  }

  .cert-v9__logo {
    height: 70px;
    width: auto;
    opacity: 0.8;
  }

  .cert-v9__info { flex: 1; }

  .cert-v9__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.75rem;
  }

  .cert-v9__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v9__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 1.5rem;
  }

  .cert-v9__stats {
    display: flex;
    gap: 2rem;
  }

  .cert-v9__stat { text-align: center; }

  .cert-v9__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }

  .cert-v9__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
  }

  .cert-v9__badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin: 0 2.5rem 1.5rem;
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v9__content { flex-direction: column; text-align: center; padding: 2rem; }
    .cert-v9__stats { justify-content: center; }
    .cert-v9__badge { margin: 0 1.5rem 1.5rem; }
  }

  /* ===== V10 — Gradient Sweep ===== */
  .cert-v10 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v10__card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, #0a1628 0%, #1a0533 50%, #0f0f0f 100%);
    background-size: 200% 200%;
    animation: certGradientSweep 6s ease infinite;
  }

  @keyframes certGradientSweep {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .cert-v10__card:hover {
    animation-duration: 3s;
  }

  .cert-v10__content {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    padding: 2.5rem 3rem;
  }

  .cert-v10__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v10__logo {
    height: 80px;
    width: auto;
  }

  .cert-v10__info { flex: 1; }

  .cert-v10__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #a78bfa;
    background: rgba(167, 139, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v10__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v10__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.5rem;
  }

  .cert-v10__stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cert-v10__stat { text-align: center; }

  .cert-v10__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v10__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v10__divider {
    width: 1px;
    height: 28px;
    background: rgba(255, 255, 255, 0.15);
  }

  .cert-v10__footer {
    padding: 0.6rem;
    text-align: center;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v10__content { flex-direction: column; text-align: center; padding: 2rem; }
    .cert-v10__stats { justify-content: center; }
  }

  /* ===== V11 — Stats Hero ===== */
  .cert-v11 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v11__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
  }

  .cert-v11__stats-hero {
    display: flex;
    justify-content: center;
    gap: 3rem;
    padding: 3rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v11__stat-block {
    text-align: center;
  }

  .cert-v11__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .cert-v11__stat-label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 0.5rem;
  }

  .cert-v11__lower {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 2.5rem;
  }

  .cert-v11__logo {
    height: 50px;
    width: auto;
    flex-shrink: 0;
  }

  .cert-v11__info { flex: 1; }

  .cert-v11__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.4rem;
  }

  .cert-v11__desc {
    font-size: 0.8rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  .cert-v11__footer {
    padding: 0.6rem;
    text-align: center;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v11__stats-hero { gap: 1.5rem; }
    .cert-v11__stat-value { font-size: 1.8rem; }
    .cert-v11__lower { flex-direction: column; text-align: center; }
  }

  /* ===== V12 — Logo Hero ===== */
  .cert-v12 {
    width: 100%;
    max-width: 600px;
  }

  .cert-v12__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v12__logo-hero {
    padding: 3rem 2rem 2rem;
    display: flex;
    justify-content: center;
  }

  .cert-v12__logo {
    height: 150px;
    width: auto;
    transition: transform 0.3s ease;
  }

  .cert-v12__card:hover .cert-v12__logo {
    transform: scale(1.05);
  }

  .cert-v12__caption {
    padding: 0 2.5rem 1.5rem;
  }

  .cert-v12__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 0.4rem;
  }

  .cert-v12__desc {
    font-size: 0.75rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
  }

  .cert-v12__stats-footer {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cert-v12__stat { text-align: center; }

  .cert-v12__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
  }

  .cert-v12__stat-label {
    display: block;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.3);
  }

  /* ===== V13 — Testimonial Embed ===== */
  .cert-v13 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v13__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
  }

  .cert-v13__content {
    display: flex;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 2.5rem 3rem;
  }

  .cert-v13__logo-wrap {
    flex-shrink: 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v13__logo {
    height: 80px;
    width: auto;
  }

  .cert-v13__info { flex: 1; }

  .cert-v13__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v13__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v13__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 1.25rem;
  }

  .cert-v13__quote {
    font-style: italic;
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    border-left: 2px solid rgba(96, 165, 250, 0.4);
    padding: 0.5rem 0 0.5rem 1rem;
    margin: 0 0 1.5rem;
  }

  .cert-v13__quote-mark {
    color: #60a5fa;
    font-size: 1.1rem;
  }

  .cert-v13__stats {
    display: flex;
    gap: 2rem;
  }

  .cert-v13__stat { text-align: center; }

  .cert-v13__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v13__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v13__footer {
    padding: 0.6rem;
    text-align: center;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v13__content { flex-direction: column; text-align: center; padding: 2rem; }
    .cert-v13__stats { justify-content: center; }
    .cert-v13__quote { text-align: left; }
  }

  /* ===== V14 — Multi-Badge ===== */
  .cert-v14 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v14__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
  }

  .cert-v14__badges {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem 2rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v14__badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .cert-v14__badge-logo {
    height: 55px;
    width: auto;
  }

  .cert-v14__badge-item--small {
    transform: scale(0.7);
    opacity: 0.85;
  }

  .cert-v14__badge-item--small .cert-v14__guimbal-text {
    font-size: 0.9rem !important;
  }

  .cert-v14__badge-item span {
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
  }

  .cert-v14__badge-sep {
    width: 1px;
    height: 50px;
    background: rgba(255, 255, 255, 0.12);
  }

  .cert-v14__guimbal-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem !important;
    font-weight: 700;
    color: #fff !important;
    letter-spacing: 0.1em !important;
  }

  .cert-v14__body {
    padding: 2rem 2.5rem 2.5rem;
    text-align: center;
  }

  .cert-v14__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v14__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 auto 1.5rem;
    max-width: 500px;
  }

  .cert-v14__stats {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
  }

  .cert-v14__stat { text-align: center; }

  .cert-v14__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v14__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 640px) {
    .cert-v14__badges { flex-direction: column; gap: 1rem; }
    .cert-v14__badge-sep { width: 50px; height: 1px; }
  }

  /* ===== V15 — Expandable ===== */
  .cert-v15 {
    width: 100%;
    max-width: 700px;
  }

  .cert-v15__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v15__card:hover {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }

  .cert-v15__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v15__logo {
    height: 50px;
    width: auto;
    flex-shrink: 0;
  }

  .cert-v15__compact-info {
    flex: 1;
    min-width: 0;
  }

  .cert-v15__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v15__expand-hint {
    font-size: 0.75rem;
    color: #60a5fa;
    transition: color 0.2s;
  }

  .cert-v15__card:hover .cert-v15__expand-hint {
    color: #93c5fd;
  }

  .cert-v15__details {
    padding: 0 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  @keyframes certExpand {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 500px; }
  }

  .cert-v15__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin: 1.25rem 0 0.75rem;
  }

  .cert-v15__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.25rem;
  }

  .cert-v15__stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .cert-v15__stat { text-align: center; }

  .cert-v15__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v15__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v15__also {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.05em;
  }

  /* ===== V16 — Asymmetric ===== */
  .cert-v16 {
    width: 100%;
    max-width: 800px;
  }

  .cert-v16__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: visible;
    padding: 2.5rem;
    min-height: 260px;
  }

  .cert-v16__logo-float {
    position: absolute;
    top: -20px;
    right: -10px;
    padding: 1rem;
    background: #222;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 2;
  }

  .cert-v16__logo {
    height: 70px;
    width: auto;
  }

  .cert-v16__body {
    max-width: 60%;
    padding-top: 1rem;
  }

  .cert-v16__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v16__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v16__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .cert-v16__scattered-stats {
    position: relative;
    margin-top: 2rem;
  }

  .cert-v16__sstat {
    display: inline-block;
    text-align: center;
    margin-right: 2.5rem;
  }

  .cert-v16__sstat--1 { transform: translateY(0); }
  .cert-v16__sstat--2 { transform: translateY(8px); }
  .cert-v16__sstat--3 { transform: translateY(-4px); }

  .cert-v16__sstat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v16__sstat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v16__guimbal {
    position: absolute;
    bottom: 1rem;
    right: 1.5rem;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .cert-v16__logo-float { position: static; margin-bottom: 1rem; display: inline-block; }
    .cert-v16__body { max-width: 100%; padding-top: 0; }
    .cert-v16__guimbal { position: static; margin-top: 1rem; }
  }

  /* ===== V17 — Full Bleed Photo ===== */
  .cert-v17 {
    width: 100%;
    max-width: 900px;
  }

  .cert-v17__card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    min-height: 350px;
    display: flex;
    align-items: flex-end;
  }

  .cert-v17__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%);
  }

  .cert-v17__content {
    position: relative;
    z-index: 1;
    padding: 2.5rem;
    width: 100%;
  }

  .cert-v17__logo {
    height: 60px;
    width: auto;
    margin-bottom: 1rem;
  }

  .cert-v17__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }

  .cert-v17__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .cert-v17__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 1.5rem;
    max-width: 500px;
  }

  .cert-v17__stats {
    display: flex;
    gap: 2rem;
  }

  .cert-v17__stat { text-align: center; }

  .cert-v17__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v17__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
  }

  /* ===== V18 — Mono Type ===== */
  .cert-v18 {
    width: 100%;
    max-width: 700px;
  }

  .cert-v18__card {
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    padding: 3rem;
    text-align: center;
  }

  .cert-v18__hero-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.15em;
    line-height: 1;
  }

  .cert-v18__subtitle {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(0.7rem, 1.5vw, 1rem);
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }

  .cert-v18__divider {
    width: 60px;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 2rem auto;
  }

  .cert-v18__desc {
    font-size: 0.85rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 auto 2rem;
    max-width: 450px;
  }

  .cert-v18__stats {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v18__stat { text-align: center; }

  .cert-v18__stat-value {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v18__stat-label {
    display: block;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 0.25rem;
  }

  .cert-v18__footer {
    margin-top: 1.5rem;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  /* ===== V19 — Badge / Seal ===== */
  .cert-v19 {
    display: flex;
    justify-content: center;
  }

  .cert-v19__seal {
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 3px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.05), 0 0 0 12px rgba(255, 255, 255, 0.03);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .cert-v19__ring {
    position: absolute;
    inset: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }

  .cert-v19__ring-text {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.45rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: rgba(255, 255, 255, 0.25);
    white-space: nowrap;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cert-v19__center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .cert-v19__logo {
    height: 80px;
    width: auto;
  }

  .cert-v19__center-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.15em;
  }

  .cert-v19__details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .cert-v19__stats {
    display: flex;
    gap: 0.75rem;
  }

  .cert-v19__detail-stat {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.5);
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .cert-v19__guimbal {
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.05em;
  }

  /* ===== V20 — Dark Terminal ===== */
  .cert-v20 {
    width: 100%;
    max-width: 700px;
  }

  .cert-v20__terminal {
    background: #0a0a0a;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #333;
    font-family: 'Share Tech Mono', monospace;
  }

  .cert-v20__header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: #1a1a1a;
    border-bottom: 1px solid #333;
  }

  .cert-v20__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .cert-v20__dot--red { background: #ff5f56; }
  .cert-v20__dot--yellow { background: #ffbd2e; }
  .cert-v20__dot--green { background: #27c93f; }

  .cert-v20__header-text {
    margin-left: 8px;
    font-size: 0.7rem;
    color: #666;
  }

  .cert-v20__body {
    padding: 1.5rem;
  }

  .cert-v20__line {
    font-size: 0.8rem;
    color: #00ff41;
    line-height: 1.8;
  }

  .cert-v20__line--dim {
    color: #00ff4180;
  }

  .cert-v20__key {
    color: #666;
  }

  .cert-v20__ok {
    color: #27c93f;
    background: rgba(39, 201, 63, 0.1);
    padding: 0 0.4rem;
    border-radius: 3px;
  }

  .cert-v20__divider {
    height: 1px;
    background: #222;
    margin: 0.5rem 0;
  }

  .cert-v20__prompt {
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #666;
  }

  .cert-v20__cursor {
    color: #00ff41;
    animation: certBlink 1s infinite;
  }

  @keyframes certBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* ===== SHARED EXPANDABLE HELPERS ===== */
  .cert-expandable-hint {
    font-size: 0.75rem;
    color: #60a5fa;
    transition: color 0.2s;
  }

  @keyframes certFadeScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes certSlideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ===== V21 — Pill Compact ===== */
  .cert-v21 { width: 100%; max-width: 700px; }

  .cert-v21__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 50px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s ease;
  }

  .cert-v21__card--expanded {
    border-radius: 12px;
  }

  .cert-v21__pill {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
  }

  .cert-v21__logo { height: 35px; width: auto; flex-shrink: 0; }

  .cert-v21__pill-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cert-v21__hint {
    font-size: 0.7rem;
    color: #60a5fa;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cert-v21__details {
    padding: 0.5rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v21__desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 1.25rem;
  }

  .cert-v21__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v21__stat { text-align: center; }
  .cert-v21__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v21__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v21__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); letter-spacing: 0.05em; }

  /* ===== V22 — Icon-Only Compact ===== */
  .cert-v22 { width: 100%; max-width: 700px; }

  .cert-v22__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v22__icon-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .cert-v22__logo { height: 55px; width: auto; }

  .cert-v22__hint {
    font-size: 0.7rem;
    color: #60a5fa;
    position: absolute;
    bottom: 8px;
    right: 12px;
  }

  .cert-v22__card { position: relative; }

  .cert-v22__details {
    padding: 0 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
    text-align: center;
  }

  .cert-v22__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin: 1.25rem 0 0.75rem;
  }

  .cert-v22__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v22__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v22__stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem; }
  .cert-v22__stat { text-align: center; }
  .cert-v22__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v22__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v22__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V23 — Ticker Compact ===== */
  .cert-v23 { width: 100%; max-width: 700px; }

  .cert-v23__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v23__ticker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
  }

  .cert-v23__ticker-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.05em;
  }

  .cert-v23__hint { font-size: 0.7rem; color: #60a5fa; white-space: nowrap; flex-shrink: 0; margin-left: 1rem; }

  .cert-v23__details {
    padding: 1.5rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v23__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .cert-v23__logo { height: 50px; width: auto; flex-shrink: 0; }

  .cert-v23__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v23__label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #60a5fa;
  }

  .cert-v23__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v23__stats { display: flex; gap: 2rem; }
  .cert-v23__stat { text-align: center; }
  .cert-v23__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v23__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  /* ===== V24 — Notification Compact ===== */
  .cert-v24 { width: 100%; max-width: 500px; }

  .cert-v24__card {
    background: linear-gradient(135deg, #1a2332 0%, #1e293b 100%);
    border-radius: 12px;
    border: 1px solid rgba(96, 165, 250, 0.2);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v24__toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
  }

  .cert-v24__toast-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .cert-v24__toast-text {
    flex: 1;
    min-width: 0;
  }

  .cert-v24__toast-text strong {
    display: block;
    font-size: 0.8rem;
    color: #fff;
    font-weight: 600;
  }

  .cert-v24__toast-text span {
    display: block;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .cert-v24__hint {
    font-size: 0.7rem;
    color: #60a5fa;
    flex-shrink: 0;
  }

  .cert-v24__details {
    padding: 0.5rem 1.25rem 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v24__desc { font-size: 0.8rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1rem; }
  .cert-v24__stats { display: flex; gap: 1.5rem; margin-bottom: 0.75rem; }
  .cert-v24__stat { text-align: center; }
  .cert-v24__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1rem; font-weight: 700; color: #fff; }
  .cert-v24__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v24__also { font-size: 0.6rem; color: rgba(255, 255, 255, 0.3); }

  /* ===== V25 — Split-Reveal Compact ===== */
  .cert-v25 { width: 100%; max-width: 700px; }

  .cert-v25__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v25__halves {
    display: flex;
    align-items: stretch;
  }

  .cert-v25__left {
    flex: 0 0 auto;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v25__logo { height: 45px; width: auto; }

  .cert-v25__right {
    flex: 1;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cert-v25__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v25__hint { font-size: 0.7rem; color: #60a5fa; }

  .cert-v25__reveal {
    padding: 1.5rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v25__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v25__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v25__stat { text-align: center; }
  .cert-v25__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v25__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v25__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V26 — Slide Down ===== */
  .cert-v26 { width: 100%; max-width: 700px; }

  .cert-v26__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
  }

  .cert-v26__bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v26__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v26__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v26__hint { font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); flex-shrink: 0; }

  .cert-v26__slide {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
  }

  .cert-v26__slide--open {
    max-height: 500px;
  }

  .cert-v26__content {
    padding: 1rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v26__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v26__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v26__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v26__stat { text-align: center; }
  .cert-v26__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v26__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v26__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V27 — Fade & Scale ===== */
  .cert-v27 { width: 100%; max-width: 700px; }

  .cert-v27__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v27__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v27__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v27__logo { height: 50px; width: auto; flex-shrink: 0; }

  .cert-v27__compact-info { flex: 1; min-width: 0; }

  .cert-v27__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v27__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v27__details {
    padding: 0 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.4s ease;
  }

  .cert-v27__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin: 1.25rem 0 0.75rem;
  }

  .cert-v27__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v27__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v27__stat { text-align: center; }
  .cert-v27__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v27__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v27__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V28 — Flip Reveal ===== */
  .cert-v28 { width: 100%; max-width: 700px; perspective: 1200px; }

  .cert-v28__card {
    position: relative;
    min-height: 200px;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.6s ease;
  }

  .cert-v28__card--flipped { transform: rotateY(180deg); }

  .cert-v28__front, .cert-v28__back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
  }

  .cert-v28__front {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .cert-v28__back {
    transform: rotateY(180deg);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cert-v28__logo { height: 55px; width: auto; }

  .cert-v28__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .cert-v28__hint { font-size: 0.75rem; color: #60a5fa; }
  .cert-v28__back-hint { font-size: 0.7rem; color: #60a5fa; text-align: center; margin-top: 0.75rem; }

  .cert-v28__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.5rem;
  }

  .cert-v28__desc { font-size: 0.8rem; line-height: 1.5; color: rgba(255, 255, 255, 0.6); margin: 0 0 1rem; }
  .cert-v28__stats { display: flex; gap: 1.5rem; margin-bottom: 0.75rem; }
  .cert-v28__stat { text-align: center; }
  .cert-v28__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cert-v28__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v28__also { font-size: 0.6rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V29 — Accordion Stack ===== */
  .cert-v29 { width: 100%; max-width: 700px; }

  .cert-v29__card {
    border-radius: 12px;
    overflow: hidden;
  }

  .cert-v29__panel {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v29__panel:last-child { border-bottom: none; }

  .cert-v29__panel-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    cursor: pointer;
    transition: background 0.2s;
  }

  .cert-v29__panel-bar:hover { background: linear-gradient(135deg, #222 0%, #333 100%); }

  .cert-v29__panel-bar span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
  }

  .cert-v29__arrow { font-size: 0.7rem; color: rgba(255, 255, 255, 0.4); }

  .cert-v29__panel-content {
    background: #181818;
    animation: certExpand 0.3s ease;
  }

  .cert-v29__section-body { padding: 1.25rem 1.5rem; }

  .cert-v29__logo { height: 45px; width: auto; margin-bottom: 0.75rem; }

  .cert-v29__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .cert-v29__desc { font-size: 0.8rem; line-height: 1.5; color: rgba(255, 255, 255, 0.6); margin: 0; }
  .cert-v29__stats { display: flex; gap: 2rem; }
  .cert-v29__stat { text-align: center; }
  .cert-v29__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v29__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  .cert-v29__cert-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cert-v29__cert-item {
    padding: 0.5rem 1rem;
    background: rgba(96, 165, 250, 0.08);
    border-radius: 6px;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    border-left: 3px solid #60a5fa;
  }

  /* ===== V30 — Morph Expand ===== */
  .cert-v30 { width: 100%; max-width: 700px; }

  .cert-v30__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 50px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    width: 320px;
    margin: 0 auto;
  }

  .cert-v30__card--expanded {
    border-radius: 12px;
    width: 100%;
  }

  .cert-v30__bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
  }

  .cert-v30__logo { height: 30px; width: auto; flex-shrink: 0; }

  .cert-v30__bar-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cert-v30__hint { font-size: 0.8rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v30__expanded {
    padding: 0.5rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.3s ease;
  }

  .cert-v30__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v30__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v30__stat { text-align: center; }
  .cert-v30__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v30__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v30__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V31 — Expand → Horizontal ===== */
  .cert-v31 { width: 100%; max-width: 800px; }

  .cert-v31__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v31__compact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v31__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v31__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v31__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v31__horizontal {
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v31__left {
    flex: 0 0 200px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02);
  }

  .cert-v31__right { flex: 1; padding: 2rem; }

  .cert-v31__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v31__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1rem; }
  .cert-v31__stats { display: flex; gap: 1.5rem; }
  .cert-v31__stat { text-align: center; }
  .cert-v31__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cert-v31__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v31__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); margin-top: 1rem; }

  @media (max-width: 640px) {
    .cert-v31__horizontal { flex-direction: column; }
    .cert-v31__left { flex: none; border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
  }

  /* ===== V32 — Expand → Grid ===== */
  .cert-v32 { width: 100%; max-width: 700px; }

  .cert-v32__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v32__compact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v32__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v32__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v32__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v32__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.3s ease;
  }

  .cert-v32__cell {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .cert-v32__cell:nth-child(2n) { border-right: none; }
  .cert-v32__cell:nth-child(n+3) { border-bottom: none; }

  .cert-v32__cell-logo { height: 50px; width: auto; }

  .cert-v32__cell-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .cert-v32__cell-desc { font-size: 0.75rem; line-height: 1.5; color: rgba(255, 255, 255, 0.5); margin: 0; }
  .cert-v32__stats { display: flex; gap: 1.5rem; }
  .cert-v32__stat { text-align: center; }
  .cert-v32__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cert-v32__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  .cert-v32__cell--guimbal { background: rgba(255, 255, 255, 0.03); }
  .cert-v32__guimbal-text { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: 0.1em; }
  .cert-v32__guimbal-sub { font-size: 0.6rem; color: rgba(255, 255, 255, 0.4); margin-top: 0.25rem; }

  /* ===== V33 — Expand → Timeline ===== */
  .cert-v33 { width: 100%; max-width: 700px; }

  .cert-v33__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v33__compact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v33__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v33__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v33__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v33__timeline {
    padding: 1.5rem 2rem 2rem 3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
    animation: certExpand 0.3s ease;
  }

  .cert-v33__tl-item {
    position: relative;
    padding: 0 0 1.5rem 1.5rem;
    border-left: 2px solid rgba(96, 165, 250, 0.3);
  }

  .cert-v33__tl-item:last-child { padding-bottom: 0; border-left-color: transparent; }

  .cert-v33__tl-dot {
    position: absolute;
    left: -6px;
    top: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #60a5fa;
    border: 2px solid #1a1a1a;
  }

  .cert-v33__tl-content { display: flex; gap: 0.75rem; align-items: baseline; }
  .cert-v33__tl-year { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; font-weight: 700; color: #60a5fa; min-width: 40px; }
  .cert-v33__tl-event { font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); }

  /* ===== V34 — Expand → Tabs ===== */
  .cert-v34 { width: 100%; max-width: 700px; }

  .cert-v34__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .cert-v34__compact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
  }

  .cert-v34__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v34__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v34__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v34__tabs-area {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.3s ease;
  }

  .cert-v34__tab-bar {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v34__tab {
    flex: 1;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
  }

  .cert-v34__tab--active {
    color: #60a5fa;
    border-bottom-color: #60a5fa;
  }

  .cert-v34__tab:hover { color: rgba(255, 255, 255, 0.8); }

  .cert-v34__tab-content { padding: 1.5rem; min-height: 100px; }

  .cert-v34__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v34__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0.5rem 0 0; }
  .cert-v34__stats { display: flex; gap: 2rem; justify-content: center; }
  .cert-v34__stat { text-align: center; }
  .cert-v34__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.3rem; font-weight: 700; color: #fff; }
  .cert-v34__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  .cert-v34__cert-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cert-v34__cert-list div {
    padding: 0.6rem 1rem;
    background: rgba(96, 165, 250, 0.08);
    border-radius: 6px;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    border-left: 3px solid #60a5fa;
  }

  /* ===== V35 — Expand → Full Bleed ===== */
  .cert-v35 { width: 100%; max-width: 700px; }

  .cert-v35__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v35__compact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v35__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v35__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v35__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v35__bleed {
    position: relative;
    background: #0a0a0a;
    padding: 3rem 2.5rem;
    text-align: center;
    animation: certFadeScale 0.4s ease;
  }

  .cert-v35__glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(96, 165, 250, 0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .cert-v35__bleed-content { position: relative; z-index: 1; }
  .cert-v35__bleed-logo { height: 70px; width: auto; margin-bottom: 1rem; }

  .cert-v35__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v35__bleed-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v35__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 auto 1.5rem; max-width: 450px; }
  .cert-v35__stats { display: flex; justify-content: center; gap: 2.5rem; margin-bottom: 1rem; }
  .cert-v35__stat { text-align: center; }
  .cert-v35__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.3rem; font-weight: 700; color: #fff; }
  .cert-v35__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v35__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V36 — Expand → Services List ===== */
  .cert-v36 { width: 100%; max-width: 700px; }

  .cert-v36__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v36__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v36__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v36__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v36__compact-info { flex: 1; min-width: 0; }

  .cert-v36__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v36__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v36__details {
    padding: 1rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v36__services-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cert-v36__services {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .cert-v36__service {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .cert-v36__service-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #60a5fa;
    flex-shrink: 0;
  }

  .cert-v36__stats { display: flex; gap: 2rem; }
  .cert-v36__stat { text-align: center; }
  .cert-v36__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v36__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  /* ===== V37 — Expand → Quote ===== */
  .cert-v37 { width: 100%; max-width: 700px; }

  .cert-v37__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v37__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v37__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v37__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v37__compact-info { flex: 1; min-width: 0; }

  .cert-v37__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v37__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v37__details {
    padding: 1.5rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.4s ease;
  }

  .cert-v37__quote {
    font-size: 1.1rem;
    font-style: italic;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 1rem;
    padding: 0;
    border: none;
    position: relative;
  }

  .cert-v37__quote-mark {
    font-size: 2rem;
    color: #60a5fa;
    vertical-align: -0.2em;
    line-height: 0;
  }

  .cert-v37__attribution {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .cert-v37__attribution strong { font-size: 0.85rem; color: #fff; }
  .cert-v37__attribution span { font-size: 0.7rem; color: rgba(255, 255, 255, 0.45); }

  /* ===== V38 — Expand → Team ===== */
  .cert-v38 { width: 100%; max-width: 700px; }

  .cert-v38__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v38__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v38__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v38__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v38__compact-info { flex: 1; min-width: 0; }

  .cert-v38__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v38__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v38__details {
    padding: 1.25rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v38__team-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cert-v38__team-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v38__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #fff;
    flex-shrink: 0;
  }

  .cert-v38__team-info { flex: 1; }
  .cert-v38__team-info strong { display: block; font-size: 0.95rem; color: #fff; margin-bottom: 0.15rem; }
  .cert-v38__team-info > span { display: block; font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); margin-bottom: 0.5rem; }

  .cert-v38__team-stats {
    display: flex;
    gap: 1rem;
  }

  .cert-v38__team-stats span {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    padding: 0.2rem 0.5rem;
    background: rgba(96, 165, 250, 0.1);
    border-radius: 4px;
  }

  /* ===== V39 — Expand → Facility ===== */
  .cert-v39 { width: 100%; max-width: 700px; }

  .cert-v39__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v39__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v39__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v39__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v39__compact-info { flex: 1; min-width: 0; }

  .cert-v39__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v39__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v39__details {
    padding: 1.25rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v39__facility-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cert-v39__facility-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.25rem;
  }

  .cert-v39__fstat { text-align: center; }
  .cert-v39__fstat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.3rem; font-weight: 700; color: #fff; }
  .cert-v39__fstat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); margin-top: 0.2rem; }

  .cert-v39__facility-desc {
    font-size: 0.8rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  /* ===== V40 — Expand → Contact CTA ===== */
  .cert-v40 { width: 100%; max-width: 700px; }

  .cert-v40__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v40__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v40__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v40__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v40__compact-info { flex: 1; min-width: 0; }

  .cert-v40__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v40__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v40__details {
    padding: 1.25rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v40__contact-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .cert-v40__contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cert-v40__contact-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v40__contact-value {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .cert-v40__cta {
    display: block;
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cert-v40__cta:hover { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); transform: translateY(-1px); }

  /* ===== V41 — Drawer ===== */
  .cert-v41 { width: 100%; max-width: 700px; }

  .cert-v41__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: row;
  }

  .cert-v41__main {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem 2rem;
    flex: 1;
    min-width: 0;
  }

  .cert-v41__logo { height: 45px; width: auto; flex-shrink: 0; }
  .cert-v41__info { flex: 1; min-width: 0; }

  .cert-v41__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v41__hint { font-size: 0.7rem; color: #60a5fa; }

  .cert-v41__drawer {
    width: 0;
    overflow: hidden;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 0 solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.15);
  }

  .cert-v41__card--open .cert-v41__drawer {
    width: 320px;
    border-left-width: 1px;
  }

  .cert-v41__drawer-inner {
    width: 320px;
    padding: 1.5rem;
  }

  .cert-v41__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v41__desc { font-size: 0.8rem; line-height: 1.5; color: rgba(255, 255, 255, 0.6); margin: 0 0 1rem; }
  .cert-v41__stats { display: flex; gap: 1.5rem; margin-bottom: 0.75rem; }
  .cert-v41__stat { text-align: center; }
  .cert-v41__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cert-v41__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v41__also { font-size: 0.6rem; color: rgba(255, 255, 255, 0.3); }

  @media (max-width: 640px) {
    .cert-v41__card { flex-direction: column; }
    .cert-v41__drawer { width: 100% !important; border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .cert-v41__card--open .cert-v41__drawer { width: 100%; height: auto; }
    .cert-v41__drawer-inner { width: 100%; }
  }

  /* ===== V42 — Staggered Reveal ===== */
  .cert-v42 { width: 100%; max-width: 700px; }

  .cert-v42__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v42__compact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v42__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v42__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v42__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v42__details {
    padding: 1rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v42__row {
    opacity: 0;
    transform: translateY(10px);
    animation: certStaggerIn 0.4s ease forwards;
  }
  .cert-v42__row--1 { animation-delay: 0s; }
  .cert-v42__row--2 { animation-delay: 0.1s; }
  .cert-v42__row--3 { animation-delay: 0.2s; }
  .cert-v42__row--4 { animation-delay: 0.3s; }

  @keyframes certStaggerIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .cert-v42__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.5rem;
  }

  .cert-v42__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1rem; }
  .cert-v42__stats { display: flex; gap: 2rem; margin-bottom: 0.75rem; }
  .cert-v42__stat { text-align: center; }
  .cert-v42__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v42__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v42__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V43 — Peek ===== */
  .cert-v43 { width: 100%; max-width: 700px; }

  .cert-v43__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
  }

  .cert-v43__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v43__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v43__compact-info { flex: 1; min-width: 0; }

  .cert-v43__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v43__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v43__peek {
    max-height: 30px;
    overflow: hidden;
    padding: 0 2rem;
    transition: max-height 0.4s ease, padding 0.4s ease;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
  }

  .cert-v43__peek--full {
    max-height: 400px;
    padding: 1rem 2rem 2rem;
    mask-image: none;
    -webkit-mask-image: none;
    border-top-color: rgba(255, 255, 255, 0.08);
  }

  .cert-v43__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v43__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v43__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v43__stat { text-align: center; }
  .cert-v43__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v43__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v43__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V44 — Progress Bar ===== */
  .cert-v44 { width: 100%; max-width: 700px; }

  .cert-v44__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v44__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v44__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v44__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v44__compact-info { flex: 1; min-width: 0; }

  .cert-v44__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v44__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v44__details {
    padding: 1rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v44__meters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .cert-v44__meter-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.35rem;
  }

  .cert-v44__meter-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.5);
  }

  .cert-v44__meter-value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v44__meter-track {
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .cert-v44__meter-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
    animation: certMeterFill 0.8s ease forwards;
    width: 0;
  }

  @keyframes certMeterFill {
    to { width: inherit; }
  }

  .cert-v44__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V45 — Card Stack ===== */
  .cert-v45 { width: 100%; max-width: 500px; }

  .cert-v45__stack {
    position: relative;
    height: 220px;
    cursor: pointer;
  }

  .cert-v45__card {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v45__card--back2 {
    z-index: 1;
    transform: scale(0.9) translateY(12px);
    opacity: 0.4;
  }

  .cert-v45__card--back2 span {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .cert-v45__card--back1 {
    z-index: 2;
    transform: scale(0.95) translateY(6px);
    opacity: 0.6;
  }

  .cert-v45__card--front {
    z-index: 3;
    gap: 0.75rem;
  }

  .cert-v45__stack--fanned .cert-v45__card--back2 {
    transform: translateX(-70%) rotate(-6deg) scale(0.9);
    opacity: 0.8;
  }

  .cert-v45__stack--fanned .cert-v45__card--back1 {
    transform: translateX(70%) rotate(6deg) scale(0.9);
    opacity: 0.8;
  }

  .cert-v45__logo { height: 50px; width: auto; }

  .cert-v45__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .cert-v45__hint { font-size: 0.7rem; color: #60a5fa; }
  .cert-v45__stats { display: flex; gap: 1.5rem; }
  .cert-v45__stat { text-align: center; }
  .cert-v45__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cert-v45__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  /* ===== V46 — Spotlight ===== */
  .cert-v46 { width: 100%; max-width: 700px; }

  .cert-v46__card {
    position: relative;
    background: #0d0d0d;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cert-v46__spot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: all 0.5s ease;
    opacity: 0.5;
  }

  .cert-v46__card--expanded .cert-v46__spot {
    width: 600px;
    height: 600px;
    opacity: 1;
  }

  .cert-v46__compact {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v46__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v46__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v46__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v46__details {
    position: relative;
    z-index: 1;
    padding: 1rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.4s ease;
  }

  .cert-v46__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v46__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v46__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v46__stat { text-align: center; }
  .cert-v46__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v46__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v46__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V47 — Diagonal Split ===== */
  .cert-v47 { width: 100%; max-width: 700px; }

  .cert-v47__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v47__top {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .cert-v47__logo { height: 40px; width: auto; flex-shrink: 0; }

  .cert-v47__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    flex: 1;
  }

  .cert-v47__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v47__diagonal {
    height: 30px;
    background: linear-gradient(165deg, #2d2d2d 49.5%, #1a1a1a 50.5%);
    transition: height 0.3s ease;
  }

  .cert-v47__card--expanded .cert-v47__diagonal {
    height: 40px;
    background: linear-gradient(165deg, #2d2d2d 49.5%, #141414 50.5%);
  }

  .cert-v47__bottom {
    background: #141414;
    padding: 1rem 2rem 2rem;
    animation: certSlideDown 0.3s ease;
  }

  .cert-v47__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.6); margin: 0 0 1.25rem; }
  .cert-v47__stats { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cert-v47__stat { text-align: center; }
  .cert-v47__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v47__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }
  .cert-v47__also { font-size: 0.65rem; color: rgba(255, 255, 255, 0.35); }

  /* ===== V48 — Meter Dashboard ===== */
  .cert-v48 { width: 100%; max-width: 700px; }

  .cert-v48__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v48__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v48__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v48__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v48__compact-info { flex: 1; min-width: 0; }

  .cert-v48__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v48__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v48__details {
    padding: 1.5rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certFadeScale 0.3s ease;
  }

  .cert-v48__gauges {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .cert-v48__gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .cert-v48__gauge-ring {
    position: relative;
    width: 70px;
    height: 70px;
  }

  .cert-v48__gauge-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .cert-v48__gauge-fill {
    stroke-linecap: round;
    animation: certGaugeFill 1s ease forwards;
    stroke-dasharray: 0, 100;
  }

  @keyframes certGaugeFill {
    to { stroke-dasharray: var(--fill); }
  }

  .cert-v48__gauge-value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v48__gauge-label {
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v48__desc { font-size: 0.8rem; line-height: 1.6; color: rgba(255, 255, 255, 0.5); margin: 0; text-align: center; }

  /* ===== V49 — Map Pin ===== */
  .cert-v49 { width: 100%; max-width: 600px; }

  .cert-v49__card {
    background: linear-gradient(135deg, #1a2332 0%, #1e293b 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(96, 165, 250, 0.15);
    transition: all 0.3s ease;
  }

  .cert-v49__pin-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
  }

  .cert-v49__pin-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(96, 165, 250, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cert-v49__pin-info { flex: 1; min-width: 0; }

  .cert-v49__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.15rem;
  }

  .cert-v49__subtitle { font-size: 0.65rem; color: rgba(255, 255, 255, 0.45); }
  .cert-v49__hint { font-size: 0.7rem; color: #60a5fa; flex-shrink: 0; }

  .cert-v49__details {
    padding: 1rem 1.25rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v49__location {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .cert-v49__coord {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: rgba(96, 165, 250, 0.08);
    border-radius: 6px;
    text-align: center;
  }

  .cert-v49__coord span {
    display: block;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: 0.2rem;
  }

  .cert-v49__coord strong {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: #60a5fa;
  }

  .cert-v49__desc { font-size: 0.8rem; line-height: 1.5; color: rgba(255, 255, 255, 0.55); margin: 0 0 1rem; }
  .cert-v49__stats { display: flex; gap: 1.5rem; }
  .cert-v49__stat { text-align: center; }
  .cert-v49__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
  .cert-v49__stat-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  /* ===== V50 — Badge Carousel ===== */
  .cert-v50 { width: 100%; max-width: 700px; }

  .cert-v50__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v50__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v50__compact {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .cert-v50__logo { height: 50px; width: auto; flex-shrink: 0; }
  .cert-v50__compact-info { flex: 1; min-width: 0; }

  .cert-v50__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .cert-v50__hint { font-size: 0.75rem; color: #60a5fa; }

  .cert-v50__details {
    padding: 1.25rem 2rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
  }

  .cert-v50__badges {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .cert-v50__badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    opacity: 0;
    animation: certStaggerIn 0.3s ease forwards;
  }

  .cert-v50__badge:nth-child(1) { animation-delay: 0s; }
  .cert-v50__badge:nth-child(2) { animation-delay: 0.1s; }
  .cert-v50__badge:nth-child(3) { animation-delay: 0.2s; }
  .cert-v50__badge:nth-child(4) { animation-delay: 0.3s; }

  .cert-v50__badge-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(96, 165, 250, 0.2);
    color: #60a5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    flex-shrink: 0;
  }

  .cert-v50__badge strong {
    display: block;
    font-size: 0.8rem;
    color: #fff;
  }

  .cert-v50__badge span {
    display: block;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 0.1rem;
  }

  .cert-v50__stats { display: flex; gap: 2rem; }
  .cert-v50__stat { text-align: center; }
  .cert-v50__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v50__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); }

  /* ===== V51 — Also Certified — Ribbon ===== */
  .cert-v51 { width: 100%; max-width: 500px; }

  .cert-v51__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v51__ribbon {
    position: absolute;
    top: 18px;
    right: -35px;
    width: 150px;
    padding: 0.3rem 0;
    background: linear-gradient(135deg, #c9a227 0%, #e6c14e 100%);
    transform: rotate(45deg);
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .cert-v51__ribbon span {
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #1a1a1a;
  }

  .cert-v51__logo-area {
    padding: 2.5rem 2rem 1.5rem;
    display: flex;
    justify-content: center;
  }

  .cert-v51__logo { height: 90px; width: auto; }

  .cert-v51__body { padding: 0 2.5rem 2rem; }

  .cert-v51__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v51__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v51__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0 0 1.5rem; }

  .cert-v51__stats { display: flex; justify-content: center; gap: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .cert-v51__stat { text-align: center; }
  .cert-v51__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v51__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); margin-top: 0.2rem; }

  .cert-v51__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem;
    background: #2a2a2a;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.05em;
  }

  .cert-v51__footer strong { color: rgba(255, 255, 255, 0.6); }

  /* ===== V52 — Also Certified — Badge Row ===== */
  .cert-v52 { width: 100%; max-width: 500px; }

  .cert-v52__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v52__logo-area { padding: 2.5rem 2rem 1.5rem; display: flex; justify-content: center; }
  .cert-v52__logo { height: 90px; width: auto; }
  .cert-v52__body { padding: 0 2.5rem 2rem; }

  .cert-v52__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v52__title { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0 0 0.75rem; }
  .cert-v52__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0 0 1.5rem; }

  .cert-v52__stats { display: flex; justify-content: center; gap: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .cert-v52__stat { text-align: center; }
  .cert-v52__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v52__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); margin-top: 0.2rem; }

  .cert-v52__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: #222;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v52__badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cert-v52__badge-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(96, 165, 250, 0.2);
    color: #60a5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    flex-shrink: 0;
  }

  .cert-v52__badge-text { text-align: left; }
  .cert-v52__badge-text strong { display: block; font-size: 0.7rem; color: #fff; }
  .cert-v52__badge-text span { display: block; font-size: 0.55rem; color: rgba(255, 255, 255, 0.4); }

  .cert-v52__badge-sep {
    width: 1px;
    height: 30px;
    background: rgba(255, 255, 255, 0.12);
  }

  /* ===== V53 — Also Certified — Pill Tags ===== */
  .cert-v53 { width: 100%; max-width: 500px; }

  .cert-v53__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v53__logo-area { padding: 2.5rem 2rem 1.5rem; display: flex; justify-content: center; }
  .cert-v53__logo { height: 90px; width: auto; }
  .cert-v53__body { padding: 0 2.5rem 2rem; }

  .cert-v53__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v53__title { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0 0 0.75rem; }
  .cert-v53__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0 0 1.5rem; }

  .cert-v53__stats { display: flex; justify-content: center; gap: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .cert-v53__stat { text-align: center; }
  .cert-v53__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v53__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); margin-top: 0.2rem; }

  .cert-v53__footer {
    padding: 1rem 1.5rem;
    background: #222;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    text-align: center;
  }

  .cert-v53__footer-label {
    display: block;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 0.6rem;
  }

  .cert-v53__pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem;
  }

  .cert-v53__pill {
    font-size: 0.6rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v53__pill--alt {
    color: #c9a227;
    background: rgba(201, 162, 39, 0.1);
    border-color: rgba(201, 162, 39, 0.25);
  }

  /* ===== V54 — Also Certified — Glow Strip ===== */
  .cert-v54 { width: 100%; max-width: 500px; }

  .cert-v54__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v54__logo-area { padding: 2.5rem 2rem 1.5rem; display: flex; justify-content: center; }
  .cert-v54__logo { height: 90px; width: auto; }
  .cert-v54__body { padding: 0 2.5rem 2rem; }

  .cert-v54__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v54__title { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0 0 0.75rem; }
  .cert-v54__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0 0 1.5rem; }

  .cert-v54__stats { display: flex; justify-content: center; gap: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .cert-v54__stat { text-align: center; }
  .cert-v54__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v54__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); margin-top: 0.2rem; }

  .cert-v54__footer {
    position: relative;
    padding: 0.8rem 1.5rem;
    background: #1a1a1a;
    overflow: hidden;
  }

  .cert-v54__glow-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #60a5fa 25%, #c9a227 50%, #60a5fa 75%, transparent 100%);
    background-size: 200% 100%;
    animation: certGlowSlide 3s linear infinite;
  }

  @keyframes certGlowSlide {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .cert-v54__footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .cert-v54__footer-content span { font-size: 0.6rem; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.05em; }
  .cert-v54__footer-content strong { font-size: 0.65rem; color: rgba(255, 255, 255, 0.6); }

  /* ===== V55 — Also Certified — Split Footer ===== */
  .cert-v55 { width: 100%; max-width: 500px; }

  .cert-v55__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
  }

  .cert-v55__logo-area { padding: 2.5rem 2rem 1.5rem; display: flex; justify-content: center; }
  .cert-v55__logo { height: 90px; width: auto; }
  .cert-v55__body { padding: 0 2.5rem 2rem; }

  .cert-v55__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .cert-v55__title { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0 0 0.75rem; }
  .cert-v55__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0 0 1.5rem; }

  .cert-v55__stats { display: flex; justify-content: center; gap: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .cert-v55__stat { text-align: center; }
  .cert-v55__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v55__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); margin-top: 0.2rem; }

  .cert-v55__footer {
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v55__foot-left, .cert-v55__foot-right {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .cert-v55__foot-left {
    background: rgba(96, 165, 250, 0.06);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cert-v55__foot-right {
    background: rgba(201, 162, 39, 0.06);
  }

  .cert-v55__foot-icon {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.3);
  }

  .cert-v55__foot-left .cert-v55__foot-icon { color: #60a5fa; }
  .cert-v55__foot-right .cert-v55__foot-icon { color: #c9a227; }

  .cert-v55__foot-left strong, .cert-v55__foot-right strong {
    display: block;
    font-size: 0.7rem;
    color: #fff;
  }

  .cert-v55__foot-left span, .cert-v55__foot-right span {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 0.1rem;
  }

  /* ===== V56 — Expand → Pill Tags ===== */
  .cert-v56 { width: 100%; max-width: 700px; }

  .cert-v56__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cert-v56__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  /* -- Logo area: Robinson + divider + Guimbal -- */
  .cert-v56__logos {
    display: flex;
    align-items: center;
    padding: 3rem 3rem 2rem;
  }

  .cert-v56__logo-area {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .cert-v56__logo { height: 120px; width: auto; }

  .cert-v56__logos-amp {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
    padding: 0 1.5rem;
  }

  .cert-v56__guimbal {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
  }

  .cert-v56__guimbal-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .cert-v56__guimbal-sub {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* -- Hint row -- */
  .cert-v56__label-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem 1.5rem;
  }

  .cert-v56__label {
    display: inline-block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin: 0 0 1.5rem;
  }

  .cert-v56__hint { font-size: 0.75rem; color: #60a5fa; transition: color 0.2s; }
  .cert-v56__card:hover .cert-v56__hint { color: #93c5fd; }

  /* -- Expanded content -- */
  .cert-v56__expanded {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: certExpand 0.3s ease;
    text-align: center;
  }

  .cert-v56__body { padding: 1.5rem 2.5rem 16px; }

  .cert-v56__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v56__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0 0 1.5rem; }

  .cert-v56__stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cert-v56__stat { text-align: center; flex: 1; }
  .cert-v56__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #fff; }
  .cert-v56__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); margin-top: 0.2rem; }

  /* -- Footer with pill tags -- */
  .cert-v56__footer {
    padding: 1rem 1.5rem;
    background: #222;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    text-align: center;
  }

  .cert-v56__footer-label {
    display: block;
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 0.6rem;
  }

  .cert-v56__pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem;
  }

  .cert-v56__pill {
    font-size: 0.6rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* ===== V57 — Stacked Center ===== */
  .cert-v57 { width: 100%; max-width: 700px; }

  .cert-v57__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v57__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v57__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 3rem 2rem 1.5rem;
    text-align: center;
  }

  .cert-v57__logo { height: 110px; width: auto; }

  .cert-v57__plus {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.15);
    font-weight: 300;
  }

  .cert-v57__guimbal { text-align: center; }
  .cert-v57__guimbal-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.2em; text-transform: uppercase; }
  .cert-v57__guimbal-sub { display: block; font-size: 0.5rem; color: rgba(255, 255, 255, 0.25); letter-spacing: 0.1em; }
  .cert-v57__hint { font-size: 0.75rem; color: #60a5fa; margin-top: 0.5rem; }

  /* ===== V58 — Left-Aligned Dual ===== */
  .cert-v58 { width: 100%; max-width: 700px; }

  .cert-v58__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v58__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v58__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 2.5rem 2.5rem 1.5rem;
  }

  .cert-v58__brands {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cert-v58__logo { height: 100px; width: auto; }

  .cert-v58__guimbal-name {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
  }

  .cert-v58__hint { font-size: 0.75rem; color: #60a5fa; flex-shrink: 0; }

  /* ===== V59 — Inline Bar ===== */
  .cert-v59 { width: 100%; max-width: 700px; }

  .cert-v59__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v59__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v59__bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 2rem;
  }

  .cert-v59__logo { height: 45px; width: auto; flex-shrink: 0; }

  .cert-v59__amp {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.2);
    font-weight: 300;
  }

  .cert-v59__guimbal {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .cert-v59__spacer { flex: 1; }
  .cert-v59__hint { font-size: 0.75rem; color: #60a5fa; flex-shrink: 0; }

  /* ===== V60 — Corner Guimbal ===== */
  .cert-v60 { width: 100%; max-width: 700px; }

  .cert-v60__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v60__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v60__corner-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.5rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.3rem 0.6rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    z-index: 2;
  }

  .cert-v60__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 2rem 1.5rem;
  }

  .cert-v60__logo { height: 120px; width: auto; }
  .cert-v60__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V61 — Two Columns ===== */
  .cert-v61 { width: 100%; max-width: 700px; }

  .cert-v61__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v61__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v61__columns {
    display: flex;
    align-items: center;
    padding: 2.5rem 2rem;
  }

  .cert-v61__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .cert-v61__col--robinson { flex: 1.5; }

  .cert-v61__logo { height: 90px; width: auto; }

  .cert-v61__col-divider {
    width: 1px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    margin: 0 1.5rem;
  }

  .cert-v61__guimbal-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .cert-v61__col-label {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cert-v61__hint-row { text-align: center; padding: 0 2rem 1.5rem; }
  .cert-v61__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V62 — Robinson Hero + Tag ===== */
  .cert-v62 { width: 100%; max-width: 700px; }

  .cert-v62__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v62__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v62__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 2rem 1.5rem;
    text-align: center;
  }

  .cert-v62__logo { height: 120px; width: auto; }

  .cert-v62__below-logo {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cert-v62__guimbal-tag {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
  }

  .cert-v62__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V63 — Overlapping ===== */
  .cert-v63 { width: 100%; max-width: 700px; }

  .cert-v63__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v63__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v63__top {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 3rem 2rem 2rem;
  }

  .cert-v63__logo { height: 110px; width: auto; }

  .cert-v63__overlap {
    position: absolute;
    bottom: 12px;
    right: 24px;
    text-align: right;
    padding: 0.4rem 0.8rem;
    background: rgba(30, 30, 30, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }

  .cert-v63__guimbal-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; font-weight: 700; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.15em; text-transform: uppercase; }
  .cert-v63__guimbal-sub { display: block; font-size: 0.45rem; color: rgba(255, 255, 255, 0.25); letter-spacing: 0.08em; text-transform: uppercase; }

  .cert-v63__hint-row { text-align: center; padding: 0 2rem 1.5rem; }
  .cert-v63__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V64 — Top Bar + Logo ===== */
  .cert-v64 { width: 100%; max-width: 700px; }

  .cert-v64__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v64__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v64__top-bar {
    padding: 0.5rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    text-align: center;
  }

  .cert-v64__top-bar-text {
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .cert-v64__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2.5rem 2rem 1.5rem;
  }

  .cert-v64__logo { height: 120px; width: auto; }
  .cert-v64__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V65 — Side Badge ===== */
  .cert-v65 { width: 100%; max-width: 700px; }

  .cert-v65__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v65__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v65__side-badge {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 28px;
    background: rgba(255, 255, 255, 0.03);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    z-index: 2;
  }

  .cert-v65__side-badge span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.5rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.1em;
  }

  .cert-v65__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 2rem 1.5rem 3.5rem;
  }

  .cert-v65__logo { height: 110px; width: auto; }
  .cert-v65__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V66 — Bracket Layout ===== */
  .cert-v66 { width: 100%; max-width: 700px; }

  .cert-v66__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v66__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v66__top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2.5rem 2rem 1.5rem;
  }

  .cert-v66__bracket {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.5rem;
    font-weight: 200;
    color: rgba(255, 255, 255, 0.12);
    line-height: 1;
  }

  .cert-v66__logo { height: 60px; width: auto; }

  .cert-v66__amp {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.15);
  }

  .cert-v66__guimbal { text-align: center; }
  .cert-v66__guimbal-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 700; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.15em; text-transform: uppercase; }
  .cert-v66__guimbal-sub { display: block; font-size: 0.5rem; color: rgba(255, 255, 255, 0.25); }

  .cert-v66__hint-row { text-align: center; padding: 0 2rem 1.5rem; }
  .cert-v66__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V67 — Diagonal Badge ===== */
  .cert-v67 { width: 100%; max-width: 700px; }

  .cert-v67__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v67__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v67__top {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem 1rem;
    position: relative;
  }

  .cert-v67__logo { height: 100px; width: auto; }

  .cert-v67__badge {
    position: absolute;
    top: 12px;
    right: 16px;
    transform: rotate(-15deg);
    text-align: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 6px 12px;
  }
  .cert-v67__badge-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .cert-v67__badge-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.2);
  }

  .cert-v67__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V68 — Underline Accent ===== */
  .cert-v68 { width: 100%; max-width: 700px; }

  .cert-v68__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v68__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v68__top {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    padding: 2.5rem 2rem 1rem;
    justify-content: center;
  }

  .cert-v68__logo-wrap { display: flex; flex-direction: column; align-items: center; }
  .cert-v68__logo { height: 90px; width: auto; }
  .cert-v68__underline {
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #b8860b, #daa520);
    border-radius: 2px;
    margin-top: 8px;
  }

  .cert-v68__guimbal {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.35);
    white-space: nowrap;
    padding-bottom: 6px;
  }

  .cert-v68__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V69 — Circle Frames ===== */
  .cert-v69 { width: 100%; max-width: 700px; }

  .cert-v69__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v69__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v69__top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v69__circle {
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.02);
  }
  .cert-v69__circle--big { width: 140px; height: 140px; }
  .cert-v69__circle--small { width: 60px; height: 60px; }

  .cert-v69__logo { height: 70px; width: auto; }

  .cert-v69__guimbal-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.1em;
  }

  .cert-v69__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V70 — Gradient Fade ===== */
  .cert-v70 { width: 100%; max-width: 700px; }

  .cert-v70__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v70__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v70__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v70__logo { height: 100px; width: auto; }

  .cert-v70__guimbal {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cert-v70__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V71 — Tab Headers ===== */
  .cert-v71 { width: 100%; max-width: 700px; }

  .cert-v71__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v71__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v71__tabs {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cert-v71__tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.2rem 1rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  .cert-v71__tab--active {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 2px solid #60a5fa;
  }
  .cert-v71__tab--inactive {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.7rem;
    font-weight: 400;
  }

  .cert-v71__tab-logo { height: 24px; width: auto; }

  .cert-v71__body { padding: 1.5rem 2rem; }
  .cert-v71__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V72 — Stamp Mark ===== */
  .cert-v72 { width: 100%; max-width: 700px; }

  .cert-v72__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v72__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v72__top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem 1rem;
  }

  .cert-v72__stamp {
    position: absolute;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.04);
    transform: rotate(-20deg);
    border: 3px solid rgba(255, 255, 255, 0.04);
    border-radius: 50%;
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    white-space: nowrap;
    pointer-events: none;
  }

  .cert-v72__logo { height: 100px; width: auto; position: relative; z-index: 1; }

  .cert-v72__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V73 — Breadcrumb ===== */
  .cert-v73 { width: 100%; max-width: 700px; }

  .cert-v73__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v73__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v73__breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2.5rem 2rem 1rem;
    font-family: 'Space Grotesk', sans-serif;
  }

  .cert-v73__crumb { font-size: 0.85rem; font-weight: 500; }
  .cert-v73__crumb--muted { color: rgba(255, 255, 255, 0.25); }
  .cert-v73__crumb--primary { color: #fff; font-weight: 700; font-size: 1rem; }
  .cert-v73__crumb--secondary { color: rgba(255, 255, 255, 0.35); font-size: 0.75rem; }

  .cert-v73__chevron {
    color: rgba(255, 255, 255, 0.15);
    font-size: 0.9rem;
  }

  .cert-v73__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V74 — Dots Connector ===== */
  .cert-v74 { width: 100%; max-width: 700px; }

  .cert-v74__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v74__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v74__top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v74__logo { height: 80px; width: auto; }

  .cert-v74__dots {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cert-v74__dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
  }

  .cert-v74__guimbal { text-align: center; }
  .cert-v74__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .cert-v74__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.25);
  }

  .cert-v74__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V75 — Shield ===== */
  .cert-v75 { width: 100%; max-width: 700px; }

  .cert-v75__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v75__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v75__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v75__shield {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 2.5rem;
    background: rgba(255, 255, 255, 0.03);
    clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
  }

  .cert-v75__logo { height: 80px; width: auto; }

  .cert-v75__banner {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 4px 16px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 3px;
  }

  .cert-v75__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V76 — Minimal Mono ===== */
  .cert-v76 { width: 100%; max-width: 700px; }

  .cert-v76__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v76__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v76__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 3rem 2rem 1rem;
  }

  .cert-v76__primary {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .cert-v76__secondary {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.1em;
    text-transform: lowercase;
  }

  .cert-v76__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V77 — Glass Card ===== */
  .cert-v77 { width: 100%; max-width: 700px; }

  .cert-v77__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v77__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v77__glass {
    margin: 2rem 2rem 0.75rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cert-v77__logo { height: 90px; width: auto; }

  .cert-v77__etched {
    display: block;
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0 2rem;
  }

  .cert-v77__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V78 — Neon Outline ===== */
  .cert-v78 { width: 100%; max-width: 700px; }

  .cert-v78__card {
    background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v78__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v78__top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v78__neon {
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cert-v78__neon--bright {
    border: 1px solid rgba(96, 165, 250, 0.35);
    box-shadow: 0 0 12px rgba(96, 165, 250, 0.15), inset 0 0 12px rgba(96, 165, 250, 0.05);
  }
  .cert-v78__neon--dim {
    border: 1px solid rgba(96, 165, 250, 0.12);
    box-shadow: 0 0 6px rgba(96, 165, 250, 0.05);
  }

  .cert-v78__logo { height: 70px; width: auto; }

  .cert-v78__guimbal {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(96, 165, 250, 0.4);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .cert-v78__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V79 — Split Diagonal ===== */
  .cert-v79 { width: 100%; max-width: 700px; }

  .cert-v79__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v79__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v79__split {
    position: relative;
    display: flex;
    min-height: 140px;
  }

  .cert-v79__upper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
  }

  .cert-v79__lower {
    position: absolute;
    right: 2rem;
    bottom: 1.5rem;
    text-align: right;
  }

  .cert-v79__logo { height: 80px; width: auto; }

  .cert-v79__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .cert-v79__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.2);
  }

  .cert-v79__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V80 — Orbit ===== */
  .cert-v80 { width: 100%; max-width: 700px; }

  .cert-v80__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v80__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v80__top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem 1rem;
  }

  .cert-v80__orbit-ring {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 1px dashed rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .cert-v80__orbit-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.55rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 0.25em;
    text-transform: uppercase;
    transform: translateY(-8px);
  }

  .cert-v80__logo { height: 90px; width: auto; position: relative; z-index: 1; }

  .cert-v80__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V81 — Layered Cards ===== */
  .cert-v81 { width: 100%; max-width: 700px; }

  .cert-v81__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v81__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v81__stack {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v81__back {
    position: absolute;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-45%) rotate(-3deg);
    width: 280px;
    height: 120px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cert-v81__back-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.15);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .cert-v81__front {
    position: relative;
    z-index: 1;
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 1.5rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cert-v81__logo { height: 80px; width: auto; }

  .cert-v81__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V82 — Ticker Tape ===== */
  .cert-v82 { width: 100%; max-width: 700px; }

  .cert-v82__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v82__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v82__top {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v82__logo { height: 90px; width: auto; }

  .cert-v82__ticker {
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 6px 0;
  }

  .cert-v82__ticker-track {
    display: inline-block;
    white-space: nowrap;
    animation: cert-v82-scroll 12s linear infinite;
  }

  .cert-v82__ticker-track span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  @keyframes cert-v82-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); }
  }

  .cert-v82__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V83 — Grid Dots ===== */
  .cert-v83 { width: 100%; max-width: 700px; }

  .cert-v83__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v83__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v83__top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v83__dotgrid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
  }

  .cert-v83__logo { height: 90px; width: auto; position: relative; z-index: 1; }

  .cert-v83__guimbal-cell {
    position: relative;
    z-index: 1;
    background: rgba(96, 165, 250, 0.06);
    border: 1px solid rgba(96, 165, 250, 0.15);
    border-radius: 6px;
    padding: 8px 14px;
    text-align: center;
  }

  .cert-v83__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .cert-v83__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.25);
  }

  .cert-v83__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V84 — Perspective Tilt ===== */
  .cert-v84 { width: 100%; max-width: 700px; }

  .cert-v84__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v84__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v84__tilt {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 0.75rem;
    transform: perspective(600px) rotateX(3deg);
    transform-origin: bottom center;
  }

  .cert-v84__logo { height: 90px; width: auto; }

  .cert-v84__flat {
    text-align: center;
    padding: 0.5rem 2rem 0.25rem;
  }

  .cert-v84__guimbal {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .cert-v84__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V85 — Paper Fold ===== */
  .cert-v85 { width: 100%; max-width: 700px; }

  .cert-v85__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v85__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v85__main-face {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 1rem;
  }

  .cert-v85__logo { height: 90px; width: auto; }

  .cert-v85__fold {
    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.6rem 2rem;
    text-align: center;
    position: relative;
  }
  .cert-v85__fold::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }

  .cert-v85__fold-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .cert-v85__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V86 — Waveform ===== */
  .cert-v86 { width: 100%; max-width: 700px; }

  .cert-v86__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v86__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v86__above {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 0.5rem;
  }

  .cert-v86__logo { height: 90px; width: auto; }

  .cert-v86__wave {
    width: 100%;
    height: 40px;
    display: block;
  }

  .cert-v86__below {
    text-align: center;
    padding: 0 2rem 0.25rem;
  }

  .cert-v86__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v86__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.2);
  }

  .cert-v86__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V87 — Perspective Float ===== */
  .cert-v87 { width: 100%; max-width: 700px; }

  .cert-v87__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v87__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v87__float-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem 0;
    perspective: 800px;
  }

  .cert-v87__logo-wrapper {
    transform: rotateX(12deg) translateZ(30px);
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
  }
  .cert-v87__card:hover .cert-v87__logo-wrapper {
    transform: rotateX(8deg) translateZ(40px);
  }

  .cert-v87__logo { height: 100px; width: auto; display: block; }

  .cert-v87__shadow {
    width: 60%;
    height: 8px;
    margin-top: 1.5rem;
    background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .cert-v87__ground {
    text-align: center;
    padding: 1rem 2rem 0.25rem;
    opacity: 0.4;
  }

  .cert-v87__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v87__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.2);
  }

  .cert-v87__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V88 — Hero Offset ===== */
  .cert-v88 { width: 100%; max-width: 700px; }

  .cert-v88__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: visible;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  .cert-v88__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v88__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2rem 1rem;
    min-height: 120px;
  }

  .cert-v88__logo {
    height: 110px;
    width: auto;
    margin-left: -3rem;
    filter: drop-shadow(4px 4px 20px rgba(0, 0, 0, 0.4));
    transition: transform 0.3s ease;
  }
  .cert-v88__card:hover .cert-v88__logo {
    transform: translateX(-6px) scale(1.03);
  }

  .cert-v88__tag-area {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
  }

  .cert-v88__guimbal-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.35rem 0.9rem;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    letter-spacing: 0.05em;
  }

  .cert-v88__hint { font-size: 0.75rem; color: #60a5fa; }

  /* ===== V89 — Angular Slice ===== */
  .cert-v89 { width: 100%; max-width: 700px; }

  .cert-v89__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v89__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v89__upper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 2rem;
    clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%);
    background: linear-gradient(160deg, #1e1e1e 0%, #2a2a2a 100%);
  }

  .cert-v89__logo { height: 95px; width: auto; }

  .cert-v89__lower {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 2rem 0.25rem;
    margin-top: -0.5rem;
  }

  .cert-v89__guimbal-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v89__guimbal-sub {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.18);
  }

  .cert-v89__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V90 — 3D Rotate ===== */
  .cert-v90 { width: 100%; max-width: 700px; }

  .cert-v90__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v90__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v90__stage {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 1rem;
    perspective: 600px;
  }

  .cert-v90__logo {
    height: 95px;
    width: auto;
    transition: transform 0.6s ease;
  }
  .cert-v90__card:hover .cert-v90__logo {
    animation: cert-v90-spin 2.5s ease-in-out infinite;
  }

  @keyframes cert-v90-spin {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(15deg); }
    100% { transform: rotateY(0deg); }
  }

  .cert-v90__below {
    text-align: center;
    padding: 0.5rem 2rem 0.25rem;
  }

  .cert-v90__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v90__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.18);
  }

  .cert-v90__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V91 — Cinematic Wide ===== */
  .cert-v91 { width: 100%; max-width: 700px; }

  .cert-v91__card {
    background: #0a0a0a;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v91__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v91__letterbox {
    position: relative;
  }

  .cert-v91__bar {
    height: 18px;
    background: #000;
  }

  .cert-v91__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 2rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
    gap: 0.75rem;
  }

  .cert-v91__logo { height: 85px; width: auto; }

  .cert-v91__subtitle {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 0.15em;
  }

  .cert-v91__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V92 — Parallax Layers ===== */
  .cert-v92 { width: 100%; max-width: 700px; }

  .cert-v92__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v92__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v92__layers {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    padding: 2rem;
  }

  .cert-v92__bg-layer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-42%, -35%);
    z-index: 1;
  }

  .cert-v92__bg-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.04);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    white-space: nowrap;
    user-select: none;
  }

  .cert-v92__fg-layer {
    position: relative;
    z-index: 2;
  }

  .cert-v92__logo {
    height: 100px;
    width: auto;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4));
    transition: transform 0.3s ease;
  }
  .cert-v92__card:hover .cert-v92__logo {
    transform: translateY(-4px) scale(1.02);
  }

  .cert-v92__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V93 — Diamond Split ===== */
  .cert-v93 { width: 100%; max-width: 700px; }

  .cert-v93__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v93__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v93__diamond-zone {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem 1.5rem;
    min-height: 180px;
  }

  .cert-v93__diamond {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 180px;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.08) 0%, rgba(96, 165, 250, 0.03) 100%);
    border: 1px solid rgba(96, 165, 250, 0.15);
    transition: transform 0.3s ease;
  }
  .cert-v93__card:hover .cert-v93__diamond {
    transform: rotate(3deg) scale(1.03);
  }

  .cert-v93__logo { height: 70px; width: auto; }

  .cert-v93__corner-text {
    position: absolute;
    bottom: 1.5rem;
    right: 2rem;
    text-align: right;
  }

  .cert-v93__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v93__guimbal-sub {
    display: block;
    font-size: 0.45rem;
    color: rgba(255, 255, 255, 0.18);
  }

  .cert-v93__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V94 — Isometric ===== */
  .cert-v94 { width: 100%; max-width: 700px; }

  .cert-v94__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v94__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v94__iso-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 0.5rem;
    perspective: 1000px;
  }

  .cert-v94__iso-plane {
    transform: rotateX(45deg) rotateZ(-30deg);
    transform-style: preserve-3d;
    padding: 1.5rem 2.5rem;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.06) 0%, rgba(96, 165, 250, 0.02) 100%);
    border: 1px solid rgba(96, 165, 250, 0.12);
    border-radius: 8px;
    box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.15),
                20px 20px 0 rgba(0, 0, 0, 0.08);
    transition: transform 0.4s ease;
  }
  .cert-v94__card:hover .cert-v94__iso-plane {
    transform: rotateX(42deg) rotateZ(-28deg) translateZ(5px);
  }

  .cert-v94__logo { height: 80px; width: auto; display: block; }

  .cert-v94__flat-label {
    text-align: center;
    padding: 1.5rem 2rem 0.25rem;
  }

  .cert-v94__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v94__guimbal-sub {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.18);
  }

  .cert-v94__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V95 — Hero Gradient Mask ===== */
  .cert-v95 { width: 100%; max-width: 700px; }

  .cert-v95__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v95__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v95__hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 0;
  }

  .cert-v95__logo {
    height: 110px;
    width: auto;
    position: relative;
    z-index: 1;
  }

  .cert-v95__fade-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to bottom, transparent 0%, #1e1e1e 90%);
    z-index: 2;
    pointer-events: none;
  }

  .cert-v95__emerge {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 0 2rem 0.25rem;
    margin-top: -1rem;
  }

  .cert-v95__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v95__guimbal-sub {
    display: block;
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.25);
  }

  .cert-v95__hint { display: block; text-align: center; padding: 0.75rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; position: relative; z-index: 3; }

  /* ===== V96 — Geometric Frame ===== */
  .cert-v96 { width: 100%; max-width: 700px; }

  .cert-v96__card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v96__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v96__frame-zone {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 1rem;
    min-height: 180px;
  }

  .cert-v96__hexagon {
    position: absolute;
    width: 180px;
    height: 174px;
    opacity: 0.6;
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
  .cert-v96__card:hover .cert-v96__hexagon {
    transform: rotate(8deg) scale(1.05);
    opacity: 0.8;
  }

  .cert-v96__logo {
    height: 80px;
    width: auto;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));
  }

  .cert-v96__annotation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4rem;
    padding: 0 2rem 0.25rem;
  }

  .cert-v96__guimbal-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .cert-v96__guimbal-sub {
    font-size: 0.45rem;
    color: rgba(255, 255, 255, 0.18);
  }

  .cert-v96__hint { display: block; text-align: center; padding: 0.5rem 2rem 1.5rem; font-size: 0.75rem; color: #60a5fa; }

  /* ===== V97 — Hero Split Dots (merged: hero + diagonal clip-path + dots) ===== */
  .cert-v97 { width: 100%; max-width: 700px; }

  .cert-v97__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v97__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  /* Dot grid background */
  .cert-v97__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
  }

  /* Diagonal split layout (clip-path from cert-79) */
  .cert-v97__split {
    position: relative;
    display: flex;
    min-height: 140px;
    z-index: 1;
  }

  .cert-v97__upper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }

  .cert-v97__lower {
    position: absolute;
    right: 2rem;
    top: 65%;
    transform: translateY(-50%);
    text-align: right;
  }

  .cert-v97__logo { height: 130px; width: auto; }

  .cert-v97__guimbal-name {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .cert-v97__guimbal-sub {
    display: block;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .cert-v97__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #60a5fa; position: relative; z-index: 1; }

  /* ===== V98 — Dealer Split Dots ===== */
  .cert-v98 { width: 100%; max-width: 700px; }

  .cert-v98__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v98__card:hover { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3); }

  .cert-v98__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
  }

  .cert-v98__split {
    position: relative;
    display: flex;
    min-height: 140px;
    z-index: 1;
  }

  .cert-v98__upper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }

  .cert-v98__logo { height: 130px; width: auto; }

  .cert-v98__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #60a5fa; position: relative; z-index: 1; }

  .cert-v98__expanded { position: relative; z-index: 1; }

  .cert-v98__body { padding: 1.5rem 2.5rem 16px; }

  .cert-v98__label {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    color: #60a5fa;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .cert-v98__title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }

  .cert-v98__desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.5;
    margin: 0 0 1.25rem;
  }

  .cert-v98__stats {
    display: flex;
    gap: 2rem;
  }

  .cert-v98__stat { text-align: center; }

  .cert-v98__stat-value {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #fff;
  }

  .cert-v98__stat-label {
    display: block;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ===== V99 — Soft Shadow ===== */
  .cert-v99 { width: 100%; max-width: 700px; }
  .cert-v99__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15), 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  .cert-v99__card:hover { box-shadow: 0 12px 50px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.12); }
  .cert-v99__dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none; z-index: 0;
  }

  /* ===== V100 — Light Card ===== */
  .cert-v100 { width: 100%; max-width: 700px; }
  .cert-v100__card {
    position: relative;
    background: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .cert-v100__card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }

  .cert-v100__split {
    position: relative; display: flex; min-height: 140px;
  }
  .cert-v100__upper {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;
    background: rgba(0, 0, 0, 0.02);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }
  .cert-v100__lower {
    position: absolute; right: 2rem; top: 65%; transform: translateY(-50%); text-align: right;
  }
  .cert-v100__logo { height: 130px; width: auto; }
  .cert-v100__guimbal-name {
    display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem;
    font-weight: 700; color: rgba(0, 0, 0, 0.35); letter-spacing: 0.15em; text-transform: uppercase;
  }
  .cert-v100__guimbal-sub { display: block; font-size: 0.6rem; color: rgba(0, 0, 0, 0.25); }
  .cert-v100__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #2563eb; }

  .cert-v100__expanded {
    border-top: 1px solid rgba(0, 0, 0, 0.08); animation: certExpand 0.3s ease; text-align: center;
  }
  .cert-v100__title {
    font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #111; margin: 0 0 0.75rem;
  }
  .cert-v100__desc { font-size: 0.85rem; line-height: 1.6; color: rgba(0, 0, 0, 0.55); margin: 0 0 1.5rem; }
  .cert-v100__label {
    display: inline-block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em;
    color: #2563eb; background: rgba(37, 99, 235, 0.08); padding: 0.25rem 0.75rem; border-radius: 20px; margin: 0 0 1.5rem;
  }
  .cert-v100__stats {
    display: flex; justify-content: center; gap: 2rem; padding: 1rem 0 0;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
  .cert-v100__stat { text-align: center; flex: 1; }
  .cert-v100__stat-value { display: block; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #111; }
  .cert-v100__stat-label { display: block; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(0, 0, 0, 0.4); margin-top: 0.2rem; }
  .cert-v100__footer {
    padding: 1rem 1.5rem; background: #eee; border-top: 1px solid rgba(0, 0, 0, 0.06); text-align: center;
  }
  .cert-v100__footer-label { display: block; font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(0, 0, 0, 0.3); margin-bottom: 0.6rem; }
  .cert-v100__pill {
    font-size: 0.6rem; font-weight: 600; color: rgba(0, 0, 0, 0.6);
    padding: 0.3rem 0.75rem; border-radius: 20px; background: rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* ===== V101 — Glass Frost ===== */
  .cert-v101 { width: 100%; max-width: 700px; }
  .cert-v101__card {
    position: relative;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }
  .cert-v101__card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
  .cert-v101__upper {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;
    background: rgba(0, 0, 0, 0.02);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }
  .cert-v101__guimbal-name {
    display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem;
    font-weight: 700; color: rgba(0, 0, 0, 0.3); letter-spacing: 0.15em; text-transform: uppercase;
  }
  .cert-v101__guimbal-sub { display: block; font-size: 0.6rem; color: rgba(0, 0, 0, 0.2); }
  .cert-v101__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #2563eb; }

  /* ===== V102 — Gradient Fade ===== */
  .cert-v102 { width: 100%; max-width: 700px; }
  .cert-v102__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    mask-image: radial-gradient(ellipse 90% 85% at center, black 60%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 90% 85% at center, black 60%, transparent 100%);
  }
  .cert-v102__dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none; z-index: 0;
  }

  /* ===== V103 — Outline Only ===== */
  .cert-v103 { width: 100%; max-width: 700px; }
  .cert-v103__card {
    position: relative;
    background: #fff;
    border: 1.5px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cert-v103__card:hover { border-color: #bbb; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); }
  .cert-v103__upper {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;
    background: rgba(0, 0, 0, 0.01);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }
  .cert-v103__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #2563eb; }

  /* ===== V104 — Warm Slate ===== */
  .cert-v104 { width: 100%; max-width: 700px; }
  .cert-v104__card {
    position: relative;
    background: linear-gradient(135deg, #2a2d35 0%, #363a45 100%);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 30px rgba(42, 45, 53, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .cert-v104__card:hover { box-shadow: 0 10px 40px rgba(42, 45, 53, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15); }

  /* ===== V105 — Navy Deep ===== */
  .cert-v105 { width: 100%; max-width: 700px; }
  .cert-v105__card {
    position: relative;
    background: linear-gradient(135deg, #1a1e2e 0%, #252a3a 100%);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 30px rgba(26, 30, 46, 0.35), 0 2px 8px rgba(0, 0, 50, 0.1);
  }
  .cert-v105__card:hover { box-shadow: 0 10px 40px rgba(26, 30, 46, 0.5), 0 4px 12px rgba(0, 0, 80, 0.15); }

  /* ===== V106 — Elevated White ===== */
  .cert-v106 { width: 100%; max-width: 700px; }
  .cert-v106__card {
    position: relative;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 4px 8px rgba(0, 0, 0, 0.04),
      0 8px 16px rgba(0, 0, 0, 0.04),
      0 16px 32px rgba(0, 0, 0, 0.04);
  }
  .cert-v106__card:hover {
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 4px 8px rgba(0, 0, 0, 0.06),
      0 8px 16px rgba(0, 0, 0, 0.06),
      0 16px 32px rgba(0, 0, 0, 0.06),
      0 32px 64px rgba(0, 0, 0, 0.04);
  }
  .cert-v106__upper {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;
    background: rgba(0, 0, 0, 0.015);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }
  .cert-v106__hint { display: block; text-align: center; padding: 12px 2rem; font-size: 0.75rem; color: #2563eb; }

  /* ===== V107 — Border Gradient ===== */
  .cert-v107 { width: 100%; max-width: 700px; }
  .cert-v107__border {
    padding: 2px;
    border-radius: 14px;
    background: linear-gradient(135deg, #444 0%, #ddd 50%, #444 100%);
  }
  .cert-v107__card {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  /* ===== V108 — Charcoal Soft ===== */
  .cert-v108 { width: 100%; max-width: 700px; }
  .cert-v108__card {
    position: relative;
    background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 50px rgba(58, 58, 58, 0.25), 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  .cert-v108__card:hover { box-shadow: 0 14px 60px rgba(58, 58, 58, 0.35), 0 6px 20px rgba(0, 0, 0, 0.12); }

  /* ===== Shared light frost styles ===== */
  .cert-light__dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none; z-index: 0;
  }
  .cert-light__upper {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;
    background: rgba(0, 0, 0, 0.015);
    clip-path: polygon(0 0, 100% 0, 55% 100%, 0 100%);
  }

  /* ===== V109 — Warm Frost ===== */
  .cert-v109 { width: 100%; max-width: 700px; }
  .cert-v109__card {
    position: relative;
    background: rgba(245, 243, 240, 0.75);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }
  .cert-v109__card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }

  /* ===== V110 — Light Smoke ===== */
  .cert-v110 { width: 100%; max-width: 700px; }
  .cert-v110__card {
    position: relative;
    background: rgba(240, 240, 240, 0.8);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
  }
  .cert-v110__card:hover { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12); }

  /* ===== V111 — Pearl ===== */
  .cert-v111 { width: 100%; max-width: 700px; }
  .cert-v111__card {
    position: relative;
    background: rgba(248, 248, 250, 0.7);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  .cert-v111__card:hover { box-shadow: 0 6px 28px rgba(0, 0, 0, 0.08); }

  /* ===== V112 — Silver Frost ===== */
  .cert-v112 { width: 100%; max-width: 700px; }
  .cert-v112__card {
    position: relative;
    background: rgba(235, 237, 240, 0.8);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  }
  .cert-v112__card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); border-color: rgba(0, 0, 0, 0.14); }

  /* ===== V113 — Mist ===== */
  .cert-v113 { width: 100%; max-width: 700px; }
  .cert-v113__card {
    position: relative;
    background: rgba(230, 230, 230, 0.7);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.07);
  }
  .cert-v113__card:hover { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.11); }

  /* ===== V114 — Cloud ===== */
  .cert-v114 { width: 100%; max-width: 700px; }
  .cert-v114__card {
    position: relative;
    background: rgba(250, 250, 252, 0.65);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  .cert-v114__card:hover { box-shadow: 0 12px 50px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06); }

  /* ===== V115 — Ash Frost ===== */
  .cert-v115 { width: 100%; max-width: 700px; }
  .cert-v115__card {
    position: relative;
    background: rgba(220, 220, 225, 0.75);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }
  .cert-v115__card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13); }

  /* ===== V116 — Ivory Outline ===== */
  .cert-v116 { width: 100%; max-width: 700px; }
  .cert-v116__card {
    position: relative;
    background: rgba(252, 250, 245, 0.8);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
  .cert-v116__card:hover { border-color: rgba(0, 0, 0, 0.18); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }

  /* ===== V117 — Slate Frost ===== */
  .cert-v117 { width: 100%; max-width: 700px; }
  .cert-v117__card {
    position: relative;
    background: rgba(225, 228, 235, 0.8);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 50, 0.08);
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(0, 0, 40, 0.06);
  }
  .cert-v117__card:hover { box-shadow: 0 8px 32px rgba(0, 0, 40, 0.1); }

  /* ===== V118 — Cream Glass ===== */
  .cert-v118 { width: 100%; max-width: 700px; }
  .cert-v118__card {
    position: relative;
    background: rgba(248, 245, 240, 0.85);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(0, 0, 0, 0.07);
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 24px rgba(120, 100, 60, 0.06);
  }
  .cert-v118__card:hover { box-shadow: 0 8px 32px rgba(120, 100, 60, 0.1); }
`;
