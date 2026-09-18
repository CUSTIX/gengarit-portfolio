import { BRAND } from "../../constants";
import { LogoMark } from "../ui/Logo";
import { Magnetic } from "../ui/Magnetic";
import { scrollToTop } from "../../utils/scroll";

export const Footer = () => (
  <footer className="border-t border-slate-400/10">
    <div className="cx-container flex flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between md:gap-6">
      <Magnetic
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}
        aria-label="Back to top"
        className="group flex items-center gap-3"
      >
        <LogoMark
          size={30}
          variant="mono"
          className="transition-[transform,filter] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:brightness-150"
        />
        <span className="font-mono text-[10px] tracking-[0.22em] text-[#5b677a] transition-colors duration-400 group-hover:text-fg">
          {BRAND.name} &copy; {BRAND.year}
        </span>
      </Magnetic>
      <span className="font-mono text-[10px] tracking-[0.22em] text-ghost">
        DESIGNED &amp; ENGINEERED IN {BRAND.location.split(",")[0].toUpperCase()}
      </span>
    </div>
  </footer>
);
