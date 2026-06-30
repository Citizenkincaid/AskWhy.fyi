/* ============================================
   AskWhy.fyi — Shared JavaScript
   ============================================ */

// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Active nav link ──
const navLinks = document.querySelectorAll('.nav-links a');
const currentPage = location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* NOTE:
   The hero gold-particle canvas is intentionally NOT handled here.
   index.html runs its own particle system inline, sized to the hero's
   left column. Running a second copy here caused two competing
   requestAnimationFrame loops on the same <canvas>. */

// ── Intersection observer fade-in ──
//   NOTE: the spotlight CAROUSEL fades in as a single block (.spotlight-carousel),
//   never the individual .spotlight slides — those are positioned off-screen by the
//   carousel and would otherwise stay invisible because they never intersect.
const fadeEls = document.querySelectorAll('.card, .lens-card, .figure-card, .timeline-card, .spotlight-carousel, .question-item, .timeline-item');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform.replace('translateY(20px)', 'translateY(0)');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = (el.style.transform || '') + ' translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    io.observe(el);
  });
}

// ── Spotlight carousel (index) ──
(function () {
  const carousel = document.querySelector('.spotlight-carousel');
  if (!carousel) return;

  const track    = carousel.querySelector('.spotlight-track');
  const slides   = Array.from(track.querySelectorAll('.spotlight'));
  const prevBtn  = carousel.querySelector('.spot-prev');
  const nextBtn  = carousel.querySelector('.spot-next');
  const dotsWrap = carousel.querySelector('.spot-dots');
  if (slides.length <= 1) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = 7000;
  let index = 0;
  let timer = null;

  // Build the dot indicators
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'spot-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Show highlight ' + (i + 1) + ' of ' + slides.length);
    dot.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function update() {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    slides.forEach((s, i) => {
      const active = i === index;
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
      // Keep keyboard focus out of off-screen slides
      s.querySelectorAll('a').forEach(a => { a.tabIndex = active ? 0 : -1; });
    });
  }

  function go(i)   { index = (i + slides.length) % slides.length; update(); }
  function next()  { go(index + 1); }
  function prev()  { go(index - 1); }

  function start() { if (!reduceMotion) timer = setInterval(next, INTERVAL); }
  function stop()  { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });

  // Pause auto-advance while the reader is interacting
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  // Whole card is clickable, but real links inside still work normally
  slides.forEach(slide => {
    const href = slide.getAttribute('data-href');
    if (!href) return;
    slide.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      window.location.href = href;
    });
  });

  // Arrow-key support when the carousel has focus
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft')  { prev(); restart(); }
  });

  update();
  start();
})();

// ── Filter tabs ──
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // Filter logic can be extended here
  });
});

// ── Newsletter form ──
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (input && input.value.includes('@')) {
      btn.textContent = 'Subscribed ✓';
      btn.style.background = '#4caf78';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    } else {
      input && input.focus();
    }
  });
});

// ── Timeline scroll progress bar ──
const timelineStrip = document.querySelector('.timeline-strip');
const scrollProgress = document.querySelector('.timeline-scroll-progress');
if (timelineStrip && scrollProgress) {
  timelineStrip.addEventListener('scroll', () => {
    const { scrollLeft, scrollWidth, clientWidth } = timelineStrip;
    const pct = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    scrollProgress.style.width = Math.min(100, Math.max(5, pct + 5)) + '%';
  });
}