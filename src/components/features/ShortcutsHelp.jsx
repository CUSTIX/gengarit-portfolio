import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Icon } from "../ui/Icon";
import { EASE_OUT_EXPO } from "../../utils/motion";

const SHORTCUTS = [
  { keys: ["⌘", "K"], alt: ["Ctrl", "K"], label: "Command palette — jump to any section or link" },
  { keys: ["?"], label: "This cheat sheet" },
  { keys: ["Esc"], label: "Close palette, assistant, or this sheet" },
  { keys: ["↑", "↓", "Enter"], label: "Move through palette results and open one" },
  { keys: ["Tab"], label: "Move through the page — every control is keyboard reachable" },
  { keys: ["Enter"], label: "Send a message in the assistant" },
];

const Key = ({ children }) => (
  <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-slate-400/20 bg-ink/70 px-2 py-1 font-mono text-[11px] text-slate-200 shadow-[inset_0_-1px_0_rgba(148,163,184,0.2)]">
    {children}
  </kbd>
);

/** "?" overlay listing the site's keyboard shortcuts. */
export const ShortcutsHelp = ({ open, onClose }) => {
  const ref = useRef(null);
  useFocusTrap(ref, open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="shortcuts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/72 px-4 backdrop-blur-[2px]"
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="w-full max-w-[520px] overflow-hidden rounded-[18px] border border-slate-400/18 bg-[rgba(9,13,22,0.98)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3 border-b border-slate-400/10 px-5 py-4">
              <Icon name="ri-keyboard-line" className="text-[18px] text-accent-mid" />
              <h2 id="shortcuts-title" className="m-0 font-sans text-[14px] font-bold text-fg-bright">
                Keyboard shortcuts
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-dim transition-[background-color,color] duration-200 hover:bg-white/5 hover:text-fg"
              >
                <Icon name="ri-close-line" className="text-[17px]" />
              </button>
            </div>
            <ul className="m-0 grid list-none gap-1 p-3">
              {SHORTCUTS.map((s) => (
                <li key={s.label} className="flex items-center gap-4 rounded-xl px-3 py-[10px] transition-colors duration-200 hover:bg-white/[0.03]">
                  <span className="flex shrink-0 items-center gap-1">
                    {s.keys.map((k, i) => (
                      <Key key={i}>{k}</Key>
                    ))}
                    {s.alt && (
                      <>
                        <span className="px-1 font-mono text-[10px] text-faint">or</span>
                        {s.alt.map((k, i) => (
                          <Key key={`alt-${i}`}>{k}</Key>
                        ))}
                      </>
                    )}
                  </span>
                  <span className="text-[13px] text-slate-300">{s.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
