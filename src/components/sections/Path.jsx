import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ABOUT_DATA, BRAND, TIMELINE } from "../../constants";
import { Parallax } from "../ui/Parallax";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";
import { cx } from "../../utils/cx";

const DOT = {
  accent: "bg-accent shadow-[0_0_0_4px_rgba(56,189,248,0.14)] group-hover/step:shadow-[0_0_0_6px_rgba(56,189,248,0.22),0_0_18px_rgba(56,189,248,0.7)]",
  deep: "bg-accent-deep shadow-[0_0_0_4px_rgba(37,99,235,0.14)] group-hover/step:shadow-[0_0_0_6px_rgba(37,99,235,0.22),0_0_18px_rgba(37,99,235,0.8)]",
  muted: "bg-slate-400/40 group-hover/step:bg-accent-mid group-hover/step:shadow-[0_0_0_6px_rgba(96,165,250,0.18)]",
};

const KIND = { accent: "ri-briefcase-4-line", deep: "ri-code-s-slash-line", muted: "ri-graduation-cap-line" };

const Step = ({ item, index, last }) => (
  <RevealOnScroll delay={index * 0.08} className={cx("group/step relative", !last && "pb-7")}>
    <span
      aria-hidden="true"
      className={cx(
        "absolute -left-10 top-[30px] z-10 h-[11px] w-[11px] rounded-full transition-[box-shadow,background-color,transform] duration-500 ease-out-expo group-hover/step:scale-110",
        DOT[item.tone]
      )}
    />
    {/* card lights up on hover; content lifts slightly */}
    <div className="relative -ml-2 rounded-2xl border border-transparent px-6 py-6 transition-[border-color,background-color,box-shadow,transform] duration-500 ease-out-expo group-hover/step:-translate-y-0.5 group-hover/step:border-slate-400/14 group-hover/step:bg-panel/70 group-hover/step:shadow-[0_24px_60px_-40px_rgba(37,99,235,0.7)]">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-400/14 bg-panel/80 text-accent-mid transition-[border-color,color,transform] duration-500 ease-out-expo group-hover/step:scale-110 group-hover/step:border-accent-mid/40 group-hover/step:text-accent-soft">
          <i className={`${KIND[item.tone]} text-[15px]`} aria-hidden="true" />
        </span>
        <div
          className={cx(
            "font-mono text-[10px] tracking-[0.2em] transition-colors duration-400",
            item.tone === "muted" ? "text-dim group-hover/step:text-accent-mid" : "text-accent-mid group-hover/step:text-accent-soft"
          )}
        >
          {item.period} // {item.org}
        </div>
      </div>
      <h3 className="m-0 mt-3 text-[20px] font-bold tracking-[-0.02em] text-fg-bright transition-transform duration-500 ease-out-expo group-hover/step:translate-x-1 sm:text-[23px]">
        {item.role}
      </h3>
      {item.description && <p className="m-0 mt-3 max-w-[62ch] text-[15px] leading-[1.74] text-[#8e99ad] text-pretty">{item.description}</p>}
      {item.awards && (
        <ul className="m-0 mt-4 grid list-none gap-[9px] p-0">
          {item.awards.map((award) => (
            <li key={award} className="group/award flex items-center gap-[11px] text-sm text-[#a9b4c6]">
              <i className="ri-award-line text-accent-mid transition-transform duration-500 ease-out-expo group-hover/award:-rotate-12 group-hover/award:scale-125" aria-hidden="true" />
              {award}
            </li>
          ))}
        </ul>
      )}
    </div>
  </RevealOnScroll>
);

const STATUS_ROWS = [
  { icon: "ri-map-pin-2-line", label: "LOCATION", value: `${BRAND.location.split(",")[0]} · GMT+8` },
  { icon: "ri-briefcase-line", label: "OPEN TO", value: "Projects · Audits · Collaboration" },
  { icon: "ri-time-line", label: "RESPONSE", value: "Usually within 24 hours" },
];

export const Path = () => {
  const reduced = useReducedMotion();
  const listRef = useRef(null);
  // the timeline's line draws itself as the list scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 55%"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const scaleY = useTransform(drawn, (v) => (reduced ? 1 : v));

  return (
    <section id="path" aria-labelledby="path-heading" className="cx-container pb-[110px] pt-5">
      <RevealOnScroll className="cx-section-head">
        <Parallax as="h2" speed={0.045} id="path-heading" className="cx-h2">
          Deployments
        </Parallax>
        <Scramble text="2022 — 2026" className="font-mono text-[10px] tracking-[0.24em] text-[#5b677a]" />
      </RevealOnScroll>

      <div className="mt-[46px] grid items-start gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <ol ref={listRef} className="relative m-0 list-none p-0 pl-[34px]">
          <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-slate-400/14" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute bottom-0 left-0 top-0 w-px origin-top bg-[linear-gradient(180deg,#38bdf8,#2563eb_70%,transparent)] shadow-[0_0_12px_rgba(56,189,248,0.6)]"
          />
          {TIMELINE.map((item, i) => (
            <li key={item.role}>
              <Step item={item} index={i} last={i === TIMELINE.length - 1} />
            </li>
          ))}
        </ol>

        <RevealOnScroll delay={0.15}>
          <Parallax
            speed={-0.055}
            className="group/status relative overflow-hidden rounded-[20px] border border-accent/16 p-[30px] transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_30px_80px_-50px_rgba(37,99,235,0.8)]"
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(37,99,235,0.12), rgba(11,15,24,0.7))" }} />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-60 transition-[opacity,transform] duration-700 group-hover/status:scale-125 group-hover/status:opacity-100"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.22), transparent 66%)" }}
            />
            <div className="relative">
              <div className="flex items-center gap-[10px] font-mono text-[10px] tracking-[0.22em] text-accent-soft">
                <span className="h-[6px] w-[6px] animate-cx-pulse rounded-full bg-accent shadow-[0_0_9px_#38bdf8]" />
                CURRENT STATUS
              </div>
              <p className="m-0 mt-5 text-[15px] leading-[1.74] text-slate-300 text-pretty">{ABOUT_DATA.status}</p>

              <ul className="m-0 mt-6 grid list-none gap-2 p-0">
                {STATUS_ROWS.map((row) => (
                  <li
                    key={row.label}
                    className="group/row flex items-center gap-3 rounded-xl border border-slate-400/10 bg-ink/40 px-3 py-[10px] transition-[border-color,background-color,transform] duration-400 ease-out-expo hover:-translate-y-0.5 hover:border-accent-mid/35 hover:bg-ink/70"
                  >
                    <i className={`${row.icon} text-[15px] text-accent-mid transition-transform duration-400 ease-out-expo group-hover/row:scale-110`} aria-hidden="true" />
                    <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.2em] text-dim">{row.label}</span>
                    <span className="ml-auto text-right text-[12.5px] text-slate-200">{row.value}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="group/cta mt-5 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-accent-soft transition-colors duration-300 hover:text-white"
              >
                START A CONVERSATION
                <i className="ri-arrow-right-line transition-transform duration-400 ease-out-expo group-hover/cta:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </Parallax>
        </RevealOnScroll>
      </div>
    </section>
  );
};
