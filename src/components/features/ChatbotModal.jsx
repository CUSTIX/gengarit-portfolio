import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "../../constants";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { LogoMark } from "../ui/Logo";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { cx } from "../../utils/cx";
import { Icon } from "../ui/Icon";

const GREETING = `Hey — I'm CX, ${BRAND.fullName.split(" ")[0]}'s portfolio assistant. Ask me about his projects, stack, or experience.`;
const QUICK_REPLIES = ["What is ProSupport Squad?", "What's your strongest stack?", "Are you open to work?", "Tell me about SENTINELS"];

const timeOf = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const BotAvatar = ({ className }) => (
  <div
    aria-hidden="true"
    className={cx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[linear-gradient(140deg,#0b1226,#101a34)] shadow-[0_0_0_2px_rgba(56,189,248,0.08)]", className)}
  >
    <LogoMark size={14} />
  </div>
);

const UserAvatar = () => (
  <div aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(120deg,#2563eb,#38bdf8)] text-fg-bright">
    <Icon name="ri-user-3-line" className="text-[13px]" />
  </div>
);

/** One message. `first` shows the avatar; `last` shows the timestamp. */
const Message = ({ role, content, at, first, last }) => {
  const mine = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      className={cx("flex max-w-[86%] items-start gap-2", mine ? "flex-row-reverse self-end" : "self-start", !first && "mt-[-6px]")}
    >
      <div className="mt-[3px] w-7 shrink-0">{first && (mine ? <UserAvatar /> : <BotAvatar />)}</div>
      <div className={cx("flex min-w-0 flex-col", mine ? "items-end" : "items-start")}>
        <div
          className={cx(
            "whitespace-pre-wrap break-words px-[14px] py-[10px] text-[13.5px] leading-[1.6]",
            mine
              ? "rounded-[18px] rounded-br-[6px] bg-[linear-gradient(120deg,#2563eb,#38bdf8)] text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)]"
              : "rounded-[18px] rounded-bl-[6px] border border-slate-400/12 bg-white/[0.05] text-slate-200"
          )}
        >
          {content}
        </div>
        {last && at && <span className="mt-1 px-1 font-mono text-[9px] tracking-[0.12em] text-faint">{timeOf(at)}</span>}
      </div>
    </motion.div>
  );
};

const Typing = () => (
  <div className="flex items-start gap-2 self-start" aria-live="polite" aria-label="CX is typing">
    <BotAvatar />
    <div className="flex items-center gap-[5px] rounded-[18px] rounded-bl-[6px] border border-slate-400/12 bg-white/[0.05] px-4 py-[13px]">
      {[0, 0.15, 0.3].map((d) => (
        <span key={d} className="cx-typing-dot h-[6px] w-[6px] rounded-full bg-accent-soft" style={{ animationDelay: `${d}s` }} />
      ))}
    </div>
  </div>
);

export const ChatbotModal = ({ open, onClose, onSend, onReset, messages, loading, questionsLeft }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  useFocusTrap(panelRef, open);

  // keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    onSend(value);
    setInput("");
    inputRef.current?.focus();
  };

  // consecutive messages from the same side are grouped: avatar on the
  // first, timestamp on the last
  const rows = messages.map((m, i) => ({
    ...m,
    first: i === 0 || messages[i - 1].role !== m.role,
    last: i === messages.length - 1 || messages[i + 1].role !== m.role,
  }));
  const exhausted = questionsLeft === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          ref={panelRef}
          id="cx-assistant"
          key="assistant"
          role="dialog"
          aria-label="CX Assistant"
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="flex h-[min(640px,calc(100vh-128px))] w-[min(392px,calc(100vw-24px))] origin-bottom-right flex-col overflow-hidden rounded-[22px] border border-slate-400/14 bg-[rgba(9,13,22,0.98)] shadow-[0_34px_80px_-28px_rgba(0,0,0,0.8),0_0_0_1px_rgba(56,189,248,0.06)]"
        >
          {/* header */}
          <header
            className="relative flex shrink-0 items-center gap-3 border-b border-slate-400/10 px-4 py-3"
            style={{ background: "linear-gradient(150deg, rgba(37,99,235,0.16), transparent 70%)" }}
          >
            <div className="relative">
              <BotAvatar className="h-10 w-10" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1020] bg-emerald-400 shadow-[0_0_8px_#34d399]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="font-sans text-[14px] font-bold text-fg-bright">CX Assistant</div>
              <div className="mt-[1px] truncate font-mono text-[9.5px] tracking-[0.12em] text-dim">ONLINE · REPLIES INSTANTLY</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-dim transition-[background-color,color] duration-200 hover:bg-white/5 hover:text-fg"
                >
                  <Icon name="ri-refresh-line" className="text-[15px]" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full text-dim transition-[background-color,color] duration-200 hover:bg-white/5 hover:text-fg"
              >
                <Icon name="ri-close-line" className="text-[17px]" />
              </button>
            </div>
          </header>

          {/* conversation */}
          <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3 pt-4">
            <div className="mb-1 flex items-center gap-3 font-mono text-[9px] tracking-[0.22em] text-faint">
              <span className="h-px flex-1 bg-slate-400/10" />
              TODAY
              <span className="h-px flex-1 bg-slate-400/10" />
            </div>

            <Message role="bot" content={GREETING} first last={messages.length === 0} />

            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35, ease: EASE_OUT_EXPO }}
                className="ml-9 flex flex-wrap gap-2"
              >
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-accent-mid/30 bg-accent-deep/10 px-3 py-[7px] text-[12px] text-slate-200 transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent-mid/60 hover:bg-accent-deep/20"
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}

            {rows.map((m, i) => (
              <Message key={`${m.at}-${i}`} {...m} />
            ))}
            {loading && <Typing />}
          </div>

          {/* composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="shrink-0 border-t border-slate-400/10 px-3 pb-3 pt-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-400/16 bg-ink/70 py-1.5 pl-4 pr-1.5 transition-[border-color,box-shadow] duration-300 focus-within:border-accent-mid/50 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.14)]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={exhausted ? "Question limit reached — use the contact form" : "Message CX…"}
                disabled={exhausted}
                autoComplete="off"
                maxLength={400}
                aria-label="Message"
                className="min-w-0 flex-1 border-0 bg-transparent py-2 font-sans text-[13.5px] text-fg outline-none placeholder:text-dim disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || exhausted}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(120deg,#2563eb,#38bdf8)] text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,0.9)] transition-[transform,opacity,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(56,189,248,0.9)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <Icon name="ri-send-plane-2-fill" className="text-[15px]" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 font-mono text-[9px] tracking-[0.14em] text-faint">
              <span className="hidden sm:inline">ENTER TO SEND · ESC TO CLOSE</span>
              <span className="sm:hidden">POWERED BY CUSTIX DATA</span>
              <span className={cx(questionsLeft <= 3 && "text-accent-soft")}>{questionsLeft} LEFT</span>
            </div>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
