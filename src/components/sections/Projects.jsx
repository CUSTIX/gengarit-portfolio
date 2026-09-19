import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FEATURED_PROJECT, PROJECTS } from "../../constants";
import { Parallax } from "../ui/Parallax";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";
import { cx } from "../../utils/cx";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { scrollWindowTo } from "../../utils/scroll";
import { Icon } from "../ui/Icon";

const pad3 = (n) => String(n).padStart(3, "0");
const AUTO_ADVANCE_MS = 3200;

const FeatureList = ({ items, className }) => (
  <ul className={cx("m-0 grid list-none gap-[11px] p-0", className)}>
    {items.map((f) => (
      <li key={f} className="cx-feature">
        <Icon name="ri-focus-2-line" />
        {f}
      </li>
    ))}
  </ul>
);

const TagList = ({ tags, className }) => (
  <ul className={cx("m-0 flex list-none flex-wrap gap-2 p-0", className)}>
    {tags.map((t) => (
      <li key={t} className="cx-tag">
        {t}
      </li>
    ))}
  </ul>
);

const ImpactBox = ({ text, labelled = true }) => (
  <div
    className={cx(
      "text-[#c3cddd] text-pretty transition-[background-color,border-color] duration-400",
      labelled
        ? "rounded-xl border-l-2 border-accent bg-accent-deep/8 px-5 py-[18px] text-[13.5px] leading-[1.66] hover:border-accent-soft hover:bg-accent-deep/14"
        : "rounded-[14px] border border-accent/16 bg-accent-deep/8 px-[22px] py-5 text-sm leading-[1.65] hover:border-accent/40 hover:bg-accent-deep/14"
    )}
  >
    {labelled && <div className="cx-label text-[9px] text-accent-soft">IMPACT</div>}
    <p className={cx("m-0", labelled && "mt-[10px]")}>{text}</p>
  </div>
);

