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
    <section className="theme-muted-surface flex h-full flex-col rounded-[1.5rem] p-4 sm:rounded-[1.75rem] sm:p-7 xl:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
            Active Set
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--app-text)] sm:mt-2 sm:text-2xl xl:text-[1.55rem]">
            문제 세트
          </h2>
        </div>
      </div>

      {!isReady ? (
        <div className="theme-card mt-6 rounded-[1.5rem] border-dashed px-5 py-5">
          <p className="text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            불러오는 중입니다.
          </p>
        </div>
      ) : null}

      {isReady && hasActiveQuestionSet ? (
        <div className="mt-4 flex flex-1 flex-col gap-3 sm:mt-6 sm:gap-4 xl:mt-4">
          <div className="theme-card rounded-[1.25rem] px-4 py-4 sm:rounded-[1.5rem] sm:px-5 sm:py-5 xl:px-4 xl:py-4">
            <h3 className="text-lg font-semibold text-[var(--app-text)] sm:text-2xl xl:text-xl">
              {activeQuestionSet.title}
            </h3>
          </div>
          {questionSetSummaries.length > 1 ? (
            <div className="theme-card rounded-[1.25rem] px-4 py-4 sm:rounded-[1.5rem] xl:px-4 xl:py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                    Set Switcher
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {questionSetSummaries.map((summary) => (
                  <button
                    key={summary.id}
                    type="button"
                    onClick={() => onSelectQuestionSet?.(summary.id)}
                    disabled={summary.isActive}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:px-4 sm:text-sm xl:px-3.5 xl:py-1.5 xl:text-xs ${
                      summary.isActive
                        ? "theme-solid-button cursor-default"
                        : "theme-subtle-surface text-[var(--app-text)] hover:border-coral/30 hover:bg-[var(--app-surface-strong)]"
                    }`}
                  >
                    {summary.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {isRangeSelectable ? (
            <div className="theme-card rounded-[1.25rem] px-4 py-4 sm:rounded-[1.5rem] xl:px-4 xl:py-4">
              <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[1fr_1fr_auto] xl:items-end xl:gap-3">
                <div className="xl:col-span-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                    Range
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 xl:col-span-2 xl:w-full">
                  <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--app-text-muted)]">
                    시작
                    <input
                      type="number"
                      inputMode="numeric"
                      min={activeQuestionSet.minimumQuestionNumber ?? undefined}
                      max={activeQuestionSet.maximumQuestionNumber ?? undefined}
                      value={rangeStartInput}
                      onChange={(event) => onChangeRangeStart?.(event.target.value)}
                      className="theme-input rounded-2xl px-4 py-3 text-sm outline-none transition-colors sm:text-base xl:px-3.5 xl:py-2.5 xl:text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--app-text-muted)]">
                    끝
                    <input
                      type="number"
                      inputMode="numeric"
                      min={activeQuestionSet.minimumQuestionNumber ?? undefined}
                      max={activeQuestionSet.maximumQuestionNumber ?? undefined}
                      value={rangeEndInput}
                      onChange={(event) => onChangeRangeEnd?.(event.target.value)}
                      className="theme-input rounded-2xl px-4 py-3 text-sm outline-none transition-colors sm:text-base xl:px-3.5 xl:py-2.5 xl:text-sm"
                    />
                  </label>
                </div>
                <div className="theme-subtle-surface rounded-[1rem] px-4 py-3 xl:min-w-[110px] xl:px-4 xl:py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--app-text-faint)]">
                    Questions
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--app-text)] xl:text-xl">
                    {activeQuestionSet.questionCount}
                  </p>
                </div>
                {rangeValidationMessage !== null ? (
                  <p className="text-sm leading-6 text-[#b36926] xl:col-span-3">
                    {rangeValidationMessage}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {isReady && !hasActiveQuestionSet ? (
        <div className="theme-card mt-6 rounded-[1.5rem] border-dashed border-coral/30 px-5 py-5">
          <h3 className="text-lg font-semibold text-[var(--app-text)]">세트가 없습니다.</h3>
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
