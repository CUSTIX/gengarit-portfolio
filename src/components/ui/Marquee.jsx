import { useReducedMotion } from "framer-motion";
import { cx } from "../../utils/cx";

/**
 * Infinite horizontal ticker. The item list is rendered twice and the
 * track slides by exactly one copy, so the loop is seamless. Pauses on
 * hover; static (single row, no motion) for reduced-motion users.
 *
 * @param {object} props
 * @param {string[]} props.items
 * @param {number} [props.duration] seconds per loop
 */
export const Marquee = ({ items, duration = 38, className }) => {
  const reduced = useReducedMotion();
  const copies = reduced ? [items] : [items, items];

  return (
    <div
      className={cx("group/marquee relative overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div
        className={cx("flex w-max", !reduced && "cx-marquee group-hover/marquee:[animation-play-state:paused]")}
        style={{ "--marquee-duration": `${duration}s` }}
      >
        {copies.map((copy, c) => (
          <ul key={c} aria-hidden={c > 0} className="m-0 flex shrink-0 list-none items-center p-0">
            {copy.map((item, i) => (
              <li key={`${item}-${i}`} className="flex items-center gap-8 pr-8 font-mono text-[11px] tracking-[0.26em] text-slate-400 transition-colors duration-300 hover:text-accent-soft">
                <span className="whitespace-nowrap">{item}</span>
                <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-accent/60 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};
