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
  const title = isExamMode ? "시험 모드 화면" : "문제풀이 화면";
  const description = isExamMode
    ? "선택한 시험 템플릿 기준으로 랜덤 문항을 구성한 연습 세션입니다."
    : "현재 활성 문제 세트 기준으로 학습 세션을 진행합니다.";

  return (
    <header className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-5 shadow-sm sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            {modeLabel}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm font-medium text-ink/80">
            {currentQuestionNumber} / {totalQuestions}
          </div>
          {onExitToHome ? (
            <button
              type="button"
              onClick={onExitToHome}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
            >
              홈으로 이동
            </button>
          ) : null}
          {onRestartSession ? (
            <button
              type="button"
              onClick={onRestartSession}
              className="inline-flex items-center justify-center rounded-full border border-coral/20 px-4 py-2 text-sm font-semibold text-coral transition-colors hover:border-coral/40 hover:bg-coral/5"
            >
              처음부터 다시 시작
            </button>
          ) : null}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm leading-6 text-ink/80">
          <span className="font-semibold text-ink">활성 세트:</span> {questionSetTitle}
        </div>
        {questionRangeLabel !== null ? (
          <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm leading-6 text-ink/80">
            <span className="font-semibold text-ink">문제 범위:</span> {questionRangeLabel}
          </div>
        ) : null}
        {isExamMode && examTemplateTitle !== null ? (
          <div className="rounded-2xl border border-coral/15 bg-coral/5 px-4 py-3 text-sm leading-6 text-ink/80">
            <span className="font-semibold text-ink">시험 템플릿:</span>{" "}
            {examTemplateCode !== null ? `${examTemplateCode} · ` : ""}
            {examTemplateTitle}
          </div>
        ) : null}
      </div>
    </header>
  );
}
