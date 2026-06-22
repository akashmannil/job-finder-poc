import type { Metadata } from "next";
import { ThemeProvider, themeInitScript } from "@/components/common/ThemeProvider";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobMatch — proof over reach",
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
          <div className="min-h-screen">
            <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <a href="/" className="flex items-center gap-2 font-semibold">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-accent-contrast">
                    J
                  </span>
                  <span>
                    JobMatch
                    <span className="ml-2 hidden text-xs font-normal text-muted sm:inline">
                      proof over reach
                    </span>
                  </span>
                </a>
                {/* RoleSwitcher is added in commit 3. */}
                <ThemeSwitcher />
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
