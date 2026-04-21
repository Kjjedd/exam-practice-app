type QuizHeaderProps = Readonly<{
  questionSetTitle: string;
  questionRangeLabel?: string | null;
  onExitToHome?: () => void;
  onRestartSession?: () => void;
}>;

export function QuizHeader({
  questionSetTitle,
  questionRangeLabel = null,
  onExitToHome,
  onRestartSession
}: QuizHeaderProps) {
  const currentSetLabel =
    questionRangeLabel === null
      ? questionSetTitle
      : `${questionSetTitle} · ${questionRangeLabel}`;

  return (
    <header className="theme-card rounded-[1.5rem] px-4 py-3 sm:rounded-[1.75rem] sm:px-8 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)] sm:text-xs">
            현재 문제세트
          </p>
          <div className="theme-subtle-surface rounded-2xl px-3 py-2 text-xs leading-5 text-[color:var(--app-text-muted)] sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
            {currentSetLabel}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {onExitToHome ? (
            <button
              type="button"
              onClick={onExitToHome}
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm"
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
