import { useCallback, useEffect, useRef, useState } from "react";

/** Clipboard write with a short "copied" flag for feedback. */
export const useCopy = (resetMs = 1800) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Older browsers / insecure contexts: fall back to a hidden textarea.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    },
    [resetMs]
  );

  useEffect(() => () => clearTimeout(timer.current), []);
  return { copied, copy };
};
