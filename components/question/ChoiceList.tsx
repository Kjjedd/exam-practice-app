import type { ChoiceIndex, QuestionChoice } from "../../lib/types";

type ChoiceListProps = Readonly<{
  choices: readonly QuestionChoice[];
  selectedChoiceIndex: ChoiceIndex | null;
  onSelectChoice: (choiceIndex: ChoiceIndex) => void;
}>;

const choiceLabels = ["A", "B", "C", "D", "E", "F"] as const;

export function ChoiceList({
  choices,
  selectedChoiceIndex,
  onSelectChoice
}: ChoiceListProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-ink">
          보기 목록
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
          보기 하나를 선택할 수 있으며, 제출 전까지는 다른 보기로 자유롭게 바꿀 수
          있습니다.
        </p>
      </div>
      <ol className="space-y-3">
        {choices.map((choice, index) => {
          const label = choiceLabels[index] ?? `${index + 1}`;
          const isSelected = selectedChoiceIndex === index;

          return (
            <li key={`${label}-${choice}`}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectChoice(index)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors sm:px-5 ${
                  isSelected
                    ? "border-coral/50 bg-coral/10 shadow-sm"
                    : "border-ink/10 bg-mist hover:border-coral/30 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${
                      isSelected
                        ? "bg-coral text-white"
                        : "bg-white text-ink"
                    }`}
                  >
                    {label}
                  </span>
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <p className="pt-1 text-sm leading-6 text-ink/85 sm:text-base">
                      {choice}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        isSelected
                          ? "bg-white text-coral"
                          : "bg-white/80 text-ink/55"
                      }`}
                    >
                      {isSelected ? "Selected" : "Choice"}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
