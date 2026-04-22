"use client";

import { usePathname } from "next/navigation";

import { THEME_DARK, THEME_LIGHT } from "../../lib/theme/theme";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = Readonly<{
  hiddenOnPathnames?: readonly string[];
  variant?: "floating" | "inline" | "compact";
}>;

export function ThemeToggle({
  hiddenOnPathnames = [],
  variant = "floating"
}: ThemeToggleProps) {
  const { isReady, setTheme, theme } = useTheme();
  const pathname = usePathname();
  const isDarkTheme = isReady ? theme === THEME_DARK : false;
  const nextTheme = isDarkTheme ? THEME_LIGHT : THEME_DARK;
  const buttonLabel = isDarkTheme ? "라이트 모드로 전환" : "다크 모드로 전환";
  const shellClassName =
    variant === "inline"
      ? "theme-toggle-shell inline-flex items-center gap-1 rounded-full p-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl"
      : variant === "compact"
        ? "theme-toggle-shell inline-flex items-center rounded-full p-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl"
      : "theme-toggle-shell pointer-events-auto rounded-full p-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl";
  const buttonClassName =
    variant === "inline"
      ? "theme-toggle-button inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.18)] sm:min-w-[5rem]"
      : variant === "compact"
        ? "theme-toggle-button theme-toggle-button-idle inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
      : "theme-toggle-button theme-toggle-button-idle inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.18)]";

  if (hiddenOnPathnames.includes(pathname)) {
    return null;
  }

  if (variant === "inline") {
    return (
      <div className={shellClassName}>
        <button
          type="button"
          onClick={() => setTheme(THEME_LIGHT)}
          aria-pressed={theme === THEME_LIGHT}
          className={`${buttonClassName} ${
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
          className={`${buttonClassName} ${
            isReady && theme === THEME_DARK
              ? "theme-toggle-button-active"
              : "theme-toggle-button-idle"
          }`}
        >
          다크
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={shellClassName}>
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          aria-label={buttonLabel}
          title={buttonLabel}
          className={buttonClassName}
        >
          <span aria-hidden="true">{isDarkTheme ? "☀︎" : "☾"}</span>
          <span className="sr-only">{buttonLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-50 sm:right-5 sm:top-5">
      <div className={shellClassName}>
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          aria-label={buttonLabel}
          title={buttonLabel}
          className={buttonClassName}
        >
          <span aria-hidden="true">{isDarkTheme ? "☀︎" : "☾"}</span>
          <span className="sr-only">{buttonLabel}</span>
        </button>
      </div>
    </div>
  );
}
