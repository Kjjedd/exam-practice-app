import type { QuestionChoice } from "../../lib/types";

type ChoiceListProps = Readonly<{
  choices: readonly QuestionChoice[];
}>;

const choiceLabels = ["A", "B", "C", "D", "E", "F"] as const;

export function ChoiceList({ choices }: ChoiceListProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-ink">
          보기 목록
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
          아직 선택 로직은 없지만, 이후 단계에서 선택 상태를 얹을 수 있도록 현재
          활성 문제의 보기 구조를 먼저 안정적으로 표시합니다.
        </p>
      </div>
      <ol className="space-y-3">
        {choices.map((choice, index) => {
          const label = choiceLabels[index] ?? `${index + 1}`;

          return (
            <li
              key={`${label}-${choice}`}
              className="rounded-2xl border border-ink/10 bg-mist px-4 py-4 sm:px-5"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-ink shadow-sm">
                  {label}
                </span>
                <p className="pt-1 text-sm leading-6 text-ink/85 sm:text-base">
                  {choice}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
