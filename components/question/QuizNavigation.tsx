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
      <section className="theme-card rounded-[1.75rem] px-4 py-4 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={onGoPrevious}
              disabled={!canGoPrevious}
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
            >
              이전 문제
            </button>
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={onGoNext}
                disabled={!canGoNext}
                className="theme-solid-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                다음 문제
              </button>
            ) : (
              <button
                type="button"
                onClick={canFinishSession ? onProceed : undefined}
                disabled={!canFinishSession}
                className="theme-solid-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                결과
              </button>
            )}
            {onExitToHome ? (
              <button
                type="button"
                onClick={onExitToHome}
                className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
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
    <section className="theme-card rounded-[1.75rem] px-4 py-4 sm:px-8 sm:py-6">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={onProceed}
            className="theme-solid-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            {buttonLabel}
          </button>
          {onExitToHome ? (
            <button
              type="button"
              onClick={onExitToHome}
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              홈으로 이동
            </button>
          ) : null}
      </div>
    </section>
  );
}
