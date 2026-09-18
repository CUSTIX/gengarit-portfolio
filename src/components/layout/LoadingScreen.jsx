import { useEffect } from "react";
import { BRAND } from "../../constants";

// Total run time of the CSS-driven intro (mark assembles, word spreads,
// overlay scales out). Keep in sync with .cx-intro / .cx-page-in timings.
export const INTRO_DURATION_MS = 2700;

const EDGE = "1.5px solid #7dd3fc";
const BRACKETS = [
  { bx: "calc(-50% - 175px)", by: "calc(-50% - 130px)", borderTop: EDGE, borderLeft: EDGE },
  { bx: "calc(-50% + 175px)", by: "calc(-50% - 130px)", borderTop: EDGE, borderRight: EDGE },
  { bx: "calc(-50% - 175px)", by: "calc(-50% + 130px)", borderBottom: EDGE, borderLeft: EDGE },
  { bx: "calc(-50% + 175px)", by: "calc(-50% + 130px)", borderBottom: EDGE, borderRight: EDGE },
];

const C_PATH = "M 88.9 43.1 A 38 38 0 1 0 88.9 96.9";
const X1 = "M 96 33 L 172 107";
const X2 = "M 172 33 L 96 107";

/**
 * Brand intro: grid and rings fade up, a scan line sweeps, the "C" and "X"
 * fly in from opposite sides through a chromatic glitch, a flash and
 * shockwave land them, then the wordmark spreads and the overlay dissolves.
 * Scrolling is locked while it plays.
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
      className="cx-intro fixed inset-0 z-[200] flex flex-col items-center justify-center gap-[46px] overflow-hidden bg-ink"
      role="presentation"
    >
      {/* faded grid */}
      <div
        className="cx-intro-grid absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 55% 55% at 50% 50%, #000 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 55% at 50% 50%, #000 0%, transparent 72%)",
        }}
      />
      {/* orbit rings */}
      <div className="cx-intro-ring-a absolute h-[640px] w-[640px] rounded-full border border-accent/16" />
      <div className="cx-intro-ring-b absolute h-[460px] w-[460px] rounded-full border border-dashed border-accent-mid/14" />
      {/* flash + shockwave */}
      <div
        className="cx-intro-flash absolute h-[520px] w-[520px] rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.22), transparent 66%)" }}
      />
      <div className="cx-intro-shock absolute h-[90px] w-[90px] rounded-full border-[1.5px] border-accent-soft/70 opacity-0" />
      {/* scan sweep */}
      <div
        className="cx-intro-scan absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(180deg, transparent, rgba(56,189,248,0.4) 50%, transparent)" }}
      />
      {/* corner brackets */}
      {BRACKETS.map(({ bx, by, ...borders }, i) => (
        <span
          key={i}
          className="cx-intro-bracket absolute left-1/2 top-1/2 h-[26px] w-[26px] opacity-0"
          style={{ "--bx": bx, "--by": by, ...borders }}
        />
      ))}

      {/* the mark, with chromatic ghost copies that flicker during assembly */}
      <div className="relative flex items-center justify-center">
        <svg width="300" height="210" viewBox="0 0 200 140" fill="none" className="cx-intro-glitch-c absolute overflow-visible mix-blend-screen" aria-hidden="true">
          <path d={C_PATH} stroke="#ef4444" strokeWidth="25" opacity="0.55" />
        </svg>
        <svg width="300" height="210" viewBox="0 0 200 140" fill="none" className="cx-intro-glitch-m absolute overflow-visible mix-blend-screen" aria-hidden="true">
          <path d={X1} stroke="#22d3ee" strokeWidth="23" opacity="0.55" />
          <path d={X2} stroke="#22d3ee" strokeWidth="23" opacity="0.55" />
        </svg>
        <svg width="300" height="210" viewBox="0 0 200 140" fill="none" className="relative overflow-visible" aria-hidden="true">
          <path className="cx-intro-c" d={C_PATH} stroke="url(#cxw)" strokeWidth="25" />
          <g className="cx-intro-x">
            <path d={X1} stroke="url(#cxg)" strokeWidth="23" />
            <path d={X2} stroke="url(#cxg)" strokeWidth="23" />
          </g>
          <g className="cx-intro-spark opacity-0" style={{ transformOrigin: "134px 70px" }}>
            <circle cx="134" cy="70" r="3" fill="#bae6fd" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div
          className="cx-intro-line h-px w-[210px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.85), transparent)" }}
        />
        <div className="cx-intro-word pl-[0.42em] font-sans text-[22px] font-bold tracking-[0.42em] text-fg" style={{ textShadow: "0 0 24px rgba(56,189,248,0.5)" }}>
          {BRAND.name}
        </div>
        <div className="cx-intro-name font-mono text-[10px] tracking-[0.34em] text-[#59657a]">
          {BRAND.fullName.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
