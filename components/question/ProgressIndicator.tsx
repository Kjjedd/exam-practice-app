type ProgressIndicatorProps = Readonly<{
  currentQuestionNumber: number;
  totalQuestions: number;
}>;

export function ProgressIndicator({
  currentQuestionNumber,
  totalQuestions
}: ProgressIndicatorProps) {
  const progressPercent =
    totalQuestions === 0 ? 0 : (currentQuestionNumber / totalQuestions) * 100;

  return (
    <section className="rounded-[1.5rem] border border-ink/10 bg-white px-6 py-5 shadow-sm sm:px-8">
      <div className="flex items-center justify-between gap-4 text-sm font-medium text-ink/75">
        <span>현재 진행</span>
        <span>
          {currentQuestionNumber} / {totalQuestions}
        </span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-coral transition-[width] duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}
