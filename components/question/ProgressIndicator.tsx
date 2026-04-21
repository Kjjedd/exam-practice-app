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
    <section className="theme-card rounded-[1.5rem] px-6 py-5 sm:px-8">
      <div className="flex items-center justify-between gap-4 text-sm font-medium text-[color:var(--app-text-muted)]">
        <span>현재 진행</span>
        <span>
          {currentQuestionNumber} / {totalQuestions}
        </span>
      </div>
      <div className="theme-subtle-surface mt-4 h-3 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-coral transition-[width] duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}
