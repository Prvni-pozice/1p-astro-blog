/**
 * scroll-effects.js — shared scroll & reveal module
 * Vanilla JS ES module, no dependencies, ~2 KB
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. requestAnimationFrame scroll tracker ── */
function initScrollTracker() {
  if (reducedMotion) return;
  let lastY = -1;
  function tick() {
    const y = window.scrollY;
    if (y !== lastY) {
      document.documentElement.style.setProperty('--scroll-y', String(y));
      lastY = y;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── 2. IntersectionObserver for [data-reveal] / [data-reveal-stagger] ── */
function initRevealObserver() {
  if (reducedMotion) {
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');

        // Staggered children: apply individual delays via inline style
        if (el.hasAttribute('data-reveal-stagger')) {
          Array.from(el.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
          });
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
    observer.observe(el);
  });
}

/* ── Cleanup (for Astro view transitions if needed) ── */
export function cleanup() {
  document.documentElement.style.removeProperty('--scroll-y');
}

/* ── Init ── */
initScrollTracker();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRevealObserver);
} else {
  initRevealObserver();
}
