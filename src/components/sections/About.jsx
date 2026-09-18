import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ABOUT_DATA, BRAND } from "../../constants";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";

/**
 * Portrait card: a cursor-tracked radial glow, a glare band that sweeps
 * with the pointer, and the photo drifting slightly against it.
 */
const Portrait = () => {
  const card = useRef(null);
  const img = useRef(null);
  const glow = useRef(null);
  const glare = useRef(null);
  const reduced = useReducedMotion();

  const onMove = (e) => {
    if (reduced || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.current.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
    card.current.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
    if (glow.current) glow.current.style.opacity = "1";
    if (glare.current) {
      glare.current.style.opacity = "1";
      glare.current.style.transform = `translateX(${((px - 0.5) * 60).toFixed(1)}%)`;
    }
    if (img.current) {
      img.current.style.transform = `scale(1.045) translate3d(${((px - 0.5) * -14).toFixed(1)}px, ${((py - 0.5) * -10).toFixed(1)}px, 0)`;
    }
  };

  const onLeave = () => {
    if (glow.current) glow.current.style.opacity = "0";
    if (glare.current) glare.current.style.opacity = "0";
    if (img.current) img.current.style.transform = "scale(1) translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={card}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-full min-h-[320px] overflow-hidden rounded-[22px] border border-slate-400/14 bg-panel transition-[border-color,box-shadow] duration-500 hover:border-accent-mid/35 hover:shadow-[0_40px_90px_-50px_rgba(37,99,235,0.8)] md:min-h-[420px] lg:min-h-[340px]"
      style={{ "--px": "50%", "--py": "50%" }}
    >
      <img
        ref={img}
        src="/pictures/me.webp"
        alt={`Portrait of ${BRAND.fullName}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-[250ms] ease-out will-change-transform"
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,15,24,0) 55%, rgba(7,10,17,0.92) 100%)" }} />
      <div
        ref={glow}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{ background: "radial-gradient(circle at var(--px) var(--py), rgba(56,189,248,0.28), transparent 60%)" }}
      />
      <div
        ref={glare}
        className="pointer-events-none absolute -bottom-[20%] -top-[20%] left-[-40%] w-[60%] opacity-0 transition-opacity duration-300"
        style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent)" }}
      />
      <div className="pointer-events-none absolute inset-x-6 bottom-[22px] flex items-center gap-[10px] font-mono text-[10px] tracking-[0.2em] text-slate-300">
        <span className="h-[5px] w-[5px] rounded-full bg-accent shadow-[0_0_8px_#38bdf8]" />
        <span>{ABOUT_DATA.portraitStatus}</span>
        <span className="ml-auto hidden text-[#7d8798] sm:inline">{ABOUT_DATA.portraitCaption}</span>
      </div>
    </div>
  );
};

export const About = () => (
  <section id="about" aria-labelledby="about-heading" className="cx-container pb-[110px] pt-10">
    <div className="grid items-stretch gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-[60px]">
      <RevealOnScroll className="order-2 h-full lg:order-1">
        <Portrait />
      </RevealOnScroll>

      <div className="order-1 lg:order-2">
        <RevealOnScroll>
          <Scramble text={ABOUT_DATA.eyebrow} className="cx-label block text-[10px] tracking-[0.26em] text-accent" />
        </RevealOnScroll>
        <RevealOnScroll as="h2" id="about-heading" delay={0.05} className="cx-h2 mt-[18px]">
          {ABOUT_DATA.title}
        </RevealOnScroll>
        <RevealOnScroll as="p" delay={0.1} className="m-0 mt-[26px] text-[16.5px] leading-[1.78] text-muted text-pretty">
          {ABOUT_DATA.bio}
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          delay={0.15}
          className="m-0 mt-[22px] border-l-2 border-accent/50 pl-[22px] text-[16.5px] leading-[1.78] text-slate-300 text-pretty transition-colors duration-500 hover:border-accent"
        >
          {ABOUT_DATA.philosophy}
        </RevealOnScroll>

        <RevealOnScroll
          as="ul"
          delay={0.2}
          className="m-0 mt-11 grid list-none gap-px overflow-hidden rounded-2xl border border-slate-400/10 bg-slate-400/10 p-0 sm:grid-cols-2"
        >
          {ABOUT_DATA.capabilities.map((cap) => (
            <li key={cap.label} className="cx-lift-cell">
              <div className="cx-lift-inner">
                <i className={cap.icon} aria-hidden="true" />
                <div className="cx-lift-label mt-3 font-mono text-[9.5px] tracking-[0.16em]">{cap.label}</div>
                <div className="mt-[6px] text-sm text-[#dbe3ef]">{cap.value}</div>
              </div>
            </li>
          ))}
        </RevealOnScroll>
      </div>
    </div>
  </section>
);
