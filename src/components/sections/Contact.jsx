import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "emailjs-com";
import { CONTACT, RESUME_LINK, SOCIAL_LINKS } from "../../constants";
import { Magnetic } from "../ui/Magnetic";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";
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

const Field = ({ id, label, as: Tag = "input", className, ...rest }) => (
  <div className="cx-field-wrap grid gap-[11px]">
    <label htmlFor={id} className="cx-field-label font-mono text-[9.5px] font-semibold tracking-[0.24em] text-accent-soft transition-colors duration-300">
      {label}
    </label>
    <Tag id={id} className={cx("cx-field", className)} {...rest} />
  </div>
);

const LinkRow = ({ href, icon, children, ...rest }) => (
  <Magnetic
    href={href}
    strength={4}
    className="group/row flex items-center gap-[13px] border-b border-slate-400/10 py-[13px] text-[13.5px] text-slate-300 transition-colors duration-300 hover:text-white"
    {...rest}
  >
    <i className={`${icon} w-5 text-[17px] text-accent-mid transition-transform duration-400 ease-out-expo group-hover/row:scale-110`} aria-hidden="true" />
    {children}
    <i
      className="ri-arrow-right-up-line ml-auto text-sm text-ghost transition-[color,transform] duration-400 ease-out-expo group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-accent-soft"
      aria-hidden="true"
    />
  </Magnetic>
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
    <section id="contact" aria-labelledby="contact-heading" className="cx-container pb-[84px] pt-5 md:pb-[120px]">
      <RevealOnScroll className="cx-section-head">
        <h2 id="contact-heading" className="cx-h2">
          {CONTACT.heading}
        </h2>
        <Scramble text={CONTACT.meta} className="font-mono text-[10px] tracking-[0.24em] text-[#5b677a]" />
      </RevealOnScroll>

      <RevealOnScroll delay={0.08} className="mt-12 grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div>
          <h3 className="m-0 text-[27px] font-bold leading-[1.24] tracking-[-0.028em] text-fg-bright text-balance">{CONTACT.title}</h3>
          <p className="m-0 mt-5 text-[15.5px] leading-[1.74] text-muted text-pretty">{CONTACT.blurb}</p>
          <div className="mt-[30px] flex items-center gap-[11px] text-[13.5px] text-accent-soft">
            <span className="h-[7px] w-[7px] animate-cx-pulse rounded-full bg-accent shadow-[0_0_10px_#38bdf8]" />
            {CONTACT.replyNote}
          </div>
          <div className="mt-9 grid">
            {SOCIAL_LINKS.map((link) => (
              <LinkRow key={link.name} href={link.url} icon={link.icon} target="_blank" rel="noreferrer">
                {link.name}
              </LinkRow>
            ))}
            <LinkRow href={RESUME_LINK.url} icon={RESUME_LINK.icon} target="_blank" rel="noreferrer">
              {RESUME_LINK.name}
            </LinkRow>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[22px] border border-slate-400/14 transition-[border-color,box-shadow] duration-500 focus-within:border-accent-mid/35 focus-within:shadow-[0_30px_80px_-50px_rgba(37,99,235,0.7)]"
          style={{ background: "linear-gradient(155deg, rgba(37,99,235,0.14), rgba(11,15,24,0.92))" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-[180px] h-[360px] w-[420px]"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.14), transparent 68%)" }}
          />
          <form ref={formRef} onSubmit={handleSubmit} className="relative grid gap-[30px] p-[26px_20px_28px] sm:p-[30px_24px_32px] lg:p-[42px_40px_40px]">
            <div className="grid gap-[30px] md:grid-cols-2">
              <Field id="cx-name" label="YOUR NAME" type="text" name="from_name" required autoComplete="name" placeholder="Jane Mercado" value={form.from_name} onChange={onChange} />
              <Field id="cx-email" label="EMAIL" type="email" name="from_email" required autoComplete="email" placeholder="jane@company.com" value={form.from_email} onChange={onChange} />
            </div>
            <Field
              id="cx-message"
              label="MESSAGE"
              as="textarea"
              name="message"
              required
              rows={4}
              placeholder="What are you building?"
              value={form.message}
              onChange={onChange}
              className="min-h-[92px] resize-y leading-[1.7]"
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
                    "rounded-xl border px-[18px] py-[15px] text-[13px] leading-[1.6]",
                    status.type === "success" ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-300" : "border-red-500/30 bg-red-500/8 text-red-300"
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
              className="cx-btn-primary justify-self-start px-8 py-[17px] font-sans text-sm tracking-[0.03em] disabled:cursor-wait disabled:opacity-60"
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
    </section>
  );
};
