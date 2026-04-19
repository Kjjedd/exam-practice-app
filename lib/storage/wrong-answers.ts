import type { QuestionId, QuestionSetId, QuizSession } from "../types";
import { getWrongQuestionIds } from "../quiz/get-wrong-questions";
import {
  readStorageValue,
  removeStorageValue,
  writeStorageValue
} from "./storage-core";

const WRONG_QUESTION_IDS_STORAGE_KEY = "exammate.wrong-question-ids.v1";

type WrongQuestionStore = Readonly<{
  version: 1;
  wrongQuestionIdsByQuestionSetId: Readonly<Record<QuestionSetId, readonly QuestionId[]>>;
}>;

function validateWrongQuestionIds(
  wrongQuestionIds: readonly QuestionId[]
): readonly QuestionId[] {
  const normalizedWrongQuestionIds = wrongQuestionIds.filter(
    (questionId): questionId is QuestionId => typeof questionId === "string"
  );

  return Array.from(new Set(normalizedWrongQuestionIds));
}

function validateWrongQuestionIdsByQuestionSetId(
  wrongQuestionIdsByQuestionSetId: Readonly<Record<string, readonly QuestionId[]>>
): Readonly<Record<QuestionSetId, readonly QuestionId[]>> {
  const nextEntries = Object.entries(wrongQuestionIdsByQuestionSetId).flatMap(
    ([questionSetId, wrongQuestionIds]) => {
      if (typeof questionSetId !== "string" || questionSetId.length === 0) {
        return [];
      }

      const validatedWrongQuestionIds = Array.isArray(wrongQuestionIds)
        ? validateWrongQuestionIds(wrongQuestionIds)
        : [];

      return [
        [
          questionSetId as QuestionSetId,
          validatedWrongQuestionIds
        ] as const
      ];
    }
  );

  return Object.fromEntries(nextEntries);
}

function parseWrongQuestionStore(rawValue: string): WrongQuestionStore {
  const parsed = JSON.parse(rawValue) as Partial<{
    version: number;
    wrongQuestionIdsByQuestionSetId: Readonly<Record<string, readonly QuestionId[]>>;
  }>;

  const wrongQuestionIdsByQuestionSetId =
    parsed.version === 1 && parsed.wrongQuestionIdsByQuestionSetId !== undefined
      ? validateWrongQuestionIdsByQuestionSetId(parsed.wrongQuestionIdsByQuestionSetId)
      : {};

  return {
    version: 1,
    wrongQuestionIdsByQuestionSetId
  };
}

export function readWrongQuestionStore(): WrongQuestionStore {
  const rawValue = readStorageValue(WRONG_QUESTION_IDS_STORAGE_KEY);

  if (rawValue === null) {
    return {
      version: 1,
      wrongQuestionIdsByQuestionSetId: {}
    };
  }

  try {
    return parseWrongQuestionStore(rawValue);
  } catch {
    return {
      version: 1,
      wrongQuestionIdsByQuestionSetId: {}
    };
  }
}

function writeWrongQuestionStore(wrongQuestionStore: WrongQuestionStore): WrongQuestionStore {
  writeStorageValue(WRONG_QUESTION_IDS_STORAGE_KEY, JSON.stringify(wrongQuestionStore));

  return wrongQuestionStore;
}

export function hasStoredWrongQuestionIds(questionSetId: QuestionSetId): boolean {
  const wrongQuestionStore = readWrongQuestionStore();

  return questionSetId in wrongQuestionStore.wrongQuestionIdsByQuestionSetId;
}

export function readWrongQuestionIds(questionSetId: QuestionSetId): readonly QuestionId[] {
  const wrongQuestionStore = readWrongQuestionStore();

  return wrongQuestionStore.wrongQuestionIdsByQuestionSetId[questionSetId] ?? [];
}

export function writeWrongQuestionIds(
  questionSetId: QuestionSetId,
  wrongQuestionIds: readonly QuestionId[]
): readonly QuestionId[] {
  const validatedWrongQuestionIds = validateWrongQuestionIds(wrongQuestionIds);
  const wrongQuestionStore = readWrongQuestionStore();
  const nextWrongQuestionIdsByQuestionSetId = {
    ...wrongQuestionStore.wrongQuestionIdsByQuestionSetId,
    [questionSetId]: validatedWrongQuestionIds
  };

  writeWrongQuestionStore({
    version: 1,
    wrongQuestionIdsByQuestionSetId: nextWrongQuestionIdsByQuestionSetId
  });

  return validatedWrongQuestionIds;
}

export function syncWrongQuestionIdsFromQuizSession(
  quizSession: QuizSession
): readonly QuestionId[] {
  return writeWrongQuestionIds(
    quizSession.questionSetId,
    getWrongQuestionIds(quizSession)
  );
}

export function removeWrongQuestionId(
  questionSetId: QuestionSetId,
  questionId: QuestionId
): readonly QuestionId[] {
  const wrongQuestionIds = readWrongQuestionIds(questionSetId);
  const nextWrongQuestionIds = wrongQuestionIds.filter(
    (wrongQuestionId) => wrongQuestionId !== questionId
  );

  return writeWrongQuestionIds(questionSetId, nextWrongQuestionIds);
}

export function clearWrongQuestionIds(
  questionSetId?: QuestionSetId
): readonly QuestionId[] {
  if (questionSetId === undefined) {
    removeStorageValue(WRONG_QUESTION_IDS_STORAGE_KEY);

    return [];
  }

  const wrongQuestionStore = readWrongQuestionStore();
  const nextWrongQuestionIdsByQuestionSetId = {
    ...wrongQuestionStore.wrongQuestionIdsByQuestionSetId
  };

  delete nextWrongQuestionIdsByQuestionSetId[questionSetId];

  writeWrongQuestionStore({
    version: 1,
    wrongQuestionIdsByQuestionSetId: nextWrongQuestionIdsByQuestionSetId
  });

  return [];
}
