import type { QuestionId } from "../types";

export function shuffleQuestionIds(questionIds: readonly QuestionId[]): readonly QuestionId[] {
  const shuffledQuestionIds = [...questionIds];

  for (let index = shuffledQuestionIds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentValue = shuffledQuestionIds[index];

    shuffledQuestionIds[index] = shuffledQuestionIds[randomIndex];
    shuffledQuestionIds[randomIndex] = currentValue;
  }

  return shuffledQuestionIds;
}
