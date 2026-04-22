import type { Metadata } from "next";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExamMate",
  description: "시험 대비 예상문제풀이 웹앱 프로젝트"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const themeBootstrapScript = `
    (function () {
      try {
        var key = "exammate-theme";
        var storedTheme = window.localStorage.getItem(key);
        var theme = storedTheme === "dark" || storedTheme === "light"
          ? storedTheme
          : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.dataset.theme = theme;
      } catch (error) {
        document.documentElement.dataset.theme = "light";
      }
    })();
  `;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle hiddenOnPathnames={["/", "/quiz"]} />
        </ThemeProvider>
      </body>
    </html>
  );
}
