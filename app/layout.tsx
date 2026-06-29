import type { Metadata } from "next";
import { ThemeProvider, themeInitScript } from "@/components/common/ThemeProvider";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import { TimeControls } from "@/components/common/TimeControls";
import { StoreProvider } from "@/store/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobMatch - proof over reach",
  description:
    "A two-sided hiring platform built on verified profiles, accountable recruiting, and proof over reach.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <StoreProvider>
            <div className="min-h-screen">
              <header className="sticky top-0 z-30 border-b border-border/60 bg-bg/70 backdrop-blur-xl backdrop-saturate-150">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
                  <a
                    href="/"
                    className="flex items-center gap-2 text-[17px] font-semibold tracking-tight"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-accent text-[13px] text-accent-contrast">
                      J
                    </span>
                    <span className="hidden sm:inline">JobMatch</span>
                  </a>
                  <div className="flex items-center gap-2.5">
                    <TimeControls />
                    <RoleSwitcher />
                    <ThemeSwitcher />
                  </div>
                </div>
              </header>
              <main className="mx-auto max-w-6xl px-5 py-12">{children}</main>
            </div>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
