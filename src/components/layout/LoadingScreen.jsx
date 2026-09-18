import { useEffect } from "react";
import { BRAND } from "../../constants";

// Total run time of the CSS-driven intro (mark assembles, word spreads,
// overlay scales out). Keep in sync with .cx-intro / .cx-page-in timings.
export const INTRO_DURATION_MS = 2700;

/**
 * Brand intro: the "C" and "X" fly in from opposite sides, a flash, a
 * hairline, then the wordmark expands and the overlay dissolves. Scrolling
 * is locked while it plays.
 */
export const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(onComplete, INTRO_DURATION_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [onComplete]);

  return (
    <div
      className="cx-intro fixed inset-0 z-[200] flex flex-col items-center justify-center gap-[46px] bg-ink"
      role="presentation"
    >
      <div
        className="cx-intro-flash absolute h-[520px] w-[520px] rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.22), transparent 66%)" }}
      />

      <div className="relative flex items-center justify-center">
        <svg width="300" height="210" viewBox="0 0 200 140" fill="none" className="overflow-visible" aria-hidden="true">
          <path className="cx-intro-c" d="M 88.9 43.1 A 38 38 0 1 0 88.9 96.9" stroke="url(#cxw)" strokeWidth="25" />
          <g className="cx-intro-x">
            <path d="M 96 33 L 172 107" stroke="url(#cxg)" strokeWidth="23" />
            <path d="M 172 33 L 96 107" stroke="url(#cxg)" strokeWidth="23" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div
          className="cx-intro-line h-px w-[210px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.85), transparent)" }}
        />
        <div className="cx-intro-word pl-[0.42em] font-sans text-[22px] font-bold tracking-[0.42em] text-fg">
          {BRAND.name}
        </div>
        <div className="cx-intro-name font-mono text-[10px] tracking-[0.34em] text-[#59657a]">
          {BRAND.fullName.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
