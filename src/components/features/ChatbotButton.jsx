import { LogoMark } from "../ui/Logo";
import { cx } from "../../utils/cx";

/**
 * Floating launcher for the assistant: a 58px orb with a slowly spinning
 * ring and a pulse, the CX mark inside (rotates when the panel is open),
 * and an "Ask CX" tooltip that slides in on hover.
 */
export const ChatbotButton = ({ onClick, open }) => (
  <div className="group/fab flex items-center gap-3">
    <span
      aria-hidden="true"
      className={cx(
        "translate-x-[6px] whitespace-nowrap rounded-full border border-slate-400/18 bg-[rgba(9,13,22,0.94)] px-[14px] py-[9px] font-mono text-[10.5px] tracking-[0.1em] text-slate-300 opacity-0 transition-[opacity,transform] duration-300",
        !open && "group-hover/fab:translate-x-0 group-hover/fab:opacity-100"
      )}
    >
      Ask CX
    </span>
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close assistant" : "Open assistant"}
      aria-expanded={open}
      aria-controls="cx-assistant"
      className={cx(
        "relative flex h-[58px] w-[58px] items-center justify-center rounded-full border shadow-[0_16px_40px_-16px_rgba(37,99,235,0.7)] transition-[border-color,box-shadow,scale] duration-300 ease-out-expo hover:scale-[1.08] hover:border-accent-soft/60 hover:shadow-[0_20px_48px_-14px_rgba(37,99,235,0.9)] active:scale-95",
        open ? "border-accent-soft/70" : "animate-cx-fab-attract border-accent-mid/35"
      )}
      style={{ background: "linear-gradient(140deg, #0b1226, #101a34)" }}
    >
      <span aria-hidden="true" className="absolute -inset-[6px] animate-cx-ring-spin rounded-full border border-accent/35 border-t-accent-soft/80" />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-cx-pulse rounded-full [animation-duration:2.2s]"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.28), transparent 70%)" }}
      />
      <LogoMark
        size={22}
        className={cx("relative transition-transform duration-300 ease-out-expo", open && "rotate-90 scale-90")}
      />
    </button>
  </div>
);
