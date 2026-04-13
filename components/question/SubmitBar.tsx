type SubmitBarProps = Readonly<{
  canSubmit: boolean;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  onSubmit: () => void;
}>;

export function SubmitBar({
  canSubmit,
  isSubmitted,
  isCorrect,
  onSubmit
}: SubmitBarProps) {
  const statusText = isSubmitted
    ? isCorrect
      ? "정답입니다. 현재 문제의 선택이 제출되었습니다."
      : "오답입니다. 현재 문제의 선택이 제출되었습니다."
    : "보기 하나를 고른 뒤 제출하면 정답 여부를 바로 확인할 수 있습니다.";

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink">
            제출
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            {statusText}
          </p>
        </div>
        <button
          type="button"
          disabled={!canSubmit || isSubmitted}
          onClick={onSubmit}
          className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
            !canSubmit || isSubmitted
              ? "cursor-not-allowed bg-ink/10 text-ink/45"
              : "bg-ink text-white hover:bg-ink/90"
          }`}
        >
          {isSubmitted ? "제출 완료" : "정답 확인"}
        </button>
      </div>
    </section>
  );
}
