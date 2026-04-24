// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile burger menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// FAQ accordion
document.querySelectorAll('.faq-item__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Pricing toggle
const toggleBtns = document.querySelectorAll('.toggle-btn');
const periodLabels = {
  hour: '/heure',
  day: '/jour',
  month: '/mois',
};

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleBtns.forEach(b => b.classList.remove('toggle-btn--active'));
    btn.classList.add('toggle-btn--active');

    const period = btn.dataset.period;
    document.querySelectorAll('.price').forEach(el => {
      el.textContent = el.dataset[period] || el.dataset.hour;
    });
    document.querySelectorAll('.period').forEach(el => {
      el.textContent = periodLabels[period] || '';
    });
  });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Search button
document.querySelector('.btn--search').addEventListener('click', () => {
  const cityInput = document.querySelector('.search-field input[type="text"]');
  const city = cityInput.value.trim() || 'votre ville';
  alert(`Recherche de parkings à ${city} en cours…\n(Fonctionnalité à connecter au backend)`);
});

// Animate elements on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.step, .location-card, .pricing-card, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
