import { createContext, useContext } from "react";

// Opens the ⌘K command palette from anywhere (hero button, nav, etc.).
export const PaletteContext = createContext(() => {});

export const useOpenPalette = () => useContext(PaletteContext);
