import { useEffect } from "react";
import { scrollToSection } from "../utils/scroll";

/**
 * Intercepts clicks on any in-page `<a href="#id">` and runs the shared
 * eased scroll instead of the browser jump, updating the hash without
 * adding history entries.
 */
export const useAnchorNav = () => {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash.length < 2 || !document.getElementById(hash.slice(1))) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      scrollToSection(hash.slice(1));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
};
