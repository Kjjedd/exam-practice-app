import type { ChoiceIndex, QuestionChoice } from "../../lib/types";

type ChoiceListProps = Readonly<{
  choices: readonly QuestionChoice[];
  selectedChoiceIndex: ChoiceIndex | null;
  submittedChoiceIndex: ChoiceIndex | null;
  correctChoiceIndex: ChoiceIndex | null;
  isSubmitted: boolean;
  onSelectChoice: (choiceIndex: ChoiceIndex) => void;
}>;

const choiceLabels = ["A", "B", "C", "D", "E", "F"] as const;

export function ChoiceList({
  choices,
  selectedChoiceIndex,
  submittedChoiceIndex,
  correctChoiceIndex,
  isSubmitted,
  onSelectChoice
}: ChoiceListProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-ink">
          보기 목록
        </h3>
        <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
          보기 하나를 선택하고 제출하면, 내가 고른 답과 실제 정답을 이 목록에서
          바로 구분해 볼 수 있습니다.
        </p>
      </div>
      <ol className="space-y-3">
        {choices.map((choice, index) => {
          const label = choiceLabels[index] ?? `${index + 1}`;
          const isSelected = selectedChoiceIndex === index;
          const isSubmittedChoice = submittedChoiceIndex === index;
          const isCorrectChoice = correctChoiceIndex === index;
          const isWrongSubmittedChoice = isSubmitted && isSubmittedChoice && !isCorrectChoice;

          let containerClassName =
            "border-ink/10 bg-mist hover:border-coral/30 hover:bg-white";
          let labelClassName = "bg-white text-ink";
          let statusClassName = "bg-white/80 text-ink/55";
          let statusText = isSelected ? "Selected" : "Choice";

          if (isSelected && !isSubmitted) {
            containerClassName = "border-coral/50 bg-coral/10 shadow-sm";
            labelClassName = "bg-coral text-white";
            statusClassName = "bg-white text-coral";
          }

          if (isSubmitted && isCorrectChoice) {
            containerClassName = "border-tide/45 bg-tide/15 shadow-sm";
            labelClassName = "bg-tide text-white";
            statusClassName = "bg-white text-tide";
            statusText = isSubmittedChoice ? "Correct" : "Answer";
          }

          if (isWrongSubmittedChoice) {
            containerClassName = "border-coral/50 bg-coral/10 shadow-sm";
            labelClassName = "bg-coral text-white";
            statusClassName = "bg-white text-coral";
            statusText = "Your Pick";
          }

          return (
            <li key={`${label}-${choice}`}>
              <button
                type="button"
                aria-pressed={isSelected}
                disabled={isSubmitted}
                onClick={() => onSelectChoice(index)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors disabled:cursor-not-allowed sm:px-5 ${containerClassName}`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${labelClassName}`}
                  >
                    {label}
                  </span>
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <p className="pt-1 text-sm leading-6 text-ink/85 sm:text-base">
                      {choice}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusClassName}`}
                    >
                      {statusText}
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
