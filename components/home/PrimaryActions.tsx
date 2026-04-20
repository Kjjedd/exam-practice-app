import Link from "next/link";

import type { QuizMode } from "../../lib/types";

type PrimaryAction = Readonly<{
  title: string;
  href: string;
  badge: string;
  availability: "always" | "active-set" | "default-saa";
  accentClassName: string;
  panelClassName: string;
  glowClassName: string;
}>;

const primaryActions: readonly PrimaryAction[] = [
  {
    title: "PDF 가져오기",
    href: "/import",
    badge: "Import",
    availability: "always",
    accentClassName: "border-[#8bb3ff] bg-[#eef4ff] text-[#3f6de0]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#f5f8ff)]",
    glowClassName: "from-[#d7e5ff] via-[#edf4ff] to-transparent"
  },
  {
    title: "일반 문제풀이",
    href: "/quiz",
    badge: "Normal",
    availability: "active-set",
    accentClassName: "border-[#ffb39f] bg-[#fff1ed] text-[#dd6a4b]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#fff7f3)]",
    glowClassName: "from-[#ffd7c8] via-[#fff0e9] to-transparent"
  },
  {
    title: "랜덤 모드",
    href: "/quiz?mode=random",
    badge: "Random",
    availability: "active-set",
    accentClassName: "border-[#ffc982] bg-[#fff5e6] text-[#d98b18]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#fff9ef)]",
    glowClassName: "from-[#ffe0ad] via-[#fff5df] to-transparent"
  },
  {
    title: "시험 모드",
    href: "/exam",
    badge: "Exam",
    availability: "default-saa",
    accentClassName: "border-[#9adfcc] bg-[#ebfbf5] text-[#25956d]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#f2fbf7)]",
    glowClassName: "from-[#c7f1df] via-[#eefbf5] to-transparent"
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
  return (
    <section className="flex h-full flex-col rounded-[1.5rem] bg-[#f9fbfe] px-4 py-4 sm:rounded-[1.75rem] sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5 sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
            Start
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-ink sm:mt-2 sm:text-2xl">시작</h2>
        </div>
      </div>
      {!hasActiveQuestionSet && isReady ? (
        <div className="mb-4 rounded-[1.25rem] border border-dashed border-coral/35 bg-coral/6 px-4 py-3">
          <p className="text-sm font-medium text-ink/75">문제 세트가 없습니다.</p>
        </div>
      ) : null}
      {hasActiveQuestionSet && isReady && !isRangeValid && rangeValidationMessage !== null ? (
        <div className="mb-4 rounded-[1.25rem] border border-dashed border-[#d8a647] bg-[#fff7ea] px-4 py-3">
          <p className="text-sm font-medium text-ink/75">{rangeValidationMessage}</p>
        </div>
      ) : null}
      {resumeHref !== null && resumeQuestionNumber !== null ? (
        <div className="mb-4 rounded-[1.25rem] border border-[#d8e4ff] bg-[#f2f6ff] px-4 py-4 sm:mb-5 sm:rounded-[1.5rem] sm:px-5 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5273c9]">
                Resume
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-ink sm:mt-2 sm:text-lg">이어풀기</h3>
              <p className="mt-1.5 text-sm leading-5 text-ink/75 sm:mt-2 sm:leading-6 sm:text-base">{getResumeModeLabel(resumeMode)} {resumeQuestionNumber}번</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href={resumeHref}
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
              >
                이어 풀기
              </Link>
              {restartHref ? (
                <Link
                  href={restartHref}
                  className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
                >
                  처음부터 다시 시작
                </Link>
              ) : null}
              {onClearResume ? (
                <button
                  type="button"
                  onClick={onClearResume}
                  className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50"
                >
                  이어풀기 세션 삭제
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-4">
        {primaryActions.map((action) => {
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
            return (
              <div
                key={action.title}
                className={`relative overflow-hidden rounded-[1.35rem] border border-ink/10 p-4 shadow-sm sm:rounded-[1.75rem] sm:p-5 ${action.panelClassName}`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-80 sm:h-28 ${action.glowClassName}`}
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex rounded-2xl border border-ink/10 bg-mist px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55 sm:px-3 sm:py-2 sm:text-xs">
                    {action.badge}
                  </span>
                </div>
                <div className="relative mt-4 flex h-full flex-col sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-ink sm:text-xl">{action.title}</h3>
                  <div className="mt-auto pt-4 sm:pt-6">
                  <div className="rounded-[1rem] border border-dashed border-ink/10 bg-white/75 px-3 py-2.5 backdrop-blur sm:rounded-[1.25rem] sm:px-4 sm:py-3">
                    <span className="inline-flex rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-ink/48 sm:px-3 sm:text-xs">
                      {disabledText}
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={action.title}
              href={resolvedHref}
              className={`group relative overflow-hidden rounded-[1.35rem] border border-ink/10 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_16px_36px_rgba(16,36,62,0.08)] sm:rounded-[1.75rem] sm:p-5 ${action.panelClassName}`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-85 transition-opacity group-hover:opacity-100 sm:h-28 ${action.glowClassName}`}
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`inline-flex rounded-2xl border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] sm:px-3 sm:py-2 sm:text-xs ${action.accentClassName}`}
                >
                  {action.badge}
                </span>
                <span className="text-base text-ink/28 transition-colors group-hover:text-ink/55 sm:text-lg">
                  →
                </span>
              </div>
              <div className="relative mt-4 flex h-full flex-col sm:mt-6">
                <h3 className="text-base font-semibold leading-6 text-ink sm:text-xl">{action.title}</h3>
                <div className="mt-auto pt-4 sm:pt-6" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
