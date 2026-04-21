"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  isThemeMode,
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
  type ThemeMode
} from "../../lib/theme/theme";

type ThemeContextValue = Readonly<{
  isReady: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}>;

type ThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return THEME_LIGHT;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_DARK
    : THEME_LIGHT;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(THEME_LIGHT);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nextTheme = getPreferredTheme();

    setTheme(nextTheme);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [isReady, theme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      isReady,
      theme,
      setTheme,
      toggleTheme: () => {
        setTheme((currentValue) =>
          currentValue === THEME_DARK ? THEME_LIGHT : THEME_DARK
        );
      }
    }),
    [isReady, theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const contextValue = useContext(ThemeContext);

  if (contextValue === null) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return contextValue;
}

