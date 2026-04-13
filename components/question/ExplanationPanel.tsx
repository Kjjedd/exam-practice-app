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
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-ink">
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
          <p className="mt-3 text-base font-medium leading-7 text-ink">
            {feedbackTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            {feedbackDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-mist"
        >
          {isOpen ? "해설 접기" : "해설 펼치기"}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-6 rounded-3xl bg-mist px-5 py-5 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/55">
            Explanation
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink/80 sm:text-base">
            {explanation}
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm leading-6 text-ink/65 sm:text-base">
          해설은 준비되어 있습니다. 필요할 때 펼쳐서 근거를 다시 확인해 보세요.
        </p>
      )}
    </section>
  );
}
