import Link from "next/link";

import type { QuizMode } from "../../lib/types";

type PrimaryAction = Readonly<{
  title: string;
  href: string;
  badge: string;
  availability: "always" | "active-set" | "default-saa";
  accentClassName: string;
}>;

const primaryActions: readonly PrimaryAction[] = [
  {
    title: "PDF 가져오기",
    href: "/import",
    badge: "Import",
    availability: "always",
    accentClassName: "border-[#8bb3ff] bg-[#eef4ff] text-[#3f6de0]"
  },
  {
    title: "일반 문제풀이",
    href: "/quiz",
    badge: "Normal",
    availability: "active-set",
    accentClassName: "border-[#ffb39f] bg-[#fff1ed] text-[#dd6a4b]"
  },
  {
    title: "랜덤 모드",
    href: "/quiz?mode=random",
    badge: "Random",
    availability: "active-set",
    accentClassName: "border-[#ffc982] bg-[#fff5e6] text-[#d98b18]"
  },
  {
    title: "시험 모드",
    href: "/exam",
    badge: "Exam",
    availability: "default-saa",
    accentClassName: "border-[#9adfcc] bg-[#ebfbf5] text-[#25956d]"
  }
] as const;

type PrimaryActionsProps = Readonly<{
  hasActiveQuestionSet: boolean;
  canUseExamMode: boolean;
  isReady: boolean;
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
  isReady,
  resumeHref,
  restartHref,
  resumeMode,
  resumeQuestionNumber,
  onClearResume
}: PrimaryActionsProps) {
  return (
    <section className="rounded-[1.75rem] bg-[#f9fbfe] px-5 py-5 sm:px-6 sm:py-6">
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
      <div className="grid gap-4 md:grid-cols-2">
        {primaryActions.map((action) => {
          const isDisabled =
            action.availability === "active-set"
              ? !hasActiveQuestionSet || !isReady
              : action.availability === "default-saa"
                ? !hasActiveQuestionSet || !isReady || !canUseExamMode
                : false;
          const disabledText =
            action.availability === "default-saa" && hasActiveQuestionSet && !canUseExamMode
              ? "SAA 기본 세트 필요"
              : "세트 필요";

          if (isDisabled) {
            return (
              <div
                key={action.title}
                className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex rounded-2xl border border-ink/10 bg-mist px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    {action.badge}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/35">
                    Locked
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{action.title}</h3>
                <span className="mt-8 inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink/48">
                  {disabledText}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_16px_36px_rgba(16,36,62,0.08)]"
            >
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
              <h3 className="mt-6 text-xl font-semibold text-ink">{action.title}</h3>
              <span className="mt-8 inline-flex text-sm font-semibold text-ink/78">
                바로 시작
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
