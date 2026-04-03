// HQ Aviation - Helicopter Listings Module
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const COLLECTION_NAME = 'helicopters';

/**
 * Get all available helicopters
 */
export async function getAvailableHelicopters() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'available'),
      orderBy('sortOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching available helicopters:', error);
    return [];
  }
}

/**
 * Get recently sold helicopters
 */
export async function getRecentlySold(maxItems = 6) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'sold'),
      orderBy('soldAt', 'desc'),
      limit(maxItems)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching sold helicopters:', error);
    return [];
  }
}

/**
 * Get featured helicopters for homepage
 */
export async function getFeaturedHelicopters() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'available'),
      where('featured', '==', true),
      orderBy('sortOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching featured helicopters:', error);
    return [];
  }
}

/**
 * Get a single helicopter by ID
 */
export async function getHelicopterById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching helicopter:', error);
    return null;
  }
}

/**
 * Get all helicopters (both available and sold)
 */
export async function getAllHelicopters() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('sortOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all helicopters:', error);
    return [];
  }
}

/**
 * Render image carousel for helicopter card
 */
function renderImageCarousel(helicopter) {
  const images = helicopter.images || [];
  const hasMultipleImages = images.length > 1;

  if (images.length === 0) {
    return `
      <div class="helicopter-carousel">
        <div class="carousel-slides">
          <div class="carousel-slide active">
            <img src="/assets/images/used-aircraft/r44/r44-raven-ii-grrob.jpg" alt="${helicopter.model}" loading="lazy">
          </div>
        </div>
      </div>
    `;
  }

  const slides = images.map((img, index) => `
    <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
      <img src="${img.url}" alt="${img.alt || helicopter.model}" loading="lazy">
    </div>
  `).join('');

  const dots = hasMultipleImages ? `
    <div class="carousel-dots">
      ${images.map((_, index) => `
        <span class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
      `).join('')}
    </div>
  ` : '';

  const arrows = hasMultipleImages ? `
    <button class="carousel-arrow carousel-prev" aria-label="Previous image">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="carousel-arrow carousel-next" aria-label="Next image">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 6 15 12 9 18"></polyline>
      </svg>
    </button>
  ` : '';

  return `
    <div class="helicopter-carousel" data-total="${images.length}">
      <div class="carousel-slides">
        ${slides}
      </div>
      ${arrows}
      ${dots}
    </div>
  `;
}

/**
 * Render a helicopter card (available listing)
 */
export function renderHelicopterCard(helicopter) {
  const statusBadge = helicopter.status === 'reserved'
    ? '<span class="helicopter-badge reserved">Reserved</span>'
    : '';

  return `
    <div class="helicopter-card" data-helicopter-id="${helicopter.id}">
      <div class="helicopter-card-image">
        ${renderImageCarousel(helicopter)}
        ${statusBadge}
      </div>
      <div class="helicopter-card-content">
        <h3 class="helicopter-card-title">${helicopter.model}</h3>
        <div class="helicopter-card-details">
          <span class="helicopter-year">${helicopter.year}</span>
          <span class="helicopter-reg">${helicopter.registration || ''}</span>
        </div>
        <div class="helicopter-card-specs">
          <div class="spec-item">
            <span class="spec-label">Hours</span>
            <span class="spec-value">${helicopter.totalHours?.toLocaleString() || 'TBD'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Condition</span>
            <span class="spec-value">${helicopter.condition || 'Excellent'}</span>
          </div>
        </div>
        <div class="helicopter-card-price">${helicopter.priceDisplay || 'POA'}</div>
        <a href="/helicopter-details.html?id=${helicopter.id}" class="helicopter-card-btn">View Details</a>
      </div>
    </div>
  `;
}

/**
 * Render a sold helicopter card
 */
export function renderSoldCard(helicopter) {
  return `
    <div class="helicopter-card sold" data-helicopter-id="${helicopter.id}">
      <div class="helicopter-card-image">
        ${renderImageCarousel(helicopter)}
        <span class="helicopter-badge sold sold-style-69">Sold</span>
      </div>
      <div class="helicopter-card-content">
        <h3 class="helicopter-card-title">${helicopter.model} <span class="helicopter-title-divider">-</span> <span class="helicopter-title-year">${helicopter.year}</span></h3>
      </div>
    </div>
  `;
}

/**
 * Render loading skeleton cards
 */
export function renderSkeletonCards(count = 3) {
  return Array(count).fill(`
    <div class="helicopter-card skeleton">
      <div class="helicopter-card-image skeleton-image"></div>
      <div class="helicopter-card-content">
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-text skeleton-details"></div>
        <div class="skeleton-text skeleton-price"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Initialize carousel functionality for a container
 */
function initCarousels(container) {
  const carousels = container.querySelectorAll('.helicopter-carousel');

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const total = slides.length;

    if (total <= 1) return;

    let currentIndex = 0;

    function goToSlide(index) {
      // Handle wrapping
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;

      // Update slides
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    // Arrow click handlers
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Dot click handlers
    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(i);
      });
    });
  });
}

/**
 * Initialize helicopter listings on a page
 */
export async function initHelicopterListings(containerId, soldContainerId = null) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found`);
    return;
  }

  // Show loading state
  container.innerHTML = renderSkeletonCards(3);

  // Fetch and render available helicopters
  const available = await getAvailableHelicopters();
  if (available.length > 0) {
    container.innerHTML = available.map(renderHelicopterCard).join('');
    initCarousels(container);
  } else {
    container.innerHTML = '<p class="no-listings">No helicopters currently available. Please check back soon or contact us for upcoming inventory.</p>';
  }

  // Fetch and render sold helicopters if container provided
  if (soldContainerId) {
    const soldContainer = document.getElementById(soldContainerId);
    if (soldContainer) {
      const sold = await getRecentlySold(6);
      if (sold.length > 0) {
        soldContainer.innerHTML = sold.map(renderSoldCard).join('');
        initCarousels(soldContainer);
      } else {
        soldContainer.innerHTML = '<p class="no-listings">No recently sold aircraft to display.</p>';
      }
    }
  }
}
