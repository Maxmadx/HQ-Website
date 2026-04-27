import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';

/* ─── Fallback gallery (used until Firestore loads, or if it fails) ─── */
const FALLBACK_IMAGES = [
  { src: '/assets/images/gallery/social/img-20241004-wa0001.jpg', alt: 'Community' },
  { src: '/assets/images/gallery/flying/flying--1.jpg', alt: 'Flying' },
  { src: '/assets/images/gallery/social/img-20230425-wa0001.jpg', alt: 'Team' },
  { src: '/assets/images/expeditions/north-pole.jpg', alt: 'North Pole' },
  { src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Expedition' },
  { src: '/assets/images/lifestyle/superyacht-ops.jpg', alt: 'Superyacht' },
  { src: '/assets/images/facility/fleet-lineup-sunset.jpg', alt: 'Fleet' },
  { src: '/assets/images/gallery/flying/james-shadow-night.jpg', alt: 'Night flying' },
];

const PAGE_SIZE = 6; // 3 cols × 2 rows in this design

function buildPages(items) {
  const pages = [];
  for (let i = 0; i < items.length; i += PAGE_SIZE) {
    pages.push(items.slice(i, i + PAGE_SIZE));
  }
  return pages.length ? pages : [items];
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

export default function WallOfCoolGr11() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Firestore-sourced gallery (same collection as EditorialGrid)
  const [galleryPages, setGalleryPages] = useState(() => buildPages(FALLBACK_IMAGES));
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const q = query(collection(db, 'wall_of_cool'), where('status', '==', 'approved'));
        const snap = await getDocs(q);
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((d) => d.type === 'image' || !d.type)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((d) => ({ src: d.imageUrl, alt: d.alt || 'Wall of Cool' }));
        if (!cancelled && docs.length) setGalleryPages(buildPages(docs));
      } catch {
        // silently fall back
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = galleryPages.length;
  const prevPage = useCallback(() => setCurrentPage((p) => Math.max(0, p - 1)), []);
  const nextPage = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1)),
    [totalPages]
  );

  // Auto-expand the gallery when it scrolls into view (≥25% visible)
  useEffect(() => {
    if (expanded || !sectionRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio >= 0.25) {
          setExpanded(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [expanded]);

  // Scroll-driven row reveal: top row slides in from off-screen left and
  // bottom row from off-screen right as the section enters view. The CSS
  // reads --p (0 → 1) on the section element to drive the transforms.
  // Once --p reaches 1 it stays there — the animation is one-way; scrolling
  // back up does NOT reverse it.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let rafId = null;
    let maxP = 0;
    const update = () => {
      rafId = null;
      const gallery = section.querySelector('.wog11-gallery');
      if (!gallery) return;
      const grect = gallery.getBoundingClientRect();
      const catchTopPx = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--catch-top')
      ) || 90;
      // Trigger fires when the gallery's top edge crosses 40px below the
      // header (the user-specified target). At this scroll moment the
      // gallery is settled in the user's reading area — then the
      // 1-second CSS transition on .wog11-row plays the slide-in.
      const triggered = grect.top <= catchTopPx + 40;
      if (triggered && maxP < 1) {
        maxP = 1;
        section.style.setProperty('--p', '1');
      }
    };
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Lightbox ─────────────────────────────────────────────── */
  // Flat list across all pages so the lightbox can navigate the entire
  // gallery regardless of which page the user clicked from.
  const allImages = galleryPages.flat();
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const openLightbox = useCallback((i) => { setLbIndex(i); setLbOpen(true); }, []);
  const closeLightbox = useCallback(() => setLbOpen(false), []);
  const currentImages = galleryPages[currentPage] || [];

  useEffect(() => {
    if (!lbOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setLbIndex((p) => (p - 1 + allImages.length) % allImages.length);
      if (e.key === 'ArrowRight') setLbIndex((p) => (p + 1) % allImages.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lbOpen, allImages.length, closeLightbox]);

  /* ── Upload modal ─────────────────────────────────────────── */
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const closeUploadModal = useCallback(() => {
    if (uploading) return;
    setUploadOpen(false);
    setUploadedFiles([]);
    setUploadResult(null);
  }, [uploading]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = [...e.dataTransfer.files].filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (files.length) setUploadedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = [...e.target.files].filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (files.length) setUploadedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  }, []);

  const removeFile = useCallback((idx) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  async function handleUpload() {
    if (!uploadedFiles.length || uploading) return;
    setUploading(true);
    setUploadResult(null);
    let success = 0;
    let failed = 0;
    let lastError = '';

    for (const file of uploadedFiles) {
      try {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `wall-of-cool/${Date.now()}-${safeName}`;
        const sRef = storageRef(storage, path);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        const body = { type };
        if (type === 'image') body.imageUrl = url;
        else body.videoUrl = url;
        const res = await fetch('/api/wall-of-cool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          success++;
        } else {
          const data = await res.json().catch(() => ({}));
          lastError = data.error || `Server error ${res.status}`;
          failed++;
        }
      } catch (err) {
        console.error('Wall of Cool upload error:', err);
        lastError = err?.code || err?.message || String(err);
        failed++;
      }
    }

    setUploading(false);
    setUploadResult({ success, failed, errorMsg: lastError });

    if (failed === 0) {
      setTimeout(() => {
        setUploadOpen(false);
        setUploadedFiles([]);
        setUploadResult(null);
      }, 2500);
    }
  }

  /* ── Fullscreen overlay ───────────────────────────────────── */
  const [fsOpen, setFsOpen] = useState(false);
  const [fsSlide, setFsSlide] = useState(0);
  const [fsShowClock, setFsShowClock] = useState(false);
  const [fsClock, setFsClock] = useState('');
  const [fsIdle, setFsIdle] = useState(false);
  const [fsScrollMode, setFsScrollMode] = useState(false);
  const [fsSpeed, setFsSpeed] = useState(1);
  const [fsPaused, setFsPaused] = useState(true);
  const fsRow1Ref = useRef(null);
  const fsRow2Ref = useRef(null);

  const openFullscreen = useCallback(() => {
    setFsSlide(0);
    setFsScrollMode(false);
    setFsPaused(true);
    setFsOpen(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const closeFullscreen = useCallback(() => {
    setFsOpen(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && fsOpen) setFsOpen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [fsOpen]);

  useEffect(() => {
    if (!fsOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fsOpen, closeFullscreen]);

  useEffect(() => {
    if (!fsOpen) return undefined;
    let timer;
    const reset = () => {
      setFsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setFsIdle(true), 2500);
    };
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('mousedown', reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('mousedown', reset);
    };
  }, [fsOpen]);

  useEffect(() => {
    if (!fsOpen || fsScrollMode || fsPaused || !allImages.length) return undefined;
    const ms = 5000 / fsSpeed;
    const interval = setInterval(() => {
      setFsSlide((p) => (p + 1) % allImages.length);
    }, ms);
    return () => clearInterval(interval);
  }, [fsOpen, fsSpeed, fsScrollMode, fsPaused, allImages.length]);

  useEffect(() => {
    if (!fsOpen || !fsShowClock) return undefined;
    const tick = () => {
      setFsClock(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [fsOpen, fsShowClock]);

  useEffect(() => {
    if (!fsOpen || !fsScrollMode) return undefined;
    const rows = [
      { ref: fsRow1Ref, direction: -1, duration: 600000 },
      { ref: fsRow2Ref, direction: 1, duration: 550000 },
    ];
    const animations = [];
    rows.forEach(({ ref, direction, duration }) => {
      const el = ref.current;
      if (!el) return;
      const firstSet = el.querySelector('.fd-gallery-fs__scroll-set');
      if (!firstSet) return;
      const setWidth = firstSet.offsetWidth;
      const startX = direction === 1 ? -setWidth : 0;
      const endX = direction === 1 ? 0 : -setWidth;
      const anim = el.animate(
        [{ transform: `translateX(${startX}px)` }, { transform: `translateX(${endX}px)` }],
        { duration, iterations: Infinity, easing: 'linear' }
      );
      anim.playbackRate = fsSpeed;
      if (fsPaused) anim.pause();
      animations.push(anim);
    });
    return () => animations.forEach((a) => a.cancel());
  }, [fsOpen, fsScrollMode]);

  useEffect(() => {
    [fsRow1Ref, fsRow2Ref].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      el.getAnimations().forEach((a) => { a.playbackRate = fsSpeed; });
    });
  }, [fsSpeed]);

  useEffect(() => {
    if (!fsOpen || !fsScrollMode) return undefined;
    [fsRow1Ref, fsRow2Ref].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      el.getAnimations().forEach((a) => { fsPaused ? a.pause() : a.play(); });
    });
  }, [fsPaused, fsOpen, fsScrollMode]);

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <section className="wog11" id="community-wall" ref={sectionRef} style={{ '--p': 0 }}>
      <div className="wog11-fade-top" aria-hidden="true" />
      <div className="wog11-stack">
        {isMobile && (
          <header className="wog11-header-mobile">
            <span className="wog11-header-mobile__sub">Helicopter Adventures</span>
          </header>
        )}
        <div className={`wog11-gallery ${isMobile || expanded ? 'wog11-gallery--expanded' : 'wog11-gallery--collapsed'}`}>
          {isMobile ? (
            <div className="wog11-carousel-mobile">
              {allImages.map((img, i) => (
                <div
                  className="wog11-carousel-mobile__item"
                  key={`m-${i}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(i)}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
                >
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          ) : expanded ? (
            <>
              <div className="wog11-title-bg" aria-hidden="true">
                <span className="wog11-subtitle">Helicopter Adventures</span>
                <h2 className="wog11-title">Community Wall</h2>
              </div>
              <div className="wog11-grid">
                <div className="wog11-row wog11-row--top">
                  {currentImages.slice(0, 3).map((img, i) => {
                    const globalIndex = currentPage * PAGE_SIZE + i;
                    return (
                      <div
                        className="wog11-cell wog11-cell--img"
                        key={`grid-top-${currentPage}-${i}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => openLightbox(globalIndex)}
                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(globalIndex)}
                      >
                        <img src={img.src} alt={img.alt} loading="lazy" />
                      </div>
                    );
                  })}
                </div>
                <div className="wog11-row wog11-row--bottom">
                  {currentImages.slice(3, PAGE_SIZE).map((img, i) => {
                    const globalIndex = currentPage * PAGE_SIZE + 3 + i;
                    return (
                      <div
                        className="wog11-cell wog11-cell--img"
                        key={`grid-bot-${currentPage}-${i}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => openLightbox(globalIndex)}
                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(globalIndex)}
                      >
                        <img src={img.src} alt={img.alt} loading="lazy" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="wog11-teaser"
              onClick={() => setExpanded(true)}
              aria-expanded="false"
              aria-label="Expand community wall"
            >
              <div className="wog11-teaser-strip">
                {currentImages.slice(0, 6).map((img, i) => (
                  <div className="wog11-teaser-cell" key={`teaser-${i}`}>
                    <img src={img.src} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </button>
          )}
        </div>
        {(isMobile || expanded) && (
          <footer className="wog11-footer">
            <div className="wog11-footer__issue">Are you an HQ'er with some cool footage?</div>
            <div className="wog11-nav">
              <button
                className="wog11-chevron"
                aria-label="Previous page"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <i className="fas fa-chevron-left" />
              </button>
              <span className="wog11-count">{pad2(currentPage + 1)} / {pad2(totalPages)}</span>
              <button
                className="wog11-chevron"
                aria-label="Next page"
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
            <button
              className="wog11-footer__btn"
              onClick={() => { setUploadOpen(true); setUploadedFiles([]); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
            <button
              className="wog11-footer__btn"
              aria-label="Fullscreen gallery"
              onClick={openFullscreen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
              Fullscreen
            </button>
          </footer>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lbOpen && createPortal((() => {
        const img = allImages[lbIndex];
        return (
          <div className="woc-lb__backdrop" onClick={closeLightbox}>
            <button className="woc-lb__close" onClick={closeLightbox} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {allImages.length > 1 && (
              <button className="woc-lb__chevron woc-lb__chevron--prev" onClick={(e) => { e.stopPropagation(); setLbIndex((p) => (p - 1 + allImages.length) % allImages.length); }} aria-label="Previous">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            <div className="woc-lb__img-wrap" onClick={(e) => e.stopPropagation()}>
              <img src={img?.src} alt={img?.alt || ''} className="woc-lb__img" key={lbIndex} />
            </div>
            {allImages.length > 1 && (
              <button className="woc-lb__chevron woc-lb__chevron--next" onClick={(e) => { e.stopPropagation(); setLbIndex((p) => (p + 1) % allImages.length); }} aria-label="Next">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            )}
            <div className="woc-lb__counter">{lbIndex + 1} / {allImages.length}</div>
            <style>{`
              .woc-lb__backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; animation: wocLbFade 0.2s ease; }
              @keyframes wocLbFade { from { opacity: 0; } to { opacity: 1; } }
              .woc-lb__img-wrap { max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; }
              .woc-lb__img { max-width: 90vw; max-height: 90vh; object-fit: contain; display: block; animation: wocLbSlide 0.25s ease; }
              @keyframes wocLbSlide { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
              .woc-lb__close { position: fixed; top: 1rem; right: 1rem; width: 38px; height: 38px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); color: rgba(255,255,255,0.85); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; z-index: 2; }
              .woc-lb__close:hover { background: rgba(255,255,255,0.12); color: #fff; }
              .woc-lb__chevron { position: fixed; top: 50%; transform: translateY(-50%); width: 42px; height: 42px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); color: rgba(255,255,255,0.85); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; z-index: 2; }
              .woc-lb__chevron:hover { background: rgba(255,255,255,0.12); color: #fff; }
              .woc-lb__chevron--prev { left: 1rem; }
              .woc-lb__chevron--next { right: 1rem; }
              .woc-lb__counter { position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%); font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; color: rgba(255,255,255,0.45); }
              @media (min-width: 769px) {
                .woc-lb__close { top: 1.5rem; right: 1.5rem; width: 40px; height: 40px; }
                .woc-lb__chevron { width: 44px; height: 44px; }
                .woc-lb__chevron--prev { left: 1.5rem; }
                .woc-lb__chevron--next { right: 1.5rem; }
                .woc-lb__counter { bottom: 1.5rem; }
              }
            `}</style>
          </div>
        );
      })(), document.body)}

      {/* ── Upload modal ── */}
      {uploadOpen && createPortal(
        <div className="upload-modal__backdrop" onClick={closeUploadModal}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <button className="upload-modal__close" onClick={closeUploadModal} disabled={uploading} aria-label="Close">&times;</button>
            <div className="upload-modal__header">
              <h3>Upload</h3>
              <p>Upload any image or video of your HQ experience</p>
            </div>
            <div
              className={`upload-modal__dropzone${dragOver ? ' upload-modal__dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="upload-modal__input"
              />
              <svg className="upload-modal__icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="upload-modal__drop-text">{dragOver ? 'Drop files here' : 'Drag & drop files here'}</span>
              <span className="upload-modal__or">or</span>
              <span className="upload-modal__browse">Browse Files</span>
              <span className="upload-modal__formats">JPG, PNG, MP4, MOV</span>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="upload-modal__files">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="upload-modal__file">
                    <span className="upload-modal__file-name">{file.name}</span>
                    <span className="upload-modal__file-size">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    <button className="upload-modal__file-remove" onClick={() => removeFile(i)} aria-label="Remove">&times;</button>
                  </div>
                ))}
              </div>
            )}
            {uploadResult && (
              <div style={{
                margin: '12px 0 0',
                padding: '12px 16px',
                borderRadius: 8,
                background: uploadResult.failed === 0 ? '#d1fae5' : uploadResult.success === 0 ? '#fee2e2' : '#fef3c7',
                color: uploadResult.failed === 0 ? '#065f46' : uploadResult.success === 0 ? '#991b1b' : '#92400e',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {uploadResult.failed === 0
                  ? `✓ ${uploadResult.success} file${uploadResult.success !== 1 ? 's' : ''} submitted — thanks! Closing in a moment…`
                  : uploadResult.success === 0
                    ? `Upload failed: ${uploadResult.errorMsg}`
                    : `${uploadResult.success} uploaded, ${uploadResult.failed} failed: ${uploadResult.errorMsg}`}
              </div>
            )}
            {uploadedFiles.length > 0 && !uploadResult && (
              <button
                className="upload-modal__submit"
                onClick={handleUpload}
                disabled={uploading}
                style={{ opacity: uploading ? 0.7 : 1, cursor: uploading ? 'wait' : 'pointer' }}
              >
                {uploading ? 'Uploading…' : `Upload ${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''}`}
              </button>
            )}
            {uploadResult && uploadResult.failed > 0 && (
              <button
                className="upload-modal__submit"
                onClick={() => setUploadResult(null)}
                style={{ marginTop: 8, background: '#374151' }}
              >
                Try again
              </button>
            )}
          </div>
          <style>{`
            .upload-modal__backdrop { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; animation: uploadFadeIn 0.2s ease; }
            @keyframes uploadFadeIn { from { opacity: 0; } to { opacity: 1; } }
            .upload-modal { background: #fff; border-radius: 12px; width: 90%; max-width: 480px; padding: 2rem; position: relative; animation: uploadSlideUp 0.3s ease; }
            @keyframes uploadSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            .upload-modal__close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border: none; background: #f0f0f0; border-radius: 50%; font-size: 1.2rem; color: #666; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
            .upload-modal__close:hover { background: #e0e0e0; }
            .upload-modal__header { margin-bottom: 1.5rem; }
            .upload-modal__header h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.35rem; }
            .upload-modal__header p { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: #888; margin: 0; }
            .upload-modal__dropzone { border: 2px dashed #d0d0d0; border-radius: 10px; padding: 2.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; transition: border-color 0.2s, background 0.2s; position: relative; }
            .upload-modal__dropzone:hover { border-color: #999; background: #fafafa; }
            .upload-modal__dropzone--active { border-color: #1a1a1a; background: #f5f5f0; }
            .upload-modal__input { display: none; }
            .upload-modal__icon { color: #bbb; margin-bottom: 0.25rem; }
            .upload-modal__dropzone--active .upload-modal__icon { color: #1a1a1a; }
            .upload-modal__drop-text { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600; color: #555; }
            .upload-modal__or { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em; }
            .upload-modal__browse { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; color: #1a1a1a; text-decoration: underline; text-underline-offset: 2px; }
            .upload-modal__formats { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #bbb; letter-spacing: 0.08em; margin-top: 0.25rem; }
            .upload-modal__files { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
            .upload-modal__file { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; background: #f8f8f6; border-radius: 6px; border: 1px solid #eee; }
            .upload-modal__file-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 500; color: #333; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .upload-modal__file-size { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #999; flex-shrink: 0; }
            .upload-modal__file-remove { width: 22px; height: 22px; border: none; background: #eee; border-radius: 50%; font-size: 0.9rem; color: #999; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, color 0.2s; }
            .upload-modal__file-remove:hover { background: #ddd; color: #333; }
            .upload-modal__submit { margin-top: 1.25rem; width: 100%; padding: 0.75rem; background: #1a1a1a; color: #fff; border: none; border-radius: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em; cursor: pointer; transition: background 0.2s; }
            .upload-modal__submit:hover { background: #333; }
          `}</style>
        </div>,
        document.body
      )}

      {/* ── Fullscreen overlay ── */}
      {fsOpen && allImages.length > 0 && createPortal(
        <div className={`fd-gallery-fs${fsIdle ? ' fd-gallery-fs--idle' : ''}`} style={{ cursor: fsIdle ? 'none' : undefined }}>
          {fsShowClock && (<div className="fd-gallery-fs__clock">{fsClock}</div>)}
          {!fsScrollMode ? (
            <>
              <div className="fd-gallery-fs__img-wrap">
                <img src={allImages[fsSlide].src} alt={allImages[fsSlide].alt} className="fd-gallery-fs__img" key={fsSlide} />
              </div>
              <div className="fd-gallery-fs__controls">
                <button onClick={() => setFsSlide((p) => (p - 1 + allImages.length) % allImages.length)} aria-label="Previous">&lsaquo;</button>
                <span className="fd-gallery-fs__counter">{fsSlide + 1} / {allImages.length}</span>
                <button onClick={() => setFsSlide((p) => (p + 1) % allImages.length)} aria-label="Next">&rsaquo;</button>
              </div>
            </>
          ) : (
            <div className="fd-gallery-fs__scroll-view">
              <div className="fd-gallery-fs__scroll-row fd-gallery-fs__scroll-row--left" ref={fsRow1Ref}>
                <div className="fd-gallery-fs__scroll-set">
                  {allImages.map((img, i) => (
                    <div key={i} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                  ))}
                </div>
                <div className="fd-gallery-fs__scroll-set">
                  {allImages.map((img, i) => (
                    <div key={`d-${i}`} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                  ))}
                </div>
              </div>
              <div className="fd-gallery-fs__scroll-row fd-gallery-fs__scroll-row--right" ref={fsRow2Ref}>
                <div className="fd-gallery-fs__scroll-set">
                  {allImages.slice().reverse().map((img, i) => (
                    <div key={i} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                  ))}
                </div>
                <div className="fd-gallery-fs__scroll-set">
                  {allImages.slice().reverse().map((img, i) => (
                    <div key={`d-${i}`} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="fd-gallery-fs__speed-control">
            <button
              type="button"
              className="fd-gallery-fs__play-toggle"
              onClick={() => setFsPaused((p) => !p)}
              aria-label={fsPaused ? 'Play' : 'Pause'}
            >
              {fsPaused ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
              )}
            </button>
            <span className="fd-gallery-fs__speed-label">×{fsSpeed.toFixed(1)}</span>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={fsSpeed}
              onChange={(e) => setFsSpeed(parseFloat(e.target.value))}
              className="fd-gallery-fs__speed-slider"
            />
          </div>
          <button className="fd-gallery-fs__clock-toggle" onClick={() => setFsShowClock(!fsShowClock)} aria-label="Toggle clock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          </button>
          <button className="fd-gallery-fs__mode-toggle" onClick={() => setFsScrollMode(!fsScrollMode)} aria-label="Toggle scroll mode">
            {fsScrollMode ? 'Mode 1' : 'Mode 2'}
          </button>
          <button className="fd-gallery-fs__close" onClick={closeFullscreen} aria-label="Close fullscreen">&times;</button>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            html:fullscreen, html:fullscreen body { overflow: hidden !important; }
            :fullscreen { overflow: hidden !important; }
            .fd-gallery-fs { position: fixed; inset: 0; z-index: 10000; background: #000; display: flex; align-items: center; overflow: hidden; justify-content: center; }
            .fd-gallery-fs__img-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
            .fd-gallery-fs__img { width: 100%; height: 100%; object-fit: cover; animation: fdGalleryFade 0.8s ease; }
            @keyframes fdGalleryFade { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: scale(1); } }
            .fd-gallery-fs__clock { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 8vw, 8rem); font-weight: 400; letter-spacing: 0.15em; color: #fff; text-shadow: 0 0 60px rgba(255,255,255,0.15), 0 2px 40px rgba(0,0,0,0.5); z-index: 2; pointer-events: none; }
            .fd-gallery-fs__controls { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 1.5rem; z-index: 3; }
            .fd-gallery-fs__controls button { width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); color: #fff; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
            .fd-gallery-fs__controls button:hover { background: rgba(255,255,255,0.15); }
            .fd-gallery-fs__counter { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }
            .fd-gallery-fs__close { position: absolute; top: 1.5rem; right: 1.5rem; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); color: #fff; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 3; transition: background 0.2s; }
            .fd-gallery-fs__close:hover { background: rgba(255,255,255,0.15); }
            .fd-gallery-fs__clock-toggle { position: absolute; top: 1.5rem; right: 4.5rem; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 3; transition: background 0.2s; }
            .fd-gallery-fs__clock-toggle:hover { background: rgba(255,255,255,0.15); }
            .fd-gallery-fs__mode-toggle { position: absolute; top: 1.5rem; right: 7.5rem; height: 40px; padding: 0 0.85rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); color: #fff; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; z-index: 3; transition: background 0.2s; }
            .fd-gallery-fs__mode-toggle:hover { background: rgba(255,255,255,0.15); }
            .fd-gallery-fs__speed-control { position: absolute; top: 1.5rem; right: 13rem; height: 40px; display: flex; align-items: center; gap: 0.5rem; padding: 0 0.75rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); z-index: 3; }
            .fd-gallery-fs__speed-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #fff; letter-spacing: 0.05em; min-width: 2rem; text-align: center; }
            .fd-gallery-fs__play-toggle { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; padding: 0; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; transition: background 0.2s; }
            .fd-gallery-fs__play-toggle:hover { background: rgba(255,255,255,0.15); }
            .fd-gallery-fs__speed-slider { -webkit-appearance: none; appearance: none; width: 80px; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none; }
            .fd-gallery-fs__speed-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; }
            .fd-gallery-fs__speed-slider::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; border: none; }
            .fd-gallery-fs__scroll-view { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; overflow: hidden; }
            .fd-gallery-fs__scroll-row { display: flex; }
            .fd-gallery-fs__scroll-set { display: flex; gap: 0.5rem; flex-shrink: 0; padding-right: 0.5rem; }
            .fd-gallery-fs__scroll-row--left, .fd-gallery-fs__scroll-row--right { will-change: transform; }
            .fd-gallery-fs__scroll-img { flex-shrink: 0; height: calc(50vh - 0.5rem); aspect-ratio: 16/10; border-radius: 4px; overflow: hidden; }
            .fd-gallery-fs__scroll-img img { width: 100%; height: 100%; object-fit: cover; }
            .fd-gallery-fs__controls, .fd-gallery-fs__close, .fd-gallery-fs__clock-toggle, .fd-gallery-fs__mode-toggle, .fd-gallery-fs__speed-control, .fd-gallery-fs__counter { transition: opacity 0.5s ease, background 0.2s; }
            .fd-gallery-fs--idle .fd-gallery-fs__controls, .fd-gallery-fs--idle .fd-gallery-fs__close, .fd-gallery-fs--idle .fd-gallery-fs__clock-toggle, .fd-gallery-fs--idle .fd-gallery-fs__mode-toggle, .fd-gallery-fs--idle .fd-gallery-fs__speed-control, .fd-gallery-fs--idle .fd-gallery-fs__counter { opacity: 0; pointer-events: none; }
          `}</style>
        </div>,
        document.body
      )}

      <style>{`
        .wog11 { position: relative; z-index: 2; width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); background: #faf9f6; padding: 20px clamp(2rem, 8vw, 12rem) 0; font-family: 'Space Grotesk', -apple-system, sans-serif; color: #1a1a1a; box-sizing: border-box; box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.18); }
        .wog11-fade-top {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 100%;
          height: 20px;
          background: linear-gradient(to top, #faf9f6 0%, rgba(250, 249, 246, 0) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .wog11-stack { max-width: 100%; margin: 0 auto; padding-bottom: 6rem; display: flex; flex-direction: column; }

        .wog11-gallery { position: relative; overflow: hidden; background: #fff; border-radius: 10px 10px 0 0; display: flex; flex-direction: column; }
        .wog11-gallery--collapsed { border-radius: 10px; }
        .wog11-gallery--expanded { height: 80vh; min-height: 0; }

        /* Title sits centered behind the rows. As scroll progresses (--p
           goes 0 → 1) the rows slide in from outside and cover this title. */
        .wog11-title-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          color: #1a1a1a;
          text-align: center;
          padding: 1rem;
          pointer-events: none;
        }
        .wog11-title {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5.5vw, 4rem);
          line-height: 0.95;
          letter-spacing: -0.015em;
          text-transform: uppercase;
        }
        .wog11-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .wog11-grid {
          position: relative;
          z-index: 2;
          flex: 1 1 auto;
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 0;
          padding: 0;
          min-height: 0;
        }
        .wog11-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr;
          gap: 0;
          height: 100%;
          min-height: 0;
          will-change: transform;
          transition: transform 2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wog11-cell { min-height: 0; }
        /* --p comes from the section's scroll-progress hook (0 entering,
           1 fully in view). Top row enters from off-screen LEFT, bottom
           row from off-screen RIGHT. */
        .wog11-row--top {
          transform: translateX(calc((var(--p, 0) - 1) * 100%));
        }
        .wog11-row--bottom {
          transform: translateX(calc((1 - var(--p, 0)) * 100%));
        }
        .wog11-cell { position: relative; overflow: hidden; border: 1px solid #ffffff; background: #1a1a1a; cursor: pointer; }
        .wog11-cell img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
        .wog11-cell:hover img { transform: scale(1.04); }
        .wog11-row--top .wog11-cell--img { border-top: none; }
        .wog11-row--bottom .wog11-cell--img { border-bottom: none; }
        .wog11-row .wog11-cell--img:first-child { border-left-color: #9ca3af; }
        .wog11-row .wog11-cell--img:last-child  { border-right-color: #9ca3af; }

        .wog11-teaser {
          position: relative;
          flex: 0 0 auto;
          display: block;
          width: 100%;
          height: 160px;
          padding: 0;
          border: none;
          border-top: 1px solid #9ca3af;
          background: #0a0a0a;
          cursor: pointer;
          overflow: hidden;
          font: inherit;
          color: inherit;
          text-align: center;
        }
        .wog11-teaser-strip {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          height: 100%;
          width: 100%;
          filter: brightness(0.45) saturate(0.9);
          transition: filter 0.3s ease, transform 0.4s ease;
        }
        .wog11-teaser:hover .wog11-teaser-strip {
          filter: brightness(0.65) saturate(1);
          transform: scale(1.015);
        }
        .wog11-teaser-cell { position: relative; overflow: hidden; }
        .wog11-teaser-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 50%;
          transform: scale(1.6);
          display: block;
        }

        .wog11-footer {
          position: relative;
          flex: 0 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 0.9rem 1.25rem;
          background: #1a1a1a;
          color: #fff;
          border-radius: 0 0 10px 10px;
          border-bottom: 1px solid #9ca3af;
          border-left: 1px solid #9ca3af;
          border-right: 1px solid #9ca3af;
        }
        .wog11-footer__issue { flex: 1 1 auto; min-width: 160px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
        .wog11-footer__btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.85rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; color: #fff; font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
        .wog11-footer__btn:hover { background: rgba(255,255,255,0.1); }

        .wog11-nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 0.55rem; }
        .wog11-chevron { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(255,255,255,0.28); background: transparent; color: #fff; cursor: pointer; font-size: 0.65rem; }
        .wog11-chevron:disabled { opacity: 0.32; cursor: not-allowed; }
        .wog11-chevron:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
        .wog11-count { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; letter-spacing: 0.12em; min-width: 3.2rem; text-align: center; color: #fff; }

        @media (max-width: 768px) {
          .wog11 {
            padding: 0;
            box-shadow: none;
          }
          .wog11-fade-top { display: none; }
          .wog11-stack { padding-bottom: 3rem; }

          .wog11-header-mobile {
            background: #1a1a1a;
            color: #fff;
            border-radius: 10px 10px 0 0;
            border-top: 1px solid #9ca3af;
            border-left: 1px solid #9ca3af;
            border-right: 1px solid #9ca3af;
            min-height: 44px;
            padding: 0.5rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.15rem;
            text-align: center;
            box-sizing: border-box;
          }
          .wog11-header-mobile__sub {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.55rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.65);
          }
          .wog11-header-mobile__title {
            margin: 0;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: -0.005em;
            text-transform: uppercase;
            line-height: 1;
            color: #fff;
          }

          .wog11-gallery--expanded { height: auto; }
          .wog11-gallery {
            border-radius: 0;
            border-left: 1px solid #9ca3af;
            border-right: 1px solid #9ca3af;
            background: #fff;
          }

          .wog11-carousel-mobile {
            display: flex;
            gap: 6px;
            padding: 4px;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            touch-action: pan-x;
          }
          .wog11-carousel-mobile::-webkit-scrollbar { display: none; }
          .wog11-carousel-mobile__item {
            flex: 0 0 65vw;
            height: 200px;
            border-radius: 6px;
            overflow: hidden;
            background: #1a1a1a;
            cursor: pointer;
          }
          .wog11-carousel-mobile__item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            pointer-events: none;
          }

          .wog11-footer {
            min-height: 44px;
            padding: 0.5rem 0.75rem;
            gap: 0.5rem;
            flex-wrap: nowrap;
            box-sizing: border-box;
          }
          .wog11-footer__issue {
            flex: 1 1 auto;
            min-width: 0;
            font-size: 0.6rem;
            line-height: 1.2;
            text-align: left;
          }
          .wog11-nav { display: none; }
          .wog11-footer__btn {
            padding: 0.3rem 0.55rem;
            font-size: 0.6rem;
            gap: 0.3rem;
            flex-shrink: 0;
          }
        }
      `}</style>
    </section>
  );
}
