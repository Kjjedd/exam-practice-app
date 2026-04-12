import type { ChoiceIndex, QuestionId } from "./question";

export type QuestionResult = Readonly<{
  questionId: QuestionId;
  selectedAnswer: ChoiceIndex;
  isCorrect: boolean;
  submittedAt: string;
}>;
