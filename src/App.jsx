import { useCallback, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { ChatbotButton } from "./components/features/ChatbotButton";
import { ChatbotModal } from "./components/features/ChatbotModal";
import { ParticleEffect } from "./components/features/ParticleEffect";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { FollowCursor } from "./components/ui/FollowCursor";
import { LogoDefs } from "./components/ui/Logo";
import { Home } from "./components/sections/Home";
import { Projects } from "./components/sections/Projects";
import { About } from "./components/sections/About";
import { Stack } from "./components/sections/Stack";
import { Path } from "./components/sections/Path";
import { Contact } from "./components/sections/Contact";
import { IntroContext } from "./context/intro";
import { useActiveSection } from "./hooks/useActiveSection";
import { useChatbot } from "./hooks/useChatbot";
import { SECTIONS } from "./constants";
import { cx } from "./utils/cx";

/** Fixed ambient layers behind everything: color washes and a faded grid. */
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
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(148,163,184,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.045) 1px, transparent 1px)",
        backgroundSize: "96px 96px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 78%)",
      }}
    />
  </>
);

function App() {
  const reduced = useReducedMotion();
  // Skip the intro for reduced-motion users; otherwise it plays on load.
  const [introDone, setIntroDone] = useState(() => Boolean(reduced));
  const finishIntro = useCallback(() => setIntroDone(true), []);

  const activeSection = useActiveSection(SECTIONS);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatNudge, setChatNudge] = useState(false);
  const { messages, loading, sendMessage } = useChatbot();

  // Nudge toward the assistant once, a few seconds after the intro.
  useEffect(() => {
    if (!introDone || chatOpen) return;
    const show = setTimeout(() => setChatNudge(true), 6000);
    const hide = setTimeout(() => setChatNudge(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [introDone, chatOpen]);

  const toggleChat = () => {
    setChatNudge(false);
    setChatOpen((v) => !v);
  };

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introDone}>
        <div className="relative min-h-screen bg-ink text-fg">
          <LogoDefs />
          <ParticleEffect />
          <Backdrop />
          <FollowCursor />

          {!introDone && <LoadingScreen onComplete={finishIntro} />}

          <div className={cx("relative z-10", !reduced && "cx-page-in")}>
            <Navbar activeSection={activeSection} />
            <main>
              <Home />
              <Projects />
              <About />
              <Stack />
              <Path />
              <Contact />
            </main>
            <Footer />
          </div>

          <div className="fixed bottom-6 right-4 z-[85] sm:right-6">
            <ChatbotButton onClick={toggleChat} open={chatOpen} nudge={chatNudge} />
          </div>
          <ChatbotModal
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            onSend={sendMessage}
            messages={messages}
            loading={loading}
          />
        </div>
      </IntroContext.Provider>
    </MotionConfig>
  );
}

export default App;
