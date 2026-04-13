type QuizHeaderProps = Readonly<{
  currentQuestionNumber: number;
  totalQuestions: number;
  modeLabel: string;
  questionSetTitle: string;
}>;

export function QuizHeader({
  currentQuestionNumber,
  totalQuestions,
  modeLabel,
  questionSetTitle
}: QuizHeaderProps) {
  return (
    <header className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-5 shadow-sm sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            {modeLabel}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            문제풀이 화면
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            현재 활성 문제 세트와 문제 위치를 먼저 안정적으로 보여주는 단계입니다.
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm font-medium text-ink/80">
          {currentQuestionNumber} / {totalQuestions}
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm leading-6 text-ink/80">
        <span className="font-semibold text-ink">활성 세트:</span> {questionSetTitle}
      </div>
    </header>
  );
}
