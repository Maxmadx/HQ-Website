/**
 * ADVANCED PICKER COMPONENT v2.0
 *
 * A full-featured picker/browser component with:
 * - Multi-category tabs with color coding
 * - Arrow key navigation between items
 * - Favorites system with notes
 * - Favorites panel to view/edit/delete all
 * - Grid view for browsing all items
 * - Minimize/collapse mode
 * - Copy favorites (with notes) to clipboard
 * - LocalStorage persistence
 *
 * USAGE:
 * ------
 * import Picker from './picker';
 *
 * const sections = {
 *   heroes: [
 *     { id: 'hero-1', name: 'Hero Centered', category: 'Minimal', desc: 'Clean centered hero' },
 *     { id: 'hero-2', name: 'Hero Split', category: 'Split', desc: 'Two-column layout' },
 *   ],
 *   features: [
 *     { id: 'feat-1', name: 'Feature Grid', category: 'Grid', desc: '3-column features' },
 *   ],
 * };
 *
 * const tabs = [
 *   { key: 'heroes', label: 'Heroes', color: 'default' },
 *   { key: 'features', label: 'Features', color: 'blue' },
 * ];
 *
 * <Picker
 *   sections={sections}
 *   tabs={tabs}
 *   storageKey="my-picker-favorites"
 *   title="Section Picker"
 *   onItemSelect={(item) => renderSection(item)}
 * />
 *
 * KEYBOARD CONTROLS:
 * ------------------
 * - ← →     Navigate between items
 * - F       Add/remove from favorites (with note)
 * - M       Minimize/expand picker
 * - Escape  Close modals or minimize
 *
 * TAB COLORS:
 * -----------
 * - 'default' - White/gray
 * - 'blue'    - Blue theme
 * - 'green'   - Green theme
 * - 'purple'  - Purple theme
 *
 * FAVORITES FORMAT (when copied):
 * -------------------------------
 * hero-1 (Hero Centered)
 *    → Great for landing pages
 *
 * feat-1 (Feature Grid)
 *    → Use on services page
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// PICKER COMPONENT
// ============================================

const Picker = ({
  sections = {},
  tabs = [],
  storageKey = 'picker-favorites',
  title = 'Picker',
  onItemSelect,
  renderPreview,
  initialTab,
  initialIndex = 0,
}) => {
  // State
  const [currentTab, setCurrentTab] = useState(initialTab || tabs[0]?.key || Object.keys(sections)[0]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [showFavsPanel, setShowFavsPanel] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const noteInputRef = useRef(null);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        // Migrate old format (array of strings to array of objects)
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          parsed = parsed.map(id => ({ id, note: '', name: '' }));
        }
        setFavorites(parsed);
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, [storageKey]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, storageKey]);

  // Get current items
  const currentItems = sections[currentTab] || [];
  const currentItem = currentItems[currentIndex];

  // Generate ordered tab keys for navigation
  const tabKeys = tabs.map(t => t.key);

  // Navigation
  const goNext = useCallback(() => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Go to next non-empty tab
      let nextTabIdx = (tabKeys.indexOf(currentTab) + 1) % tabKeys.length;
      let attempts = 0;
      while (sections[tabKeys[nextTabIdx]]?.length === 0 && attempts < tabKeys.length) {
        nextTabIdx = (nextTabIdx + 1) % tabKeys.length;
        attempts++;
      }
      setCurrentTab(tabKeys[nextTabIdx]);
      setCurrentIndex(0);
    }
  }, [currentIndex, currentItems.length, currentTab, tabKeys, sections]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      // Go to previous non-empty tab
      let prevTabIdx = (tabKeys.indexOf(currentTab) - 1 + tabKeys.length) % tabKeys.length;
      let attempts = 0;
      while (sections[tabKeys[prevTabIdx]]?.length === 0 && attempts < tabKeys.length) {
        prevTabIdx = (prevTabIdx - 1 + tabKeys.length) % tabKeys.length;
        attempts++;
      }
      const prevItems = sections[tabKeys[prevTabIdx]] || [];
      setCurrentTab(tabKeys[prevTabIdx]);
      setCurrentIndex(Math.max(0, prevItems.length - 1));
    }
  }, [currentIndex, currentTab, tabKeys, sections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFavorite();
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMinimized(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (isGridOpen) setIsGridOpen(false);
        else if (showNoteModal) setShowNoteModal(null);
        else if (showFavsPanel) setShowFavsPanel(false);
        else setIsMinimized(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isGridOpen, showNoteModal, showFavsPanel]);

  // Favorites helpers
  const isFavorite = useCallback((id) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const getFavorite = useCallback((id) => {
    return favorites.find(f => f.id === id);
  }, [favorites]);

  const handleToggleFavorite = () => {
    if (!currentItem) return;
    const id = currentItem.id;

    if (isFavorite(id)) {
      setFavorites(prev => prev.filter(f => f.id !== id));
    } else {
      setShowNoteModal({ id, name: currentItem.name });
    }
  };

  const handleSaveFavorite = (note) => {
    if (!showNoteModal) return;
    setFavorites(prev => [...prev, {
      id: showNoteModal.id,
      name: showNoteModal.name,
      note: note || ''
    }]);
    setShowNoteModal(null);
  };

  const handleEditNote = (idx) => {
    const fav = favorites[idx];
    const newNote = prompt('Edit note:', fav.note || '');
    if (newNote !== null) {
      setFavorites(prev => prev.map((f, i) =>
        i === idx ? { ...f, note: newNote } : f
      ));
    }
  };

  const handleDeleteFavorite = (idx) => {
    setFavorites(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCopyFavorites = () => {
    if (favorites.length === 0) {
      setCopyFeedback({ message: 'No favorites!', success: false });
      setTimeout(() => setCopyFeedback(null), 2000);
      return;
    }

    const lines = favorites.map(f => {
      let line = f.id;
      if (f.name) line += ` (${f.name})`;
      if (f.note) line += `\n   → ${f.note}`;
      return line;
    });
    const text = lines.join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback({ message: `Copied ${favorites.length}!`, success: true });
    }).catch(() => {
      setCopyFeedback({ message: 'Copy failed', success: false });
    });
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleClearFavorites = () => {
    if (confirm('Remove all favorites?')) {
      setFavorites([]);
      setShowFavsPanel(false);
    }
  };

  const navigateToFavorite = (fav) => {
    for (const [tabKey, items] of Object.entries(sections)) {
      const idx = items.findIndex(s => s.id === fav.id);
      if (idx !== -1) {
        setCurrentTab(tabKey);
        setCurrentIndex(idx);
        setShowFavsPanel(false);
        break;
      }
    }
  };

  // Call onItemSelect when item changes
  useEffect(() => {
    if (currentItem && onItemSelect) {
      onItemSelect(currentItem);
    }
  }, [currentItem, onItemSelect]);

  // Focus note input when modal opens
  useEffect(() => {
    if (showNoteModal && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteModal]);

  const currentFav = currentItem ? getFavorite(currentItem.id) : null;

  return (
    <>
      <style>{pickerStyles}</style>

      <div className={`picker ${isMinimized ? 'minimized' : ''}`}>
        {/* Collapsed Bar */}
        <div className="picker__collapsed-bar" onClick={() => setIsMinimized(false)}>
          <div className="picker__collapsed-info">
            <span className="picker__collapsed-name">
              {currentItem?.name || 'No item'}
            </span>
            <span className="picker__collapsed-counter">
              {currentIndex + 1} / {currentItems.length}
            </span>
          </div>
          <div className="picker__collapsed-nav">
            <button className="picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); goPrev(); }}>←</button>
            <button className="picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); goNext(); }}>→</button>
            <button className="picker__collapsed-btn" onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>↑</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="picker__main">
          {/* Header */}
          <div className="picker__header">
            <h3 className="picker__title">{title}</h3>
            <button className="picker__minimize" onClick={() => setIsMinimized(true)}>−</button>
          </div>

          {/* Tabs */}
          <div className="picker__tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`picker__tab ${tab.color ? `picker__tab--${tab.color}` : ''} ${currentTab === tab.key ? 'active' : ''}`}
                onClick={() => { setCurrentTab(tab.key); setCurrentIndex(0); }}
              >
                {tab.label} ({sections[tab.key]?.length || 0})
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="picker__content">
            <div className="picker__nav">
              <button className="picker__nav-btn" onClick={goPrev}>←</button>

              <div className="picker__info">
                <span className="picker__category">{currentItem?.category || ''}</span>
                <span className="picker__counter">{currentIndex + 1} / {currentItems.length}</span>
                <h3 className="picker__name">{currentItem?.name || 'No items'}</h3>
                <p className="picker__desc">{currentItem?.desc || ''}</p>
              </div>

              <button className="picker__nav-btn" onClick={goNext}>→</button>

              <button
                className={`picker__fav-btn ${currentFav ? 'active' : ''} ${currentFav?.note ? 'has-note' : ''}`}
                onClick={handleToggleFavorite}
                title={currentFav?.note ? `Note: ${currentFav.note}` : (currentFav ? 'Remove from favorites' : 'Add to favorites')}
              >
                {currentFav ? '★' : '☆'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="picker__footer">
            <div className="picker__footer-left">
              <button className="picker__btn" onClick={() => setIsGridOpen(true)}>View All</button>
              <button
                className={`picker__btn picker__btn--favs ${favorites.length > 0 ? 'has-items' : ''}`}
                onClick={() => setShowFavsPanel(!showFavsPanel)}
              >
                ★ <span className="picker__fav-count">{favorites.length}</span>
              </button>
              <button
                className={`picker__btn picker__btn--copy ${copyFeedback ? (copyFeedback.success ? 'picker__btn--success' : 'picker__btn--error') : ''}`}
                onClick={handleCopyFavorites}
              >
                {copyFeedback ? copyFeedback.message : '📋 Copy'}
              </button>
            </div>
            <div className="picker__hints">
              <span><kbd>←</kbd><kbd>→</kbd> Nav</span>
              <span><kbd>F</kbd> Fav</span>
              <span><kbd>M</kbd> Mini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      {isGridOpen && (
        <div className="picker__grid-overlay active">
          <div className="picker__grid-header">
            <h2>All Items</h2>
            <button className="picker__grid-close" onClick={() => setIsGridOpen(false)}>×</button>
          </div>
          <div className="picker__grid-content">
            {Object.entries(sections).map(([tabKey, items]) =>
              items.map((item, idx) => (
                <div
                  key={item.id}
                  className="picker__grid-item"
                  onClick={() => {
                    setCurrentTab(tabKey);
                    setCurrentIndex(idx);
                    setIsGridOpen(false);
                  }}
                >
                  <div className="picker__grid-item__name">{item.name}</div>
                  <div className="picker__grid-item__desc">{item.desc}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="picker__note-modal" onClick={() => setShowNoteModal(null)}>
          <div className="picker__note-content" onClick={e => e.stopPropagation()}>
            <div className="picker__note-header">
              <span className="picker__note-icon">★</span>
              <span>Add to Favorites</span>
            </div>
            <div className="picker__note-name">{showNoteModal.name}</div>
            <textarea
              ref={noteInputRef}
              className="picker__note-input"
              placeholder="Add a note (optional)..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveFavorite(e.target.value.trim());
                }
                if (e.key === 'Escape') {
                  setShowNoteModal(null);
                }
              }}
            />
            <div className="picker__note-actions">
              <button className="picker__note-cancel" onClick={() => setShowNoteModal(null)}>Cancel</button>
              <button
                className="picker__note-save"
                onClick={() => handleSaveFavorite(noteInputRef.current?.value.trim())}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Panel */}
      {showFavsPanel && favorites.length > 0 && (
        <div className="picker__favs-panel">
          <div className="picker__favs-header">
            <strong>★ Favorites ({favorites.length})</strong>
            <button className="picker__favs-close" onClick={() => setShowFavsPanel(false)}>×</button>
          </div>
          <div className="picker__favs-list">
            {favorites.map((fav, idx) => (
              <div key={fav.id} className="picker__favs-item">
                <div className="picker__favs-item-main" onClick={() => navigateToFavorite(fav)}>
                  <span className="picker__favs-item-name">{fav.name || fav.id}</span>
                  <span className="picker__favs-item-id">{fav.id}</span>
                </div>
                <div className={`picker__favs-item-note ${!fav.note ? 'empty' : ''}`}>
                  {fav.note ? `→ ${fav.note}` : 'No note'}
                </div>
                <div className="picker__favs-item-actions">
                  <button className="picker__favs-item-btn edit" onClick={() => handleEditNote(idx)}>✏️</button>
                  <button className="picker__favs-item-btn delete" onClick={() => handleDeleteFavorite(idx)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <div className="picker__favs-footer">
            <button className="picker__favs-footer-btn copy" onClick={handleCopyFavorites}>📋 Copy All</button>
            <button className="picker__favs-footer-btn clear" onClick={handleClearFavorites}>🗑️ Clear All</button>
          </div>
        </div>
      )}

      {/* Optional Preview Render */}
      {renderPreview && currentItem && renderPreview(currentItem)}
    </>
  );
};

// ============================================
// STYLES
// ============================================

const pickerStyles = `
  .picker {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 420px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 100000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s ease;
  }

  .picker.minimized {
    transform: translateY(calc(100% - 44px));
  }

  .picker__collapsed-bar {
    display: none;
    height: 44px;
    background: #0a0a0a;
    border-radius: 16px 16px 0 0;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    cursor: pointer;
  }

  .picker.minimized .picker__collapsed-bar {
    display: flex;
  }

  .picker__collapsed-info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
  }

  .picker__collapsed-name {
    font-weight: 600;
  }

  .picker__collapsed-counter {
    opacity: 0.6;
    font-size: 11px;
  }

  .picker__collapsed-nav {
    display: flex;
    gap: 8px;
  }

  .picker__collapsed-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .picker__collapsed-btn:hover {
    background: rgba(255,255,255,0.2);
  }

  .picker__main {
    display: block;
  }

  .picker.minimized .picker__main {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }

  .picker__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  .picker__title {
    font-size: 14px;
    font-weight: 700;
    margin: 0;
  }

  .picker__minimize {
    width: 28px;
    height: 28px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .picker__minimize:hover {
    background: #f5f5f5;
  }

  /* Tabs */
  .picker__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 12px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
    max-height: 140px;
    overflow-y: auto;
  }

  .picker__tabs::-webkit-scrollbar {
    width: 6px;
  }

  .picker__tabs::-webkit-scrollbar-track {
    background: #e5e5e5;
    border-radius: 3px;
  }

  .picker__tabs::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 3px;
  }

  .picker__tab {
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 500;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .picker__tab:hover {
    border-color: #333;
  }

  .picker__tab.active {
    background: #0a0a0a;
    color: #fff;
    border-color: #0a0a0a;
  }

  .picker__tab--blue {
    background: #e3f2fd;
    border-color: #2196f3;
    color: #1565c0;
  }

  .picker__tab--blue:hover {
    background: #bbdefb;
  }

  .picker__tab--blue.active {
    background: #1976d2;
    color: #fff;
    border-color: #1976d2;
  }

  .picker__tab--green {
    background: #e8f5e9;
    border-color: #4caf50;
    color: #2e7d32;
  }

  .picker__tab--green:hover {
    background: #c8e6c9;
  }

  .picker__tab--green.active {
    background: #43a047;
    color: #fff;
    border-color: #43a047;
  }

  .picker__tab--purple {
    background: #f3e5f5;
    border-color: #9c27b0;
    color: #7b1fa2;
  }

  .picker__tab--purple:hover {
    background: #e1bee7;
  }

  .picker__tab--purple.active {
    background: #8e24aa;
    color: #fff;
    border-color: #8e24aa;
  }

  .picker__tab--orange {
    background: #fff3e0;
    border-color: #ff9800;
    color: #e65100;
  }

  .picker__tab--orange:hover {
    background: #ffe0b2;
  }

  .picker__tab--orange.active {
    background: #f57c00;
    color: #fff;
    border-color: #f57c00;
  }

  /* Content / Nav */
  .picker__content {
    padding: 16px;
  }

  .picker__nav {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .picker__nav-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .picker__nav-btn:hover {
    background: #0a0a0a;
    color: #fff;
    border-color: #0a0a0a;
  }

  .picker__info {
    flex: 1;
    text-align: center;
    min-width: 0;
  }

  .picker__category {
    display: block;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #e04a2f;
    margin-bottom: 4px;
  }

  .picker__counter {
    font-size: 10px;
    color: #999;
  }

  .picker__name {
    font-size: 14px;
    font-weight: 700;
    margin: 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picker__desc {
    font-size: 11px;
    color: #666;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Favorite Button */
  .picker__fav-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border: 2px solid #e5e5e5;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .picker__fav-btn:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }

  .picker__fav-btn.active {
    background: #f59e0b;
    border-color: #f59e0b;
    color: #fff;
  }

  .picker__fav-btn.has-note::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: #3b82f6;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  /* Footer */
  .picker__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f5f5f5;
    border-top: 1px solid #e5e5e5;
    border-radius: 0 0 16px 16px;
  }

  .picker__footer-left {
    display: flex;
    gap: 8px;
  }

  .picker__btn {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 500;
    background: #0a0a0a;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .picker__btn:hover {
    opacity: 0.9;
  }

  .picker__btn--favs {
    background: #333;
  }

  .picker__btn--favs.has-items {
    background: #d97706;
  }

  .picker__btn--copy {
    background: #6366f1;
  }

  .picker__btn--success {
    background: #22c55e !important;
  }

  .picker__btn--error {
    background: #ef4444 !important;
  }

  .picker__fav-count {
    display: inline-block;
    min-width: 16px;
    padding: 0 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 8px;
    font-size: 10px;
  }

  .picker__hints {
    display: flex;
    gap: 12px;
    font-size: 10px;
    color: #999;
  }

  .picker__hints kbd {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: inherit;
    font-size: 9px;
  }

  /* Grid Overlay */
  .picker__grid-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 100002;
    display: none;
    flex-direction: column;
  }

  .picker__grid-overlay.active {
    display: flex;
  }

  .picker__grid-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #fff;
  }

  .picker__grid-header h2 {
    margin: 0;
    font-size: 18px;
  }

  .picker__grid-close {
    width: 36px;
    height: 36px;
    border: none;
    background: #f5f5f5;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
  }

  .picker__grid-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    align-content: start;
  }

  .picker__grid-item {
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .picker__grid-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .picker__grid-item__name {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .picker__grid-item__desc {
    font-size: 11px;
    color: #666;
  }

  /* Note Modal */
  .picker__note-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100003;
    animation: pickerFadeIn 0.15s ease-out;
  }

  @keyframes pickerFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .picker__note-content {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    width: 320px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    animation: pickerSlideUp 0.2s ease-out;
  }

  @keyframes pickerSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .picker__note-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .picker__note-icon {
    color: #f59e0b;
    font-size: 18px;
  }

  .picker__note-name {
    font-size: 12px;
    color: #666;
    margin-bottom: 12px;
    padding: 6px 10px;
    background: #f5f5f5;
    border-radius: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .picker__note-input {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    resize: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .picker__note-input:focus {
    outline: none;
    border-color: #f59e0b;
  }

  .picker__note-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .picker__note-cancel,
  .picker__note-save {
    flex: 1;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .picker__note-cancel {
    background: #f5f5f5;
    color: #666;
  }

  .picker__note-cancel:hover {
    background: #e5e5e5;
  }

  .picker__note-save {
    background: #f59e0b;
    color: #fff;
  }

  .picker__note-save:hover {
    background: #d97706;
  }

  /* Favorites Panel */
  .picker__favs-panel {
    position: fixed;
    bottom: 70px;
    left: 20px;
    width: 360px;
    max-height: 400px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.25);
    z-index: 100003;
    display: flex;
    flex-direction: column;
    animation: pickerSlideUp 0.2s ease-out;
  }

  .picker__favs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 14px;
  }

  .picker__favs-close {
    width: 24px;
    height: 24px;
    border: none;
    background: #f5f5f5;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
  }

  .picker__favs-list {
    flex: 1;
    overflow-y: auto;
    max-height: 280px;
  }

  .picker__favs-item {
    padding: 10px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background 0.15s;
  }

  .picker__favs-item:hover {
    background: #f9f9f9;
  }

  .picker__favs-item-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .picker__favs-item-name {
    font-weight: 600;
    font-size: 13px;
    color: #333;
  }

  .picker__favs-item-id {
    font-size: 10px;
    color: #999;
    font-family: monospace;
  }

  .picker__favs-item-note {
    font-size: 12px;
    color: #666;
    padding: 4px 8px;
    background: #f5f5f5;
    border-radius: 4px;
    margin: 6px 0;
  }

  .picker__favs-item-note.empty {
    color: #bbb;
    font-style: italic;
  }

  .picker__favs-item-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
  }

  .picker__favs-item-btn {
    width: 28px;
    height: 28px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.15s;
  }

  .picker__favs-item-btn.edit:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .picker__favs-item-btn.delete:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .picker__favs-footer {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #e5e5e5;
  }

  .picker__favs-footer-btn {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .picker__favs-footer-btn.copy {
    background: #6366f1;
    color: #fff;
  }

  .picker__favs-footer-btn.copy:hover {
    background: #4f46e5;
  }

  .picker__favs-footer-btn.clear {
    background: #f5f5f5;
    color: #666;
  }

  .picker__favs-footer-btn.clear:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .picker {
      left: 10px;
      right: 10px;
      width: auto;
    }

    .picker__favs-panel {
      left: 10px;
      right: 10px;
      width: auto;
    }
  }
`;

export default Picker;

// ============================================
// EXAMPLE USAGE
// ============================================

/*
import Picker from './picker';

function MyApp() {
  const [previewHtml, setPreviewHtml] = useState('');

  // Define sections by category
  const sections = {
    heroes: [
      {
        id: 'hero-centered',
        name: 'Hero Centered',
        category: 'Minimal',
        desc: 'Clean centered hero section',
        html: '<section class="hero">...</section>'
      },
      {
        id: 'hero-split',
        name: 'Hero Split',
        category: 'Split',
        desc: 'Two-column hero layout',
        html: '<section class="hero-split">...</section>'
      },
    ],
    features: [
      {
        id: 'feature-grid',
        name: 'Feature Grid',
        category: 'Grid',
        desc: '3-column feature cards',
        html: '<section class="features">...</section>'
      },
    ],
    cta: [
      {
        id: 'cta-simple',
        name: 'Simple CTA',
        category: 'Basic',
        desc: 'Basic call-to-action',
        html: '<section class="cta">...</section>'
      },
    ],
  };

  // Define tabs with colors
  const tabs = [
    { key: 'heroes', label: 'Heroes', color: 'default' },
    { key: 'features', label: 'Features', color: 'blue' },
    { key: 'cta', label: 'CTA', color: 'green' },
  ];

  // Handle item selection
  const handleItemSelect = (item) => {
    setPreviewHtml(item.html);
  };

  return (
    <div>
      {/* Preview area *\/}
      <div
        id="preview"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />

      {/* Picker component *\/}
      <Picker
        sections={sections}
        tabs={tabs}
        storageKey="my-section-picker-favorites"
        title="Section Picker"
        onItemSelect={handleItemSelect}
      />
    </div>
  );
}

// Tab color options: 'default', 'blue', 'green', 'purple', 'orange'
*/
