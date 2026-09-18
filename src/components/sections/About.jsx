import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ABOUT_DATA, BRAND } from "../../constants";
import { RevealOnScroll } from "../ui/RevealOnScroll";

export const About = () => {
  const portraitRef = useRef(null);
  const reduced = useReducedMotion();
  // Gentle parallax: the portrait drifts ~24px against the scroll direction.
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [26, -26]);

  return (
    <section id="about" aria-labelledby="about-heading" className="cx-container pb-[110px] pt-5">
      <div className="grid items-start gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-[60px]">
        <RevealOnScroll>
          <motion.div ref={portraitRef} style={{ y }} className="group relative">
            <div
              className="relative overflow-hidden rounded-[22px] border border-slate-400/14 transition-[border-color,box-shadow] duration-700 group-hover:border-accent-mid/40 group-hover:shadow-[0_40px_90px_-50px_rgba(37,99,235,0.8)]"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 78%, rgba(37,99,235,0.20), rgba(11,15,24,0.85) 62%, rgba(5,7,12,0.95))",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "radial-gradient(ellipse 70% 55% at 50% 78%, rgba(56,189,248,0.22), transparent 62%)" }}
              />
              <img
                src="/pictures/me.webp"
                alt={`Portrait of ${BRAND.fullName}`}
                loading="lazy"
                className="relative block h-[420px] w-full object-contain object-bottom px-[26px] pt-[34px] transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03] sm:h-[500px]"
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.72), transparent 34%)" }} />
              <div className="absolute inset-x-6 bottom-[22px] flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#9fb0c8]">
                <span>{ABOUT_DATA.portraitCaption}</span>
                <span className="flex items-center gap-2 text-accent-soft">
                  <span className="h-[5px] w-[5px] animate-cx-pulse rounded-full bg-accent shadow-[0_0_8px_#38bdf8]" />
                  ONLINE
                </span>
              </div>
            </div>
          </motion.div>
        </RevealOnScroll>

        <div>
          <RevealOnScroll className="cx-label text-accent">{ABOUT_DATA.eyebrow}</RevealOnScroll>
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
              <li
                key={cap.label}
                className="group/cap relative bg-panel/70 px-6 py-[22px] transition-colors duration-500 hover:bg-panel/95"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/cap:opacity-100"
                  style={{ background: "radial-gradient(220px circle at 0% 0%, rgba(37,99,235,0.18), transparent 70%)" }}
                />
                <i
                  className={`${cap.icon} relative inline-block text-accent-mid transition-[transform,color,filter] duration-500 ease-out-expo group-hover/cap:-translate-y-0.5 group-hover/cap:scale-110 group-hover/cap:text-accent-soft group-hover/cap:drop-shadow-[0_0_8px_rgba(125,211,252,0.7)]`}
                  aria-hidden="true"
                />
                <div className="relative mt-3 font-mono text-[9.5px] tracking-[0.16em] text-dim transition-colors duration-400 group-hover/cap:text-accent-mid">
                  {cap.label}
                </div>
                <div className="relative mt-[6px] text-sm text-[#dbe3ef]">{cap.value}</div>
              </li>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
