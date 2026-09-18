// The CUSTIX mark: a white "C" arc and a gradient "X". Gradients are shared
// SVG defs rendered once by <LogoDefs /> in App so every mark on the page
// can reference url(#cxg) / url(#cxw).

export const LogoDefs = () => (
  <svg width="0" height="0" className="absolute overflow-hidden" aria-hidden="true">
    <defs>
      <linearGradient id="cxg" x1="95" y1="30" x2="176" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#7dd3fc" />
        <stop offset="0.5" stopColor="#2f80f5" />
        <stop offset="1" stopColor="#1d3fd0" />
      </linearGradient>
      <linearGradient id="cxw" x1="20" y1="30" x2="110" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#c3cddd" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * @param {object} props
 * @param {number} [props.size] rendered width in px (height follows the 200x140 viewBox)
 * @param {"color"|"mono"} [props.variant] "mono" is the muted footer version
 * @param {string} [props.className]
 */
export const LogoMark = ({ size = 38, variant = "color", className = "" }) => {
  const mono = variant === "mono";
  const height = Math.round((size * 140) / 200);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 200 140"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M 88.9 43.1 A 38 38 0 1 0 88.9 96.9" stroke={mono ? "#8b95a8" : "#ffffff"} strokeWidth="25" />
      <path d="M 96 33 L 172 107" stroke={mono ? "#3b82f6" : "url(#cxg)"} strokeWidth="23" />
      <path d="M 172 33 L 96 107" stroke={mono ? "#3b82f6" : "url(#cxg)"} strokeWidth="23" />
    </svg>
  );
};
