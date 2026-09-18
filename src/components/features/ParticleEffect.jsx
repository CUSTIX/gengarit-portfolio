import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const LINK_DIST = 152;
const MOUSE_PUSH = 190;
const MOUSE_GLOW = 230;

/**
 * Fixed full-viewport canvas: drifting nodes joined by filaments. Nodes are
 * nudged away from the cursor and links near it brighten to the accent
 * color. Pauses while the tab is hidden; renders a single static frame when
 * the user prefers reduced motion.
 *
 * @param {object} props
 * @param {number} [props.density] multiplier on node count (design default 1)
 */
export const ParticleEffect = ({ density = 1 }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(120, Math.max(34, (w * h) / 19000)) * density);
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.1 + 0.5,
      }));
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
        const dmx = n.x - mouse.x;
        const dmy = n.y - mouse.y;
        const dm = Math.hypot(dmx, dmy);
        if (dm < MOUSE_PUSH) {
          const f = (1 - dm / MOUSE_PUSH) * 0.42;
          n.x -= (dmx / (dm || 1)) * f;
          n.y -= (dmy / (dm || 1)) * f;
        }
      }
    };

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const d = Math.sqrt(d2);
          const md = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y);
          const near = md < MOUSE_GLOW ? 1 - md / MOUSE_GLOW : 0;
          const alpha = (1 - d / LINK_DIST) * (0.1 + near * 0.5);
          ctx.strokeStyle =
            near > 0.25 ? `rgba(96,165,250,${alpha.toFixed(3)})` : `rgba(148,163,184,${(alpha * 0.75).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = md < MOUSE_GLOW ? 1 - md / MOUSE_GLOW : 0;
        ctx.fillStyle = `rgba(${near > 0.3 ? "125,211,252" : "148,163,184"},${(0.22 + near * 0.6).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + near * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      step();
      paint();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    paint();
    start();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-75"
    />
  );
};
