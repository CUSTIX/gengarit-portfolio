import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cx } from "../../utils/cx";

/**
 * Card that tilts a few degrees toward the cursor (3D perspective) and
 * settles back with a spring. Children with `translate-z-*` transforms pop
 * forward because the card preserves 3D.
 */
export const TiltCard = ({ className, children, maxTilt = 5, ...rest }) => {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 180, damping: 22, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxTilt * 0.8, -maxTilt * 0.8]), spring);

  const onMouseMove = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cx("group/tilt will-change-transform", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
