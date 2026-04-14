import { clearLatestQuizSession, readLatestQuizSession } from "../quiz/session-storage";
import { hasCompleteQuizSession } from "../quiz/quiz-session-model";
import type { QuestionSetId } from "../types";
import { clearFavoriteQuestionIds, readFavoriteQuestionIds } from "./favorites";
import { clearQuestionBank, readQuestionBank } from "./question-bank";

export type StoredStudyProgressSummary = Readonly<{
  activeQuestionSetId: QuestionSetId | null;
  questionSetCount: number;
  favoriteCount: number;
  hasLatestQuizSession: boolean;
  hasCompletedLatestQuizSession: boolean;
}>;

export function readStoredStudyProgressSummary(): StoredStudyProgressSummary {
  const questionBank = readQuestionBank();
  const latestQuizSession = readLatestQuizSession();
  const favoriteQuestionIds = readFavoriteQuestionIds();

  return {
    activeQuestionSetId: questionBank.activeQuestionSetId,
    questionSetCount: questionBank.questionSets.length,
    favoriteCount: favoriteQuestionIds.length,
    hasLatestQuizSession: latestQuizSession !== null,
    hasCompletedLatestQuizSession: hasCompleteQuizSession(latestQuizSession)
  };
}

export function clearStoredStudyProgress(): StoredStudyProgressSummary {
  clearQuestionBank();
  clearLatestQuizSession();
  clearFavoriteQuestionIds();

  return readStoredStudyProgressSummary();
}
