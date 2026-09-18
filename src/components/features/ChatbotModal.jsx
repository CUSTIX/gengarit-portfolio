import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "../../constants";
import { LogoMark } from "../ui/Logo";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { cx } from "../../utils/cx";

const SUGGESTIONS = ["What's your stack?", "Tell me about SENTINELS", "How can I hire you?"];

export const ChatbotModal = ({ open, onClose, onSend, messages, loading }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const send = (text) => {
    const value = (text ?? input).trim();
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
          aria-label={`${BRAND.name} assistant`}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="fixed bottom-[92px] right-4 z-[85] flex w-[calc(100%-2rem)] max-w-[380px] origin-bottom-right flex-col overflow-hidden rounded-[20px] border border-slate-400/14 bg-ink/92 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] backdrop-blur-[18px] sm:right-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #2563eb 22%, #7dd3fc 50%, #2563eb 78%, transparent)" }}
          />

          <header className="flex items-center justify-between border-b border-slate-400/12 px-5 py-4">
            <div className="flex items-center gap-3">
              <LogoMark size={26} />
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-fg">CX ASSISTANT</div>
                <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] text-dim">
                  <span className="h-[5px] w-[5px] animate-cx-pulse rounded-full bg-accent" />
                  ONLINE
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close assistant"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-[color,background-color] duration-300 hover:bg-white/5 hover:text-fg"
            >
              <i className="ri-close-line text-lg" aria-hidden="true" />
            </button>
          </header>

          <div className="max-h-[380px] min-h-[260px] flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="pt-2">
                <p className="m-0 text-[13px] leading-relaxed text-muted">
                  Hi, I can answer questions about {BRAND.fullName.split(" ")[0]}&rsquo;s work, stack, and availability.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="cx-tag cursor-pointer normal-case tracking-[0.04em]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className={cx("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cx(
                    "max-w-[85%] break-words rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "rounded-br-md bg-[linear-gradient(120deg,#2563eb,#38bdf8)] text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)]"
                      : "rounded-bl-md border border-slate-400/12 bg-panel/80 text-slate-200"
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start" aria-live="polite" aria-label="Assistant is typing">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-400/12 bg-panel/80 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-slate-400/12 px-3 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, stack, availability…"
              aria-label="Message"
              className="cx-input rounded-full px-4 py-3 text-[13px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(120deg,#2563eb,#38bdf8)] text-white transition-[transform,opacity,box-shadow] duration-400 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(56,189,248,0.9)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <i className="ri-send-plane-2-line" aria-hidden="true" />
            </button>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
