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
  description: string;
  points: readonly string[];
  footerLabel: string;
}>;

const primaryActions: readonly PrimaryAction[] = [
  {
    title: "PDF 가져오기",
    href: "/import",
    badge: "Import",
    availability: "always",
    accentClassName: "border-[#8bb3ff] bg-[#eef4ff] text-[#3f6de0]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#f5f8ff)]",
    glowClassName: "from-[#d7e5ff] via-[#edf4ff] to-transparent",
    description: "PDF를 올리고 자동 변환 뒤 검수해서 새 문제 세트를 만듭니다.",
    points: ["새 세트 생성", "검수 후 저장", "개인 브라우저 보관"],
    footerLabel: "새 문제 세트 만들기"
  },
  {
    title: "일반 문제풀이",
    href: "/quiz",
    badge: "Normal",
    availability: "active-set",
    accentClassName: "border-[#ffb39f] bg-[#fff1ed] text-[#dd6a4b]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#fff7f3)]",
    glowClassName: "from-[#ffd7c8] via-[#fff0e9] to-transparent",
    description: "범위를 정해 차례대로 풀고, 필요한 문제는 자유롭게 다시 이동할 수 있습니다.",
    points: ["순차 풀이", "이전·다음 이동", "즉시 정답 확인"],
    footerLabel: "범위 기반 학습 시작"
  },
  {
    title: "랜덤 모드",
    href: "/quiz?mode=random",
    badge: "Random",
    availability: "active-set",
    accentClassName: "border-[#ffc982] bg-[#fff5e6] text-[#d98b18]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#fff9ef)]",
    glowClassName: "from-[#ffe0ad] via-[#fff5df] to-transparent",
    description: "선택한 범위 안에서 문제 순서를 섞어 실전 감각으로 반복 학습합니다.",
    points: ["범위 후 셔플", "순서 고정 세션", "오답 복습 연결"],
    footerLabel: "무작위 세션 시작"
  },
  {
    title: "시험 모드",
    href: "/exam",
    badge: "Exam",
    availability: "default-saa",
    accentClassName: "border-[#9adfcc] bg-[#ebfbf5] text-[#25956d]",
    panelClassName: "bg-[linear-gradient(180deg,_#ffffff,_#f2fbf7)]",
    glowClassName: "from-[#c7f1df] via-[#eefbf5] to-transparent",
    description: "실제 시험 템플릿 기준으로 문항 수와 평가 흐름을 맞춘 연습 세션입니다.",
    points: ["시험 템플릿 적용", "즉시 채점 없음", "마지막 결과 확인"],
    footerLabel: "시험형 세션 선택"
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
    <section className="flex h-full flex-col rounded-[1.75rem] bg-[#f9fbfe] px-5 py-5 sm:px-6 sm:py-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
            Start
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            학습 시작
          </h2>
        </div>
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/60">
          4가지 모드
        </span>
      </div>
      {!hasActiveQuestionSet && isReady ? (
        <div className="mb-5 rounded-[1.5rem] border border-dashed border-coral/35 bg-coral/6 px-5 py-4">
          <p className="text-sm leading-6 text-ink/75 sm:text-base">
            활성 문제 세트가 없습니다. 먼저 PDF를 가져오세요.
          </p>
        </div>
      ) : null}
      {hasActiveQuestionSet && isReady && !isRangeValid && rangeValidationMessage !== null ? (
        <div className="mb-5 rounded-[1.5rem] border border-dashed border-[#d8a647] bg-[#fff7ea] px-5 py-4">
          <p className="text-sm leading-6 text-ink/75 sm:text-base">
            {rangeValidationMessage}
          </p>
        </div>
      ) : null}
      {resumeHref !== null && resumeQuestionNumber !== null ? (
        <div className="mb-5 rounded-[1.5rem] border border-[#d8e4ff] bg-[#f2f6ff] px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5273c9]">
                Resume
              </p>
              <h3 className="mt-2 text-lg font-semibold text-ink">풀던 세션이 남아 있습니다.</h3>
              <p className="mt-2 text-sm leading-6 text-ink/75 sm:text-base">
                {getResumeModeLabel(resumeMode)} {resumeQuestionNumber}번부터 이어서 풉니다.
              </p>
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
      <div className="grid flex-1 gap-4 md:grid-cols-2">
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
                className={`relative overflow-hidden rounded-[1.75rem] border border-ink/10 p-5 shadow-sm ${action.panelClassName}`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-80 ${action.glowClassName}`}
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex rounded-2xl border border-ink/10 bg-mist px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    {action.badge}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/35">
                    Locked
                  </span>
                </div>
                <div className="relative mt-5 flex h-full flex-col">
                  <h3 className="text-xl font-semibold text-ink">{action.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/62">
                    {action.description}
                  </p>
                  <div className="mt-5 space-y-2">
                    {action.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-sm font-medium text-ink/66"
                      >
                        <span className="h-2 w-2 rounded-full bg-ink/25" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[1.25rem] border border-dashed border-ink/10 bg-white/75 px-4 py-3 backdrop-blur">
                    <span className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink/48">
                      {disabledText}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={action.title}
              href={resolvedHref}
              className={`group relative overflow-hidden rounded-[1.75rem] border border-ink/10 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_16px_36px_rgba(16,36,62,0.08)] ${action.panelClassName}`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-85 transition-opacity group-hover:opacity-100 ${action.glowClassName}`}
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`inline-flex rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${action.accentClassName}`}
                >
                  {action.badge}
                </span>
                <span className="text-lg text-ink/28 transition-colors group-hover:text-ink/55">
                  →
                </span>
              </div>
              <div className="relative mt-6 flex h-full flex-col">
                <h3 className="text-xl font-semibold text-ink">{action.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">
                  {action.description}
                </p>
                <div className="mt-5 grid gap-2">
                  {action.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-sm font-medium text-ink/70"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full border ${action.accentClassName}`}
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[1.25rem] border border-white/60 bg-white/80 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-semibold text-ink/82">
                    {action.footerLabel}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
