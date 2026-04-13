import type { ChoiceIndex, Question } from "../types";

export function checkAnswer(
  question: Question,
  selectedChoiceIndex: ChoiceIndex
): boolean {
  return question.answer === selectedChoiceIndex;
}
