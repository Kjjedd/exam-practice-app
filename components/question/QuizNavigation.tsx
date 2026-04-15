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
      <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-ink">문제 이동</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
              일반 문제풀이 모드에서는 이전 문제와 다음 문제를 자유롭게 오갈 수
              있습니다. 이미 제출한 문제는 기존 결과 상태로 다시 보입니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onGoPrevious}
              disabled={!canGoPrevious}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/35 disabled:hover:bg-transparent"
            >
              이전 문제
            </button>
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={onGoNext}
                disabled={!canGoNext}
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                다음 문제
              </button>
            ) : (
              <button
                type="button"
                onClick={canFinishSession ? onProceed : undefined}
                disabled={!canFinishSession}
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                결과 보기
              </button>
            )}
            {onExitToHome ? (
              <button
                type="button"
                onClick={onExitToHome}
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
              >
                홈으로 저장 후 이동
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const heading = isLastQuestion
    ? isExamMode
      ? "시험 종료"
      : "세션 종료"
    : isExamMode
      ? "다음 문항"
      : "다음 문제";
  const description = isLastQuestion
    ? isExamMode
      ? "마지막 문항까지 제출했습니다. 시험 결과 화면으로 이동할 준비가 되었습니다."
      : "현재 문제가 마지막입니다. 이제 결과 화면으로 넘어갈 준비가 되었습니다."
    : isExamMode
      ? "현재 문항의 답안이 저장되었습니다. 정답과 해설은 마지막 결과 화면에서 확인합니다."
      : "해설을 확인했다면 다음 문제로 넘어가며 새 문제 상태를 시작할 수 있습니다.";
  const buttonLabel = isLastQuestion
    ? isExamMode
      ? "시험 결과 보기"
      : "결과 보기"
    : isExamMode
      ? "다음 문항으로 이동"
      : "다음 문제로 이동";

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink">
            {heading}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={onProceed}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            {buttonLabel}
          </button>
          {onExitToHome ? (
            <button
              type="button"
              onClick={onExitToHome}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
            >
              홈으로 저장 후 이동
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
