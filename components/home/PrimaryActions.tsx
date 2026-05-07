"use client";

import Link from "next/link";

import { useTheme } from "../theme/ThemeProvider";
import type { QuizMode } from "../../lib/types";

type PrimaryAction = Readonly<{
  title: string;
  href: string;
  badge: string;
  availability: "always" | "active-set" | "default-saa";
  accentClassName: string;
  mutedAccentClassName: string;
  arrowClassName: string;
  panelClassName: string;
  glowClassName: string;
  darkPanelClassName: string;
  darkGlowClassName: string;
  darkStripeClassName: string;
}>;

const primaryActions: readonly PrimaryAction[] = [
  {
    title: "PDF 가져오기",
    href: "/import",
    badge: "Import",
    availability: "always",
    accentClassName: "border-[#7e9fff] bg-white text-[#325ecc]",
    mutedAccentClassName: "border-[#a9c1ff] bg-white text-[#5376d6]",
    arrowClassName: "text-[#5f83e6] group-hover:text-[#274fb5]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#f5f8ff)]",
    glowClassName: "from-[#d7e5ff] via-[#edf4ff] to-transparent",
    darkPanelClassName:
      "bg-[linear-gradient(180deg,_rgba(48,56,86,0.98),_rgba(39,42,62,0.98))]",
    darkGlowClassName: "from-[#8be9fd]/30 via-[#56a4ff]/18 to-transparent",
    darkStripeClassName:
      "bg-[linear-gradient(180deg,_rgba(139,233,253,0.96),_rgba(84,156,255,0.92))]"
  },
  {
    title: "일반 문제풀이",
    href: "/quiz/",
    badge: "Normal",
    availability: "active-set",
    accentClassName: "border-[#f0a18f] bg-white text-[#c96a50]",
    mutedAccentClassName: "border-[#f1b8ab] bg-white text-[#cb8068]",
    arrowClassName: "text-[#d27d63] group-hover:text-[#ad4f35]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#fff7f3)]",
    glowClassName: "from-[#ffd7c8] via-[#fff0e9] to-transparent",
    darkPanelClassName:
      "bg-[linear-gradient(180deg,_rgba(67,52,64,0.98),_rgba(45,40,58,0.98))]",
    darkGlowClassName: "from-[#ff79c6]/24 via-[#ffb86c]/16 to-transparent",
    darkStripeClassName:
      "bg-[linear-gradient(180deg,_rgba(255,121,198,0.96),_rgba(255,184,108,0.94))]"
  },
  {
    title: "랜덤 모드",
    href: "/quiz/?mode=random",
    badge: "Random",
    availability: "active-set",
    accentClassName: "border-[#e8bf78] bg-white text-[#b07b17]",
    mutedAccentClassName: "border-[#ecd3a3] bg-white text-[#b48c45]",
    arrowClassName: "text-[#bc8e36] group-hover:text-[#966503]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#fff9ef)]",
    glowClassName: "from-[#ffe0ad] via-[#fff5df] to-transparent",
    darkPanelClassName:
      "bg-[linear-gradient(180deg,_rgba(67,58,42,0.98),_rgba(47,42,36,0.98))]",
    darkGlowClassName: "from-[#ffb86c]/28 via-[#f1fa8c]/16 to-transparent",
    darkStripeClassName:
      "bg-[linear-gradient(180deg,_rgba(255,184,108,0.96),_rgba(241,250,140,0.88))]"
  },
  {
    title: "시험 모드",
    href: "/exam/",
    badge: "Exam",
    availability: "default-saa",
    accentClassName: "border-[#93d7c1] bg-white text-[#2d8a68]",
    mutedAccentClassName: "border-[#b7e5d6] bg-white text-[#5f9f89]",
    arrowClassName: "text-[#61ab90] group-hover:text-[#1f6f53]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#f2fbf7)]",
    glowClassName: "from-[#c7f1df] via-[#eefbf5] to-transparent",
    darkPanelClassName:
      "bg-[linear-gradient(180deg,_rgba(38,62,66,0.98),_rgba(35,46,58,0.98))]",
    darkGlowClassName: "from-[#50fa7b]/24 via-[#8be9fd]/18 to-transparent",
    darkStripeClassName:
      "bg-[linear-gradient(180deg,_rgba(80,250,123,0.96),_rgba(139,233,253,0.94))]"
  }
] as const;

