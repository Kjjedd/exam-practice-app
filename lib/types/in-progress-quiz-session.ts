import type { QuestionId } from "./question";
import type { QuestionResult } from "./question-result";
import type { QuizMode } from "./quiz-mode";
import type { QuestionSetId } from "./question-set";
import type { ExamTemplateId } from "./exam-template";

export type InProgressQuizSession = Readonly<{
  mode: QuizMode;
  questionSetId: QuestionSetId;
  questionSetTitle: string;
  examTemplateId: ExamTemplateId | null;
  examTemplateTitle: string | null;
  questionIds: readonly QuestionId[];
  currentQuestionIndex: number;
  results: readonly QuestionResult[];
  startedAt: string;
  savedAt: string;
}>;
