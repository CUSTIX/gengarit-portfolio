import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useIntroReady } from "../../context/intro";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const KEEP = new Set([" ", "/", "—", "-", "+"]);

/**
 * "Decrypts" a short mono label when it scrolls into view: characters
 * resolve left to right from random glyphs over ~14 frames.
 */
export const Scramble = ({ text, className, as: Tag = "span" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const ready = useIntroReady();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? text : text.replace(/[^ /—+-]/g, " "));

  useEffect(() => {
    if (reduced) return;
    if (!inView || !ready) return;
    const total = 14;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (KEEP.has(ch)) out += ch;
        else out += frame / total > i / text.length + 0.15 ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setShown(frame >= total ? text : out);
      if (frame >= total) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [inView, ready, reduced, text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {shown}
    </Tag>
  );
};
