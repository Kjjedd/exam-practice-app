import type { QuizSession } from "../types";
import {
  parseStoredQuizSession,
  validateQuizSession
} from "./quiz-session-model";
import {
  readStorageValue,
  removeStorageValue,
  writeStorageValue
} from "../storage/storage-core";

const QUIZ_SESSION_STORAGE_KEY = "exammate.latest-quiz-session.v1";

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
