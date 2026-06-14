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

// ── Gold particle canvas (hero only) ──
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 20000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  // Parallax on mouse move
  const hero = document.querySelector('.hero');
  if (hero) {
    document.addEventListener('mousemove', e => {
      const rx = (e.clientX / window.innerWidth - .5) * 12;
      const ry = (e.clientY / window.innerHeight - .5) * 8;
      hero.style.backgroundPosition = `calc(50% + ${rx}px) calc(50% + ${ry}px)`;
    });
  }
}

// ── Intersection observer fade-in ──
const fadeEls = document.querySelectorAll('.card, .lens-card, .figure-card, .timeline-card, .spotlight, .question-item, .timeline-item');
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