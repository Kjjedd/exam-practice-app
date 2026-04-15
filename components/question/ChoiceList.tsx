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
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-ink">보기 목록</h3>
        <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
          {isExamMode
            ? isMultiAnswer
              ? `시험 모드입니다. 정답 ${requiredSelectionCount}개를 답안으로 저장할 수 있고, 채점은 마지막 결과 화면에서 확인합니다.`
              : "시험 모드에서는 보기를 클릭하면 답안만 저장되고, 채점은 마지막 결과 화면에서 확인합니다."
            : isMultiAnswer
              ? `복수정답 문제입니다. 정답 ${requiredSelectionCount}개를 모두 선택하면 자동으로 채점됩니다.`
              : "보기 하나를 클릭하면 즉시 정답 여부가 판정되며, 내가 고른 답과 실제 정답을 이 목록에서 바로 구분해 볼 수 있습니다."}
        </p>
      </div>
      <ol className="grid gap-4 lg:grid-cols-2">
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
          let hintText = isSelected
            ? "현재 선택된 보기입니다."
            : "아직 결과가 확정되지 않은 보기입니다.";

          if (isExamMode && isSelected) {
            containerClassName =
              "border-[#5f82ff] bg-[#edf2ff] shadow-sm ring-2 ring-[#cad7ff]";
            labelClassName = "bg-[#5f82ff] text-white";
            statusClassName = "bg-white text-[#4766d4]";
            statusText = "Saved";
            hintText = isMultiAnswer
              ? "시험 답안으로 저장한 선택지입니다."
              : "현재 선택한 답안입니다. 채점은 결과 화면에서 확인합니다.";
          }

          if (isSelected && !isSubmitted && !isExamMode) {
            containerClassName =
              "border-amber-400 bg-amber-50 shadow-sm ring-2 ring-amber-200/70";
            labelClassName = "bg-amber-500 text-white";
            statusClassName = "bg-white text-amber-700";
            statusText = "Selected";
            hintText = isMultiAnswer
              ? `선택 중인 보기입니다. 정답 ${requiredSelectionCount}개를 모두 고르면 자동 채점됩니다.`
              : "클릭한 선택지입니다. 아직 정답 판정 전 상태입니다.";
          }

          if (!isExamMode && isSubmitted && isCorrectChoice) {
            containerClassName =
              "border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200/80";
            labelClassName = "bg-emerald-600 text-white";
            statusClassName = "bg-white text-emerald-700";
            statusText = isAnsweredCorrectly ? "Correct" : "Answer";
            hintText = isAnsweredCorrectly
              ? "정답으로 맞힌 선택지입니다."
              : "이 보기가 실제 정답입니다.";
          }

          if (isWrongSubmittedChoice) {
            containerClassName =
              "border-rose-500 bg-rose-50 shadow-sm ring-2 ring-rose-200/80";
            labelClassName = "bg-rose-600 text-white";
            statusClassName = "bg-white text-rose-700";
            statusText = "Your Pick";
            hintText = "선택한 답이지만 오답입니다.";
          }

          return (
            <li key={`${label}-${choice}`}>
              <button
                type="button"
                aria-pressed={isSelected}
                disabled={isSubmitted && !isExamMode}
                onClick={() => onSelectChoice(index)}
                className={`h-full w-full rounded-2xl border px-4 py-5 text-left transition-colors disabled:cursor-not-allowed sm:px-5 sm:py-6 ${containerClassName}`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${labelClassName}`}
                  >
                    {label}
                  </span>
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="space-y-3 pt-1">
                        {choiceParagraphs.map((paragraph, paragraphIndex) => (
                          <p
                            key={`${label}-${paragraphIndex + 1}`}
                            className="whitespace-pre-wrap text-sm leading-7 text-ink/90 sm:text-[1rem] sm:leading-8"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      <p className="mt-2 text-xs font-medium leading-5 text-ink/60 sm:text-sm">
                        {hintText}
                      </p>
                    </div>
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
