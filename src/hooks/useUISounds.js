import { useCallback, useEffect, useState } from "react";

// Opt-in interface sounds: a soft tick on hover over interactive elements and
// a short two-note blip on click. Off by default; the choice persists.
const KEY = "cx-sounds";
const INTERACTIVE = "a[href], button:not([disabled]), [role='button']";

let ctx = null;
const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

const tone = (freq, { type = "sine", gain = 0.035, duration = 0.05, at = 0 } = {}) => {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
};

export const playHover = () => tone(1800, { gain: 0.018, duration: 0.03 });
export const playClick = () => {
  tone(880, { type: "triangle", gain: 0.04, duration: 0.06 });
  tone(1320, { type: "triangle", gain: 0.03, duration: 0.07, at: 0.05 });
};

const readPref = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Global sound toggle. While enabled, hover ticks and click blips are
 * attached by delegation to every link/button on the page.
 */
export const useUISounds = () => {
  const [enabled, setEnabled] = useState(readPref);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {
        /* preference just won't persist */
      }
      if (next) playClick();
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let lastHover = 0;
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (!el || el.contains(e.relatedTarget)) return;
      const now = performance.now();
      if (now - lastHover < 60) return; // don't machine-gun on dense lists
      lastHover = now;
      playHover();
    };
    const onClick = (e) => {
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) playClick();
    };
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [enabled]);

  return { enabled, toggle };
};
