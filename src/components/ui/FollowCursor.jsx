import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary";

/**
 * Two layers that follow the pointer: a large soft glow that lags behind
 * (lerped in rAF) and a small sharp dot that tracks exactly. The dot swells
 * into a ring over interactive elements. Disabled on touch devices.
 */
export const FollowCursor = () => {
  const glowRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let gx = tx;
    let gy = ty;
    let raf = 0;
    let visible = false;

    const loop = () => {
      gx += (tx - gx) * 0.07;
      gy += (ty - gy) * 0.07;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        glow.style.opacity = "1";
      }
    };

    const onOver = (e) => {
      const hit = e.target instanceof Element && e.target.closest(INTERACTIVE);
      dot.dataset.hover = hit ? "true" : "false";
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1] -ml-[310px] -mt-[310px] h-[620px] w-[620px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.10), transparent 68%)" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        data-hover="false"
        className="pointer-events-none fixed left-0 top-0 z-[90] -ml-[3.5px] -mt-[3.5px] h-[7px] w-[7px] rounded-full bg-accent opacity-0 shadow-[0_0_14px_2px_rgba(56,189,248,0.75)] transition-colors duration-300 will-change-transform before:absolute before:-inset-[9px] before:rounded-full before:border before:border-accent/60 before:opacity-0 before:transition-[opacity,transform] before:duration-300 before:ease-out-expo before:scale-50 data-[hover=true]:bg-white data-[hover=true]:before:scale-100 data-[hover=true]:before:opacity-100"
      />
    </>
  );
};
