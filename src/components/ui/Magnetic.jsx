import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Makes its element lean toward the cursor (a few px) while hovered and
 * spring back on leave. Pointer-only: touch devices never fire mousemove.
 *
 * @param {object} props
 * @param {keyof JSX.IntrinsicElements} [props.as] rendered tag (default "a")
 * @param {number} [props.strength] max horizontal shift in px
 */
export const Magnetic = ({ as: Tag = "a", strength = 9, className, children, style, ...rest }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const onMouseEnter = (e) => {
    rest.onMouseEnter?.(e);
    if (reduced || !ref.current) return;
    ref.current.style.transition = "transform 0.18s ease-out";
  };

  const onMouseMove = (e) => {
    rest.onMouseMove?.(e);
    const el = ref.current;
    if (reduced || !el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate3d(${(dx * strength).toFixed(2)}px, ${(dy * strength * 0.78).toFixed(2)}px, 0)`;
  };

  const onMouseLeave = (e) => {
    rest.onMouseLeave?.(e);
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ willChange: "transform", ...style }}
      {...rest}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Tag>
  );
};
