// ===== SPA: mostrar/ocultar páginas =====
let revealObserver;

window.showPage = function (pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'));
  const target = document.getElementById('page-' + pageId);
  if (!target) return;
  target.classList.add('page--active');
  window.scrollTo(0, 0);
  // Re-lanzar animaciones reveal de la página nueva
  setTimeout(() => {
    target.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 70);
    });
  }, 80);
};

document.addEventListener('DOMContentLoaded', () => {

  // Activar la página home al inicio
  const home = document.getElementById('page-home');
  if (home) home.classList.add('page--active');

  // ===== SCROLL PROGRESS =====
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
  }

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== NAV TOGGLE MOBILE =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', closeNav));
  }

  // ===== SMOOTH SCROLL (secciones del home) =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // Si estamos en una página de detalle, volver al home primero
      const activePage = document.querySelector('.page.page--active');
      if (activePage && activePage.id !== 'page-home') {
        window.showPage('home');
        setTimeout(() => {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }, 120);
      } else {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ===== SCROLL REVEAL =====
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Hero entra de inmediato
  setTimeout(() => {
    document.querySelectorAll('#page-home .section-hero .reveal').forEach(el => el.classList.add('visible'));
  }, 80);

  // ===== COUNTER ANIMATION =====
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    (function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(update);
      else { el.textContent = target; el.classList.add('animated'); }
    })(start);
  }

  // ===== FAQ =====
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  // ===== ACTIVE NAV LINK =====
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.35, rootMargin: '-60px 0px 0px 0px' });

  sections.forEach(s => sectionObs.observe(s));
});
