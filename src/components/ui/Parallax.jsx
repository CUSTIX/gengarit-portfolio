import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Scroll parallax. In-flow elements drift against the scroll direction by
 * `speed` × their distance from the viewport centre; `fixed` elements
 * (background blobs) drift by `speed` × scrollY. Off below 900px and for
 * reduced-motion users, matching the hand-off.
 *
 * @param {object} props
 * @param {number} props.speed e.g. 0.045; negative reverses direction
 * @param {boolean} [props.fixed] element is position: fixed
 * @param {keyof JSX.IntrinsicElements} [props.as]
 */
export const Parallax = ({ speed, fixed = false, as = "div", className, style, children, ...rest }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");
  const enabled = wide && !reduced;
  const Tag = useMemo(() => motion.create(as), [as]);

  const { scrollY, scrollYProgress } = useScroll(fixed ? undefined : { target: ref, offset: ["start end", "end start"] });

  // viewport height + element height: the distance an element travels
  // between entering at the bottom and leaving at the top.
  const span = useMotionValue(0);
  useEffect(() => {
    if (fixed) return;
    const el = ref.current;
    if (!el) return;
    const measure = () => span.set(window.innerHeight + el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [fixed, span]);

  const flowY = useTransform([scrollYProgress, span], ([p, s]) => (p - 0.5) * s * speed);
  const fixedY = useTransform(scrollY, (v) => v * speed);
  const smooth = useSpring(fixed ? fixedY : flowY, { stiffness: 120, damping: 26, mass: 0.6 });

  return (
    <Tag ref={ref} className={className} style={{ ...style, y: enabled ? smooth : 0 }} {...rest}>
      {children}
    </Tag>
  );
};
