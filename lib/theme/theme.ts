export const THEME_STORAGE_KEY = "exammate-theme";

export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";

export type ThemeMode = typeof THEME_LIGHT | typeof THEME_DARK;

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === THEME_LIGHT || value === THEME_DARK;
}

