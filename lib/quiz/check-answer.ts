import type { ChoiceIndex, Question } from "../types";

export function checkAnswer(
  question: Question,
  selectedChoiceIndexes: readonly ChoiceIndex[]
): boolean {
  if (selectedChoiceIndexes.length !== question.answers.length) {
    return false;
  }

  const selectedAnswerSet = new Set(selectedChoiceIndexes);

  if (selectedAnswerSet.size !== selectedChoiceIndexes.length) {
    return false;
  }

  return question.answers.every((answerIndex) => selectedAnswerSet.has(answerIndex));
}
