import { DEFAULT_QUESTION_SET_ID } from "../data/default-question-bank";
import type { QuestionSet, QuestionSetSummary } from "../types";

export function canUseExamModeForQuestionSet(
  questionSet: QuestionSet | QuestionSetSummary | null
): boolean {
  return questionSet?.id === DEFAULT_QUESTION_SET_ID;
}
