import { useEffect, useState } from "react";

/**
 * Scrollspy: the active section is the last one whose top has crossed a
 * probe line 28% down the viewport. Shared by the top nav and the side rail.
 *
 * @param {string[]} ids section element ids in document order
 */
export const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let raf = 0;
    let last = null;

    const compute = () => {
      raf = 0;
      const probe = window.innerHeight * 0.28;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = id;
        else break;
      }
      if (current !== last) {
        last = current;
        setActive(current);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    compute();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [ids]);

  return active;
};
