import { useEffect, useState } from "react";

/**
 * Tracks which section is "current" for nav highlighting. A section is
 * active while it crosses a band around 35–45% down the viewport, so the
 * highlight flips roughly when a heading reaches the reader's eye line.
 *
 * @param {string[]} ids section element ids in document order
 */
export const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;

    const intersecting = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        const first = ids.find((id) => intersecting.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
};
