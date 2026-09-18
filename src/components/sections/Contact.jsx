import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "emailjs-com";
import { SOCIAL_LINKS } from "../../constants";
import { Magnetic } from "../ui/Magnetic";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { EASE_OUT_EXPO } from "../../utils/motion";
import { cx } from "../../utils/cx";

// EmailJS public identifiers (safe to ship; restrict by domain in the
// EmailJS dashboard). Override per environment via VITE_* vars.
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID || "service_ga6df7j";
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID || "template_d97zceq";
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY || "iCDXyO4yyYF7diIJO";
const COOLDOWN_MS = 5 * 60 * 1000;

const DRAFT_KEY = "contact_draft";
const LAST_SENT_KEY = "last_transmission_time";
const EMPTY = { from_name: "", from_email: "", message: "" };

const readDraft = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    return saved ? { ...EMPTY, ...saved } : EMPTY;
  } catch {
    return EMPTY;
  }
};

const Corner = ({ className }) => (
  <span
    aria-hidden="true"
    className={cx(
      "pointer-events-none absolute h-[26px] w-[26px] border-accent-mid/55 transition-[width,height,border-color] duration-500 ease-out-expo group-hover/frame:h-9 group-hover/frame:w-9 group-hover/frame:border-accent-soft",
      className
    )}
  />
);

const Field = ({ id, label, as: Tag = "input", className, ...rest }) => (
  <div className="grid gap-[9px]">
    <label htmlFor={id} className="cx-label text-[9.5px] text-dim">
      {label}
    </label>
    <Tag id={id} className={cx("cx-input", className)} {...rest} />
  </div>
);

export const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState(readDraft);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* private mode / quota: drafts are a convenience only */
    }
  }, [form]);

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const last = parseInt(localStorage.getItem(LAST_SENT_KEY) || "0", 10);
    const now = Date.now();
    if (last && now - last < COOLDOWN_MS) {
      const mins = Math.ceil((COOLDOWN_MS - (now - last)) / 60000);
      setStatus({ type: "error", message: `SYSTEM_COOLDOWN: please wait ${mins} minute(s) before the next transmission.` });
      return;
    }

    setLoading(true);
    setStatus(null);

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
        if (result.status !== 200 && result.text !== "OK") throw new Error(`status ${result.status}`);
        setStatus({ type: "success", message: "TRANSMISSION_SUCCESSFUL: message received. I will reply shortly." });
        setForm(EMPTY);
        localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
      })
      .catch((err) => {
        console.error("EmailJS failure:", err);
        setStatus({ type: "error", message: `TRANSMISSION_FAILED: ${err?.text || err?.message || "uplink failure."}` });
      })
      .finally(() => setLoading(false));
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="cx-container max-w-[1060px] pb-[120px] pt-5">
      <RevealOnScroll className="text-center">
        <div className="cx-label text-[10px] tracking-[0.26em] text-accent-soft">INITIATE CONTACT</div>
        <h2
          id="contact-heading"
          className="m-0 mt-5 font-sans font-bold tracking-[-0.035em] text-fg-bright text-balance"
          style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
        >
          Let&rsquo;s build something resilient.
        </h2>
        <p className="mx-auto mb-0 mt-5 max-w-[52ch] text-base leading-[1.72] text-muted text-pretty">
          Secure line open for project inquiries, system audits, or collaboration requests.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1} className="group/frame relative mt-[46px] p-[9px]">
        <Corner className="left-0 top-0 rounded-tl-lg border-l border-t" />
        <Corner className="right-0 top-0 rounded-tr-lg border-r border-t" />
        <Corner className="bottom-0 left-0 rounded-bl-lg border-b border-l" />
        <Corner className="bottom-0 right-0 rounded-br-lg border-b border-r" />

        <div
          className="relative overflow-hidden rounded-[22px] border border-slate-400/14 backdrop-blur-[16px]"
          style={{ background: "linear-gradient(150deg, rgba(37,99,235,0.13), rgba(11,15,24,0.78))" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #2563eb 22%, #7dd3fc 50%, #2563eb 78%, transparent)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse 90% 80% at 50% 0%, #000, transparent 76%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 0%, #000, transparent 76%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[170px] left-1/2 h-[400px] w-[520px] -translate-x-1/2"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.16), transparent 66%)" }}
          />

          <div className="relative flex items-center justify-between gap-[18px] border-b border-slate-400/12 px-5 py-5 sm:px-[34px]">
            <div className="flex items-center gap-[11px] font-mono text-[9.5px] tracking-[0.24em] text-accent-soft">
              <span className="h-[6px] w-[6px] animate-cx-pulse rounded-full bg-accent shadow-[0_0_9px_#38bdf8]" />
              SECURE LINE ACTIVE
            </div>
            <span className="hidden font-mono text-[9.5px] tracking-[0.24em] text-ghost sm:inline">CX / TRANSMIT</span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="relative grid gap-[22px] px-5 pb-8 pt-7 sm:px-[34px] sm:pb-10 sm:pt-9">
            <div className="grid gap-[22px] md:grid-cols-2">
              <Field
                id="cx-name"
                label="IDENTIFIER"
                type="text"
                name="from_name"
                required
                autoComplete="name"
                placeholder="Your name"
                value={form.from_name}
                onChange={onChange}
              />
              <Field
                id="cx-email"
                label="RETURN_ADDRESS"
                type="email"
                name="from_email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={form.from_email}
                onChange={onChange}
              />
            </div>
            <Field
              id="cx-message"
              label="PAYLOAD"
              as="textarea"
              name="message"
              required
              rows={5}
              placeholder="What are you building?"
              value={form.message}
              onChange={onChange}
              className="resize-y leading-[1.65]"
            />

            <AnimatePresence>
              {status && (
                <motion.div
                  key={status.message}
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className={cx(
                    "rounded-xl border px-[18px] py-[15px] font-mono text-[11px] leading-[1.6] tracking-[0.1em]",
                    status.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-300"
                      : "border-red-500/30 bg-red-500/8 text-red-300"
                  )}
                >
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            <Magnetic
              as="button"
              type="submit"
              disabled={loading}
              className="cx-btn-primary w-full px-[30px] py-[18px] font-sans text-sm tracking-[0.04em] disabled:cursor-wait disabled:opacity-60"
            >
              <span>{loading ? "Transmitting…" : "Send message"}</span>
              {loading ? (
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0.3s]" />
                </span>
              ) : (
                <i className="ri-arrow-right-up-line" aria-hidden="true" />
              )}
            </Magnetic>
          </form>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="ul" delay={0.15} className="m-0 mt-[46px] flex list-none flex-wrap justify-center gap-8 p-0 sm:gap-10">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.name}>
            <Magnetic
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={link.name}
              className="group/social inline-flex flex-col items-center gap-3"
            >
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-slate-400/18 bg-white/[0.03] text-[21px] text-slate-400 transition-[border-color,color,background-color,box-shadow,transform] duration-400 ease-out-expo group-hover/social:-translate-y-1 group-hover/social:border-accent-mid/60 group-hover/social:bg-accent-deep/15 group-hover/social:text-accent-soft group-hover/social:shadow-[0_16px_30px_-14px_rgba(56,189,248,0.7)]">
                <i className={link.icon} aria-hidden="true" />
              </span>
              <span className="font-mono text-[9px] tracking-[0.26em] text-[#5b677a] transition-colors duration-400 group-hover/social:text-fg">
                {link.name}
              </span>
            </Magnetic>
          </li>
        ))}
      </RevealOnScroll>
    </section>
  );
};
