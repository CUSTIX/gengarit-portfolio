import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PALETTE_ITEMS } from "../../constants";
import { scrollToSection } from "../../utils/scroll";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { cx } from "../../utils/cx";

/**
 * ⌘K / Ctrl+K command palette: filters sections and social links by label
 * or hint, arrow keys move, Enter jumps, Esc / backdrop click closes.
 * `open`/`onClose` are owned by App so the hero button can open it too.
 */
export const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? PALETTE_ITEMS.filter((it) => it.label.toLowerCase().includes(q) || it.hint.toLowerCase().includes(q)) : PALETTE_ITEMS;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  const run = (item) => {
    onClose();
    if (item.external) window.open(item.href, "_blank", "noreferrer");
    else {
      history.replaceState(null, "", item.href);
      scrollToSection(item.href.slice(1));
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  // keep the highlighted row visible while arrowing through a long list
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[150] flex items-start justify-center bg-ink/72 px-4 pt-[14vh] backdrop-blur-[2px]"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            onKeyDown={onKeyDown}
            className="w-full max-w-[560px] overflow-hidden rounded-[18px] border border-slate-400/18 bg-[rgba(9,13,22,0.98)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3 border-b border-slate-400/10 px-[18px] py-4">
              <i className="ri-search-line text-dim" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Jump to a section or link…"
                autoComplete="off"
                aria-label="Search sections and links"
                aria-activedescendant={filtered[active] ? `cmdk-${active}` : undefined}
                className="flex-1 border-0 bg-transparent font-sans text-[14.5px] text-fg outline-none placeholder:text-[#4d596d]"
              />
              <kbd className="rounded-md border border-slate-400/16 px-[7px] py-[3px] font-mono text-[9.5px] tracking-[0.1em] text-faint">ESC</kbd>
            </div>
            <div ref={listRef} role="listbox" className="max-h-[340px] overflow-y-auto p-2">
              {filtered.map((item, i) => (
                <a
                  key={item.href}
                  id={`cmdk-${i}`}
                  role="option"
                  aria-selected={i === active}
                  href={item.href}
                  onMouseEnter={() => setActive(i)}
                  onClick={(e) => {
                    e.preventDefault();
                    run(item);
                  }}
                  className={cx(
                    "flex items-center gap-3 rounded-[10px] px-3 py-[11px] transition-colors duration-150",
                    i === active ? "bg-accent-deep/16" : "hover:bg-white/[0.03]"
                  )}
                >
                  <i className={`${item.icon} w-[18px] text-base text-accent-mid`} aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-[13.5px] text-fg">{item.label}</div>
                    <div className="mt-[2px] font-mono text-[10px] text-[#5b677a]">{item.hint}</div>
                  </div>
                  {item.external && <i className="ri-arrow-right-up-line ml-auto text-sm text-ghost" aria-hidden="true" />}
                </a>
              ))}
              {!filtered.length && <div className="p-5 text-center text-[13px] text-[#5b677a]">No matches</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
