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
    if (entries[0].isIntersecting) {
      crowd.classList.add('is-active');
    } else {
      crowd.classList.remove('is-active');
    }
  }, { threshold: 0.9 });
  obs.observe(crowd);
}

/* ── 4. Hero Controller ── */
function initHeroController() {
  const hero = document.getElementById('heroSection');
  if (!hero) return;

  const laserLeft    = document.getElementById('laserLeft');
  const laserRight   = document.getElementById('laserRight');
  const lightOverlay = document.getElementById('lightOverlay');
  const laserSvg     = document.getElementById('laserSvg');
  const root         = document.documentElement;

  let heroH = hero.offsetHeight;
  let rafPending = false;

  /* Scroll phases — CSS vars pro perspektivu + exit */
  function applyScrollPhase() {
    const p = Math.min(Math.max(window.scrollY / heroH, 0), 1);

    // Perspektiva se mění průběžně: jemný 3D pohyb scény
    const rotY  = -5 + p * 8;         // -5° → +3°
    const rotX  =  1 - p * 3;         // +1° → -2°
    const exitY = p > 0.82 ? ((p - 0.82) / 0.18) * -90 : 0;

    root.style.setProperty('--hero-rot-y',  `${rotY.toFixed(2)}deg`);
    root.style.setProperty('--hero-rot-x',  `${rotX.toFixed(2)}deg`);
    root.style.setProperty('--hero-exit-y', `${exitY.toFixed(1)}px`);

    // Laser drift při 35%+ scrollu — mírně k vieweru
    if (laserLeft && laserRight) {
      if (p > 0.35) {
        laserLeft.setAttribute('x2', '350');  laserLeft.setAttribute('y2', '350');
        laserRight.setAttribute('x2', '350'); laserRight.setAttribute('y2', '350');
      } else {
        laserLeft.setAttribute('x2', '185');  laserLeft.setAttribute('y2', '127');
        laserRight.setAttribute('x2', '185'); laserRight.setAttribute('y2', '127');
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

  /* Mouse tracking — desktop only */
  if (!rm && window.matchMedia('(min-width: 1000px)').matches) {
    let heroVisible = false;
    const visObs = new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; });
    visObs.observe(hero);

    hero.addEventListener('mousemove', (e) => {
      if (!heroVisible) return;
      const rect = hero.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // -1..1
      const cy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      // Scéna — jemná micro-rotace podle myši (přidá se ke scroll rotaci)
      root.style.setProperty('--hero-mouse-ry', `${(cx * 3).toFixed(2)}deg`);
      root.style.setProperty('--hero-mouse-rx', `${(cy * -1.5).toFixed(2)}deg`);

      // Hlava robota — výraznější tracking
      root.style.setProperty('--head-ry', `${(cx * 10).toFixed(2)}deg`);
      root.style.setProperty('--head-rx', `${(cy * -6).toFixed(2)}deg`);

      // Dynamický světelný odlesk
      if (lightOverlay) {
        lightOverlay.style.background = `radial-gradient(500px circle at ${(50 + cx * 28).toFixed(1)}% ${(50 + cy * 18).toFixed(1)}%, rgba(1,211,174,0.07) 0%, transparent 70%)`;
      }

      // Laser tracking — míří k pozici kurzoru v SVG souřadnicích
      if (laserSvg && laserLeft && laserRight) {
        const svgRect = laserSvg.getBoundingClientRect();
        const tx = Math.max(50,  Math.min(650, ((e.clientX - svgRect.left) / svgRect.width)  * 700));
        const ty = Math.max(50,  Math.min(380, ((e.clientY - svgRect.top)  / svgRect.height) * 400));
        laserLeft.setAttribute('x2',  tx.toFixed(0)); laserLeft.setAttribute('y2',  ty.toFixed(0));
        laserRight.setAttribute('x2', tx.toFixed(0)); laserRight.setAttribute('y2', ty.toFixed(0));
      }
    });

    hero.addEventListener('mouseleave', () => {
      root.style.setProperty('--hero-mouse-ry', '0deg');
      root.style.setProperty('--hero-mouse-rx', '0deg');
      root.style.setProperty('--head-ry', '0deg');
      root.style.setProperty('--head-rx', '0deg');
      if (lightOverlay) lightOverlay.style.background = '';
      if (laserLeft)  { laserLeft.setAttribute('x2', '185');  laserLeft.setAttribute('y2', '127'); }
      if (laserRight) { laserRight.setAttribute('x2', '185'); laserRight.setAttribute('y2', '127'); }
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
