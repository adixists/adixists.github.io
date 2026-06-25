/* ============================================================
   ADITYA TRIPATHI PORTFOLIO - JavaScript
   Features: Particles, Typewriter, Scroll Reveal, Theme Toggle,
             Skill Bars, Counter Animations, Cursor, Loader,
             Contact Form, Active Nav, Back-to-Top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========================
  // 1. LOADER + LOGO DRAW ANIMATION
  // ========================
  const loader     = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderText = document.getElementById('loaderText');

  const loaderMessages = [
    'Initializing...',
    'Loading Portfolio...',
    'Rendering Components...',
    'Almost There...',
    'Welcome! 🚀'
  ];

  // ── Logo Cinematic Image Animation ──
  // The logo.png image is styled with theme-adaptive CSS filters.
  // We trigger a cinematic reveal: scale down + unblur + opacity in.
  
  const loaderLogoImg = document.getElementById('loaderLogoImg');
  
  if (loaderLogoImg) {
    // Trigger cinematic reveal animation
    loaderLogoImg.style.animation = 'loaderLogoReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    
    // After reveal, start gentle pulse
    loaderLogoImg.addEventListener('animationend', () => {
      const loaderLogo = document.getElementById('loaderLogo');
      if (loaderLogo) {
        loaderLogo.style.animation = 'loaderLogoPulse 2.5s ease-in-out infinite';
      }
    }, { once: true });
  }

  // Total animation: ~1.8s reveal. Loader holds 4000ms for glow settle.

  // ── Loader progress bar
  const LOADER_MIN_MS = 4000; // hold loader: logo assembles ~2300ms, glow settles ~3500ms
  const loaderStart   = Date.now();

  let progress = 0;
  let msgIdx   = 0;

  const loaderInterval = setInterval(() => {
    progress += Math.random() * 22 + 8;
    if (progress >= 100) { progress = 100; clearInterval(loaderInterval); }

    loaderFill.style.width = progress + '%';

    const newMsgIdx = Math.floor((progress / 100) * (loaderMessages.length - 1));
    if (newMsgIdx !== msgIdx) {
      msgIdx = newMsgIdx;
      loaderText.textContent = loaderMessages[msgIdx];
    }

    if (progress === 100) {
      const elapsed   = Date.now() - loaderStart;
      const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
          el.classList.add('visible');
        });
      }, remaining + 200);
    }
  }, 120);

  document.body.style.overflow = 'hidden';


  // ========================
  // 2. CUSTOM CURSOR
  // ========================
  const cursorOuter = document.getElementById('cursorOuter');
  const cursorDot   = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .skill-pill, .project-card, .glass-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOuter.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursorOuter.style.borderColor = 'var(--accent-2)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOuter.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOuter.style.borderColor = 'var(--accent-1)';
    });
  });

  // Hide cursor when not on page
  document.addEventListener('mouseleave', () => {
    cursorOuter.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorOuter.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });


  // ========================
  // 3. PARTICLE CANVAS
  // ========================
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let particles = [];
  let W = 0, H = 0;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getParticleColor() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (theme === 'dark')   return 'rgba(99, 179, 237,';
    if (theme === 'light')  return 'rgba(37, 99, 235,';
    if (theme === 'purple') return 'rgba(139, 92, 246,';
    return 'rgba(99, 179, 237,';
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.r    = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      const color = getParticleColor();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles(count = 80) {
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const color = getParticleColor();
          ctx.beginPath();
          ctx.strokeStyle = color + (0.08 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Repel particles from mouse
  document.addEventListener('mousemove', e => {
    particles.forEach(p => {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        p.vx += (dx / dist) * 0.3;
        p.vy += (dy / dist) * 0.3;
        const maxV = 2;
        p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
        p.vy = Math.max(-maxV, Math.min(maxV, p.vy));
      }
    });
  });


  // ========================
  // 4. TYPEWRITER / ROLES
  // ========================
  const roles = [
    'AI-powered Apps 🧠',
    'Full-Stack Solutions ⚡',
    'React Frontends 🎨',
    'FastAPI Backends 🚀',
    'Cloud Systems ☁️',
    'Accessible Tools ♿'
  ];

  const roleEl = document.getElementById('roleDynamic');
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let typingDelay = 80;

  function typeWriter() {
    const current = roles[roleIdx];
    if (!deleting) {
      roleEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        typingDelay = 2000; // Pause at full word
      } else {
        typingDelay = 80;
      }
    } else {
      roleEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        typingDelay = 400;
      } else {
        typingDelay = 45;
      }
    }
    setTimeout(typeWriter, typingDelay);
  }
  setTimeout(typeWriter, 1500);


  // ========================
  // 5. NAVBAR SCROLL + ACTIVE
  // ========================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled style
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top
    const btt = document.getElementById('backToTop');
    btt.classList.toggle('visible', window.scrollY > 400);

    // Active nav link
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
  });

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector('#' + link.getAttribute('data-section'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      document.getElementById('navLinks').classList.remove('open');
    });
  });


  // ========================
  // 6. HAMBURGER MENU
  // ========================
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinksEl.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });


  // ========================
  // 7. THEME SWITCHER
  // ========================
  const themeBtns = document.querySelectorAll('.theme-btn');

  // Theme color palettes for logo gradients
  const logoGradients = {
    dark:   { c1: '#63b3ed', c2: '#9f7aea', c3: '#68d391' },
    light:  { c1: '#2563eb', c2: '#7c3aed', c3: '#059669' },
    purple: { c1: '#a78bfa', c2: '#e879f9', c3: '#818cf8' }
  };

  function updateLogoGradients(theme) {
    const g = logoGradients[theme] || logoGradients.dark;
    // Update all gradient definitions across all SVGs
    const gradIds = ['l-grad', 'n-grad', 'f-grad'];
    gradIds.forEach(id => {
      const grad = document.getElementById(id);
      if (!grad) return;
      const stops = grad.querySelectorAll('stop');
      if (stops[0]) stops[0].setAttribute('stop-color', g.c1);
      if (stops[1]) stops[1].setAttribute('stop-color', g.c2);
      if (stops[2]) stops[2].setAttribute('stop-color', g.c3);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
    // Re-init particles to update color
    initParticles();
    // Update logo gradient colors to match theme
    updateLogoGradients(theme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.getAttribute('data-theme'));
    });
  });


  // ========================
  // 8. SCROLL REVEAL
  // ========================
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ========================
  // 9. SKILL BARS ANIMATION
  // ========================
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => barObserver.observe(bar));


  // ========================
  // 10. COUNTER ANIMATION
  // ========================
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        let count = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          entry.target.textContent = Math.floor(count);
        }, 40);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  // ========================
  // 11. CONTACT FORM
  // ========================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
      formSuccess.classList.add('show');
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
      submitBtn.disabled = false;
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });


  // ========================
  // 12. BACK TO TOP
  // ========================
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ========================
  // 13. PROFILE IMAGE FALLBACK
  // ========================
  const profileImg = document.getElementById('profileImg');
  profileImg.addEventListener('error', () => {
    // Create a beautiful gradient placeholder if image not found
    const wrap = profileImg.parentElement;
    profileImg.remove();
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%; height: 100%;
      background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Syne', sans-serif;
      font-size: 5rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.02em;
    `;
    placeholder.textContent = 'AT';
    wrap.appendChild(placeholder);
  });


  // ========================
  // 14. TILT EFFECT ON CARDS
  // ========================
  const tiltCards = document.querySelectorAll('.project-card, .timeline-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ========================
  // 15. GLOWING ORBS PARALLAX
  // ========================
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    document.querySelectorAll('.hero-bg-orb').forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });


  // ========================
  // 16. SKILL PILL RIPPLE
  // ========================
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      ripple.style.cssText = `
        position: absolute;
        width: 20px; height: 20px;
        background: var(--accent-1);
        border-radius: 50%;
        opacity: 0.4;
        transform: scale(0);
        animation: rippleOut 0.5s ease-out forwards;
        left: ${e.clientX - rect.left - 10}px;
        top: ${e.clientY - rect.top - 10}px;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleOut {
      to { transform: scale(5); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);


  // ========================
  // 17. ANIMATED GRADIENT BORDER ON HERO
  // ========================
  let gradAngle = 0;
  const profileImgWrap = document.querySelector('.profile-img-wrap');

  function animateProfileBorder() {
    gradAngle = (gradAngle + 0.5) % 360;
    profileImgWrap.style.borderColor = 'transparent';
    profileImgWrap.style.boxShadow = `
      0 0 0 3px hsl(${gradAngle}, 80%, 60%),
      0 0 40px rgba(99, 179, 237, 0.3),
      0 0 80px rgba(159, 122, 234, 0.2)
    `;
    requestAnimationFrame(animateProfileBorder);
  }
  animateProfileBorder();


  // ========================
  // 18. SECTION BACKGROUND GLOW
  // ========================
  const observerGlow = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section').forEach(s => observerGlow.observe(s));

}); // end DOMContentLoaded
