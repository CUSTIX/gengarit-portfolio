import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "../ui/Logo";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { cx } from "../../utils/cx";

const GREETING = "Hey — ask me anything about John's projects, stack, or experience.";

const Avatar = ({ mine }) => (
  <div
    aria-hidden="true"
    className={cx(
      "mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px]",
      mine ? "bg-[linear-gradient(120deg,#2563eb,#38bdf8)]" : "border border-accent/25 bg-accent-deep/18"
    )}
  >
    <i className={mine ? "ri-user-3-line text-[12px] text-fg-bright" : "ri-cpu-line text-[13px] text-accent-soft"} />
  </div>
);

const Bubble = ({ mine, children }) => (
  <div
    className={cx(
      "whitespace-pre-wrap px-[14px] py-[11px] text-[13.5px] leading-[1.65]",
      mine
        ? "rounded-[14px_4px_14px_14px] border border-accent/22 bg-accent/14 text-fg"
        : "rounded-[4px_14px_14px_14px] border border-slate-400/10 bg-white/[0.04] text-slate-300"
    )}
  >
    {children}
  </div>
);

const Row = ({ mine, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
    className={cx("flex max-w-[90%] items-start gap-[9px]", mine ? "flex-row-reverse self-end" : "self-start")}
  >
    <Avatar mine={mine} />
    {children}
  </motion.div>
);

export const ChatbotModal = ({ open, onClose, onSend, messages, loading }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      // hand focus back to the launcher button
      document.querySelector('[aria-controls="cx-assistant"]')?.focus();
    };
  }, [open, onClose]);

  const send = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || loading) return;
    onSend(value);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          id="cx-assistant"
          key="assistant"
          role="dialog"
          aria-label="CX Assistant"
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="flex w-[min(360px,calc(100vw-40px))] origin-bottom-right flex-col overflow-hidden rounded-[20px] border border-slate-400/14 bg-[rgba(9,13,22,0.98)] shadow-[0_34px_80px_-28px_rgba(0,0,0,0.75),0_0_0_1px_rgba(56,189,248,0.06)]"
        >
          <header
            className="flex shrink-0 items-center gap-3 border-b border-slate-400/10 px-5 py-[18px]"
            style={{ background: "linear-gradient(150deg, rgba(37,99,235,0.14), transparent)" }}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-accent-mid/30 bg-ink">
              <LogoMark size={18} />
            </div>
            <div className="min-w-0">
              <div className="font-sans text-[13.5px] font-bold text-fg-bright">CX Assistant</div>
              <div className="mt-[2px] flex items-center gap-[6px]">
                <span className="h-[6px] w-[6px] rounded-full bg-emerald-400 shadow-[0_0_7px_#34d399]" />
                <span className="font-mono text-[9px] tracking-[0.12em] text-dim">ONLINE</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-400/16 text-dim transition-[background-color,border-color,color] duration-200 hover:border-slate-400/30 hover:bg-slate-400/10 hover:text-slate-300"
            >
              <i className="ri-close-line text-[15px]" aria-hidden="true" />
            </button>
          </header>

          <div ref={listRef} className="flex max-h-[45vh] min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto px-5 pb-2 pt-[18px]">
            <Row>
              <Bubble>{GREETING}</Bubble>
            </Row>
            {messages.map((msg, i) => (
              <Row key={i} mine={msg.role === "user"}>
                <Bubble mine={msg.role === "user"}>{msg.content}</Bubble>
              </Row>
            ))}
            {loading && (
              <Row>
                <div className="flex gap-[5px] rounded-[4px_14px_14px_14px] border border-slate-400/10 bg-white/[0.04] px-4 py-[13px]" aria-label="Assistant is typing">
                  {[0, 0.15, 0.3].map((d) => (
                    <span key={d} className="cx-typing-dot h-[5px] w-[5px] rounded-full bg-accent-soft" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </Row>
            )}
          </div>

          <form onSubmit={send} className="flex shrink-0 items-center gap-[10px] px-4 pb-4 pt-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ProSupport, the stack…"
              autoComplete="off"
              aria-label="Message"
              className="cx-field flex-1 pb-[10px] pt-1 text-[13.5px] text-fg placeholder:text-[#5b677a]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-accent-soft transition-[transform,color] duration-200 hover:scale-[1.12] hover:text-[#bae6fd] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <i className="ri-arrow-right-line text-[17px]" aria-hidden="true" />
            </button>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
