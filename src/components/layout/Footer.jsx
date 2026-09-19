import { BRAND, RAIL_LINKS, RESUME_LINK, SOCIAL_LINKS } from "../../constants";
import { LogoMark } from "../ui/Logo";
import { Magnetic } from "../ui/Magnetic";
import { scrollToTop } from "../../utils/scroll";

const FooterLink = ({ href, icon, children, ...rest }) => (
  <a
    href={href}
    className="group/fl flex items-center gap-3 py-[7px] text-[13.5px] text-muted transition-colors duration-300 hover:text-fg"
    {...rest}
  >
    {icon ? (
      <i className={`${icon} w-4 text-[15px] text-accent-mid transition-transform duration-400 ease-out-expo group-hover/fl:scale-110`} aria-hidden="true" />
    ) : (
      <span className="h-px w-3 bg-slate-400/40 transition-[width,background-color] duration-400 ease-out-expo group-hover/fl:w-5 group-hover/fl:bg-accent" aria-hidden="true" />
    )}
    <span className="transition-transform duration-400 ease-out-expo group-hover/fl:translate-x-0.5">{children}</span>
  </a>
);

export const Footer = () => (
  <footer className="relative border-t border-slate-400/10">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.45) 50%, transparent)" }}
    />
    <div className="cx-container grid gap-10 pb-10 pt-14 md:grid-cols-[1.3fr_0.7fr_0.8fr] md:gap-8">
      <div>
        <a href="#top" className="group inline-flex items-center gap-3" aria-label={`${BRAND.name} — back to top`}>
          <LogoMark size={34} className="transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-105" />
          <span className="font-sans text-[14px] font-bold tracking-[0.30em] text-fg">{BRAND.name}</span>
        </a>
        <p className="m-0 mt-4 max-w-[38ch] text-[14px] leading-[1.7] text-muted text-pretty">{BRAND.tagline}</p>
        <div className="mt-5 inline-flex items-center gap-[10px] rounded-full border border-emerald-400/25 bg-emerald-400/8 px-3 py-[6px] font-mono text-[9.5px] tracking-[0.2em] text-emerald-300">
          <span className="h-[6px] w-[6px] animate-cx-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          OPEN TO WORK
        </div>
      </div>

      <nav aria-label="Footer">
        <div className="cx-label mb-3 text-dim">NAVIGATE</div>
        {RAIL_LINKS.map((l) => (
          <FooterLink key={l.id} href={`#${l.id}`}>
            {l.name}
          </FooterLink>
        ))}
      </nav>

      <div>
        <div className="cx-label mb-3 text-dim">CONNECT</div>
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

    <div className="border-t border-slate-400/8">
      <div className="cx-container flex flex-col items-start gap-4 py-6 font-mono text-[10px] tracking-[0.22em] text-[#5b677a] md:flex-row md:items-center md:justify-between">
        <span>
          {BRAND.name} &copy; {BRAND.year} · DESIGNED &amp; ENGINEERED IN {BRAND.location.split(",")[0].toUpperCase()}
        </span>
        <Magnetic
          as="button"
          type="button"
          strength={6}
          onClick={scrollToTop}
          className="group/top inline-flex items-center gap-3 rounded-full border border-slate-400/16 px-4 py-2 text-[9.5px] tracking-[0.22em] text-slate-300 transition-[border-color,background-color,color] duration-300 hover:border-accent-mid/50 hover:bg-accent-deep/10 hover:text-white"
        >
          BACK TO TOP
          <i className="ri-arrow-up-line text-[13px] transition-transform duration-400 ease-out-expo group-hover/top:-translate-y-0.5" aria-hidden="true" />
        </Magnetic>
      </div>
    </div>
  </footer>
);
