import type { QuestionSetSummary } from "../../lib/types";

type ActiveQuestionSetSummaryProps = Readonly<{
  activeQuestionSet: QuestionSetSummary | null;
  questionSetSummaries: readonly QuestionSetSummary[];
  isReady: boolean;
  onSelectQuestionSet?: (questionSetId: string) => void;
  rangeStartInput: string;
  rangeEndInput: string;
  onChangeRangeStart?: (value: string) => void;
  onChangeRangeEnd?: (value: string) => void;
  isRangeSelectable: boolean;
  rangeValidationMessage: string | null;
}>;

export function ActiveQuestionSetSummary({
  activeQuestionSet,
  questionSetSummaries,
  onSelectQuestionSet,
  isReady,
  rangeStartInput,
  rangeEndInput,
  onChangeRangeStart,
  onChangeRangeEnd,
  isRangeSelectable,
  rangeValidationMessage
}: ActiveQuestionSetSummaryProps) {
  const hasActiveQuestionSet = activeQuestionSet !== null;

  return (
    <section className="flex h-full flex-col rounded-[1.5rem] bg-[linear-gradient(180deg,_rgba(244,247,251,1),_rgba(255,255,255,1))] p-4 sm:rounded-[1.75rem] sm:p-7">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Active Set
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-ink sm:mt-2 sm:text-2xl">
            문제 세트
          </h2>
        </div>
      </div>

      {!isReady ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-ink/15 bg-white px-5 py-5">
          <p className="text-sm leading-6 text-ink/70 sm:text-base">
            불러오는 중입니다.
          </p>
        </div>
      ) : null}

      {isReady && hasActiveQuestionSet ? (
        <div className="mt-4 flex flex-1 flex-col gap-3 sm:mt-6 sm:gap-4">
          <div className="rounded-[1.25rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:rounded-[1.5rem] sm:px-5 sm:py-5">
            <h3 className="text-lg font-semibold text-ink sm:text-2xl">
              {activeQuestionSet.title}
            </h3>
          </div>
          {questionSetSummaries.length > 1 ? (
            <div className="rounded-[1.25rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:rounded-[1.5rem]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    Set Switcher
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
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
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
          {isRangeSelectable ? (
            <div className="rounded-[1.25rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:rounded-[1.5rem]">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                  Range
                </p>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                  <label className="flex flex-col gap-2 text-sm font-medium text-ink/72">
                    시작
                    <input
                      type="number"
                      inputMode="numeric"
                      min={activeQuestionSet.minimumQuestionNumber ?? undefined}
                      max={activeQuestionSet.maximumQuestionNumber ?? undefined}
                      value={rangeStartInput}
                      onChange={(event) => onChangeRangeStart?.(event.target.value)}
                      className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-coral/40 focus:bg-white sm:text-base"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-ink/72">
                    끝
                    <input
                      type="number"
                      inputMode="numeric"
                      min={activeQuestionSet.minimumQuestionNumber ?? undefined}
                      max={activeQuestionSet.maximumQuestionNumber ?? undefined}
                      value={rangeEndInput}
                      onChange={(event) => onChangeRangeEnd?.(event.target.value)}
                      className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-coral/40 focus:bg-white sm:text-base"
                    />
                  </label>
                </div>
                {rangeValidationMessage !== null ? (
                  <p className="text-sm leading-6 text-[#b36926]">{rangeValidationMessage}</p>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="rounded-[1.25rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:rounded-[1.5rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              Questions
            </p>
            <p className="mt-1.5 text-xl font-semibold text-ink sm:mt-2 sm:text-2xl">
              {activeQuestionSet.questionCount}
            </p>
          </div>
        </div>
      ) : null}

      {isReady && !hasActiveQuestionSet ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-coral/30 bg-white px-5 py-5">
          <h3 className="text-lg font-semibold text-ink">세트가 없습니다.</h3>
          <a
            href="/import"
            className="mt-5 inline-flex items-center rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
          >
            PDF 가져오기
          </a>
        </div>
      ) : null}
    </section>
  );
}
