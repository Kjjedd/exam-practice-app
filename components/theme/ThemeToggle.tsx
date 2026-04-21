"use client";

import { THEME_DARK, THEME_LIGHT } from "../../lib/theme/theme";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { isReady, setTheme, theme } = useTheme();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div className="theme-toggle-shell pointer-events-auto inline-flex items-center gap-1 rounded-full p-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setTheme(THEME_LIGHT)}
          aria-pressed={theme === THEME_LIGHT}
          className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-3.5 ${
            isReady && theme === THEME_LIGHT
              ? "theme-toggle-button-active"
              : "theme-toggle-button-idle"
          }`}
        >
          라이트
        </button>
        <button
          type="button"
          onClick={() => setTheme(THEME_DARK)}
          aria-pressed={theme === THEME_DARK}
          className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-3.5 ${
            isReady && theme === THEME_DARK
              ? "theme-toggle-button-active"
              : "theme-toggle-button-idle"
          }`}
        >
          다크
        </button>
      </div>
    </div>
  );
}
