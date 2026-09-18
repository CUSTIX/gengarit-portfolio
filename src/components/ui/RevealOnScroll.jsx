import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useIntroReady } from "../../context/intro";
import { EASE_OUT_EXPO } from "../../utils/motion";

const variants = {
  hidden: (y) => ({ opacity: 0, y }),
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade-and-rise an element into view once, when it enters the viewport.
 * Waits for the intro overlay to finish so above-the-fold content doesn't
 * animate while hidden.
 *
 * @param {object} props
 * @param {keyof JSX.IntrinsicElements} [props.as] wrapper tag (default div)
 * @param {number} [props.delay] seconds; use to stagger siblings
 * @param {number} [props.y] initial vertical offset in px
 */
export const RevealOnScroll = ({ as = "div", delay = 0, y = 26, className, children, ...rest }) => {
  const ref = useRef(null);
  const ready = useIntroReady();
  const inView = useInView(ref, { once: true, amount: 0.12, margin: "0px 0px -8% 0px" });
  const Tag = useMemo(() => motion.create(as), [as]);

  return (
    <Tag
      ref={ref}
      custom={y}
      variants={variants}
      initial="hidden"
      animate={ready && inView ? "visible" : "hidden"}
      transition={{ duration: 0.85, ease: EASE_OUT_EXPO, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
};
