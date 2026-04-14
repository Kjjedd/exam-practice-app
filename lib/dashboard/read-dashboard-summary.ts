import {
  hasCompleteQuizSession,
  readLatestQuizSession
} from "../quiz/session-storage";
import { readStoredStudyProgressSummary } from "../storage";
import type { QuizMode, StudyStats } from "../types";

export type DashboardSummary = Readonly<{
  stats: StudyStats;
  questionSetCount: number;
  hasActiveQuestionSet: boolean;
  latestMode: QuizMode | null;
  latestModeLabel: string | null;
  latestQuestionSetTitle: string | null;
  hasLatestQuizSession: boolean;
  hasCompletedLatestQuizSession: boolean;
}>;

const EMPTY_STUDY_STATS: StudyStats = {
  totalSolved: 0,
  correctCount: 0,
  wrongCount: 0,
  correctRate: 0,
  favoriteCount: 0,
  lastStudiedAt: null
};

function getModeLabel(mode: QuizMode): string {
  if (mode === "random") {
    return "Random Mode";
  }

  if (mode === "exam") {
    return "Exam Mode";
  }

  if (mode === "review") {
    return "Review Mode";
  }

  return "Normal Mode";
}

export function readDashboardSummary(): DashboardSummary {
  const storedStudyProgressSummary = readStoredStudyProgressSummary();
  const latestQuizSession = readLatestQuizSession();
  const latestStudiedAt =
    latestQuizSession === null ? null : latestQuizSession.startedAt;
  const latestMode = latestQuizSession === null ? null : latestQuizSession.mode;
  const latestModeLabel =
    latestQuizSession === null ? null : getModeLabel(latestQuizSession.mode);
  const latestQuestionSetTitle =
    latestQuizSession === null ? null : latestQuizSession.questionSetTitle;

  if (!hasCompleteQuizSession(latestQuizSession)) {
    return {
      stats: {
        ...EMPTY_STUDY_STATS,
        favoriteCount: storedStudyProgressSummary.favoriteCount,
        lastStudiedAt: latestStudiedAt
      },
      questionSetCount: storedStudyProgressSummary.questionSetCount,
      hasActiveQuestionSet: storedStudyProgressSummary.activeQuestionSetId !== null,
      latestMode,
      latestModeLabel,
      latestQuestionSetTitle,
      hasLatestQuizSession: storedStudyProgressSummary.hasLatestQuizSession,
      hasCompletedLatestQuizSession:
        storedStudyProgressSummary.hasCompletedLatestQuizSession
    };
  }

  const totalSolved = latestQuizSession.questionIds.length;
  const correctCount = latestQuizSession.results.filter((result) => result.isCorrect).length;
  const wrongCount = Math.max(totalSolved - correctCount, 0);
  const correctRate =
    totalSolved === 0 ? 0 : Math.round((correctCount / totalSolved) * 100);

  return {
    stats: {
      totalSolved,
      correctCount,
      wrongCount,
      correctRate,
      favoriteCount: storedStudyProgressSummary.favoriteCount,
      lastStudiedAt: latestQuizSession.completedAt ?? latestQuizSession.startedAt
    },
    questionSetCount: storedStudyProgressSummary.questionSetCount,
    hasActiveQuestionSet: storedStudyProgressSummary.activeQuestionSetId !== null,
    latestMode: latestQuizSession.mode,
    latestModeLabel: getModeLabel(latestQuizSession.mode),
    latestQuestionSetTitle: latestQuizSession.questionSetTitle,
    hasLatestQuizSession: storedStudyProgressSummary.hasLatestQuizSession,
    hasCompletedLatestQuizSession:
      storedStudyProgressSummary.hasCompletedLatestQuizSession
  };
}
