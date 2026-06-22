"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  STORAGE_KEYS,
  type Mode,
  type ThemeId,
} from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeId;
  mode: Mode;
  setTheme: (t: ThemeId) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Inline script: applies the saved theme/mode before first paint (no flash). */
export const themeInitScript = `(function(){try{
  var t=localStorage.getItem('${STORAGE_KEYS.theme}')||'${DEFAULT_THEME}';
  var m=localStorage.getItem('${STORAGE_KEYS.mode}');
  if(!m){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  var r=document.documentElement;r.dataset.theme=t;r.dataset.mode=m;
}catch(e){}})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);

  // Hydrate from what the init script already applied to <html>.
  useEffect(() => {
    const r = document.documentElement;
    setThemeState((r.dataset.theme as ThemeId) || DEFAULT_THEME);
    setModeState((r.dataset.mode as Mode) || DEFAULT_MODE);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem(STORAGE_KEYS.theme, t);
    setThemeState(t);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: Mode = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.mode = next;
      localStorage.setItem(STORAGE_KEYS.mode, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
