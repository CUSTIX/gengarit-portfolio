// The page scrolls the window (not an inner container), so native #hash
// anchors work. These helpers exist for programmatic scrolls (mobile menu,
// footer "back to top") and respect `section[id] { scroll-margin-top }`.
export const scrollToSection = (id) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
