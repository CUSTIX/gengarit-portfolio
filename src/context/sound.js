import { createContext, useContext } from "react";

// { enabled, toggle } from useUISounds, owned by App.
export const SoundContext = createContext({ enabled: false, toggle: () => {} });

export const useSound = () => useContext(SoundContext);
