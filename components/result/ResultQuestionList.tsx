import type { ResultListItem } from "../../lib/quiz/summarize-results";

type ResultQuestionListProps = Readonly<{
  items: readonly ResultListItem[];
}>;

export function ResultQuestionList({ items }: ResultQuestionListProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          문제별 결과
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
          각 문제의 정답 여부를 빠르게 확인하고, 다음 단계에서 오답 복습으로
          이어질 수 있도록 상태를 정리합니다.
        </p>
      </div>
      <ol className="space-y-3">
        {items.map((item) => (
          <li
            key={item.questionId}
            className="rounded-3xl border border-ink/10 bg-mist px-5 py-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                  Question {item.questionNumber}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/85 sm:text-base">
                  {item.questionText}
                </p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                  item.isCorrect
                    ? "bg-tide/12 text-tide"
                    : "bg-coral/12 text-coral"
                }`}
              >
                {item.isCorrect ? "Correct" : "Wrong"}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
