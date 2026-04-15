import Link from "next/link";

import type { QuestionSetSummary } from "../../lib/types";

type ActiveQuestionSetSummaryProps = Readonly<{
  activeQuestionSet: QuestionSetSummary | null;
  questionSetSummaries: readonly QuestionSetSummary[];
  isReady: boolean;
  onSelectQuestionSet?: (questionSetId: string) => void;
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
  questionSetSummaries,
  onSelectQuestionSet,
  isReady
}: ActiveQuestionSetSummaryProps) {
  const hasActiveQuestionSet = activeQuestionSet !== null;

  return (
    <section className="rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(244,247,251,1),_rgba(255,255,255,1))] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Active Set
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">현재 문제 세트</h2>
        </div>
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/70 shadow-sm">
          {hasActiveQuestionSet ? "준비됨" : "비어 있음"}
        </span>
      </div>

      {!isReady ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-ink/15 bg-white px-5 py-5">
          <p className="text-sm leading-6 text-ink/70 sm:text-base">
            불러오는 중입니다.
          </p>
        </div>
      ) : null}

      {isReady && hasActiveQuestionSet ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-[1.5rem] border border-ink/10 bg-white px-5 py-5 shadow-sm">
            <h3 className="text-2xl font-semibold text-ink">
              {activeQuestionSet.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              {activeQuestionSet.sourceLabel}
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-ink/10 bg-white px-4 py-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                Questions
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {activeQuestionSet.questionCount}
              </dd>
            </div>
            <div className="rounded-[1.5rem] border border-ink/10 bg-white px-4 py-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                Saved At
              </dt>
              <dd className="mt-2 text-sm font-medium leading-6 text-ink/80">
                {formatCreatedAt(activeQuestionSet.createdAt)}
              </dd>
            </div>
          </dl>
          {questionSetSummaries.length > 1 ? (
            <div className="rounded-[1.5rem] border border-ink/10 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    Set Switcher
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/68">
                    기본 세트와 600번 이후 세트를 바로 전환할 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {questionSetSummaries.map((summary) => (
                  <button
                    key={summary.id}
                    type="button"
                    onClick={() => onSelectQuestionSet?.(summary.id)}
                    disabled={summary.isActive}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      summary.isActive
                        ? "cursor-default bg-ink text-white"
                        : "border border-ink/12 bg-mist text-ink hover:border-coral/30 hover:bg-white"
                    }`}
                  >
                    {summary.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {isReady && !hasActiveQuestionSet ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-coral/30 bg-white px-5 py-5">
          <h3 className="text-lg font-semibold text-ink">
            아직 활성 문제 세트가 없습니다.
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            PDF를 가져오면 바로 시작할 수 있습니다.
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
