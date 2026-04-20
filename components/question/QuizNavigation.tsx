type QuizNavigationProps = Readonly<{
  isLastQuestion: boolean;
  onProceed: () => void;
  isExamMode?: boolean;
  onExitToHome?: () => void;
  isFreeNavigationEnabled?: boolean;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  canFinishSession?: boolean;
  onGoPrevious?: () => void;
  onGoNext?: () => void;
}>;

export function QuizNavigation({
  isLastQuestion,
  onProceed,
  isExamMode = false,
  onExitToHome,
  isFreeNavigationEnabled = false,
  canGoPrevious = false,
  canGoNext = false,
  canFinishSession = false,
  onGoPrevious,
  onGoNext
}: QuizNavigationProps) {
  if (isFreeNavigationEnabled) {
    return (
      <section className="rounded-[1.75rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:px-8 sm:py-6">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={onGoPrevious}
              disabled={!canGoPrevious}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/35 disabled:hover:bg-transparent"
            >
              이전 문제
            </button>
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={onGoNext}
                disabled={!canGoNext}
                className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                다음 문제
              </button>
            ) : (
              <button
                type="button"
                onClick={canFinishSession ? onProceed : undefined}
                disabled={!canFinishSession}
                className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                결과
              </button>
            )}
            {onExitToHome ? (
              <button
                type="button"
                onClick={onExitToHome}
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
              >
                홈으로 이동
              </button>
            ) : null}
        </div>
      </section>
    );
  }

  const buttonLabel = isLastQuestion
    ? "결과"
    : isExamMode
      ? "다음 문항"
      : "다음 문제";

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:px-8 sm:py-6">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={onProceed}
            className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            {buttonLabel}
          </button>
          {onExitToHome ? (
            <button
              type="button"
              onClick={onExitToHome}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
            >
              홈으로 이동
            </button>
          ) : null}
      </div>
    </section>
  );
}
