// Theme catalog shared by the ThemeProvider and the ThemeSwitcher UI.
// Apple-style restrained accents over neutral surfaces (see app/globals.css).

export type ThemeId = "blue" | "purple" | "green" | "orange" | "pink";
export type Mode = "light" | "dark";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  swatch: string; // representative accent color for the picker dot
}

export const THEMES: ThemeMeta[] = [
  { id: "blue", label: "Blue", swatch: "#0071e3" },
  { id: "purple", label: "Purple", swatch: "#8944ab" },
  { id: "green", label: "Green", swatch: "#1d8a4e" },
  { id: "orange", label: "Orange", swatch: "#c9510c" },
  { id: "pink", label: "Pink", swatch: "#d6206e" },
];

export const DEFAULT_THEME: ThemeId = "blue";
export const DEFAULT_MODE: Mode = "light";

export const STORAGE_KEYS = { theme: "jm-theme", mode: "jm-mode" } as const;
