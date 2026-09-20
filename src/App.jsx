import { useCallback, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { ChatbotButton } from "./components/features/ChatbotButton";
import { ChatbotModal } from "./components/features/ChatbotModal";
import { CommandPalette } from "./components/features/CommandPalette";
import { ShortcutsHelp } from "./components/features/ShortcutsHelp";
import { Analytics } from "@vercel/analytics/react";
import { ParticleEffect } from "./components/features/ParticleEffect";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import { Navbar } from "./components/layout/Navbar";
import { SideRail } from "./components/layout/SideRail";
import { Footer } from "./components/layout/Footer";
import { FollowCursor } from "./components/ui/FollowCursor";
import { LogoDefs } from "./components/ui/Logo";
import { Parallax } from "./components/ui/Parallax";
import { Marquee } from "./components/ui/Marquee";
import { Home } from "./components/sections/Home";
import { About } from "./components/sections/About";
import { Stack } from "./components/sections/Stack";
import { Projects } from "./components/sections/Projects";
import { Signals } from "./components/sections/Signals";
import { Path } from "./components/sections/Path";
import { Contact } from "./components/sections/Contact";
import { IntroContext } from "./context/intro";
import { PaletteContext } from "./context/palette";
import { useActiveSection } from "./hooks/useActiveSection";
import { useAnchorNav } from "./hooks/useAnchorNav";
import { useChatbot } from "./hooks/useChatbot";
import { useUISounds } from "./hooks/useUISounds";
import { useCopy } from "./hooks/useCopy";
import { Toast } from "./components/ui/Toast";
import { BRAND } from "./constants";
import { SoundContext } from "./context/sound";
import { DEPLOYED_FOR, SECTIONS } from "./constants";
import { cx } from "./utils/cx";
import { scrollToSection } from "./utils/scroll";

const INTRO_SEEN_KEY = "cx-intro-seen";
const introAlreadySeen = () => {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

/** Fixed ambient layers behind everything: color washes and two drifting blobs. */
const Backdrop = () => (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(900px circle at 18% 12%, rgba(37,99,235,0.16), transparent 62%), radial-gradient(760px circle at 88% 72%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(600px circle at 50% 108%, rgba(29,78,216,0.12), transparent 60%)",
      }}
    />
    <Parallax
      fixed
      speed={-0.09}
      aria-hidden="true"
      className="pointer-events-none fixed left-[6%] top-[14%] z-0 hidden h-[340px] w-[340px] rounded-full blur-[2px] md:block"
      style={{ background: "radial-gradient(circle, rgba(37,99,235,0.14), transparent 70%)" }}
    />
    <Parallax
      fixed
      speed={0.12}
      aria-hidden="true"
      className="pointer-events-none fixed right-[4%] top-[55%] z-0 hidden h-[280px] w-[280px] rounded-full md:block"
      style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)" }}
    />
  </>
);

function App() {
  const reduced = useReducedMotion();
  // The intro plays once per browser session; reduced-motion users skip it.
  const [introDone, setIntroDone] = useState(() => Boolean(reduced) || introAlreadySeen());
  // Page entrance, decided once: wait for the intro, or fade in right away
  // when it is skipped. Never toggled later (that would cut the animation).
  const [pageIn] = useState(() => (reduced ? "" : introDone ? "cx-page-in-now" : "cx-page-in"));
  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* storage unavailable: the intro simply replays next load */
    }
    setIntroDone(true);
  }, []);

  // Deep links (/#work): the intro locks scrolling before the browser can
  // jump, so apply the hash ourselves once the page is interactive.
  useEffect(() => {
    if (!introDone) return;
    const id = window.location.hash.slice(1);
    if (!id || !document.getElementById(id)) return;
    const t = setTimeout(() => scrollToSection(id), 120);
    return () => clearTimeout(t);
  }, [introDone]);

  const activeSection = useActiveSection(SECTIONS);
  useAnchorNav();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const [helpOpen, setHelpOpen] = useState(false);
  const closeHelp = useCallback(() => setHelpOpen(false), []);
  useEffect(() => {
    const typing = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setHelpOpen(false);
        setPaletteOpen((v) => !v);
      } else if (e.key === "?" && !typing(document.activeElement) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPaletteOpen(false);
        setHelpOpen((v) => !v);
      } else if (e.key === "Escape") {
        setHelpOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sounds = useUISounds();
  const modalOpen = paletteOpen || helpOpen;
  const { copied, copy } = useCopy();

  const [chatOpen, setChatOpen] = useState(false);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const onPaletteAction = useCallback(
    (action) => {
      if (action === "assistant") setChatOpen(true);
      if (action === "shortcuts") setHelpOpen(true);
      if (action === "sounds") sounds.toggle();
      if (action === "copy-email") copy(BRAND.email);
    },
    [sounds, copy]
  );
  const { messages, loading, sendMessage, reset, questionsLeft } = useChatbot();

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introDone}>
        <PaletteContext.Provider value={openPalette}>
          <SoundContext.Provider value={sounds}>
          <div className="relative min-h-screen bg-ink text-fg">
            <a href="#top" className="cx-skip rounded-full border border-accent-mid/50 bg-ink px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-fg">
              SKIP TO CONTENT
            </a>
            <LogoDefs />
            <ParticleEffect />
            <Backdrop />
            <FollowCursor />

            {!introDone && <LoadingScreen onComplete={finishIntro} />}

            {/* inert while a modal is open so Tab and screen readers stay inside it */}
            <div className={cx("relative z-10", pageIn)} inert={modalOpen || undefined}>
              <Navbar activeSection={activeSection} />
              <main>
                <Home />
                <div className="cx-container" aria-label="Selected deployments">
                  <Marquee items={DEPLOYED_FOR} className="border-y border-slate-400/10 py-3 md:py-4" />
                </div>
                <About />
                <Stack />
                <Projects />
                <Signals />
                <Path />
                <Contact />
              </main>
              <Footer />
            </div>

            <SideRail activeSection={activeSection} />
            <CommandPalette open={paletteOpen} onClose={closePalette} onAction={onPaletteAction} />
            <ShortcutsHelp open={helpOpen} onClose={closeHelp} />
            <Toast show={copied} icon="ri-check-line">
              Email copied — {BRAND.email}
            </Toast>
            {/* Vercel exposes VITE_VERCEL_ENV at build time; elsewhere the script would 404 */}
            {import.meta.env.VITE_VERCEL_ENV && <Analytics />}

            <div className="fixed bottom-5 right-5 z-[95] flex flex-col items-end gap-[14px] sm:bottom-7 sm:right-7">
              <ChatbotModal
                open={chatOpen}
                onClose={closeChat}
                onSend={sendMessage}
                onReset={reset}
                messages={messages}
                loading={loading}
                questionsLeft={questionsLeft}
              />
              <ChatbotButton onClick={() => setChatOpen((v) => !v)} open={chatOpen} />
            </div>
          </div>
          </SoundContext.Provider>
        </PaletteContext.Provider>
      </IntroContext.Provider>
    </MotionConfig>
  );
}

export default App;
