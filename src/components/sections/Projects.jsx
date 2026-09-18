import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "../../constants";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { TiltCard } from "../ui/TiltCard";
import { cx } from "../../utils/cx";

const pad3 = (n) => String(n).padStart(3, "0");

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

const FeaturedProject = ({ project }) => (
  <RevealOnScroll className="mt-[46px]">
    <TiltCard className="relative overflow-hidden rounded-[26px] border border-slate-400/14 bg-panel/60 backdrop-blur-[14px] transition-[border-color,box-shadow] duration-500 hover:border-accent-mid/42 hover:shadow-[0_30px_90px_-40px_rgba(37,99,235,0.6)]">
      <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
        <div className="p-7 sm:p-10 lg:px-12 lg:pb-12 lg:pt-[52px]">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-accent">
            <span className="h-px w-[22px] bg-accent" />
            FEATURED
          </div>
          <h3 className="m-0 mt-6 text-[28px] font-bold leading-[1.12] tracking-[-0.03em] text-fg-bright text-balance sm:text-4xl">
            {project.title}
          </h3>
          <div className="mt-3 text-sm text-accent-mid">{project.subtitle}</div>
          <p className="m-0 mt-6 text-[15px] leading-[1.75] text-[#97a2b5] text-pretty">{project.description}</p>
          <FeatureList items={project.features} className="mt-[30px] gap-3 [&>li]:text-[13px]" />
          <div className="mt-[30px]">
            <ImpactBox text={project.impact} labelled={false} />
          </div>
          <TagList tags={project.tags} className="mt-7" />
        </div>

        <div className="group/img relative min-h-[260px] overflow-hidden sm:min-h-[360px] lg:min-h-[480px]">
          <img
            src={project.image}
            alt={`${project.title} interface`}
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-left-top transition-transform duration-[1200ms] ease-out-expo group-hover/tilt:scale-[1.07]"
          />
          <div
            className="absolute inset-0 transition-opacity duration-700 group-hover/tilt:opacity-80"
            style={{ background: "linear-gradient(100deg, rgba(11,15,24,0.96) 0%, rgba(11,15,24,0.42) 34%, rgba(11,15,24,0.18) 100%)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.72), transparent 46%)" }} />
        </div>
      </div>
    </TiltCard>
  </RevealOnScroll>
);

const ArchiveItem = ({ project, open, onToggle }) => {
  const bodyId = `project-${project.id}`;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className={cx(
          "group flex w-full items-center justify-between gap-5 rounded-2xl border px-5 py-5 text-left backdrop-blur-[12px] transition-[border-color,background-color,transform] duration-[450ms] ease-out-expo md:px-[30px] md:py-[25px]",
          open
            ? "border-accent-mid/45 bg-accent-deep/10"
            : "border-slate-400/13 bg-panel/55 hover:border-accent-mid/30 hover:bg-panel/80"
        )}
      >
        <div className="flex min-w-0 items-center gap-4 md:gap-[26px]">
          <span
            className={cx(
              "font-mono text-[10px] tracking-[0.14em] transition-colors duration-400",
              open ? "text-accent-soft" : "text-faint group-hover:text-accent-mid"
            )}
          >
            [{pad3(project.id)}]
          </span>
          <div className="min-w-0">
            <h3
              className={cx(
                "m-0 truncate text-lg font-bold tracking-[-0.022em] transition-[color,transform] duration-400 ease-out-expo md:text-[22px]",
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
          <span
            className={cx(
              "hidden font-mono text-[9.5px] tracking-[0.2em] transition-colors duration-400 sm:inline",
              open ? "text-accent-soft" : "text-faint group-hover:text-muted"
            )}
          >
            {open ? "CLOSE" : "OPEN"}
          </span>
          <span
            aria-hidden="true"
            className={cx(
              "flex h-[34px] w-[34px] items-center justify-center rounded-full border text-[17px] transition-[transform,border-color,color,background-color] duration-[550ms] ease-out-expo",
              open
                ? "rotate-180 border-accent-mid/55 bg-accent-deep/15 text-accent-soft"
                : "border-slate-400/20 text-slate-400 group-hover:border-accent-mid/45 group-hover:text-fg"
            )}
          >
            <i className="ri-arrow-down-s-line" />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.7, ease: EASE_OUT_EXPO }, opacity: { duration: 0.45 } }}
            className="overflow-hidden"
          >
            <div
              className="mt-[14px] grid items-start gap-6 rounded-2xl border border-accent/16 p-5 sm:p-8 lg:grid-cols-2 lg:gap-[34px]"
              style={{ background: "linear-gradient(150deg, rgba(37,99,235,0.09), rgba(11,15,24,0.72))" }}
            >
              <div className="group/shot relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-400/14">
                <img
                  src={project.image}
                  alt={`${project.title} interface`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out-expo group-hover/shot:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,7,12,0.5), transparent 55%)" }} />
              </div>
              <div>
                <p className="m-0 text-[14.5px] leading-[1.74] text-muted text-pretty">{project.description}</p>
                <FeatureList items={project.features} className="mt-6" />
                <div className="mt-6">
                  <ImpactBox text={project.impact} />
                </div>
                <TagList tags={project.tags} className="mt-[22px] gap-[7px]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Projects = () => {
  const [openId, setOpenId] = useState(null);
  const featured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const archive = PROJECTS.filter((p) => p !== featured);

  return (
    <>
      <section id="work" aria-labelledby="work-heading" className="cx-container pb-10 pt-[60px]">
        <RevealOnScroll className="cx-section-head">
          <h2 id="work-heading" className="cx-h2">
            Engineered works
          </h2>
          <span className="font-mono text-[10px] tracking-[0.24em] text-[#5b677a]">SELECTED / {pad3(PROJECTS.length).slice(1)}</span>
        </RevealOnScroll>
        <FeaturedProject project={featured} />
      </section>

      <section aria-labelledby="archive-heading" className="cx-container pb-[110px] pt-[46px]">
        <RevealOnScroll className="cx-section-head pb-[22px]">
          <h2
            id="archive-heading"
            className="m-0 font-sans font-bold tracking-[-0.028em] text-fg"
            style={{ fontSize: "clamp(24px, 2.4vw, 34px)" }}
          >
            Project archive
          </h2>
          <span className="hidden font-mono text-[10px] tracking-[0.24em] text-[#5b677a] sm:inline">TAP A ROW TO EXPAND</span>
        </RevealOnScroll>
        <div className="mt-[30px] grid gap-[14px]">
          {archive.map((project, i) => (
            <RevealOnScroll key={project.id} delay={i * 0.06}>
              <ArchiveItem
                project={project}
                open={openId === project.id}
                onToggle={() => setOpenId((cur) => (cur === project.id ? null : project.id))}
              />
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
};
