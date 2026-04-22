"use client";

import { THEME_DARK, THEME_LIGHT } from "../../lib/theme/theme";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { isReady, setTheme, theme } = useTheme();
  const isDarkTheme = isReady ? theme === THEME_DARK : false;
  const nextTheme = isDarkTheme ? THEME_LIGHT : THEME_DARK;
  const buttonLabel = isDarkTheme ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-50 sm:right-5 sm:top-5">
      <div className="theme-toggle-shell pointer-events-auto rounded-full p-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          aria-label={buttonLabel}
          title={buttonLabel}
          className="theme-toggle-button theme-toggle-button-idle inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
        >
          <span aria-hidden="true">{isDarkTheme ? "☀︎" : "☾"}</span>
          <span className="sr-only">{buttonLabel}</span>
        </button>
      </div>
    </div>
  );
}
