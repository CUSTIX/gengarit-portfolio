# CUSTIX — Portfolio of John Eric G. Bayer

Single-page portfolio built with React 19, Vite 7, Tailwind CSS v4, Framer Motion, and three.js.
The visual design is the "CUSTIX Portfolio" Claude Design hand-off (dark navy, Sora + JetBrains Mono, blue accent ramp).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve dist/ locally
npm run lint
npm run test:e2e # headless smoke test against dist/ (run build first)
```

## Environment

Create `.env` (never committed) with:

```
VITE_SERVICE_ID=...       # EmailJS service id   (falls back to the shipped public id)
VITE_TEMPLATE_ID=...      # EmailJS template id
VITE_PUBLIC_KEY=...       # EmailJS public key
VITE_GEMINI_API_KEY=...   # optional: enables the Gemini-backed assistant
VITE_GEMINI_MODEL=...     # optional: defaults to gemini-2.5-flash
```

Without a Gemini key the assistant answers from the keyword FAQ in `src/constants/index.js`.
Vite inlines every `VITE_*` value into the client bundle, so restrict the Gemini key by HTTP referrer
(or move the call behind a serverless function before relying on it in production).

## Structure

```
src/
├─ App.jsx                      page shell: backdrop, intro, nav, rail, palette, sections, assistant
├─ index.css                    design tokens (@theme), primitives (.cx-*), intro keyframes
├─ constants/index.js           all copy and data (brand, case study, archive, stack, timeline, links)
├─ context/                     intro-finished flag; command palette opener
├─ hooks/
│  ├─ useActiveSection.js       scrollspy (nav + rail)
│  ├─ useAnchorNav.js           eased in-page scrolling for every #anchor
│  ├─ useChatbot.js             Gemini chat (@google/genai) with FAQ fallback
│  └─ useMediaQuery.js
├─ components/
│  ├─ layout/    Navbar (sticky + mobile menu + progress), SideRail, LoadingScreen (intro), Footer
│  ├─ sections/  Home (hero + 3D mark), About, Stack, Projects (case study + archive), Path, Contact
│  ├─ features/  ParticleEffect (starfield), HeroMark (three.js, lazy), CommandPalette, Chatbot*
│  └─ ui/        Logo, RevealOnScroll, Parallax, Scramble, Magnetic, FollowCursor, ErrorBoundary
└─ utils/        cx (class join), motion (easing), scroll (tween + nav offset)
scripts/smoke.cjs               end-to-end smoke test (Playwright + system Chromium)
public/icons/                   self-hosted Devicon SVGs for the Stack tiles
public/og.png                   1200×630 share card
```

Section anchors: `#top`, `#about`, `#stack`, `#work`, `#path`, `#contact`. Press ⌘K / Ctrl+K for the command palette.
