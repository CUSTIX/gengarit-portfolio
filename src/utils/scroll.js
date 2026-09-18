// Desktop sticky nav height; sections are scrolled to just below it.
export const NAV_HEIGHT = 76;
const MOBILE_BREAKPOINT = 900;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeTween = 0;

/**
 * Eased scroll of the window to an absolute Y. A rAF tween rather than
 * `scrollTo({ behavior: "smooth" })` so every anchor (nav, rail, palette,
 * footer) lands with the same 500ms ease-out and the same nav offset.
 */
export const scrollWindowTo = (to, { duration = 500 } = {}) => {
  cancelAnimationFrame(activeTween);
  const from = window.scrollY;
  const target = Math.max(0, to);
  if (reducedMotion() || document.hidden || Math.abs(target - from) < 2) {
    window.scrollTo(0, target);
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    window.scrollTo(0, from + (target - from) * eased);
    if (p < 1) activeTween = requestAnimationFrame(step);
  };
  activeTween = requestAnimationFrame(step);
};

/** Scroll a section into view below the nav (no nav offset on mobile). */
export const scrollToSection = (id) => {
  const target = document.getElementById(id);
  if (!target) return;
  const navH = window.innerWidth <= MOBILE_BREAKPOINT ? 0 : NAV_HEIGHT;
  const delta = target.getBoundingClientRect().top - navH - 12;
  scrollWindowTo(window.scrollY + delta);
};

export const scrollToTop = () => scrollWindowTo(0);
