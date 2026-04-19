import { clearLatestQuizSession, readLatestQuizSession } from "../quiz/session-storage";
import { hasCompleteQuizSession } from "../quiz/quiz-session-model";
import type { QuestionSetId } from "../types";
import {
  clearFavoriteQuestionIds,
  readFavoriteQuestionStore
} from "./favorites";
import { clearQuestionBank, readQuestionBank } from "./question-bank";
import { clearWrongQuestionIds } from "./wrong-answers";

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
  const favoriteQuestionStore = readFavoriteQuestionStore();
  const favoriteCount = Object.values(
    favoriteQuestionStore.favoritesByQuestionSetId
  ).reduce((totalCount, favoriteQuestionIds) => totalCount + favoriteQuestionIds.length, 0);

  return {
    activeQuestionSetId: questionBank.activeQuestionSetId,
    questionSetCount: questionBank.questionSets.length,
    favoriteCount,
    hasLatestQuizSession: latestQuizSession !== null,
    hasCompletedLatestQuizSession: hasCompleteQuizSession(latestQuizSession)
  };
}

export function clearStoredStudyProgress(): StoredStudyProgressSummary {
  clearQuestionBank();
  clearLatestQuizSession();
  clearFavoriteQuestionIds();
  clearWrongQuestionIds();

  return readStoredStudyProgressSummary();
}
