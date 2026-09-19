import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Absolute origin for Open Graph / canonical URLs. VITE_SITE_URL wins; on
// Vercel the project's production domain (system env, VITE_-prefixed by
// Vercel) is used, so renaming the domain needs no code change. Unset -> ""
// and the tags fall back to root-relative paths that still work locally.
const siteOrigin = (env) => {
  if (env.VITE_SITE_URL) return env.VITE_SITE_URL.replace(/\/$/, "");
  const vercel = env.VITE_VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : "";
};

const siteUrl = (env) => ({
  name: "cx-site-url",
  transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteOrigin(env)),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss(), siteUrl(env)],
    base: "/",
  };
});
