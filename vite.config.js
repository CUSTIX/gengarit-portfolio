import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Replaces __SITE_URL__ in index.html with VITE_SITE_URL (no trailing slash)
// so Open Graph / canonical URLs are absolute in production. Unset -> "" so
// the tags fall back to root-relative paths and still work locally.
const siteUrl = (env) => ({
  name: "cx-site-url",
  transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", (env.VITE_SITE_URL || "").replace(/\/$/, "")),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss(), siteUrl(env)],
    base: "/",
  };
});
