import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ABOUT_DATA, TIMELINE } from "../../constants";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { cx } from "../../utils/cx";

const DOT = {
  accent: "bg-accent shadow-[0_0_0_4px_rgba(56,189,248,0.14)] group-hover/step:shadow-[0_0_0_6px_rgba(56,189,248,0.22),0_0_18px_rgba(56,189,248,0.7)]",
  deep: "bg-accent-deep shadow-[0_0_0_4px_rgba(37,99,235,0.14)] group-hover/step:shadow-[0_0_0_6px_rgba(37,99,235,0.22),0_0_18px_rgba(37,99,235,0.8)]",
  muted: "bg-slate-400/40 group-hover/step:bg-accent-mid group-hover/step:shadow-[0_0_0_6px_rgba(96,165,250,0.18)]",
};

const Step = ({ item, index, last }) => (
  <RevealOnScroll delay={index * 0.08} className={cx("group/step relative", !last && "pb-[46px]")}>
    <span
      aria-hidden="true"
      className={cx(
        "absolute -left-10 top-1 h-[11px] w-[11px] rounded-full transition-[box-shadow,background-color,transform] duration-500 ease-out-expo group-hover/step:scale-110",
        DOT[item.tone]
      )}
    />
    <div
      className={cx(
        "font-mono text-[10px] tracking-[0.2em] transition-colors duration-400",
        item.tone === "muted" ? "text-dim group-hover/step:text-accent-mid" : "text-accent-mid group-hover/step:text-accent-soft"
      )}
    >
      {item.period} // {item.org}
    </div>
    <h3 className="m-0 mt-3 text-[20px] font-bold tracking-[-0.02em] text-fg-bright transition-transform duration-500 ease-out-expo group-hover/step:translate-x-1 sm:text-[23px]">
      {item.role}
    </h3>
    {item.description && (
      <p className="m-0 mt-3 max-w-[62ch] text-[15px] leading-[1.74] text-[#8e99ad] text-pretty">{item.description}</p>
    )}
    {item.awards && (
      <ul className="m-0 mt-4 grid list-none gap-[9px] p-0">
        {item.awards.map((award) => (
          <li key={award} className="group/award flex items-center gap-[11px] text-sm text-[#a9b4c6]">
            <i
              className="ri-award-line text-accent-mid transition-transform duration-500 ease-out-expo group-hover/award:-rotate-12 group-hover/award:scale-125"
              aria-hidden="true"
            />
            {award}
          </li>
        ))}
      </ul>
    )}
  </RevealOnScroll>
);

export const Path = () => {
  const cardRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-18, 18]);

  return (
    <section id="path" aria-labelledby="path-heading" className="cx-container pb-[110px] pt-5">
      <RevealOnScroll className="cx-section-head">
        <h2 id="path-heading" className="cx-h2">
          Deployments
        </h2>
        <span className="font-mono text-[10px] tracking-[0.24em] text-[#5b677a]">2022 — 2026</span>
      </RevealOnScroll>

      <div className="mt-[46px] grid items-start gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <ol className="relative m-0 list-none border-l border-slate-400/16 p-0 pl-[34px]">
          {TIMELINE.map((item, i) => (
            <li key={item.role}>
              <Step item={item} index={i} last={i === TIMELINE.length - 1} />
            </li>
          ))}
        </ol>

        <RevealOnScroll delay={0.15}>
          <motion.div
            ref={cardRef}
            style={{ y }}
            className="group/status relative overflow-hidden rounded-[20px] border border-accent/16 p-[30px] transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_30px_80px_-50px_rgba(37,99,235,0.8)]"
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(160deg, rgba(37,99,235,0.12), rgba(11,15,24,0.7))" }}
            />
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
            </div>
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
