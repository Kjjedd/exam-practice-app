import type { QuestionId, QuestionSetId } from "../types";
import {
  readStorageValue,
  removeStorageValue,
  writeStorageValue
} from "./storage-core";

const FAVORITE_QUESTION_IDS_STORAGE_KEY = "exammate.favorite-question-ids.v2";
const LEGACY_FAVORITE_QUESTION_IDS_STORAGE_KEY = "exammate.favorite-question-ids.v1";

type FavoriteQuestionStore = Readonly<{
  version: 2;
  favoritesByQuestionSetId: Readonly<Record<QuestionSetId, readonly QuestionId[]>>;
}>;

function validateFavoriteQuestionIds(
  favoriteQuestionIds: readonly QuestionId[]
): readonly QuestionId[] {
  const normalizedFavoriteQuestionIds = favoriteQuestionIds.filter(
    (questionId): questionId is QuestionId => typeof questionId === "string"
  );

  return Array.from(new Set(normalizedFavoriteQuestionIds));
}

function validateFavoritesByQuestionSetId(
  favoritesByQuestionSetId: Readonly<Record<string, readonly QuestionId[]>>
): Readonly<Record<QuestionSetId, readonly QuestionId[]>> {
  const nextEntries = Object.entries(favoritesByQuestionSetId).flatMap(
    ([questionSetId, favoriteQuestionIds]) => {
      if (typeof questionSetId !== "string" || questionSetId.length === 0) {
        return [];
      }

      const validatedFavoriteQuestionIds = Array.isArray(favoriteQuestionIds)
        ? validateFavoriteQuestionIds(favoriteQuestionIds)
        : [];

      return [
        [
          questionSetId as QuestionSetId,
          validatedFavoriteQuestionIds
        ] as const
      ];
    }
  );

  return Object.fromEntries(nextEntries);
}

function parseFavoriteQuestionStore(rawValue: string): FavoriteQuestionStore {
  const parsed = JSON.parse(rawValue) as Partial<{
    version: number;
    favoritesByQuestionSetId: Readonly<Record<string, readonly QuestionId[]>>;
  }>;

  const favoritesByQuestionSetId =
    parsed.version === 2 && parsed.favoritesByQuestionSetId !== undefined
      ? validateFavoritesByQuestionSetId(parsed.favoritesByQuestionSetId)
      : {};

  return {
    version: 2,
    favoritesByQuestionSetId
  };
}

export function readFavoriteQuestionStore(): FavoriteQuestionStore {
  const rawValue = readStorageValue(FAVORITE_QUESTION_IDS_STORAGE_KEY);

  if (rawValue === null) {
    return {
      version: 2,
      favoritesByQuestionSetId: {}
    };
  }

  try {
    return parseFavoriteQuestionStore(rawValue);
  } catch {
    return {
      version: 2,
      favoritesByQuestionSetId: {}
    };
  }
}

function writeFavoriteQuestionStore(
  favoriteQuestionStore: FavoriteQuestionStore
): FavoriteQuestionStore {
  removeStorageValue(LEGACY_FAVORITE_QUESTION_IDS_STORAGE_KEY);
  writeStorageValue(
    FAVORITE_QUESTION_IDS_STORAGE_KEY,
    JSON.stringify(favoriteQuestionStore)
  );

  return favoriteQuestionStore;
}

export function readFavoriteQuestionIds(
  questionSetId: QuestionSetId
): readonly QuestionId[] {
  const favoriteQuestionStore = readFavoriteQuestionStore();

  return favoriteQuestionStore.favoritesByQuestionSetId[questionSetId] ?? [];
}

export function writeFavoriteQuestionIds(
  questionSetId: QuestionSetId,
  favoriteQuestionIds: readonly QuestionId[]
): readonly QuestionId[] {
  const validatedFavoriteQuestionIds = validateFavoriteQuestionIds(favoriteQuestionIds);
  const favoriteQuestionStore = readFavoriteQuestionStore();
  const nextFavoritesByQuestionSetId = {
    ...favoriteQuestionStore.favoritesByQuestionSetId,
    [questionSetId]: validatedFavoriteQuestionIds
  };

  writeFavoriteQuestionStore({
    version: 2,
    favoritesByQuestionSetId: nextFavoritesByQuestionSetId
  });

  return validatedFavoriteQuestionIds;
}

export function removeFavoriteQuestionId(
  questionSetId: QuestionSetId,
  questionId: QuestionId
): readonly QuestionId[] {
  const favoriteQuestionIds = readFavoriteQuestionIds(questionSetId);
  const nextFavoriteQuestionIds = favoriteQuestionIds.filter(
    (favoriteQuestionId) => favoriteQuestionId !== questionId
  );

  return writeFavoriteQuestionIds(questionSetId, nextFavoriteQuestionIds);
}

export function clearFavoriteQuestionIds(
  questionSetId?: QuestionSetId
): readonly QuestionId[] {
  if (questionSetId === undefined) {
    removeStorageValue(FAVORITE_QUESTION_IDS_STORAGE_KEY);
    removeStorageValue(LEGACY_FAVORITE_QUESTION_IDS_STORAGE_KEY);

    return [];
  }

  const favoriteQuestionStore = readFavoriteQuestionStore();
  const nextFavoritesByQuestionSetId = {
    ...favoriteQuestionStore.favoritesByQuestionSetId
  };

  delete nextFavoritesByQuestionSetId[questionSetId];

  writeFavoriteQuestionStore({
    version: 2,
    favoritesByQuestionSetId: nextFavoritesByQuestionSetId
  });

  return [];
}

export function isFavoriteQuestion(
  favoriteQuestionIds: readonly QuestionId[],
  questionId: QuestionId
): boolean {
  return favoriteQuestionIds.includes(questionId);
}

export function toggleFavoriteQuestionId(
  questionSetId: QuestionSetId,
  questionId: QuestionId
): readonly QuestionId[] {
  const favoriteQuestionIds = readFavoriteQuestionIds(questionSetId);
  const nextFavoriteQuestionIds = favoriteQuestionIds.includes(questionId)
    ? favoriteQuestionIds.filter((favoriteQuestionId) => favoriteQuestionId !== questionId)
    : [...favoriteQuestionIds, questionId];

  return writeFavoriteQuestionIds(questionSetId, nextFavoriteQuestionIds);
}
