import type { InProgressQuizSession, QuizSession } from "../types";
import {
  parseStoredInProgressQuizSessions,
  parseStoredInProgressQuizSession,
  parseStoredQuizSession,
  validateInProgressQuizSession,
  validateQuizSession
} from "./quiz-session-model";
import {
  readStorageValue,
  removeStorageValue,
  writeStorageValue
} from "../storage/storage-core";

const QUIZ_SESSION_STORAGE_KEY = "exammate.latest-quiz-session.v1";
const IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY = "exammate.in-progress-quiz-session.v1";

type InProgressQuizSessionMatcher = Readonly<{
  mode: InProgressQuizSession["mode"];
  questionSetId: InProgressQuizSession["questionSetId"];
  questionRangeStart: InProgressQuizSession["questionRangeStart"];
  questionRangeEnd: InProgressQuizSession["questionRangeEnd"];
  examTemplateId: InProgressQuizSession["examTemplateId"];
}>;

function matchesInProgressQuizSession(
  quizSession: InProgressQuizSession,
  matcher: InProgressQuizSessionMatcher
): boolean {
  return (
    quizSession.mode === matcher.mode &&
    quizSession.questionSetId === matcher.questionSetId &&
    quizSession.questionRangeStart === matcher.questionRangeStart &&
    quizSession.questionRangeEnd === matcher.questionRangeEnd &&
    quizSession.examTemplateId === matcher.examTemplateId
  );
}

export function readLatestQuizSession(): QuizSession | null {
  const rawValue = readStorageValue(QUIZ_SESSION_STORAGE_KEY);

  if (rawValue === null) {
    return null;
  }

  try {
    return parseStoredQuizSession(rawValue);
  } catch {
    return null;
  }
}

export function writeLatestQuizSession(quizSession: QuizSession): QuizSession {
  const validatedQuizSession = validateQuizSession(quizSession);
  writeStorageValue(QUIZ_SESSION_STORAGE_KEY, JSON.stringify(validatedQuizSession));

  return validatedQuizSession;
}

export function clearLatestQuizSession(): void {
  removeStorageValue(QUIZ_SESSION_STORAGE_KEY);
}

export function readInProgressQuizSession(): InProgressQuizSession | null {
  const quizSessions = readInProgressQuizSessions();

  return quizSessions.length > 0 ? quizSessions[0] : null;
}

export function readInProgressQuizSessions(): readonly InProgressQuizSession[] {
  const rawValue = readStorageValue(IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY);

  if (rawValue === null) {
    return [];
  }

  try {
    return parseStoredInProgressQuizSessions(rawValue);
  } catch {
    return [];
  }
}

export function findInProgressQuizSession(
  matcher: InProgressQuizSessionMatcher
): InProgressQuizSession | null {
  return (
    readInProgressQuizSessions().find((quizSession) =>
      matchesInProgressQuizSession(quizSession, matcher)
    ) ?? null
  );
}

export function writeInProgressQuizSession(
  quizSession: InProgressQuizSession
): InProgressQuizSession {
  const validatedQuizSession = validateInProgressQuizSession(quizSession);
  const currentQuizSessions = readInProgressQuizSessions();
  const nextQuizSessions = [
    validatedQuizSession,
    ...currentQuizSessions.filter(
      (currentQuizSession) =>
        !matchesInProgressQuizSession(currentQuizSession, {
          mode: validatedQuizSession.mode,
          questionSetId: validatedQuizSession.questionSetId,
          questionRangeStart: validatedQuizSession.questionRangeStart,
          questionRangeEnd: validatedQuizSession.questionRangeEnd,
          examTemplateId: validatedQuizSession.examTemplateId
        })
    )
  ];

  writeStorageValue(
    IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY,
    JSON.stringify(nextQuizSessions)
  );

  return validatedQuizSession;
}

export function clearInProgressQuizSession(
  matcher?: InProgressQuizSessionMatcher
): void {
  if (matcher === undefined) {
    removeStorageValue(IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY);
    return;
  }

  const currentQuizSessions = readInProgressQuizSessions();
  const nextQuizSessions = currentQuizSessions.filter(
    (quizSession) => !matchesInProgressQuizSession(quizSession, matcher)
  );

  if (nextQuizSessions.length === 0) {
    removeStorageValue(IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY);
    return;
  }

  writeStorageValue(
    IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY,
    JSON.stringify(nextQuizSessions)
  );
}

export function clearAllInProgressQuizSessions(): void {
  removeStorageValue(IN_PROGRESS_QUIZ_SESSION_STORAGE_KEY);
}
