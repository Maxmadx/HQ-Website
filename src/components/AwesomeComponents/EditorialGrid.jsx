/**
 * EDITORIAL GRID COMPONENT
 * Interactive Gallery — paginated, mixed content grid
 * Curated Commerce - Net-a-Porter, Sotheby's inspired
 */

import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

/* ─── Gallery Data ────────────────────────────────────────────── */

const GALLERY_PAGES = [
  // Page 1 — Community & Social
  [
    { type: 'image', src: '/assets/images/gallery/social/img-20241004-wa0005.jpg', alt: 'HQ Aviation social life', description: 'Community at the heart of everything we do', span: true },
    { type: 'image', src: '/assets/images/facility/hq-0153.jpg', alt: 'Flight Training', description: 'World-class flight training at Denham Aerodrome' },
    { type: 'image', src: '/assets/images/gallery/social/img-20230425-wa0001.jpg', alt: 'Team gathering', description: 'The HQ Aviation family together' },
    { type: 'image', src: '/assets/images/facility/main-sales-pic.jpg', alt: 'Aircraft Sales', description: 'New and pre-owned aircraft sales' },
    { type: 'image', src: '/assets/images/gallery/events/img_1346.jpg', alt: 'Aviation gathering', description: 'Open days and fly-ins at Denham Aerodrome' },
  ],
  // Page 2 — Expeditions & Adventure
  [
    { type: 'image', src: '/assets/images/expeditions/north-pole.jpg', alt: 'North Pole expedition', description: 'To the North Pole by helicopter — the ultimate expedition', span: true },
    { type: 'image', src: '/assets/images/expeditions/six-helis-in-North-Pole.jpg', alt: 'Expeditions', description: 'World adventures by helicopter' },
    { type: 'image', src: '/assets/images/lifestyle/superyacht-ops.jpg', alt: 'Superyacht operations', description: 'Superyacht helicopter operations worldwide' },
    { type: 'image', src: '/assets/images/expeditions/antartica.jpg', alt: 'Antarctica expedition', description: 'Antarctica — the final frontier of expedition flying' },
    { type: 'image', src: '/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp', alt: 'Quentin Smith', description: 'World record holder Quentin Smith' },
  ],
  // Page 3 — Flying & Behind the Scenes
  [
    { type: 'image', src: '/assets/images/gallery/carousel/rotating1.jpg', alt: 'HQ Aviation carousel', description: 'Life at HQ Aviation — behind the scenes', span: true },
    { type: 'image', src: '/assets/images/gallery/flying/james-shadow-night.jpg', alt: 'Night Rating', description: 'Night flying over the English countryside' },
    { type: 'image', src: '/assets/images/gallery/carousel/rotating2.jpg', alt: 'HQ Aviation', description: 'Every day is different at HQ Aviation' },
    { type: 'image', src: '/assets/images/gallery/flying/flying--1.jpg', alt: 'Aerial view', description: 'The view from above — why we fly' },
  ],
];

const TOTAL_PAGES = GALLERY_PAGES.length;

/* ─── GridCell Sub-Component ──────────────────────────────────── */

