import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExamMate",
  description: "시험 대비 예상문제풀이 웹앱 프로젝트"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
