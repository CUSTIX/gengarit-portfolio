import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../../utils/motion";

/**
 * Floating launcher for the assistant. Shows a one-time nudge bubble after
 * a few seconds; the ring pulses until the panel is opened once.
 */
export const ChatbotButton = ({ onClick, open, nudge }) => (
  <div className="relative flex items-center">
    <AnimatePresence>
      {nudge && !open && (
        <motion.div
          key="nudge"
          initial={{ opacity: 0, x: 12, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 12, scale: 0.95 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="pointer-events-none absolute right-[68px] whitespace-nowrap rounded-full border border-slate-400/16 bg-panel/90 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-slate-300 backdrop-blur-[12px]"
        >
          ASK ME ANYTHING
          <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-slate-400/16 bg-panel" />
        </motion.div>
      )}
    </AnimatePresence>

    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close assistant" : "Open assistant"}
      aria-expanded={open}
      aria-controls="cx-assistant"
      className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-accent-mid/35 bg-ink/80 text-accent-soft shadow-[0_16px_40px_-16px_rgba(37,99,235,0.9)] backdrop-blur-[12px] transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-accent-mid/70 hover:shadow-[0_20px_50px_-16px_rgba(56,189,248,0.9)] active:translate-y-0"
    >
      {!open && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full border border-accent/40 [animation-duration:2.6s]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-[3px] rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 30%, rgba(37,99,235,0.35), transparent 70%)" }}
      />
      <span className="relative grid h-5 w-5 place-items-center">
        <i
          className={`ri-chat-3-line col-start-1 row-start-1 text-xl transition-[opacity,transform] duration-400 ease-out-expo ${open ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
          aria-hidden="true"
        />
        <i
          className={`ri-close-line col-start-1 row-start-1 text-xl transition-[opacity,transform] duration-400 ease-out-expo ${open ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          aria-hidden="true"
        />
      </span>
    </button>
  </div>
);
