/**
 * L'Épopée — script.js
 * Literary sports journalism interactions
 *
 * Features:
 *  - Reading progress bar
 *  - Sticky nav with scroll-based opacity
 *  - Smooth scroll for anchor links
 *  - Intersection Observer fade-in for article cards
 *  - Mobile nav toggle (hamburger)
 *  - Like / Bookmark toggles on article cards
 *  - Newsletter form feedback
 */

'use strict';

/* ============================================================
   Helpers
   ============================================================ */

/**
 * Query a single element; returns null if not found.
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element|null}
 */
function $(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Query all matching elements as an Array.
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element[]}
 */
function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/* ============================================================
   1. Reading Progress Bar
   ============================================================ */

function initProgressBar() {
  const bar = $('#progressBar');
  if (!bar) return;

  function updateBar() {
    const scrollTop    = window.scrollY || document.documentElement.scrollTop;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = Math.min(progress, 100).toFixed(2) + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/* ============================================================
   2. Sticky Navigation — Scroll-based Opacity
   ============================================================ */

function initStickyNav() {
  const nav = $('#mainNav');
  if (!nav) return;

  // The top-bar is ~36px; once we've scrolled past it, add the
  // "scrolled" class which makes the nav slightly more opaque.
  const THRESHOLD = 40;

  function handleScroll() {
    if (window.scrollY > THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================================
   3. Smooth Scroll for Anchor Links
   ============================================================ */

function initSmoothScroll() {
  // The CSS already handles `scroll-behavior: smooth` on <html>,
  // but we add JS handling for nav offset compensation and
  // mobile-menu-close-before-scroll.

  const nav = $('#mainNav');

  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
}

/* ============================================================
   4. Fade-in on Scroll (Intersection Observer)
   ============================================================ */

function initFadeIn() {
  const items = $$('.fade-in');
  if (!items.length) return;

  // If the browser doesn't support IntersectionObserver, reveal all immediately
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px', // trigger 60px before element enters viewport
      threshold: 0.08
    }
  );

  items.forEach(el => observer.observe(el));
}

/* ============================================================
   5. Mobile Navigation Toggle
   ============================================================ */

let mobileMenuOpen = false;

function openMobileMenu() {
  const menu    = $('#mobileMenu');
  const btn     = $('#hamburgerBtn');
  if (!menu || !btn) return;

  mobileMenuOpen = true;
  menu.classList.add('is-open');
  menu.setAttribute('aria-hidden', 'false');
  btn.classList.add('is-active');
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Fermer le menu de navigation');

  // Trap focus inside menu; prevent body scroll
  document.body.style.overflow = 'hidden';

  // Move focus to close button
  const closeBtn = $('#mobileMenuClose');
  if (closeBtn) {
    setTimeout(() => closeBtn.focus(), 50);
  }
}

function closeMobileMenu() {
  const menu    = $('#mobileMenu');
  const btn     = $('#hamburgerBtn');
  if (!menu || !btn || !mobileMenuOpen) return;

  mobileMenuOpen = false;
  menu.classList.remove('is-open');
  menu.setAttribute('aria-hidden', 'true');
  btn.classList.remove('is-active');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Ouvrir le menu de navigation');

  document.body.style.overflow = '';
  btn.focus();
}

function initMobileNav() {
  const hamburger = $('#hamburgerBtn');
  const closeBtn  = $('#mobileMenuClose');
  const menu      = $('#mobileMenu');

  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
  });

  // Close on backdrop click (click outside the <nav> inside menu)
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      closeMobileMenu();
    }
  });
}

/* ============================================================
   6. Like / Bookmark Toggles
   ============================================================ */

function initArticleActions() {
  // Like buttons
  $$('.btn-like').forEach(btn => {
    btn.addEventListener('click', function () {
      const isLiked = this.dataset.liked === 'true';
      const countEl = this.querySelector('.like-count');
      const count   = parseInt(this.dataset.count, 10) || 0;

      if (isLiked) {
        this.dataset.liked = 'false';
        this.dataset.count = count - 1;
        this.classList.remove('is-liked');
        this.setAttribute('aria-label', `J'aime cet article (${count - 1} likes)`);
        if (countEl) countEl.textContent = count - 1;
      } else {
        this.dataset.liked = 'true';
        this.dataset.count = count + 1;
        this.classList.add('is-liked');
        this.setAttribute('aria-label', `J'aime cet article (${count + 1} likes)`);
        if (countEl) countEl.textContent = count + 1;

        // Micro-animation: brief scale pulse
        this.style.transform = 'scale(1.25)';
        setTimeout(() => { this.style.transform = ''; }, 180);
      }
    });
  });

  // Bookmark buttons
  $$('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', function () {
      const isSaved = this.dataset.saved === 'true';

      if (isSaved) {
        this.dataset.saved = 'false';
        this.classList.remove('is-saved');
        this.setAttribute('aria-label', 'Sauvegarder cet article');
      } else {
        this.dataset.saved = 'true';
        this.classList.add('is-saved');
        this.setAttribute('aria-label', 'Article sauvegardé');

        // Micro-animation
        this.style.transform = 'scale(1.3)';
        setTimeout(() => { this.style.transform = ''; }, 200);
      }
    });
  });
}

/* ============================================================
   7. Newsletter Form
   ============================================================ */

function initNewsletterForm() {
  const form  = $('#newsletterForm');
  const msgEl = $('#emailMsg');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const input = $('#emailInput');
    const email = input ? input.value.trim() : '';

    if (!email) return;

    // Disable form during submission
    const submitBtn = form.querySelector('.btn-email');
    if (submitBtn) {
      submitBtn.disabled   = true;
      submitBtn.textContent = '...';
    }

    // Simulate async submission (replace with real API call)
    setTimeout(() => {
      if (msgEl) {
        msgEl.textContent = 'Bienvenue dans L\'Épopée. Consultez votre boîte mail.';
        msgEl.style.color = '#B8860B';
      }

      if (input)     input.value      = '';
      if (submitBtn) {
        submitBtn.disabled   = false;
        submitBtn.textContent = 'Rejoindre';
      }

      // Reset message after 6 seconds
      setTimeout(() => {
        if (msgEl) {
          msgEl.textContent = 'Aucun spam. Désabonnement en un clic.';
          msgEl.style.color = '';
        }
      }, 6000);
    }, 900);
  });
}

/* ============================================================
   8. Search Button (placeholder interaction)
   ============================================================ */

function initSearch() {
  const btn = $('#searchBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Placeholder: a real implementation would open a search overlay.
    // For now, visually indicate the feature is coming.
    btn.classList.add('nav-search--active');
    setTimeout(() => btn.classList.remove('nav-search--active'), 300);
  });
}

/* ============================================================
   Init — DOMContentLoaded
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initStickyNav();
  initSmoothScroll();
  initFadeIn();
  initMobileNav();
  initArticleActions();
  initNewsletterForm();
  initSearch();
});
