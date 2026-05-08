/**
 * SITEMAP PAGE - Project Tracker
 *
 * Features:
 * - Tree view with nested pages
 * - Checkbox completion tracking
 * - Progress bar tracking
 * - Development pages section
 * - LocalStorage persistence
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import FooterMinimal component
import FooterMinimal from '../components/FooterMinimal';

// Default site structure
const defaultSiteStructure = [
  {
    id: 'home',
    title: 'Home',
    path: '/',
    icon: '⌂',
    description: 'Welcome to HQ Aviation',
    completed: false,
    children: [],
  },
  {
    id: 'about',
    title: 'About Us',
    path: '/about-us',
    icon: '●',
    description: 'Learn about HQ Aviation',
    completed: false,
    children: [
      { id: 'captain-q', title: 'Captain Quentin Smith', path: '/about-us/captain-q', description: 'Founder & Chief Pilot', completed: false, children: [] },
    ],
  },
  {
    id: 'training',
    title: 'Training',
    path: '/training',
    icon: '✈',
    description: 'Flight training programs',
    completed: false,
    children: [
      { id: 'ppl', title: 'Private Pilot License (PPL)', path: '/training/ppl', description: 'Learn to fly helicopters', completed: false, featured: true, children: [] },
      { id: 'type-rating', title: 'Type Rating', path: '/training/type-rating', description: 'Aircraft-specific certifications', completed: false, children: [] },
      { id: 'why-fly', title: 'Why Fly a Helicopter?', path: '/final-why-fly-a-helicopter', description: 'Benefits of helicopter flight', completed: false, children: [] },
      { id: 'training-faq', title: 'Training FAQ', path: '/training/faq', description: 'Frequently asked questions', completed: false, children: [] },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    path: '/services',
    icon: '◆',
    description: 'Aviation services we offer',
    completed: false,
    children: [
      { id: 'self-fly-hire', title: 'Self-Fly Hire', path: '/self-fly-hire', description: 'Rent our aircraft', completed: false, featured: true, children: [] },
      { id: 'maintenance', title: 'Maintenance', path: '/maintenance', description: 'CAA Part-145 approved workshop', completed: false, children: [] },
      { id: 'fleet', title: 'Fleet', path: '/fleet', description: 'Our helicopter fleet', completed: false, children: [] },
    ],
  },
  {
    id: 'aircraft-sales',
    title: 'Aircraft Sales',
    path: '/aircraft-sales',
    icon: '▲',
    description: 'New & pre-owned helicopters',
    completed: false,
    children: [
      { id: 'sales-new', title: 'New Aircraft', path: '/sales/new', description: 'Factory new Robinson helicopters', completed: false, children: [] },
      { id: 'sales-pre-owned', title: 'Pre-Owned Aircraft', path: '/sales/pre-owned', description: 'Pre-owned helicopters', completed: false, children: [] },
    ],
  },
  {
    id: 'expeditions',
    title: 'Expeditions',
    path: '/expeditions',
    icon: '◎',
    description: 'Worldwide helicopter adventures',
    completed: false,
    children: [],
  },
  {
    id: 'sitemap',
    title: 'Sitemap',
    path: '/sitemap',
    icon: '☰',
    description: 'Site structure & progress tracker',
    completed: false,
    children: [],
  },
];

const defaultDevPages = [
  { id: 'dev-final-draft', title: 'Homepage Draft', path: '/final-draft', completed: false },
  { id: 'dev-components', title: 'Component Showcase', path: '/components', completed: false },
  { id: 'dev-hero-test', title: 'Hero Test', path: '/hero-test', completed: false },
  { id: 'dev-scroll-path', title: 'Scroll Path Test', path: '/scroll-path-test', completed: false },
  { id: 'dev-carousel', title: 'Carousel Picker', path: '/carousel-picker', completed: false },
  { id: 'dev-carousel-v2', title: 'Carousel Picker V2', path: '/carousel-picker-v2', completed: false },
  { id: 'dev-arrow', title: 'Arrow Picker', path: '/arrow-picker', completed: false },
  { id: 'dev-hero-path', title: 'Hero Path Picker', path: '/hero-path-picker', completed: false },
  { id: 'dev-parallax', title: 'Parallax Picker', path: '/parallax-picker', completed: false },
  { id: 'dev-ownership', title: 'Ownership Picker', path: '/ownership-picker', completed: false },
  { id: 'dev-ppl', title: 'PPL Picker', path: '/ppl-picker', completed: false },
  { id: 'dev-journey', title: 'Journey Lines Picker', path: '/journey-lines-picker', completed: false },
  { id: 'dev-journey-picker', title: 'Journey Picker', path: '/journey-picker', completed: false },
  { id: 'dev-video-slider', title: 'Video Slider Picker', path: '/video-slider-picker', completed: false },
];

// Storage keys
const STORAGE_KEY = 'hq-aviation-sitemap-state';
const IDB_NAME = 'hq-aviation-db';
const IDB_STORE = 'sitemap-state';

// IndexedDB helpers for persistent storage
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
  });
};

const saveToIDB = async (data) => {
  try {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put({ id: 'state', ...data });
    await tx.complete;
  } catch (e) {
    console.warn('IndexedDB save failed:', e);
  }
};

const loadFromIDB = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    return new Promise((resolve, reject) => {
      const request = store.get('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB load failed:', e);
    return null;
  }
};

function SitemapHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sitemap-header ${scrolled ? 'sitemap-header--scrolled' : ''}`}>
      <div className="sitemap-header__inner">
        <Link to="/" className="sitemap-header__logo">
          <img src="/assets/images/logos/hq/hq-aviation-logo-black.png" alt="HQ Aviation" width={405} height={245} />
        </Link>
        <Link to="/" className="sitemap-header__back">← Back to Home</Link>
      </div>
    </header>
  );
}

// Checkbox component
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="sitemap-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sitemap-checkbox__input"
      />
      <span className={`sitemap-checkbox__box ${checked ? 'sitemap-checkbox__box--checked' : ''}`}>
        {checked && <span className="sitemap-checkbox__tick">✓</span>}
      </span>
      {label && <span className="sitemap-checkbox__label">{label}</span>}
    </label>
  );
}

// Visual tree view (hierarchical diagram)
function VisualTreeView({ pages, onToggleComplete }) {
  const renderTreeBranch = (item, depth = 0, isLast = false) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="visual-tree__branch">
        <div className="visual-tree__connector">
          {depth > 0 && (
            <>
              <span className="visual-tree__line visual-tree__line--horizontal" />
              {!isLast && <span className="visual-tree__line visual-tree__line--vertical" />}
            </>
          )}
        </div>
        <div className={`visual-tree__node ${item.completed ? 'visual-tree__node--completed' : ''}`}>
          <button
            className={`visual-tree__checkbox ${item.completed ? 'visual-tree__checkbox--checked' : ''}`}
            onClick={() => onToggleComplete(item.id)}
          >
            {item.completed && '✓'}
          </button>
          <div className="visual-tree__info">
            {item.icon && <span className="visual-tree__icon">{item.icon}</span>}
            <Link to={item.path} className="visual-tree__title">{item.title}</Link>
          </div>
        </div>
        {hasChildren && (
          <div className="visual-tree__children">
            {item.children.map((child, i) => renderTreeBranch(child, depth + 1, i === item.children.length - 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="visual-tree">
      <div className="visual-tree__root">
        <div className="visual-tree__root-node">
          <span className="visual-tree__root-icon">HQ</span>
          <span className="visual-tree__root-label">hqaviation.com</span>
        </div>
        <div className="visual-tree__trunk" />
      </div>
      <div className="visual-tree__branches">
        {pages.map((page, i) => renderTreeBranch(page, 0, i === pages.length - 1))}
      </div>
    </div>
  );
}

function Sitemap() {
  const [pages, setPages] = useState(defaultSiteStructure);
  const [devPages, setDevPages] = useState(defaultDevPages);
  const [showDev, setShowDev] = useState(false);

  // Load from localStorage and IndexedDB
  useEffect(() => {
    const loadState = async () => {
      // Try localStorage first
      let loaded = false;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { pages: savedPages, devPages: savedDevPages } = JSON.parse(saved);
          if (savedPages) setPages(savedPages);
          if (savedDevPages) setDevPages(savedDevPages);
          loaded = true;
        } catch (e) {
          console.error('Failed to load from localStorage:', e);
        }
      }

      // If localStorage failed, try IndexedDB
      if (!loaded) {
        try {
          const idbData = await loadFromIDB();
          if (idbData) {
            if (idbData.pages) setPages(idbData.pages);
            if (idbData.devPages) setDevPages(idbData.devPages);
          }
        } catch (e) {
          console.error('Failed to load from IndexedDB:', e);
        }
      }
    };

    loadState();
  }, []);

  // Save to localStorage and IndexedDB
  useEffect(() => {
    const data = { pages, devPages };
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Also save to IndexedDB for persistence
    saveToIDB(data);
  }, [pages, devPages]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle completion recursively
  const toggleComplete = useCallback((id) => {
    const toggleInList = (list) => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        if (item.children) {
          return { ...item, children: toggleInList(item.children) };
        }
        return item;
      });
    };

    setPages(prev => toggleInList(prev));
    setDevPages(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  // Calculate stats
  const countAll = (list) => {
    return list.reduce((acc, item) => {
      const childCount = item.children ? countAll(item.children) : 0;
      return acc + 1 + childCount;
    }, 0);
  };

  const countCompleted = (list) => {
    return list.reduce((acc, item) => {
      const completed = item.completed ? 1 : 0;
      const childCompleted = item.children ? countCompleted(item.children) : 0;
      return acc + completed + childCompleted;
    }, 0);
  };

  const totalPages = countAll(pages);
  const completedPages = countCompleted(pages);
  const progressPercent = Math.round((completedPages / totalPages) * 100);

  return (
    <div className="sitemap">
      <SitemapHeader />

      {/* Hero */}
      <section className="sitemap-hero">
        <motion.div
          className="sitemap-hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="sitemap-pre-text">Project Tracker</span>
          <h1>
            <span className="sitemap-text--dark">Site</span>{' '}
            <span className="sitemap-text--mid">Map</span>
          </h1>
          <p>Track your progress and manage site structure</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="sitemap-progress"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="sitemap-progress__header">
            <span className="sitemap-progress__label">Overall Progress</span>
            <span className="sitemap-progress__percent">{progressPercent}%</span>
          </div>
          <div className="sitemap-progress__bar">
            <motion.div
              className="sitemap-progress__fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="sitemap-progress__stats">
            <span>{completedPages} of {totalPages} pages complete</span>
          </div>
        </motion.div>

      </section>

      {/* Main content */}
      <section className="sitemap-main">
        <div className="sitemap-main__container">
          <VisualTreeView pages={pages} onToggleComplete={toggleComplete} />

          {/* Dev Pages */}
          <div className="sitemap-dev">
            <button
              className="sitemap-dev__toggle"
              onClick={() => setShowDev(!showDev)}
            >
              <span className="sitemap-dev__toggle-icon">{showDev ? '−' : '+'}</span>
              <span>Development & Test Pages</span>
              <span className="sitemap-dev__toggle-count">
                {devPages.filter(p => p.completed).length}/{devPages.length}
              </span>
            </button>

            <AnimatePresence>
              {showDev && (
                <motion.div
                  className="sitemap-dev__list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {devPages.map((page, i) => (
                    <div
                      key={page.id}
                      className={`sitemap-dev__item ${page.completed ? 'sitemap-dev__item--completed' : ''}`}
                    >
                      <Checkbox
                        checked={page.completed}
                        onChange={() => toggleComplete(page.id)}
                      />
                      <span className="sitemap-dev__num">{String(i + 1).padStart(2, '0')}</span>
                      <Link to={page.path} className="sitemap-dev__title">{page.title}</Link>
                      <span className="sitemap-dev__path">{page.path}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset button */}
          <div className="sitemap-reset">
            <button
              className="sitemap-reset__btn"
              onClick={() => {
                if (window.confirm('Reset all progress? This cannot be undone.')) {
                  setPages(defaultSiteStructure);
                  setDevPages(defaultDevPages);
                }
              }}
            >
              Reset Progress
            </button>
          </div>
        </div>
      </section>

      <FooterMinimal />

      <style>{`
        /* ===== BASE ===== */
        .sitemap {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          background: #faf9f6;
          color: #1a1a1a;
          min-height: 100vh;
        }

        .sitemap-pre-text {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #999;
          margin-bottom: 1rem;
        }

        .sitemap-text--dark { color: #1a1a1a; }
        .sitemap-text--mid { color: #4a4a4a; }

        /* ===== HEADER ===== */
        .sitemap-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 2rem;
          transition: all 0.3s ease;
        }

        .sitemap-header--scrolled {
          background: rgba(250, 249, 246, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.05);
        }

        .sitemap-header__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sitemap-header__logo img {
          height: 40px;
          width: auto;
        }

        .sitemap-header__back {
          font-size: 0.85rem;
          color: #666;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .sitemap-header__back:hover {
          color: #1a1a1a;
        }

        /* ===== HERO ===== */
        .sitemap-hero {
          padding: 8rem 2rem 3rem;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
        }

        .sitemap-hero__content h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 1rem;
          line-height: 1;
        }

        .sitemap-hero__content p {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        /* ===== PROGRESS ===== */
        .sitemap-progress {
          max-width: 500px;
          margin: 2.5rem auto 0;
        }

        .sitemap-progress__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .sitemap-progress__label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
        }

        .sitemap-progress__percent {
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .sitemap-progress__bar {
          height: 8px;
          background: #e8e6e2;
          border-radius: 4px;
          overflow: hidden;
        }

        .sitemap-progress__fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          border-radius: 4px;
        }

        .sitemap-progress__stats {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #888;
        }

        /* ===== MAIN ===== */
        .sitemap-main {
          padding: 3rem 2rem;
        }

        .sitemap-main__container {
          max-width: 900px;
          margin: 0 auto;
        }

        /* ===== CHECKBOX ===== */
        .sitemap-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .sitemap-checkbox__input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .sitemap-checkbox__box {
          width: 20px;
          height: 20px;
          border: 2px solid #ccc;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .sitemap-checkbox__box--checked {
          background: #2563eb;
          border-color: #2563eb;
        }

        .sitemap-checkbox__tick {
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .sitemap-checkbox:hover .sitemap-checkbox__box {
          border-color: #2563eb;
        }

        /* ===== VISUAL TREE ===== */
        .visual-tree {
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8e6e2;
          overflow-x: auto;
        }

        .visual-tree__root {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }

        .visual-tree__root-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          color: #fff;
          border-radius: 8px;
        }

        .visual-tree__root-icon {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
        }

        .visual-tree__root-label {
          font-size: 0.8rem;
        }

        .visual-tree__trunk {
          width: 2px;
          height: 24px;
          background: #1a1a1a;
        }

        .visual-tree__branches {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-left: 2rem;
        }

        .visual-tree__branch {
          position: relative;
        }

        .visual-tree__connector {
          position: absolute;
          left: -1.5rem;
          top: 0;
        }

        .visual-tree__line {
          position: absolute;
          background: #ddd;
        }

        .visual-tree__line--horizontal {
          width: 1.5rem;
          height: 2px;
          top: 1rem;
          left: 0;
        }

        .visual-tree__line--vertical {
          width: 2px;
          height: 100%;
          top: 1rem;
          left: 0;
        }

        .visual-tree__node {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .visual-tree__node:hover {
          border-color: #2563eb;
        }

        .visual-tree__node--completed {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .visual-tree__checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          color: transparent;
          transition: all 0.2s ease;
        }

        .visual-tree__checkbox--checked {
          background: #2563eb;
          border-color: #2563eb;
          color: #fff;
        }

        .visual-tree__info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .visual-tree__icon {
          font-size: 0.85rem;
        }

        .visual-tree__title {
          font-size: 0.85rem;
          font-weight: 500;
          color: #1a1a1a;
          text-decoration: none;
        }

        .visual-tree__title:hover {
          color: #2563eb;
        }

        .visual-tree__children {
          margin-top: 0.5rem;
          padding-left: 1.5rem;
        }

        /* ===== DEV PAGES ===== */
        .sitemap-dev {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e8e6e2;
        }

        .sitemap-dev__toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: 1px dashed #ccc;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          color: #888;
          width: 100%;
          text-align: left;
          transition: all 0.3s ease;
        }

        .sitemap-dev__toggle:hover {
          border-color: #999;
          color: #666;
        }

        .sitemap-dev__toggle-icon {
          width: 24px;
          height: 24px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-size: 1rem;
        }

        .sitemap-dev__toggle-count {
          margin-left: auto;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
        }

        .sitemap-dev__list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow: hidden;
        }

        .sitemap-dev__item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: #f5f5f5;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .sitemap-dev__item--completed {
          background: #f0fdf4;
        }

        .sitemap-dev__item--completed .sitemap-dev__title {
          text-decoration: line-through;
          color: #888;
        }

        .sitemap-dev__num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
        }

        .sitemap-dev__title {
          flex: 1;
          font-size: 0.9rem;
          color: #666;
          text-decoration: none;
        }

        .sitemap-dev__title:hover {
          color: #2563eb;
        }

        .sitemap-dev__path {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
        }

        /* ===== RESET ===== */
        .sitemap-reset {
          margin-top: 2rem;
          text-align: center;
        }

        .sitemap-reset__btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.75rem;
          color: #999;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sitemap-reset__btn:hover {
          border-color: #dc2626;
          color: #dc2626;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .sitemap-hero {
            padding: 7rem 1.5rem 2rem;
          }

          .sitemap-main {
            padding: 2rem 1rem;
          }

          .visual-tree {
            padding: 1rem;
          }

          .visual-tree__branches {
            padding-left: 1rem;
          }
        }

        @media (max-width: 480px) {
          .sitemap-hero__content h1 {
            font-size: 2rem;
          }

          .sitemap-dev__item {
            flex-wrap: wrap;
          }

          .sitemap-dev__path {
            width: 100%;
            margin-left: calc(20px + 1rem + 24px);
          }
        }
      `}</style>
    </div>
  );
}

export default Sitemap;
