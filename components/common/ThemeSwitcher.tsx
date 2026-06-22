"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* light / dark toggle */}
      <button
        onClick={toggleMode}
        aria-label="Toggle light/dark"
        className="btn-ghost h-9 w-9 !px-0"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {mode === "dark" ? "🌙" : "☀️"}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* accent picker */}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Choose theme"
          className="btn-ghost h-9 w-9 !px-0"
        >
          <span
            className="h-4 w-4 rounded-full ring-2 ring-border"
            style={{ background: "var(--accent)" }}
          />
        </button>
        <AnimatePresence>
          {open && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-hidden
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="card absolute right-0 z-20 mt-2 flex gap-2 p-2"
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    title={t.label}
                    aria-label={t.label}
                    className="relative h-7 w-7 rounded-full ring-2 ring-border transition-transform hover:scale-110"
                    style={{ background: t.swatch }}
                  >
                    {theme === t.id && (
                      <motion.span
                        layoutId="theme-ring"
                        className="absolute -inset-1 rounded-full ring-2 ring-fg"
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