const SwapButton = ({ dir, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={cx(
      "absolute top-1/2 z-[6] flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-slate-400/22 bg-ink/65 text-slate-300 backdrop-blur-sm transition-[background-color,border-color,transform] duration-300 hover:border-accent-mid/50 hover:bg-accent-deep/35 active:scale-95",
      dir < 0 ? "left-[14px]" : "right-[14px]"
    )}
  >
    <Icon name={dir < 0 ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line"} className="text-xl" />
  </button>
);

/** Cross-fading screenshot gallery with dots, prev/next, and auto-advance. */
const CardSwap = ({ images, logo, title }) => {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const [nonce, setNonce] = useState(0); // bump to restart the auto timer
  const hoverRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (!hoverRef.current) setIdx((i) => (i + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [images.length, reduced, nonce]);

  const go = (next) => {
    setIdx((next + images.length) % images.length);
    setNonce((n) => n + 1);
  };

  return (
    <div
      className="relative order-first min-h-[220px] overflow-hidden bg-[#05070a] sm:min-h-[360px] lg:order-none lg:min-h-[480px]"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      onFocus={() => (hoverRef.current = true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) hoverRef.current = false;
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
    >
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading={i === 0 ? "eager" : "lazy"}
          aria-hidden={i !== idx}
          className={cx(
            "absolute inset-0 h-full w-full object-contain transition-opacity duration-[550ms] ease-out",
            i === idx ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      <div className="group/logo absolute left-5 top-5 z-[5] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-400/20 bg-[#05070a] p-[7px] transition-[border-color,box-shadow,transform] duration-400 ease-out-expo hover:scale-105 hover:border-accent-mid/50 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]">
        <img src={logo} alt={`${title} logo`} className="h-full w-full object-contain transition-transform duration-[6s] ease-linear group-hover/logo:rotate-[360deg]" />
      </div>

      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(11,15,24,0.5) 0%, rgba(11,15,24,0.06) 40%, transparent 100%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.68), transparent 46%)" }} />

      <div className="absolute bottom-[9px] right-[11px] z-[5] flex" role="tablist" aria-label="Choose screenshot">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Screenshot ${i + 1} of ${images.length}`}
            onClick={() => go(i)}
            className="group/dot flex h-6 items-center px-[3px]"
          >
            <span
              className={cx(
                "block h-[6px] rounded-full transition-[background-color,width] duration-300",
                i === idx ? "w-4 bg-accent" : "w-[6px] bg-white/30 group-hover/dot:bg-white/60"
              )}
            />
          </button>
        ))}
      </div>

      <SwapButton dir={-1} label="Previous screen" onClick={() => go(idx - 1)} />
      <SwapButton dir={1} label="Next screen" onClick={() => go(idx + 1)} />
    </div>
  );
};

const CASE_LABELS = [
  ["problem", "PROBLEM", "ri-focus-2-line"],
  ["approach", "APPROACH", "ri-code-s-slash-line"],
  ["outcome", "OUTCOME", "ri-flashlight-line"],
];

/** Problem → Approach → Outcome, tucked behind a "Read the case study" toggle. */
const CaseStudy = ({ study, url, title }) => {
  const [open, setOpen] = useState(false);
  if (!study && !url) return null;
  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      {study && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="case-study"
          className="cx-btn-ghost px-5 py-3 text-[12px]"
        >
          <Icon name="ri-book-open-line" className="text-[15px]" />
          {open ? "Hide case study" : "Read the case study"}
          <Icon name="ri-arrow-down-s-line" className={cx("text-[15px] transition-transform duration-500 ease-out-expo", open && "rotate-180")} />
        </button>
      )}
      {url && (
        <a href={url} target="_blank" rel="noreferrer" className="cx-btn-primary px-5 py-3 text-[12px]">
          Visit {title} <Icon name="ri-arrow-right-up-line" />
        </a>
      )}
      <AnimatePresence initial={false}>
        {open && study && (
          <motion.div
            id="case-study"
            key="case"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.6, ease: EASE_OUT_EXPO }, opacity: { duration: 0.35 } }}
            className="w-full overflow-hidden"
          >
            <ol className="m-0 mt-3 grid list-none gap-3 p-0">
              {CASE_LABELS.map(([key, label, icon], i) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="group/case relative rounded-xl border border-slate-400/12 bg-ink/40 p-4 pl-5 transition-[border-color,background-color] duration-400 hover:border-accent-mid/35 hover:bg-ink/70"
                >
                  <span className="absolute bottom-3 left-0 top-3 w-[2px] rounded-full bg-[linear-gradient(180deg,#38bdf8,#2563eb)] opacity-60 transition-opacity duration-300 group-hover/case:opacity-100" aria-hidden="true" />
                  <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.22em] text-accent-soft">
                    <Icon name={icon} className="text-[13px]" />
                    {label}
                  </div>
                  <p className="m-0 mt-2 text-[13.5px] leading-[1.7] text-slate-300 text-pretty">{study[key]}</p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeaturedProject = ({ project }) => (
  <div className="relative mt-[46px]">
    {/* breathing halo behind the card */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[3px] z-0 animate-cx-glow-halo rounded-[29px] blur-[20px]"
      style={{ background: "linear-gradient(120deg, rgba(37,99,235,0.4), rgba(56,189,248,0.16), rgba(37,99,235,0.4))" }}
    />
    <RevealOnScroll className="relative z-[1] overflow-hidden rounded-[26px] border border-slate-400/14 bg-panel/60 backdrop-blur-[14px] transition-[border-color,box-shadow] duration-500 hover:border-accent-mid/42 hover:shadow-[0_30px_90px_-40px_rgba(37,99,235,0.6)]">
      <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
        <div className="p-7 sm:p-10 lg:px-12 lg:pb-12 lg:pt-[52px]">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-accent">
            <span className="h-px w-[22px] bg-accent" />
            FEATURED
          </div>
          <h3 className="m-0 mt-6 text-[28px] font-bold leading-[1.12] tracking-[-0.03em] text-fg-bright text-balance sm:text-4xl">{project.title}</h3>
          <div className="mt-3 text-sm text-accent-mid">{project.subtitle}</div>
          <p className="m-0 mt-6 text-[15px] leading-[1.75] text-[#97a2b5] text-pretty">{project.description}</p>
          <FeatureList items={project.features} className="mt-[30px] gap-3 [&>li]:text-[13px]" />
          <div className="mt-[30px]">
            <ImpactBox text={project.impact} labelled={false} />
          </div>
          <TagList tags={project.tags} className="mt-7" />
          <CaseStudy study={project.caseStudy} url={project.url} title={project.title} />
        </div>
        <CardSwap images={project.gallery} logo={project.logo} title={project.title} />
      </div>
    </RevealOnScroll>
  </div>
);

// Entrance choreography for the archive panel: children rise in one after
// another; the screenshot settles from a slight zoom while a scan line sweeps it.
const detailStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const detailItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};
const detailShot = {
  hidden: { opacity: 0, scale: 1.035 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

const Bracket = ({ className }) => (
  <span aria-hidden="true" className={cx("pointer-events-none absolute h-[14px] w-[14px] border-accent-soft/70", className)} />
);

/** Detail body shown in the shared archive panel. */
const ProjectDetail = ({ project }) => (
  <motion.div variants={detailStagger} initial="hidden" animate="visible" className="relative p-5 sm:p-7">
    {/* header strip */}
    <motion.div variants={detailItem} className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9.5px] tracking-[0.2em]">
      <span className="text-accent-soft">[{pad3(project.id)}]</span>
      <span className="text-dim">{project.subtitle.toUpperCase()}</span>
      {project.badge && (
        <span className="ml-auto rounded-full bg-[linear-gradient(120deg,#2563eb,#38bdf8)] px-[10px] py-[5px] text-[9px] tracking-[0.14em] text-white">{project.badge}</span>
      )}
    </motion.div>
    <motion.h3 variants={detailItem} className="m-0 mt-2 text-[21px] font-bold leading-tight tracking-[-0.022em] text-fg-bright text-balance">
      {project.title}
    </motion.h3>

    {/* framed screenshot with corner brackets and a one-time scan sweep */}
    <motion.div variants={detailShot} className="group/shot relative mt-5 aspect-[16/10] overflow-hidden rounded-xl border border-slate-400/14 bg-ink">
      <img
        src={project.image}
        alt={`${project.title} interface`}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out-expo group-hover/shot:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.55), transparent 55%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.7), transparent)" }} />
      <motion.div
        aria-hidden="true"
        initial={{ top: "-30%", opacity: 0 }}
        animate={{ top: "110%", opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 1.1, ease: "easeInOut", delay: 0.35 }}
        className="pointer-events-none absolute inset-x-0 h-[22%]"
        style={{ background: "linear-gradient(180deg, transparent, rgba(56,189,248,0.22) 50%, transparent)" }}
      />
      <Bracket className="left-2 top-2 border-l border-t" />
      <Bracket className="right-2 top-2 border-r border-t" />
      <Bracket className="bottom-2 left-2 border-b border-l" />
      <Bracket className="bottom-2 right-2 border-b border-r" />
      <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[8.5px] tracking-[0.22em] text-slate-300/80">
        {project.tags.length} TECHNOLOGIES · {project.features.length} CORE FEATURES
      </span>
    </motion.div>

    <motion.p variants={detailItem} className="m-0 mt-5 text-[14.5px] leading-[1.74] text-muted text-pretty">
      {project.description}
    </motion.p>
    <motion.ul variants={detailStagger} className="m-0 mt-[22px] grid list-none gap-[11px] p-0">
      {project.features.map((f) => (
        <motion.li key={f} variants={detailItem} className="cx-feature">
          <Icon name="ri-focus-2-line" />
          {f}
        </motion.li>
      ))}
    </motion.ul>
    <motion.div variants={detailItem} className="mt-[22px]">
      <ImpactBox text={project.impact} />
    </motion.div>
    <motion.ul variants={detailStagger} className="m-0 mt-5 flex list-none flex-wrap gap-[7px] p-0">
      {project.tags.map((t) => (
        <motion.li key={t} variants={detailItem} className="cx-tag">
          {t}
        </motion.li>
      ))}
    </motion.ul>

    <motion.div variants={detailItem} className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-400/10 pt-4">
      {project.links?.length ? (
        project.links.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="cx-btn-ghost px-4 py-2 text-[11px]">
            <Icon name={l.icon || "ri-external-link-line"} className="text-[14px]" />
            {l.label}
          </a>
        ))
      ) : (
        <>
          <span className="font-mono text-[9.5px] tracking-[0.18em] text-dim">{project.access || "PRIVATE DEPLOYMENT"}</span>
          <a href="#contact" className="group/req ml-auto inline-flex items-center gap-2 font-mono text-[9.5px] tracking-[0.18em] text-accent-soft transition-colors duration-300 hover:text-white">
            REQUEST A WALKTHROUGH
            <Icon name="ri-arrow-right-line" className="text-[13px] transition-transform duration-400 ease-out-expo group-hover/req:translate-x-1" />
          </a>
        </>
      )}
    </motion.div>
  </motion.div>
);

const ArchiveRow = ({ project, open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    aria-controls="archive-panel"
    className={cx(
      "group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-[border-color,background-color,transform] duration-[450ms] ease-out-expo md:gap-5 md:px-6 md:py-5",
      open
        ? "border-accent-mid/45 bg-accent-deep/10"
        : "border-slate-400/13 bg-panel/82 hover:border-accent-mid/30 hover:bg-panel/95 hover:-translate-y-0.5",
      project.attention && !open && "animate-cx-glow-pulse"
    )}
    style={project.attention && !open ? { animationDelay: `${(project.id % 2) * 0.4}s` } : undefined}
  >
    {/* left accent bar grows in on hover / open */}
    <span
      aria-hidden="true"
      className={cx(
        "absolute bottom-3 left-0 top-3 w-[2px] origin-center rounded-full bg-[linear-gradient(180deg,#38bdf8,#2563eb)] transition-transform duration-500 ease-out-expo",
        open ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
      )}
    />
    {/* light sweep across the row on hover */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent_20%,rgba(56,189,248,0.07)_50%,transparent_80%)] transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-full"
    />

    <div className="flex min-w-0 items-center gap-4 md:gap-5">
      {/* screenshot thumbnail: muted until hover / open */}
      <span className="relative hidden h-12 w-[72px] shrink-0 overflow-hidden rounded-lg border border-slate-400/14 bg-ink sm:block">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className={cx(
            "h-full w-full object-cover object-top transition-[filter,opacity,transform] duration-500 ease-out-expo",
            open ? "opacity-100 grayscale-0" : "opacity-60 grayscale-[0.7] group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          )}
        />
        <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.45), transparent 60%)" }} />
      </span>

      <span
        className={cx(
          "hidden font-mono text-[10px] tracking-[0.14em] transition-colors duration-400 md:inline",
          open ? "text-accent-soft" : "text-dim group-hover:text-accent-mid"
        )}
      >
        [{pad3(project.id)}]
      </span>

      <div className="min-w-0">
        <h3
          className={cx(
            "m-0 text-[17px] font-bold leading-tight tracking-[-0.022em] text-balance transition-[color,transform] duration-400 ease-out-expo md:text-[21px]",
            open ? "text-white" : "text-fg group-hover:translate-x-1 group-hover:text-white"
          )}
        >
          {project.title}
        </h3>
        <div className="mt-[6px] truncate font-mono text-[9.5px] tracking-[0.2em] text-dim">{project.subtitle}</div>
        <ul className="m-0 mt-2 hidden list-none flex-wrap gap-[5px] p-0 sm:flex" aria-label="Technologies">
          {project.tags.slice(0, 3).map((t) => (
            <li
              key={t}
              className={cx(
                "rounded-full border px-2 py-[3px] font-mono text-[8.5px] tracking-[0.08em] transition-colors duration-400",
                open ? "border-accent-mid/35 text-slate-300" : "border-slate-400/14 text-faint group-hover:border-accent-mid/30 group-hover:text-slate-300"
              )}
            >
              {t}
            </li>
          ))}
          {project.tags.length > 3 && (
            <li className="px-1 py-[3px] font-mono text-[8.5px] tracking-[0.08em] text-faint">+{project.tags.length - 3}</li>
          )}
        </ul>
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-3 md:gap-4">
      {project.badge && (
        <span className="hidden rounded-full bg-[linear-gradient(120deg,#2563eb,#38bdf8)] px-3 py-[6px] font-mono text-[9px] tracking-[0.14em] text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,0.9)] sm:inline-block">
          {project.badge}
        </span>
      )}
      <span className={cx("hidden font-mono text-[9.5px] tracking-[0.2em] transition-colors duration-400 md:inline", open ? "text-accent-soft" : "text-dim group-hover:text-muted")}>
        {open ? "CLOSE" : "OPEN"}
      </span>
      <span
        aria-hidden="true"
        className={cx(
          "flex h-[34px] w-[34px] items-center justify-center rounded-full border text-[17px] transition-[transform,border-color,color,background-color,box-shadow] duration-[550ms] ease-out-expo",
          open
            ? "rotate-45 border-accent-mid/55 bg-accent-deep/15 text-accent-soft shadow-[0_0_16px_rgba(56,189,248,0.35)]"
            : "border-slate-400/20 text-slate-400 group-hover:rotate-90 group-hover:border-accent-mid/45 group-hover:bg-accent-deep/10 group-hover:text-fg"
        )}
      >
        <Icon name="ri-add-line" />
      </span>
    </div>
  </button>
);

const Archive = () => {
  const [openId, setOpenId] = useState(null);
  const panelRef = useRef(null);
  const open = PROJECTS.find((p) => p.id === openId) ?? null;

  // Below lg the panel stacks above the rows, so bring it into view when a
  // row is opened; on desktop it is sticky and already visible.
  useEffect(() => {
    if (!openId || !panelRef.current || window.matchMedia("(min-width: 1024px)").matches) return;
    const top = panelRef.current.getBoundingClientRect().top + window.scrollY - 16;
    scrollWindowTo(top);
  }, [openId]);

  return (
    <section aria-labelledby="archive-heading" className="cx-container pb-[110px] pt-[46px]">
      <RevealOnScroll className="cx-section-head pb-[22px]">
        <h2 id="archive-heading" className="m-0 font-sans font-bold tracking-[-0.028em] text-fg" style={{ fontSize: "clamp(24px, 2.4vw, 34px)" }}>
          Project archive
        </h2>
        <Scramble text="TAP A ROW TO EXPAND" className="hidden font-mono text-[10px] tracking-[0.24em] text-[#5b677a] sm:inline" />
      </RevealOnScroll>

      <div className="mt-[30px] flex flex-col items-start gap-[26px] lg:flex-row">
        {/* shared detail panel: sticky on desktop, above the rows on mobile */}
        <div
          ref={panelRef}
          id="archive-panel"
          aria-live="polite"
          className="relative w-full min-h-[420px] shrink-0 overflow-hidden rounded-2xl border border-accent/16 lg:sticky lg:top-[100px] lg:h-[max(640px,calc(100vh_-_130px))] lg:w-[560px] lg:max-w-[42vw]"
          style={{ background: "linear-gradient(150deg, rgba(37,99,235,0.09), rgba(11,15,24,0.72))" }}
        >
          {/* faint grid + a glow that brightens when a project is open */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000, transparent 75%)",
            }}
          />
          <motion.div
            aria-hidden="true"
            animate={{ opacity: open ? 1 : 0.35, scale: open ? 1 : 0.8 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="pointer-events-none absolute -right-24 -top-32 h-[360px] w-[360px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.18), transparent 66%)" }}
          />

          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key={open.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="lg:absolute lg:inset-0 lg:overflow-y-auto"
              >
                <ProjectDetail project={open} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-[14px] p-10 text-center"
              >
                <span className="relative flex h-16 w-16 items-center justify-center">
                  <span className="absolute inset-0 animate-cx-ring-spin rounded-full border border-dashed border-accent/25 [animation-duration:18s]" />
                  <span className="absolute inset-[6px] animate-cx-pulse rounded-full bg-accent-deep/10" />
                  <Icon name="ri-folder-open-line" className="relative animate-cx-drift text-[30px] text-[#4b6a9a] [animation-duration:5s]" />
                </span>
                <div className="font-mono text-[10px] tracking-[0.2em] text-dim">SELECT A PROJECT TO PREVIEW</div>
                <div className="font-mono text-[9px] tracking-[0.18em] text-[#5b677a]">{PROJECTS.length} SYSTEMS ARCHIVED</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-[14px]">
          {PROJECTS.map((project, i) => (
            <RevealOnScroll key={project.id} delay={i * 0.06}>
              <ArchiveRow project={project} open={openId === project.id} onToggle={() => setOpenId((cur) => (cur === project.id ? null : project.id))} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Projects = () => (
  <>
    <section id="work" aria-labelledby="work-heading" className="cx-container pb-10 pt-[60px]">
      <RevealOnScroll className="cx-section-head">
        <Parallax as="h2" speed={0.045} id="work-heading" className="cx-h2">
          Engineered works
        </Parallax>
        <Scramble text={`SELECTED / ${pad3(PROJECTS.length + 1).slice(1)}`} className="font-mono text-[10px] tracking-[0.24em] text-[#5b677a]" />
      </RevealOnScroll>
      <FeaturedProject project={FEATURED_PROJECT} />
    </section>
    <Archive />
  </>
);
