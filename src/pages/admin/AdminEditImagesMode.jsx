/**
 * AdminEditImagesMode — visual image editor for all site pages.
 *
 * Sections are grouped in page-scroll order with group headers.
 * A page tab bar at the top switches between pages.
 * Each card has a "Find on page" link that opens the live page
 * with ?highlight=<section-id> so the admin can locate the section.
 *
 * Route: /admin/images  (admin-only)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SECTION_MAP } from '../../lib/imageSections';
import { useEditMode } from '../../context/EditModeContext';
import ImageEditDrawer from '../../components/admin/ImageEditDrawer';
import Seo from '../../components/seo/Seo';
import {
  listMediaLibrary,
  uploadToMediaLibrary,
  deleteFromMediaLibrary,
  fmtSize,
} from '../../lib/mediaLibrary';

// ─── Multi-page config ────────────────────────────────────────────────────────
const PAGES = [
  {
    id: 'home',
    label: 'Home',
    url: '/',
    groups: [
      {
        label: 'Hero Section',
        desc: 'Full-screen background at the very top of the page',
        sections: ['home-hero-slides', 'home-hero-slides-mobile'],
      },
      {
        label: 'About',
        desc: 'About HQ Aviation — founder story and video section',
        sections: ['home-about-carousel'],
      },
      {
        label: 'Training',
        desc: 'Parallax divider, 7 training tab images, plus 4 specialist service cards at the bottom',
        sections: ['home-parallax-flying', 'home-training-tabs', 'home-training-specialist'],
      },
      {
        label: 'Clubhouse',
        desc: 'The Clubhouse at Denham Aerodrome',
        sections: ['home-clubhouse-gallery', 'home-clubhouse-carousel'],
      },
      {
        label: 'Self-Fly Hire',
        desc: 'Aircraft fleet, desktop intro photo, and mobile carousel',
        sections: ['home-sfh-fleet', 'home-sfh-intro-img', 'home-sfh-mobile-carousel'],
      },
      {
        label: 'Photo Strip',
        desc: 'Two rows of horizontally scrolling editorial photos',
        sections: ['home-editorial-strip-1', 'home-editorial-strip-2'],
      },
      {
        label: 'Sales',
        desc: 'Parallax divider, new aircraft cards, then the intro photo grid',
        sections: ['home-parallax-sales', 'home-sales-aircraft', 'home-sales-intro-gallery', 'home-sales-mobile-carousel'],
      },
      {
        label: 'Maintenance',
        desc: 'Parallax divider then maintenance scroll galleries',
        sections: [
          'home-parallax-maintenance',
          'home-maint-scroll-1',
          'home-maint-scroll-2',
        ],
      },
      {
        label: 'Contact',
        desc: 'Parallax divider above the contact and location section',
        sections: ['home-parallax-contact'],
      },
    ],
    where: {
      'home-hero-slides':           'Top of page · Hero background (desktop)',
      'home-hero-slides-mobile':    'Top of page · Hero background (mobile)',
      'home-about-carousel':        'About section · Mobile founder carousel',
      'home-parallax-flying':       'Parallax divider · Flying section',
      'home-training-tabs':         'Training section · One image per tab (7 tabs)',
      'home-training-specialist':   'Training section · Specialist service cards at the bottom (4 cards)',
      'home-clubhouse-gallery':     'Clubhouse section · Desktop photo grid (9 slots)',
      'home-clubhouse-carousel':    'Clubhouse section · Mobile photo carousel',
      'home-sfh-fleet':             'Self-Fly Hire · Aircraft row images',
      'home-sfh-intro-img':         'Self-Fly Hire · Desktop intro carousel (two columns: left scrolls down, right scrolls up)',
      'home-sfh-mobile-carousel':   'Self-Fly Hire · Mobile photo carousel',
      'home-editorial-strip-1':     'Scrolling photo strip · Row 1',
      'home-editorial-strip-2':     'Scrolling photo strip · Row 2',
      'home-parallax-sales':        'Parallax divider · Sales section',
      'home-sales-aircraft':        'Sales · New aircraft model cutouts (R88, R66, R44, R22)',
      'home-sales-intro-gallery':   'Sales · Desktop intro photo grid',
      'home-sales-mobile-carousel': 'Sales · Mobile photo carousel',
      'home-parallax-maintenance':  'Parallax divider · Maintenance section',
      'home-maint-scroll-1':        'Maintenance · Scroll gallery left column',
      'home-maint-scroll-2':        'Maintenance · Scroll gallery right column',
      'home-parallax-contact':      'Parallax divider · Contact section',
    },
  },
  {
    id: 'discovery',
    label: 'Discovery',
    url: '/training/trial-lessons',
    groups: [
      { label: 'Hero', desc: 'Full-screen hero background at the top', sections: ['discovery-hero'] },
      { label: 'Aircraft Cards', desc: 'Booking cards for R22, R44, R66', sections: ['discovery-aircraft'] },
      { label: 'Your Instructor', desc: 'Portrait in the lead instructor section', sections: ['discovery-instructor'] },
    ],
    where: {
      'discovery-hero':       'Top of page · Full-screen hero background',
      'discovery-aircraft':   'Aircraft selection · One image per booking card (R22, R44, R66)',
      'discovery-instructor': '"Your Instructor" section · Lead instructor portrait',
    },
  },
  {
    id: 'sfh',
    label: 'Self-Fly Hire',
    url: '/self-fly-hire',
    groups: [
      { label: 'Hero', desc: 'Full-screen hero background at the top', sections: ['sfh-hero'] },
      { label: 'Fleet', desc: 'Aircraft images and fleet intro photo', sections: ['sfh-fleet', 'sfh-intro'] },
      { label: 'Destinations', desc: 'Gallery cycling across all destination cards', sections: ['sfh-destinations'] },
      { label: 'Call to Action', desc: 'Background in the booking CTA at the bottom', sections: ['sfh-cta'] },
    ],
    where: {
      'sfh-hero':         'Top of page · Full-screen hero background',
      'sfh-fleet':        'Fleet section · One aircraft image per tab (R22, R44, R66)',
      'sfh-intro':        'Fleet intro · Fleet photo beside introduction paragraph',
      'sfh-destinations': 'Destinations section · Gallery cycles across all destination cards',
      'sfh-cta':          'Bottom CTA · "Book Your First Flight" section background',
    },
  },
  {
    id: 'sales',
    label: 'Aircraft Sales',
    url: '/sales/new',
    groups: [
      { label: 'Aircraft Models', desc: 'Hero photos and cutout PNGs per model', sections: ['sales-aircraft-hero', 'sales-aircraft-cutout'] },
      { label: 'Photo Gallery', desc: 'Horizontal-scroll gallery of aircraft images', sections: ['sales-gallery'] },
    ],
    where: {
      'sales-aircraft-hero':   'Hero background · Atmospheric photo per model (R88, R66, R44, R22)',
      'sales-aircraft-cutout': 'Model selector · Transparent cutout PNG per model',
      'sales-gallery':         '"Recent Deliveries" section · Horizontal-scroll photo gallery (9 images)',
    },
  },
  {
    id: 'training',
    label: 'Training',
    url: '/training',
    groups: [
      { label: 'Introduction', desc: 'Photos in the opening and trial lesson sections', sections: ['training-intro', 'training-trial-lesson'] },
    ],
    where: {
      'training-intro':        'Opening section · Photo beside the first paragraph',
      'training-trial-lesson': '"What is a Trial Lesson?" section · Photo beside the text',
    },
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    url: '/maintenance',
    groups: [
      { label: 'Facility', desc: 'Hangar and certification photos', sections: ['maintenance-facility', 'maintenance-overhaul', 'maintenance-cert-logo'] },
      { label: 'Aircraft Models', desc: 'One image per supported aircraft card', sections: ['maintenance-aircraft'] },
    ],
    where: {
      'maintenance-facility':  'Opening section · Hangar photo beside first paragraph',
      'maintenance-overhaul':  'Certifications section · Robinson overhaul photo',
      'maintenance-cert-logo': 'Certifications section · Robinson authorised service badge',
      'maintenance-aircraft':  'Supported Models · One image per aircraft card (R22, R44, R66, Cabri G2)',
    },
  },
  {
    id: 'expeditions',
    label: 'Expeditions',
    url: '/expeditions',
    groups: [
      { label: 'Hero', desc: 'Full-screen hero background', sections: ['expeditions-hero'] },
      { label: 'Highlight Reel', desc: 'Thumbnail shown before the highlight video plays', sections: ['expeditions-highlight'] },
    ],
    where: {
      'expeditions-hero':      'Top of page · Full-screen hero background',
      'expeditions-highlight': 'Highlight section · Thumbnail before video plays',
    },
  },
  {
    id: 'about',
    label: 'About Us',
    url: '/about-us',
    groups: [
      { label: 'Hero', desc: 'Full-bleed background image behind the hero heading', sections: ['about-hero'] },
      { label: 'Story Gallery', desc: 'Six-photo mosaic in the "Built On Passion" section', sections: ['about-story-gallery'] },
      { label: 'Captain Q', desc: 'Parallax banner and founder portrait', sections: ['about-captain-q', 'about-founder'] },
      { label: 'Clubhouse', desc: 'Parallax banner and four-photo gallery', sections: ['about-clubhouse-parallax', 'about-clubhouse-gallery'] },
      { label: 'Services', desc: 'One image per service card — Training, Sales, Maintenance, Expeditions', sections: ['about-services'] },
      { label: 'Fleet', desc: 'One image per aircraft tab — R22, R44, R66', sections: ['about-fleet'] },
      { label: "Explorer's Club", desc: 'Parallax banner and side image', sections: ['about-explorer-parallax', 'about-explorer'] },
      { label: 'Certifications', desc: 'Accreditation logos and Robinson authorized badge', sections: ['about-certs', 'about-robinson'] },
      { label: 'CTA', desc: 'Background image behind the "Come and See Us" section', sections: ['about-cta'] },
    ],
    where: {
      'about-hero':               'Top of page · Full-bleed hero background image',
      'about-story-gallery':      '"Built On Passion" section · Six-photo mosaic grid',
      'about-captain-q':          '"Captain Q" banner · Parallax background',
      'about-founder':            '"Captain Q" section · Founder portrait photo',
      'about-clubhouse-parallax': '"The Clubhouse" banner · Parallax background',
      'about-clubhouse-gallery':  '"A Clubhouse" section · Four-photo grid',
      'about-services':           '"What We Do" section · Service card images',
      'about-fleet':              '"The Fleet" section · Aircraft tab images',
      'about-explorer-parallax':  '"Explorer\'s Club" banner · Parallax background',
      'about-explorer':           '"Beyond the Licence" section · Side image',
      'about-certs':              'Certifications bar · Six accreditation logos',
      'about-robinson':           'Robinson section · Authorized dealer badge',
      'about-cta':                '"Come and See Us" section · Background image',
    },
  },
  {
    id: 'fleet',
    label: 'Fleet',
    url: '/fleet',
    groups: [
      { label: 'Hero', desc: 'Full-screen hero background at the top', sections: ['fleet-hero'] },
      { label: 'Fleet Highlight', desc: 'Background image for the Fleet Highlight section', sections: ['fleet-highlight'] },
    ],
    where: {
      'fleet-hero':      'Top of page · Full-screen hero background',
      'fleet-highlight': 'Fleet Highlight section · Background image',
    },
  },
  {
    id: 'aircraft-sales',
    label: 'Aircraft Sales',
    url: '/aircraft-sales',
    groups: [
      { label: 'Aircraft Cards', desc: 'One image per model card — R22, R44, R66, R88', sections: ['aircraft-sales-cards'] },
    ],
    where: {
      'aircraft-sales-cards': 'Aircraft grid · One image per model card',
    },
  },
  {
    id: 'r22',
    label: 'R22',
    url: '/aircraft/r22',
    groups: [
      { label: 'Gallery', desc: 'Photo gallery grid', sections: ['r22-gallery'] },
    ],
    where: {
      'r22-gallery': 'Gallery section · Photo grid',
    },
  },
  {
    id: 'r44',
    label: 'R44',
    url: '/aircraft/r44',
    groups: [
      { label: 'Hero', desc: 'Full-screen hero background', sections: ['r44-hero'] },
      { label: 'Expeditions Map', desc: 'Three expedition route photos', sections: ['r44-expeditions-map'] },
      { label: 'Gallery', desc: 'Photo gallery grid', sections: ['r44-gallery'] },
    ],
    where: {
      'r44-hero':             'Top of page · Full-screen hero background',
      'r44-expeditions-map':  'Expedition Routes section · Globe, North Pole, South Pole photos',
      'r44-gallery':          'Gallery section · Photo grid',
    },
  },
  {
    id: 'r66',
    label: 'R66',
    url: '/aircraft/r66',
    groups: [
      { label: 'Hero', desc: 'Full-screen hero background', sections: ['r66-hero'] },
      { label: 'Gallery', desc: 'Photo gallery grid', sections: ['r66-gallery'] },
    ],
    where: {
      'r66-hero':    'Top of page · Full-screen hero background',
      'r66-gallery': 'Gallery section · Photo grid',
    },
  },
  {
    id: 'r88',
    label: 'R88',
    url: '/aircraft/r88',
    groups: [
      { label: 'Gallery', desc: 'Photo gallery grid', sections: ['r88-gallery'] },
    ],
    where: {
      'r88-gallery': 'Gallery section · Photo grid',
    },
  },
];

// Flat list of every section ID across all pages — used for Firestore load
const ALL_SECTION_IDS = PAGES.flatMap((p) => p.groups.flatMap((g) => g.sections));

const TYPE_LABEL = {
  gallery:  'Gallery',
  carousel: 'Carousel (fixed slots)',
  single:   'Single image',
  cards:    'Cards',
};

export default function AdminEditImagesMode() {
  const { openSection, activateEditMode, deactivateEditMode } = useEditMode();
  const [sectionImages, setSectionImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [viewportFilter, setViewportFilter] = useState('all'); // 'all' | 'desktop' | 'mobile'

  // ── Media Library state ────────────────────────────────────────────────────
  const [mlImages,    setMlImages]    = useState([]);
  const [mlLoading,   setMlLoading]   = useState(true);
  const [mlUploading, setMlUploading] = useState(false);
  const [mlProgress,  setMlProgress]  = useState([]); // filenames in-flight
  const [mlSearch,    setMlSearch]    = useState('');
  const [mlError,     setMlError]     = useState('');
  const mlFileRef = useRef(null);

  // Force edit mode on while on this page
  useEffect(() => {
    activateEditMode();
    return () => deactivateEditMode();
  }, [activateEditMode, deactivateEditMode]);

  // Load current images for all sections from Firestore (with defaults fallback)
  useEffect(() => {
    async function load() {
      const defaults = {};
      ALL_SECTION_IDS.forEach((id) => {
        defaults[id] = SECTION_MAP[id]?.images ?? [];
      });
      setSectionImages(defaults);

      try {
        const snap = await getDocs(collection(db, 'site_images'));
        const updates = {};
        snap.forEach((docSnap) => {
          if (ALL_SECTION_IDS.includes(docSnap.id)) {
            const data = docSnap.data();
            if (data.images?.length > 0) {
              updates[docSnap.id] = [...data.images].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0),
              );
            }
          }
        });
        if (Object.keys(updates).length > 0) {
          setSectionImages((prev) => ({ ...prev, ...updates }));
        }
      } catch {
        // Firestore unavailable — keep defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Derived: current page config
  const currentPage    = PAGES.find((p) => p.id === selectedPage) ?? PAGES[0];
  const currentGroups  = currentPage.groups;
  const currentWhere   = currentPage.where;
  const currentUrl     = currentPage.url;
  const currentSections = currentGroups.flatMap((g) => g.sections);

  // Filter a single section ID against the viewport toggle
  const sectionVisible = useCallback(
    (id) => {
      const vp = SECTION_MAP[id]?.viewport ?? 'both';
      if (viewportFilter === 'all') return true;
      if (viewportFilter === 'desktop') return vp === 'desktop' || vp === 'both';
      if (viewportFilter === 'mobile')  return vp === 'mobile'  || vp === 'both';
      return true;
    },
    [viewportFilter],
  );

  // Total visible count across all groups for the current page
  const visibleCount = currentSections.filter(sectionVisible).length;

  // ── Media Library load ────────────────────────────────────────────────────
  useEffect(() => {
    listMediaLibrary()
      .then(setMlImages)
      .catch((e) => {
        console.error('Media library load failed:', e);
        setMlError(`Could not load library: ${e.message ?? e.code ?? 'unknown error'}`);
      })
      .finally(() => setMlLoading(false));
  }, []);

  async function mlUpload(files) {
    const fileArr = Array.from(files);
    setMlUploading(true);
    setMlError('');
    setMlProgress(fileArr.map((f) => f.name));
    const results = [];
    const failed = [];
    for (const file of fileArr) {
      try {
        const img = await uploadToMediaLibrary(file);
        results.push(img);
      } catch (e) {
        console.error('Upload failed:', e);
        failed.push(`${file.name}: ${e.message ?? e.code ?? 'unknown error'}`);
      } finally {
        setMlProgress((prev) => prev.filter((n) => n !== file.name));
      }
    }
    if (results.length > 0) setMlImages((prev) => [...results, ...prev]);
    if (failed.length > 0) setMlError(`Upload failed — ${failed.join('; ')}`);
    setMlUploading(false);
  }

  async function mlDelete(img) {
    if (!window.confirm(`Delete "${img.name}"?\n\nAny section currently using this image will show as broken until replaced.`)) return;
    try {
      await deleteFromMediaLibrary(img.id, img.storagePath);
      setMlImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (e) {
      console.error('Delete failed:', e);
      setMlError(`Delete failed: ${e.message ?? e.code ?? 'unknown error'}`);
    }
  }

  const mlFiltered = mlSearch.trim()
    ? mlImages.filter((img) =>
        img.name?.toLowerCase().includes(mlSearch.trim().toLowerCase()),
      )
    : mlImages;

  return (
    <div style={page}>
      <Seo noindex />
      {/* Top bar */}
      <div style={topBar}>
        <Link to="/admin" style={backLink}>← Admin panel</Link>
        <div style={titleGroup}>
          <span style={editDot} />
          <span style={titleStyle}>Visual Image Editor</span>
          <span style={pagePill}>{currentPage.label}</span>
        </div>
        <span style={hint}>Click any section to edit its images</span>
        <div style={{ flex: 1 }} />
        {/* Viewport toggle */}
        <div style={vpToggleWrap}>
          {['all', 'desktop', 'mobile'].map((v) => (
            <button
              key={v}
              style={vpToggleBtn(viewportFilter === v)}
              onClick={() => setViewportFilter(v)}
            >
              {v === 'all' ? 'All' : v === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
            </button>
          ))}
        </div>
        <a href={currentUrl} target="_blank" rel="noreferrer" style={viewSite}>
          View page ↗
        </a>
      </div>

      {/* Page tab bar */}
      <div style={tabBar}>
        {PAGES.map((p) => (
          <button
            key={p.id}
            style={tabBtn(selectedPage === p.id)}
            onClick={() => setSelectedPage(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={content}>
        {loading ? (
          <div style={loadingMsg}>Loading sections…</div>
        ) : (
          <>
            <div style={sectionCount}>
              Showing {visibleCount} of {currentSections.length} sections
            </div>

            {currentGroups.map((group, gi) => {
              const visibleInGroup = group.sections.filter(sectionVisible);
              if (visibleInGroup.length === 0) return null;

              return (
                <div key={gi} style={groupWrap}>
                  {/* Group divider / header */}
                  <div style={groupHeader}>
                    <div style={groupHeaderLeft}>
                      <span style={groupStep}>{gi + 1}</span>
                      <div>
                        <div style={groupLabel}>{group.label}</div>
                        <div style={groupDesc}>{group.desc}</div>
                      </div>
                    </div>
                    <div style={groupLine} />
                  </div>

                  {/* Cards for this group */}
                  <div style={grid}>
                    {visibleInGroup.map((sectionId) => {
                      const meta    = SECTION_MAP[sectionId];
                      const vp      = meta?.viewport ?? 'both';
                      const images  = sectionImages[sectionId] ?? [];
                      const preview = images.slice(0, 6);
                      const extra   = images.length - preview.length;

                      return (
                        <button
                          key={sectionId}
                          style={card}
                          onClick={() => openSection(sectionId)}
                        >
                          {/* Card header */}
                          <div style={cardHeader}>
                            <div style={{ minWidth: 0 }}>
                              <div style={cardName}>{meta?.name}</div>
                              <div style={cardWhere}>{currentWhere[sectionId]}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                              <span style={typeTag(meta?.type)}>
                                {TYPE_LABEL[meta?.type] ?? meta?.type}
                              </span>
                              <span style={vpBadge(vp)}>
                                {vp === 'desktop' ? '🖥 Desktop only' : vp === 'mobile' ? '📱 Mobile only' : '🖥📱 Both'}
                              </span>
                            </div>
                          </div>

                          {/* Thumbnail grid */}
                          <div style={thumbGrid}>
                            {preview.map((img, i) => (
                              <div key={i} style={thumbWrap}>
                                <img src={img.url} alt={img.alt ?? ''} style={thumbImg} />
                                {(meta?.type === 'carousel' || meta?.type === 'cards') && meta?.slideLabels?.[i] && (
                                  <div style={slotLabel}>{meta.slideLabels[i]}</div>
                                )}
                              </div>
                            ))}
                            {extra > 0 && (
                              <div style={extraTile}>+{extra} more</div>
                            )}
                            {images.length === 0 && (
                              <div style={emptyTile}>No images yet</div>
                            )}
                          </div>

                          {/* Card footer */}
                          <div style={cardFooter}>
                            <span style={countBadge}>
                              {images.length} image{images.length !== 1 ? 's' : ''}
                            </span>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              {/* Find on page button — stops propagation so it doesn't open the drawer */}
                              <a
                                href={`${currentUrl}?highlight=${sectionId}`}
                                target="_blank"
                                rel="noreferrer"
                                style={findBtn}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Find on page ↗
                              </a>
                              <span style={editCta}>Edit →</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ── Media Library ─────────────────────────────────────────────────── */}
      <div style={mlSection}>
        {/* Section header */}
        <div style={mlHeader}>
          <div style={mlHeaderLeft}>
            <div style={mlTitle}>Media Library</div>
            <div style={mlSubtitle}>
              Upload images here first, then pick them into any section above. All uploads are stored in Firebase.
            </div>
          </div>
          <div style={mlHeaderRight}>
            <input
              style={mlSearchInput}
              placeholder="Search…"
              value={mlSearch}
              onChange={(e) => setMlSearch(e.target.value)}
            />
            <label style={mlUploadLabel(mlUploading)}>
              <input
                ref={mlFileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                disabled={mlUploading}
                onChange={(e) => { mlUpload(e.target.files); e.target.value = ''; }}
              />
              {mlUploading ? 'Uploading…' : '↑ Upload images'}
            </label>
          </div>
        </div>

        {/* In-progress uploads */}
        {mlProgress.length > 0 && (
          <div style={mlProgressBar}>
            {mlProgress.map((name) => (
              <span key={name} style={mlProgressItem}>↑ {name}</span>
            ))}
          </div>
        )}

        {/* Error banner */}
        {mlError && (
          <div style={mlErrorBanner}>
            <span>⚠ {mlError}</span>
            <button style={mlErrorClose} onClick={() => setMlError('')}>✕</button>
          </div>
        )}

        {/* Image grid */}
        {mlLoading ? (
          <div style={mlEmpty}>Loading library…</div>
        ) : mlFiltered.length === 0 ? (
          <div style={mlEmpty}>
            {mlSearch ? 'No images match your search.' : 'No images yet — click "Upload images" to add your first one.'}
          </div>
        ) : (
          <>
            <div style={mlCount}>{mlFiltered.length} of {mlImages.length} image{mlImages.length !== 1 ? 's' : ''}</div>
            <div style={mlGrid}>
              {mlFiltered.map((img) => (
                <div key={img.id} style={mlCard}>
                  <div style={mlThumbWrap}>
                    <img src={img.url} alt={img.name} style={mlThumbImg} loading="lazy" />
                  </div>
                  <div style={mlCardMeta}>
                    <span style={mlCardName} title={img.name}>{img.name}</span>
                    <span style={mlCardSize}>{fmtSize(img.size)}</span>
                  </div>
                  <button
                    style={mlDeleteBtn}
                    onClick={() => mlDelete(img)}
                    title="Delete from library"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Slide-in edit drawer */}
      <ImageEditDrawer />
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const BAR_HEIGHT = 52;
const TAB_HEIGHT = 42;

const page = {
  minHeight: '100vh',
  background: '#f8fafc',
  fontFamily: "'Inter', 'Space Grotesk', sans-serif",
};

const topBar = {
  position: 'sticky',
  top: 0,
  zIndex: 9999,
  height: BAR_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '0 24px',
  background: '#0f172a',
  borderBottom: '2px solid #f59e0b',
};

const backLink = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
};

const titleGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const editDot = {
  width: 8, height: 8, borderRadius: '50%',
  background: '#f59e0b',
  display: 'inline-block',
};

const titleStyle = {
  color: '#f1f5f9',
  fontWeight: 700,
  fontSize: '0.9rem',
};

const pagePill = {
  background: '#f59e0b',
  color: '#0f172a',
  fontWeight: 700,
  fontSize: '0.62rem',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  padding: '2px 8px',
  borderRadius: 9999,
};

const hint = {
  color: '#475569',
  fontSize: '0.72rem',
  fontStyle: 'italic',
};

const vpToggleWrap = {
  display: 'flex',
  gap: 4,
  background: '#1e293b',
  borderRadius: 6,
  padding: 3,
};

const vpToggleBtn = (active) => ({
  padding: '3px 10px',
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.68rem',
  fontWeight: 600,
  background: active ? '#f59e0b' : 'transparent',
  color: active ? '#0f172a' : '#94a3b8',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
});

const viewSite = {
  color: '#60a5fa',
  fontSize: '0.75rem',
  fontWeight: 600,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

// ─── Page tab bar ─────────────────────────────────────────────────────────────

const tabBar = {
  position: 'sticky',
  top: BAR_HEIGHT,
  zIndex: 9998,
  height: TAB_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '0 24px',
  background: '#1e293b',
  borderBottom: '1px solid #334155',
  overflowX: 'auto',
  scrollbarWidth: 'none',
};

const tabBtn = (active) => ({
  padding: '6px 14px',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: active ? 700 : 500,
  background: active ? '#f59e0b' : 'transparent',
  color: active ? '#0f172a' : '#94a3b8',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s',
  flexShrink: 0,
});

// ─── Content ──────────────────────────────────────────────────────────────────

const content = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '28px 24px',
};

const sectionCount = {
  fontSize: '0.72rem',
  color: '#94a3b8',
  marginBottom: 24,
};

const loadingMsg = {
  color: '#94a3b8',
  textAlign: 'center',
  padding: '60px 0',
  fontSize: '0.9rem',
};

// ─── Group header styles ──────────────────────────────────────────────────────

const groupWrap = {
  marginBottom: 36,
};

const groupHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: 14,
};

const groupHeaderLeft = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexShrink: 0,
};

const groupStep = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#0f172a',
  color: '#f59e0b',
  fontSize: '0.7rem',
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  letterSpacing: '-0.03em',
};

const groupLabel = {
  fontWeight: 700,
  fontSize: '0.82rem',
  color: '#0f172a',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const groupDesc = {
  fontSize: '0.65rem',
  color: '#64748b',
  marginTop: 1,
};

const groupLine = {
  flex: 1,
  height: 1,
  background: '#e2e8f0',
};

// ─── Card styles ─────────────────────────────────────────────────────────────

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 14,
};

const card = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
  overflow: 'hidden',
  transition: 'box-shadow 0.15s, border-color 0.15s',
  display: 'flex',
  flexDirection: 'column',
};

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '12px 14px 10px',
  borderBottom: '1px solid #f1f5f9',
  gap: 8,
};

const cardName = {
  fontWeight: 700,
  fontSize: '0.85rem',
  color: '#0f172a',
  marginBottom: 3,
};

const cardWhere = {
  fontSize: '0.68rem',
  color: '#64748b',
};

const typeTag = (type) => ({
  flexShrink: 0,
  display: 'inline-block',
  fontSize: '0.58rem',
  fontWeight: 700,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  padding: '2px 7px',
  borderRadius: 9999,
  ...(type === 'gallery'  ? { background: '#d1fae5', color: '#065f46' } :
      type === 'carousel' ? { background: '#ede9fe', color: '#7c3aed' } :
      type === 'cards'    ? { background: '#fef3c7', color: '#92400e' } :
                            { background: '#dbeafe', color: '#1d4ed8' }),
});

const vpBadge = (vp) => ({
  display: 'inline-block',
  fontSize: '0.55rem',
  padding: '1px 6px',
  borderRadius: 9999,
  fontWeight: 600,
  background: vp === 'mobile' ? '#fce7f3' : vp === 'desktop' ? '#e0f2fe' : '#f1f5f9',
  color: vp === 'mobile' ? '#9d174d' : vp === 'desktop' ? '#0369a1' : '#475569',
});

const thumbGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 3,
  padding: '3px 3px',
  background: '#f8fafc',
  flex: 1,
  minHeight: 80,
};

const thumbWrap = {
  position: 'relative',
  aspectRatio: '4/3',
  overflow: 'hidden',
  background: '#e2e8f0',
};

const thumbImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const slotLabel = {
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  fontSize: '0.55rem',
  fontWeight: 700,
  padding: '2px 4px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  lineHeight: 1.3,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

const extraTile = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f1f5f9',
  color: '#64748b',
  fontSize: '0.75rem',
  fontWeight: 600,
  aspectRatio: '4/3',
};

const emptyTile = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8fafc',
  color: '#94a3b8',
  fontSize: '0.68rem',
  gridColumn: '1 / -1',
  padding: '16px',
};

const cardFooter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 14px',
  borderTop: '1px solid #f1f5f9',
};

const countBadge = {
  fontSize: '0.72rem',
  color: '#94a3b8',
};

const findBtn = {
  fontSize: '0.68rem',
  fontWeight: 600,
  color: '#60a5fa',
  textDecoration: 'none',
  padding: '2px 6px',
  borderRadius: 4,
  background: '#eff6ff',
  whiteSpace: 'nowrap',
};

const editCta = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#f59e0b',
};

// ─── Media Library styles ─────────────────────────────────────────────────────

const mlSection = {
  borderTop: '2px solid #e2e8f0',
  marginTop: 16,
  padding: '32px 24px 48px',
  maxWidth: 1200,
  margin: '16px auto 0',
};

const mlHeader = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 20,
  flexWrap: 'wrap',
};

const mlHeaderLeft = {
  flex: 1,
  minWidth: 0,
};

const mlTitle = {
  fontWeight: 800,
  fontSize: '1.1rem',
  color: '#0f172a',
  marginBottom: 4,
  letterSpacing: '-0.01em',
};

const mlSubtitle = {
  fontSize: '0.75rem',
  color: '#64748b',
  lineHeight: 1.5,
};

const mlHeaderRight = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
};

const mlSearchInput = {
  border: '1px solid #d1d5db',
  borderRadius: 6,
  padding: '7px 11px',
  fontSize: '0.8rem',
  outline: 'none',
  width: 200,
  color: '#374151',
};

const mlUploadLabel = (disabled) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 18px',
  borderRadius: 7,
  background: disabled ? '#e2e8f0' : '#0f172a',
  color: disabled ? '#94a3b8' : '#fff',
  fontSize: '0.8rem',
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});

const mlProgressBar = {
  marginBottom: 12,
  padding: '8px 12px',
  background: '#fefce8',
  border: '1px solid #fde68a',
  borderRadius: 6,
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
};

const mlProgressItem = {
  fontSize: '0.72rem',
  color: '#92400e',
  fontWeight: 600,
};

const mlCount = {
  fontSize: '0.72rem',
  color: '#94a3b8',
  marginBottom: 12,
};

const mlEmpty = {
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: '0.85rem',
  padding: '40px 0',
};

const mlGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 14,
};

const mlCard = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const mlThumbWrap = {
  aspectRatio: '4/3',
  overflow: 'hidden',
  background: '#f1f5f9',
};

const mlThumbImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const mlCardMeta = {
  padding: '7px 9px 2px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
};

const mlCardName = {
  fontSize: '0.7rem',
  color: '#374151',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const mlCardSize = {
  fontSize: '0.62rem',
  color: '#94a3b8',
};

const mlDeleteBtn = {
  border: 'none',
  borderTop: '1px solid #f1f5f9',
  background: 'none',
  color: '#ef4444',
  fontSize: '0.68rem',
  fontWeight: 600,
  padding: '6px 9px',
  cursor: 'pointer',
  textAlign: 'left',
};

const mlErrorBanner = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '9px 14px',
  marginBottom: 12,
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: 6,
  fontSize: '0.75rem',
  color: '#b91c1c',
  fontWeight: 500,
};

const mlErrorClose = {
  border: 'none',
  background: 'none',
  color: '#b91c1c',
  cursor: 'pointer',
  fontSize: '0.8rem',
  padding: 2,
  flexShrink: 0,
};
