import type { ChoiceIndex, QuestionId } from "./question";

export type QuestionResult = Readonly<{
  questionId: QuestionId;
  selectedAnswers: readonly ChoiceIndex[];
  isCorrect: boolean;
  submittedAt: string;
}>;
