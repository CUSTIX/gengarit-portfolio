import { RAIL_LINKS } from "../../constants";
import { cx } from "../../utils/cx";

/**
 * Fixed scrollspy rail in the upper-left (desktop ≥1360px only): a short
 * line per section that stretches and turns cyan for the active one.
 */
export const SideRail = ({ activeSection }) => (
  <nav aria-label="Sections" className="fixed left-[30px] top-[116px] z-[70] hidden flex-col items-start min-[1360px]:flex">
    {RAIL_LINKS.map((link) => {
      const on = activeSection === link.id;
      return (
        <a
          key={link.id}
          href={`#${link.id}`}
          aria-label={link.name}
          aria-current={on ? "location" : undefined}
          className="group/rail flex h-[30px] items-center gap-[11px]"
        >
          <span
            className={cx(
              "h-px transition-[width,background-color] duration-300",
              on ? "w-7 bg-accent" : "w-[14px] bg-slate-400/40 group-hover/rail:w-5 group-hover/rail:bg-slate-400/70"
            )}
          />
          <span
            className={cx(
              "whitespace-nowrap font-mono text-[9.5px] tracking-[0.16em] transition-colors duration-300",
              on ? "text-accent-soft" : "text-[#5b677a] group-hover/rail:text-slate-300"
            )}
          >
            {link.name.toUpperCase()}
          </span>
        </a>
      );
    })}
  </nav>
);
