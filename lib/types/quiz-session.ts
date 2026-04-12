import type { QuestionId } from "./question";
import type { QuestionResult } from "./question-result";
import type { QuizMode } from "./quiz-mode";

export type QuizSession = Readonly<{
  mode: QuizMode;
  questionIds: readonly QuestionId[];
  currentQuestionIndex: number;
  results: readonly QuestionResult[];
  startedAt: string;
  completedAt: string | null;
}>;