const GridCell = ({ cell }) => {
  if (cell.type === 'video') {
    return (
      <div className={`editorial-grid__cell${cell.span ? ' editorial-grid__cell--feature' : ''}`}>
        <video muted autoPlay loop playsInline poster={cell.poster}>
          <source src={cell.src} />
        </video>
        <div className="editorial-grid__video-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
        </div>
        <div className="editorial-grid__hover-overlay">
          <p className="editorial-grid__hover-text">{cell.description}</p>
        </div>
      </div>
    );
  }

  // Default: image
  const classes = [
    'editorial-grid__cell',
    cell.span ? 'editorial-grid__cell--feature' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <img src={cell.src} alt={cell.alt} loading="lazy" />
      <div className="editorial-grid__hover-overlay">
        <p className="editorial-grid__hover-text">{cell.description}</p>
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────── */

// Build flat array of all image/video cells for fullscreen slideshow
const allGalleryImages = GALLERY_PAGES.flatMap((page) =>
  page.filter((cell) => cell.type === 'image' || cell.type === 'video')
    .map((cell) => ({ src: cell.src, alt: cell.alt || '' }))
);

export const EditorialGrid = () => {
  // Ticker state
  const [mode, setMode] = useState('normal');
  const [navBottom, setNavBottom] = useState(120);
  const [tickerLeftOffset, setTickerLeftOffset] = useState(0);
  const placeholderRef = useRef(null);
  const tickerRef = useRef(null);
  const originalTopRef = useRef(null);
  const prevModeRef = useRef('normal');
  const STICKY_DURATION = 100;

  // Gallery state
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (files.length) setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = [...e.target.files].filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (files.length) setUploadedFiles(prev => [...prev, ...files]);
    e.target.value = '';
  }, []);

  const removeFile = useCallback((idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // Fullscreen gallery state
  const [fsOpen, setFsOpen] = useState(false);
  const [fsSlide, setFsSlide] = useState(0);
  const [fsShowClock, setFsShowClock] = useState(false);
  const [fsClock, setFsClock] = useState('');
  const [fsIdle, setFsIdle] = useState(false);
  const [fsScrollMode, setFsScrollMode] = useState(true);
  const [fsSpeed, setFsSpeed] = useState(1);
  const fsRow1Ref = useRef(null);
  const fsRow2Ref = useRef(null);

  // Start infinite scroll using Web Animations API with measured set width
  useEffect(() => {
    if (!fsOpen || !fsScrollMode) return;
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
        [
          { transform: `translateX(${startX}px)` },
          { transform: `translateX(${endX}px)` },
        ],
        { duration, iterations: Infinity, easing: 'linear' }
      );
      anim.playbackRate = fsSpeed;
      animations.push(anim);
    });
    return () => animations.forEach((a) => a.cancel());
  }, [fsOpen, fsScrollMode]);

  // Adjust scroll animation playback rate without jumping
  useEffect(() => {
    [fsRow1Ref, fsRow2Ref].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const anims = el.getAnimations();
      anims.forEach((a) => { a.playbackRate = fsSpeed; });
    });
  }, [fsSpeed]);

  const goToPage = useCallback((i) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }, []);

  const nextPage = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
  }, []);

  const prevPage = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
  }, []);

  // Track current page from scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const page = Math.round(el.scrollLeft / el.clientWidth);
      setCurrentPage(page);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const openFullscreen = useCallback(() => {
    setFsSlide(0);
    setFsScrollMode(true);
    setFsOpen(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const closeFullscreen = useCallback(() => {
    setFsOpen(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }, []);

  // Sync browser fullscreen exit with state
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && fsOpen) setFsOpen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [fsOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && fsOpen) { closeFullscreen(); return; }
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextPage, prevPage, fsOpen, closeFullscreen]);

  // Hide controls when mouse idle
  useEffect(() => {
    if (!fsOpen) return;
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

  // Fullscreen auto-rotate (speed-adjusted interval)
  useEffect(() => {
    if (!fsOpen || fsScrollMode) return;
    const ms = 5000 / fsSpeed;
    const interval = setInterval(() => {
      setFsSlide((prev) => (prev + 1) % allGalleryImages.length);
    }, ms);
    return () => clearInterval(interval);
  }, [fsOpen, fsSpeed, fsScrollMode]);

  // Fullscreen clock
  useEffect(() => {
    if (!fsOpen || !fsShowClock) return;
    const tick = () => {
      const now = new Date();
      setFsClock(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [fsOpen, fsShowClock]);

  // Ticker scroll logic
  useEffect(() => {
    const calculate = () => {
      const nav = document.querySelector('.fd-nav');
      if (nav) {
        const style = window.getComputedStyle(nav);
        const top = parseFloat(style.top) || 49;
        setNavBottom(top + nav.getBoundingClientRect().height);
      }

      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        if (originalTopRef.current === null) {
          originalTopRef.current = rect.top + window.scrollY;
        }
        setTickerLeftOffset(rect.left);
      }

      if (originalTopRef.current === null) return;

      const scrollY = window.scrollY;
      const triggerPoint = originalTopRef.current - navBottom;
      const endPoint = triggerPoint + STICKY_DURATION;

      let newMode = 'normal';
      if (scrollY < triggerPoint) {
        newMode = 'normal';
      } else if (scrollY >= triggerPoint && scrollY < endPoint) {
        newMode = 'sticky';
      } else {
        newMode = 'hidden';
      }

      if (prevModeRef.current !== newMode) {
        prevModeRef.current = newMode;
      }

      setMode(newMode);
    };

    window.addEventListener('scroll', calculate, { passive: true });
    window.addEventListener('resize', calculate);
    calculate();

    return () => {
      window.removeEventListener('scroll', calculate);
      window.removeEventListener('resize', calculate);
    };
  }, [navBottom, tickerLeftOffset]);

  return (
  <section className="editorial-grid">
    {/* Header — title only */}
    <header className="editorial-grid__header">
      <div className="editorial-grid__tagline">The Wall of Cool <span className="editorial-grid__tagline-hint">(Scroll to go Through)</span></div>
    </header>

    {/* Gallery — auto-scrolling editorial grids */}
    <div className="editorial-grid__gallery">
      <div className="editorial-grid__scroll" ref={scrollRef}>
        <div className="editorial-grid__scroll-track">
          {/* Original pages + duplicate for seamless loop (desktop only) */}
          {(typeof window !== 'undefined' && window.innerWidth <= 768 ? GALLERY_PAGES : [...GALLERY_PAGES, ...GALLERY_PAGES]).map((page, pageIdx) => (
            <div key={pageIdx} className="editorial-grid__grid">
              {page.map((cell, i) => (
                <GridCell key={`${pageIdx}-${i}`} cell={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>


    {/* Upload modal */}
    {uploadOpen && createPortal(
      <div className="upload-modal__backdrop" onClick={() => setUploadOpen(false)}>
        <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
          <button className="upload-modal__close" onClick={() => setUploadOpen(false)} aria-label="Close">&times;</button>
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
            <span className="upload-modal__drop-text">
              {dragOver ? 'Drop files here' : 'Drag & drop files here'}
            </span>
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
          {uploadedFiles.length > 0 && (
            <button className="upload-modal__submit" onClick={() => setUploadOpen(false)}>
              Upload {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
        <style>{`
          .upload-modal__backdrop {
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: uploadFadeIn 0.2s ease;
          }
          @keyframes uploadFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .upload-modal {
            background: #fff;
            border-radius: 12px;
            width: 90%;
            max-width: 480px;
            padding: 2rem;
            position: relative;
            animation: uploadSlideUp 0.3s ease;
          }
          @keyframes uploadSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .upload-modal__close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 32px;
            height: 32px;
            border: none;
            background: #f0f0f0;
            border-radius: 50%;
            font-size: 1.2rem;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
          }
          .upload-modal__close:hover { background: #e0e0e0; }
          .upload-modal__header {
            margin-bottom: 1.5rem;
          }
          .upload-modal__header h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 0.35rem;
          }
          .upload-modal__header p {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.8rem;
            color: #888;
            margin: 0;
          }
          .upload-modal__dropzone {
            border: 2px dashed #d0d0d0;
            border-radius: 10px;
            padding: 2.5rem 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            position: relative;
          }
          .upload-modal__dropzone:hover {
            border-color: #999;
            background: #fafafa;
          }
          .upload-modal__dropzone--active {
            border-color: #1a1a1a;
            background: #f5f5f0;
          }
          .upload-modal__input {
            display: none;
          }
          .upload-modal__icon {
            color: #bbb;
            margin-bottom: 0.25rem;
          }
          .upload-modal__dropzone--active .upload-modal__icon { color: #1a1a1a; }
          .upload-modal__drop-text {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            color: #555;
          }
          .upload-modal__or {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.7rem;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .upload-modal__browse {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            color: #1a1a1a;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .upload-modal__formats {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.6rem;
            color: #bbb;
            letter-spacing: 0.08em;
            margin-top: 0.25rem;
          }
          .upload-modal__files {
            margin-top: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .upload-modal__file {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.6rem 0.75rem;
            background: #f8f8f6;
            border-radius: 6px;
            border: 1px solid #eee;
          }
          .upload-modal__file-name {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.75rem;
            font-weight: 500;
            color: #333;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .upload-modal__file-size {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.65rem;
            color: #999;
            flex-shrink: 0;
          }
          .upload-modal__file-remove {
            width: 22px;
            height: 22px;
            border: none;
            background: #eee;
            border-radius: 50%;
            font-size: 0.9rem;
            color: #999;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.2s, color 0.2s;
          }
          .upload-modal__file-remove:hover { background: #ddd; color: #333; }
          .upload-modal__submit {
            margin-top: 1.25rem;
            width: 100%;
            padding: 0.75rem;
            background: #1a1a1a;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: background 0.2s;
          }
          .upload-modal__submit:hover { background: #333; }
        `}</style>
      </div>,
      document.body
    )}

    {/* Fullscreen gallery overlay — portalled to body for true fullscreen */}
    {fsOpen && createPortal(
      <div className={`fd-gallery-fs${fsIdle ? ' fd-gallery-fs--idle' : ''}`} style={{ cursor: fsIdle ? 'none' : undefined }}>
        {fsShowClock && (
          <div className="fd-gallery-fs__clock">{fsClock}</div>
        )}
        {!fsScrollMode ? (
          <>
            <div className="fd-gallery-fs__img-wrap">
              <img src={allGalleryImages[fsSlide].src} alt={allGalleryImages[fsSlide].alt} className="fd-gallery-fs__img" key={fsSlide} />
            </div>
            <div className="fd-gallery-fs__controls">
              <button onClick={() => setFsSlide((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length)} aria-label="Previous">&lsaquo;</button>
              <span className="fd-gallery-fs__counter">{fsSlide + 1} / {allGalleryImages.length}</span>
              <button onClick={() => setFsSlide((prev) => (prev + 1) % allGalleryImages.length)} aria-label="Next">&rsaquo;</button>
            </div>
          </>
        ) : (
          <div className="fd-gallery-fs__scroll-view">
            <div className="fd-gallery-fs__scroll-row fd-gallery-fs__scroll-row--left" ref={fsRow1Ref}>
              <div className="fd-gallery-fs__scroll-set">
                {allGalleryImages.map((img, i) => (
                  <div key={i} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                ))}
              </div>
              <div className="fd-gallery-fs__scroll-set">
                {allGalleryImages.map((img, i) => (
                  <div key={`d-${i}`} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                ))}
              </div>
            </div>
            <div className="fd-gallery-fs__scroll-row fd-gallery-fs__scroll-row--right" ref={fsRow2Ref}>
              <div className="fd-gallery-fs__scroll-set">
                {allGalleryImages.slice().reverse().map((img, i) => (
                  <div key={i} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                ))}
              </div>
              <div className="fd-gallery-fs__scroll-set">
                {allGalleryImages.slice().reverse().map((img, i) => (
                  <div key={`d-${i}`} className="fd-gallery-fs__scroll-img"><img src={img.src} alt={img.alt} /></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="fd-gallery-fs__speed-control">
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
          .fd-gallery-fs {
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: #000;
            display: flex;
            align-items: center;
            overflow: hidden;
            justify-content: center;
          }
          .fd-gallery-fs__img-wrap {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .fd-gallery-fs__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            animation: fdGalleryFade 0.8s ease;
          }
          @keyframes fdGalleryFade {
            from { opacity: 0; transform: scale(1.02); }
            to { opacity: 1; transform: scale(1); }
          }
          .fd-gallery-fs__clock {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 400;
            letter-spacing: 0.15em;
            color: #fff;
            text-shadow: 0 0 60px rgba(255,255,255,0.15), 0 2px 40px rgba(0,0,0,0.5);
            z-index: 2;
            pointer-events: none;
          }
          .fd-gallery-fs__controls {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 1.5rem;
            z-index: 3;
          }
          .fd-gallery-fs__controls button {
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(8px);
            color: #fff;
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
          }
          .fd-gallery-fs__controls button:hover {
            background: rgba(255,255,255,0.15);
          }
          .fd-gallery-fs__counter {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7rem;
            color: rgba(255,255,255,0.6);
            letter-spacing: 0.1em;
          }
          .fd-gallery-fs__close {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(8px);
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            transition: background 0.2s;
          }
          .fd-gallery-fs__close:hover {
            background: rgba(255,255,255,0.15);
          }
          .fd-gallery-fs__clock-toggle {
            position: absolute;
            top: 1.5rem;
            right: 4.5rem;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(8px);
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            transition: background 0.2s;
          }
          .fd-gallery-fs__clock-toggle:hover {
            background: rgba(255,255,255,0.15);
          }
          .fd-gallery-fs__mode-toggle {
            position: absolute;
            top: 1.5rem;
            right: 7.5rem;
            height: 40px;
            padding: 0 0.85rem;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(8px);
            color: #fff;
            cursor: pointer;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            transition: background 0.2s;
          }
          .fd-gallery-fs__mode-toggle:hover {
            background: rgba(255,255,255,0.15);
          }
          .fd-gallery-fs__speed-control {
            position: absolute;
            top: 1.5rem;
            right: 13rem;
            height: 40px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0 0.75rem;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(8px);
            z-index: 3;
          }
          .fd-gallery-fs__speed-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.6rem;
            color: #fff;
            letter-spacing: 0.05em;
            min-width: 2rem;
            text-align: center;
          }
          .fd-gallery-fs__speed-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 80px;
            height: 3px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            outline: none;
          }
          .fd-gallery-fs__speed-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
          }
          .fd-gallery-fs__speed-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
            border: none;
          }
          .fd-gallery-fs__scroll-view {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.5rem;
            overflow: hidden;
          }
          .fd-gallery-fs__scroll-row {
            display: flex;
          }
          .fd-gallery-fs__scroll-set {
            display: flex;
            gap: 0.5rem;
            flex-shrink: 0;
            padding-right: 0.5rem;
          }
          .fd-gallery-fs__scroll-row--left,
          .fd-gallery-fs__scroll-row--right {
            will-change: transform;
          }
          .fd-gallery-fs__scroll-img {
            flex-shrink: 0;
            height: calc(50vh - 0.5rem);
            aspect-ratio: 16/10;
            border-radius: 4px;
            overflow: hidden;
          }
          .fd-gallery-fs__scroll-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .fd-gallery-fs__controls,
          .fd-gallery-fs__close,
          .fd-gallery-fs__clock-toggle,
          .fd-gallery-fs__mode-toggle,
          .fd-gallery-fs__speed-control,
          .fd-gallery-fs__counter {
            transition: opacity 0.5s ease, background 0.2s;
          }
          .fd-gallery-fs--idle .fd-gallery-fs__controls,
          .fd-gallery-fs--idle .fd-gallery-fs__close,
          .fd-gallery-fs--idle .fd-gallery-fs__clock-toggle,
          .fd-gallery-fs--idle .fd-gallery-fs__mode-toggle,
          .fd-gallery-fs--idle .fd-gallery-fs__speed-control,
          .fd-gallery-fs--idle .fd-gallery-fs__counter {
            opacity: 0;
            pointer-events: none;
          }
        `}</style>
      </div>,
      document.body
    )}

    <style>{`
      .editorial-grid {
        background: #faf9f7;
      }

      .editorial-grid__header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px 2rem;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        flex-shrink: 0;
        background: #fff;
        box-shadow: 0 -8px 20px rgba(0,0,0,0.06);
      }

      .editorial-grid__footer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.25rem;
        padding: 1.5rem 2rem;
        border-top: 1px solid rgba(255,255,255,0.12);
        background: #1a1a1a;
      }

      .editorial-grid__tagline {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #1a1a1a;
      }
      .editorial-grid__tagline-hint {
        display: none;
      }

      .editorial-grid__header-right {
        display: flex;
        align-items: baseline;
        gap: 1.25rem;
      }

      .editorial-grid__issue {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: rgba(255,255,255,0.5);
      }

      .editorial-grid__upload-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        border: 1px solid rgba(255,255,255,0.25);
        padding: 0.35rem 0.75rem;
        border-radius: 2px;
        transition: background 0.2s, color 0.2s;
        white-space: nowrap;
        background: transparent;
        cursor: pointer;
      }

      .editorial-grid__upload-btn:hover {
        background: #1a1a1a;
        color: #fff;
        border-color: #1a1a1a;
      }

      /* ── Gallery wrapper ────────────────────────── */

      .editorial-grid__gallery {
        position: relative;
        height: calc(100vh - 175px);
        overflow: hidden;
      }

      /* ── Scroll container (auto-scroll) ──────── */

      .editorial-grid__scroll {
        height: 100%;
        overflow: hidden;
      }

      .editorial-grid__scroll-track {
        display: flex;
        height: 100%;
        width: max-content;
        animation: editorial-autoscroll 120s linear infinite;
      }


      @keyframes editorial-autoscroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      /* ── Grid (each page) ──────────────────────── */

      .editorial-grid__grid {
        flex: 0 0 100vw;
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1px;
        background: #e8e6e2;
        height: 100%;
      }

      /* ── Cells ──────────────────────────────────── */

      .editorial-grid__cell {
        position: relative;
        background: #fff;
        overflow: hidden;
      }

      .editorial-grid__cell img,
      .editorial-grid__cell video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .editorial-grid__cell--feature {
        grid-row: span 2;
      }

      .editorial-grid__hover-overlay {
        display: none;
      }

      /* ── Video badge ────────────────────────────── */

      .editorial-grid__video-badge {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: 28px;
        height: 28px;
        background: rgba(0,0,0,0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      }

      /* (chevrons and pagination removed — now using auto-scroll marquee) */

      /* ── Ticker ─────────────────────────────────── */

      .editorial-grid__ticker-placeholder {
        position: relative;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        flex-shrink: 0;
      }

      .editorial-grid__ticker {
        padding: 1rem 0;
        border-top: 1px solid #e8e6e2;
        overflow: hidden;
        background: #faf9f7;
        width: 100vw;
      }

      .editorial-grid__ticker--normal { }

      .editorial-grid__ticker--sticky {
        position: fixed;
        z-index: 99;
        border-top: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .editorial-grid__ticker--hidden {
        position: fixed;
        z-index: 99;
        border-top: 0;
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .editorial-grid__ticker-content {
        display: flex;
        gap: 2rem;
        animation: tickerScroll 20s linear infinite;
        white-space: nowrap;
      }

      @keyframes tickerScroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      .editorial-grid__ticker-content span {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #666;
      }

      /* ── Mobile ──────────────────────────────────── */

      @media (max-width: 768px) {
        .editorial-grid__header {
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.5rem;
        }

        .editorial-grid__footer {
          padding: 1rem 1.5rem;
        }

        .editorial-grid__header-right {
          width: 100%;
          justify-content: space-between;
        }

        .editorial-grid__tagline-hint {
          display: inline;
          font-size: 0.55rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-transform: none;
          opacity: 0.5;
          margin-left: 0.5rem;
        }

        .editorial-grid__gallery {
          height: 55vw;
        }

        .editorial-grid__scroll {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .editorial-grid__scroll::-webkit-scrollbar { display: none; }

        .editorial-grid__scroll-track {
          animation: none;
          height: 100%;
        }

        .editorial-grid__grid {
          display: contents;
        }

        .editorial-grid__cell--feature,
        .editorial-grid__cell {
          flex: 0 0 70vw;
          min-height: 100%;
          height: 100%;
        }
      }
    `}</style>

    {/* Footer — actions */}
    <footer className="editorial-grid__footer">
      <div className="editorial-grid__issue">Are you an HQ'er with some cool footage?</div>
      <button
        className="editorial-grid__upload-btn"
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
        className="editorial-grid__upload-btn"
        onClick={openFullscreen}
        aria-label="Fullscreen gallery"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>
        Fullscreen
      </button>
    </footer>
  </section>
  );
};

export default EditorialGrid;
