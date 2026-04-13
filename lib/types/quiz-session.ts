import type { QuestionId } from "./question";
import type { QuestionResult } from "./question-result";
import type { QuizMode } from "./quiz-mode";
import type { QuestionSetId } from "./question-set";

export type QuizSession = Readonly<{
  mode: QuizMode;
  questionSetId: QuestionSetId;
  questionSetTitle: string;
  questionIds: readonly QuestionId[];
  currentQuestionIndex: number;
  results: readonly QuestionResult[];
  startedAt: string;
  completedAt: string | null;
}>;
