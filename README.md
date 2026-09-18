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
Vite inlines every `VITE_*` value into the client bundle, so restrict the Gemini key by HTTP referrer.

## Structure

```
src/
├─ App.jsx                      page shell: backdrop, intro, nav, sections, assistant
├─ index.css                    design tokens (@theme), primitives (.cx-*), intro keyframes
├─ constants/index.js           all copy and data (brand, projects, stack, timeline, socials)
├─ context/intro.js             "intro finished" flag that gates scroll reveals
├─ hooks/
│  ├─ useActiveSection.js       nav highlight via IntersectionObserver
│  └─ useChatbot.js             Gemini chat with FAQ fallback
├─ components/
│  ├─ layout/    Navbar (sticky + mobile menu + scroll progress), LoadingScreen (intro), Footer
│  ├─ sections/  Home (hero), Projects (featured + archive), About, Stack, Path, Contact
│  ├─ features/  ParticleEffect (filament canvas), HeroMark (three.js, lazy), Chatbot*
│  └─ ui/        Logo, RevealOnScroll, Magnetic, TiltCard, FollowCursor, ErrorBoundary
└─ utils/        cx (class join), motion (easing), scroll
```

Section anchors: `#top`, `#work`, `#about`, `#stack`, `#path`, `#contact`.
