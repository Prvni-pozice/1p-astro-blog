/**
 * motion.js — Globální motion systém
 * Vanilla JS, žádné závislosti
 * Replaces scroll-effects.js
 */

const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. Scroll tracker: --scroll-y ── */
function initScrollTracker() {
  if (rm) return;
  let last = -1;
  function tick() {
    const y = window.scrollY;
    if (y !== last) {
      document.documentElement.style.setProperty('--scroll-y', String(y));
      last = y;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── 2. Reveal Observer: [data-reveal], [data-reveal-group], .reveal ── */
function initRevealObserver() {
  if (rm) {
    document.querySelectorAll('[data-reveal],[data-reveal-group],.reveal').forEach(el => {
      el.classList.add('is-visible', 'revealed');
    });
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible', 'revealed');
      if (el.hasAttribute('data-reveal-group')) {
        Array.from(el.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
        });
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal],[data-reveal-group],.reveal').forEach(el => obs.observe(el));
}

/* ── 3. Crowd Observer: [data-crowd-trigger] ── */
function initCrowdObserver() {
  const crowd = document.querySelector('[data-crowd-trigger]');
  if (!crowd) return;
  if (rm) { crowd.classList.add('is-active'); return; }
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { crowd.classList.add('is-active'); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(crowd);
}

/* ── 4. Hero Controller ── */
function initHeroController() {
  const hero = document.getElementById('heroSection');
  if (!hero) return;

  const macbookLayer = document.getElementById('macbookLayer');
  const robotBody    = document.getElementById('robotBody');
  const robotArms    = document.getElementById('robotArms');
  const robotHead    = document.getElementById('robotHead');
  const laserLeft    = document.getElementById('laserLeft');
  const laserRight   = document.getElementById('laserRight');
  const lightOverlay = document.getElementById('lightOverlay');
  const laserSvg     = document.getElementById('laserSvg');
  const heroScene    = document.getElementById('heroScene');

  let heroH = hero.offsetHeight;
  let rafPending = false;

  /* Scroll phases */
  function applyScrollPhase() {
    const p = Math.min(Math.max(window.scrollY / heroH, 0), 1);

    if (macbookLayer) {
      // Phase 1 (0–0.2): rotateY -20°, scale 1
      // Phase 2 (0.2–0.5): tilt toward 0°, scale to 0.85
      // Phase 3 (0.5–0.8): nearly flat
      const rot   = p < 0.2 ? -20
                  : p < 0.5 ? -20 + (p - 0.2) / 0.3 * 18
                  : -2 + (p - 0.5) / 0.3 * 2;
      const scale = p < 0.2 ? 1 : p < 0.5 ? 1 - (p - 0.2) / 0.3 * 0.15 : 0.85;
      macbookLayer.style.transform = `perspective(1200px) rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    }

    // Robot reveal: starts at p=0.2, full at p=0.5
    const rOpacity = p < 0.2 ? 0.08 : p < 0.5 ? 0.08 + (p - 0.2) / 0.3 * 0.92 : 1;
    const rX       = p < 0.2 ? 28   : p < 0.5 ? 28 - (p - 0.2) / 0.3 * 28 : 0;
    if (robotBody) { robotBody.style.opacity = rOpacity.toFixed(3); robotBody.style.transform = `translateX(${rX.toFixed(1)}px)`; }
    if (robotArms) { robotArms.style.opacity = rOpacity.toFixed(3); robotArms.style.transform = `translateX(${rX.toFixed(1)}px)`; }
    if (robotHead) { robotHead.style.opacity = rOpacity.toFixed(3); robotHead.style.transform = `translateX(${rX.toFixed(1)}px)`; }

    // Phase 4 (p > 0.8): scene exits upward
    if (heroScene) {
      const exitY = p > 0.8 ? ((p - 0.8) / 0.2) * -80 : 0;
      heroScene.style.transform = `translateY(calc(-50% + ${exitY.toFixed(1)}px))`;
    }

    // Laser drift at 30%+ scroll
    if (laserLeft && laserRight) {
      if (p > 0.3) {
        laserLeft.setAttribute('x2', '230');  laserLeft.setAttribute('y2', '295');
        laserRight.setAttribute('x2', '230'); laserRight.setAttribute('y2', '295');
      } else {
        laserLeft.setAttribute('x2', '310');  laserLeft.setAttribute('y2', '255');
        laserRight.setAttribute('x2', '310'); laserRight.setAttribute('y2', '255');
      }
    }
  }

  if (!rm) {
    window.addEventListener('scroll', () => {
      if (!rafPending) {
        requestAnimationFrame(() => { applyScrollPhase(); rafPending = false; });
        rafPending = true;
      }
    }, { passive: true });
    window.addEventListener('resize', () => { heroH = hero.offsetHeight; }, { passive: true });
    applyScrollPhase();
  }

  /* Mouse tracking — aktivní jen na desktop */
  if (!rm && window.matchMedia('(min-width: 768px)').matches) {
    let heroVisible = false;
    const visObs = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
    });
    visObs.observe(hero);

    hero.addEventListener('mousemove', (e) => {
      if (!heroVisible) return;
      const rect = hero.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const cy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // Kaskádový pohyb: hlava → tělo → ramena
      if (robotHead) {
        robotHead.style.transform = `rotateY(${(cx * 8).toFixed(2)}deg) rotateX(${(cy * -4).toFixed(2)}deg)`;
        robotHead.style.transition = 'transform 150ms ease-out';
      }
      if (robotBody) {
        robotBody.style.transform = `rotateY(${(cx * 2).toFixed(2)}deg) translateX(${(cx * 3).toFixed(1)}px)`;
        robotBody.style.transition = 'transform 350ms ease-out';
      }
      if (robotArms) {
        robotArms.style.transform = `rotateY(${(cx * -1).toFixed(2)}deg)`;
        robotArms.style.transition = 'transform 300ms ease-out';
      }

      // Dynamické osvětlení
      if (lightOverlay) {
        lightOverlay.style.background = `radial-gradient(600px circle at ${(50 + cx * 30).toFixed(1)}% ${(50 + cy * 20).toFixed(1)}%, rgba(255,255,255,0.08) 0%, transparent 70%)`;
      }

      // Laser tracking
      if (laserSvg && laserLeft && laserRight) {
        const svgRect = laserSvg.getBoundingClientRect();
        const tx = Math.max(150, Math.min(440, ((e.clientX - svgRect.left) / svgRect.width) * 460));
        const ty = Math.max(50, Math.min(560, ((e.clientY - svgRect.top) / svgRect.height) * 600));
        laserLeft.setAttribute('x2', tx.toFixed(0));  laserLeft.setAttribute('y2', ty.toFixed(0));
        laserRight.setAttribute('x2', tx.toFixed(0)); laserRight.setAttribute('y2', ty.toFixed(0));
      }
    });

    hero.addEventListener('mouseleave', () => {
      if (robotHead) { robotHead.style.transform = ''; robotHead.style.transition = ''; }
      if (robotBody) { robotBody.style.transform = ''; robotBody.style.transition = ''; }
      if (robotArms) { robotArms.style.transform = ''; robotArms.style.transition = ''; }
      if (lightOverlay) lightOverlay.style.background = '';
      if (laserLeft)  { laserLeft.setAttribute('x2', '310');  laserLeft.setAttribute('y2', '255'); }
      if (laserRight) { laserRight.setAttribute('x2', '310'); laserRight.setAttribute('y2', '255'); }
    });
  }
}

/* ── 5. Reading Progress (pouze na stránkách s .prose) ── */
function initReadingProgress() {
  const bar   = document.getElementById('readingProgress');
  const prose = document.querySelector('.prose');
  if (!bar || !prose) return;

  function update() {
    const rect  = prose.getBoundingClientRect();
    const total = prose.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const p = Math.min(Math.max(-rect.top / total, 0), 1);
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Cleanup (pro Astro View Transitions) ── */
export function cleanup() {
  document.documentElement.style.removeProperty('--scroll-y');
}

/* ── Init ── */
initScrollTracker();

function boot() {
  initRevealObserver();
  initCrowdObserver();
  initHeroController();
  initReadingProgress();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
