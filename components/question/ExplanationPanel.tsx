type ExplanationPanelProps = Readonly<{
  explanation: string;
  isCorrect: boolean;
  isOpen: boolean;
  onToggle: () => void;
}>;

export function ExplanationPanel({
  explanation,
  isCorrect,
  isOpen,
  onToggle
}: ExplanationPanelProps) {
  const resultLabel = isCorrect ? "정답" : "오답";
  const feedbackTitle = isCorrect
    ? "왜 이 선택이 맞는지 바로 이해해 봅시다."
    : "지금 놓친 포인트를 해설로 바로 정리해 봅시다.";
  const feedbackDescription = isCorrect
    ? "현재 선택은 정답입니다. 아래 해설을 읽으면서 핵심 근거를 한 번 더 확인해 보세요."
    : "현재 선택은 오답입니다. 아래 해설을 읽으면서 어떤 단서를 놓쳤는지 차분히 확인해 보세요.";

  return (
    <section className="theme-card rounded-[1.75rem] px-6 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-[var(--app-text)]">
              해설
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                isCorrect
                  ? "bg-tide/15 text-tide"
                  : "bg-coral/12 text-coral"
              }`}
            >
              {resultLabel}
            </span>
          </div>
          <p className="mt-3 text-base font-medium leading-7 text-[var(--app-text)]">
            {feedbackTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            {feedbackDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors"
        >
          {isOpen ? "해설 접기" : "해설 펼치기"}
        </button>
      </div>

      {isOpen ? (
        <div className="theme-subtle-surface mt-6 rounded-3xl px-5 py-5 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
            Explanation
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[color:var(--app-text-muted)] sm:text-base">
            {explanation}
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
          해설은 준비되어 있습니다. 필요할 때 펼쳐서 근거를 다시 확인해 보세요.
        </p>
      )}
    </section>
  );
}
