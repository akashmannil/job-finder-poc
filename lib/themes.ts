// Theme catalog shared by the ThemeProvider and the ThemeSwitcher UI.

export type ThemeId = "indigo" | "emerald" | "rose" | "amber" | "violet";
export type Mode = "light" | "dark";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  swatch: string; // representative accent color for the picker dot
}

export const THEMES: ThemeMeta[] = [
  { id: "indigo", label: "Indigo", swatch: "#4f46e5" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
  { id: "rose", label: "Rose", swatch: "#e11d48" },
  { id: "amber", label: "Amber", swatch: "#d97706" },
  { id: "violet", label: "Violet", swatch: "#7c3aed" },
];

export const DEFAULT_THEME: ThemeId = "indigo";
export const DEFAULT_MODE: Mode = "light";

export const STORAGE_KEYS = { theme: "jm-theme", mode: "jm-mode" } as const;
