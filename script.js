/**
 * MASTER WEBSITE INTERACTIVE SCRIPT
 * Pure ES6+ JavaScript - Vanilla HTML5/CSS3 Architecture
 * Vivan Gupta JEE Counseling & Rank Strategy Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Interactive Modules
  initScrollProgress();
  initScrollSpy();
  initThemeSystem();
  initParticleCanvas();
  initHeroParallax();
  initScrollReveal();
  initRankPredictor();
  initCountUpAnimation();
  initAccordion();
  initMobileDrawer();
  initFormHandler();
});

/* ==========================================================================
   1. TOP SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   2. AUTOMATIC ACTIVE SCROLL-SPY NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link[data-section]');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link[data-section]');

  if (!sections.length || !desktopLinks.length) return;

  let ticking = false;

  function updateActiveSection() {
    const scrollPosition = window.scrollY + 180; // Offset for fixed navbar height
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = id;
      }
    });

    // Check if scrolled to bottom of page (highlight last section)
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        currentId = lastSection.getAttribute('id');
      }
    }

    if (currentId) {
      desktopLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
        if (linkSection === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      drawerLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
        if (linkSection === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateActiveSection();
}

/* ==========================================================================
   3. THREE-WAY THEME SYSTEM (DARK / LIGHT / SYSTEM)
   ========================================================================== */
