import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icon";
import { EASE_OUT_EXPO } from "../../utils/motion";

/** Small bottom-centre notice; the caller controls `show`. */
export const Toast = ({ show, icon, children }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key="toast"
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
        className="pointer-events-none fixed bottom-6 left-1/2 z-[160] flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-400/30 bg-[rgba(9,13,22,0.96)] px-4 py-[10px] font-mono text-[10.5px] tracking-[0.12em] text-emerald-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
      >
        {icon && <Icon name={icon} className="text-[14px] text-emerald-300" />}
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
