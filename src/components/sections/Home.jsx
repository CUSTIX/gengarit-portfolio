import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { BRAND, HERO_STATS } from "../../constants";
import { useIntroReady } from "../../context/intro";
import { useOpenPalette } from "../../context/palette";
import { LogoMark } from "../ui/Logo";
import { Magnetic } from "../ui/Magnetic";
import { Parallax } from "../ui/Parallax";
import { RevealOnScroll } from "../ui/RevealOnScroll";

// three.js is ~600KB; keep it out of the main bundle.
const HeroMark = lazy(() => import("../features/HeroMark"));

const H1_STYLE = { fontSize: "clamp(52px, 8.4vw, 132px)", lineHeight: 0.86, letterSpacing: "-0.05em" };

/** Animated number that counts up from 0 once it scrolls into view. */
const CountUp = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const ready = useIntroReady();
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !inView || !ready) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, ready, reduced, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
};

/** Static fallback for the 3D mark (reduced motion / no WebGL). */
const StaticMark = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <LogoMark size={260} className="animate-cx-drift drop-shadow-[0_0_40px_rgba(56,189,248,0.35)]" />
  </div>
);

export const Home = () => {
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  const openPalette = useOpenPalette();
  const [webgl, setWebgl] = useState(true);
  // Skip the 3D bundle on data-saver connections and very weak devices.
  const [lite] = useState(() => {
    const conn = navigator.connection;
    return Boolean(conn?.saveData) || (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2);
  });
  const showMark = webgl && !reduced && !lite;
  // Decided once at mount: wipe in right after the intro, or almost at once
  // when the intro was skipped. Must not re-run when `ready` flips later.
  const [fillClass] = useState(() => (reduced ? "" : ready ? "cx-fill-reveal-now" : "cx-fill-reveal"));

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="cx-container relative grid items-center gap-10 pb-[76px] pt-[68px] md:min-h-[84vh] md:pb-[120px] md:pt-[108px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
    >
      <div>
        <RevealOnScroll className="inline-flex items-center gap-[10px] rounded-full border border-slate-400/16 bg-white/[0.03] px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-slate-400">
          <span className="h-[6px] w-[6px] animate-cx-pulse rounded-full bg-accent shadow-[0_0_10px_#38bdf8]" />
          {BRAND.location.toUpperCase()}
        </RevealOnScroll>

        {/* Wordmark: an outlined ghost with the solid letters wiping in over it */}
        <Parallax speed={0.05} className="relative mt-7 inline-block">
          <span aria-hidden="true" className="block font-sans font-extrabold text-transparent" style={{ ...H1_STYLE, WebkitTextStroke: "1.5px rgba(125,211,252,0.5)" }}>
            {BRAND.name}
          </span>
          <h1
            className={`absolute inset-0 m-0 font-sans font-extrabold text-fg-bright ${fillClass}`}
            style={H1_STYLE}
          >
            CUST
            <span className="bg-[linear-gradient(120deg,#7dd3fc,#2f80f5_55%,#1d3fd0)] bg-clip-text text-transparent">IX</span>
          </h1>
        </Parallax>

        <RevealOnScroll delay={0.12} className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-[19px] font-semibold tracking-[-0.01em] text-[#dbe3ef]">{BRAND.fullName}</span>
          <span className="hidden h-[5px] w-[5px] rounded-full bg-slate-400/40 sm:block" />
          <span className="font-mono text-[12px] tracking-[0.2em] text-accent-mid">{BRAND.role.toUpperCase()}</span>
        </RevealOnScroll>

        <RevealOnScroll as="p" delay={0.18} className="m-0 mt-[26px] max-w-[50ch] text-[17px] leading-[1.72] text-muted text-pretty">
          {BRAND.tagline}
        </RevealOnScroll>

        <RevealOnScroll delay={0.24} className="mt-10 flex flex-wrap gap-[14px]">
          <Magnetic href="#work" className="cx-btn-primary">
            View engineered works <i className="ri-arrow-right-up-line" aria-hidden="true" />
          </Magnetic>
          <Magnetic href={BRAND.github} target="_blank" rel="noreferrer" className="cx-btn-ghost">
            <i className="ri-github-fill text-base" aria-hidden="true" /> GitHub
          </Magnetic>
          <button type="button" onClick={openPalette} aria-label="Open command palette" className="cx-btn-kbd">
            <i className="ri-search-line" aria-hidden="true" />
            ⌘K
          </button>
        </RevealOnScroll>

        <RevealOnScroll as="dl" delay={0.3} className="mt-[58px] flex flex-wrap gap-x-11 gap-y-6">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="group/stat flex flex-col">
              <dt className="order-2 mt-[6px] font-mono text-[10px] tracking-[0.18em] text-dim transition-colors duration-400 group-hover/stat:text-accent-mid">
                {stat.label}
              </dt>
              <dd className="m-0 font-sans text-[27px] font-bold text-fg-bright">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </RevealOnScroll>
      </div>

      <Parallax speed={0.05} className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
        {showMark ? (
          <Suspense fallback={<StaticMark />}>
            <HeroMark onFail={() => setWebgl(false)} />
          </Suspense>
        ) : (
          <StaticMark />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.14), transparent 62%)" }}
        />
      </Parallax>

      {/* Scroll cue */}
      <div className="absolute bottom-[34px] left-5 hidden items-center gap-[14px] sm:left-[26px] md:left-10 md:flex" aria-hidden="true">
        <div className="relative h-11 w-px overflow-hidden bg-slate-400/20">
          <div className="absolute left-0 top-0 h-[18px] w-px animate-cx-scroll-dot bg-accent" />
        </div>
        <span className="font-mono text-[9px] tracking-[0.28em] text-faint">SCROLL</span>
      </div>
    </section>
  );
};
