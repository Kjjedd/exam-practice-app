type QuizHeaderProps = Readonly<{
  currentQuestionNumber: number;
  totalQuestions: number;
  modeLabel: string;
  questionSetTitle: string;
  questionRangeLabel?: string | null;
  isExamMode?: boolean;
  examTemplateCode?: string | null;
  examTemplateTitle?: string | null;
  onExitToHome?: () => void;
  onRestartSession?: () => void;
}>;

export function QuizHeader({
  currentQuestionNumber,
  totalQuestions,
  modeLabel,
  questionSetTitle,
  questionRangeLabel = null,
  isExamMode = false,
  examTemplateCode = null,
  examTemplateTitle = null,
  onExitToHome,
  onRestartSession
}: QuizHeaderProps) {
  return (
    <header className="rounded-[1.5rem] border border-ink/10 bg-white px-4 py-3 shadow-sm sm:rounded-[1.75rem] sm:px-8 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-coral/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-coral sm:px-3 sm:text-xs">
            {modeLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-ink/10 bg-mist px-3 py-2 text-sm font-medium text-ink/80 sm:px-4 sm:py-3">
              {currentQuestionNumber} / {totalQuestions}
            </div>
            <div className="rounded-2xl border border-ink/10 bg-mist px-3 py-2 text-xs leading-5 text-ink/80 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
              {questionSetTitle}
            </div>
            {questionRangeLabel !== null ? (
              <div className="rounded-2xl border border-ink/10 bg-mist px-3 py-2 text-xs leading-5 text-ink/80 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
                {questionRangeLabel}
              </div>
            ) : null}
            {isExamMode && examTemplateTitle !== null ? (
              <div className="rounded-2xl border border-coral/15 bg-coral/5 px-3 py-2 text-xs leading-5 text-ink/80 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
                {examTemplateCode !== null ? `${examTemplateCode} · ` : ""}
                {examTemplateTitle}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {onExitToHome ? (
            <button
              type="button"
              onClick={onExitToHome}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist sm:px-4 sm:text-sm"
            >
              홈으로 이동
            </button>
          ) : null}
          {onRestartSession ? (
            <button
              type="button"
              onClick={onRestartSession}
              className="inline-flex items-center justify-center rounded-full border border-coral/20 px-3.5 py-2 text-xs font-semibold text-coral transition-colors hover:border-coral/40 hover:bg-coral/5 sm:px-4 sm:text-sm"
            >
              처음부터 다시 시작
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
