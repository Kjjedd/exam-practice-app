import type { ChoiceIndex, QuestionChoice } from "../../lib/types";

type ChoiceListProps = Readonly<{
  choices: readonly QuestionChoice[];
  selectedChoiceIndexes: readonly ChoiceIndex[];
  submittedChoiceIndexes: readonly ChoiceIndex[];
  correctChoiceIndexes: readonly ChoiceIndex[];
  requiredSelectionCount: number;
  isSubmitted: boolean;
  isExamMode?: boolean;
  onSelectChoice: (choiceIndex: ChoiceIndex) => void;
}>;

const choiceLabels = ["A", "B", "C", "D", "E", "F"] as const;

function getChoiceParagraphs(content: string): readonly string[] {
  return content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function includesChoice(
  choiceIndexes: readonly ChoiceIndex[],
  index: ChoiceIndex
): boolean {
  return choiceIndexes.includes(index);
}

export function ChoiceList({
  choices,
  selectedChoiceIndexes,
  submittedChoiceIndexes,
  correctChoiceIndexes,
  requiredSelectionCount,
  isSubmitted,
  isExamMode = false,
  onSelectChoice
}: ChoiceListProps) {
  const isMultiAnswer = requiredSelectionCount > 1;

  return (
    <section className="rounded-[1.5rem] border border-ink/10 bg-white px-3 py-3 shadow-sm sm:rounded-[1.75rem] sm:px-8 sm:py-8">
      <ol className="grid gap-2 sm:gap-3 lg:grid-cols-2 lg:gap-4">
        {choices.map((choice, index) => {
          const choiceParagraphs = getChoiceParagraphs(choice);
          const label = choiceLabels[index] ?? `${index + 1}`;
          const isSelected = includesChoice(selectedChoiceIndexes, index);
          const isSubmittedChoice = includesChoice(submittedChoiceIndexes, index);
          const isCorrectChoice = includesChoice(correctChoiceIndexes, index);
          const isWrongSubmittedChoice =
            !isExamMode && isSubmitted && isSubmittedChoice && !isCorrectChoice;
          const isAnsweredCorrectly =
            !isExamMode && isSubmitted && isSubmittedChoice && isCorrectChoice;

          let containerClassName =
            "border-ink/10 bg-mist hover:border-coral/30 hover:bg-white";
          let labelClassName = "bg-white text-ink";
          let statusClassName = "bg-white/80 text-ink/55";
          let statusText = isSelected ? "Selected" : "Choice";
          let hintText = "";

          if (isExamMode && isSelected) {
            containerClassName =
              "border-[#5f82ff] bg-[#edf2ff] shadow-sm ring-2 ring-[#cad7ff]";
            labelClassName = "bg-[#5f82ff] text-white";
            statusClassName = "bg-white text-[#4766d4]";
            statusText = "Saved";
            hintText = isMultiAnswer
              ? "답안 저장"
              : "답안 선택";
          }

          if (isSelected && !isSubmitted && !isExamMode) {
            containerClassName =
              "border-amber-400 bg-amber-50 shadow-sm ring-2 ring-amber-200/70";
            labelClassName = "bg-amber-500 text-white";
            statusClassName = "bg-white text-amber-700";
            statusText = "Selected";
            hintText = isMultiAnswer
              ? `${requiredSelectionCount}개 선택`
              : "선택";
          }

          if (!isExamMode && isSubmitted && isCorrectChoice) {
            containerClassName =
              "border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200/80";
            labelClassName = "bg-emerald-600 text-white";
            statusClassName = "bg-white text-emerald-700";
            statusText = isAnsweredCorrectly ? "Correct" : "Answer";
            hintText = isAnsweredCorrectly
              ? "정답"
              : "정답 보기";
          }

          if (isWrongSubmittedChoice) {
            containerClassName =
              "border-rose-500 bg-rose-50 shadow-sm ring-2 ring-rose-200/80";
            labelClassName = "bg-rose-600 text-white";
            statusClassName = "bg-white text-rose-700";
            statusText = "Your Pick";
            hintText = "오답";
          }

          return (
            <li key={`${label}-${choice}`}>
              <button
                type="button"
                aria-pressed={isSelected}
                disabled={isSubmitted && !isExamMode}
                onClick={() => onSelectChoice(index)}
                className={`h-full w-full rounded-2xl border px-3 py-3.5 text-left transition-colors disabled:cursor-not-allowed sm:px-5 sm:py-5 ${containerClassName}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm sm:h-9 sm:w-9 sm:text-sm ${labelClassName}`}
                  >
                    {label}
                  </span>
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="space-y-1.5 pt-0.5 sm:space-y-2.5 sm:pt-1">
                        {choiceParagraphs.map((paragraph, paragraphIndex) => (
                          <p
                            key={`${label}-${paragraphIndex + 1}`}
                            className="whitespace-pre-wrap text-[0.92rem] leading-5.5 text-ink/90 sm:text-[1rem] sm:leading-7"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      {hintText.length > 0 ? (
                        <p className="mt-1 hidden text-xs font-medium leading-5 text-ink/60 sm:block">
                          {hintText}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] sm:px-3 sm:text-xs ${statusClassName}`}
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