type PrimaryActionsProps = Readonly<{
  hasActiveQuestionSet: boolean;
  canUseExamMode: boolean;
  isRangeValid: boolean;
  rangeValidationMessage: string | null;
  isReady: boolean;
  normalModeHref: string;
  randomModeHref: string;
  examModeHref: string;
  resumeHref: string | null;
  restartHref: string | null;
  resumeMode: QuizMode | null;
  resumeQuestionNumber: number | null;
  onClearResume?: () => void;
}>;

function getResumeModeLabel(resumeMode: QuizMode | null): string {
  if (resumeMode === "random") {
    return "랜덤 모드";
  }

  if (resumeMode === "exam") {
    return "시험 모드";
  }

  if (resumeMode === "review") {
    return "복습 모드";
  }

  return "일반 문제풀이";
}

export function PrimaryActions({
  hasActiveQuestionSet,
  canUseExamMode,
  isRangeValid,
  rangeValidationMessage,
  isReady,
  normalModeHref,
  randomModeHref,
  examModeHref,
  resumeHref,
  restartHref,
  resumeMode,
  resumeQuestionNumber,
  onClearResume
}: PrimaryActionsProps) {
  const { theme } = useTheme();

  return (
    <section className="theme-muted-surface flex h-full flex-col rounded-[1.5rem] px-4 py-4 sm:rounded-[1.75rem] sm:px-6 sm:py-6 xl:px-5 xl:py-5">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5 sm:gap-4 xl:mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-text-faint)]">
            Start
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--app-text)] sm:mt-2 sm:text-2xl xl:text-[1.55rem]">
            시작
          </h2>
        </div>
      </div>
      {!hasActiveQuestionSet && isReady ? (
        <div className="mb-4 rounded-[1.25rem] border border-dashed border-coral/35 bg-coral/6 px-4 py-3">
          <p className="text-sm font-medium text-[color:var(--app-text-muted)]">문제 세트가 없습니다.</p>
        </div>
      ) : null}
      {hasActiveQuestionSet && isReady && !isRangeValid && rangeValidationMessage !== null ? (
        <div className="mb-4 rounded-[1.25rem] border border-dashed border-[#d8a647] bg-[#fff7ea] px-4 py-3">
          <p className="text-sm font-medium text-[color:var(--app-text-muted)]">{rangeValidationMessage}</p>
        </div>
      ) : null}
      {resumeHref !== null && resumeQuestionNumber !== null ? (
        <div className="theme-card mb-4 rounded-[1.25rem] border-[#d8e4ff] px-4 py-4 sm:mb-5 sm:rounded-[1.5rem] sm:px-5 sm:py-5 xl:px-4 xl:py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5273c9]">
                Resume
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-[var(--app-text)] sm:mt-2 sm:text-lg xl:text-base">
                이어풀기
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-[color:var(--app-text-muted)] sm:mt-2 sm:leading-6 sm:text-base xl:text-sm">
                {getResumeModeLabel(resumeMode)} {resumeQuestionNumber}번
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:items-end">
              <Link
                href={resumeHref}
                className="theme-solid-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                이어 풀기
              </Link>
              {restartHref ? (
                <Link
                  href={restartHref}
                  className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  처음부터 다시 시작
                </Link>
              ) : null}
              {onClearResume ? (
                <button
                  type="button"
                  onClick={onClearResume}
                  className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50"
                >
                  이어풀기 세션 삭제
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-4 xl:gap-3">
        {primaryActions.map((action) => {
          const resolvedPanelClassName =
            theme === "dark"
              ? action.darkPanelClassName
              : action.panelClassName;
          const resolvedGlowClassName =
            theme === "dark"
              ? action.darkGlowClassName
              : action.glowClassName;
          const isDisabled =
            action.availability === "active-set"
              ? !hasActiveQuestionSet || !isReady || !isRangeValid
              : action.availability === "default-saa"
                ? !hasActiveQuestionSet || !isReady || !canUseExamMode || !isRangeValid
                : false;
          const disabledText =
            action.availability === "default-saa" && hasActiveQuestionSet && !canUseExamMode
              ? "SAA 기본 세트 필요"
              : hasActiveQuestionSet && !isRangeValid
                ? "범위 확인 필요"
              : "세트 필요";
          const resolvedHref =
            action.badge === "Normal"
              ? normalModeHref
              : action.badge === "Random"
                ? randomModeHref
                : action.badge === "Exam"
                  ? examModeHref
                  : action.href;

          if (isDisabled) {
            const mutedBadgeClassName =
              theme === "dark"
                ? "border-[rgba(255,255,255,0.18)] bg-[rgba(20,31,46,0.82)] text-[var(--app-text)]"
                : action.mutedAccentClassName;
            return (
              <div
                key={action.title}
                className={`theme-card relative overflow-hidden rounded-[1.2rem] p-3.5 sm:rounded-[1.75rem] sm:p-5 xl:px-4 xl:py-3.5 ${resolvedPanelClassName}`}
              >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-80 sm:h-28 ${resolvedGlowClassName}`}
              />
              <div className="flex items-start justify-between gap-4">
                  <span
                    className={`inline-flex rounded-2xl border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm sm:px-3 sm:py-2 sm:text-xs ${mutedBadgeClassName}`}
                  >
                    {action.badge}
                  </span>
                </div>
                <div className="relative mt-3 flex h-full min-h-[88px] flex-col justify-between sm:mt-5 sm:min-h-[132px] xl:mt-3 xl:min-h-[74px]">
                  <h3 className="max-w-[12rem] text-base font-semibold leading-6 tracking-tight text-[var(--app-text)] sm:max-w-none sm:text-[1.45rem] sm:leading-8 xl:text-[1.1rem] xl:leading-7">
                    {action.title}
                  </h3>
                  <div className="mt-auto pt-3 sm:pt-6 xl:pt-2">
                    <div className="theme-subtle-surface rounded-[1rem] border-dashed px-3 py-2 backdrop-blur sm:rounded-[1.25rem] sm:px-4 sm:py-3">
                      <span className="inline-flex rounded-full bg-[var(--app-surface-muted)] px-2.5 py-1 text-[10px] font-semibold text-[color:var(--app-text-faint)] sm:px-3 sm:text-xs">
                        {disabledText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const activeBadgeClassName =
            theme === "dark"
              ? "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.94)] text-[#10243e]"
              : action.accentClassName;
          const activeArrowClassName =
            theme === "dark"
              ? "text-[var(--app-text)] group-hover:text-white"
              : action.arrowClassName;

          return (
            <Link
              key={action.title}
              href={resolvedHref}
              className={`theme-card group relative overflow-hidden rounded-[1.2rem] p-3.5 transition-all hover:-translate-y-0.5 hover:border-[var(--app-border-strong)] hover:shadow-[0_16px_36px_rgba(16,36,62,0.08)] sm:rounded-[1.75rem] sm:p-5 xl:px-4 xl:py-3.5 ${resolvedPanelClassName}`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-85 transition-opacity group-hover:opacity-100 sm:h-28 ${resolvedGlowClassName}`}
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`inline-flex rounded-2xl border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm sm:px-3 sm:py-2 sm:text-xs ${activeBadgeClassName}`}
                >
                  {action.badge}
                </span>
                <span className={`text-base transition-colors sm:text-xl ${activeArrowClassName}`}>
                  →
                </span>
              </div>
              <div className="relative mt-3 flex h-full min-h-[88px] flex-col justify-end sm:mt-6 sm:min-h-[132px] xl:mt-3 xl:min-h-[74px]">
                <h3 className="max-w-[12rem] text-base font-semibold leading-6 tracking-tight text-[var(--app-text)] sm:max-w-none sm:text-[1.45rem] sm:leading-8 xl:text-[1.1rem] xl:leading-7">
                  {action.title}
                </h3>
                <div className="mt-auto pt-2 sm:pt-6 xl:pt-2" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
