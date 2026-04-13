type QuizNavigationProps = Readonly<{
  isLastQuestion: boolean;
  onProceed: () => void;
  isExamMode?: boolean;
}>;

export function QuizNavigation({
  isLastQuestion,
  onProceed,
  isExamMode = false
}: QuizNavigationProps) {
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
      ? "현재 문항 제출이 끝났습니다. 흐름을 유지한 채 다음 문항으로 진행하세요."
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
        <button
          type="button"
          onClick={onProceed}
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        >
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}
