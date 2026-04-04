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
  const hero    = document.getElementById('heroSection');
  if (!hero) return;

  const heroBot  = document.getElementById('heroBot');
  const heroMac  = document.getElementById('heroMac');
  const botLight = document.getElementById('botLight');
  const eyeL     = document.getElementById('botEyeL');
  const eyeR     = document.getElementById('botEyeR');
  const botLasers = document.getElementById('botLasers');
  const root     = document.documentElement;

  let heroH  = hero.offsetHeight;
  let rafPending = false;
  let curCx  = 0; // aktuální cursor x offset (−1..1)

  /* updateCones — CSS rotate na celém .bot-lasers SVG
     -25°: kužele míří vlevo-nahoru (na horní část Mac displeje)
     -5°:  kužele míří vlevo-dolů  (na klávesnici Macu) — při plném scrollu
     cursor posunuje ±12°                                                      */
  function updateCones(cx, scrollP) {
    if (!botLasers) return;
    const angle = -25 + scrollP * 20 + cx * 12;
    botLasers.style.transform = `rotate(${angle.toFixed(1)}deg)`;
  }

  /* Scroll parallax — robot a mac se pohybují různou rychlostí (hloubka) */
  function applyScrollPhase() {
    const sy = window.scrollY;
    const p  = Math.min(Math.max(sy / heroH, 0), 1);

    // Parallax: robot rychleji (blíž), mac pomaleji (dál)
    root.style.setProperty('--bot-parallax', `${-(sy * 0.13).toFixed(1)}px`);
    root.style.setProperty('--mac-parallax', `${-(sy * 0.06).toFixed(1)}px`);

    // Kužele se při scrollu naklánějí více dolů
    updateCones(curCx, p);

    // Fade-out při hlubokém scrollu
    if (heroBot) heroBot.style.opacity = p > 0.72 ? String(Math.max(0, 1 - (p - 0.72) / 0.28).toFixed(3)) : '';
    if (heroMac) heroMac.style.opacity = p > 0.60 ? String(Math.max(0, 1 - (p - 0.60) / 0.40).toFixed(3)) : '';
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
    updateCones(0, 0); // inicializace — kužele na klávesnici Macu
  }

  /* Sdílená logika pro pohyb očí + light + kuželů za kurzorem/dotykem */
  function applyPointer(cx, cy) {
    curCx = cx;
    // Robot — jemná 3D rotace
    root.style.setProperty('--head-ry', `${(cx * 8).toFixed(2)}deg`);
    root.style.setProperty('--head-rx', `${(cy * -5).toFixed(2)}deg`);

    // Oči se posunou za kurzorem (malý rozsah ±3.5%)
    const ex = (cx * 3.5).toFixed(2);
    const ey = (cy * 2.5).toFixed(2);
    if (eyeL) eyeL.style.transform = `translate(calc(-50% + ${ex}%), calc(-50% + ${ey}%))`;
    if (eyeR) eyeR.style.transform = `translate(calc(-50% + ${ex}%), calc(-50% + ${ey}%))`;

    // Kužele lehce sledují cursor
    const p = Math.min(Math.max(window.scrollY / heroH, 0), 1);
    updateCones(cx * 0.45, p);

    // Světelný odlesk na robotovi
    if (botLight) {
      botLight.style.background = `radial-gradient(350px circle at ${(50 + cx * 30).toFixed(1)}% ${(50 + cy * 20).toFixed(1)}%, rgba(1,211,174,0.08) 0%, transparent 65%)`;
    }
  }

  function resetPointer() {
    curCx = 0;
    root.style.setProperty('--head-ry', '0deg');
    root.style.setProperty('--head-rx', '0deg');
    if (eyeL) eyeL.style.transform = '';
    if (eyeR) eyeR.style.transform = '';
    const p = Math.min(Math.max(window.scrollY / heroH, 0), 1);
    updateCones(0, p);
    if (botLight) botLight.style.background = '';
  }

  if (!rm) {
    let heroVisible = false;
    const visObs = new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; });
    visObs.observe(hero);

    /* Mouse — desktop */
    hero.addEventListener('mousemove', (e) => {
      if (!heroVisible) return;
      const rect = hero.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const cy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      applyPointer(cx, cy);
    });
    hero.addEventListener('mouseleave', resetPointer);

    /* Touch — mobilní a dotykové notebooky */
    hero.addEventListener('touchmove', (e) => {
      if (!heroVisible) return;
      const t = e.touches[0];
      const rect = hero.getBoundingClientRect();
      const cx = ((t.clientX - rect.left) / rect.width  - 0.5) * 2;
      const cy = ((t.clientY - rect.top)  / rect.height - 0.5) * 2;
      applyPointer(cx, cy);
    }, { passive: true });
    hero.addEventListener('touchend', resetPointer, { passive: true });
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
