import { TESTIMONIALS } from "../../constants";
import { RevealOnScroll } from "../ui/RevealOnScroll";
import { Scramble } from "../ui/Scramble";
import { Icon } from "../ui/Icon";

/** Short quotes from the people the systems were built for. */
export const Signals = () => (
  <section aria-labelledby="signals-heading" className="cx-container pb-16 md:pb-[110px]">
    <RevealOnScroll className="cx-section-head pb-[22px]">
      <h2 id="signals-heading" className="m-0 font-sans font-bold tracking-[-0.028em] text-fg" style={{ fontSize: "clamp(24px, 2.4vw, 34px)" }}>
        Signals
      </h2>
      <Scramble text="FROM THE FIELD" className="font-mono text-[10px] tracking-[0.24em] text-[#5b677a]" />
    </RevealOnScroll>

    <ul className="m-0 mt-5 grid list-none gap-4 p-0 md:mt-[30px] md:grid-cols-2 md:gap-5">
      {TESTIMONIALS.map((t, i) => (
        <RevealOnScroll as="li" key={t.quote} delay={i * 0.08}>
          <figure className="group/quote relative m-0 h-full overflow-hidden rounded-2xl border border-slate-400/13 bg-panel/70 p-5 sm:p-7 transition-[border-color,box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent-mid/35 hover:shadow-[0_30px_70px_-45px_rgba(37,99,235,0.8)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-0 transition-opacity duration-700 group-hover/quote:opacity-100"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.18), transparent 66%)" }}
            />
            <Icon name="ri-double-quotes-l" className="text-[24px] leading-none sm:text-[28px] text-accent-mid/70 transition-transform duration-500 ease-out-expo group-hover/quote:-translate-y-1 group-hover/quote:scale-110" />
            <blockquote className="m-0 mt-2 text-[15px] leading-[1.68] text-slate-200 text-pretty sm:mt-3 sm:text-[15.5px] sm:leading-[1.7]">{t.quote}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-400/10 pt-4 sm:mt-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-mid/30 bg-accent-deep/15 font-sans text-[12px] font-bold text-accent-soft">
                {t.author.charAt(0)}
              </span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-fg">{t.author}</div>
                <div className="mt-[2px] font-mono text-[9.5px] tracking-[0.18em] text-dim">
                  {t.org.toUpperCase()} · {t.project}
                </div>
              </div>
            </figcaption>
          </figure>
        </RevealOnScroll>
      ))}
    </ul>
  </section>
);
