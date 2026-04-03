/**
 * Style Picker - Reusable style picker component
 * Usage: Call createPicker(styles, styleNames, applyCallback) to create a picker
 */
(function() {
  'use strict';

  // Get favorites from localStorage
  function getFavorites(storageKey) {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch(e) { return []; }
  }

  // Toggle favorite
  function toggleFavorite(num, storageKey) {
    var favs = getFavorites(storageKey);
    var idx = favs.indexOf(num);
    if (idx > -1) {
      favs.splice(idx, 1);
    } else {
      favs.push(num);
    }
    localStorage.setItem(storageKey, JSON.stringify(favs));
    return favs;
  }

  /**
   * Create a style picker
   * @param {Object} options
   * @param {Array} options.styleNames - Array of style names
   * @param {Function} options.onSelect - Callback when style is selected (receives style number)
   * @param {string} options.title - Picker title
   * @param {string} options.storageKey - localStorage key for favorites
   */
  window.createPicker = function(options) {
    var styleNames = options.styleNames || [];
    var onSelect = options.onSelect || function() {};
    var title = options.title || 'Style Picker';
    var storageKey = options.storageKey || 'pickerFavorites';

    // Remove if already exists
    var existing = document.getElementById('style-picker');
    if (existing) { existing.remove(); return; }

    var favs = getFavorites(storageKey);

    var picker = document.createElement('div');
    picker.id = 'style-picker';
    picker.innerHTML = '<div class="sp-header"><span>' + title + '</span><div class="sp-header-btns">' +
      '<button class="sp-show-favs" id="sp-fav-btn">Show Favorites</button>' +
      '<button id="sp-close-btn">\u00d7</button></div></div>' +
      '<div class="sp-grid">' + styleNames.map(function(name, i) {
        var num = i + 1;
        var isFav = favs.indexOf(num) > -1;
        return '<div class="sp-item" data-num="' + num + '">' +
          '<button class="sp-btn" data-style="' + num + '">' + name + '</button>' +
          '<span class="sp-heart' + (isFav ? ' favorited' : '') + '" data-num="' + num + '">' + (isFav ? '\u2665' : '\u2661') + '</span>' +
          '</div>';
      }).join('') + '</div>';

    var css = document.createElement('style');
    css.id = 'style-picker-css';
    css.textContent = '#style-picker{position:fixed;bottom:20px;right:20px;transform:none;' +
      'background:#1a1a1a;border-radius:16px;padding:0;z-index:999999;width:340px;max-width:90vw;' +
      'box-shadow:0 25px 80px rgba(0,0,0,0.5);font-family:system-ui,sans-serif;max-height:70vh;overflow:hidden}' +
      '.sp-header{display:flex;justify-content:space-between;align-items:center;padding:15px 20px;' +
      'border-bottom:1px solid #333;color:#fff;font-weight:600;font-size:14px}' +
      '.sp-header-btns{display:flex;gap:10px;align-items:center}' +
      '.sp-show-favs{background:#333;border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px}' +
      '.sp-show-favs:hover{background:#444}.sp-show-favs.active{background:#e74c3c}' +
      '.sp-header-btns>button:last-child{background:none;border:none;color:#888;font-size:24px;cursor:pointer;padding:0;line-height:1}' +
      '.sp-header-btns>button:last-child:hover{color:#fff}' +
      '.sp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:15px;max-height:60vh;overflow-y:auto}' +
      '.sp-item{display:flex;align-items:stretch;background:#2a2a2a;border:1px solid #333;border-radius:8px;overflow:hidden;transition:all 0.2s}' +
      '.sp-item:hover{border-color:#3498db}' +
      '.sp-item.hidden{display:none}' +
      '.sp-btn{flex:1;background:transparent;border:none;color:#fff;padding:10px 12px;' +
      'cursor:pointer;font-size:12px;text-align:left;transition:all 0.2s}' +
      '.sp-btn:hover{background:#3498db}' +
      '.sp-heart{padding:10px 12px;cursor:pointer;font-size:16px;color:#666;transition:all 0.2s;display:flex;align-items:center}' +
      '.sp-heart:hover{color:#e74c3c}' +
      '.sp-heart.favorited{color:#e74c3c}';

    document.body.appendChild(css);
    document.body.appendChild(picker);

    // Event: Close button
    document.getElementById('sp-close-btn').onclick = function() {
      picker.remove();
      css.remove();
    };

    // Event: Style buttons
    picker.querySelectorAll('.sp-btn').forEach(function(btn) {
      btn.onclick = function() {
        var num = parseInt(this.getAttribute('data-style'));
        onSelect(num);
      };
    });

    // Event: Heart/favorite buttons
    picker.querySelectorAll('.sp-heart').forEach(function(heart) {
      heart.onclick = function(e) {
        e.stopPropagation();
        var num = parseInt(this.getAttribute('data-num'));
        var newFavs = toggleFavorite(num, storageKey);
        var isFav = newFavs.indexOf(num) > -1;
        this.classList.toggle('favorited', isFav);
        this.innerHTML = isFav ? '\u2665' : '\u2661';
      };
    });

    // Event: Filter favorites
    document.getElementById('sp-fav-btn').onclick = function() {
      var btn = this;
      var items = picker.querySelectorAll('.sp-item');
      var currentFavs = getFavorites(storageKey);

      btn.classList.toggle('active');
      var showOnlyFavs = btn.classList.contains('active');
      btn.textContent = showOnlyFavs ? 'Show All' : 'Show Favorites';

      items.forEach(function(item) {
        var num = parseInt(item.getAttribute('data-num'));
        if (showOnlyFavs && currentFavs.indexOf(num) === -1) {
          item.classList.add('hidden');
        } else {
          item.classList.remove('hidden');
        }
      });
    };

    return picker;
  };

  // Close picker on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var picker = document.getElementById('style-picker');
      var css = document.getElementById('style-picker-css');
      if (picker) picker.remove();
      if (css) css.remove();
    }
  });

})();
