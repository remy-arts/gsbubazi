/* ══════════════════════════════════════════
   GS BUBAZI — MAIN SCRIPT
   Animations, 3D effects, interactions
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──────────────────────
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .teacher-card, .academic-card, .club-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        cursor.style.background = 'rgba(201,148,58,0.5)';
        ring.style.width = '55px'; ring.style.height = '55px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--gold)';
        ring.style.width = '36px'; ring.style.height = '36px';
      });
    });
  }

  // ── NAVBAR SCROLL ──────────────────────
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── HAMBURGER ──────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // ── 3D HERO CANVAS (Particles) ─────────
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: 0, y: 0 };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.z = Math.random() * 3 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.6 + 0.1;
        this.color = Math.random() > 0.7 ? '#c9943a' : '#ffffff';
      }
      update() {
        this.x += this.vx * this.z;
        this.y += this.vy * this.z;
        // mouse parallax
        const dx = (mouse.x - W / 2) * 0.00008 * this.z;
        const dy = (mouse.y - H / 2) * 0.00008 * this.z;
        this.x += dx; this.y += dy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * this.z, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Create particles
    for (let i = 0; i < 120; i++) particles.push(new Particle());

    // Connecting lines
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(201,148,58,' + (0.08 * (1 - dist / 100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX; mouse.y = e.clientY;
    });
  }

  // ── SCROLL REVEAL ──────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ──────────────────
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const isFloat = String(target).includes('.');
    function update(time) {
      const elapsed = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - elapsed, 4);
      const value = isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease);
      el.textContent = value + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-target]').forEach(el => statObserver.observe(el));

  // ── 3D TILT ON ACADEMIC CARDS ──────────
  document.querySelectorAll('.academic-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -12;
      const rotY = ((x - cx) / cx) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── 3D TILT ON CLUB CARDS ──────────────
  document.querySelectorAll('.club-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── FAQ ACCORDION ──────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── NOTICE BOARD TOGGLE ────────────────
  const noticeToggle = document.querySelector('.notice-toggle');
  const noticeBoard = document.querySelector('.notice-board');
  if (noticeToggle && noticeBoard) {
    setTimeout(() => noticeBoard.classList.add('open'), 2500);
    noticeToggle.addEventListener('click', () => {
      noticeBoard.classList.toggle('open');
    });
  }

  // ── GALLERY FILTERS ────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = 1, 10);
        } else {
          item.style.opacity = 0;
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

  // ── SMOOTH ANCHOR SCROLL ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks) navLinks.classList.remove('mobile-open');
      }
    });
  });

  // ── CONTACT FORM ────────────────────────
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // ── HERO PARALLAX ──────────────────────
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
      }
    });
  }

  // ── 3D ROTATING LOGO (SVG crest) ───────
  const crestSvg = document.querySelector('.nav-crest-svg');
  let crestAngle = 0;
  function animateCrest() {
    crestAngle += 0.005;
    const scale = 1 + Math.sin(crestAngle * 2) * 0.02;
    if (crestSvg) {
      crestSvg.style.transform = `scale(${scale})`;
    }
    requestAnimationFrame(animateCrest);
  }
  animateCrest();

  // ── ACTIVE NAV LINK ON SCROLL ──────────
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--gold-light)';
        } else {
          link.style.color = '';
        }
      }
    });
  });

});
