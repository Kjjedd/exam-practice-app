import Link from "next/link";

import type { QuestionSetSummary } from "../../lib/types";

type ActiveQuestionSetSummaryProps = Readonly<{
  activeQuestionSet: QuestionSetSummary | null;
  isReady: boolean;
}>;

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "저장 시각 확인 필요";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function ActiveQuestionSetSummary({
  activeQuestionSet,
  isReady
}: ActiveQuestionSetSummaryProps) {
  const hasActiveQuestionSet = activeQuestionSet !== null;

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            활성 문제 세트
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            현재 바로 학습에 사용할 문제 세트 상태를 보여줍니다.
          </p>
        </div>
        <span className="inline-flex rounded-full bg-tide/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/80">
          {hasActiveQuestionSet ? "Ready" : "Empty"}
        </span>
      </div>

      {!isReady ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/15 bg-mist px-5 py-5">
          <p className="text-sm leading-6 text-ink/70 sm:text-base">
            저장된 문제 세트 상태를 확인하는 중입니다.
          </p>
        </div>
      ) : null}

      {isReady && hasActiveQuestionSet ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-ink/10 bg-mist px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              Current Set
            </p>
            <h3 className="mt-3 text-xl font-semibold text-ink">
              {activeQuestionSet.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              {activeQuestionSet.sourceLabel}
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white px-4 py-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                Questions
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {activeQuestionSet.questionCount}
              </dd>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white px-4 py-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                Saved At
              </dt>
              <dd className="mt-2 text-sm font-medium leading-6 text-ink/80">
                {formatCreatedAt(activeQuestionSet.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      {isReady && !hasActiveQuestionSet ? (
        <div className="mt-6 rounded-2xl border border-dashed border-coral/30 bg-coral/5 px-5 py-5">
          <h3 className="text-lg font-semibold text-ink">
            아직 활성 문제 세트가 없습니다.
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            먼저 문제 PDF를 가져오고 검수한 뒤 저장하면, 일반 문제풀이와 랜덤
            모드, 시험 모드를 바로 시작할 수 있습니다.
          </p>
          <Link
            href="/import"
            className="mt-5 inline-flex items-center rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
          >
            PDF 가져오기 시작
          </Link>
        </div>
      ) : null}
    </section>
  );
}
