import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { FRAMEWORKS, LANGUAGES, PROFICIENCY, TOOLS } from "../../constants";
import { useIntroReady } from "../../context/intro";
import { Parallax } from "../ui/Parallax";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";
import { cx } from "../../utils/cx";

const TileGrid = ({ label, items, delay = 0 }) => (
  <>
    <RevealOnScroll delay={delay} className="cx-label text-dim">
      {label}
    </RevealOnScroll>
    <RevealOnScroll as="ul" delay={delay + 0.05} className="m-0 mt-5 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <li key={item.name} className="cx-lift px-2 pb-4 pt-5">
          <img src={item.icon} alt="" width="28" height="28" loading="lazy" decoding="async" />
          <div className="cx-lift-label mt-3 font-mono text-[9.5px]">{item.name}</div>
        </li>
      ))}
    </RevealOnScroll>
  </>
);

const FILL_DURATION = 1.5;
const FILL_STAGGER = 0.14;
// ease-out-cubic: still settles softly but the sweep stays visible for most
// of the duration (ease-out-expo finishes ~90% of the travel in 300ms)
const FILL_EASE = [0.33, 1, 0.68, 1];

/**
 * One proficiency bar. `active` is owned by the card so all bars start
 * together (staggered) once the whole card is on screen, instead of each
 * one firing as it crosses the fold. The score counts up in step with the fill.
 */
const Meter = ({ name, level, index, active }) => {
  const reduced = useReducedMotion();
  const pct = `${level * 10}%`;
  const delay = index * FILL_STAGGER;
  const [shown, setShown] = useState(reduced ? level : 0);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    if (reduced || !active) return;
    setFilling(true);
    const controls = animate(0, level, {
      duration: FILL_DURATION,
      ease: FILL_EASE,
      delay,
      onUpdate: (v) => setShown(Math.round(v)),
      onComplete: () => setFilling(false),
    });
    return () => controls.stop();
  }, [active, delay, level, reduced]);

  return (
    <li className="group/meter">
      <div className="flex justify-between font-mono text-[11px] tracking-[0.12em] text-slate-300">
        <span className="transition-colors duration-400 group-hover/meter:text-white">{name}</span>
        <span className="tabular-nums text-accent-mid transition-colors duration-400 group-hover/meter:text-accent-soft">{shown}</span>
      </div>
      <div className="mt-[9px] h-[3px] overflow-hidden rounded-[3px] bg-slate-400/14">
        <motion.div
          initial={false}
          animate={{ width: reduced || active ? pct : "0%" }}
          transition={{ duration: FILL_DURATION, ease: FILL_EASE, delay }}
          className="relative h-full rounded-[3px] bg-[linear-gradient(90deg,#2563eb,#38bdf8)] transition-[filter] duration-400 group-hover/meter:brightness-125"
        >
          {/* bright leading edge while filling, and on hover */}
          <span
            className={cx(
              "absolute right-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-soft shadow-[0_0_10px_#7dd3fc] transition-opacity duration-500 group-hover/meter:opacity-100",
              filling ? "opacity-100" : "opacity-0"
            )}
          />
        </motion.div>
      </div>
    </li>
  );
};

/** The proficiency card: arms its meters once ~60% of it is in view. */
const ProficiencyCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const ready = useIntroReady();
  const active = ready && inView;

  return (
    <RevealOnScroll delay={0.12}>
      <div
        ref={ref}
        className="rounded-[20px] border border-slate-400/13 bg-panel/86 px-[30px] pb-[34px] pt-[30px] transition-[border-color,box-shadow] duration-500 hover:border-accent-mid/30 hover:shadow-[0_30px_80px_-50px_rgba(37,99,235,0.7)]"
      >
        <div className="cx-label text-dim">TECHNICAL PROFICIENCY</div>
        <ul className="m-0 mt-[26px] grid list-none gap-[22px] p-0">
          {PROFICIENCY.map((p, i) => (
            <Meter key={p.name} {...p} index={i} active={active} />
          ))}
        </ul>
      </div>
    </RevealOnScroll>
  );
};

export const Stack = () => (
  <section id="stack" aria-labelledby="stack-heading" className="cx-container pb-[110px] pt-5">
    <RevealOnScroll className="cx-section-head">
      <Parallax as="h2" speed={0.045} id="stack-heading" className="cx-h2">
        Stack
      </Parallax>
      <Scramble text="LANGUAGES / FRAMEWORKS / DEPTH" className="hidden font-mono text-[10px] tracking-[0.24em] text-[#5b677a] sm:inline" />
    </RevealOnScroll>

    <div className="mt-[46px] grid items-start gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
      <div>
        <TileGrid label="LANGUAGES" items={LANGUAGES} />
        <div className="mt-10">
          <TileGrid label="FRAMEWORKS" items={FRAMEWORKS} delay={0.08} />
        </div>
        <RevealOnScroll delay={0.12} className="cx-label mt-10 text-dim">
          TOOLS &amp; SERVICES
        </RevealOnScroll>
        <RevealOnScroll as="ul" delay={0.16} className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
          {TOOLS.map((t) => (
            <li key={t} className="cx-tag px-[14px] py-2 text-[10.5px] tracking-[0.08em]">
              {t}
            </li>
          ))}
        </RevealOnScroll>
      </div>

      <ProficiencyCard />
    </div>
  </section>
);