function initThemeSystem() {
  const savedMode = localStorage.getItem('theme-mode') || 'system';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  setTheme(savedMode, false);

  mediaQuery.addEventListener('change', () => {
    const currentStored = localStorage.getItem('theme-mode') || 'system';
    if (currentStored === 'system') {
      applyThemeMode('system');
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-segmented-btn');
    if (btn) {
      e.preventDefault();
      const mode = btn.getAttribute('data-mode');
      if (mode) {
        setTheme(mode, true);
      }
    }
  });
}

function setTheme(mode, save = true) {
  if (save) {
    localStorage.setItem('theme-mode', mode);
  }

  document.querySelectorAll('.theme-segmented-btn').forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  applyThemeMode(mode);
}

function applyThemeMode(mode) {
  const root = document.documentElement;
  const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let effectiveTheme = mode;
  if (mode === 'system') {
    effectiveTheme = isDarkOS ? 'dark' : 'light';
  }

  if (effectiveTheme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
  }

  updateBrandingLogos(effectiveTheme);
}

function updateBrandingLogos(theme) {
  const mainLogos = document.querySelectorAll('.brand-logo-img');
  const nexgenLogos = document.querySelectorAll('.nexgen-logo-img');

  const darkNexgenUrl = 'https://res.cloudinary.com/sahbncq8/image/upload/v1786076819/NexGen_vzsaqb.png';
  const lightNexgenUrl = 'https://res.cloudinary.com/sahbncq8/image/upload/v1786081222/NexG1en_alefcv.png';

  mainLogos.forEach(img => {
    img.src = theme === 'light' ? 'assets/logo-light.svg' : 'assets/logo-dark.svg';
  });

  nexgenLogos.forEach(img => {
    img.src = theme === 'light' ? lightNexgenUrl : darkNexgenUrl;
  });
}

/* ==========================================================================
   4. INTERACTIVE JEE RANK & COLLEGE PREDICTOR
   ========================================================================== */
function initRankPredictor() {
  const percentileSelect = document.getElementById('pred-percentile');
  const categorySelect = document.getElementById('pred-category');
  const branchSelect = document.getElementById('pred-branch');

  const tierBadge = document.getElementById('pred-tier-badge');
  const headline = document.getElementById('pred-headline');
  const confNum = document.getElementById('pred-conf-num');
  const statPath = document.getElementById('pred-stat-path');
  const statElevation = document.getElementById('pred-stat-elevation');
  const statPackage = document.getElementById('pred-stat-package');

  if (!percentileSelect || !categorySelect || !branchSelect) return;

  function updatePrediction() {
    const perc = parseFloat(percentileSelect.value);
    const cat = categorySelect.value;
    const branch = branchSelect.value;

    let tierText = "Tier-1 Premier";
    let headlineText = "";
    let conf = "96%";
    let path = "JoSAA Round 1-6 Float Strategy";
    let elevation = "High (+1.8 Tier Elevation with State Quota)";
    let pkg = "₹22 - ₹38 LPA";

    if (perc >= 99.5) {
      tierText = "Top Tier-1 Elite (IITs / Top NITs)";
      headlineText = branch === 'cs' ? "Target: IIT Bombay, Delhi, Madras (CS/Data) & NIT Trichy CS" : "Target: Top 7 IITs (Core & Circuital Branches)";
      conf = "98%";
      path = "JoSAA Rounds 1-4 Direct Freeze / Slide";
      elevation = "Ultra-High (Top 1000 AIR Bracket)";
      pkg = "₹28 - ₹55+ LPA";
    } else if (perc >= 98.0) {
      tierText = "Tier-1 Standard (Top NITs / IIITs)";
      headlineText = branch === 'cs' ? "Target: NIT Surathkal, Warangal, Rourkela & IIIT Allahabad IT" : "Target: Top 5 NITs (ECE, VLSI & Electrical)";
      conf = "95%";
      path = "JoSAA Rounds 1-6 Float &rarr; CSAB Spot Upgrade";
      elevation = "Very High (Home State Quota Leverage)";
      pkg = "₹18 - ₹34 LPA";
    } else if (perc >= 95.0) {
      tierText = "Tier-1.5 / Premier Tier-2";
      headlineText = branch === 'cs' ? "Target: Mid NITs (Jalandhar, Silchar, Hamirpur CS) & IIIT Pune/Gwalior" : "Target: Top NITs Mechanical/Civil or Premier IIITs ECE";
      conf = "93%";
      path = "JoSAA Float &rarr; CSAB Special Rounds 1 & 2";
      elevation = "High (+20,000 Rank Delta in Spot Rounds)";
      pkg = "₹14 - ₹26 LPA";
    } else if (perc >= 90.0) {
      tierText = "Tier-2 Strategic (NITs / JAC Delhi / State)";
      headlineText = "Target: NIT Core, JAC Delhi (DTU/NSUT State Quota) & Top IIITs";
      conf = "89%";
      path = "JoSAA R6 &rarr; CSAB Special + State Board Parallel";
      elevation = "Moderate (Category Certificate Essential)";
      pkg = "₹10 - ₹18 LPA";
    } else {
      tierText = "CSAB Spot & State Counseling";
      headlineText = "Target: North-East NITs, State Govt Colleges (MHT-CET, COMEDK, IPU)";
      conf = "85%";
      path = "Aggressive CSAB Special Round 2 Seat Stacking";
      elevation = "High (+35,000 Rank Jumps in Special Phase)";
      pkg = "₹8 - ₹16 LPA";
    }

    if (cat === 'sc' || cat === 'st') {
      headlineText += " [Category Rank Boost Active]";
      conf = "98%";
      elevation = "Maximum (Top IIT/NIT Seats Unlocked)";
    } else if (cat === 'ews' || cat === 'obc') {
      headlineText += " [Quota Advantage Active]";
    }

    if (tierBadge) tierBadge.textContent = tierText;
    if (headline) headline.textContent = headlineText;
    if (confNum) confNum.textContent = conf;
    if (statPath) statPath.innerHTML = path;
    if (statElevation) statElevation.textContent = elevation;
    if (statPackage) statPackage.textContent = pkg;
  }

  percentileSelect.addEventListener('change', updatePrediction);
  categorySelect.addEventListener('change', updatePrediction);
  branchSelect.addEventListener('change', updatePrediction);
}

/* ==========================================================================
   5. STAT COUNTER ANIMATION
   ========================================================================= */
function initCountUpAnimation() {
  const countElements = document.querySelectorAll('.count-target');
  if (!countElements.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        countElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1500;

          const timer = setInterval(() => {
            start += Math.ceil(target / 40);
            if (start >= target) {
              el.textContent = el.getAttribute('data-count') === '99' ? '99.2%' : `${target.toLocaleString()}+`;
              clearInterval(timer);
            } else {
              el.textContent = el.getAttribute('data-count') === '99' ? `${start}%` : `${start.toLocaleString()}+`;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.3 });

  countElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. AMBIENT FLOATING PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 35), 28);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.size = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.35 + 0.12;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isLight = document.documentElement.classList.contains('light');
      const color = isLight ? '180, 83, 9' : '245, 158, 11';
      ctx.fillStyle = `rgba(${color}, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });
}

/* ==========================================================================
   7. HARDWARE-ACCELERATED HERO SCROLL PARALLAX
   ========================================================================== */
function initHeroParallax() {
  const parallaxBg = document.querySelector('.hero-parallax-bg');
  if (!parallaxBg) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 1.2) {
          const translateY = scrollY * 0.25;
          parallaxBg.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   8. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   10. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('nav-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!menuBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }, { passive: true });
}

/* ==========================================================================
   11. LEAD CAPTURE FORM HANDLER
   ========================================================================== */
function initFormHandler() {
  const form = document.getElementById('counseling-lead-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Submitting Details...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Request Submitted Successfully!</span>`;
      submitBtn.style.background = '#10B981';
      submitBtn.style.color = '#FFFFFF';

      alert('Priority Counseling Slot Requested!\nOur chief strategist team will contact you via WhatsApp shortly to review your rank profile.');

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 4000);
    }, 1000);
  });
}
