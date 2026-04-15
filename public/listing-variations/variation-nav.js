// Variation Navigation & Like System
(function() {
  const variations = [
    { id: 1, name: 'Classic Split' },
    { id: 2, name: 'Full-Width Hero' },
    { id: 3, name: 'Centered Stack' },
    { id: 4, name: 'Magazine Editorial' },
    { id: 5, name: 'Card Sections' },
    { id: 6, name: 'Sidebar Specs' },
    { id: 7, name: 'Tabbed Interface' },
    { id: 8, name: 'Minimal Clean' },
    { id: 9, name: 'Dark Mode' },
    { id: 10, name: 'Gallery Focus' },
    { id: 11, name: 'Luxury Premium' },
    { id: 12, name: 'Compact View' },
    { id: 13, name: 'Split Screen' },
    { id: 14, name: 'Boxed Layout' },
    { id: 15, name: 'Wide Cinematic' },
    { id: 16, name: 'Specs Table' },
    { id: 17, name: 'Floating Cards' },
    { id: 18, name: 'Banner Sections' },
    { id: 19, name: 'Asymmetric' },
    { id: 20, name: 'Modern Grid' }
  ];

  const finalDrafts = [
    { id: 1, name: 'Clean Split' },
    { id: 2, name: 'Asymmetric Stats' },
    { id: 3, name: 'Tabbed Minimal' },
    { id: 4, name: 'Elegant Scroll' },
    { id: 5, name: 'Premium Combined' }
  ];

  // Detect if we're on a final draft or variation
  function getPageType() {
    const path = window.location.pathname;
    if (path.includes('final-')) return 'final';
    if (path.includes('variation-')) return 'variation';
    return null;
  }

  // Get current page number
  function getCurrentNum() {
    const path = window.location.pathname;
    const finalMatch = path.match(/final-(\d+)\.html/);
    if (finalMatch) return parseInt(finalMatch[1]);
    const varMatch = path.match(/variation-(\d+)\.html/);
    if (varMatch) return parseInt(varMatch[1]);
    return 1;
  }

  // Get max pages for current type
  function getMaxPages() {
    return getPageType() === 'final' ? 5 : 20;
  }

  // Get items list for current type
  function getItems() {
    return getPageType() === 'final' ? finalDrafts : variations;
  }

  // Navigate to page
  function goToPage(num) {
    const max = getMaxPages();
    const type = getPageType();
    if (num >= 1 && num <= max) {
      const prefix = type === 'final' ? 'final' : 'variation';
      window.location.href = `${prefix}-${num}.html`;
    }
  }

  // Get likes from localStorage
  function getLikes() {
    const type = getPageType();
    const key = type === 'final' ? 'finalDraftLikes' : 'variationLikes';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // Save likes to localStorage
  function saveLikes(likes) {
    const type = getPageType();
    const key = type === 'final' ? 'finalDraftLikes' : 'variationLikes';
    localStorage.setItem(key, JSON.stringify(likes));
  }

  // Toggle like for current page
  function toggleLike(like) {
    const current = getCurrentNum();
    let likes = getLikes();

    if (like) {
      if (!likes.includes(current)) {
        likes.push(current);
        likes.sort((a, b) => a - b);
        showNotification(`Liked #${current}`, 'like');
      }
    } else {
      likes = likes.filter(l => l !== current);
      showNotification(`Unliked #${current}`, 'unlike');
    }

    saveLikes(likes);
    updateUI();
  }

  // Show notification
  function showNotification(text, type) {
    const existing = document.querySelector('.variation-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'variation-notification';
    notif.innerHTML = `<span class="notif-icon">${type === 'like' ? '♥' : '♡'}</span> ${text}`;
    notif.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: ${type === 'like' ? '#2e7d32' : '#666'}; color: #fff;
      padding: 12px 24px; border-radius: 30px; font-size: 0.9rem;
      font-weight: 600; z-index: 10000; animation: notifSlide 0.3s ease;
      display: flex; align-items: center; gap: 8px;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 1500);
  }

  // Update the UI
  function updateUI() {
    const current = getCurrentNum();
    const max = getMaxPages();
    const likes = getLikes();
    const isLiked = likes.includes(current);
    const type = getPageType();
    const prefix = type === 'final' ? 'final' : 'variation';

    // Update like button
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.innerHTML = isLiked ? '♥' : '♡';
      likeBtn.classList.toggle('liked', isLiked);
    }

    // Update counter
    const counter = document.querySelector('.variation-counter');
    if (counter) {
      counter.textContent = `${current} / ${max}`;
    }

    // Update liked list
    const likedList = document.querySelector('.liked-list');
    if (likedList) {
      if (likes.length > 0) {
        likedList.innerHTML = `<span class="liked-label">Liked:</span> ${likes.map(l => `<span class="liked-num" onclick="window.location.href='${prefix}-${l}.html'">${l}</span>`).join(' ')}`;
        likedList.style.display = 'flex';
      } else {
        likedList.style.display = 'none';
      }
    }
  }

  // Create the enhanced picker UI
  function createPickerUI() {
    const type = getPageType();
    if (!type) return; // Not on a variation or final page

    const current = getCurrentNum();
    const max = getMaxPages();
    const items = getItems();
    const prefix = type === 'final' ? 'final' : 'variation';
    const title = type === 'final' ? 'Final Drafts' : 'Layout Picker';

    // Remove any existing pickers
    const existingPicker = document.querySelector('.variation-picker-enhanced');
    if (existingPicker) existingPicker.remove();
    const oldPicker = document.querySelector('.variation-picker');
    if (oldPicker) oldPicker.remove();
    const finalPicker = document.querySelector('.final-picker');
    if (finalPicker) finalPicker.remove();

    const picker = document.createElement('div');
    picker.className = 'variation-picker-enhanced';
    picker.innerHTML = `
      <style>
        @keyframes notifSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .variation-picker-enhanced {
          position: fixed; bottom: 20px; right: 20px;
          background: #1a1a1a; color: #fff;
          padding: 15px 20px; border-radius: 12px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
          z-index: 9999; font-family: 'Inter', sans-serif;
          min-width: 280px;
        }
        .picker-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #333;
        }
        .picker-title { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .variation-counter { color: #888; font-size: 0.85rem; }
        .picker-nav {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
        }
        .nav-btn {
          width: 40px; height: 40px; border-radius: 8px;
          background: #333; border: none; color: #fff;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; transition: all 0.2s;
          font-size: 1.2rem;
        }
        .nav-btn:hover { background: #444; }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .like-btn {
          width: 40px; height: 40px; border-radius: 8px;
          background: #333; border: none; color: #fff;
          cursor: pointer; font-size: 1.3rem; transition: all 0.2s;
        }
        .like-btn:hover { background: #444; }
        .like-btn.liked { background: #c62828; color: #fff; }
        .picker-select {
          flex: 1; background: #333; color: #fff; border: none;
          padding: 10px 12px; border-radius: 8px; font-size: 0.85rem;
          cursor: pointer;
        }
        .picker-help {
          font-size: 0.7rem; color: #666; margin-top: 10px;
          line-height: 1.5;
        }
        .picker-help kbd {
          background: #333; padding: 2px 6px; border-radius: 3px;
          font-family: monospace;
        }
        .liked-list {
          display: none; flex-wrap: wrap; gap: 6px;
          margin-top: 12px; padding-top: 12px; border-top: 1px solid #333;
          align-items: center;
        }
        .liked-label { font-size: 0.75rem; color: #888; margin-right: 5px; }
        .liked-num {
          background: #c62828; color: #fff; padding: 4px 10px;
          border-radius: 4px; font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        }
        .liked-num:hover { background: #e53935; }
        .picker-switch {
          margin-top: 12px; padding-top: 12px; border-top: 1px solid #333;
          text-align: center;
        }
        .picker-switch a {
          color: #888; font-size: 0.75rem; text-decoration: none;
          transition: color 0.2s;
        }
        .picker-switch a:hover { color: #fff; }
      </style>
      <div class="picker-header">
        <span class="picker-title">${title}</span>
        <span class="variation-counter">${current} / ${max}</span>
      </div>
      <div class="picker-nav">
        <button class="nav-btn prev-btn" ${current === 1 ? 'disabled' : ''}>←</button>
        <select class="picker-select">
          ${items.map(v => `<option value="${v.id}" ${v.id === current ? 'selected' : ''}>${v.id}. ${v.name}</option>`).join('')}
        </select>
        <button class="nav-btn next-btn" ${current === max ? 'disabled' : ''}>→</button>
        <button class="like-btn" title="Like/Unlike (↑/↓)">♡</button>
      </div>
      <div class="liked-list"></div>
      <div class="picker-help">
        <kbd>←</kbd> <kbd>→</kbd> Navigate &nbsp;|&nbsp; <kbd>↑</kbd> Like &nbsp;|&nbsp; <kbd>↓</kbd> Unlike
      </div>
      <div class="picker-switch">
        ${type === 'final'
          ? '<a href="variation-1.html">← View all 20 variations</a>'
          : '<a href="final-1.html">→ View 5 final drafts</a>'}
      </div>
    `;
    document.body.appendChild(picker);

    // Event listeners
    picker.querySelector('.prev-btn').addEventListener('click', () => goToPage(current - 1));
    picker.querySelector('.next-btn').addEventListener('click', () => goToPage(current + 1));
    picker.querySelector('.picker-select').addEventListener('change', (e) => goToPage(parseInt(e.target.value)));
    picker.querySelector('.like-btn').addEventListener('click', () => {
      const likes = getLikes();
      toggleLike(!likes.includes(current));
    });

    updateUI();
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const current = getCurrentNum();

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPage(current - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToPage(current + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        toggleLike(true);
        break;
      case 'ArrowDown':
        e.preventDefault();
        toggleLike(false);
        break;
    }
  });

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPickerUI);
  } else {
    createPickerUI();
  }
})();
