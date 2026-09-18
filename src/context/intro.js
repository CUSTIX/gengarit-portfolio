import { createContext, useContext } from "react";

// `true` once the intro sequence has finished (or was skipped). Scroll
// reveals wait on this so hero elements stagger in after the mark
// assembles rather than finishing invisibly behind the overlay.
export const IntroContext = createContext(true);

export const useIntroReady = () => useContext(IntroContext);
