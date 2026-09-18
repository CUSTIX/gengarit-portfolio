import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const LINK = 150;
const NEAR = 165;
const NEAR_R2 = NEAR * NEAR;

/**
 * Fixed full-viewport canvas: a twinkling starfield (bright stars sparkle
 * with a cross), rare shooting stars, and a constellation of drifting
 * nodes whose links brighten near the cursor while the nodes ease away
 * from it. Pauses while the tab is hidden; renders one static frame for
 * reduced-motion users. Resize-safe: the backing buffer is (re)computed
 * whenever the canvas gets a real layout size.
 *
 * @param {object} props
 * @param {number} [props.density] multiplier on star/node counts
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
    let stars = [];
    let nodes = [];
    let shooters = [];
    let shooterTimer = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.round(Math.min(220, Math.max(70, (w * h) / 9000)) * density);
      stars = Array.from({ length: starCount }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + depth * 1.5,
          depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.4,
          hue: Math.random() < 0.16,
        };
      });

      const nodeCount = Math.round(Math.min(90, Math.max(28, (w * h) / 22000)) * density);
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        rvx: 0,
        rvy: 0,
        near: false,
        r: Math.random() * 0.8 + 0.6,
      }));
      shooters = [];
    };

    const spawnShooter = () => {
      shooters.push({
        x: Math.random() * w * 0.7 + w * 0.15,
        y: Math.random() * h * 0.35,
        vx: -(3.5 + Math.random() * 2.5),
        vy: 2.2 + Math.random() * 1.4,
        life: 0,
        maxLife: 34 + Math.random() * 14,
      });
    };

    const snap = (v) => Math.round(v * 2) / 2;

    const paintStars = (t) => {
      for (const s of stars) {
        const twinkle = t === null ? 0.7 : 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const alpha = (0.25 + twinkle * 0.6) * (0.4 + s.depth * 0.6);
        ctx.fillStyle = s.hue ? `rgba(125,211,252,${alpha.toFixed(3)})` : `rgba(226,232,240,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (t !== null && s.depth > 0.82 && twinkle > 0.9) {
          ctx.strokeStyle = `rgba(191,230,255,${(alpha * 0.5).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 2.4, s.y);
          ctx.lineTo(s.x + s.r * 2.4, s.y);
          ctx.moveTo(s.x, s.y - s.r * 2.4);
          ctx.lineTo(s.x, s.y + s.r * 2.4);
          ctx.stroke();
        }
      }
    };

    const stepNodes = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
        const dmx = n.x - mouse.x;
        const dmy = n.y - mouse.y;
        const dm2 = dmx * dmx + dmy * dmy;
        n.near = dm2 < NEAR_R2;
        if (n.near && dm2 > 1) {
          const dm = Math.sqrt(dm2);
          const f = (1 - dm / NEAR) * 0.05;
          n.rvx -= (dmx / dm) * f;
          n.rvy -= (dmy / dm) * f;
        }
        n.rvx *= 0.9;
        n.rvy *= 0.9;
        n.x += n.rvx;
        n.y += n.rvy;
      }
    };

    const paintNodes = () => {
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const d = Math.sqrt(d2);
          const near = a.near || b.near;
          const alpha = (1 - d / LINK) * (near ? 0.4 : 0.14);
          ctx.strokeStyle = `${near ? "rgba(96,165,250," : "rgba(148,163,184,"}${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(snap(a.x), snap(a.y));
          ctx.lineTo(snap(b.x), snap(b.y));
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.near ? "rgba(125,211,252,0.85)" : "rgba(148,163,184,0.4)";
        ctx.beginPath();
        ctx.arc(snap(n.x), snap(n.y), n.near ? n.r + 0.6 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const paintShooters = () => {
      shooterTimer--;
      if (shooterTimer <= 0 && shooters.length < 2) {
        spawnShooter();
        shooterTimer = 260 + Math.random() * 340;
      }
      shooters = shooters.filter((sh) => {
        sh.life++;
        sh.x += sh.vx;
        sh.y += sh.vy;
        const p = sh.life / sh.maxLife;
        const fade = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        grad.addColorStop(0, `rgba(224,242,255,${(0.85 * fade).toFixed(3)})`);
        grad.addColorStop(1, "rgba(56,189,248,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();
        return sh.life < sh.maxLife;
      });
    };

    const frame = () => {
      if (cv.clientWidth > 0 && cv.width === 0) resize();
      ctx.clearRect(0, 0, w, h);
      paintStars(performance.now() / 1000);
      stepNodes();
      paintNodes();
      paintShooters();
      raf = requestAnimationFrame(frame);
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      paintStars(null);
      paintNodes();
    };

    const start = () => {
      if (!raf && !reduced && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const safeResize = () => {
      resize();
      if (reduced) renderStatic();
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

    safeResize();
    // Guard against a 0×0 first paint: re-measure once layout settles.
    const settle = setTimeout(safeResize, 300);
    const ro = new ResizeObserver(safeResize);
    ro.observe(cv);
    start();

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      clearTimeout(settle);
      ro.disconnect();
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
