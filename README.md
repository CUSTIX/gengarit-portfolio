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
npm run resume   # regenerate public/resume-custix.pdf from the site data
```

CI (`.github/workflows/ci.yml`) runs lint, build, the smoke test, and Lighthouse budgets on every push.

## Environment

Create `.env` (never committed) with:

```
VITE_SERVICE_ID=...       # EmailJS service id   (falls back to the shipped public id)
VITE_TEMPLATE_ID=...      # EmailJS template id
VITE_PUBLIC_KEY=...       # EmailJS public key
VITE_SITE_URL=...         # absolute origin, makes OG/canonical URLs absolute
GEMINI_API_KEY=...        # server-side key used by api/chat.js on Vercel (preferred)
VITE_GEMINI_API_KEY=...   # dev-only browser fallback (ships in the bundle)
VITE_GEMINI_MODEL=...     # optional: defaults to gemini-2.5-flash
```

The assistant tries `/api/chat` (Vercel function, key stays server-side), then the dev-only browser
key, then the keyword FAQ in `src/constants/index.js` — so it always answers something.

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
api/chat.js                     Vercel function: Gemini proxy with input caps + rate limit
scripts/smoke.cjs               end-to-end smoke test (Playwright + system Chromium)
scripts/resume.cjs              one-page PDF résumé generated from constants
public/icons/                   self-hosted Devicon SVGs for the Stack tiles
public/og.png                   1200×630 share card
```

Section anchors: `#top`, `#about`, `#stack`, `#work`, `#path`, `#contact`. Keyboard: ⌘K / Ctrl+K palette, `?` shortcuts sheet, Esc closes.
