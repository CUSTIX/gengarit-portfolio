import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FRAMEWORKS, LANGUAGES, PROFICIENCY } from "../../constants";
import { useIntroReady } from "../../context/intro";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { EASE_OUT_EXPO } from "../../utils/motion";

const TileGrid = ({ label, items, delay = 0 }) => (
  <>
    <RevealOnScroll delay={delay} className="cx-label text-dim">
      {label}
    </RevealOnScroll>
    <RevealOnScroll as="ul" delay={delay + 0.05} className="m-0 mt-5 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <li key={item.name} className="cx-tile group/tile" style={{ "--brand": item.brand }}>
          <i className={item.icon} aria-hidden="true" />
          <div className="relative mt-3 font-mono text-[9.5px] text-[#7d8798] transition-colors duration-400 group-hover/tile:text-fg">
            {item.name}
          </div>
        </li>
      ))}
    </RevealOnScroll>
  </>
);

const Meter = ({ name, level, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const ready = useIntroReady();
  const reduced = useReducedMotion();
  const pct = `${level * 10}%`;

  return (
    <li ref={ref} className="group/meter">
      <div className="flex justify-between font-mono text-[11px] tracking-[0.12em] text-slate-300">
        <span className="transition-colors duration-400 group-hover/meter:text-white">{name}</span>
        <span className="text-accent-mid transition-colors duration-400 group-hover/meter:text-accent-soft">{level}</span>
      </div>
      <div className="mt-[9px] h-[3px] overflow-hidden rounded-[3px] bg-slate-400/14">
        <motion.div
          initial={{ width: reduced ? pct : 0 }}
          animate={{ width: ready && inView ? pct : reduced ? pct : 0 }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: index * 0.08 }}
          className="relative h-full rounded-[3px] bg-[linear-gradient(90deg,#2563eb,#38bdf8)] transition-[filter] duration-400 group-hover/meter:brightness-125"
        >
          <span className="absolute right-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-soft opacity-0 shadow-[0_0_10px_#7dd3fc] transition-opacity duration-400 group-hover/meter:opacity-100" />
        </motion.div>
      </div>
    </li>
  );
};

export const Stack = () => (
  <section id="stack" aria-labelledby="stack-heading" className="cx-container pb-[110px] pt-5">
    <RevealOnScroll className="cx-section-head">
      <h2 id="stack-heading" className="cx-h2">
        Stack
      </h2>
      <span className="hidden font-mono text-[10px] tracking-[0.24em] text-[#5b677a] sm:inline">LANGUAGES / FRAMEWORKS / DEPTH</span>
    </RevealOnScroll>

    <div className="mt-[46px] grid items-start gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
      <div>
        <TileGrid label="LANGUAGES" items={LANGUAGES} />
        <div className="mt-10">
          <TileGrid label="FRAMEWORKS" items={FRAMEWORKS} delay={0.08} />
        </div>
      </div>

      <RevealOnScroll
        delay={0.12}
        className="cx-panel rounded-[20px] px-[30px] pb-[34px] pt-[30px] transition-[border-color,box-shadow] duration-500 hover:border-accent-mid/30 hover:shadow-[0_30px_80px_-50px_rgba(37,99,235,0.7)]"
      >
        <div className="cx-label text-dim">TECHNICAL PROFICIENCY</div>
        <ul className="m-0 mt-[26px] grid list-none gap-[22px] p-0">
          {PROFICIENCY.map((p, i) => (
            <Meter key={p.name} {...p} index={i} />
          ))}
        </ul>
      </RevealOnScroll>
    </div>
  </section>
);
