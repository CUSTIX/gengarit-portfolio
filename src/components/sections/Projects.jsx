import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FEATURED_PROJECT, PROJECTS } from "../../constants";
import { Parallax } from "../ui/Parallax";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";
import { cx } from "../../utils/cx";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { scrollWindowTo } from "../../utils/scroll";

const pad3 = (n) => String(n).padStart(3, "0");
const AUTO_ADVANCE_MS = 3200;

const FeatureList = ({ items, className }) => (
  <ul className={cx("m-0 grid list-none gap-[11px] p-0", className)}>
    {items.map((f) => (
      <li key={f} className="cx-feature">
        <i className="ri-focus-2-line" aria-hidden="true" />
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
    <i className={dir < 0 ? "ri-arrow-left-s-line text-xl" : "ri-arrow-right-s-line text-xl"} aria-hidden="true" />
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
      className="relative min-h-[260px] overflow-hidden bg-[#05070a] sm:min-h-[360px] lg:min-h-[480px]"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
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

      <div className="absolute left-5 top-5 z-[5] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-400/20 bg-[#05070a] p-[7px]">
        <img src={logo} alt={`${title} logo`} className="h-full w-full object-contain" />
      </div>

      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(11,15,24,0.5) 0%, rgba(11,15,24,0.06) 40%, transparent 100%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.68), transparent 46%)" }} />

      <div className="absolute bottom-[18px] right-5 z-[5] flex gap-[6px]" role="tablist" aria-label="Choose screenshot">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Screenshot ${i + 1} of ${images.length}`}
            onClick={() => go(i)}
            className={cx(
              "h-[6px] rounded-full transition-[background-color,width] duration-300",
              i === idx ? "w-4 bg-accent" : "w-[6px] bg-white/30 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      <SwapButton dir={-1} label="Previous screen" onClick={() => go(idx - 1)} />
      <SwapButton dir={1} label="Next screen" onClick={() => go(idx + 1)} />
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
          <i className="ri-focus-2-line" aria-hidden="true" />
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
  </motion.div>
);

const ArchiveRow = ({ project, open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    aria-controls="archive-panel"
    className={cx(
      "group flex w-full items-center justify-between gap-5 rounded-2xl border px-5 py-5 text-left transition-[border-color,background-color] duration-[450ms] ease-out-expo md:px-[30px] md:py-[25px]",
      open
        ? "border-accent-mid/45 bg-accent-deep/10"
        : "border-slate-400/13 bg-panel/82 hover:border-accent-mid/30 hover:bg-panel/95",
      project.attention && !open && "animate-cx-glow-pulse"
    )}
    style={project.attention && !open ? { animationDelay: `${(project.id % 2) * 0.4}s` } : undefined}
  >
    <div className="flex min-w-0 items-center gap-4 md:gap-[26px]">
      <span className={cx("font-mono text-[10px] tracking-[0.14em] transition-colors duration-400", open ? "text-accent-soft" : "text-faint group-hover:text-accent-mid")}>
        [{pad3(project.id)}]
      </span>
      <div className="min-w-0">
        <h3
          className={cx(
            "m-0 text-lg font-bold leading-tight tracking-[-0.022em] text-balance transition-[color,transform] duration-400 ease-out-expo md:text-[22px]",
            open ? "text-white" : "text-fg group-hover:translate-x-1 group-hover:text-white"
          )}
        >
          {project.title}
        </h3>
        <div className="mt-[6px] truncate font-mono text-[9.5px] tracking-[0.2em] text-dim">{project.subtitle}</div>
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-3 md:gap-4">
      {project.badge && (
        <span className="hidden rounded-full bg-[linear-gradient(120deg,#2563eb,#38bdf8)] px-3 py-[6px] font-mono text-[9px] tracking-[0.14em] text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,0.9)] sm:inline-block">
          {project.badge}
        </span>
      )}
      <span className={cx("hidden font-mono text-[9.5px] tracking-[0.2em] transition-colors duration-400 sm:inline", open ? "text-accent-soft" : "text-faint group-hover:text-muted")}>
        {open ? "CLOSE" : "OPEN"}
      </span>
      <span
        aria-hidden="true"
        className={cx(
          "flex h-[34px] w-[34px] items-center justify-center rounded-full border text-[17px] transition-[transform,border-color,color,background-color] duration-[550ms] ease-out-expo",
          open
            ? "rotate-45 border-accent-mid/55 bg-accent-deep/15 text-accent-soft"
            : "border-slate-400/20 text-slate-400 group-hover:border-accent-mid/45 group-hover:text-fg"
        )}
      >
        <i className="ri-add-line" />
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
                  <i className="ri-folder-open-line relative animate-cx-drift text-[30px] text-[#4b6a9a] [animation-duration:5s]" aria-hidden="true" />
                </span>
                <div className="font-mono text-[10px] tracking-[0.2em] text-[#5b677a]">SELECT A PROJECT TO PREVIEW</div>
                <div className="font-mono text-[9px] tracking-[0.18em] text-faint">{PROJECTS.length} SYSTEMS ARCHIVED</div>
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
