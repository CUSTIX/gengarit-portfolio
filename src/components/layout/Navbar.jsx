import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "../../constants";
import { useOpenPalette } from "../../context/palette";
import { LogoMark } from "../ui/Logo";
import { Magnetic } from "../ui/Magnetic";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { cx } from "../../utils/cx";

const NavLink = ({ id, name, active, onClick, className, underline = true }) => (
  <a
    href={`#${id}`}
    onClick={onClick}
    aria-current={active ? "location" : undefined}
    className={cx(
      "group/link relative py-1 transition-colors duration-300",
      active ? "text-fg" : "text-nav hover:text-fg",
      className
    )}
  >
    {name.toUpperCase()}
    {underline && (
      <span
        aria-hidden="true"
        className={cx(
          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gradient-to-r from-accent-mid to-accent transition-transform duration-500 ease-out-expo",
          active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
        )}
      />
    )}
  </a>
);

/**
 * Sticky frosted header. Desktop: inline links + CONTACT pill. Mobile: a
 * hamburger that drops a panel below the bar. A hairline along the bottom
 * fills with the page scroll progress.
 */
export const Navbar = ({ activeSection }) => {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const openPalette = useOpenPalette();

  // Close the mobile panel on Escape and when the viewport grows past md.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-[80]">
      <nav
        aria-label="Primary"
        className="relative border-b border-slate-400/10 bg-ink/62 backdrop-blur-[18px]"
      >
        <div className="cx-container flex h-[76px] items-center justify-between">
          <Magnetic
            href="#top"
            onClick={close}
            aria-label={`${BRAND.name} — back to top`}
            className="group flex items-center gap-3"
          >
            <LogoMark
              size={38}
              className="transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.55)]"
            />
            <span className="font-sans text-[15px] font-bold tracking-[0.30em] text-fg">{BRAND.name}</span>
          </Magnetic>

          {/* Desktop */}
          <div className="hidden items-center gap-[34px] font-mono text-[11px] tracking-[0.16em] md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.id} {...link} active={activeSection === link.id} />
            ))}
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              title="Search (Ctrl/⌘ K)"
              className="group/kbd flex items-center gap-2 rounded-full border border-slate-400/14 px-3 py-[7px] text-[10px] tracking-[0.12em] text-dim transition-[border-color,color,background-color] duration-300 hover:border-accent-mid/40 hover:bg-accent-deep/10 hover:text-slate-200"
            >
              <i className="ri-search-line text-[12px] transition-transform duration-400 ease-out-expo group-hover/kbd:scale-110" aria-hidden="true" />
              <kbd className="font-mono">⌘K</kbd>
            </button>
            <Magnetic
              href="#contact"
              className={cx(
                "rounded-full border px-5 py-[11px] transition-[border-color,background-color,box-shadow,color] duration-400",
                activeSection === "contact"
                  ? "border-accent-mid/70 bg-accent-deep/25 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                  : "border-accent-mid/35 bg-accent-deep/12 text-fg hover:border-accent-mid/60 hover:bg-accent-deep/24 hover:text-white hover:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
              )}
            >
              CONTACT
            </Magnetic>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-fg transition-colors hover:bg-white/5 md:hidden"
          >
            <span
              className={cx(
                "absolute h-px w-5 bg-current transition-transform duration-400 ease-out-expo",
                open ? "rotate-45" : "-translate-y-[5px]"
              )}
            />
            <span
              className={cx(
                "absolute h-px w-5 bg-current transition-[opacity,transform] duration-300",
                open ? "scale-x-0 opacity-0" : ""
              )}
            />
            <span
              className={cx(
                "absolute h-px w-5 bg-current transition-transform duration-400 ease-out-expo",
                open ? "-rotate-45" : "translate-y-[5px]"
              )}
            />
          </button>
        </div>

        {/* Scroll progress */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-soft opacity-80"
        />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="absolute inset-x-0 top-full border-b border-slate-400/10 bg-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] md:hidden"
          >
            <div className="cx-container flex flex-col gap-1 py-4 font-mono text-[12px] tracking-[0.18em]">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: EASE_OUT_EXPO }}
                >
                  <NavLink
                    {...link}
                    active={activeSection === link.id}
                    onClick={close}
                    underline={false}
                    className="block py-3"
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + NAV_LINKS.length * 0.05, duration: 0.4, ease: EASE_OUT_EXPO }}
                className="mt-2 flex flex-wrap items-center gap-3"
              >
                <a href="#contact" onClick={close} className="inline-flex rounded-full border border-accent-mid/35 bg-accent-deep/12 px-5 py-[11px] text-fg transition-colors hover:bg-accent-deep/24">
                  CONTACT
                </a>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    openPalette();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-400/16 px-4 py-[11px] text-[11px] text-slate-300 transition-colors hover:border-accent-mid/40 hover:text-white"
                >
                  <i className="ri-search-line" aria-hidden="true" /> SEARCH
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.05, duration: 0.4 }}
                className="mt-4 flex items-center gap-2 border-t border-slate-400/10 pt-4"
              >
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-400/14 text-slate-400 transition-[border-color,color,background-color] duration-300 hover:border-accent-mid/50 hover:bg-accent-deep/12 hover:text-accent-soft"
                  >
                    <i className={`${s.icon} text-[17px]`} aria-hidden="true" />
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
