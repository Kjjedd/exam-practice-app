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
    <section className="theme-card rounded-[1.5rem] px-3 py-3 sm:rounded-[1.75rem] sm:px-8 sm:py-8">
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
            "border-[color:var(--choice-default-border)] bg-[color:var(--choice-default-surface)] hover:border-[color:var(--choice-default-border-hover)] hover:bg-[color:var(--choice-default-surface-hover)]";
          let labelClassName =
            "bg-[color:var(--choice-label-surface)] text-[color:var(--choice-label-text)]";
          let statusClassName =
            "bg-[color:var(--choice-status-surface)] text-[color:var(--choice-status-text)]";
          let statusText = isSelected ? "Selected" : "Choice";
          let hintText = "";

          if (isExamMode && isSelected) {
            containerClassName =
              "border-[color:var(--choice-exam-border)] bg-[color:var(--choice-exam-surface)] shadow-sm ring-2 ring-[color:var(--choice-exam-ring)]";
            labelClassName =
              "bg-[color:var(--choice-exam-label)] text-[color:var(--app-surface-muted)]";
            statusClassName =
              "bg-[color:var(--choice-status-surface)] text-[color:var(--choice-exam-status)]";
            statusText = "Saved";
            hintText = isMultiAnswer
              ? "답안 저장"
              : "답안 선택";
          }

          if (isSelected && !isSubmitted && !isExamMode) {
            containerClassName =
              "border-[color:var(--choice-selected-border)] bg-[color:var(--choice-selected-surface)] shadow-sm ring-2 ring-[color:var(--choice-selected-ring)]";
            labelClassName =
              "bg-[color:var(--choice-selected-label)] text-[color:var(--app-surface-muted)]";
            statusClassName =
              "bg-[color:var(--choice-status-surface)] text-[color:var(--choice-selected-status)]";
            statusText = "Selected";
            hintText = isMultiAnswer
              ? `${requiredSelectionCount}개 선택`
              : "선택";
          }

          if (!isExamMode && isSubmitted && isCorrectChoice) {
            containerClassName =
              "border-[color:var(--choice-correct-border)] bg-[color:var(--choice-correct-surface)] shadow-sm ring-2 ring-[color:var(--choice-correct-ring)]";
            labelClassName =
              "bg-[color:var(--choice-correct-label)] text-[color:var(--app-surface-muted)]";
            statusClassName =
              "bg-[color:var(--choice-status-surface)] text-[color:var(--choice-correct-status)]";
            statusText = isAnsweredCorrectly ? "Correct" : "Answer";
            hintText = isAnsweredCorrectly
              ? "정답"
              : "정답 보기";
          }

          if (isWrongSubmittedChoice) {
            containerClassName =
              "border-[color:var(--choice-wrong-border)] bg-[color:var(--choice-wrong-surface)] shadow-sm ring-2 ring-[color:var(--choice-wrong-ring)]";
            labelClassName =
              "bg-[color:var(--choice-wrong-label)] text-[color:var(--app-surface-muted)]";
            statusClassName =
              "bg-[color:var(--choice-status-surface)] text-[color:var(--choice-wrong-status)]";
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
                            className="whitespace-pre-wrap text-[0.92rem] leading-5.5 text-[color:var(--app-text)] sm:text-[1rem] sm:leading-7"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      {hintText.length > 0 ? (
                        <p className="mt-1 hidden text-xs font-medium leading-5 text-[color:var(--app-text-faint)] sm:block">
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
