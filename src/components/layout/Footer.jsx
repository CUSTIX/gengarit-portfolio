import { BRAND, RAIL_LINKS, RESUME_LINK, SOCIAL_LINKS } from "../../constants";
import { LogoMark } from "../ui/Logo";
import { Magnetic } from "../ui/Magnetic";
import { scrollToTop } from "../../utils/scroll";
import { useSound } from "../../context/sound";
import { Icon } from "../ui/Icon";
import { cx } from "../../utils/cx";

const FooterLink = ({ href, icon, children, ...rest }) => (
  <a
    href={href}
    className="group/fl flex items-center gap-2 text-muted transition-colors duration-300 hover:text-fg max-md:min-h-[40px] max-md:rounded-full max-md:border max-md:border-slate-400/14 max-md:bg-panel/60 max-md:px-[14px] max-md:text-[12.5px] max-md:hover:border-accent-mid/40 md:gap-3 md:py-[7px] md:text-[13.5px]"
    {...rest}
  >
    {icon ? (
      <Icon name={icon} className="w-4 text-[15px] text-accent-mid transition-transform duration-400 ease-out-expo group-hover/fl:scale-110" />
    ) : (
      <span className="h-px w-3 bg-slate-400/40 transition-[width,background-color] duration-400 ease-out-expo group-hover/fl:w-5 group-hover/fl:bg-accent max-md:hidden" aria-hidden="true" />
    )}
    <span className="transition-transform duration-400 ease-out-expo group-hover/fl:translate-x-0.5">{children}</span>
  </a>
);

export const Footer = () => {
  const sound = useSound();
  return (
  <footer className="relative border-t border-slate-400/10">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.45) 50%, transparent)" }}
    />
    <div className="cx-container grid gap-8 pb-8 pt-10 md:grid-cols-[1.3fr_0.7fr_0.8fr] md:gap-8 md:pb-10 md:pt-14">
      <div>
        <a href="#top" className="group inline-flex items-center gap-3" aria-label={`${BRAND.name} — back to top`}>
          <LogoMark size={34} className="transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-105" />
          <span className="font-sans text-[14px] font-bold tracking-[0.30em] text-fg">{BRAND.name}</span>
        </a>
        <p className="m-0 mt-3 max-w-[38ch] text-[13.5px] leading-[1.7] text-muted text-pretty md:mt-4 md:text-[14px]">{BRAND.tagline}</p>
        <div className="mt-5 inline-flex items-center gap-[10px] rounded-full border border-emerald-400/25 bg-emerald-400/8 px-3 py-[6px] font-mono text-[9.5px] tracking-[0.2em] text-emerald-300">
          <span className="h-[6px] w-[6px] animate-cx-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          OPEN TO WORK
        </div>
      </div>

      <nav aria-label="Footer">
        <div className="cx-label mb-3 text-dim">NAVIGATE</div>
        {/* chip cloud on phones, plain list from md up */}
        <div className="flex flex-wrap gap-2 md:block">
          {RAIL_LINKS.map((l) => (
            <FooterLink key={l.id} href={`#${l.id}`}>
              {l.name}
            </FooterLink>
          ))}
        </div>
      </nav>

      <div>
        <div className="cx-label mb-3 text-dim">CONNECT</div>
        <div className="flex flex-wrap gap-2 md:block">
          <FooterLink href={`mailto:${BRAND.email}`} icon="ri-mail-line">
            {BRAND.email}
          </FooterLink>
          {SOCIAL_LINKS.map((s) => (
            <FooterLink key={s.name} href={s.url} icon={s.icon} target="_blank" rel="noreferrer">
              {s.name}
            </FooterLink>
          ))}
          <FooterLink href={RESUME_LINK.url} icon={RESUME_LINK.icon} target="_blank" rel="noreferrer">
            {RESUME_LINK.name}
          </FooterLink>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-400/8">
      <div className="cx-container flex flex-col items-start gap-3 py-5 font-mono md:py-6 text-[10px] tracking-[0.22em] text-[#5b677a] md:flex-row md:items-center md:justify-between">
        <span>
          {BRAND.name} &copy; {BRAND.year} · DESIGNED &amp; ENGINEERED IN {BRAND.location.split(",")[0].toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={sound.toggle}
          aria-pressed={sound.enabled}
          aria-label={sound.enabled ? "Turn interface sounds off" : "Turn interface sounds on"}
          title={sound.enabled ? "Sounds on" : "Sounds off"}
          className={cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-[border-color,background-color,color] duration-300",
            sound.enabled ? "border-accent-mid/50 bg-accent-deep/15 text-accent-soft" : "border-slate-400/16 text-slate-400 hover:border-accent-mid/40 hover:text-slate-200"
          )}
        >
          <Icon name={sound.enabled ? "ri-volume-up-line" : "ri-volume-mute-line"} className="text-[15px]" />
        </button>
        <Magnetic
          as="button"
          type="button"
          strength={6}
          onClick={scrollToTop}
          className="group/top inline-flex items-center gap-3 rounded-full border border-slate-400/16 px-4 py-2 text-[9.5px] tracking-[0.22em] text-slate-300 transition-[border-color,background-color,color] duration-300 hover:border-accent-mid/50 hover:bg-accent-deep/10 hover:text-white"
        >
          BACK TO TOP
          <Icon name="ri-arrow-up-line" className="text-[13px] transition-transform duration-400 ease-out-expo group-hover/top:-translate-y-0.5" />
        </Magnetic>
        </div>
      </div>
    </div>
  </footer>
  );
};
