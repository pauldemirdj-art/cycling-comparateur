/**
 * ScorePulse — script.js
 * Sports media site interactions
 */

'use strict';

/* ============================================================
   1. STICKY NAV — scroll detection
   ============================================================ */
(function initStickyNav() {
  const header = document.getElementById('navHeader');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   2. MOBILE NAV TOGGLE
   ============================================================ */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navSports = document.getElementById('navSports');
  if (!hamburger || !navSports) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navSports.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when clicking a sport tab on mobile
  navSports.addEventListener('click', (e) => {
    if (e.target.matches('.sport-tab') && window.innerWidth <= 768) {
      navSports.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navSports.contains(e.target)) {
      navSports.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ============================================================
   3. SPORT TABS in NAV — visual active state only
   ============================================================ */
(function initNavSportTabs() {
  const tabs = document.querySelectorAll('.nav-sports .sport-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
})();

/* ============================================================
   4. NEWS GRID FILTER TABS
   ============================================================ */
(function initFilterTabs() {
  const tabsContainer = document.getElementById('filterTabs');
  const grid = document.getElementById('newsGrid');
  if (!tabsContainer || !grid) return;

  const tabs = tabsContainer.querySelectorAll('.filter-tab');
  const cards = grid.querySelectorAll('.news-card');

  function filterCards(filter) {
    cards.forEach(card => {
      const sport = card.getAttribute('data-sport');
      const show = filter === 'all' || sport === filter;
      // Use hidden attribute for accessibility
      card.hidden = !show;
      if (show) {
        // Re-trigger animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('visible'));
        });
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');
      filterCards(filter);
    });
  });
})();

/* ============================================================
   5. INTERSECTION OBSERVER — fade-in cards
   ============================================================ */
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once visible to save memory
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el, i) => {
    // Stagger delay within the same grid
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    observer.observe(el);
  });
})();

/* ============================================================
   6. LIVE SCORES AUTO-REFRESH SIMULATION
   ============================================================ */
(function initLiveScores() {
  // Match state
  const matches = [
    {
      scoreA: document.getElementById('score1a'),
      scoreB: document.getElementById('score1b'),
      valA: 24,
      valB: 17,
      minute: 58,
      maxMinute: 80,
      active: true,
    },
    {
      scoreA: document.getElementById('score2a'),
      scoreB: document.getElementById('score2b'),
      valA: 19,
      valB: 22,
      minute: 72,
      maxMinute: 80,
      active: true,
    },
  ];

  function flashScore(el) {
    if (!el) return;
    el.style.transition = 'color 0.2s';
    el.style.color = '#E63946';
    setTimeout(() => {
      el.style.color = '';
    }, 600);
  }

  function updateScores() {
    matches.forEach(match => {
      if (!match.active) return;

      match.minute += Math.floor(Math.random() * 3) + 1;
      if (match.minute >= match.maxMinute) {
        match.active = false;
        return;
      }

      // ~15% chance a team scores on each tick
      const rand = Math.random();
      if (rand < 0.08) {
        match.valA += [3, 5, 7][Math.floor(Math.random() * 3)];
        if (match.scoreA) {
          match.scoreA.textContent = match.valA;
          flashScore(match.scoreA);
        }
      } else if (rand < 0.16) {
        match.valB += [3, 5, 7][Math.floor(Math.random() * 3)];
        if (match.scoreB) {
          match.scoreB.textContent = match.valB;
          flashScore(match.scoreB);
        }
      }
    });
  }

  // Update every 30 seconds
  const interval = setInterval(updateScores, 30000);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => clearInterval(interval));
})();

/* ============================================================
   7. TICKER ANIMATION — pause on hover
   ============================================================ */
(function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ============================================================
   8. SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64'
        );
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   9. NEWSLETTER FORM
   ============================================================ */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('emailInput');
  const successMsg = document.getElementById('formSuccess');
  if (!form || !input || !successMsg) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isValidEmail(input.value)) {
      input.style.borderColor = '#E63946';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }
    // Simulate API call
    const btn = form.querySelector('.btn-subscribe');
    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
      successMsg.hidden = false;
      input.value = '';
      btn.textContent = 'S\'abonner';
      btn.disabled = false;
      setTimeout(() => { successMsg.hidden = true; }, 4000);
    }, 900);
  });
})();

/* ============================================================
   10. VIDEO PLAY BUTTONS — click feedback
   ============================================================ */
(function initVideoCards() {
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Visual feedback: brief scale + message
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });
})();

/* ============================================================
   11. LIKE BUTTON — toggle on news cards
   ============================================================ */
(function initLikeButtons() {
  document.querySelectorAll('.card-likes').forEach(likeEl => {
    let liked = false;
    const countText = likeEl.lastChild;

    likeEl.style.cursor = 'pointer';
    likeEl.setAttribute('role', 'button');
    likeEl.setAttribute('aria-label', 'J\'aime');

    likeEl.addEventListener('click', () => {
      liked = !liked;
      likeEl.style.color = liked ? '#E63946' : '';

      // Parse and update count
      const raw = countText.textContent.trim().replace(/\s/g, '');
      const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) {
        const updated = liked ? num + 1 : num - 1;
        // Re-format with space thousand separator
        countText.textContent = ' ' + updated.toLocaleString('fr-FR');
      }
    });
  });
})();

/* ============================================================
   12. CALENDAR SCROLL BUTTONS — keyboard navigation
   ============================================================ */
(function initCalendarScroll() {
  const scroll = document.querySelector('.calendar-scroll');
  if (!scroll) return;

  scroll.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') scroll.scrollBy({ left: 220, behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  scroll.scrollBy({ left: -220, behavior: 'smooth' });
  });
})();
